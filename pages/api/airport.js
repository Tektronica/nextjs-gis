// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// https://openflights.org/data.html
// https://stackoverflow.com/q/72120501/3382269
// https://nextjs.org/docs/api-routes/dynamic-api-routes

const jsonData = require('./airports.json');

export default async function handler(req, res) {
    const reqURL = req.url;
    // const reqQuery = req.query;

    const query = req.query;
    const { search } = query;
    console.log(search)

    const matches = queryCities(search)
    res.status(200).json(matches)
}

function queryCities(queryString) {
    console.log(queryString)
    var cities = [];
    var matches = [];
    let suggestions = [];

    cities = jsonData.map((airport, idx) => [idx, airport.City])

    if (queryString.length > 0) {
        const regex = new RegExp(`^${queryString}`, `i`);
        matches = cities.sort().filter(item => regex.test(item[1]));
    }
    suggestions = matches.map((match) => jsonData[match[0]])

    return suggestions
};
