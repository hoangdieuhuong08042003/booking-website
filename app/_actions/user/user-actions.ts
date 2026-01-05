"use server";

import { prisma } from "@/lib/prisma";

import bcrypt, { compare } from "bcryptjs";
import { getUserId } from "./get-user";
import { User, Prisma } from "@prisma/client";

const UserExceptPasswordQuery = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true, // <-- Add this line
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

// ADMIN: Lấy danh sách user (có tìm kiếm, phân trang)
async function adminListUsers({
  pageIndex = 0,
  pageSize = 20,
  search = "",
}: {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
}) {
  const where =
    search && search.trim()
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

  const total = await prisma.user.count({ where });
  const users = await prisma.user.findMany({
    where,
    skip: pageIndex * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    select: UserExceptPasswordQuery,
  });

  // Đảm bảo luôn trả về mảng users (không phải null/undefined)
  return { users: users ?? [], total };
}

// ADMIN: Tạo user
async function adminCreateUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "USER",
      emailVerified: new Date(),
    },
    select: UserExceptPasswordQuery,
  });
}

// ADMIN: Sửa user
async function adminUpdateUser(
  id: string,
  data: Partial<Omit<User, "password">> & { password?: string }
) {
  const updateData: Prisma.UserUpdateInput = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  } else {
    delete updateData.password;
  }
  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: UserExceptPasswordQuery,
  });
}

// ADMIN: Xóa user
async function adminDeleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
    select: UserExceptPasswordQuery,
  });
}

export {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByIds,
  updateUser,
  changePassword,
  deleteUser,
  adminListUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
};
