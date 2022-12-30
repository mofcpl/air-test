import React from "react";

const Button = (props) =>
{
    return(
        <div id="button">
            <button onClick={props.checkAir}>Sprawdź</button>
        </div>
    )
}

export default Button