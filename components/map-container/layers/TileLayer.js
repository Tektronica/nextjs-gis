import { useContext, useEffect } from "react";

import TileLayer from 'ol/layer/Tile';
import MapContext from '../MapContext';

const Tile = ({ source, zIndex = 0 }) => {

    const { map } = useContext(MapContext);

    useEffect(() => {

        if (!map) return;

        const tileObject = new TileLayer({ source, zIndex })

        map.addLayer(tileObject)

        tileObject.setZIndex(zIndex);

        return () => {
            if (map) {
                console.log('remove layer')
                map.removeLayer(tileObject);
            }
        };

    }, [map]);

    return null;
}

export default Tile;
