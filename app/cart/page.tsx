import CartContent from "@/components/CartContent"
import { Suspense } from "react"

export default function CartPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-6 py-12 text-center">Loading...</div>}>
      <CartContent />
    </Suspense>
  )
}

