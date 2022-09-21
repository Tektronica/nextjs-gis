// https://www.kindacode.com/snippet/next-js-api-routes-how-to-get-parameters-query-string/

const WAIT_INTERVAL = 500;
let timerID;


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


// fetches routes matching at least source
async function getRoutes(departure, arrival, setRoutes) {

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

export { getAirports, getRoutes, getAirlines };
