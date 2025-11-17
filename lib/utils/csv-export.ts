import { InquiryLog } from "@/types";

export function exportInquiryLogsToCSV(inquiries: InquiryLog[], filename?: string) {
    if (!inquiries || inquiries.length === 0) {
        alert("エクスポートするデータがありません");
        return;
    }

    // CSV headers
    const headers = [
        "ID",
        "質問",
        "要約",
        "参照数",
        "満足度",
        "サイトロール",
        "ドメイン",
        "モード",
        "時間"
    ];

    // Convert data to CSV format
    const csvContent = [
        headers.join(","),
        ...inquiries.map(inquiry => [
            inquiry.id,
            `"${inquiry.question.replace(/"/g, '""')}"`, // Escape quotes in question
            `"${inquiry.summary.replace(/"/g, '""')}"`, // Escape quotes in summary
            inquiry.references,
            inquiry.satisfaction || "",
            inquiry.siteRole,
            `"${inquiry.domain.replace(/"/g, '""')}"`, // Escape quotes in domain
            inquiry.mode,
            `"${inquiry.time.replace(/"/g, '""')}"` // Escape quotes in time
        ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename || `inquiry_logs_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function formatInquiryLogsForCSV(inquiries: InquiryLog[]) {
    return inquiries.map(inquiry => ({
        ID: inquiry.id,
        質問: inquiry.question,
        要約: inquiry.summary,
        参照数: inquiry.references,
        満足度: inquiry.satisfaction || "N/A",
        サイトロール: inquiry.siteRole,
        ドメイン: inquiry.domain,
        モード: inquiry.mode,
        時間: inquiry.time
    }));
}
