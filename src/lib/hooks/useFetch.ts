// Fetch hook
import { useEffect, useState } from 'react';

export function useFetch(url: string) {
  const [data, setData] = useState(null);
  return { data };
}
