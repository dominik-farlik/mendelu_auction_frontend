export function formatDate(isoString: string) {
    if (!isoString) return 'nezadáno';

    const date = new Date(isoString);

    return new Intl.DateTimeFormat('cs-CZ', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    }).format(date);
}

export function formatDateAndTime(isoString: string) {
    if (!isoString) return 'nezadáno';

    const date = new Date(isoString);

    return new Intl.DateTimeFormat('cs-CZ', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}