import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'



///////////////////////////////////////////////////////CONSTANTS///////////////////////////////////////////////////////

const SET_POSITION = "SET_POSITION"
const SET_CLOSEST_STATION = "SET_CLOSEST_STATION"
const SET_SENSORS = "SET_SENSORS"
const SET_SUMMARY = "SET_SUMMARY"
const RESET = "RESET"
const SET_INDEXES = "SET_INDEXES"
const SET_STATUS = "SET_STATUS"
const SET_DATA = "SET_DATA"

///////////////////////////////////////////////////////DEFAULT_STORE///////////////////////////////////////////////////////
// START -> POSITION -> NEAREST_STATION -> SENSORS -> DATA -> SUMMARY -> READY
const defaultState =
{
    status: "START",
    position:
    {
        latitude: 0,
        longitude: 0
    },
    closestStation: 
    {
        index: "",
        name: "",
        distance: ""
    },
    data: [],
    summary:
    {
        quality: "",
        date: "",
        id: ""
    }
}

///////////////////////////////////////////////////////ACTION CREATORS///////////////////////////////////////////////////////

const setPosition = (value) =>
{
    return {type: SET_POSITION, value: value}
}

const setClosestStation = (value) =>
{
    return {type: SET_CLOSEST_STATION, value: value}
}

const setSensors = (value) =>
{
    return {type: SET_SENSORS, value: value}
}

const setSummary = (value) =>
{
    return {type: SET_SUMMARY, value: value}
}

const reset = () =>
{
    return {type: RESET}
}

const setIndexes = (index, value, value2) =>
{
    return {type: SET_INDEXES, index: index, value: value, value2: value2}
}

const setStatus = (value) =>
{
    return {type: SET_STATUS, value: value}
}

const setData = (index, value) =>
{
    return {type: SET_DATA, value: value, index: index}
}

///////////////////////////////////////////////////////REDUCER///////////////////////////////////////////////////////

const reducer = (state = defaultState, action) =>
{

    switch(action.type)
    {
        case RESET:                 return defaultState;
        case SET_POSITION:          return Object.assign({},state, {position: action.value});
        case SET_CLOSEST_STATION:   return Object.assign({},state, {closestStation: action.value});
        case SET_SUMMARY:           return Object.assign({},state, {summary: action.value});
        case SET_STATUS:            return Object.assign({},state, {status: action.value});
        case SET_SENSORS:
        return{
            ...state,
            data: [...state.data, action.value]
        }   
        case SET_INDEXES:
        return{
            ...state,
            data: state.data.map((currentValue, index) => (index === action.index) ? {...currentValue, index: action.value, id: action.value2} : currentValue)
        }
        case SET_DATA:
        return{
            ...state,
            data: state.data.map((currentValue, index) => (index === action.index) ? {...currentValue, value: action.value} : currentValue)
        }

        default: return defaultState;
    }
}

const store = createStore(reducer);

export {store, setPosition, setClosestStation, setSensors, setSummary, reset, setIndexes, setStatus, setData}