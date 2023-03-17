import React from "react";

import githubLogo from '../../assets/github.svg';
import linkedinLogo from '../../assets/linkedin.svg';

const indexDesc = [
    "Jakość powietrza jest bardzo dobra, zanieczyszczenie powietrza nie stanowi zagrożenia dla zdrowia, warunki bardzo sprzyjające do wszelkich aktywności na wolnym powietrzu, bez ograniczeń.",
    "Jakość powietrza jest zadowalająca, zanieczyszczenie powietrza powoduje brak lub niskie ryzyko zagrożenia dla zdrowia. Można przebywać na wolnym powietrzu i wykonywać dowolną aktywność, bez ograniczeń.",
    "Jakość powietrza jest akceptowalna. Zanieczyszczenie powietrza może stanowić zagrożenie dla zdrowia w szczególnych przypadkach (dla osób chorych, osób starszych, kobiet w ciąży oraz małych dzieci). Warunki umiarkowane do aktywności na wolnym powietrzu.",
    "Jakość powietrza jest dostateczna, zanieczyszczenie powietrza stanowi zagrożenie dla zdrowia (szczególnie dla osób chorych, starszych, kobiet w ciąży oraz małych dzieci) oraz może mieć negatywne skutki zdrowotne. Należy rozważyć ograniczenie (skrócenie lub rozłożenie w czasie) aktywności na wolnym powietrzu, szczególnie jeśli ta aktywność wymaga długotrwałego lub wzmożonego wysiłku fizycznego.",
    "Jakość powietrza jest zła, osoby chore, starsze, kobiety w ciąży oraz małe dzieci powinny unikać przebywania na wolnym powietrzu. Pozostała populacja powinna ograniczyć do minimum wszelką aktywność fizyczną na wolnym powietrzu - szczególnie wymagającą długotrwałego lub wzmożonego wysiłku fizycznego.",
    "Jakość powietrza jest bardzo zła i ma negatywny wpływ na zdrowie. Osoby chore, starsze, kobiety w ciąży oraz małe dzieci powinny bezwzględnie unikać przebywania na wolnym powietrzu. Pozostała populacja powinna ograniczyć przebywanie na wolnym powietrzu do niezbędnego minimum. Wszelkie aktywności fizyczne na zewnątrz są odradzane. Długotrwała ekspozycja na działanie substancji znajdujących się w powietrzu zwiększa ryzyko wystąpienia zmian m.in. w układzie oddechowym, naczyniowo-sercowym oraz odpornościowym.",
    "„Brak Indeksu” odpowiada sytuacji, gdy na danej stacji pomiarowej nie są aktualnie prowadzone pomiary pyłu zawieszonego lub ozonu, a jeden z nich jest w danej chwili decydującym zanieczyszczeniem powietrza w województwie. Indeks Jakości Powietrza nie jest wtedy wyznaczany [...]. Stacja pomimo braku określonego Indeksu jest nadal widoczna i jest możliwość sprawdzenia wszystkich pozostałych wyników pomiarów."
];

const Desc = (props) =>
{
    const index = (props.data.summary.id == -1) ? 6 : props.data.summary.id;

    return(
        <div id="desc">
            <div id="color-bars">
                <div id="level1"></div>
                <div id="level2"></div>
                <div id="level3"></div>
                <div id="level4"></div>
                <div id="level5"></div>
                <div id="level6"></div>
            </div>
            <div id="text-desc">
                {(index === "")? 'Naciśnij przycisk aby sprawdzić jakość powietrza w twojej okolicy': indexDesc[index]}
            </div>
            <div id="note">Dane oraz opisy indeksów prezentowane na stronie airtest.pl pochodzą z serwisu <a href="http://powietrze.gios.gov.pl/pjp/home" target="_blank">powietrze.gios.gov.pl</a> administrowanego przez Główny Inspektorat Ochrony Środowiska</div>
            <div id="links">
                
                <a href="https://github.com/mofcpl/air-test" target="_blank"><img src={githubLogo} /></a>
                <a href="https://www.linkedin.com/in/zbrogdom/" target="_blank"><img src={linkedinLogo} /></a>
            </div>
    </div> 
    )
}

export default Desc