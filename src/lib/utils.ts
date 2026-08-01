export function getLatestDateLabel(dates: (string | null | undefined)[]): string | null {
    const latest = dates.filter((d): d is string => Boolean(d)).sort().at(-1);
    return latest
        ? new Date(latest).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;
}
