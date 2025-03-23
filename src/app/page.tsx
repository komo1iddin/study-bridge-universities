import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { UniversityCard } from '@/components/cards/UniversityCard'
import { Button } from '@/components/ui/button'
import { getUniversities } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Study Bridge - Find Your Perfect University in China',
  description: 'Find universities, programs and scholarships in China for international students',
}

export default async function Home() {
  // Fetch top universities (limit to 3 for the home page)
  const universities = await getUniversities()
  const topUniversities = universities.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Perfect University in China
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Explore top universities, programs, and scholarships to study in China.
                Get all the information you need in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/universities">
                  <Button size="lg">Browse Universities</Button>
                </Link>
                <Link href="/programs">
                  <Button size="lg" variant="outline">Explore Programs</Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              {/* Placeholder for hero image - replace with actual image */}
              <div className="bg-slate-200 rounded-lg h-80 w-full flex items-center justify-center">
                <span className="text-slate-500">Hero Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Universities section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Top Universities</h2>
              <p className="text-gray-500">Discover popular universities in China</p>
            </div>
            <Link href="/universities">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topUniversities.map(university => (
              <UniversityCard
                key={university.id}
                university={university}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why Choose Study Bridge
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">🏛️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Information</h3>
              <p className="text-gray-600">
                Detailed profiles of universities, programs, and scholarships all in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Find the perfect university and program with our powerful filters.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Application Tracking</h3>
              <p className="text-gray-600">
                Track your applications and stay updated on their status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Study Journey in China?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Create an account to save your favorite programs, track applications, and get personalized recommendations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary">Sign Up Now</Button>
            </Link>
            <Link href="/universities">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Browse Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
