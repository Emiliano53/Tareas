// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

// Extender tipos de NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
    };
  }
  interface JWT {
    id?: string;
    email?: string;
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email?.trim() || !credentials?.password?.trim()) {
            console.log('[AUTH] Missing credentials');
            return null;
          }

          const normalizedEmail = credentials.email.trim().toLowerCase();
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
          });

          if (!user) {
            console.log('[AUTH] User not found');
            return null;
          }

          console.log('[AUTH] Comparing passwords...');
          const isValid = await compare(credentials.password.trim(), user.password);
          console.log('[AUTH] Password valid:', isValid);

          if (!isValid) {
            console.log('[AUTH] Invalid password');
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email
          };
        } catch (error) {
          console.error('[AUTH] Error:', error);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };