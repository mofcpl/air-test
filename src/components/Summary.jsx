import React from "react";

import {colors} from './Data'

const Summary = (props) =>
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

export default Summary