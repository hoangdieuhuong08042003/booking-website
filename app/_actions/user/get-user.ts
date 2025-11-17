"use server";

import { auth } from "@/auth";

async function getUserId() {
  const data = await auth();
  return data?.user?.id;
}

async function getUserEmail() {
  const data = await auth();
  return data?.user?.email;
}
async function getUserImage() {
  const data = await auth();
  return data?.user?.image;
}

export { getUserId, getUserEmail, getUserImage };
