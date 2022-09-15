import { useContext, useRef, useState, useEffect } from "react";

import { Vector as VectorLayer } from "ol/layer";
import VectorSource from 'ol/source/Vector';
import MapContext from '../MapContext';


const Vector = ({ features, zIndex = 1 }) => {

    const { map } = useContext(MapContext);

    // keep reference since we update features dynamically
    const vectorSource = useRef(
        new VectorSource({
            projection: 'EPSG:4326',
            features: []
        })
    );

    // handles only adding the layer once map is ready
    useEffect(() => {
        console.log('1 fired')
        if (!map) return;

        // the vector layer holds a reference to the vectorSource
        // can be updated dynamically outside this useEffect
        const vectorLayer = new VectorLayer({
            source: vectorSource.current
        })

        map.addLayer(vectorLayer)
        vectorLayer.setZIndex(zIndex)

        return () => {
            if (map) {
                console.log('remove layer')
                map.removeLayer(vectorLayer);
            }
        };

    }, [map]);

    // updates the features of the vectorSource via its reference
    // mutable access to vectorSource
    useEffect(() => {
        console.log('2 fired')
        vectorSource.current.clear(true)
        vectorSource.current.addFeatures(features)
    }, [features]);

    return null;
}


export default Vector;
