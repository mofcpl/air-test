import style from "./interface.scss";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux'

const maxValues =
{
    c6h6: [6, 11, 16, 21, 51],
    co: [3000, 7000, 11000, 15000, 21000],
    no2: [41, 101, 151, 201, 401],
    o3: [71, 121, 151, 181, 241],
    pm10: [21, 61, 101, 141, 201],
    pm25: [13, 37, 61, 85, 121],
    so2: [51, 101, 201, 351, 501]
}

const colors = ["#57b108",'#b0dd10','#ffd911','#e58100','#e50000','#990000'];


export const Data = (props) =>
{

    const data = props.data.data.map( (currentValue,index) => 
    {
        let i = 0;
        while(currentValue.value > maxValues[currentValue.code][i])
        {
            i++;
        }

        //const value = (currentValue.value / 100) * props.ticks;

        const tempStyle = { width: 100/(maxValues[currentValue.code][i] / currentValue.value) +"%", backgroundColor: colors[i]};

        return(
        <div className="sensor" key={index}>
            <div className="name">{currentValue.name} </div> 
            <div className="bar">
                {(currentValue.value) ? <div style={tempStyle} className="fulfillment"></div> : <div className="lds-dual-ring"></div>}
            </div>
            {(currentValue.value) ? <div className="value">{currentValue.value} μg/m3</div> : ""}
            
        </div>);
    });


    if (props.data.data.length == 0)
    return(
        <div id="data">
            <section>
            {(props.data.status !="START") ? <div className="lds-dual-ring-big"></div> : ""}
            </section>
        </div>
    )
    else
    return(
        <div id="data">
        <section>
            <header>pomiary</header>
            <article>{data}</article>
        </section>
    </div>
    )
    
}

export const Title = (props) =>
{
    return(
        <div id="title">
            <section>
                <article>
                    Air<span>check</span>
                </article>
            </section>
        </div>
    )
}

export const Station = (props) =>
{

    const dist = (props.data.closestStation.distance) ? Math.round(props.data.closestStation.distance)+" metrów" : "";
    
    return(
        <div id="station">
            <header>Najbliższa stacja pomiarowa:</header>
            <section>
                <div className="first">
                    <header>nazwa</header>
                    <article>
                        {(props.data.closestStation.name != "" ) ? props.data.closestStation.name : (props.data.status !="START")? <div className="lds-dual-ring"></div> : ""}
                    </article>
                </div>
                <div className="last">
                    <header>odległość</header>
                    <article>
                        {(dist != "") ? dist : (props.data.status !="START")? <div className="lds-dual-ring"></div> : ""}
                    </article>
                </div>
                
            </section>
        </div>
    )
}

export const Summary = (props) =>
{

    const tempStyle = { color: colors[props.data.summary.id]};

    return(
        <div id="summary">
            <header>Podsumowanie:</header>
            <section>
                <div className="first">
                    <header>Stan jakości powietrza</header>
                    <article style={tempStyle}>
                        {(props.data.summary.quality != "") ? props.data.summary.quality : (props.data.status !="START")? <div className="lds-dual-ring"></div> : ""}
                    </article>
                </div>
                <div className="last">
                    <header>Data uzyskania pomiaru</header>
                    <article>
                        {(props.data.summary.date != "") ? props.data.summary.date : (props.data.status !="START")? <div className="lds-dual-ring"></div> : ""}
                    </article>
                </div>
            </section>
        </div>
    )
}

export const Button = (props) =>
{
    return(
        <div id="button">
            <button onClick={props.checkAir}>Sprawdź</button>
        </div>
    )
}

export const Desc = (props) =>
{

    const indexDesc = [
        "Jakość powietrza jest bardzo dobra, zanieczyszczenie powietrza nie stanowi zagrożenia dla zdrowia, warunki bardzo sprzyjające do wszelkich aktywności na wolnym powietrzu, bez ograniczeń.",
        "Jakość powietrza jest zadowalająca, zanieczyszczenie powietrza powoduje brak lub niskie ryzyko zagrożenia dla zdrowia. Można przebywać na wolnym powietrzu i wykonywać dowolną aktywność, bez ograniczeń.",
        "Jakość powietrza jest akceptowalna. Zanieczyszczenie powietrza może stanowić zagrożenie dla zdrowia w szczególnych przypadkach (dla osób chorych, osób starszych, kobiet w ciąży oraz małych dzieci). Warunki umiarkowane do aktywności na wolnym powietrzu.",
        "Jakość powietrza jest dostateczna, zanieczyszczenie powietrza stanowi zagrożenie dla zdrowia (szczególnie dla osób chorych, starszych, kobiet w ciąży oraz małych dzieci) oraz może mieć negatywne skutki zdrowotne. Należy rozważyć ograniczenie (skrócenie lub rozłożenie w czasie) aktywności na wolnym powietrzu, szczególnie jeśli ta aktywność wymaga długotrwałego lub wzmożonego wysiłku fizycznego.",
        "Jakość powietrza jest zła, osoby chore, starsze, kobiety w ciąży oraz małe dzieci powinny unikać przebywania na wolnym powietrzu. Pozostała populacja powinna ograniczyć do minimum wszelką aktywność fizyczną na wolnym powietrzu - szczególnie wymagającą długotrwałego lub wzmożonego wysiłku fizycznego.",
        "Jakość powietrza jest bardzo zła i ma negatywny wpływ na zdrowie. Osoby chore, starsze, kobiety w ciąży oraz małe dzieci powinny bezwzględnie unikać przebywania na wolnym powietrzu. Pozostała populacja powinna ograniczyć przebywanie na wolnym powietrzu do niezbędnego minimum. Wszelkie aktywności fizyczne na zewnątrz są odradzane. Długotrwała ekspozycja na działanie substancji znajdujących się w powietrzu zwiększa ryzyko wystąpienia zmian m.in. w układzie oddechowym, naczyniowo-sercowym oraz odpornościowym.",
        "„Brak Indeksu” odpowiada sytuacji, gdy na danej stacji pomiarowej nie są aktualnie prowadzone pomiary pyłu zawieszonego lub ozonu, a jeden z nich jest w danej chwili decydującym zanieczyszczeniem powietrza w województwie. Indeks Jakości Powietrza nie jest wtedy wyznaczany [...]. Stacja pomimo braku określonego Indeksu jest nadal widoczna i jest możliwość sprawdzenia wszystkich pozostałych wyników pomiarów."
    ];

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
                
                <a href="https://zbrogdom.pl/" target="_blank"><i className="icon-home" /></a>
                <a href="https://github.com/mofcpl/air-test" target="_blank"><i className="icon-github-circled" /></a>
                <a href="https://www.linkedin.com/in/zbrogdom/" target="_blank"><i className="icon-linkedin-squared" /></a>
            </div>
    </div> 
    )
}
