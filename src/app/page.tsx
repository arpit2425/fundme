'use client'

import CampaignCard from '@/components/CampaignCard'
import CampaignHero from '@/components/CampaignHero'
import { campaigns as dummyCampaign } from '../data'
import { Campaign, RootState } from '@/utils/interfaces'
import { useEffect, useMemo, useState } from 'react'
import { fetchAllActiveCampaigns, getProviderReadOnly } from '@/services/blockchain'
import { useSelector } from 'react-redux'

export default function Page() {
  // Use the dummy data directly
  const [campaigns,setCampaigns]=useState<Campaign[]>([])
  const program =useMemo(()=>getProviderReadOnly(),[])
  useEffect(()=> {fetchAllActiveCampaigns(program).then(data=>setCampaigns(data))
   } ,[program])
  
  // const campaigns = dummyCampaign

  return (
    <div className="container mx-auto p-6">
      <CampaignHero />
      <div className="h-16" />
      <h1 className="text-3xl font-bold mb-8 text-slate-100">Explore Campaigns</h1>
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.cid} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-slate-200">
            No campaigns available at the moment
          </h2>
          <p className="text-slate-400 mt-4">
            Be the first to create a campaign and make a difference!
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
  )
}
