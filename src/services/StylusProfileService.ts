
import { openDB } from 'idb';
import { StylusProfile } from '@/types/core/StylusProfile';

const DB_NAME = 'stylus_profiles_db';
const STORE_NAME = 'profiles';
const DB_VERSION = 1;

export class StylusProfileService {
  private async getDB() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }

  async saveProfile(profile: StylusProfile): Promise<void> {
    const db = await this.getDB();
    await db.put(STORE_NAME, profile);
  }

  async getProfile(id: string): Promise<StylusProfile | undefined> {
    const db = await this.getDB();
    return db.get(STORE_NAME, id);
  }

  async getAllProfiles(): Promise<StylusProfile[]> {
    const db = await this.getDB();
    return db.getAll(STORE_NAME);
  }

  async deleteProfile(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(STORE_NAME, id);
  }
}

export const stylusProfileService = new StylusProfileService();
