import { useContext, useEffect } from "react";

import { Tile as TileLayer } from 'ol/layer';
import MapContext from '../MapContext';

const Tile = (props, zIndex = 0) => {

    const { map } = useContext(MapContext);

    useEffect(() => {

        if (!map) return;

        const tileObject = new TileLayer({ ...props })

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
};

export default Tile;
