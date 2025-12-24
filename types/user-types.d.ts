import { DefaultSession, DefaultUser, JWT as DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
  
    image: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    id: string;
    accessToken: string;
    name: string;
    email: string;
   
    image: string | null;
    role: string;
  }
}