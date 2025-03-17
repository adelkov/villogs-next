'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SleepLog from '../components/logs/SleepLog';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

interface SleepLogType {
  id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

interface GroupedSleepLogs {
  [key: string]: SleepLogType[];
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
        credentials: 'include',
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
    if (status === 'authenticated' && session?.user?.id) {
      fetchSleepLogs();
    }
  }, [status, session]);

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

  // Group sleep logs by date
  const groupedLogs = sleepLogs.reduce<GroupedSleepLogs>((groups, log) => {
    const date = parseISO(log.started_at);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(log);
    return groups;
  }, {});

  // Format date for display
  const formatDateHeading = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'EEEE, MMMM d');
  };

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Sleep Logs</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="space-y-8">
        {Object.entries(groupedLogs)
          .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
          .map(([date, logs]) => (
            <div key={date} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-300 border-b border-gray-800 pb-2">
                {formatDateHeading(date)}
              </h2>
              <div className="space-y-4">
                {logs
                  .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
                  .map((log) => (
                    <SleepLog
                      key={log.id}
                      id={log.id}
                      startedAt={log.started_at}
                      endedAt={log.ended_at}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
      
      {loading && (
        <div className="text-center py-4">
          Loading more sleep logs...
        </div>
      )}
      
      {hasMore && !loading && (
        <div className="text-center py-4">
          <button
            onClick={fetchSleepLogs}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors border border-gray-700"
          >
            Load More
          </button>
        </div>
      )}
      
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