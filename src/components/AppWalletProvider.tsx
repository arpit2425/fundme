"use client"
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base"
import { useMemo } from "react";
import {PhantomWalletAdapter,MathWalletAdapter} from "@solana/wallet-adapter-wallets"
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react"
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js";
require("@solana/wallet-adapter-react-ui/styles.css")
export default function AppWalletProvider({children}:{children:React.ReactNode}){
    const network=WalletAdapterNetwork.Testnet;
    const endpoint=useMemo(()=> clusterApiUrl(network),[network]);
    const wallets=useMemo(()=>[new PhantomWalletAdapter()],[network]);
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>

        </ConnectionProvider>
    )

}