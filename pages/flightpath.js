import Layout from '../components/Layout';

import MapCanvas from '../components/map-container/Map';
import Layers from '../components/map-container/layers/Layers';
import Tile from '../components/map-container/layers/TileLayer';
import Vector from '../components/map-container/layers/VectorLayer';

import addMarker from '../components/map-container/features/Marker';
import addLine from '../components/map-container/features/Line';

import Interactions from '../components/map-container/interactions/Interactions';
import ClickPixel from '../components/map-container/interactions/ClickPixel';

import ShadowBox from '../components/containers/ShadowBox';

import OSM from 'ol/source/OSM';
import { useState, useRef } from 'react';
import { fromLonLat } from 'ol/proj';
import TypeAhead from '../components/dropdown/TypeAhead';

// https://openlayers.org/en/latest/examples/flight-animation.html
// https://stackoverflow.com/a/36683831/3382269
// https://www.kindacode.com/snippet/next-js-api-routes-how-to-get-parameters-query-string/

const WAIT_INTERVAL = 500;
let timerID;

export default function FlightPath() {
    const departureDate = getDateObject();  // must be moved to a server-side prop
    const returnDate = getDateObject(departureDate, 10);  // can be handled client-side

    const departureString = formatDateString(departureDate);
    const returnString = formatDateString(returnDate);

    const [whereFrom, setWhereFrom] = useState('')
    const [whereTo, setWhereTo] = useState('')
    const [matches, setMatches] = useState([])

    const [features, setFeatures] = useState([]);
    const [suggestionsFrom, setSuggestionsFrom] = useState([]);
    const [suggestionsTo, setSuggestionsTo] = useState([]);
    const [queryString, setQueryString] = useState('')

    // add features to vector layer
    const source = new OSM();
    const initialCenter = [-100, 40];  // center
    const [view, setView] = useState({ center: initialCenter, zoom: 4 });


    // fetches airport matches based on query
    async function getAirports(query, setState) {

        // clear the timeout after every new firing
        clearTimeout(timerID)

        // delay fetch unless user has stopped typing for at least the timeout duration
        timerID = setTimeout(async () => {

            // query params 
            const searchParams = new URLSearchParams({
                search: query,
                items: 10
            })

            // append search parameters to the api url
            const url = '/api/airport/?' + searchParams

            const response = await fetch(url, {
                method: 'GET',
                crossDomain: true,
            });

            if (!response.ok) {
                throw new Error('Network resposne was not OK')
            };

            const json_data = await response.json()

            const items = json_data.map(item => ({
                'key': item['Airport ID'],
                'name': `${item.City} (${item.ICAO})`
            }));

            setMatches(json_data);
            setState(items);

        }, WAIT_INTERVAL);
    };

    // sets the selection from the typeahead dropdown
    function setSelection(selection, setValue, setSuggestions) {
        const match = matches[selection]
        setValue(`${match.City} (${match.ICAO})`)
        setSuggestions([]);
    };


    function handleClick(type) {
        // https://stackoverflow.com/a/54677026/3382269

        let newFeature = null;
        let duration = 0.0;

        switch (type) {
            case 'flight':
                // simulate flight path
                console.log('flight was pressed')

                // pan to SEA and KEF
                const newCenter = [-70, 60];  // new center
                setView({ center: newCenter, zoom: 3 });  // new map view

                // interpolate across point A and B
                const SEA = [-122.3088, 47.4480];
                const KEF = [-22.6282, 63.9815];
                duration = 1000;  // animation duration (total ms)

                // create new feature
                newFeature = addMarker(SEA)
                const newLine = addLine([SEA]);
                setFeatures(oldArray => [...oldArray, newLine, newFeature]);

                // interpolation handled by generator inside async func
                animateFeature(newFeature, newLine, SEA, KEF, duration, interpolateGreatCircle)
                break;

            default:
                throw new Error();
        }
    }

    return (
        <>
            <ShadowBox>
                <div className="grid gap-4 grid-cols-2">
                    {/* route */}
                    <div className="grid grid-cols-2">
                        <TypeAhead
                            value={whereFrom}
                            suggestions={suggestionsFrom}
                            placeholder={'Where From?'}
                            onChange={(arg) => getAirports(arg, setSuggestionsFrom)}
                            onInput={setWhereFrom}
                            onClick={(arg) => setSelection(arg, setWhereFrom, setSuggestionsFrom)}
                        />

                        <TypeAhead
                            value={whereTo}
                            suggestions={suggestionsTo}
                            placeholder={'Where To?'}
                            onChange={(arg) => getAirports(arg, setSuggestionsTo)}
                            onInput={setWhereTo}
                            onClick={(arg) => setSelection(arg, setWhereTo, setSuggestionsTo)}
                        />
                    </div>

                    {/* date */}
                    <div className="grid grid-cols-2">
                        <input
                            className="shadow appearance-none border-2 border-gray-200 rounded  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                            id="depature"
                            type="text"
                            placeholder="Departure"
                            defaultValue={departureString}
                        />
                        <input
                            className="shadow appearance-none border-2 border-gray-200 rounded  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                            id="return"
                            type="text"
                            placeholder="Return"
                            defaultValue={returnString}
                        />
                    </div>


                </div>
            </ShadowBox>

            <ShadowBox>
                <div className="grid gap-4 grid-cols-3">
                    <button
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                        onClick={() => handleClick('flight')}
                    >
                        SEA to KEF
                    </button>
                    <button
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                        onClick={() => getAirport()}
                    >
                        Test API
                    </button>
                    {/* https://stackoverflow.com/a/36683831/3382269 */}
                    <input
                        className="shadow appearance-none border-2 border-gray-200 rounded  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                        id="query-string"
                        type="text"
                        placeholder="Search City..."
                        value={queryString}
                        onInput={e => setQueryString(e.target.value)}
                    />
                </div>
            </ShadowBox>

            <ShadowBox>

                <MapCanvas view={view}>

                    <Layers>
                        <Tile source={source} zIndex={0} />
                        <Vector features={features} zIndex={0} />
                    </Layers>

                    <Interactions>
                        <ClickPixel />
                    </Interactions>

                </MapCanvas>

            </ShadowBox>

        </>
    )
}

// this is an async to handle position of a feature
async function animateFeature(feature, line, pointA, pointB, duration, dataGenerator = interpolate) {
    const steps = 100;
    const dt = Math.max((duration / steps), 1);  // minimum timestep is 1ms per coordinate step

    for (const pos of dataGenerator(pointA, pointB, steps)) {
        // update marker location
        feature.getGeometry().setCoordinates(fromLonLat(pos));

        // add new line segment to the line
        // https://github.com/openlayers/openlayers/issues/6878#issuecomment-306469030
        if (line) {
            var geometry = line.getGeometry();
            geometry.appendCoordinate(fromLonLat(pos));
        }
        // sleep the loop (await is non-blocking due to async)
        await sleep(dt)  // ms
    }
};

// this is a generator
function* interpolateGreatCircle(a, b, steps) {
    // interpolate along a sphere: great circle
    // interpolate along earth-shape ellipsoid: geodesic

    // https://stackoverflow.com/a/23700/3382269
    // https://en.wikipedia.org/wiki/Great-circle_distance
    // http://www.edwilliams.org/avform147.htm
    // https://github.com/springmeyer/arc.js/blob/main/arc.js#L108
    // http://www.edwilliams.org/avform147.htm#Intermediate

    const D2R = Math.PI / 180;  // degrees to radians
    const R2D = 180 / Math.PI;  // radians to degrees

    const [lon1, lat1] = [a[0] * D2R, a[1] * D2R]  // a = [x1, y1]
    const [lon2, lat2] = [b[0] * D2R, b[1] * D2R]  // b = [x2, y2]

    let idx = 0;  // index of while loop
    const dx = (lon2 - lon1) / steps  // step size
    let f = 0.0;  // fractional step size normalized to 1 (0 to 1)

    // yields the intermediate points on a great circle
    while (idx < (steps + 1)) {
        f = idx / (steps + 1)  // normalize index

        var A = Math.sin((1 - f) * dx) / Math.sin(dx);
        var B = Math.sin(f * dx) / Math.sin(dx);

        var x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        var y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        var z = A * Math.sin(lat1) + B * Math.sin(lat2);

        var lat = R2D * Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
        var lon = R2D * Math.atan2(y, x);

        // increment the index count for the loop
        idx++;

        // yields interpolated point [x, y]
        yield [lon, lat];
    }
};


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function getDateObject(dateObject = null, offset = 0) {
    var today = null;

    // copies date object. If null, today's date.
    if (dateObject) {
        today = new Date(dateObject.getTime());
    } else {
        today = new Date();
    }

    today.setDate(today.getDate() + offset);

    return today
};

function formatDateString(dateObject) {
    // https://stackoverflow.com/a/1643468/3382269

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const ddd = dayNames[dateObject.getDay()];
    const mmm = monthNames[dateObject.getMonth()];
    var dd = String(dateObject.getDate()).padStart(2, '0');

    // var mm = String(dateObject.getMonth() + 1).padStart(2, '0'); // January is 0!
    // var yyyy = dateObject.getFullYear();

    const dateString = `${ddd}, ${mmm} ${dd}`;

    return dateString
};


FlightPath.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
};
