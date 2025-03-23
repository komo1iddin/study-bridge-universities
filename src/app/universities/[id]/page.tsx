import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getUniversityById, getProgramsByUniversityId } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Dynamic metadata will be generated for each university
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const university = await getUniversityById(params.id)
  
  if (!university) {
    return {
      title: 'University Not Found',
    }
  }
  
  return {
    title: `${university.name} | Study Bridge`,
    description: university.description || `Learn about ${university.name} in China for international students`,
  }
}

export default async function UniversityDetailsPage({ params }: { params: { id: string } }) {
  const university = await getUniversityById(params.id)
  
  if (!university) {
    notFound()
  }
  
  const programs = await getProgramsByUniversityId(params.id)

  return (
    <div className="container mx-auto py-8 px-4">
      {/* University header */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="flex-shrink-0 w-28 h-28 md:w-40 md:h-40 relative">
          {university.logo_url ? (
            <Image
              src={university.logo_url}
              alt={`${university.name} logo`}
              fill
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
              <span className="text-gray-500 text-xl">{university.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-wrap items-start gap-2 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold mr-2">{university.name}</h1>
            {university.ranking && (
              <Badge variant="outline" className="mt-1.5">
                Ranking: #{university.ranking}
              </Badge>
            )}
          </div>
          
          {university.chinese_name && (
            <p className="text-gray-500 text-lg mb-3">{university.chinese_name}</p>
          )}
          
          <div className="flex flex-wrap gap-3 mb-4">
            {university.province && university.city && (
              <div className="text-gray-600">
                <span className="inline-block mr-1">📍</span>
                {university.city}, {university.province}
              </div>
            )}
            
            {university.type && (
              <div className="text-gray-600 capitalize">
                <span className="inline-block mr-1">🏛️</span>
                {university.type} University
              </div>
            )}
            
            {university.foreign_students_count && (
              <div className="text-gray-600">
                <span className="inline-block mr-1">👨‍🎓</span>
                {university.foreign_students_count.toLocaleString()} International Students
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {university.specialization?.map((spec, index) => (
              <Badge key={index} variant="secondary">{spec}</Badge>
            ))}
          </div>
          
          <div className="flex gap-3">
            {university.website_url && (
              <Button variant="outline" asChild>
                <a href={university.website_url} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Button>
            )}
            <Button>Apply Now</Button>
          </div>
        </div>
      </div>
      
      {/* University description */}
      <div className="bg-slate-50 p-6 rounded-lg mb-10">
        <h2 className="text-2xl font-bold mb-4">About {university.name}</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {university.description || "No description available for this university."}
        </p>
      </div>
      
      {/* Details section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Facilities */}
        <Card>
          <CardHeader>
            <CardTitle>Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            {university.has_dormitory && (
              <div className="flex items-center mb-2">
                <span className="mr-2 text-green-500">✓</span>
                <span>On-campus Dormitories</span>
              </div>
            )}
            <div className="flex items-center mb-2">
              <span className="mr-2 text-green-500">✓</span>
              <span>Library</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="mr-2 text-green-500">✓</span>
              <span>Sports Facilities</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="mr-2 text-green-500">✓</span>
              <span>Cafeterias</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Tuition & Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Tuition & Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-medium mb-1">Annual Tuition</h4>
              {university.tuition_min && university.tuition_max ? (
                <p className="text-gray-700">
                  ${university.tuition_min.toLocaleString()} - ${university.tuition_max.toLocaleString()} USD / year
                </p>
              ) : (
                <p className="text-gray-500">Information not available</p>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-1">Living Expenses</h4>
              <p className="text-gray-700">
                $3,000 - $6,000 USD / year (estimated)
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Includes accommodation, food, transport, and other daily necessities
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Programs section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Available Programs</h2>
        </div>
        
        {programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    {program.education_level && (
                      <Badge className="capitalize">
                        {program.education_level === 'bachelor' ? 'BSc' : 
                         program.education_level === 'master' ? 'MSc' : 
                         program.education_level === 'doctorate' ? 'PhD' : 'Language'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
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
                      <span className="text-gray-500">Tuition:</span>
                      <span className="font-medium">${program.tuition?.toLocaleString()} / year</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link href={`/programs/${program.id}`}>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                    <Button className="w-full">Apply</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No programs available</h3>
            <p className="text-gray-500 mb-2">We couldn't find any programs for this university at the moment.</p>
            <p className="text-gray-500">Check back later or contact the university directly.</p>
          </div>
        )}
      </div>
      
      {/* Campus Images */}
      {university.campus_images && university.campus_images.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Campus Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {university.campus_images.map((image, index) => (
              <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                <Image 
                  src={image} 
                  alt={`${university.name} campus view ${index + 1}`} 
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Contact Information */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Address</h4>
                <p className="text-gray-700">
                  {university.contact_info?.address || 
                   `${university.city}, ${university.province}, China`}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Email</h4>
                <p className="text-gray-700">
                  {university.contact_info?.email || 'international@example.edu.cn'}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Phone</h4>
                <p className="text-gray-700">
                  {university.contact_info?.phone || '+86 XXX XXX XXXX'}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Website</h4>
                {university.website_url ? (
                  <a 
                    href={university.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    {university.website_url}
                  </a>
                ) : (
                  <p className="text-gray-500">Not available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 