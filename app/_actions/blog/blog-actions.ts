"use server";

import { prisma } from "@/lib/prisma";
import type { Blog } from "@prisma/client";

// Create a new blog post
export async function createBlog(data: {
  title: string;
  excerpt?: string | null;
  content: string;
  imageUrl?: string | null;
  author?: string | null;
  publishedAt?: Date | string;
}) {
  const blog = await prisma.blog.create({
    data: {
      title: data.title,
      excerpt: data.excerpt ?? null,
      content: data.content,
      imageUrl: data.imageUrl ?? null,
      author: data.author ?? null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
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
export async function getBlogs(): Promise<Blog[]> {
  return prisma.blog.findMany({
    orderBy: [
      { publishedAt: "desc" },
      { id: "desc" }
    ],
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
  }) as unknown as Blog[];
}

// Get a single blog post by ID
export async function getBlogById(id: string): Promise<Blog | null> {
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
  }) as unknown as Blog | null;
}

// Update a blog post
export async function updateBlog(
  id: string,
  data: {
    title?: string;
    excerpt?: string | null;
    content?: string;
    imageUrl?: string | null;
    author?: string | null;
    publishedAt?: Date | string;
  }
): Promise<Blog> {
  const updated = await prisma.blog.update({
    where: { id },
    data: {
      ...data,
      excerpt: data.excerpt ?? null,
      imageUrl: data.imageUrl ?? null,
      author: data.author ?? null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
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
  return updated as Blog;
}

// Delete a blog post
export async function deleteBlog(id: string): Promise<Pick<Blog, "id">> {
  return prisma.blog.delete({
    where: { id },
    select: { id: true },
  }) as unknown as Pick<Blog, "id">;
}