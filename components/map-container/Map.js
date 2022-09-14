import { useState, useRef, useEffect } from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';

import MapContext from "./MapContext";

// React double initialization
// https://stackoverflow.com/q/72274015
// https://gis.stackexchange.com/q/429898

// Directly mutating state might be the issue here
// https://stackoverflow.com/a/37760774

// https://taylor.callsen.me/using-openlayers-with-react-functional-components/
// https://medium.com/swlh/how-to-incorporate-openlayers-maps-into-react-65b411985744

export default function MapContainer({ children, view }) {

    // retrieve the map container div
    const mapRef = useRef();
    const [map, setMap] = useState(null);

    // component did mount (no dependency except on refresh)
    useEffect(() => {

        const options = {
            // View responsbile for centering, zoom level, and projection
            view: new View({
                center: fromLonLat(view.center),
                zoom: view.zoom,
                projection: 'EPSG:3857',
            }),

            // visual representation using remote data as source
            layers: [],
        }

        // renders the map canvas to a <div> with 'ref' attribute as the target
        const mapObject = new Map({ ...options, target: mapRef.current });
        setMap(mapObject);

        // clean up upon component unmount. This protects from double render!
        // https://gis.stackexchange.com/q/429898
        return () => {
            console.log("will unmount");
            mapObject.setTarget(null)
        };

    }, [])

    return (
        <MapContext.Provider value={{ map }}>
            <div ref={mapRef} className="w-full h-[500px]">
                {children}
            </div>
        </MapContext.Provider>
    )
}
