import { useEffect } from 'react';

import Layout from '../components/Layout';

import ShadowBox from '../components/containers/ShadowBox';
import TypeAhead from '../components/dropdown/TypeAhead';

// custom openLayers components
import MapCanvas from '../components/map-container/Map';
import { Layers, Tile, Vector } from '../components/map-container/layers'
import { addMarker, addLine } from '../components/map-container/features'

// openLayers components
import Interactions from '../components/map-container/interactions/Interactions';
import ClickPixel from '../components/map-container/interactions/ClickPixel';

import OSM from 'ol/source/OSM';
import { useState } from 'react';
import { fromLonLat } from 'ol/proj';

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

    const [whereFrom, setWhereFrom] = useState({ match: null, label: [], suggestions: [], matches: [] })
    const [whereTo, setWhereTo] = useState({ match: null, label: [], suggestions: [], matches: [] })
    const [routes, setRoutes] = useState([])

    // add features to vector layer
    const [features, setFeatures] = useState([]);
    const source = new OSM();
    const initialCenter = [-100, 40];  // center
    const [view, setView] = useState({ center: initialCenter, zoom: 2 });


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

            // setMatches(json_data);
            setState(current => ({
                ...current,
                suggestions: items,
                matches: json_data
            }));

        }, WAIT_INTERVAL);
    };

    // sets the selection from the typeahead dropdown
    function setSelection(idx, setValue) {
        setValue(current => ({
            match: current.matches[idx],
            label: `${current.matches[idx].City} (${current.matches[idx].ICAO})`,
            suggestions: [],
            matches: []
        }));
    };

    // fetches routes matching at least source
    async function getRoutes(departure, arrival) {

        // query params 
        const searchParams = new URLSearchParams({
            departure: departure,
            arrival: arrival,
            items: 10
        })

        // append search parameters to the api url
        const url = '/api/routes/?' + searchParams

        const response = await fetch(url, {
            method: 'GET',
            crossDomain: true,
        });

        if (!response.ok) {
            throw new Error('Network resposne was not OK')
        };

        const json_data = await response.json()
        const airlines = await getAirlines(json_data)

        const tableData = json_data.map((route, idx) => (
            {
                airline: airlines[idx],
                aircraft: '787',
                departure: route['Source airport'],
                arrival: route['Destination airport']
            }
        ));

        setRoutes(tableData)
    };

    // fetches routes matching at least source
    async function getAirlines(allEntries) {

        const entries = allEntries.map((row) => (row['Airline ID']))

        // query params 
        const searchParams = new URLSearchParams({
            id: entries,
            items: 10
        })

        // append search parameters to the api url
        const url = '/api/airlines/?' + searchParams

        const response = await fetch(url, {
            method: 'GET',
            crossDomain: true,
        });

        if (!response.ok) {
            throw new Error('Network resposne was not OK')
        };

        const json_data = await response.json()
        return json_data;
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
                setView({ center: newCenter, zoom: 2 });  // new map view

                // interpolate across point A and B
                const pointA = [whereFrom.match.Longitude, whereFrom.match.Latitude];
                const pointB = [whereTo.match.Longitude, whereTo.match.Latitude];
                duration = 1000;  // animation duration (total ms)

                // create new feature
                newFeature = addMarker(pointA)

                const newLine = addLine([pointA]);
                setFeatures(oldArray => [...oldArray, newLine, newFeature]);

                // interpolation handled by generator inside async func
                animateFeature(newFeature, newLine, pointA, pointB, duration, interpolateGreatCircle)
                break;

            default:
                throw new Error();
        }
    };

    // update table after both airports are selected
    useEffect(() => {
        if ((whereTo.match) && (whereTo.match)) {
            console.log('data')
            getRoutes(whereFrom.match.IATA, whereTo.match.IATA);
        } else {
            console.log('no data')
            setRoutes([]);
        };

    }, [whereFrom, whereTo]);

    return (
        <>
            <ShadowBox>
                <div className="grid gap-4 grid-cols-2">
                    {/* route */}
                    <div className="grid grid-cols-2">
                        <TypeAhead
                            value={whereFrom.label}
                            suggestions={whereFrom.suggestions}
                            placeholder={'Where From?'}
                            onChange={(arg) => getAirports(arg, setWhereFrom)}
                            onInput={(arg) => setWhereFrom(current => ({ ...current, label: arg, match: null }))}
                            onClick={(arg) => setSelection(arg, setWhereFrom)}
                        />

                        <TypeAhead
                            value={whereTo.label}
                            suggestions={whereTo.suggestions}
                            placeholder={'Where From?'}
                            onChange={(arg) => getAirports(arg, setWhereTo)}
                            onInput={(arg) => setWhereTo(current => ({ ...current, label: arg, match: null }))}
                            onClick={(arg) => setSelection(arg, setWhereTo)}
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
                <div className="grid gap-4 grid-cols-2">
                    <div className="text-left">
                        <AirportCard location={whereFrom} />
                    </div>
                    <div className="text-right">
                        <AirportCard location={whereTo} />
                    </div>
                </div>
            </ShadowBox>

            <ShadowBox>
                <div className="grid gap-4 grid-cols-3">
                    <button
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                        onClick={() => handleClick('flight')}
                    >
                        Fly!
                    </button>
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

            <ShadowBox>
                <RoutesTable routes={routes} />
            </ShadowBox>

        </>
    )
};

function RoutesTable({ routes }) {
    // routes arg is a list of routes matching the source/destination fields
    // https://openflights.org/data.html#route

    return (

        <div className="max-h-[400px] overflow-y-auto">
            <table
                id='routes-table'
                className="w-full text-sm text-left text-gray-800"
            >
                <thead>
                    <tr>
                        <th className='px-6 py-3'>Airline</th>
                        <th className='px-6 py-3'>Aircraft</th>
                        <th className='px-6 py-3'>Departure</th>
                        <th className='px-6 py-3'>Arrival</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (!routes) ? null : (

                            routes.map((route, idx) => {

                                return (
                                    <tr key={idx} className='bg-white border-b hover:bg-gray-200' >
                                        <td className='px-6 py-4 text-gray-500'>
                                            {route.airline}
                                        </td>
                                        <td className='px-6 py-4 text-gray-500'>
                                            {route.aircraft}
                                        </td>
                                        <td className='px-6 py-4 text-gray-500'>
                                            {route.departure}
                                        </td>
                                        <td className='px-6 py-4 text-gray-500'>
                                            {route.arrival}
                                        </td>
                                    </tr>
                                )
                            })
                        )
                    }

                </tbody>
            </table>
        </div>
    )
};

function AirportCard({ location }) {
    if (location.match) {
        const airport = location.match
        const label = `${airport.Name} - ${airport.IATA}`.replace('International', "Int'l")
        const baseUrl = 'https://flightaware.com/live/airport/'
        const LonLatString = formatLonLat([airport.Longitude, airport.Latitude])

        return (

            <>
                <div className="">
                    {airport.ICAO}
                </div>
                <div className="uppercase font-bold">
                    {`${airport.City} - ${airport.Country}`}
                </div>
                <div className="">
                    <a
                        className="text-cyan-600 hover:text-lime-600"
                        href={baseUrl + airport.ICAO}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>
                            {
                                (label.split('/')).map((text, idx) => (
                                    <p key={idx}>
                                        {((idx == 0) ? '' : '/') + text}
                                    </p>
                                ))
                            }
                        </span>
                    </a>
                </div>
                <div className="">
                    {LonLatString}
                </div>
            </>
        )
    } else {

        return (
            <>
                <div className="">
                    --
                </div>
                <div className="uppercase font-bold">
                    --
                </div>
                <div className="">
                    --
                </div>
                <div className="">
                    --
                </div>
            </>
        )
    };
};

function formatLonLat(lonlat) {
    const [lon, lat] = lonlat

    const NS = `${Math.abs(round(lat, 4))}` + ((lat < 0) ? '° S' : '° N');
    const WE = `${Math.abs(round(lon, 4))}` + ((lon < 0) ? '° W' : '° E');

    return `( ${NS}, ${WE} )`;
};

function round(arr, decimals = 1) {
    // returns rounded value for each list item 
    if (typeof arr === 'object') {
        return arr.map(a => round(a, decimals));
    } else {
        return Math.round(arr * (10 ** decimals)) / (10 ** decimals)
    }
};

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
        await sleep(dt);  // ms
    };
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
    };
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
    };

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
