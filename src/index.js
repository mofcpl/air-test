import style from "./main.scss";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from 'react-redux'

import {store, setPosition, setClosestStation, setData, setSummary, reset} from "./redux-store.js"

class App extends React.Component
{
    constructor(props)
    {
        super(props);

        this.loadPosition =         this.loadPosition.bind(this);
        this.checkAir =             this.checkAir.bind(this);
        this.findNearestStation =   this.findNearestStation.bind(this);
        this.calcDistance =         this.calcDistance.bind(this);
    }

    //https://stackoverflow.com/a/1502821
    calcDistance(pos1, pos2)
    {
        const degToRad = (x) =>
        {
            return x * Math.PI / 180;
        }

        
        let R = 6378137; // Earth’s mean radius in meter
        let dLat = degToRad(pos2.lat - pos1.lat);
        let dLong = degToRad(pos2.lng - pos1.lng);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degToRad(pos1.lat)) * Math.cos(degToRad(pos2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return d; // returns the distance in meter
    }

    findNearestStation()
    {
        fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/station/findAll")
        .then(resp => resp.json())
        .then( resp => 
        {
            console.log(resp);

            let closestStationIndex = 0;
            let closestDistance = 0;

            const myLat = this.props.state.position.latitude;
            const myLng = this.props.state.position.longitude;

            resp.forEach( (element, index, array) =>
            {
                const newLat = element.gegrLat;
                const newLng = element.gegrLon;
                
                const newDistance = this.calcDistance({lat: myLat, lng: myLng},{lat: newLat, lng: newLng});

                if(index == 0)
                {
                    closestStationIndex = index;
                    closestDistance = newDistance;
                }
                else
                {
                    if(newDistance < closestDistance)
                    {
                        closestStationIndex = index;
                        closestDistance = newDistance;
                    }
                }
            });

            const name = resp[closestStationIndex].stationName;
            const index = resp[closestStationIndex].id;
            const distance = closestDistance;

            console.log("submitSetClosestStation");
            this.props.submitSetClosestStation({index, name, distance});

        });
    }

    loadPosition()
    {        
        if (navigator.geolocation)
        {
          navigator.geolocation.getCurrentPosition(position => 
          {
            console.log("submitSetPosition");
            this.props.submitSetPosition({latitude: position.coords.latitude, longitude: position.coords.longitude});
          });
        }
    }

    loadStation()
    {
        const tempArray = [];
        
        fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/station/sensors/"+this.props.state.closestStation.index)
        .then(resp => resp.json())
        .then( resp => 
        {
            console.log(resp);
            resp.forEach( (element, index, array) =>
            {
                let value = 0;
             
                fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/data/getData/"+element.id)
                .then(resp2 => resp2.json())
                .then( (resp2) => 
                {
                    console.log(resp2)
                    
                    let j = 0;

                    while(!resp2.values[j].value)
                    {
                        j++;
                    }

                    tempArray.push({name: resp[index].param.paramName, value: resp2.values[j].value, date: resp2.values[j].date});
                    if(tempArray.length === resp.length) 
                    {
                        console.log("submitSetData");
                        this.props.submitSetData(tempArray);
                    }
                });
            })

        })
    }

    getSummary()
    {
        fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/"+this.props.state.closestStation.index)
        .then(resp => resp.json())
        .then( resp => 
        {
            console.log(resp);
            console.log("submitSetSummary");
            this.props.submitSetSummary({quality: resp.stIndexLevel.indexLevelName, date: resp.stCalcDate});
        });
    }

    componentDidUpdate(prevProps)
    {      
        if(prevProps.state.position.latitude == 0 && this.props.state.position.latitude != 0)
        {
            console.log("findNearestStation");
            this.findNearestStation();
        }

        if(prevProps.state.closestStation.index == 0 && this.props.state.closestStation.index != 0)
        {
            console.log("loadStation");
            this.loadStation();
            console.log("getSummary");
            this.getSummary();
        }
    }

    checkAir()
    {
        const promise = new Promise((resolve => resolve()));

        promise.then(() => this.props.submitReset()).then( () => this.loadPosition());
    
    }

    componentDidMount()
    {
        //this.loadPosition();  
    }

    render()
    {

        const data = this.props.state.data.map( (currentValue,index) => <p key={index}>{currentValue.name}: {currentValue.value}μg/m3 - {currentValue.date}</p>);

        return(
        <div id="container">
            <p><strong>Twoja pozycja:</strong></p>
            <p>Szerokośc: {this.props.state.position.latitude}</p>
            <p>Wysokość: {this.props.state.position.longitude}</p>
            <p><strong>Najbliższa stacja:</strong></p>
            <p>Nazwa: {this.props.state.closestStation.name}</p>
            <p>Odległość: {Math.round(this.props.state.closestStation.distance)} metrów</p>
            <p><strong>Pomiary:</strong></p>
            {data}
            <p><strong>Podsumowanie:</strong></p>
            <p>Stan jakości powietrza: {this.props.state.summary.quality}</p>
            <p>Data uzyskania pomiaru: {this.props.state.summary.date}</p>
            <button onClick={this.checkAir}>Odśwież</button>
            
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
    return{
        submitSetPosition: (value) =>           {dispatch(setPosition(value))},
        submitSetClosestStation: (value) =>     {dispatch(setClosestStation(value))},
        submitSetData: (value) =>               {dispatch(setData(value))},
        submitSetSummary: (value) =>            {dispatch(setSummary(value))},
        submitReset: () =>                      {dispatch(reset())}
    }
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

