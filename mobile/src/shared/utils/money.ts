export function toNumberPrice(value: unknown): number {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
        const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".");
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : 0;
    }
    return 0;
}

export function formatMoney(value: unknown, currency = "$"): string {
    const n = toNumberPrice(value);
    return `${currency}${n.toFixed(2)}`;
}
