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

interface AmenityEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amenity: { id: string; name: string } | null;
  onUpdate: (id: string, name: string) => Promise<void>;
}

export default function AmenityEditDialog({
  open,
  onOpenChange,
  amenity,
  onUpdate,
}: AmenityEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: amenity?.name || "",
    },
  });

  // Update form values when amenity changes
  useEffect(() => {
    if (amenity) {
      form.reset({ name: amenity.name });
    }
  }, [amenity, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!amenity) return;

    setIsSubmitting(true);
    try {
      await onUpdate(amenity.id, values.name);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("アメニティの更新に失敗しました。", error);
      toast.error("アメニティの更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>アメニティを編集</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
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
                キャンセル
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "更新中..." : "更新"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
