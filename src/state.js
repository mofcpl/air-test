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

export default defaultState