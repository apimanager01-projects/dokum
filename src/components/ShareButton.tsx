'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ShareButtonProps {
  title: string
  url?: string
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleShare = async () => {
    if (!navigator.share) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        console.error('Failed to copy to clipboard')
      }
      return
    }

    try {
      await navigator.share({
        title,
        text: title,
        url: shareUrl,
      })
    } catch (error) {
      // User cancelled the share or an error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label={copied ? 'Copied!' : 'Share course'}
      className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
      title={copied ? 'Link copied!' : 'Share this course'}
    >
      <Image
        src="/icons/shareIcon.png"
        alt=""
        width={20}
        height={20}
        className="w-5 h-5"
      />
      {copied && <span className="ml-2 text-xs text-gray-600">Copied!</span>}
    </button>
  )
}
