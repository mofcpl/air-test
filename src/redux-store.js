import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'



///////////////////////////////////////////////////////CONSTANTS///////////////////////////////////////////////////////

const SET_POSITION = "SET_POSITION"
const SET_CLOSEST_STATION = "SET_CLOSEST_STATION"
const SET_DATA = "SET_DATA"
const SET_DATE = "SET_DATE"
const SET_QUALITY = "SET_QUALITY"

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
    quality: "",
    date: 0
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

const setDate = (value) =>
{
    return {type: SET_DATE, value: value}
}

const setQuality = (value) =>
{
    return {type: SET_QUALITY, value: value}
}

///////////////////////////////////////////////////////REDUCER///////////////////////////////////////////////////////

const reducer = (state = defaultState, action) =>
{

    switch(action.type)
    {
        case SET_POSITION:          return Object.assign({},state, {position: action.value});
        case SET_CLOSEST_STATION:   return Object.assign({},state, {closestStation: action.value});
        case SET_DATA:              return Object.assign({},state, {data: action.value});
        case SET_DATE:              return Object.assign({},state, {date: action.value});
        case SET_QUALITY:           return Object.assign({},state, {quality: action.value});
        default: return defaultState;
    }
}

const store = createStore(reducer);

export {store, setPosition, setClosestStation, setData, setDate, setQuality}