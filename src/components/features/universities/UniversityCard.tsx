'use client'

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
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <Link href={`/universities/${id}`}>
          <div className="flex">
            <div className="w-24 h-24 flex items-center justify-center bg-slate-100">
              {logo_url ? (
                <Avatar className="h-14 w-14">
                  <AvatarImage src={logo_url} alt={name} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-14 w-14">
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{name}</h3>
                  {chinese_name && <p className="text-sm text-gray-500">{chinese_name}</p>}
                </div>
                {ranking && (
                  <Badge variant="outline" className="ml-2">
                    Rank: {ranking}
                  </Badge>
                )}
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>{city}, {province}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{type}</span>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link href={`/universities/${id}`}>
        <div className="h-40 bg-slate-100 flex items-center justify-center relative">
          {logo_url ? (
            <Avatar className="h-24 w-24">
              <AvatarImage src={logo_url} alt={name} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-24 w-24">
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          )}
          {ranking && (
            <Badge className="absolute top-2 right-2">
              Rank: {ranking}
            </Badge>
          )}
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{name}</CardTitle>
              {chinese_name && <CardDescription>{chinese_name}</CardDescription>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex flex-wrap gap-1">
            <Badge variant="outline" className="capitalize">{type}</Badge>
            {has_english_programs && <Badge variant="outline">English Programs</Badge>}
            {specialization && specialization.slice(0, 2).map(spec => (
              <Badge key={spec} variant="secondary" className="capitalize">{spec}</Badge>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-2">{city}, {province}</p>
          <p className="text-sm">{truncateDescription(description, 100)}</p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" className="w-full">View University</Button>
        </CardFooter>
      </Link>
    </Card>
  )
} 