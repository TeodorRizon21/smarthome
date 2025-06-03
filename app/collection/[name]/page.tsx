import { redirect } from 'next/navigation'
import { COLLECTIONS } from '@/lib/collections'
import CollectionContent from '@/components/CollectionContent'

type CollectionValue = typeof COLLECTIONS[keyof typeof COLLECTIONS];

export default function CollectionPage({ 
  params,
  searchParams 
}: { 
  params: { name: string }
  searchParams: { sort?: string }
}) {
  // Verify valid collection
  const decodedName = decodeURIComponent(params.name);
  if (decodedName === 'Smart Residence') {
    redirect('/smart-residence');
  }
  
  const isValidCollection = (name: string): name is CollectionValue => {
    return Object.values(COLLECTIONS).includes(name as CollectionValue);
  };

  if (!isValidCollection(decodedName)) {
    redirect('/')
  }

  return <CollectionContent collection={decodedName} initialSort={searchParams.sort} />
}

