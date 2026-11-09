import banner from "../../assets/dobrotrh_banner.webp";

export default function HomeBanner() {
    return (
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 relative z-10">
            {/* Spodní pruh sněhu je oříznutý přes poměr stran, nahoře zůstává nápis a světýlka. */}
            <img
                src={banner}
                alt="Dobrotrh MENDELU – benefiční akce 2026"
                width={1024}
                height={790}
                className="w-full h-auto aspect-[1024/790] object-cover object-top rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white/10"
            />
        </section>
    );
}
