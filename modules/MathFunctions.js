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

// this is a generator
function* interpolate(a, b, steps) {
    // returns the interpolated step between a and b with a stepsize of dx

    const [x0, y0] = [a[0], a[1]]  // a = [x1, y1]
    const [x1, y1] = [b[0], b[1]]  // b = [x2, y2]

    let idx = 0;
    const dx = (x1 - x0) / steps
    let step = 0.0;

    while (idx < (steps + 1)) {
        // computes next step in linear interpolation
        step = x0 + (dx * idx)
        // compute the corresponding y component
        const y3 = (y0 * (x1 - step) + y1 * (step - x0)) / (x1 - x0)
        // increment the index count for the loop
        idx++;
        // yields interpolated point [x, y]
        yield [step, y3]
    }
};

function formatLonLat(lonlat) {
    const [lon, lat] = lonlat

    const NS = `${Math.abs(round(lat, 4))}` + ((lat < 0) ? '° S' : '° N');
    const WE = `${Math.abs(round(lon, 4))}` + ((lon < 0) ? '° W' : '° E');

    return `( ${NS}, ${WE} )`;
};

function randomCoord(center = [0, 0]) {
    // returns a random coord near a provided center
    const scaling = 0.001;
    const x = center[0] * (1 + Math.random() * randomSign() * scaling);
    const y = center[1] * (1 + Math.random() * randomSign() * scaling);
    return [x, y]
};

function randomSign() {
    // returns a random sign (polarity)
    return Math.random() < 0.5 ? -1 : 1
};


function round(arr, decimals = 1) {
    // returns rounded value for each list item 
    if (typeof arr === 'object') {
        return arr.map(a => round(a, decimals));
    } else {
        return Math.round(arr * (10 ** decimals)) / (10 ** decimals)
    }
};

export {
    interpolateGreatCircle,
    interpolate,
    formatLonLat,
    randomCoord,
    randomSign
};
