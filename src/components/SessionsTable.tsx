'use client';
import { useCallback, useEffect, useState } from 'react';
import { MikrotikAPI } from '@/lib/mikrotik';
import toast from 'react-hot-toast';

interface Session {
  '.id': string;
  username: string;
  'remote-address': string;
  uptime: string;
}

export default function SessionsTable() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = new MikrotikAPI();

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getSessions();
      setSessions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  const handleTerminate = async (id: string) => {
    try {
      await api.terminateSession(id);
      toast.success('Session terminée avec succès');
      await fetchSessions(); // Rafraîchir la liste
    } catch (err: any) {
      toast.error(`Échec: ${err.message}`);
    }
  };

  const formatUptime = (uptime: string) => {
    // Convertir le format MikroTik (ex: 1d5h30m15s) en plus lisible
    return uptime.replace(/(\d+d)?(\d+h)?(\d+m)?(\d+s)?/, '$1 $2 $3 $4').trim();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sessions Actives</h2>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Chargement...' : 'Rafraîchir'}
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr key={session['.id']} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session['remote-address']}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatUptime(session.uptime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleTerminate(session['.id'])}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        Terminer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    {loading ? 'Chargement des sessions...' : 'Aucune session active'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}