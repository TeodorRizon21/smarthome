import { redirect } from 'next/navigation'
import { COLLECTIONS } from '@/lib/collections'
import CollectionContent from '@/components/CollectionContent'

export default function CollectionPage({ 
  params,
  searchParams 
}: { 
  params: { name: string }
  searchParams: { sort?: string }
}) {
  // Verify valid collection
  const decodedName = decodeURIComponent(params.name) as keyof typeof COLLECTIONS;
  if (decodedName === 'Smart Residence') {
    redirect('/smart-residence');
  }
  if (!Object.values(COLLECTIONS).includes(decodedName)) {
    redirect('/')
  }

  return <CollectionContent collection={decodedName} initialSort={searchParams.sort} />
}

