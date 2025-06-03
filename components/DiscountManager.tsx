'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from 'lucide-react'

type DiscountType = 'free_shipping' | 'percentage' | 'fixed'

interface DiscountCode {
  id: string
  code: string
  type: DiscountType
  value: number
  usesLeft: number | null
  totalUses: number
  expirationDate: string | null
  canCumulate: boolean
}

export default function DiscountManager() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null)

  const [code, setCode] = useState('')
  const [type, setType] = useState<DiscountType>('percentage')
  const [value, setValue] = useState('')
  const [usesLeft, setUsesLeft] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [canCumulate, setCanCumulate] = useState(false)

  useEffect(() => {
    fetchDiscountCodes()
  }, [])

  const fetchDiscountCodes = async () => {
    try {
      const response = await fetch('/api/admin/discount')
      if (!response.ok) throw new Error('Failed to fetch discount codes')
      const data = await response.json()
      setDiscountCodes(data)
    } catch (error) {
      console.error('Error fetching discount codes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch discount codes. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/discount', {
        method: editingCode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCode?.id,
          code,
          type,
          value: parseFloat(value),
          usesLeft: usesLeft === '' ? null : parseInt(usesLeft),
          expirationDate: expirationDate || null,
          canCumulate,
        }),
      })

      if (!response.ok) throw new Error('Failed to save discount code')

      toast({
        title: "Success",
        description: editingCode ? "Discount code updated successfully" : "Discount code created successfully",
      })

      fetchDiscountCodes()
      resetForm()
    } catch (error) {
      console.error('Error saving discount code:', error)
      toast({
        title: "Error",
        description: "Failed to save discount code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/discount/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        if (data.canDeactivate) {
          setSelectedCodeId(id)
          setDeactivateDialogOpen(true)
          return
        }
        throw new Error(data.error || 'Failed to delete discount code')
      }

      toast({
        title: "Success",
        description: "Discount code deleted successfully",
      })

      fetchDiscountCodes()
    } catch (error) {
      console.error('Error deleting discount code:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete discount code",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedCodeId(null)
    }
  }

  const handleDeactivate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/discount/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeactivating: true }),
      })

      if (!response.ok) throw new Error('Failed to deactivate discount code')

      toast({
        title: "Success",
        description: "Discount code deactivated successfully",
      })

      fetchDiscountCodes()
    } catch (error) {
      console.error('Error deactivating discount code:', error)
      toast({
        title: "Error",
        description: "Failed to deactivate discount code",
        variant: "destructive",
      })
    } finally {
      setDeactivateDialogOpen(false)
      setSelectedCodeId(null)
    }
  }

  const resetForm = () => {
    setEditingCode(null)
    setCode('')
    setType('percentage')
    setValue('')
    setUsesLeft('')
    setExpirationDate('')
    setCanCumulate(false)
  }

  const isDiscountCodeActive = (discountCode: DiscountCode) => {
    const now = new Date()
    const isExpired = discountCode.expirationDate && new Date(discountCode.expirationDate) < now
    const hasNoUsesLeft = discountCode.usesLeft === 0
    return !isExpired && !hasNoUsesLeft
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold">{editingCode ? 'Edit Discount Code' : 'Create New Discount Code'}</h2>
        <div>
          <Label htmlFor="code">Discount Code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Discount Type</Label>
          <RadioGroup value={type} onValueChange={(value) => setType(value as DiscountType)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free_shipping" id="free_shipping" />
              <Label htmlFor="free_shipping">Free Shipping</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage">Percentage Discount</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed">Fixed Discount</Label>
            </div>
          </RadioGroup>
        </div>
        {type !== 'free_shipping' && (
          <div>
            <Label htmlFor="value">Discount Value</Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <Label htmlFor="usesLeft">Number of Uses (leave blank for unlimited)</Label>
          <Input
            id="usesLeft"
            type="number"
            value={usesLeft}
            onChange={(e) => setUsesLeft(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="expirationDate">Expiration Date (optional)</Label>
          <Input
            id="expirationDate"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="canCumulate"
            checked={canCumulate}
            onCheckedChange={(checked) => setCanCumulate(checked as boolean)}
          />
          <Label htmlFor="canCumulate">Can be used with other discounts</Label>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (editingCode ? 'Update Discount Code' : 'Create Discount Code')}
        </Button>
        {editingCode && (
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel Editing
          </Button>
        )}
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Discount Codes</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Uses Left</TableHead>
              <TableHead>Total Uses</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Can Cumulate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discountCodes.map((discountCode) => (
              <TableRow key={discountCode.id}>
                <TableCell>{discountCode.code}</TableCell>
                <TableCell>{discountCode.type}</TableCell>
                <TableCell>
                  {discountCode.type === 'free_shipping' ? 'N/A' : discountCode.value}
                </TableCell>
                <TableCell>{discountCode.usesLeft === null ? 'Unlimited' : discountCode.usesLeft}</TableCell>
                <TableCell>{discountCode.totalUses}</TableCell>
                <TableCell>{discountCode.expirationDate || 'No expiration'}</TableCell>
                <TableCell>{discountCode.canCumulate ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Badge variant={isDiscountCodeActive(discountCode) ? "secondary" : "destructive"}>
                    {isDiscountCodeActive(discountCode) ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setEditingCode(discountCode)
                      setCode(discountCode.code)
                      setType(discountCode.type)
                      setValue(discountCode.value.toString())
                      setUsesLeft(discountCode.usesLeft?.toString() || '')
                      setExpirationDate(discountCode.expirationDate || '')
                      setCanCumulate(discountCode.canCumulate)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSelectedCodeId(discountCode.id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this discount code?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedCodeId && handleDelete(selectedCodeId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot delete this discount code</AlertDialogTitle>
            <AlertDialogDescription>
              This discount code has been used in orders and cannot be deleted.
              Would you like to deactivate it instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedCodeId && handleDeactivate(selectedCodeId)}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

