import type { AxiosError } from "axios";

/**
 * Vrátí čitelnou chybovou hlášku z odpovědi backendu.
 *
 * FastAPI posílá `detail` buď jako text (HTTPException), nebo jako seznam objektů
 * `{type, loc, msg, ...}` (chyba validace, HTTP 422). Seznam se nesmí vykreslit přímo,
 * React by spadl, proto z něj bereme jen texty `msg`.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
    const detail = (err as AxiosError<{ detail?: unknown }> | undefined)?.response?.data?.detail;

    if (typeof detail === "string" && detail.trim()) {
        return detail;
    }

    if (Array.isArray(detail)) {
        const messages = detail
            .map((item) => (item && typeof item === "object" && "msg" in item ? item.msg : null))
            .filter((msg): msg is string => typeof msg === "string" && msg.trim() !== "");
        if (messages.length > 0) {
            return messages.join(" ");
        }
    }

    return fallback;
}
