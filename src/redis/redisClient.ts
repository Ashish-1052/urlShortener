import { createClient, type RedisClientType } from 'redis';

class RedisClient {
  private isConnected: boolean = false;
  private client: RedisClientType;

  constructor() {
    this.connect();
    this.client = createClient({
      url: 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD // Good practice: use environment variables
    });;
  }

  async connect() {
    this.client.connect();
    
    this.client.on('connect', () => {
      this.isConnected = true;
      console.info('✅ Redis connected successfully');
    });

    this.client.on('error', (error) => {
      this.isConnected = false;
      console.error('❌ Redis connection error:', error);
    });

    this.client.on('close', () => {
      this.isConnected = false;
      console.warn('Redis connection closed');
    });
  }

  async get(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) {
      console.warn('Redis not available, skipping get');
      return null;
    }
    try {
      return await this.client.get(key);
    } catch (e) {
      console.error('Redis GET error', { key, e });
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      console.warn('Redis not available, skipping get');
      return false;
    }
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', { key, error });
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      console.warn('Redis not available, skipping get');
      return false;
    }
    try {
      await this.client.del(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', { key, error });
      return false;
    }
  }

  isReady(): boolean {
    return this.isConnected;
  }

  /**
   * Get raw Redis client (use sparingly)
   */
  getClient(): RedisClientType | null {
    return this.client;
  }
}

export default new RedisClient();