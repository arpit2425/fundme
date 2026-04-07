import { deleteCampaign, getProvider } from '@/services/blockchain'
import { globalAction } from '@/store/globalSlices'
import { Campaign, RootState } from '@/utils/interfaces'
import { program } from '@coral-xyz/anchor/dist/cjs/native/system'
import { useWallet } from '@solana/wallet-adapter-react'
import React, { useMemo } from 'react'
import { FaTimes, FaTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const DeleteModal = ({campaign,pda}:{campaign:Campaign,pda:string}) => {
  const {setDelModal}=globalAction
  const dispatch=useDispatch()

  const {delModal}=useSelector((state:RootState)=>state.globalStates)
  const {sendTransaction,publicKey,signTransaction}=useWallet();
  const program=useMemo(()=>{
   return  getProvider(sendTransaction,publicKey,signTransaction)
  },[sendTransaction,publicKey,signTransaction])

  const handleClose = () => {
    dispatch(setDelModal('scale-0'))
    // Close the modal functionality (static, no Redux)
  }

  const handleDelete = async () => {
    // Simulate successful deletion (static, no actual API call)

    toast.promise(
      new Promise( async (resolve,reject)=>{
        try {
        
          const tx=await  await deleteCampaign(program!,publicKey!,pda)
        
          console.log("transction",tx);
          dispatch(setDelModal('scale-0'))
          resolve(tx);
        } catch (error) {
          console.log("errorr",error)
          reject()
        }
      }),
      {
        success:"Campaign Deleted",
        pending:"Deleting Campaign",
        error:"Failed"
      }
    )
  

    console.log('Campaign deleted')
    // handleClose()
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
      bg-black/60 backdrop-blur-sm transform z-[3000] transition-transform duration-300 ${delModal}`}
    >
      <div className="glass bg-[#12122a] shadow-2xl shadow-black/50 rounded-2xl w-11/12 md:w-2/5 p-8 border border-white/[0.08]">
        <div className="flex flex-row justify-between items-center mb-6">
          <p className="text-xl font-semibold text-slate-200">
            Are you sure you want to delete this campaign?
          </p>
          <button
            type="button"
            className="border-0 bg-transparent focus:outline-none"
            onClick={handleClose}
          >
            <FaTimes className="text-slate-500 hover:text-slate-300 transition-colors duration-200" />
          </button>
        </div>

        <div className="mb-6 text-center">
          <p className="text-lg text-slate-400">
            You are about to permanently delete the campaign{' '}
            <strong className="text-slate-200">{campaign.title}</strong>.
          </p>
          <p className="text-sm text-slate-500 mt-2">This action cannot be undone.</p>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="w-full bg-red-500 hover:bg-red-600 text-white
            font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all duration-300"
            onClick={handleDelete}
          >
            <FaTrashAlt />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
