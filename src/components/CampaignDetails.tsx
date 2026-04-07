import { truncateAddress } from '@/utils/helper'
import { Campaign } from '@/utils/interfaces'
import Link from 'next/link'
import React from 'react'
import { FaUserCircle, FaCoins, FaDollarSign, FaBell } from 'react-icons/fa'

const CampaignDetails: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const goalReachedText =
    campaign.amountRaised >= campaign.goal ? 'Reached!' : 'Not Reached!'
  const goalReachedColor =
    campaign.amountRaised >= campaign.goal ? 'text-red-600' : 'text-yellow-600'
  const statusColor = campaign.active ? 'text-green-600' : 'text-red-600'
  const statusText = campaign.active ? 'Active' : 'Ended'

  const CLUSTER_NAME = process.env.CLUSTER_NAME || 'custom'

  return (
    <div className="md:col-span-2">
      <h2 className="text-2xl font-bold text-slate-100 mb-4">
        About this Campaign
      </h2>
      <p className="text-slate-400 leading-relaxed">{campaign?.description}</p>

      {/* Funding Progress */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
          <FaCoins className="text-violet-400" />
          Funding Progress
        </h3>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="gradient-bar h-3 rounded-full transition-all duration-700"
            style={{
              width: `${(campaign?.amountRaised / campaign?.goal) * 100}%`,
            }}
          />
        </div>
        <p className="mt-2 text-slate-400">
          {campaign?.amountRaised.toLocaleString()} SOL raised of{' '}
          {campaign?.goal} SOL
        </p>
      </div>

      {/* Campaign Status */}
      <div className="mt-6 grid grid-cols-2 gap-6 border-b border-white/[0.06] pb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
            <FaBell className={`text-xl ${statusColor}`} />
            Status
          </h3>
          <p className={`${statusColor} text-lg font-semibold`}>{statusText}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
            <FaBell className={`text-xl ${goalReachedColor}`} />
            Campaign Goal
          </h3>
          <p className={`${goalReachedColor} text-lg font-semibold`}>
            {goalReachedText}
          </p>
        </div>
      </div>

      {/* Donations and Withdrawals */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
            <FaDollarSign className="text-cyan-400" />
            Donations
          </h3>
          <p className="text-slate-400">
            {campaign.donors.toLocaleString()} donations
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
            <FaCoins className="text-amber-400" />
            Withdrawals
          </h3>
          <p className="text-slate-400">
            {campaign.withdrawals.toLocaleString()} withdrawals
          </p>
        </div>
      </div>

      {/* Creator Info */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
          <FaUserCircle className="text-violet-400" />
          Created by
        </h3>
        <div className="flex items-center space-x-4">
          <p className="text-slate-200 font-semibold">
            <Link
              href={`https://explorer.solana.com/address/${campaign?.creator}?cluster=${CLUSTER_NAME}`}
              target="_blank"
            >
              {truncateAddress(campaign?.creator)}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
