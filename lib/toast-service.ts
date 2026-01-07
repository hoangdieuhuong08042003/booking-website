import { toast } from "sonner";

export class ToastService {
    // Site Management Toasts
    static siteCreated(siteName: string) {
        toast.success("Tạo trang mới thành công", {
            description: `${siteName} đã được thêm`,
        });
    }

    static siteUpdated(siteName: string) {
        toast.success("Cập nhật trang thành công", {
            description: `Thông tin của ${siteName} đã được cập nhật`,
        });
    }

    static siteDeleted(siteName: string) {
        toast.success("Xóa trang thành công", {
            description: `${siteName} đã bị xóa`,
        });
    }

    static siteReorderSuccess() {
        toast.success("Đã cập nhật thứ tự trang", {
            description: "Đã lưu thứ tự ưu tiên thành công",
        });
    }

    // Validation Toasts
    static validationError(message: string, description?: string) {
        toast.error(message, {
            description: description || "Vui lòng kiểm tra lại thông tin nhập",
        });
    }

    // Generic Error Toasts
    static operationFailed(operation: string, description?: string) {
        toast.error("Đã xảy ra lỗi", {
            description: description || `Thao tác ${operation} thất bại`,
        });
    }

    static deleteFailed() {
        toast.error("Xóa thất bại", {
            description: "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
    }

    static updateFailed() {
        toast.error("Cập nhật thất bại", {
            description: "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
    }

    static createFailed() {
        toast.error("Tạo mới thất bại", {
            description: "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
    }

    // Generic Success Toasts
    static operationSuccess(operation: string, description?: string) {
        toast.success(`Đã hoàn tất ${operation}`, {
            description: description || "Thao tác đã thực hiện thành công",
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
