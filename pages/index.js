import Layout from '../components/Layout';

import MapContainer from '../components/map-container/Map';
import Layers from '../components/map-container/layers/Layers';
import Tile from '../components/map-container/layers/TileLayer';

import ShadowBox from '../components/containers/ShadowBox';

import OSM from 'ol/source/OSM';

export default function Home() {

  const source = new OSM();

  return (
    <ShadowBox>

      <MapContainer view={{ center: [-122.576164362, 48.135166126], zoom: 10 }}>
        <Layers>
          <Tile source={source} zIndex={0} />
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
