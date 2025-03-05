import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session - Missing user ID' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 10;

    // Debug log
    console.log('Fetching sleep logs:', {
      userId,
      babyId: params.id,
      page,
      pageSize
    });

    // Verify user has access to this baby
    const babyUser = await prisma.baby_user.findFirst({
      where: {
        baby_id: BigInt(params.id),
        user_id: BigInt(userId),
      },
    });

    if (!babyUser) {
      console.log('No baby access found for:', { userId, babyId: params.id });
      return NextResponse.json({ error: 'Unauthorized - No access to this baby' }, { status: 401 });
    }

    const sleepLogs = await prisma.sleep_logs.findMany({
      where: {
        baby_id: BigInt(params.id),
      },
      orderBy: {
        started_at: 'desc',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      select: {
        id: true,
        started_at: true,
        ended_at: true,
        created_at: true,
      }
    });

    // Convert BigInt to string in the response
    const serializedLogs = sleepLogs.map(log => ({
      ...log,
      id: log.id.toString(),
      created_at: log.created_at?.toISOString() || null,
    }));

    return NextResponse.json({ sleepLogs: serializedLogs });
  } catch (error) {
    console.error('Error fetching sleep logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 