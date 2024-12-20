import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials : any) {
        // Find user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) {
          throw new Error("No user found with the given email.");
        } else{
          console.log("user found");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid password.");
        }

        return {
          id: "1",
          email: user.email,
          password: user.password
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log(user.id);
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token } : any) { //do check if id aa rha h ya nhi, wo type any krna tha yaha 
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages : {
    signIn : '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,

});

export {handler as GET, handler as POST};
