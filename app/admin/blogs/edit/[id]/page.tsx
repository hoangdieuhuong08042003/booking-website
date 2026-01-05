"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Camera, X, Loader2, ArrowLeft, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { getBlogById, updateBlog } from "@/app/_actions/blog/blog-actions";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "@/lib/image-upload-handler";
import Tiptap from "@/app/_components/wysiwyg/tiptap";

export default function EditBlogPage() {
  const { id } = useParams();
  const blogId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (!blogId) return;
    setLoading(true);
    getBlogById(blogId)
      .then((blog) => {
        if (blog) {
          setTitle(blog.title || "");
          setExcerpt(blog.excerpt || "");
          setContent(blog.content || "");
          setImageUrl(blog.imageUrl || null);
          setAuthor(blog.author || "");
        }
      })
      .catch(() => toast.error("Lỗi tải dữ liệu blog"))
      .finally(() => setLoading(false));
  }, [blogId]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      if (imageUrl) {
        try {
          await deleteImageFromCloudinary(imageUrl);
        } catch {
          // Ignore error, proceed to upload new image
        }
      }
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
      toast.success("Tải ảnh thành công");
    } catch {
      toast.error("Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    if (!imageUrl) return;
    setUploading(true);
    try {
      try {
        await deleteImageFromCloudinary(imageUrl);
      } catch {
        // Ignore error, proceed to remove image from UI
      }
      setImageUrl(null);
      toast.success("Đã xoá ảnh");
    } catch {
      toast.error("Xoá ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      await updateBlog(blogId, {
        title,
        excerpt,
        content,
        imageUrl,
        author,
      });
      toast.success("Cập nhật blog thành công!");
      router.back();
    } catch {
      toast.error("Cập nhật blog thất bại.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl bg-white rounded-xl mt-24 p-4 shadow dark:bg-[#3A3A3A] flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-black rounded-full hover:bg-gray-200 dark:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-md font-bold flex-1 text-center">Chỉnh sửa Blog</h1>
        <Button type="submit" className="px-6" disabled={uploading}>
          {uploading ? (
            <LoaderCircle className="animate-spin w-5 h-5" />
          ) : (
            "Lưu"
          )}
        </Button>
      </div>
      {/* Image Upload */}
      <div className="flex flex-col gap-2">
        <Label>Ảnh đại diện</Label>
        <div className="relative w-full aspect-video border rounded-lg overflow-hidden">
          {imageUrl ? (
            <>
              {/* Make the image clickable to upload a new image */}
              <label className="absolute inset-0 cursor-pointer">
                <Image
                  src={imageUrl}
                  alt="Blog Image"
                  fill
                  className="object-cover"
                />
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && uploadImage(e.target.files[0])
                  }
                  disabled={uploading}
                />
              </label>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 bg-white"
                onClick={removeImage}
                disabled={uploading}
              >
                <X />
              </Button>
            </>
          ) : (
            <label className="flex h-full items-center justify-center cursor-pointer">
              {uploading ? <Loader2 className="animate-spin" /> : <Camera />}
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files && uploadImage(e.target.files[0])
                }
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>
      {/* Title */}
      <div>
        <Label>Tiêu đề</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      {/* Excerpt */}
      <div>
        <Label>Tóm tắt</Label>
        <Input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>
      <div>
        <Label>Tác giả</Label>
        <Input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      {/* Content */}
      <div>
        <Label>Nội dung</Label>
        {/* Replace Textarea with Tiptap */}
        <Tiptap content={content} onChange={setContent} />
      </div>
      {/* Author */}
    </form>
  );
}
