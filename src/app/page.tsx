import Link from "next/link"
import { IconPlus } from '@tabler/icons-react'
import { prisma } from '@/lib/prisma'
import { convertBigIntsToStrings } from '@/utils/prisma'


async function getBabies() {
  const babies = await prisma.babies.findMany({
    orderBy: { created_at: 'desc' }
  })
  
  const convertedBabies = convertBigIntsToStrings(babies)
  return convertedBabies
}


export default async function Home() {
  const babies = await getBabies()

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-100">Baby Tracker</h1>
          <p className="text-gray-400">Track your baby&apos;s daily activities</p>
        </header>

        <div className="grid gap-4">
          {babies.map(baby => (
            <Link 
              key={baby.id}
              href={`/babies/${baby.id}`}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 
                hover:bg-gray-800 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-100 group-hover:text-white">
                    {baby.name || 'Unnamed Baby'}
                  </h2>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">
                    Click to view activities
                  </p>
                </div>
                <div className="bg-gray-800 p-2 rounded-full group-hover:bg-gray-700">
                  <IconPlus className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
