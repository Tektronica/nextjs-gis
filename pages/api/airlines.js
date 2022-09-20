// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// https://openflights.org/data.html#airline
// https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat

const jsonData = require('./airlines.json');

export default async function handler(req, res) {
    const reqURL = req.url;
    // const reqQuery = req.query;

    const query = req.query;
    const { id, items } = query;

    const entries = id.split(',')
    const matches = entries.map(id => queryAirlines(id, items))

    res.status(200).json(matches)
};

function queryAirlines(airlineID, items) {
    var airlines = [];
    var matches = [];
    let suggestions = [];

    airlines = jsonData.map((airline, idx) => [idx, airline['Airline ID']])
    matches = airlines.sort().filter(airline => (airline[1] == airlineID));

    suggestions = matches.map((match) => jsonData[match[0]].Name)
    return suggestions.slice(0, items)
};
