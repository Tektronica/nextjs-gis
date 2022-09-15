import Layout from '../components/Layout';

import MapCanvas from '../components/map-container/Map';
import Layers from '../components/map-container/layers/Layers';
import Tile from '../components/map-container/layers/TileLayer';
import Vector from '../components/map-container/layers/VectorLayer';

import addMarker from '../components/map-container/features/Marker';

import Interactions from '../components/map-container/interactions/Interactions';
import ClickPixel from '../components/map-container/interactions/ClickPixel';

import ShadowBox from '../components/containers/ShadowBox';

import OSM from 'ol/source/OSM';
import { useState } from 'react';
import { fromLonLat } from 'ol/proj';


export default function Home() {

  const source = new OSM();
  const center = [-122.576164362, 48.135166126];  // whidbey island

  // add features to vector layer
  const [features, setFeatures] = useState([addMarker(center)]);

  function handleClick(type) {
    // https://stackoverflow.com/a/54677026/3382269

    let oldArray = [];
    let coords = [];

    switch (type) {
      case 'add':
        // adds a new feature
        console.log('add was pressed')
        coords = randomCoord(center);
        setFeatures(oldArray => [...oldArray, addMarker(coords)]);
        break;

      case 'delete':
        // deletes the last feature created
        console.log('delete was pressed')
        oldArray = [...features]
        oldArray.pop()
        setFeatures(oldArray);
        break;

      case 'move':
        // updates last feature coordinate position
        // https://openlayers.org/en/latest/examples/feature-move-animation.html
        // https://gis.stackexchange.com/a/189638

        console.log('move was pressed')
        const lastFeature = features[features.length - 1]
        console.log(lastFeature)
        coords = fromLonLat(randomCoord(center));
        lastFeature.getGeometry().setCoordinates(coords);
        break;

      default:
        throw new Error();
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

          <Interactions>
            <ClickPixel />
          </Interactions>

        </MapCanvas>

      </ShadowBox>

      <ShadowBox>
        <div className="grid gap-x-4 grid-cols-3">
          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={() => handleClick('add')}
          >
            Add Next Marker
          </button>

          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={() => handleClick('delete')}
          >
            Delete Last Marker
          </button>

          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={() => handleClick('move')}
          >
            Move Last Marker
          </button>

        </div>
      </ShadowBox>
    </>
  )
}


function randomCoord(center = [0, 0]) {
  // returns a random coord near a provided center
  const scaling = 0.001;
  const x = center[0] * (1 + Math.random() * randomSign() * scaling);
  const y = center[1] * (1 + Math.random() * randomSign() * scaling);
  return [x, y]
};


function randomSign() {
  // returns a random sign (polarity)
  return Math.random() < 0.5 ? -1 : 1
};


Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
};
