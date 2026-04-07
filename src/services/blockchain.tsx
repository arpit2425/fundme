import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionSignature } from "@solana/web3.js";
import { Fundus } from "anchor/target/types/fundus";
import idl from "anchor/target/idl/fundus.json";
import { BN } from "bn.js";
import { toast } from "react-toastify";
import { Campaign, ProgramState, Transaction } from "@/utils/interfaces";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { store } from "@/store";
import { globalAction } from "@/store/globalSlices";



let tx:any;
const {setCampaign, setDonations,setWithdrawals,setProgramState}=globalAction
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
export const fetchUserCampaigns=async(program:Program<Fundus>,publicKey:PublicKey):Promise<Campaign[]>=>{
    const campaigns=await program.account.campaign.all();
    const activeCamp=campaigns.filter(campaign=>campaign.account.creator.toBase58()== publicKey.toBase58())
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
            goal: c.account.goal.toNumber()/LAMPORTS_PER_SOL,
            amountRaised: c.account.fundRaised.toNumber()/LAMPORTS_PER_SOL,
            timestamp: c.account.timestamp.toNumber(),
            donars: c.account.donars.toNumber(),
            withdrawers: c.account.withdrawals.toNumber(),
            balance: c.account.balance.toNumber()/LAMPORTS_PER_SOL,
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
    goal: campaign.goal.toNumber()/LAMPORTS_PER_SOL,
    amountRaised: campaign.fundRaised.toNumber()/LAMPORTS_PER_SOL,
    timestamp: campaign.timestamp.toNumber(),
    donors: campaign.donars.toNumber(),
    withdrawals: campaign.withdrawals.toNumber(),
    balance: campaign.balance.toNumber()/LAMPORTS_PER_SOL,
    title: campaign.title,
    description:campaign.description,
    imgUrl:campaign.imgUrl,

}
store.dispatch(setCampaign(serializedCamp));
return serializedCamp;


}
export const donateToCampaign=async(program:Program<Fundus>,publicKey:PublicKey, pda:string,
    amount:string,
):Promise<TransactionSignature>=>{
    console.log("program",program)
    const [programStatePda] = await PublicKey.findProgramAddress(
        [Buffer.from('program_state')],
        program.programId
)
      const state = await program.account.programState.fetch(programStatePda)
    console.log(`state ${JSON.stringify(state)}`)
    const campaign=await program.account.campaign.fetch(pda);
    const [contributionPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('donar'),
          publicKey.toBuffer(), 
          campaign.cid.toArrayLike(Buffer, 'le', 8),
          campaign.donars.add(new BN(1)).toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )
    const amountBn = new BN(Math.round(+amount * LAMPORTS_PER_SOL));

    const tx = await program.methods
      .donate(campaign.cid, amountBn)
      .accountsPartial({
        transaction:contributionPda,
        campaign:pda,
        donar:publicKey,
        systemProgram:SystemProgram.programId
    }).rpc();
    const connection=new Connection(
        program.provider.connection.rpcEndpoint,
        "confirmed"
    );
    await connection.confirmTransaction(tx,"finalized");
    return tx;
}
export const withdrawFromCampaign=async(program:Program<Fundus>,publicKey:PublicKey, pda:string,
    amount:string,
):Promise<TransactionSignature>=>{
    console.log("program",program)
    const [programStatePda] = await PublicKey.findProgramAddress(
        [Buffer.from('program_state')],
        program.programId
)
      const state = await program.account.programState.fetch(programStatePda)
    console.log(`state ${JSON.stringify(state)}`)
    const campaign=await program.account.campaign.fetch(pda);
    const [contributionPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('withdraws'),
          publicKey.toBuffer(), 
          campaign.cid.toArrayLike(Buffer, 'le', 8),
          campaign.withdrawals.add(new BN(1)).toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )
    const amountBn = new BN(Math.round(+amount * LAMPORTS_PER_SOL));

    const tx = await program.methods
      .withdraw(campaign.cid, amountBn)
      .accountsPartial({
        transaction:contributionPda,
        campaign:pda,
        donar:publicKey,
        platformAddress:state.platformAddress,
        programState:programStatePda,
        systemProgram:SystemProgram.programId
    }).rpc();
    const connection=new Connection(
        program.provider.connection.rpcEndpoint,
        "confirmed"
    );
    await connection.confirmTransaction(tx,"finalized");
    return tx;
}
export const fetchAllDonations=async(program:Program<Fundus>, pda:string)=>{
        const campaign=await program.account.campaign.fetch(pda);
        const transactions=await program.account.transaction.all();
        console.log("transactions",transactions)
        const donations=transactions.filter(tx=>tx.account.cid.eq(campaign.cid) && tx.account.donated);
        console.log("donations",donations)
        const serialDona=serializeDonationData(donations);
        store.dispatch(setDonations(serialDona));
        return serialDona;

}
export const fetchAllWithdrawals=async(program:Program<Fundus>,pda:string)=>{
    const campaign=await program.account.campaign.fetch(pda);
    const transactions=await program.account.transaction.all();
    console.log("transactions",transactions)
    const donations=transactions.filter(tx=>tx.account.cid.eq(campaign.cid) && !tx.account.donated);
    console.log("donations",donations)
    const serialDona=serializeDonationData(donations);
    store.dispatch(setWithdrawals(serialDona));
    return serialDona;
}
export const updateCampaign=async(program:Program<Fundus>,publicKey:PublicKey,pda:string, title:string,
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
   const campaign=await program.account.campaign.fetch(pda);

   
    const goalBN=new BN(+goal*LAMPORTS_PER_SOL);
    const tx=await program.methods.updateCampaign(campaign.cid,title,description,image_url,goalBN).accountsPartial({
        campaign:pda,
        creater:publicKey,
        systemProgram:SystemProgram.programId
    }).rpc();
    const connection=new Connection(
        program.provider.connection.rpcEndpoint,
        "confirmed"
    );
    await connection.confirmTransaction(tx,"finalized");
    return tx;
}

export const deleteCampaign=async(program:Program<Fundus>,publicKey:PublicKey,pda:string
):Promise<TransactionSignature>=>{
   const campaign=await program.account.campaign.fetch(pda);
    const tx=await program.methods.deleteCampaign(campaign.cid).accountsPartial({
        campaign:pda,
        creater:publicKey,
        systemProgram:SystemProgram.programId
    }).rpc();
    const connection=new Connection(
        program.provider.connection.rpcEndpoint,
        "confirmed"
    );
    await connection.confirmTransaction(tx,"finalized");
    return tx;
}

export const updatePlatformFee=async(program:Program<Fundus>,publicKey:PublicKey,fee:string
):Promise<TransactionSignature>=>{
    const [programStatePda] = await PublicKey.findProgramAddress(
        [Buffer.from('program_state')],
        program.programId
      )
   const feeBn=new BN(fee);
    const tx=await program.methods.updatePlatformSettings(feeBn).accountsPartial({
        programState:programStatePda,
        updater:publicKey,
        systemProgram:SystemProgram.programId
    }).rpc();
    const connection=new Connection(
        program.provider.connection.rpcEndpoint,
        "confirmed"
    );
    await connection.confirmTransaction(tx,"finalized");
    return tx;
}
export const fetchProgramState=async(program:Program<Fundus>)=>{
    const [programStatePda] = await PublicKey.findProgramAddress(
        [Buffer.from('program_state')],
        program.programId
);
const state = await program.account.programState.fetch(programStatePda)
const serialized:ProgramState={
    ...state,
    campaignCount:state.campaignCount.toNumber(),
    platformFee:state.platformFee.toNumber(),
    platformAddress:state.platformAddress.toBase58()
}
console.log("program state",serialized)
store.dispatch(setProgramState(serialized))
return serialized;


}
const serializeDonationData=(tx:any)=>{
    console.log(tx);
    const serializedDonation:Transaction[]=tx.map((c:any)=>  {
        return {
            // ...c.account,
            publicKey: c.publicKey.toBase58(),
            cid: c.account.cid.toNumber(),
            owner: c.account.owner.toBase58(),
            amount: c.account.amount.toNumber()/LAMPORTS_PER_SOL,
            timestamp: c.account.timestamp.toNumber(),
            credited: c.account.donated,
        }
    });
    return serializedDonation;

}