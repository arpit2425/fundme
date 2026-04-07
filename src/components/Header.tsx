import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaUserCircle, FaPlusCircle, FaBars, FaTimes } from 'react-icons/fa'
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui"
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="fixed w-full top-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold gradient-text">
          Fundus<span className="text-slate-300">Crowd</span>
        </Link>

        {/* Static Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link
            href="/account"
            className="group text-slate-400 hover:text-white flex items-center space-x-1 transition duration-300"
          >
            <FaUserCircle className="text-slate-500 group-hover:text-violet-400 transition-colors duration-300" />
            <span>Account</span>
          </Link>
          <Link
            href="/create"
            className="group text-slate-400 hover:text-white flex items-center space-x-1 transition duration-300"
          >
            <FaPlusCircle className="text-slate-500 group-hover:text-violet-400 transition-colors duration-300" />
            <span>Create</span>
          </Link>
        </nav>

        {isMounted && (
          <div className="hidden md:inline-block">
            {/* Static Wallet Button */}
            <WalletMultiButton />
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-300 focus:outline-none"
        >
          {isOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-[#12122a]/95 backdrop-blur-xl border-b border-white/[0.06] py-4">
          <div className="container mx-auto px-6 space-y-4">
            <Link
              href="/account"
              className="text-slate-400 hover:text-white flex items-center space-x-2 transition duration-300"
            >
              <FaUserCircle />
              <span>Account</span>
            </Link>
            <Link
              href="/create"
              className="text-slate-400 hover:text-white flex items-center space-x-2 transition duration-300"
            >
              <FaPlusCircle />
              <span>Create</span>
            </Link>
            {isMounted && (
              <WalletMultiButton />
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
