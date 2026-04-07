'use client'

import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {useWallet} from "@solana/wallet-adapter-react"
import { createCampaign, getProvider } from '@/services/blockchain';

export default function Page() {
  // Local form state
  const {sendTransaction,publicKey,signTransaction}=useWallet();
  console.log("wallet", {sendTransaction,publicKey,signTransaction})
  const program=useMemo(()=>{
   return  getProvider(sendTransaction,publicKey,signTransaction)
  },[sendTransaction,publicKey,signTransaction])
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    goal: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!publicKey){
      return toast.warn("Connect wallet first")
    }
    toast.promise(
      new Promise( async (resolve,reject)=>{
        try {
          console.log(form)
          const {title,description,image_url,goal }=form;
          const tx=await createCampaign(program!,publicKey!,title,description,image_url,goal);
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
        success:"Campaign Created",
        pending:"Creating Campaign",
        error:"Failed"
      }
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-100">Create Campaign</h1>
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
            Create Now
          </button>
        </div>
      </form>
    </div>
  )
}
