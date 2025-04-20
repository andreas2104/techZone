export const mikrotikConfig = {
  host: process.env.NEXT_PUBLIC_MIKROTIK_HOST || '192.168.88.2',
  port: process.env.NEXT_PUBLIC_MIKROTIK_PORT || '8728',
  user: process.env.NEXT_PUBLIC_MIKROTIK_USER || '',
  password: process.env.NEXT_PUBLIC_MIKROTIK_PASSWORD || '',
};