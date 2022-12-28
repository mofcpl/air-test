import style from "./main.scss";
import "./css/fontello.css"

import React, { Component } from "react";
import ReactDOM from 'react-dom/client';
import { Provider, connect } from 'react-redux'

import {Summary, Data, Station, Button, Title, Desc} from "./interface.jsx"
import {store, setPosition, setClosestStation, setSensors, setSummary, reset, setIndexes, setStatus, setData} from "./redux-store.js"

require("babel-polyfill");

class App extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            ticks: 0
        }

        this.loadPosition =         this.loadPosition.bind(this);
        this.checkAir =             this.checkAir.bind(this);
        this.findNearestStation =   this.findNearestStation.bind(this);
        this.loadSummary =          this.loadSummary.bind(this);
        this.calcDistance =         this.calcDistance.bind(this);
        this.loadSensors =          this.loadSensors.bind(this);
        this.loadData =             this.loadData.bind(this);
        this.addTick =              this.addTick.bind(this);
    }

    addTick()
    {
        this.setState({ticks: this.state.ticks + 1});
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

    loadPosition()
    {        
        console.log("calculating position...");
        if (navigator.geolocation)
        {
          navigator.geolocation.getCurrentPosition(position => 
          {
            this.props.submitSetPosition({latitude: position.coords.latitude, longitude: position.coords.longitude});
            //this.props.submitSetPosition({latitude: 50.874167, longitude: 20.633333});
            console.log("calculating position...done");
            this.props.submitSetStatus("POSITION");
          });
        }
        
    }
    
    async findNearestStation()
    {
        console.log("finding nearest station...");
        const response = await fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/station/findAll")
        const jsonData = await response.json();

        console.log(jsonData);

        let closestStationIndex = 0;
        let closestDistance = 0;

        const myLat = this.props.state.position.latitude;
        const myLng = this.props.state.position.longitude;

        jsonData.forEach( (element, index, array) =>
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

        const name = jsonData[closestStationIndex].stationName;
        const index = jsonData[closestStationIndex].id;
        const distance = closestDistance;

        this.props.submitSetClosestStation({index, name, distance});
        


        console.log("finding nearest station...done");
        this.props.submitSetStatus("NEAREST_STATION");

    }

    async loadSensors()
    {
        console.log("loading sensors from station...");
        const response = await fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/station/sensors/"+this.props.state.closestStation.index)
        const jsonData = await response.json();

        console.log(jsonData);

        jsonData.forEach( (element, index, array) =>
        {
            const tempName = jsonData[index].param.paramCode.toLowerCase().replace('.',"");
            this.props.submitSetSensors({id: jsonData[index].id, name: jsonData[index].param.paramName, code: tempName});
        });

        console.log("loading sensors from station...done");
        this.props.submitSetStatus("SENSORS");

    }

    async loadData()
    {
        console.log("loading data from station...");
        let number = 0;
        this.props.state.data.forEach( async (element, index, array) =>
        {
            const response = await fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/data/getData/"+ element.id)
            const jsonData = await response.json();

            number++;
            console.log(jsonData)
            
            let j = 0;

            while(!jsonData.values[j].value)
            {
                j++;
            }

            this.props.submitSetData(index, jsonData.values[j].value);

            if(number >= array.length)
            {
                console.log("loading data from station...done");
                this.props.submitSetStatus("DATA");
            }

        })
    }

    async loadSummary()
    {
        console.log("loading summary from station...");
        const response = await fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/"+this.props.state.closestStation.index)
        const jsonData = await response.json();

        console.log(jsonData);
        for(let i = 0; i < this.props.state.data.length; i++)
        {
            const tempName = this.props.state.data[i].code+'IndexLevel';
            if(!jsonData[tempName]) continue;
            this.props.submitSetIndexes(i,jsonData[tempName].indexLevelName, jsonData[tempName].id);
        }
        this.props.submitSetSummary({quality: jsonData.stIndexLevel.indexLevelName, date: jsonData.stSourceDataDate, id: jsonData.stIndexLevel.id});

        console.log("loading summary from station...done");
        this.props.submitSetStatus("SUMMARY");   

    }

    componentDidUpdate(prevProps)
    {      
        
        switch(this.props.state.status)
        {
            // START -> POSITION -> NEAREST_STATION -> SENSORS -> DATA -> SUMMARY -> READY
            case "POSITION":
            {
                this.props.submitSetStatus("LOADING");
                this.findNearestStation();
                break;
            }
            case "NEAREST_STATION":
            {
                this.props.submitSetStatus("LOADING");
                this.loadSensors();
                break;
            }
            case "SENSORS":
            {
                this.props.submitSetStatus("LOADING");
                this.loadData();
                break;
            }
            case "DATA":
            {
                this.props.submitSetStatus("LOADING");
                this.loadSummary();
                break;
            }
        }
        
    }

    checkAir()
    {
        const promise = new Promise((resolve => resolve()));

        promise.then(() => this.props.submitReset()).then( () => this.loadPosition());
    
    }

    componentDidMount()
    {
        
    }

    render()
    {
    

        return(
        <main class="container">

            <Title />
            <Station data={this.props.state} />
            <Data data={this.props.state} />
            <Summary data={this.props.state} />
            <Button checkAir={this.checkAir} />
            <Desc data={this.props.state} />

        </main>
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
        submitSetSensors: (value) =>{dispatch(setSensors(value))},
        submitSetSummary: (value) =>            {dispatch(setSummary(value))},
        submitReset: () =>                      {dispatch(reset())},
        submitSetIndexes: (index, value, value2) =>     {dispatch(setIndexes(index, value, value2))},
        submitSetStatus: (value) =>             {dispatch(setStatus(value))},
        submitSetData: (index, value) =>   {dispatch(setData(index, value))}
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

const root = ReactDOM.createRoot(document.getElementById('App'));
root.render(<AppWrapper />);


