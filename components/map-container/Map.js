import { useState, useRef, useEffect } from 'react';

import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';

import MapContext from "./MapContext";

// React double initialization
// https://stackoverflow.com/q/72274015
// https://gis.stackexchange.com/q/429898

// Directly mutating state might be the issue here
// https://stackoverflow.com/a/37760774

// https://taylor.callsen.me/using-openlayers-with-react-functional-components/
// https://medium.com/swlh/how-to-incorporate-openlayers-maps-into-react-65b411985744

export default function MapCanvas({ children, view }) {

    // retrieve the map container div
    const mapRef = useRef(null);
    const mapObject = useRef(null);
    const [map, setMap] = useState(null);

    // component did mount (no dependency except on refresh)
    useEffect(() => {
        console.log('1. effect fired: new Map Object')

        // renders the map canvas to a <div> with 'ref' attribute as the target
        mapObject.current = new Map({ target: mapRef.current });

        setMap(mapObject.current);

        // clean up upon component unmount. This protects from double render!
        // https://gis.stackexchange.com/q/429898
        return () => {
            console.log("will unmount");
            mapObject.current.setTarget(null)
        };

    }, [])

    // updates the features of the vectorSource via its reference
    // mutable access to vectorSource
    useEffect(() => {
        console.log('2. effect fired: new View')

        // View responsbile for centering, zoom level, and projection
        mapObject.current.setView(new View({
            center: fromLonLat(view.center),
            zoom: view.zoom,
            projection: 'EPSG:3857',
        }),);

    }, [view]);

    return (
        <MapContext.Provider value={{ map }}>
            <div ref={mapRef} className="w-full h-[500px]">
                {children}
            </div>
        </MapContext.Provider>
    )
};
