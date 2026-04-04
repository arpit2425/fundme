import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionSignature } from "@solana/web3.js";
import { Fundus } from "anchor/target/types/fundus";
import idl from "anchor/target/idl/fundus.json";
import { BN } from "bn.js";
import { toast } from "react-toastify";
import { Campaign } from "@/utils/interfaces";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";


let tx:any;
const getClusterUrl=(cluster:string)=>{
    const clusterUrls: any = {
        'mainnet-beta': 'https://api.mainnet-beta.solana.com',
        testnet: 'https://api.testnet.solana.com',
        devnet: 'https://api.devnet.solana.com',
        localhost: 'http://localhost:8899',
      }
      return clusterUrls[cluster]

}
let cluster:string=process.env.NEXT_PUBLIC_CLUSTER || "localhost";
let clusterUrl=getClusterUrl(cluster);

export const getProvider=(sendTransaction:any,publicKey:any,signTransaction:any):Program<Fundus> | null =>{
    if(!publicKey || !signTransaction){
        toast.warn("key missing")
        console.log("keys missing")
        return null;
    }
    const connection=new Connection(clusterUrl,"confirmed");
    const provider=new AnchorProvider(connection,
        {sendTransaction,publicKey,signTransaction} as unknown as Wallet,
        {
            commitment:"processed"
        }
    );
    console.log("provider",provider)
    return new Program(idl as any,provider)
}
export const getProviderReadOnly=():Program<Fundus>=>{
    const connection=new Connection(clusterUrl,"confirmed");
    const wallet={
        publicKey:PublicKey.default,
        signTransaction:async()=>{
            throw new Error("Read only provider can not sign")
        },
        signAllTransaction: async ()=>{
            throw new Error("Read only provider can not sign")
        }
    }
    const provider=new AnchorProvider(connection,
       wallet as unknown as Wallet,
        {
            commitment:"processed"
        }
    );
    return new Program(idl as any,provider)
}
export const createCampaign=async(program:Program<Fundus>,publicKey:PublicKey, title:string,
    description:string,
    image_url:string,
    goal:string,
):Promise<TransactionSignature>=>{
    console.log("program",program)
    const [programStatePda] = await PublicKey.findProgramAddress(
        [Buffer.from('program_state')],
        program.programId
      )
      const state = await program.account.programState.fetch(programStatePda)
    console.log(`state ${JSON.stringify(state)}`)
    const CID = state.campaignCount;

    const [campaignPda] = await PublicKey.findProgramAddress(
      [Buffer.from('campaign'), CID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )
    const goalBN=new BN(+goal*LAMPORTS_PER_SOL);
    const tx=await program.methods.createCampaign(title,description,image_url,goalBN).accountsPartial({
        programState:programStatePda,
        campaign:campaignPda,
        creator:publicKey,
        systemProgram:SystemProgram.programId
    }).rpc();
    const connection=new Connection(
        program.provider.connection.rpcEndpoint,
        "confirmed"
    );
    await connection.confirmTransaction(tx,"finalized");
    return tx;
}
export const fetchAllActiveCampaigns=async(program:Program<Fundus>):Promise<Campaign[]>=>{
    const campaigns=await program.account.campaign.all();
    const activeCamp=campaigns.filter(campaign=>campaign.account.active===true)
    console.log("active campaigns",activeCamp)

    return serializeCampaignData(activeCamp);

}
const serializeCampaignData=(campaigns:any)=>{
    const serializedCampaign:Campaign[]=campaigns.map((c:any)=>  {
        return {
            ...c.account,
            publicKey: c.publicKey.toBase58(),
            cid: c.account.cid.toNumber(),
            creator: c.account.creator.toBase58(),
            goal: c.account.goal.toNumber(),
            amountRaised: c.account.fundRaised.toNumber(),
            timestamp: c.account.timestamp.toNumber(),
            donars: c.account.donars.toNumber(),
            withdrawers: c.account.withdrawals.toNumber(),
            balance: c.account.balance.toNumber(),
        }


    });
    return serializedCampaign;

}
export const fetchCampaignDetails=async(program:Program<Fundus>,pda:string):Promise<Campaign>=>{
    const campaign=await program.account.campaign.fetch(pda);
   const serializedCamp:Campaign=  {
    ...campaign,
    publicKey:pda,
    cid: campaign.cid.toNumber(),
    creator: campaign.creator.toBase58(),
    goal: campaign.goal.toNumber(),
    amountRaised: campaign.fundRaised.toNumber(),
    timestamp: campaign.timestamp.toNumber(),
    donors: campaign.donars.toNumber(),
    withdrawals: campaign.withdrawals.toNumber(),
    balance: campaign.balance.toNumber(),
    title: campaign.title,
    description:campaign.description,
    imageUrl:campaign.imgUrl,

}
return serializedCamp;


}