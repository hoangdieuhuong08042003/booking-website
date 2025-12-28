import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";
import { Adapter } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { email: email as string },
        });

        if (!user || !user.password) return null;
        const passwordsMatch = await bcrypt.compare(
          password as string,
          user.password as string
        );
        if (passwordsMatch) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.phone = session.user.phone;
        token.image = session.user.image;
        token.role = session.user.role;
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;

        token.image = user.image;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
        
          image: token.image as string,
          role: token.role as string,
        };
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}`;
    },
  },
  
  secret: process.env.AUTH_SECRET,
});