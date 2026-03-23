// Auth hook
import { useSession } from 'next-auth/react';

export function useAuth() {
  return useSession();
}
