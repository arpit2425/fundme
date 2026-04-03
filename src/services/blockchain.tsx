import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { Fundus } from "anchor/target/types/fundus";
import idl from "anchor/target/idl/fundus.json";


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
        return null;
    }
    const connection=new Connection(clusterUrl,"confirmed");
    const provider=new AnchorProvider(connection,
        {sendTransaction,publicKey,signTransaction} as unknown as Wallet,
        {
            commitment:"processed"
        }
    );
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