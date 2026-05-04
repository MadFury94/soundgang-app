// =============================================================================
// Admin Utilities
// =============================================================================

export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
    if (file.size > MAX_IMAGE_SIZE) {
        return { valid: false, error: 'Image must be under 5MB.' };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Image must be JPEG, PNG, WebP, or GIF.' };
    }
    return { valid: true };
}

export function validateImageFileType(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Image must be JPEG, PNG, WebP, or GIF.' };
    }
    return { valid: true };
}
