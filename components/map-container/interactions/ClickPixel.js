

import { useContext, useEffect } from "react";

import { toLonLat } from 'ol/proj';
import MapContext from "../MapContext";

const ClickPixel = () => {

    const { map } = useContext(MapContext);

    useEffect(() => {
        if (!map) return;

        map.on('click', (evt) => handleMapClick(evt));

        // map click handler
        const handleMapClick = (event) => {
            // https://stackoverflow.com/a/50991384/3382269

            // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
            //  https://stackoverflow.com/a/60643670
            const clickedCoord = map.getCoordinateFromPixel(event.pixel);

            // transform coord to EPSG 4326 standard Lat Long
            const transormedCoord = toLonLat(clickedCoord)

            // set React state
            console.log(transormedCoord)
        }

        // return () => {
        //     if (map) {
        //         console.log('remove layer')
        //         map.removeLayer(tileObject);
        //     }
        // };

    }, [map]);

    return null;
}

export default ClickPixel;