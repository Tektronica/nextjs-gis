import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import MapContainer from '../components/map-container/Map';

import ShadowBox from '../components/containers/ShadowBox';

export default function Home() {

  return (
    <ShadowBox>

      <MapContainer
        view={{
          center: [-122.576164362, 48.135166126],
          zoom: 10
        }}>
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
