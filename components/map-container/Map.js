import { useEffect, useRef } from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';

// React double initialization
// https://stackoverflow.com/q/72274015
// https://gis.stackexchange.com/q/429898

// Directly mutating state might be the issue here
// https://stackoverflow.com/a/37760774

// https://taylor.callsen.me/using-openlayers-with-react-functional-components/
// https://medium.com/swlh/how-to-incorporate-openlayers-maps-into-react-65b411985744

export default function MapContainer({ view }) {
    // retrieve the map container div
    const mapRef = useRef();

    // component did mount (no dependency except on refresh)
    useEffect(() => {

        const source = new OSM();

        const options = {
            // View responsbile for centering, zoom level, and projection
            view: new View({
                center: fromLonLat(view.center),
                zoom: view.zoom,
                projection: 'EPSG:3857',
            }),

            // visual representation using remote data as source
            layers: [
                new TileLayer({ source: source })
            ],
        }

        // renders the map canvas to a <div> with 'ref' attribute as the target
        const canvas = new Map({ ...options, target: mapRef.current });

        // clean up upon component unmount. This protects from double render!
        // https://gis.stackexchange.com/q/429898
        return () => {
            console.log("will unmount");
            canvas.setTarget(null)
        };

    }, [])

    return (
        <div ref={mapRef} className="w-full h-[500px]"></div>
    )
}
