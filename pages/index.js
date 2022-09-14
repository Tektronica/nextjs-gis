import Layout from '../components/Layout';

import MapContainer from '../components/map-container/Map';
import Layers from '../components/map-container/layers/Layers';
import Tile from '../components/map-container/layers/TileLayer';
import Vector from '../components/map-container/layers/VectorLayer';

import ShadowBox from '../components/containers/ShadowBox';

import OSM from 'ol/source/OSM';
import addMarker from '../components/map-container/features/Marker';

export default function Home() {

  const source = new OSM();
  const center = [-122.576164362, 48.135166126];  // whidbey island

  // marker
  const markerFeature = addMarker(center)

  return (
    <ShadowBox>

      <MapContainer view={{ center: center, zoom: 10 }}>
        <Layers>
          <Tile source={source} zIndex={0} />
          <Vector {...markerFeature} zIndex={0} />
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
