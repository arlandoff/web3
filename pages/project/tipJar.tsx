import HeroCard from '../../components/hero-card'
import { Web3Button, useAddress, useContract, useContractMetadata, useContractRead} from '@thirdweb-dev/react'
import styles from '../../styles/Home.module.css'
import { TIP_JAR_CONTRACT_ADDRESS } from '../../constants/addresses'
import { ethers } from 'ethers';

export default function TipJarProject() {
    const address = useAddress();
    const {
        contract
    } = useContract(TIP_JAR_CONTRACT_ADDRESS);

    const {
        data: contractMetadata,
        isLoading: contractMetadataIsLoading,
    } = useContractMetadata(contract);

    const {
        data: tipJarBalance,
        isLoading: tipJarBalanceIsLoading,
    } = useContractRead(contract,
         "getBalance",
    );

    const {
        data: owner,
        isLoading: ownerIsLoading,
    } = useContractRead(
        contract,
        "owner",
    );


    return (
        <div className={styles.container}>
            <div className={styles.contractPage}>
                <HeroCard
                    isLoading={contractMetadataIsLoading}
                    title={contractMetadata?.name!}
                    description={contractMetadata?.description!}
                    image={contractMetadata?.image!}
                />
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3>Leave a tip</h3>
                        <p>Tip in MATIC and record it on the blockchain.</p>
                        <Web3Button
                            contractAddress={TIP_JAR_CONTRACT_ADDRESS}
                            action={(contract) => contract.call(
                                "tip",
                                [],
                                {
                                    value: "100000000000000000"
                                }
                            )}
                        >{`Tip (0.1 MATIC)`}</Web3Button>
                    </div>
                    <div className={styles.card}>
                        <h3>Tip Jar balance</h3>
                        <p>Total tips: </p>
                        {tipJarBalanceIsLoading ? "Loading..." : `${ethers.utils.formatEther(tipJarBalance)} MATIC`}
                    </div>
                    <div className={styles.card}>
                        <h3>Withdraw balance</h3>
                        {ownerIsLoading ? "Loading..." : owner === address ? (
                        <Web3Button
                            contractAddress={TIP_JAR_CONTRACT_ADDRESS}
                            action={(contract) => contract.call(
                                "withdrawTips"
                            )}
                            onSuccess={() => alert("Tips withdrawn!")}
                        >Withdraw Balance</Web3Button>
                        ) : (
                            <p>Only the owner can withdraw the balance.</p>
                            )}
                    </div>

                </div>

            </div>
        </div>
    )
}