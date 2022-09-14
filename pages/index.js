import Layout from '../components/Layout';

import MapContainer from '../components/map-container/Map';
import Layers from '../components/map-container/layers/Layers';
import Tile from '../components/map-container/layers/TileLayer';
import Vector from '../components/map-container/layers/VectorLayer';
import addMarker from '../components/map-container/features/Marker';

import ShadowBox from '../components/containers/ShadowBox';

import OSM from 'ol/source/OSM';

export default function Home() {

  const source = new OSM();
  const center = [-122.576164362, 48.135166126];  // whidbey island

  // add features to vector layer
  var features = [];
  features.push(addMarker(center))
  features.push(addMarker([-122.5, 48.135166126]))

  return (
    <ShadowBox>

      <MapContainer view={{ center: center, zoom: 10 }}>
        <Layers>
          <Tile source={source} zIndex={0} />
          <Vector features={features} zIndex={0} />
        </Layers>
      </MapContainer>

    </ShadowBox>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
};
