// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// https://openflights.org/data.html#route
// https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat

const jsonData = require('./routes.json');

export default async function handler(req, res) {
    const query = req.query;
    const { departure, arrival, items } = query;

    const matches = queryRoutes(departure, arrival, items)
    res.status(200).json(matches)
};

function queryRoutes(departure, arrival, items = 10) {
    // departure and destination are IATA or ICAO codes 
    var routes = [];  // routes = [[index, departure, arrival], [...]]
    var matchLeft = [];  // filtered by departure
    var matchRight = [];  // filtered by departure and arrival

    routes = jsonData.map((route, idx) => [idx, route['Source airport'], route['Destination airport']])

    if (departure && arrival) {
        // sort alphabetically
        const sorted = routes.sort((a, b) => sortByColumn(a, b, 1));  // sort by second column

        // filter
        matchLeft = sorted.filter(row => (row[1] === departure));  // filter by first IATA code
        matchRight = matchLeft.filter(row => (row[2] === arrival));  // filter by second IATA code

        if (matchRight.length !== 0) {
            return (matchRight.map((match) => jsonData[match[0]]).slice(0, items));
        } else {
            const temp = sorted.filter(row => (row[2] === arrival));
            return (temp.map((match) => jsonData[match[0]]).slice(0, items));
        };
    } else {
        return [];
    }
};

function sortByColumn(a, b, col = 0) {
    // https://stackoverflow.com/a/16097058/3382269

    if (a[col] === b[col]) {
        return 0;
    }
    else {
        return (a[col] < b[col]) ? -1 : 1;
    };
};
