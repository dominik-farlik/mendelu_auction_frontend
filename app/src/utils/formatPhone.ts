import { parsePhoneNumberFromString } from "libphonenumber-js";

const DEFAULT_COUNTRY = "CZ";

export function formatPhone(raw?: string | null): string {
    if (!raw) return "";
    const parsed = parsePhoneNumberFromString(raw, DEFAULT_COUNTRY);
    return parsed ? parsed.formatInternational() : raw;
}

export function toE164(raw?: string | null): string | null {
    if (!raw?.trim()) return null;
    const parsed = parsePhoneNumberFromString(raw, DEFAULT_COUNTRY);
    if (!parsed?.isValid()) throw new Error("INVALID_PHONE");
    return parsed.number; // E.164
}