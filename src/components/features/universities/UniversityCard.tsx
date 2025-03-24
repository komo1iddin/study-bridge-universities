
import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { University } from '@/types/database.types'
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MapPin, Award, BookOpen, GraduationCap, ChevronRight, School } from 'lucide-react'

interface UniversityCardProps {
  university: University
  variant?: 'default' | 'compact' // compact variant for listing pages, default for detailed view
}

export const UniversityCard: FC<UniversityCardProps> = ({
  university,
  variant = 'default'
}) => {
  const {
    id,
    name,
    chinese_name,
    logo_url,
    province,
    city,
    ranking,
    type,
    specialization,
    has_english_programs,
    description
  } = university

  // Get first letter of university name for avatar fallback
  const avatarFallback = name.substring(0, 2).toUpperCase()

  // Function to truncate description if it's too long
  const truncateDescription = (desc: string | null | undefined, maxLength: number) => {
    if (!desc) return ''
    return desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc
  }

  if (variant === 'compact') {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200">
        <Link href={`/universities/${id}`}>
          <div className="flex">
            <div className="w-28 h-28 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 transform group-hover:scale-105 transition-transform duration-500"></div>
              {logo_url ? (
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                  <AvatarImage src={logo_url} alt={name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">{avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-blue-100 text-blue-700">{avatarFallback}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{name}</h3>
                  {chinese_name && <p className="text-sm text-gray-500 mt-0.5">{chinese_name}</p>}
                </div>
                {ranking && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {ranking}
                  </Badge>
                )}
              </div>
              <div className="flex items-center mt-3 text-sm text-gray-600 gap-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {city}, {province}
                </span>
                <span className="flex items-center gap-1">
                  <School className="w-4 h-4 text-gray-400" />
                  <span className="capitalize">{type}</span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200">
      <Link href={`/universities/${id}`}>
        <div className="h-44 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 transform group-hover:scale-105 transition-transform duration-500"></div>
          {logo_url ? (
            <Avatar className="h-28 w-28 border-4 border-white shadow-md">
              <AvatarImage src={logo_url} alt={name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">{avatarFallback}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-28 w-28 border-4 border-white shadow-md">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">{avatarFallback}</AvatarFallback>
            </Avatar>
          )}
          {ranking && (
            <Badge className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm shadow-sm">
              <Award className="w-3.5 h-3.5 mr-1" />
              Rank: {ranking}
            </Badge>
          )}
        </div>
        <CardHeader className="pb-3">
          <div className="space-y-1.5">
            <CardTitle className="group-hover:text-blue-600 transition-colors">{name}</CardTitle>
            {chinese_name && <CardDescription className="text-base">{chinese_name}</CardDescription>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5 capitalize">
              <School className="w-3.5 h-3.5" />
              {type}
            </Badge>
            {has_english_programs && (
              <Badge variant="outline" className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                English Programs
              </Badge>
            )}
            {specialization && specialization.slice(0, 2).map(spec => (
              <Badge key={spec} variant="secondary" className="capitalize">
                {spec}
              </Badge>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              {city}, {province}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {truncateDescription(description, 100)}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors gap-2">
            View University
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}