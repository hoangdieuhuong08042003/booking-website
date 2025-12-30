"use server";

import { prisma } from "@/lib/prisma";

// Create a new blog post
export async function createBlog(data: {
  title: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: Date;
}) {
  const blog = await prisma.blog.create({
    data: {
      ...data,
      publishedAt: data.publishedAt ?? new Date(),
    },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      author: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
  return blog;
}

// Get all blog posts
export async function getBlogs() {
  return prisma.blog.findMany({
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      author: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
}

// Get a single blog post by ID
export async function getBlogById(id: string) {
  return prisma.blog.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      author: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
}

// Update a blog post
export async function updateBlog(id: string, data: {
  title?: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: Date;
}) {
  const updated = await prisma.blog.update({
    where: { id },
    data,
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      author: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
  return updated;
}

// Delete a blog post
export async function deleteBlog(id: string) {
  return prisma.blog.delete({
    where: { id },
    select: { id: true },
  });
}