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
  const initialCenter = [-122.576164362, 48.135166126];  // whidbey island
  const [view, setView] = useState({ center: initialCenter, zoom: 10 });

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
        animateFeature(newFeature, pointA, pointB, duration)
        break;

      case 'flight':
        // simulate flight path

        console.log('flight was pressed')

        // pan to SEA and KEF
        const newCenter = [-70, 60];  // new center
        setView({ center: newCenter, zoom: 3 });  // new map view

        // interpolate across point A and B
        const SEA = [-122.3088, 47.4480];
        const KEF = [-22.6282, 63.9815];
        duration = 1000;  // animation duration (total ms)

        // create new feature
        newFeature = addMarker(SEA)
        setFeatures(oldArray => [...oldArray, newFeature]);

        // interpolation handled by generator inside async func
        animateFeature(newFeature, SEA, KEF, duration)
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

          <button
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={() => handleClick('flight')}
          >
            SEA to KEF
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
async function animateFeature(feature, pointA, pointB, duration) {
  const steps = 100;
  const dt = Math.max((duration / steps), 1);  // minimum timestep is 1ms per coordinate step

  for (const pos of interpolateGreatCircle(pointA, pointB, steps)) {
    feature.getGeometry().setCoordinates(fromLonLat(pos));

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

function* interpolateGreatCircle(a, b, steps) {
  // interpolate along a sphere: great circle
  // interpolate along earth-shape ellipsoid: geodesic

  // https://stackoverflow.com/a/23700/3382269
  // https://en.wikipedia.org/wiki/Great-circle_distance
  // http://www.edwilliams.org/avform147.htm
  // https://github.com/springmeyer/arc.js/blob/main/arc.js#L108
  // http://www.edwilliams.org/avform147.htm#Intermediate

  const D2R = Math.PI / 180;  // degrees to radians
  const R2D = 180 / Math.PI;  // radians to degrees

  const [lon1, lat1] = [a[0] * D2R, a[1] * D2R]  // a = [x1, y1]
  const [lon2, lat2] = [b[0] * D2R, b[1] * D2R]  // b = [x2, y2]

  let idx = 0;  // index of while loop
  const dx = (lon2 - lon1) / steps  // step size
  let f = 0.0;  // fractional step size normalized to 1 (0 to 1)

  // yields the intermediate points on a great circle
  while (idx < (steps + 1)) {
    f = idx / (steps + 1)  // normalize index

    var A = Math.sin((1 - f) * dx) / Math.sin(dx);
    var B = Math.sin(f * dx) / Math.sin(dx);

    var x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    var y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    var z = A * Math.sin(lat1) + B * Math.sin(lat2);

    var lat = R2D * Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    var lon = R2D * Math.atan2(y, x);

    // increment the index count for the loop
    idx++;

    // yields interpolated point [x, y]
    yield [lon, lat];

  }

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
};
