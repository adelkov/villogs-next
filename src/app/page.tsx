import Image from "next/image";
import Link from "next/link";

// Add this interface at the top of the file
interface Baby {
  id: string;  // Now a string since we converted it in the API
  name: string;
  date_of_birth: string;
}

async function getBabies() {
  // Get the base URL from environment or default to localhost in development
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : '';

  const res = await fetch(`${baseUrl}/api/babies`, { 
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!res.ok) {
    throw new Error(`Failed to fetch babies: ${res.statusText}`)
  }
  
  return res.json()
}

export default async function Home() {
  const babies = await getBabies() as Baby[]

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-2xl font-bold">Baby Activity Monitor</h1>
        
        <div className="w-full">
          <h2 className="text-xl mb-4">Registered Babies</h2>
          {babies.length === 0 ? (
            <p className="text-gray-500">No babies registered yet.</p>
          ) : (
            <ul className="space-y-4">
              {babies.map((baby: Baby) => (
                <Link 
                  href={`/babies/${baby.id}`} 
                  key={baby.id}
                >
                  <li className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                    <h3 className="font-semibold">{baby.name}</h3>
                    <p className="text-sm text-gray-500">Born: {baby.date_of_birth}</p>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
