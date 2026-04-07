'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { campaigns as dummyCampaigns, dummyProgramState } from '@/data'
import CampaignCard from '@/components/CampaignCard'
import AccountDetails from '@/components/AccountDetails'
import {useWallet} from "@solana/wallet-adapter-react"
import { fetchProgramState, fetchUserCampaigns, getProvider } from '@/services/blockchain'
import { Campaign, GlobalState, ProgramState, RootState } from '@/utils/interfaces'
import { useSelector } from 'react-redux'
export default function Page() {
 const {programState}=useSelector((states:RootState)=>states.globalStates)
  const [campaigns,setCampaigns]=useState<Campaign[]>([])


  const {sendTransaction,signTransaction,publicKey}=useWallet();
  const program=useMemo(()=>getProvider(sendTransaction,publicKey,signTransaction),[sendTransaction,publicKey,signTransaction])
  useEffect(()=> {
    if(program && publicKey){
     fetchUserCampaigns(program!,publicKey!).then(data=>setCampaigns(data))
     fetchProgramState(program!);
    }
  } ,[program,publicKey])

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left side */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-8 text-slate-100">My Campaigns</h1>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.cid} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-slate-200">
              You have no campaigns available at the moment
            </h2>
            <p className="text-slate-400 mt-4">
              Launch your first campaign and make a difference!
            </p>

            <div className="mt-6">
              <a
                href="/create"
                className="inline-block bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300"
              >
                Create a Campaign
              </a>
            </div>
          </div>
        )}
      </div>

      {programState && programState.platformAddress === publicKey?.toBase58() && (
        <div className="md:col-span-1">
          <AccountDetails programState={programState} />
        </div>
      )}
    </div>
  )
}
