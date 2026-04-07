import { getProvider, updatePlatformFee } from '@/services/blockchain'
import { ProgramState } from '@/utils/interfaces'
import { useWallet } from '@solana/wallet-adapter-react'
import React, { useMemo, useState } from 'react'
import { FaDonate } from 'react-icons/fa'
import { toast } from 'react-toastify'

const AccountDetails: React.FC<{ programState: ProgramState }> = ({
  programState,
}) => {
  const [percent, setPercent] = useState('')
  const {sendTransaction,publicKey,signTransaction}=useWallet();
  const program=useMemo(()=>{
   return  getProvider(sendTransaction,publicKey,signTransaction)
  },[sendTransaction,publicKey,signTransaction])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!percent || !publicKey) return
    toast.promise(
      new Promise( async (resolve,reject)=>{
        try {
          console.log(e)
          const tx=await updatePlatformFee(program!,publicKey,percent);
          console.log("transction",tx);
          resolve(tx);
        } catch (error) {
          console.log("error",error)
          reject()
        }
      }),
      {
        success:"Fee Updated",
        pending:"Updating Fee",
        error:"Failed"
      }
    )
    // Simulate an update transaction
    console.log(`Service fee updated to ${percent}%`)
    setPercent('')
  }

  return (
    <div>
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
          <FaDonate className="text-violet-400" />
          Update Service Fee
        </h2>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="donationAmount"
            className="block text-slate-300 font-semibold mb-2"
          >
            Percentage range is (1 - 15%)
          </label>
          <input
            type="text"
            name="percent"
            value={percent}
            onChange={(e) => {
              const value = e.target.value
              if (/^([1-9]|1[0-5])?$/.test(value)) {
                setPercent(value)
              }
            }}
            placeholder={`Current Fee (${programState.platformFee}%)`}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-200"
            required
          />
          <button
            type="submit"
            className={`mt-4 w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 ${
              !percent ? 'opacity-50 cursor-not-allowed' : ''
            } text-white font-semibold py-2.5 px-4 rounded-xl flex items-center
              justify-center gap-2 transition-all duration-300`}
          >
            Update Fee
          </button>
        </form>
      </div>
    </div>
  )
}

export default AccountDetails
