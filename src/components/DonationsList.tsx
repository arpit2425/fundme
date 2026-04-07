import { truncateAddress } from '@/utils/helper'
import { Transaction } from '@/utils/interfaces'
import Link from 'next/link'
import React from 'react'
import { FaMoneyBillWave } from 'react-icons/fa'

const DonationsList: React.FC<{ donations: Transaction[] }> = ({
  donations,
}) => {
  const CLUSTER_NAME = process.env.CLUSTER_NAME || 'custom'

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
        <FaMoneyBillWave className="text-emerald-400" />
        Donation History
      </h2>
      {donations.length > 0 ? (
        <ul className="glass rounded-2xl divide-y divide-white/[0.06]">
          {donations.map((donation, index) => (
            <li
              key={index}
              className="px-5 py-3 flex justify-between items-center hover:bg-white/[0.03] transition-colors duration-200"
            >
              <p className="text-slate-200 flex justify-start items-center space-x-1">
                <strong>
                  <Link
                    href={`https://explorer.solana.com/address/${donation.owner}?cluster=${CLUSTER_NAME}`}
                    target="_blank"
                  >
                    {truncateAddress(donation.owner)}
                  </Link>
                </strong>{' '}
                <small className="text-emerald-400">
                  {donation.amount} SOL
                </small>
              </p>

              <p className="text-sm text-slate-500">
                {new Date(donation.timestamp).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500">No donations yet.</p>
      )}
    </div>
  )
}

export default DonationsList
