import { SiteRole } from "@prisma/client";
import { useState, useCallback } from "react";
import { z } from "zod";

// Form validation schema factory - takes existing pages for duplicate checking
export const createPageSchema = (
  existingPages: Array<{ pageName: string; domain?: string; id?: string }> = []
) =>
  z.object({
    pageName: z
      .string()
      .min(1, "サイト名は必須です")
      .max(100, "サイト名は100文字以内で入力してください")
      .refine((name) => {
        // Check for duplicate names (excluding current page if editing)
        const isDuplicate = existingPages.some(
          (page) => page.pageName.toLowerCase() === name.toLowerCase()
        );
        return !isDuplicate;
      }, "このサイト名は既に使用されています"),
    domain: z
      .string()
      .min(1, "ドメインは必須です")
      .refine((domain) => {
        // Domain validation - support domains with paths like aoyama-garden.com/shop/default.aspx
        // Split domain and path parts
        const [domainPart, ...pathParts] = domain.split('/');
        const fullPath = pathParts.length > 0 ? '/' + pathParts.join('/') : '';

        // Domain pattern - support domains with hyphens like aoyama-garden.com
        const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;

        // Path pattern - allow alphanumeric, hyphens, underscores, dots, and forward slashes
        const pathPattern = /^(\/[a-zA-Z0-9._-]+)*$/;

        // Reject URLs with protocols or www prefix
        const hasProtocol = /^https?:\/\//.test(domain);
        const hasWww = /^www\./.test(domain);

        if (hasProtocol || hasWww) {
          return false;
        }

        // Validate domain part
        if (!domainPattern.test(domainPart)) {
          return false;
        }

        // Ensure domain has at least one dot (for TLD)
        if (!domainPart.includes('.')) {
          return false;
        }

        // Ensure no consecutive dots or hyphens in domain
        if (domainPart.includes('..') || domainPart.includes('--')) {
          return false;
        }

        // Validate path part if exists
        if (fullPath && !pathPattern.test(fullPath)) {
          return false;
        }

        return true;
      }, "有効なドメイン名を入力してください（http://、https://、www.は不要です）")
      .refine((domain) => {
        // Check for duplicate domains (excluding current page if editing)
        const isDuplicate = existingPages.some(
          (page) => page.domain?.toLowerCase() === domain.toLowerCase()
        );
        return !isDuplicate;
      }, "このドメインは既に使用されています"),
    role: z.enum(SiteRole),
    status: z.string().min(1, "ステータスは必須です"),
    allowCrawl: z.boolean(),
    respectRobots: z.boolean(),
    autoGenerateQA: z.boolean(),
    crawlExclusion: z.string().optional(),
    qaTemplate: z.string().optional(),
  });

export type CreatePageFormData = z.infer<ReturnType<typeof createPageSchema>>;

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
}

export function useForm<T>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback(
    (field: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [field]: value as T[keyof T] }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback(() => {
    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof T] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validate()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const updateInitialValues = useCallback((newInitialValues: T) => {
    setValues(newInitialValues);
    setErrors({});
    setTouched({});
  }, []);

  const getFieldError = useCallback(
    (field: keyof T) => {
      return touched[field] ? errors[field] : undefined;
    },
    [errors, touched]
  );

  return {
    values,
    errors,
    isSubmitting,
    touched,
    setValue,
    setFieldTouched,
    validate,
    handleSubmit,
    reset,
    updateInitialValues,
    getFieldError,
  };
}
