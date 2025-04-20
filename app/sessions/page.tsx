import { useState } from 'react';
import { useMikrotikAPI } from '@/hooks/useMikrotikAPI';

const MikrotikSessionManager = () => {
  const { useGetSessions, useCreateSession, useTerminateSession } = useMikrotikAPI();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileName, setProfileName] = useState('default');

  // Utiliser les hooks React Query
  const { data: sessions, isLoading, isError, error } = useGetSessions();
  const createSessionMutation = useCreateSession();
  const terminateSessionMutation = useTerminateSession();

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSessionMutation.mutateAsync({
        username,
        password,
        profileName,
      });
      // Réinitialiser le formulaire après succès
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleTerminateSession = async (id: string) => {
    try {
      await terminateSessionMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  };

  if (isLoading) return <div>Chargement des sessions...</div>;
  if (isError) return <div>Erreur: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Gestionnaire de sessions Mikrotik</h2>
      
      {/* Formulaire de création de session */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-3">Créer une nouvelle session</h3>
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div>
            <label className="block mb-1">Nom d'utilisateur:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Mot de passe:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Profil:</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={createSessionMutation.isPending}
          >
            {createSessionMutation.isPending ? 'Création...' : 'Créer session'}
          </button>
          
          {createSessionMutation.isError && (
            <div className="text-red-500 mt-2">
              Erreur: {(createSessionMutation.error as Error).message}
            </div>
          )}
          
          {createSessionMutation.isSuccess && (
            <div className="text-green-500 mt-2">Session créée avec succès!</div>
          )}
        </form>
      </div>
      
      {/* Liste des sessions actives */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Sessions actives</h3>
        {sessions && sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Utilisateur</th>
                  <th className="py-2 px-4 border">Profil</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session: any) => (
                  <tr key={session['.id']}>
                    <td className="py-2 px-4 border">{session['.id']}</td>
                    <td className="py-2 px-4 border">{session.user}</td>
                    <td className="py-2 px-4 border">{session.profile}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleTerminateSession(session['.id'])}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        disabled={terminateSessionMutation.isPending}
                      >
                        Terminer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 text-center rounded">
            Aucune session active trouvée.
          </div>
        )}
      </div>
    </div>
  );
};

export default MikrotikSessionManager;