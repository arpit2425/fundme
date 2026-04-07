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
      bg-black bg-opacity-50 transform z-[3000] transition-transform duration-300 ${withdrawModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center">
            <p className="block text-sm font-semibold text-gray-700">
              Creator Withdrawal
            </p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={()=>dispatch(setwithdrawModal('scale-0'))}
            >
              <FaTimes className="text-gray-400" />
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              min="1"
              max={campaign.balance.toFixed(2)}
              required
            />
          </div>

          <div className="flex justify-center w-full">
            <button
              type="submit"
              disabled={!amount}
              className={`w-full bg-green-600 hover:bg-green-700 ${
                !amount ? 'opacity-50 cursor-not-allowed' : ''
              } text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2`}
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
