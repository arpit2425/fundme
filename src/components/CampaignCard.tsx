import { Campaign } from '@/utils/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCoins, FaUsers } from 'react-icons/fa'

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const progressPercentage = Math.min(
    (campaign.amountRaised / campaign.goal) * 100,
    100
  )

  return (
    <div className="max-w-sm bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group">
      <div className="overflow-hidden">
        <Image
          src={campaign.imageUrl}
          alt={`${campaign.title} campaign`}
          width={300}
          height={150}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-100 truncate">
          {campaign.title}
        </h2>
        <p className="text-slate-400 text-sm mt-2 truncate">
          {campaign.description.length > 100
            ? `${campaign.description.substring(0, 100)}...`
            : campaign.description}
        </p>
        <div className="mt-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-2 gradient-bar rounded-full transition-all duration-700"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-slate-300 flex items-center space-x-1">
              <FaCoins className="text-violet-400" />
              <strong>{campaign.amountRaised}</strong> SOL Raised
            </span>
            <span className="text-slate-300 flex items-center space-x-1">
              <FaUsers className="text-cyan-400" />
              <strong>{campaign.donors}</strong> Donors
            </span>
          </div>
        </div>
        <Link
          href={`/campaign/${campaign.publicKey}`}
          className="mt-4 w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400
          text-white text-sm font-semibold py-2.5 px-4 rounded-xl block text-center transition-all duration-300"
        >
          View Campaign
        </Link>
      </div>
    </div>
  )
}

export default CampaignCard
