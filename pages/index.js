import Layout from '../components/Layout';

import MapCanvas from '../components/map-container/Map';
import Layers from '../components/map-container/layers/Layers';
import Tile from '../components/map-container/layers/TileLayer';
import Vector from '../components/map-container/layers/VectorLayer';

import addMarker from '../components/map-container/features/Marker';
import addLine from '../components/map-container/features/Line';

import Interactions from '../components/map-container/interactions/Interactions';
import ClickPixel from '../components/map-container/interactions/ClickPixel';

import ShadowBox from '../components/containers/ShadowBox';

import OSM from 'ol/source/OSM';
import { useState } from 'react';
import { fromLonLat } from 'ol/proj';


export default function Home() {

  const source = new OSM();
  const initialCenter = [-122.576164362, 48.135166126];  // whidbey island
  const view = { center: initialCenter, zoom: 10 };

  // add features to vector layer
  const [features, setFeatures] = useState([addMarker(initialCenter)]);

  function handleClick(type) {
    // https://stackoverflow.com/a/54677026/3382269

    let oldArray = [];
    let coords = [];
    let lastFeature = null;
    let newFeature = null;
    let duration = 0.0;

    switch (type) {
      case 'add':
        // adds a new feature
        console.log('add was pressed')
        coords = randomCoord(initialCenter);
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
        coords = fromLonLat(randomCoord(initialCenter));
        lastFeature = features[features.length - 1]
        lastFeature.getGeometry().setCoordinates(coords);
        break;

      case 'animate':
        // animate position of feature

        console.log('animate was pressed')
        lastFeature = features[features.length - 1]

        // interpolate across point A and B
        const pointA = randomCoord(initialCenter);
        const pointB = randomCoord(initialCenter);
        duration = 1000;  // animation duration (total ms)

        // create new feature
        newFeature = addMarker(pointA)
        setFeatures(oldArray => [...oldArray, newFeature]);

        // interpolation handled by generator inside async func
        animateFeature(newFeature, null, pointA, pointB, duration, interpolate)
        break;

      default:
        throw new Error();
    }
  }

  return (
    <>
      <ShadowBox>

        <MapCanvas view={view}>

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
        <div className="grid gap-4 grid-cols-3">
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

          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={() => handleClick('animate')}
          >
            Animate Next Marker
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

// this is an async to handle position of a feature
async function animateFeature(feature, line, pointA, pointB, duration, dataGenerator = interpolate) {
  const steps = 100;
  const dt = Math.max((duration / steps), 1);  // minimum timestep is 1ms per coordinate step

  for (const pos of dataGenerator(pointA, pointB, steps)) {
    // update marker location
    feature.getGeometry().setCoordinates(fromLonLat(pos));

    // add new line segment to the line
    // https://github.com/openlayers/openlayers/issues/6878#issuecomment-306469030
    if (line) {
      var geometry = line.getGeometry();
      geometry.appendCoordinate(fromLonLat(pos));
    }
    // sleep the loop (await is non-blocking due to async)
    await sleep(dt)  // ms
  }
};

// this is a generator
function* interpolate(a, b, steps) {
  // returns the interpolated step between a and b with a stepsize of dx

  const [x0, y0] = [a[0], a[1]]  // a = [x1, y1]
  const [x1, y1] = [b[0], b[1]]  // b = [x2, y2]

  let idx = 0;
  const dx = (x1 - x0) / steps
  let step = 0.0;

  while (idx < (steps + 1)) {
    // computes next step in linear interpolation
    step = x0 + (dx * idx)
    // compute the corresponding y component
    const y3 = (y0 * (x1 - step) + y1 * (step - x0)) / (x1 - x0)
    // increment the index count for the loop
    idx++;
    // yields interpolated point [x, y]
    yield [step, y3]
  }
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
};
