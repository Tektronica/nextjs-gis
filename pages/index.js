import React, { useEffect, useRef } from 'react';
import Layout from '../components/Layout';

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat} from 'ol/proj';

export default function Home() {

  // retrieve the map container div
  const mapRef = useRef();

  // component did mount (no dependency except on refresh)
  useEffect(() => {

    // renders the map <div> with 'ref' attribute as the target
    const initialMap = new Map({ target: mapRef.current })


    // View responsbile for centering, zoom level, and projection
    initialMap.setView(new View({
      center: fromLonLat([-122.576164362, 48.135166126]),
      zoom: 10,
      // projection: 'EPSG:3857',
    }));

    // remote data
    const source = new OSM();

    // visual representation using remote data as source
    const layer = new TileLayer({ source: source })

    // add layer to the map renderer
    initialMap.addLayer(layer);

  }, [])

  return (
      <div ref={mapRef} className="w-full h-[500px]"></div>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
};
