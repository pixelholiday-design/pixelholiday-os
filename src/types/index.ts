// TypeScript types
export type User = {
  id: string;
  email: string;
  role: string;
};

export type Session = {
  user: User;
};
