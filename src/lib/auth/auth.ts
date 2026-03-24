// NextAuth configuration
import NextAuth from 'next-auth';

export const { auth, handlers, signIn, signOut } = NextAuth({});
