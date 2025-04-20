import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type CreateSessionParams = {
  username: string;
  password: string;
  profileName: string;
};

export const useMikrotikAPI = () => {
  const queryClient = useQueryClient();

  // Récupérer toutes les sessions
  const getSessions = async () => {
    const response = await fetch('/api/mikrotik/sessions');
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    const data = await response.json();
    return data.sessions;
  };

  // Créer une nouvelle session utilisateur
  const createSession = async ({ username, password, profileName }: CreateSessionParams) => {
    const response = await fetch('/api/mikrotik/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, profileName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create session');
    }

    return response.json();
  };

  // Terminer une session
  const terminateSession = async (id: string) => {
    const response = await fetch(`/api/mikrotik/sessions?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to terminate session');
    }

    return response.json();
  };

  // Hook pour récupérer les sessions
  const useGetSessions = () => {
    return useQuery({
      queryKey: ['mikrotik-sessions'],
      queryFn: getSessions,
    });
  };

  // Hook pour créer une session
  const useCreateSession = () => {
    return useMutation({
      mutationFn: createSession,
      onSuccess: () => {
        // Invalider le cache et forcer un refresh des données
        queryClient.invalidateQueries({ queryKey: ['mikrotik-sessions'] });
      },
    });
  };

  // Hook pour terminer une session
  const useTerminateSession = () => {
    return useMutation({
      mutationFn: terminateSession,
      onSuccess: () => {
        // Invalider le cache et forcer un refresh des données
        queryClient.invalidateQueries({ queryKey: ['mikrotik-sessions'] });
      },
    });
  };

  return {
    useGetSessions,
    useCreateSession,
    useTerminateSession,
  };
};