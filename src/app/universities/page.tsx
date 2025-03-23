import { Metadata } from 'next'
import { UniversityCard } from '@/components/cards/UniversityCard'
import { getUniversities } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Universities | Study Bridge',
  description: 'Browse universities in China for international students',
}

export default async function UniversitiesPage() {
  // Fetch universities
  const universities = await getUniversities()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Universities</h1>
        <p className="text-gray-500">
          Browse top universities in China for international students
        </p>
      </div>

      {/* Filtering options will go here */}
      <div className="flex gap-4 mb-8">
        {/* To be implemented */}
      </div>

      {/* University grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map(university => (
          <UniversityCard
            key={university.id}
            university={university}
            variant="default"
          />
        ))}
      </div>

      {/* Empty state */}
      {universities.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium">No universities found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  )
} 