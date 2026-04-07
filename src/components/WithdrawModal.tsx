import { fetchAllWithdrawals, fetchCampaignDetails, getProvider, withdrawFromCampaign } from '@/services/blockchain'
import { globalAction } from '@/store/globalSlices'
import { Campaign, RootState } from '@/utils/interfaces'
import { useWallet } from '@solana/wallet-adapter-react'
import React, { useMemo, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const WithdrawModal = ({
  campaign,
  pda
}: {
  campaign: Campaign,
  pda:string
}) => {
  const [amount, setAmount] = useState('')
  const {setwithdrawModal}=globalAction
  const dispatch=useDispatch()

  const {withdrawModal}=useSelector((state:RootState)=>state.globalStates)
  const {sendTransaction,publicKey,signTransaction}=useWallet();
  const program=useMemo(()=>{
   return  getProvider(sendTransaction,publicKey,signTransaction)
  },[sendTransaction,publicKey,signTransaction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !publicKey || !program) return

    toast.promise(
      new Promise( async (resolve,reject)=>{
        try {
          console.log(e)
          const tx=await withdrawFromCampaign(program!,publicKey!,pda!,amount);
          setAmount('')
          console.log("transction",tx);
          await fetchCampaignDetails(program!,pda)
          await fetchAllWithdrawals(program!,pda);
          dispatch(setwithdrawModal('scale-0'));
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
    // Simulate a withdrawal (static)
    console.log('Withdrawal Successful')

  }


  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
      bg-black/60 backdrop-blur-sm transform z-[3000] transition-transform duration-300 ${withdrawModal}`}
    >
      <div className="glass bg-[#12122a] shadow-2xl shadow-black/50 rounded-2xl w-11/12 md:w-2/5 p-8 border border-white/[0.08]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center">
            <p className="block text-sm font-semibold text-slate-200">
              Creator Withdrawal
            </p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={()=>dispatch(setwithdrawModal('scale-0'))}
            >
              <FaTimes className="text-slate-500 hover:text-slate-300 transition-colors duration-200" />
            </button>
          </div>

          <div>
            <input
              type="text"
              name="donationAmount"
              placeholder={`1 SOL (${campaign.balance.toFixed(
                2
              )} SOL available)`}
              value={amount}
              onChange={(e) => {
                const value = e.target.value
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  setAmount(value)
                }
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-200"
              min="1"
              max={campaign.balance.toFixed(2)}
              required
            />
          </div>

          <div className="flex justify-center w-full">
            <button
              type="submit"
              disabled={!amount}
              className={`w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 ${
                !amount ? 'opacity-50 cursor-not-allowed' : ''
              } text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300`}
            >
              Withdraw
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WithdrawModal
