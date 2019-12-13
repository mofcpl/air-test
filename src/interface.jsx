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
        <div id="title">Air Test</div>
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
                        {(props.data.summary.quality) ? props.data.summary.quality : (props.data.data.status !="START")? <div className="lds-dual-ring"></div> : ""}
                    </article>
                </div>
                <div className="last">
                    <header>Data uzyskania pomiaru</header>
                    <article>
                        {(props.data.summary.date) ? props.data.summary.date : (props.data.data.status !="START")? <div className="lds-dual-ring"></div> : ""}
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
        <button onClick={props.checkAir}>Odśwież</button>
        </div>
    )
}