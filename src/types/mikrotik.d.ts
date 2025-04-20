interface MikrotikConfig {
  host: string;
  user: string;
  password: string;
  port?: number;
  secure?: boolean;
}

interface MikrotikSession {
  '.id': string;
  user: string;
  address: string;
  uptime: string;
  'bytes-in'?: string;
  'bytes-out'?: string;
}

export type { MikrotikConfig, MikrotikSession };