'use client'

import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { campaigns } from '@/data'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/utils/interfaces'
import { fetchCampaignDetails, getProvider, updateCampaign } from '@/services/blockchain'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-toastify'

export default function Page() {
  const { cid } = useParams()

  // Static data: Find the campaign using `cid`
  const {sendTransaction,signTransaction,publicKey}=useWallet();
  const program=useMemo(()=>getProvider(sendTransaction,publicKey,signTransaction),[sendTransaction,publicKey,signTransaction])

  const {campaign}=useSelector((state:RootState)=>state.globalStates)
  useEffect(()=> {
    if(cid){
      const fetchedDetail=async()=>{
      const campaign= await fetchCampaignDetails(program!,cid as string)
      form.title=campaign.title;
      form.description=campaign.description;
      form.image_url=campaign.imageUrl;
      form.goal=campaign.goal;
      }
      fetchedDetail()
    }
  } ,[program,cid])


  // Local form state
  const [form, setForm] = useState({
    title: campaign?.title || '',
    description: campaign?.description || '',
    image_url: campaign?.imageUrl || '',
    goal: campaign?.goal || '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form Submitted:', form)
    if(!publicKey){
      return toast.warn("Connect wallet first")
    }
    toast.promise(
      new Promise( async (resolve,reject)=>{
        try {
          console.log(form)
          const {title,description,image_url,goal }=form;
          const tx=await  updateCampaign(program!,publicKey!,cid as string,title,description,image_url,goal as string);
          setForm({
            title: '',
            description: '',
            image_url: '',
            goal: '',
          })
          console.log("transction",tx);
          resolve(tx);
        } catch (error) {
          console.log("errorr",error)

          reject()
        }
      }),
      {
        success:"Campaign Updated",
        pending:"Updating Campaign",
        error:"Failed To Update Campaign"
      }
    )
  }

  // Fallback if campaign not found
  if (!campaign) return <h4>Campaign not found</h4>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-100">Update Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <input
          type="text"
          placeholder="What's the grand title?"
          maxLength={64}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-200"
          required
        />
        <input
          type="url"
          placeholder="Paste that fancy image URL here!"
          maxLength={256}
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-200"
          required
        />
        <input
          type="text"
          placeholder="How many SOLs for your dream?"
          value={form.goal}
          onChange={(e) => {
            const value = e.target.value
            if (/^\d*\.?\d{0,2}$/.test(value)) {
              setForm({ ...form, goal: value })
            }
          }}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-200"
          required
        />
        <textarea
          placeholder="Tell us the epic tale of your project..."
          maxLength={512}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-200 min-h-[120px]"
          required
        />

        <div className="mt-4 space-x-4 flex justify-start items-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300"
          >
            Update Now
          </button>

          <Link
            href={`/campaign/${cid}`}
            className="bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white font-semibold py-2.5 px-6 rounded-xl text-center transition-all duration-300"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  )
}
