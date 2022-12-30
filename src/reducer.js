const appStateReducer = (state, action) => {
    switch(action.type)
    {
        case 'RESET':                 return defaultState;
        case 'SET_POSITION':          return Object.assign({},state, {position: action.value});
        case 'SET_CLOSEST_STATION':   return Object.assign({},state, {closestStation: action.value});
        case 'SET_SUMMARY':           return Object.assign({},state, {summary: action.value});
        case 'SET_STATUS':            return Object.assign({},state, {status: action.value});
        case 'SET_SENSORS':
        return{
            ...state,
            data: [...state.data, action.value]
        }   
        case 'SET_INDEXES':
        return{
            ...state,
            data: state.data.map((currentValue, index) => (index === action.index) ? {...currentValue, index: action.value, id: action.value2} : currentValue)
        }
        case 'SET_DATA':
        return{
            ...state,
            data: state.data.map((currentValue, index) => (index === action.index) ? {...currentValue, value: action.value} : currentValue)
        }
        default: return defaultState;
    }
}

export default appStateReducer