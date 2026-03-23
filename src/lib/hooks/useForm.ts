// Form hook
import { useState } from 'react';

export function useForm(initial: any) {
  const [values, setValues] = useState(initial);
  return { values, setValues };
}
