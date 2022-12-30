import React from "react";

const Station = (props) =>
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

export default Station