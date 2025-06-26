import { redirect } from 'next/navigation'
import { CATEGORIES, VDP_SUBCATEGORIES } from '@/lib/categories'
import CollectionContent from '@/components/CollectionContent'

type CategoryValue = typeof CATEGORIES[keyof typeof CATEGORIES] | typeof VDP_SUBCATEGORIES[keyof typeof VDP_SUBCATEGORIES];

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
  
  const isValidCategory = (name: string): name is CategoryValue => {
    return Object.values(CATEGORIES).includes(name as any) || 
           Object.values(VDP_SUBCATEGORIES).includes(name as any) ||
           name === 'all';
  };

  if (!isValidCategory(decodedName)) {
    redirect('/')
  }

  return <CollectionContent collection={decodedName} initialSort={searchParams.sort} />
}

