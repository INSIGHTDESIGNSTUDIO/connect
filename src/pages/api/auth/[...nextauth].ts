// src/pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail } from '@/lib/sqlite';

// Helper function to get bcryptjs - only import on server side
function getBcrypt() {
  return require('bcryptjs');
}

export const authOptions: NextAuthOptions = {
  // 1) your provider
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = getUserByEmail(credentials.email);
        if (!user) return null;

        const bcrypt = getBcrypt();
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        // fields returned here become part of `user` in jwt() callback
        return { id: user.id, email: user.email };
      },
    }),
  ],

  // 2) use JWT for sessions
  session: { strategy: 'jwt' },

  // 3) custom sign-in page
  pages: { signIn: '/admin' },

  // 4) secret for encrypting tokens
  secret: process.env.NEXTAUTH_SECRET || 'change-this-in-production',

  // 5) callbacks to persist `id` into session.user
  callbacks: {
    async jwt({ token, user }) {
      // on initial sign in, `user` will be defined
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
