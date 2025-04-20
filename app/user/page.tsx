'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MikrotikAPI } from '@/lib/mikrotik';
import toast from 'react-hot-toast';

export default function SessionsPage() {
  const api = new MikrotikAPI();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading, isError, error } = useQuery({
    queryKey: ['sessions'], // clé de requête pour sessions User-Manager
    queryFn: () => api.getSessions(),
    retry: 2, // Tentatives de nouvelle requête en cas d'échec
    refetchInterval: 10000, // Rafraîchir toutes les 30 secondes
    onError: (err: Error) => {
      toast.error(err.message); // Affichage d'une erreur Toast
    }
  });

  const { mutate: terminateSession, isLoading: isPending } = useMutation({
    mutationFn: (id: string) => api.terminateSession(id),
    onSuccess: () => {
      toast.success('Session terminée avec succès');
      queryClient.invalidateQueries({ queryKey: ['sessions'] }); // Invalidation pour obtenir les nouvelles sessions
    },
    onError: (err: Error) => {
      toast.error(err.message); // Affichage d'une erreur Toast
    }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sessions Actives User-Manager</h1>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Chargement des sessions...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p>Erreur: {error?.message}</p>
          <p className="text-sm mt-2">Vérifiez la connexion au routeur et les identifiants</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">IP</th>
                <th className="p-3 text-left">Durée</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions?.map((session: any) => (
                <tr key={session['.id']} className="border-b hover:bg-gray-50">
                  <td className="p-3">{session.username}</td>
                  <td className="p-3">{session['remote-address']}</td>
                  <td className="p-3">{session.uptime}</td>
                  <td className="p-3">
                    <button
                      onClick={() => terminateSession(session['.id'])}
                      disabled={isPending}
                      className={`px-4 py-1 rounded text-white ${
                        isPending ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isPending ? 'En cours...' : 'Terminer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
