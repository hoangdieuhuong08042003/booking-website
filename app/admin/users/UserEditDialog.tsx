"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { User as PrismaUser } from "@prisma/client";

const userEditSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["user", "admin"]),
});

export type UserEditFormValues = z.infer<typeof userEditSchema>;

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: PrismaUser | null;
  onEdit: (data: UserEditFormValues) => Promise<void>;
}

export default function UserEditDialog({
  open,
  onOpenChange,
  user,
  onEdit,
}: UserEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role?.toLowerCase() === "admin" ? "admin" : "user",
    },
  });

  // Reset form values when user changes
  useEffect(() => {
    form.reset({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role?.toLowerCase() === "admin" ? "admin" : "user",
    });
  }, [user, form]);

  const onSubmit = async (values: UserEditFormValues) => {
    setIsSubmitting(true);
    try {
      await onEdit(values);
      onOpenChange(false);
      toast.success("Cập nhật user thành công");
    } catch {
      toast.error("Cập nhật user thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quyền</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
