import Hero from "../Hero.tsx";
import Page from "../Page.tsx";

const steps = [
    {
        title: "Aukce se zveřejní",
        text: "Skupina vytvoří aukci a manažer ji schválí. Po schválení se aukce spustí a lze do ní přihazovat.",
    },
    {
        title: "Přihazujete",
        text: "Každý příhoz musí být vyšší než aktuální nejvyšší o alespoň minimální příhoz uvedený u aukce. Příhozy se ostatním zobrazují okamžitě.",
    },
    {
        title: "Aukce končí",
        text: "Aukce skončí uplynutím času, nebo dřív, pokud ji někdo ukončí koupí za cenu Kup teď.",
    },
    {
        title: "Vítěz zaplatí",
        text: "Výherce má na zaplacení omezenou lhůtu. Zaplacená částka se přičte k celkovému výtěžku.",
    },
];

const faqs = [
    {
        q: "Co je minimální příhoz?",
        a: "Nejnižší částka, o kterou musíte přebít aktuální nejvyšší příhoz. Najdete ji v panelu příhozů u každé aukce.",
    },
    {
        q: "Skončí aukce ihned po koupi za cenu Kup teď?",
        a: "Ano. Jakmile někdo zvolí Kup teď, aukce se okamžitě ukončí a další příhozy už nejsou možné.",
    },
    {
        q: "Co se stane, když nikdo nepřihodí?",
        a: "Aukce skončí bez vítěze a nikdo nic neplatí.",
    },
];

export default function HowItWorks() {
    return (
        <Page>
            <Hero navbarTextColor="light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20 min-h-[60vh] flex flex-col justify-center gap-12 md:gap-16">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight m-0 mb-6">
                            Jak fungují aukce
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed m-0">
                            Přihazujte, nebo kupte hned. Výtěžek ze všech aukcí se rovnoměrně rozdělí mezi všechny
                            zapojené charitativní organizace. Po vyhrání je ale potřeba včas zaplatit.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl flex flex-col gap-4">
                            <h2 className="text-xl font-black uppercase tracking-tight m-0">Kup teď</h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-[#4ade80] leading-none">5</span>
                                <span className="text-xl font-bold text-gray-300">hodin</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed m-0">
                                Aukce se okamžitě ukončí a produkt je váš. Zaplatit musíte do 5 hodin od koupě.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl flex flex-col gap-4">
                            <h2 className="text-xl font-black uppercase tracking-tight m-0">Nejvyšší příhoz</h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-[#4ade80] leading-none">48</span>
                                <span className="text-xl font-bold text-gray-300">hodin</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed m-0">
                                Pokud aukci vyhrajete nejvyšším příhozem, máte na zaplacení 48 hodin od jejího skončení.
                            </p>
                        </div>
                    </div>
                </div>
            </Hero>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-16">
                {/* Průběh aukce */}
                <section className="flex flex-col gap-8">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight m-0 border-b border-gray-200 pb-4">
                        Průběh aukce
                    </h2>
                    <ol className="list-none p-0 m-0 flex flex-col gap-4">
                        {steps.map((step, index) => (
                            <li
                                key={step.title}
                                className="flex gap-5 items-start bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <div className="w-10 h-10 shrink-0 rounded-full bg-[#4ade80] text-slate-900 font-black text-lg flex items-center justify-center">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 m-0 mb-1">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed m-0">{step.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Výtěžek */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight m-0 border-b border-gray-200 pb-4">
                        Kam putuje výtěžek
                    </h2>
                    <div className="bg-[#4ade80]/10 border border-[#4ade80]/40 p-6 md:p-8 rounded-3xl flex flex-col gap-3">
                        <p className="text-slate-900 leading-relaxed m-0">
                            Výtěžek ze všech zaplacených aukcí se rovnoměrně rozdělí mezi všechny zapojené
                            charitativní organizace. Každá organizace tak dostane stejný podíl bez ohledu na to, která
                            skupina aukci vytvořila a za kolik se prodala.
                        </p>
                    </div>
                </section>

                {/* Nezaplacení */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight m-0 border-b border-gray-200 pb-4">
                        Když vítěz nezaplatí
                    </h2>
                    <div className="bg-amber-50 border border-amber-200 p-6 md:p-8 rounded-3xl flex flex-col gap-3">
                        <p className="text-slate-900 leading-relaxed m-0">
                            Pokud výherce do stanovené lhůty nezaplatí, nárok na produkt mu zaniká a nabídka přechází na
                            dalšího zájemce v pořadí podle výše příhozu. Ten dostane stejnou lhůtu na zaplacení.
                        </p>
                        <p className="text-slate-900 leading-relaxed m-0">
                            Takto se pokračuje, dokud někdo nezaplatí nebo dokud nejsou vyčerpáni všichni, kdo přihodili.
                        </p>
                    </div>
                </section>

                {/* Časté otázky */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight m-0 border-b border-gray-200 pb-4">
                        Časté otázky
                    </h2>
                    <div className="flex flex-col gap-4">
                        {faqs.map((item) => (
                            <div
                                key={item.q}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <h3 className="text-lg font-black text-slate-900 m-0 mb-2">{item.q}</h3>
                                <p className="text-gray-600 leading-relaxed m-0">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Page>
    );
}