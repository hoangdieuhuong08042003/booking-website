import { toast } from "sonner";

export class ToastService {
    // Site Management Toasts
    static siteCreated(siteName: string) {
        toast.success("新しいサイトが正常に作成されました", {
            description: `${siteName} が追加されました`,
        });
    }

    static siteUpdated(siteName: string) {
        toast.success("サイトが正常に更新されました", {
            description: `${siteName} の情報が更新されました`,
        });
    }

    static siteDeleted(siteName: string) {
        toast.success("サイトが正常に削除されました", {
            description: `${siteName} が削除されました`,
        });
    }

    static siteReorderSuccess() {
        toast.success("サイトの順序が更新されました", {
            description: "優先度が正常に保存されました",
        });
    }

    // Validation Toasts
    static validationError(message: string, description?: string) {
        toast.error(message, {
            description: description || "入力内容を確認してください",
        });
    }

    // Generic Error Toasts
    static operationFailed(operation: string, description?: string) {
        toast.error("エラーが発生しました", {
            description: description || `${operation}に失敗しました`,
        });
    }

    static deleteFailed() {
        toast.error("削除に失敗しました", {
            description: "エラーが発生しました。もう一度お試しください。",
        });
    }

    static updateFailed() {
        toast.error("更新に失敗しました", {
            description: "エラーが発生しました。もう一度お試しください。",
        });
    }

    static createFailed() {
        toast.error("作成に失敗しました", {
            description: "エラーが発生しました。もう一度お試しください。",
        });
    }

    // Generic Success Toasts
    static operationSuccess(operation: string, description?: string) {
        toast.success(`${operation}が完了しました`, {
            description: description || "操作が正常に完了しました",
        });
    }

    // Info Toasts
    static info(title: string, description?: string) {
        toast.info(title, {
            description: description,
        });
    }

    // Warning Toasts
    static warning(title: string, description?: string) {
        toast.warning(title, {
            description: description,
        });
    }

    // Loading Toasts
    static loading(message: string, description?: string) {
        return toast.loading(message, {
            description: description,
        });
    }

    // Dismiss specific toast
    static dismiss(toastId: string | number) {
        toast.dismiss(toastId);
    }
}
