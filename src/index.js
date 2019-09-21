import style from "./main.scss";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux'

import {store, updateAll, updateLinears, updateRadials, changeLayer, setGrid, setRepeat, setZoom, setWidth, setHeight, setBackground, setPos, generateCode} from "./redux-store.js"

class App extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        
        return(
        <div id="container">
            <p>Hello world</p>    
        </div>
        );

    }
}

const mapStateToProps = (state) => 
{
    return {state};
};

const mapDispatchToProps = (dispatch) => 
{
    return {}
}

const Container = connect(mapStateToProps, mapDispatchToProps)(App);

class AppWrapper extends React.Component 
{
    render() {
      return (
        <Provider store={store}>
          <Container/>
        </Provider>
      );
    }
};

ReactDOM.render(<AppWrapper />, document.querySelector("#App"))

