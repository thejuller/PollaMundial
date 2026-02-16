/**
 * Normaliza un email a minúsculas
 */
export function normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalizeName(name: string): string {
    return name
        .split(' ')
        .map(word => {
            if (!word) return '';
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ')
        .trim();
}
