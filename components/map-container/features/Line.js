import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import Polyline from 'ol/format/Polyline';
import LineString from 'ol/geom/LineString';
import {
    Stroke,
    Style,
} from 'ol/style';


function addLine(coordinates) {
    // https://stackoverflow.com/a/20481018/3382269
    // https://openlayers.org/en/latest/examples/feature-move-animation.html
    // https://stackoverflow.com/a/41564159/3382269

    var lineString = new LineString(coordinates);
    // Convert line coordinates into the view's projection
    lineString.transform('EPSG:4326', 'EPSG:3857');

    const line = new Feature({
        type: 'route',
        geometry: lineString,
    });

    const options = {
        'route': new Style({
            stroke: new Stroke({
                width: 6,
                color: [237, 212, 0, 0.8],
            }),
        }),
    };

    line.setStyle(options.route)

    return line
}


export default addLine;
