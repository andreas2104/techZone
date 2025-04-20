import { RouterOSAPI } from 'node-routeros';
import { mikrotikConfig } from './config';

export class MikrotikAPI {
  private api: RouterOSAPI;

  constructor() {
    this.api = new RouterOSAPI({
      host: mikrotikConfig.host,
      user: mikrotikConfig.user,
      password: mikrotikConfig.password,
      port: 8728,
    });
  }


  async connect() {
    try {
      await this.api.connect();
      console.log('Connected to Mikrotik RouterOS API');
      return true;
    } catch (error) {
      console.error('Failed to connect to Mikrotik:', error);
      throw error;
    }
  }


  async disconnect() {
    try {
      await this.api.close();
      console.log('Disconnected from Mikrotik RouterOS API');
    } catch (error) {
      console.error('Error during disconnection:', error);
    }
  }

 
  async createUserSession(username: string, password: string, profileName: string) {
    try {
      await this.connect();
      
      const existingUsers = await this.api.write('/tool/user-manager/user/print', [
        '=.proplist=name',
        `?name=${username}`
      ]);

      if (existingUsers.length === 0) {
        await this.api.write('/tool/user-manager/user/add', [
          `=name=${username}`,
          `=password=${password}`,
          `=shared-users=1`
        ]);
      }

      const session = await this.api.write('/tool/user-manager/session/add', [
        `=customer=${username}`,
        `=user=${username}`,
        `=password=${password}`,
        `=profile=${profileName}`
      ]);

      await this.disconnect();
      return session;
    } catch (error) {
      console.error('Error creating user session:', error);
      await this.disconnect();
      throw error;
    }
  }

 
  async getActiveSessions() {
    try {
      await this.connect();
      const sessions = await this.api.write('/tool/user-manager/session/print');
      await this.disconnect();
      return sessions;
    } catch (error) {
      console.error('Error getting active sessions:', error);
      await this.disconnect();
      throw error;
    }
  }


  async terminateSession(id: string) {
    try {
      await this.connect();
      await this.api.write('/tool/user-manager/session/remove', [
        `=.id=${id}`
      ]);
      await this.disconnect();
      return { success: true, message: `Session ${id} terminated successfully` };
    } catch (error) {
      console.error(`Error terminating session ${id}:`, error);
      await this.disconnect();
      throw error;
    }
  }
}
