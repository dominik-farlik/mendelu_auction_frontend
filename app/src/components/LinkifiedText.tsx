import { Fragment } from "react";

// Odkazy s protokolem, začínající www. nebo holé domény s běžnou koncovkou (např. "firma.cz/stranka").
// Doména nesmí navazovat na "@" (e-mail) ani na písmeno/číslo/tečku/lomítko.
const URL_PATTERN = new RegExp(
    String.raw`(?<![@\p{L}\p{N}./])(?:https?:\/\/[^\s<>"]+|www\.[^\s<>"]+|[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)*\.(?:cz|sk|com|eu|org|net|info|io|shop|store|online)(?![\p{L}\p{N}-])(?:[/?#][^\s<>"]*)?)`,
    "giu"
);

// Interpunkce na konci věty k odkazu nepatří ("Navštivte firma.cz.").
const TRAILING_PUNCTUATION = /[.,;:!?'"»“”)\]]+$/;

function splitTrailing(match: string): [string, string] {
    let url = match;
    let trailing = "";
    const punct = url.match(TRAILING_PUNCTUATION);
    if (punct) {
        trailing = punct[0];
        url = url.slice(0, -trailing.length);
        // Uzavírací závorku vrátit zpět, pokud je součástí odkazu (např. Wikipedia).
        while (trailing.startsWith(")") && (url.match(/\(/g)?.length ?? 0) > (url.match(/\)/g)?.length ?? 0)) {
            url += ")";
            trailing = trailing.slice(1);
        }
    }
    return [url, trailing];
}

/** Vykreslí text a URL v něm převede na klikatelné odkazy (otevřou se v novém panelu). */
export default function LinkifiedText({ text, linkClassName }: { text: string; linkClassName?: string }) {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    for (const match of text.matchAll(URL_PATTERN)) {
        const index = match.index ?? 0;
        const [url, trailing] = splitTrailing(match[0]);
        if (!url) continue;

        parts.push(text.slice(lastIndex, index));
        const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        parts.push(
            <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={linkClassName ?? "text-[#16a34a] font-semibold underline underline-offset-4 decoration-[#4ade80]/50 hover:decoration-[#16a34a] break-words"}
            >
                {url}
            </a>
        );
        lastIndex = index + url.length;
        if (trailing) {
            parts.push(trailing);
            lastIndex += trailing.length;
        }
    }
    parts.push(text.slice(lastIndex));

    return <>{parts.map((part, i) => <Fragment key={i}>{part}</Fragment>)}</>;
}
