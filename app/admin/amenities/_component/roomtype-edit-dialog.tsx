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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formSchema } from "../../_component/create-dialog";

const roomTypeFormSchema = formSchema.extend({
  desc: z.string().optional(),
});

interface RoomTypeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomType: { id: string; name: string; desc?: string | null } | null;
  onUpdate: (
    id: string,
    data: { name: string; desc?: string }
  ) => Promise<void>;
}

export default function RoomTypeEditDialog({
  open,
  onOpenChange,
  roomType,
  onUpdate,
}: RoomTypeEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof roomTypeFormSchema>>({
    resolver: zodResolver(roomTypeFormSchema),
    defaultValues: {
      name: roomType?.name || "",
      desc: roomType?.desc || "",
    },
  });

  useEffect(() => {
    if (roomType) {
      form.reset({ name: roomType.name, desc: roomType.desc || "" });
    }
  }, [roomType, form]);

  const onSubmit = async (values: z.infer<typeof roomTypeFormSchema>) => {
    if (!roomType) return;
    setIsSubmitting(true);
    try {
      await onUpdate(roomType.id, { name: values.name, desc: values.desc });
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error("Cập nhật kiểu phòng thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa kiểu phòng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên kiểu phòng</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
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
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
