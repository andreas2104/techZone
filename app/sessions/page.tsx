'use client'
import { useQuery } from '@tanstack/react-query';

type Session = {
  name: string;
  address: string;
  uptime: string;
  'caller-id': string;
};

const fetchSessions = async (): Promise<Session[]> => {
  const response = await fetch('/api/sessions');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des sessions.');
  }
  return response.json();
};

export default function SessionList() {
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des sessions.</p>;

  if (!sessions || sessions.length === 0) {
    return <p>Aucune session active trouvée.</p>;
  }

  return (
    <div>
      <h1>Sessions PPP Actives</h1>
      <ul>
        {sessions.map((session, index) => (
          <li key={index}>
            {session.name} ({session.address}) - {session.uptime} - {session['caller-id']}
          </li>
        ))}
      </ul>
    </div>
  );
}
