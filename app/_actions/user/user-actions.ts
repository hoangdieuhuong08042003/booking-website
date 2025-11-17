"use server";

import { prisma } from "@/lib/prisma";

import bcrypt, { compare } from "bcryptjs";
import { getUserId } from "./get-user";
import { User } from "@prisma/client";


const UserExceptPasswordQuery = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  occupation: true,
  experience: true,
  description: true,
  image: true,
  language: true,
  createdAt: true,
  updatedAt: true,
  role: true,
};

async function createUser(name: string, email: string, password: string) {
  return await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
      emailVerified: new Date(),
    },
  });
}

async function getUserByEmail(
  email: string
): Promise<Omit<User, "password"> | null> {
  try {
    return await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: UserExceptPasswordQuery,
    });
  } catch {
    return null;
  }
}

async function getUserById(id: string): Promise<Omit<User, "password"> | null> {
  try {
    return await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: UserExceptPasswordQuery,
    });
  } catch {
    return null;
  }
}

async function getUserByIds(
  ids: string[]
): Promise<Omit<User, "password">[] | null> {
  try {
    return await prisma.user.findMany({
      where: {
        id: { in: ids },
      },
      select: UserExceptPasswordQuery,
    });
  } catch {
    return null;
  }
}

async function updateUser(data: Partial<User>): Promise<User> {
  const id = await getUserId();
  return await prisma.user.update({
    where: { id },
    data: { ...data, updatedAt: new Date() },
  });
}
async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    if (!email || !currentPassword || !newPassword) {
      return {
        success: false,
        error: "すべてのフィールドを入力してください。",
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error:
          "Googleでログインしているため、パスワードを変更することは不可能です。",
      };
    }

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return { success: false, error: "現在のパスワードが正しくありません。" };
    }

    if (currentPassword === newPassword) {
      return {
        success: false,
        error: "新しいパスワードは現在のパスワードと異なる必要があります。",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    console.error("Password change error:", error);
    return {
      success: false,
      error: "パスワードの変更中にエラーが発生しました。",
    };
  }
}

async function deleteUser(id: string): Promise<User> {
  return await prisma.user.delete({ where: { id } });
}

export {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByIds,
  updateUser,
  changePassword,
  deleteUser,
};
