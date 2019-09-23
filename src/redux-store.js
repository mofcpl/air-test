import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'



///////////////////////////////////////////////////////CONSTANTS///////////////////////////////////////////////////////

const SET_POSITION = "SET_POSITION"
const SET_CLOSEST_STATION = "SET_CLOSEST_STATION"
const SET_DATA = "SET_DATA"
const SET_SUMMARY = "SET_SUMMARY"
const RESET = "RESET"

///////////////////////////////////////////////////////DEFAULT_STORE///////////////////////////////////////////////////////

const defaultState =
{
    position:
    {
        latitude: 0,
        longitude: 0
    },
    closestStation: 
    {
        index: 0,
        name: "",
        distance: ""
    },
    data: [],
    summary:
    {
        quality: "",
        date: 0
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

const setData = (value) =>
{
    return {type: SET_DATA, value: value}
}

const setSummary = (value) =>
{
    return {type: SET_SUMMARY, value: value}
}

const reset = () =>
{
    return {type: RESET}
}

///////////////////////////////////////////////////////REDUCER///////////////////////////////////////////////////////

const reducer = (state = defaultState, action) =>
{

    switch(action.type)
    {
        case RESET:                 return defaultState;
        case SET_POSITION:          return Object.assign({},state, {position: action.value});
        case SET_CLOSEST_STATION:   return Object.assign({},state, {closestStation: action.value});
        case SET_DATA:              return Object.assign({},state, {data: action.value});
        case SET_SUMMARY:           return Object.assign({},state, {summary: action.value});
        default: return defaultState;
    }
}

const store = createStore(reducer);

export {store, setPosition, setClosestStation, setData, setSummary, reset}