import axios from 'axios';

const mikrotikUrl = process.env.MIKROTIK_HOST;
const username = process.env.MIKROTIK_USERNAME;
const password = process.env.MIKROTIK_PASSWORD;

if (!mikrotikUrl || !username || !password) {
  throw new Error('Les variables d\'environnement MIKROTIK_HOST, MIKROTIK_USERNAME et MIKROTIK_PASSWORD doivent être définies.');
}

const mikrotikAuth = { username, password };

export async function getSessions() {
  try {
    const response = await axios.post(
      `${mikrotikUrl}/ppp/active/print`,
      {
        ".proplist": ["name", "address", "uptime", "caller-id"]
      },
      {
        auth: mikrotikAuth
      }
    );

    return response.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des sessions :", err);
    return [];
  }
}
