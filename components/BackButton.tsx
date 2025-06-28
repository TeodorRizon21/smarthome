'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show the back button on the home page, admin pages, smart home service pages, products pages, or about page
  if (pathname === '/' || 
      pathname.startsWith('/admin') || 
      pathname.startsWith('/smart-') ||
      pathname.startsWith('/products') ||
      pathname === '/despre' ||
      pathname === '/cart' ||
      pathname === '/termeni-conditii' ||
      pathname === '/politica-confidentialitate') {
    return null
  }

  return (
    <div className="container mx-auto px-6">
      <Button
        variant="ghost"
        className="mt-4 mb-4 hover:bg-transparent"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Go Back
      </Button>
    </div>
  )
}

