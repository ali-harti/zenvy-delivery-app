// Helper function to format currency in MAD
export function formatMAD(value: number): string {
    const safe = Number.isFinite(value) ? value : 0;
    return `${safe.toFixed(0)} MAD`;
}

// Helper function to format decimal MAD (for precise amounts)
export function formatMADDecimal(value: number): string {
    const safe = Number.isFinite(value) ? value : 0;
    return `${safe.toFixed(2)} MAD`;
}
