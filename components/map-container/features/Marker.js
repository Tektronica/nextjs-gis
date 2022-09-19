import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style,
} from 'ol/style';


function addMarker(coordinates) {
    // https://stackoverflow.com/a/54695446/3382269
    // https://openlayers.org/en/latest/examples/feature-move-animation.html
    // https://openlayers.org/en/latest/examples/webgl-points-layer.html

    const point = new Point(fromLonLat(coordinates));
    const marker = new Feature(point);

    const options = {
        'geoMarker': new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({ color: 'black' }),
                stroke: new Stroke({
                    color: 'white',
                    width: 2,
                }),
            }),
        }),
    };

    marker.setStyle(options.geoMarker)

    return marker
};


export default addMarker;
