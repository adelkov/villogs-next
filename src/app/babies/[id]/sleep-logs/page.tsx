'use client';

import { useEffect, useState, use } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SleepLog from '../components/logs/SleepLog';

interface SleepLogType {
  id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

export default function SleepLogsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [sleepLogs, setSleepLogs] = useState<SleepLogType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView();

  useEffect(() => {
    // Debug session state
    console.log('Session state:', {
      status,
      userId: session?.user?.id,
      isAuthenticated: status === 'authenticated'
    });
  }, [session, status]);

  const fetchSleepLogs = async () => {
    if (loading || !hasMore || status !== 'authenticated' || !session?.user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/babies/${resolvedParams.id}/sleep-logs?page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sleep logs');
      }
      
      if (data.sleepLogs.length === 0) {
        setHasMore(false);
      } else {
        setSleepLogs(prev => [...prev, ...data.sleepLogs]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching sleep logs:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch sleep logs');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView && status === 'authenticated' && session?.user?.id) {
      fetchSleepLogs();
    }
  }, [inView, status, session]);

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const handleEdit = async (id: string, startedAt: string, endedAt: string | null) => {
    try {
      const response = await fetch(`/api/babies/${resolvedParams.id}/sleep-logs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ startedAt, endedAt }),
      });

      if (!response.ok) {
        throw new Error('Failed to update sleep log');
      }

      // Update the local state
      setSleepLogs(prev => prev.map(log => 
        log.id === id ? { ...log, started_at: startedAt, ended_at: endedAt } : log
      ));
    } catch (error) {
      console.error('Error updating sleep log:', error);
      setError('Failed to update sleep log');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/babies/${resolvedParams.id}/sleep-logs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete sleep log');
      }

      // Remove the deleted log from the local state
      setSleepLogs(prev => prev.filter(log => log.id !== id));
    } catch (error) {
      console.error('Error deleting sleep log:', error);
      setError('Failed to delete sleep log');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Sleep Logs</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {sleepLogs.map((log) => (
          <SleepLog
            key={log.id}
            id={log.id}
            startedAt={log.started_at}
            endedAt={log.ended_at}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        
        {loading && (
          <div className="text-center py-4">
            Loading more sleep logs...
          </div>
        )}
        
        <div ref={ref} className="h-10" />
      </div>
      
      {!hasMore && sleepLogs.length > 0 && (
        <p className="text-center text-gray-600 mt-4">
          No more sleep logs to load
        </p>
      )}
      
      {!hasMore && sleepLogs.length === 0 && !error && (
        <p className="text-center text-gray-600 mt-4">
          No sleep logs found
        </p>
      )}
    </div>
  );
}