export function isEmbeddedWindow(): boolean {
    try {
        const isInIframe = typeof window !== "undefined" && window.self !== window.top;
        const params = new URLSearchParams(window.location.search);
        const isEmbeddedParam = params.get("embedded") === "1";
        return isInIframe || isEmbeddedParam;
    } catch {
        return false;
    }
}

export function enforceLightModeWhenNotEmbedded(): () => void {
    const embedded = isEmbeddedWindow();
    if (embedded) return () => { };

    const html = document.documentElement;
    html.classList.remove("dark");

    const observer = new MutationObserver(() => {
        // Re-check embedded status on each mutation
        if (!isEmbeddedWindow() && html.classList.contains("dark")) {
            html.classList.remove("dark");
        }
    });

    try {
        observer.observe(html, {
            attributes: true,
            attributeFilter: ["class"],
        });
    } catch { }

    return () => observer.disconnect();
}


