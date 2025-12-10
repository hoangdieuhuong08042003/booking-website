import { authConfig } from "@/auth.config";
import getServerSession from "next-auth";
import { prisma } from "./prisma";

export async function getSession() {
    return await getServerSession(authConfig)
}

interface user { 
    id: string, 
    email: string 
} 
export async function getCurrentUser() {
 try {
    const session = await getSession();

    if ((
        !session as unknown as 
        { user: user
            
        })?.user) {
            return null
        }
        const user = await prisma.user.findUnique({
            where: {
                email: (session as unknown as user).email
            }
        })

        if (!user) {
            return null
        }

        return user;
 } catch (error) {
    console.log(error)
 }
}