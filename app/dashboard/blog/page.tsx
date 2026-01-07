"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogsPaginated } from "@/app/_actions/blog/blog-actions";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Blog } from "@prisma/client";

const PAGE_SIZE = 9;

export default function BlogListPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    getBlogsPaginated({ pageIndex, pageSize: PAGE_SIZE }).then((res) => {
      setBlogs(res.blogs);
      setTotal(res.total);
    });
  }, [pageIndex]);

  return (
    <div className="min-h-screen bg-background max-w-7xl mx-auto">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-10 text-primary tracking-tight text-center">
          Khám phá Blog Du Lịch
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/dashboard/blog/${blog.id}`}
              className="group block rounded-3xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 w-full overflow-hidden">
                {blog.imageUrl ? (
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover w-full h-full rounded-t-3xl group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-5xl text-gray-300 bg-gray-200">
                    <span>📝</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300 rounded-t-3xl" />
              </div>
              <div className="p-6 flex flex-col gap-2">
                <h2 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-base text-muted-foreground mb-2 line-clamp-3">
                    {blog.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                    {blog.author ? blog.author[0].toUpperCase() : "?"}
                  </div>
                  <div className="flex flex-col text-xs text-muted-foreground">
                    {blog.author && (
                      <span className="font-medium">{blog.author}</span>
                    )}
                    <span>
                      {new Date(blog.publishedAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPageIndex((prev) => Math.max(prev - 1, 0));
                  }}
                  aria-disabled={pageIndex === 0 || totalPages <= 1}
                />
              </PaginationItem>
              {Array.from({ length: Math.max(totalPages, 1) }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    href="#"
                    isActive={idx === pageIndex}
                    onClick={(e) => {
                      e.preventDefault();
                      setPageIndex(idx);
                    }}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
                  }}
                  aria-disabled={
                    pageIndex === totalPages - 1 || totalPages <= 1
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
