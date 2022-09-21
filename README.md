# NextJS GIS Project

This project utilizes the [OpenLayers](https://www.npmjs.com/package/ol) package to build a performant open-source GIS web app. The goal was to originally display the whale migration through the Puget Sound region. However, that api is no longer public!

Instead, I spent the remainder of this project building a mockup of a flight planner where a user can enter Departure/Arrival cities, plot that flight across the map, and display active service routes by airlines.

The data fetching is to a mock API with the help of nextjs. The client sends both the request and response to the endpoint. This demonstrates a typical setup where a client may query an endpoint to retrieve flight information.


![gif](public/gis-demo.gif)

## Features:
- Mock flight planner
- uses openLayers to render a map canvas.
    - Users can add markers and lines to create flight paths

## TODO:
- ~~Make a call to the necessary database api, I wonder if they'll pick up?~~
    - api is no longer public, so I built up my own
- Attempt to have this hosted on Vercel

## Dependencies
* Framework
    * [Nextjs](https://nextjs.org/)
    * [Tailwind CSS](https://tailwindcss.com/) [(v2.2)](https://blog.tailwindcss.com/tailwindcss-2-2) with Next.js using the new [`Just-in-Time Mode`](https://tailwindcss.com/docs/just-in-time-mode) feature from Tailwind CSS.
* API
    * [OpenLayers](https://www.npmjs.com/package/ol)
    * ~~[The Whale Hotline REST API](http://hotline.whalemuseum.org/api)~~
