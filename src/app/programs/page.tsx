import { Metadata } from 'next'
import Link from 'next/link'
import { getPrograms, getUniversities } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Study Programs | Study Bridge',
  description: 'Browse study programs and courses in Chinese universities for international students',
}

export default async function ProgramsPage() {
  const programs = await getPrograms()
  const universities = await getUniversities()
  
  // Create a map of university IDs to names for easier lookup
  const universityMap = universities.reduce((map, univ) => {
    map[univ.id] = univ
    return map
  }, {} as Record<string, any>)

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Study Programs in China</h1>
        <p className="text-gray-600 text-lg">
          Find the perfect program that matches your academic goals and career aspirations
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-8 p-4 bg-slate-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Filter Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* These would be implemented as proper form components in the future */}
          <div>
            <label className="block text-sm font-medium mb-1">Education Level</label>
            <select className="w-full p-2 border rounded-md">
              <option value="">All Levels</option>
              <option value="language">Language Programs</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="doctorate">Doctorate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select className="w-full p-2 border rounded-md">
              <option value="">All Languages</option>
              <option value="english">English</option>
              <option value="chinese">Chinese</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Field of Study</label>
            <select className="w-full p-2 border rounded-md">
              <option value="">All Fields</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Medicine">Medicine</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Arts">Arts & Humanities</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" className="mr-2">Reset</Button>
          <Button>Apply Filters</Button>
        </div>
      </div>

      {/* Programs Grid */}
      {programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-1">{program.name}</CardTitle>
                    <Link href={`/universities/${program.university_id}`} className="text-blue-600 hover:underline">
                      {universityMap[program.university_id]?.name || 'Unknown University'}
                    </Link>
                  </div>
                  {program.education_level && (
                    <Badge className="capitalize">
                      {program.education_level === 'bachelor' ? 'BSc' : 
                       program.education_level === 'master' ? 'MSc' : 
                       program.education_level === 'doctorate' ? 'PhD' : 'Language'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Language:</span>
                    <span className="font-medium capitalize">{program.language || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{program.duration} {program.duration === 1 ? 'year' : 'years'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Format:</span>
                    <span className="font-medium capitalize">{program.format || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tuition:</span>
                    <span className="font-medium">${program.tuition?.toLocaleString()} per year</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {program.description || 'No description available.'}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/programs/${program.id}`} className="w-full">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No programs found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  )
} 