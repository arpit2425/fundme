import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CampaignHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-600/20 via-[#0a0a1a] to-cyan-600/20 text-white py-24 px-6 md:px-16 rounded-2xl">
      <div className="container mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Empower Dreams Through Crowdfunding
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg">
              Discover, support, and fund campaigns that matter. Join a
              community of dreamers and changemakers, and bring ideas to life.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/account"
                className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:from-violet-400 hover:to-cyan-400 font-semibold py-3 px-6 rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300"
              >
                Explore Campaigns
              </Link>
              <Link
                href="/create"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Start a Campaign
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="https://cdn.pixabay.com/photo/2015/02/27/18/31/money-652560_960_720.jpg"
              alt="Crowdfunding Illustration"
              width={576}
              height={384}
              className="w-full rounded-2xl shadow-2xl shadow-violet-500/10 h-96 object-cover ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
export default CampaignHero
