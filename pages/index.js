import Layout from '../components/Layout';

export default function Home() {



  return (
    <div className=''>
      <h1 className="text-3xl font-bold underline">
        Hello world!!!
      </h1>
      {/* <div ref={mapRef} className="map-container"></div> */}
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return (
      <Layout>
          {page}
      </Layout>
  )
};
