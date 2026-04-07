import React, { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaDollarSign, FaDonate, FaEdit, FaTrashAlt } from 'react-icons/fa'
import { Campaign } from '@/utils/interfaces'
import { toast } from 'react-toastify'
import { donateToCampaign, fetchAllDonations, fetchCampaignDetails, getProvider } from '@/services/blockchain'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDispatch } from 'react-redux'
import { globalAction } from '@/store/globalSlices'

const CampaignDonate: React.FC<{ campaign: Campaign; pda: string }> = ({
  campaign,
  pda,
}) => {
  const [amount, setAmount] = useState('')
  const {setwithdrawModal, setDelModal}=globalAction
  const dispatch=useDispatch()
  const {sendTransaction,publicKey,signTransaction}=useWallet();
  const program=useMemo(()=>{
   return  getProvider(sendTransaction,publicKey,signTransaction)
  },[sendTransaction,publicKey,signTransaction])


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (Number(amount) + campaign.amountRaised > campaign.goal) {
      return alert('Amount exceeds campaign goal')
    }

    console.log(`Donated ${amount} SOL to campaign ID: ${campaign.cid}`)
    toast.promise(
      new Promise( async (resolve,reject)=>{
        try {
          console.log(e)
          const tx=await donateToCampaign(program!,publicKey!,pda!,amount);
          setAmount("")
          await fetchCampaignDetails(program!,pda)
          await fetchAllDonations(program!,pda);

          console.log("transction",tx);
          resolve(tx);
        } catch (error) {
          console.log("errorr",error)
          reject()
        }
      }),
      {
        success:"Campaign Created",
        pending:"Creating Campaign",
        error:"Failed"
      }
    )
    setAmount('')
  }

  return (
    <div>
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <FaDonate className="text-violet-400" />
          Donate
        </h2>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="donationAmount"
            className="block text-slate-300 font-semibold mb-2"
          >
            Amount (SOL)
          </label>
          <input
            type="text"
            name="donationAmount"
            placeholder={`1 SOL (${(
              campaign.goal - campaign.amountRaised
            ).toFixed(2)} SOL remaining)`}
            value={amount}
            onChange={(e) => {
              const value = e.target.value
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                setAmount(value)
              }
            }}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-200"
            min="1"
            required
          />
          <button
            type="submit"
            disabled={
              !amount ||
              !campaign.active ||
              campaign.amountRaised >= campaign.goal
            }
            className={`mt-4 w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 ${
              !amount ||
              !campaign.active ||
              campaign.amountRaised >= campaign.goal
                ? 'opacity-50 cursor-not-allowed'
                : ''
            } text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300`}
          >
            <FaDonate />
            Donate Now
          </button>
        </form>

        {publicKey && campaign.creator === publicKey.toBase58() && (
          <div className="mt-6 flex flex-wrap gap-2 md:flex-nowrap md:gap-0">
            <Link
              href={`/campaign/edit/${pda}`}
              className="bg-transparent hover:bg-violet-500 text-violet-400 hover:text-white
              font-semibold py-2.5 px-4 flex-1 md:rounded-l-xl flex items-center justify-center
              border border-violet-500/50 hover:border-transparent transition-all duration-300"
            >
              <FaEdit />
              Edit
            </Link>
           { campaign.active && <button
              type="button"
              className="bg-red-500/80 hover:bg-red-500 text-white
              font-semibold py-2.5 px-4 flex-1 flex items-center justify-center transition-all duration-300"
              onClick={()=>dispatch(setDelModal('scale-100'))}
            >
              <FaTrashAlt />
              Delete
            </button>
}

            <button
              className="bg-transparent hover:bg-violet-500 text-violet-400 hover:text-white
              font-semibold py-2.5 px-4 flex-1 md:rounded-r-xl flex items-center justify-center
              border border-violet-500/50 hover:border-transparent transition-all duration-300"
              onClick={()=>dispatch(setwithdrawModal('scale-100'))}
            >
              <FaDollarSign />
              Payout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CampaignDonate
