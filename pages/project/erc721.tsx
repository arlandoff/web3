import React from 'react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import HeroCard from '../../components/hero-card';
import {
  useClaimedNFTSupply,
  useAddress,
  useContract,
  useContractMetadata,
  useOwnedNFTs,
  useTotalCount,
  Web3Button,
  ThirdwebNftMedia
} from '@thirdweb-dev/react';
import { ERC721_CONTRACT_ADDRESS } from '../../constants/addresses';

export default function ERC721Project() {
  const address = useAddress();

  const { contract } = useContract(ERC721_CONTRACT_ADDRESS, "signature-drop");

  const { data: contractMetadata, isLoading: contractMetadataIsLoading } = useContractMetadata(contract);

  const { data: totalSupply, isLoading: totalSupplyIsLoading } = useTotalCount(contract);

  const { data: totalClaimedSupply, isLoading: totalClaimedSupplyIsLoading } = useClaimedNFTSupply(contract);

  const { data: ownedNFTs, isLoading: ownedNFTsIsLoading } = useOwnedNFTs(contract, address);

  return (
    <div className={styles.container}>
      <div className={styles.contractPage}>
        <HeroCard
          isLoading={contractMetadataIsLoading}
          title={contractMetadata?.name}
          description={contractMetadata?.description}
          image={contractMetadata?.image}
        />
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Claim ERC721</h3>
            <p>Claim ERC721 NFT for FREE!</p>
            <Web3Button
              contractAddress={ERC721_CONTRACT_ADDRESS}
              action={(contract) => contract.erc721.claim(1)}
              onSuccess={() => alert("NFT Claimed!")}
            >
              Claim NFT
            </Web3Button>
          </div>
          <div className={styles.card}>
            <h3>Contract Stats</h3>
            <p>
              Total Supply:
              {totalSupplyIsLoading ? "Loading..." : ` ${totalSupply?.toNumber()}`}
            </p>
            <p>
              Total Claimed:
              {totalClaimedSupplyIsLoading ? "Loading..." : ` ${totalClaimedSupply?.toNumber()}`}
            </p>
          </div>
          <div className={styles.card}>
            <h3>Your NFTs</h3>
            <p>
              Total Owned:
              {ownedNFTsIsLoading ? "Loading..." : ` ${ownedNFTs?.length}`}
            </p>
          </div>
        </div>
        <div className={styles.container}>
          <h2>My NFTs:</h2>
          <div className={styles.grid} style={{justifyContent: "flex-start"}}>
            {ownedNFTsIsLoading ? (
              "Loading..."
            ) : (
              ownedNFTs?.map((nft) => (
                <div className={styles.card} key={nft.metadata.id}>
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                  />
                  <div className={styles.cardText}>
                    <h2>{nft.metadata.name}</h2>
                  </div>
                  <Link href={`/project/staking`}>
                    <button
                      className={styles.matchButton}
                      style={{ 
                        width: "100%", 
                        height: "50px",
                        borderRadius: "0px 0px 10px 10px",
                      }}
                    >Stake NFT</button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
