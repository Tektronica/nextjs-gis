import Layout from '../components/Layout';

import MapCanvas from '../components/map-container/Map';
import Layers from '../components/map-container/layers/Layers';
import Tile from '../components/map-container/layers/TileLayer';
import Vector from '../components/map-container/layers/VectorLayer';
import addMarker from '../components/map-container/features/Marker';

import ShadowBox from '../components/containers/ShadowBox';

import OSM from 'ol/source/OSM';
import { useState } from 'react';

export default function Home() {

  const source = new OSM();
  const center = [-122.576164362, 48.135166126];  // whidbey island

  // add features to vector layer

  // var features = [];
  // features.push(addMarker(center));
  // features.push(addMarker([-122.5, 48.135166126]));

  const [features, setFeatures] = useState([addMarker(center)]);

  function handleClick(id) {

    if (id == 'add') {
      // https://stackoverflow.com/a/54677026/3382269
      const coords = [-122.5, 48.135166126];
      setFeatures(oldArray => [...oldArray, addMarker(coords)]);

    } else if (id == 'delete') {
      console.log('delete was pressed')

    } else if (id == 'move') {
      console.log('move was pressed')
    }
  }

  return (
    <>
      <ShadowBox>

        <MapCanvas view={{ center: center, zoom: 10 }}>
          <Layers>
            <Tile source={source} zIndex={0} />
            <Vector features={features} zIndex={0} />
          </Layers>
        </MapCanvas>

      </ShadowBox>

      <ShadowBox>
        <div className="grid gap-x-4 grid-cols-3">
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => handleClick('add')}>
            Add Next Marker
          </button>

          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => handleClick('delete')}>
            Delete Last Marker
          </button>

          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => handleClick('move')}>
            Move Last Marker
          </button>

        </div>
      </ShadowBox>
    </>
  )
}



Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
};
