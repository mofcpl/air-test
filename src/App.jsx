import React, { useEffect, useReducer } from "react";

import {Data} from './components/Data'
import Title from './components/Title'
import Station from './components/Station'
import Summary from './components/Summary'
import Desc from './components/Desc'
import Button from './components/Button'

import defaultState from './state'
import appStateReducer from './reducer'

require("babel-polyfill");

const App = () =>
{
    const [appState, dispatchState] = useReducer(appStateReducer, defaultState)

    useEffect(() => {
        switch(appState.status)
        {
            case "POSITION":
            {
                dispatchState({type: 'SET_STATUS', value: "LOADING"});
                findNearestStation();
                break;
            }
            case "NEAREST_STATION":
            {
                dispatchState({type: 'SET_STATUS', value: "LOADING"});
                loadSensors();
                break;
            }
            case "SENSORS":
            {
                dispatchState({type: 'SET_STATUS', value: "LOADING"});
                loadData();
                break;
            }
            case "DATA":
            {
                dispatchState({type: 'SET_STATUS', value: "LOADING"});
                loadSummary();
                break;
            }
        }
    },[appState.status]);

    //https://stackoverflow.com/a/1502821
    const calcDistance = (pos1, pos2) =>
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

    const loadPosition = () =>
    {        
        console.log("calculating position...");
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(position => 
            {
                dispatchState({
                    type: 'SET_POSITION', 
                    value: {
                        latitude: position.coords.latitude, 
                        longitude: position.coords.longitude
                    }});
                //this.props.submitSetPosition({latitude: 50.874167, longitude: 20.633333});
                console.log("calculating position...done");
                dispatchState({type: 'SET_STATUS', value: "POSITION"});
            });
        }
        
    }
    
    const findNearestStation = async () =>
    {
        console.log("finding nearest station...");
        const response = await fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/station/findAll")
        const jsonData = await response.json();

        console.log(jsonData);

        let closestStationIndex = 0;
        let closestDistance = 0;

        const myLat = appState.position.latitude;
        const myLng = appState.position.longitude;

        jsonData.forEach( (element, index, array) =>
        {
            const newLat = element.gegrLat;
            const newLng = element.gegrLon;
            
            const newDistance = calcDistance({lat: myLat, lng: myLng},{lat: newLat, lng: newLng});

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

        dispatchState({
            type: 'SET_CLOSEST_STATION', 
            value: { index, name, distance }
        });
        console.log("finding nearest station...done");
        dispatchState({type: 'SET_STATUS', value: "NEAREST_STATION"});
    }

    const loadSensors = async () =>
    {
        console.log("loading sensors from station...");
        const response = await fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/station/sensors/"+appState.closestStation.index)
        const jsonData = await response.json();

        console.log(jsonData);

        jsonData.forEach( (element, index, array) =>
        {
            const tempName = jsonData[index].param.paramCode.toLowerCase().replace('.',"");
            dispatchState({
                type: 'SET_SENSORS', 
                value: {
                    id: jsonData[index].id, 
                    name: jsonData[index].param.paramName, 
                    code: tempName
                }});
        });

        console.log("loading sensors from station...done");
        dispatchState({type: 'SET_STATUS', value: "SENSORS"});

    }

    const loadData = () =>
    {
        console.log("loading data from station...");
        let number = 0;
        appState.data.forEach( async (element, index, array) =>
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

            dispatchState({
                type: 'SET_DATA', 
                value: jsonData.values[j].value,
                index
            });

            if(number >= array.length)
            {
                console.log("loading data from station...done");
                dispatchState({type: 'SET_STATUS', value: "DATA"});
            }

        })
    }

    const loadSummary = async () =>
    {
        console.log("loading summary from station...");
        const response = await fetch("https://cors-anywhere.herokuapp.com/"+"http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/"+appState.closestStation.index)
        const jsonData = await response.json();

        console.log(jsonData);
        for(let i = 0; i < appState.data.length; i++)
        {
            const tempName = appState.data[i].code+'IndexLevel';
            if(!jsonData[tempName]) continue;
            dispatchState({
                type: 'SET_INDEXES', 
                index: i,
                value: jsonData[tempName].indexLevelName, 
                value2: jsonData[tempName].id
            });
        }
        dispatchState({
            type: 'SET_SUMMARY', 
            value: {
                quality: jsonData.stIndexLevel.indexLevelName, 
                date: jsonData.stSourceDataDate, 
                id: jsonData.stIndexLevel.id
            }});

        console.log("loading summary from station...done");
        dispatchState({type: 'SET_STATUS', value: "SUMMARY"}); 

    }

    const checkAir = () =>
    {
        const promise = new Promise((resolve => resolve()));
        promise.then(() => dispatchState('RESET')).then( () => loadPosition());
    }

    return(
    <main className="container">
        <Title />
        <Station data={appState} />
        <Data data={appState} />
        <Summary data={appState} />
        <Button checkAir={checkAir} />
        <Desc data={appState} />
    </main>
    );
}

export default App


