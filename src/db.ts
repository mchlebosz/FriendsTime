import { openDB } from 'idb'

const DB_NAME = 'world-clock-db'
const STORE_NAME = 'clocks'

export interface ClockEntry {
  id: string
  zone: string
  tags?: string[]
}

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

export async function getClocks(): Promise<ClockEntry[]> {
  const db = await getDB()
  return db.getAll(STORE_NAME)
}

export async function saveClock(clock: ClockEntry): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, clock)
}

export async function deleteClock(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}
