import { auth } from "@/auth";
import { prisma } from "./prisma";

export async function getSession() {
    return await auth()
}

export async function getCurrentUser() {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        console.log(error)
    }
}