import { MEMORY_DB } from '../config';
import { UserEntry } from '../interfaces/users_interfaces'


export async function getUserByUsername(name: string): Promise<UserEntry | undefined> {
    return MEMORY_DB[name]
  }
  
export async function getUserByEmail(email: string): Promise<UserEntry | undefined> {
  const key = Object.keys(MEMORY_DB).find(
    key => MEMORY_DB[key].email === email
  )
  if (key) return MEMORY_DB[key];
  return key as undefined;
}

