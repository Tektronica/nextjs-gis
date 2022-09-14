import { useContext, useEffect } from "react";

import { Vector as VectorLayer } from "ol/layer";
import VectorSource from 'ol/source/Vector';
import MapContext from '../MapContext';

const Vector = ({ features, zIndex = 1 }) => {

    const { map } = useContext(MapContext);

    useEffect(() => {

        if (!map) return;

        const vectorSource = new VectorSource({
            projection: 'EPSG:4326',
            features: features
        });

        // vector layer
        var vectorLayer = new VectorLayer({
            source: vectorSource
        });

        map.addLayer(vectorLayer)
        vectorLayer.setZIndex(zIndex);

        return () => {
            if (map) {
                console.log('remove layer')
                map.removeLayer(vectorLayer);
            }
        };

    }, [map]);

    return null;
}

export default Vector;
