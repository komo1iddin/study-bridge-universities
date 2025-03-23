import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProgramById, getScholarshipsForProgram } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Dynamic metadata will be generated for each program
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const program = await getProgramById(params.id)
  
  if (!program) {
    return {
      title: 'Program Not Found',
    }
  }
  
  return {
    title: `${program.name} at ${program.universities.name} | Study Bridge`,
    description: program.description || `Learn about ${program.name} at ${program.universities.name} for international students`,
  }
}

export default async function ProgramDetailsPage({ params }: { params: { id: string } }) {
  const program = await getProgramById(params.id)
  
  if (!program) {
    notFound()
  }
  
  const university = program.universities
  const scholarships = await getScholarshipsForProgram(params.id)

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link href="/programs" className="text-blue-600 hover:underline">Programs</Link>
        <span className="mx-2">›</span>
        <Link href={`/universities/${university.id}`} className="text-blue-600 hover:underline">
          {university.name}
        </Link>
        <span className="mx-2">›</span>
        <span>{program.name}</span>
      </div>
      
      {/* Program header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">{program.name}</h1>
          {program.education_level && (
            <Badge className="mt-2">
              {program.education_level === 'bachelor' ? 'Bachelor\'s Degree' : 
               program.education_level === 'master' ? 'Master\'s Degree' : 
               program.education_level === 'doctorate' ? 'Doctorate' : 'Language Program'}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 w-10 h-10 mr-2 relative">
            {university.logo_url ? (
              <Image
                src={university.logo_url}
                alt={`${university.name} logo`}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                <span className="text-gray-500">{university.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div>
            <Link href={`/universities/${university.id}`} className="text-lg font-medium hover:underline">
              {university.name}
            </Link>
            {university.ranking && (
              <span className="ml-2 text-sm text-gray-500">
                (Ranking: #{university.ranking})
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Duration</h3>
              <p>{program.duration} {program.duration === 1 ? 'year' : 'years'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Language</h3>
              <p className="capitalize">{program.language || 'Not specified'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Tuition Fee</h3>
              <p>${program.tuition?.toLocaleString()} per year</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button size="lg">Apply Now</Button>
          <Button size="lg" variant="outline">Download Brochure</Button>
        </div>
      </div>
      
      {/* Program description */}
      <div className="bg-slate-50 p-6 rounded-lg mb-10">
        <h2 className="text-2xl font-bold mb-4">About This Program</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {program.description || "No description available for this program."}
        </p>
      </div>
      
      {/* Details section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          {/* Curriculum */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {program.curriculum ? (
                <div>
                  {/* Render curriculum details here based on the structure of your data */}
                  <p>The curriculum for this program includes courses in various subjects and may vary depending on your specialization.</p>
                  
                  <h3 className="font-semibold mt-4 mb-2">Core Courses</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Introduction to the Field</li>
                    <li>Advanced Research Methods</li>
                    <li>Professional Skills Development</li>
                    <li>Specialized Topics</li>
                  </ul>
                  
                  <h3 className="font-semibold mt-4 mb-2">Elective Courses</h3>
                  <p className="text-sm text-gray-600">
                    Students may choose from a variety of elective courses to customize their learning experience.
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Detailed curriculum information is not available. Please contact the university for more details.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Career Prospects */}
          <Card>
            <CardHeader>
              <CardTitle>Career Prospects</CardTitle>
            </CardHeader>
            <CardContent>
              {program.employment_prospects ? (
                <p className="text-gray-700">{program.employment_prospects}</p>
              ) : (
                <div>
                  <p className="text-gray-700 mb-3">
                    Graduates of this program typically pursue careers in various sectors including:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Industry-specific organizations</li>
                    <li>Research institutions</li>
                    <li>Government agencies</li>
                    <li>Educational institutions</li>
                    <li>Multinational corporations</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    The skills and knowledge gained from this program are highly valued by employers worldwide.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* Requirements */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Application Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {program.requirements ? (
                <div className="space-y-4">
                  {program.requirements.gpa && (
                    <div>
                      <h3 className="font-semibold mb-1">Academic Record</h3>
                      <p>{program.requirements.gpa}</p>
                    </div>
                  )}
                  
                  {program.requirements.language && (
                    <div>
                      <h3 className="font-semibold mb-1">Language Requirements</h3>
                      {program.requirements.language.english && (
                        <p>English: {program.requirements.language.english}</p>
                      )}
                      {program.requirements.language.chinese && (
                        <p>Chinese: {program.requirements.language.chinese}</p>
                      )}
                    </div>
                  )}
                  
                  {program.requirements.documents && (
                    <div>
                      <h3 className="font-semibold mb-1">Required Documents</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {program.requirements.documents.map((doc: string, index: number) => (
                          <li key={index}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Academic Record</h3>
                    <p>Bachelor's degree or equivalent in a related field with satisfactory grades</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-1">Language Requirements</h3>
                    <p>English: IELTS 6.5+ or TOEFL 90+</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-1">Required Documents</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Transcripts and Certificates</li>
                      <li>Letters of Recommendation</li>
                      <li>Personal Statement</li>
                      <li>CV/Resume</li>
                      <li>Passport Copy</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Start Dates */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Start Dates</CardTitle>
            </CardHeader>
            <CardContent>
              {program.start_dates && program.start_dates.length > 0 ? (
                <ul className="space-y-2">
                  {program.start_dates.map((date, index) => {
                    const startDate = new Date(date);
                    return (
                      <li key={index} className="flex items-center">
                        <span className="inline-block w-8 h-8 mr-2 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          {startDate.getDate()}
                        </span>
                        <span>
                          {startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500">Start date information is not available. Please contact the university for details.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Scholarships section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Available Scholarships</h2>
        
        {scholarships && scholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scholarship.type && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-medium capitalize">{scholarship.type}</span>
                      </div>
                    )}
                    
                    {scholarship.coverage && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Coverage:</span>
                        <span className="font-medium capitalize">{scholarship.coverage}</span>
                      </div>
                    )}
                    
                    {scholarship.application_deadline && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Deadline:</span>
                        <span className="font-medium">
                          {new Date(scholarship.application_deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full mt-4">Apply for Scholarship</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No scholarships available</h3>
            <p className="text-gray-500 mb-4">We couldn't find any scholarships for this program at the moment.</p>
            <Link href="/scholarships">
              <Button variant="outline">Browse All Scholarships</Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Similar Programs section - could be added in the future */}
    </div>
  )
} 