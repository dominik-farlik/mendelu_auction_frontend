/**
 * Sestaví absolutní WebSocket URL. Relativní cestu (např. "/ws" v produkci)
 * doplní o aktuální host a zvolí ws/wss podle protokolu stránky.
 */
export function buildWsUrl(path: string): string {
    const base = import.meta.env.VITE_WS_URL;
    if (/^wss?:\/\//.test(base)) {
        return `${base}${path}`;
    }
    if (/^https?:\/\//.test(base)) {
        return `${base.replace(/^http/, "ws")}${path}`;
    }
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}${base}${path}`;
}
