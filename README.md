# missoula-boundaries

WIP Web app that lets users enter a Montana address, returns which county/municipalities/school districts/legislative districts it's part of. Inspired by [Seattle Boundaries](https://github.com/seattleio/boundaries).

## Requirements

Needs a [Mapbox public token](https://www.mapbox.com/help/how-access-tokens-work/) key. Using dotenv,  token is stored in MAPBOX_API_TOKEN. See `.env.example`.

## Project components:

- Geographic data store --> Geojson files in github repo directory
    - Shapefile data is easily available for most districts. Will need to collect/clean/standardize as GeoJSON
- Data processing system for taking a point (lat/long coords) and returning the boundaries it's part of. Uses [Turf.js](https://github.com/Turfjs/turf).
- Front end application
    - React
    - [react-map-gl](https://github.com/uber/react-map-gl). Poorly documented but powerful React binding for [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/).

## Project structure

- app/ - source directory
    - /components/ - React components
        - App.jsx - Wrapper
        - layers.js - config file for map layers
        - DataManager.js - non-display class for managing app data w/ Turf.js
            - handles lat/long within calculation
        - LocationForm.jsx - React component for entering location of interest
            - collects address, geocodes, passes to DataManager
        - DistrictMap.jsx - React component for displaying interest point inside appropriate boundaries
    - /css/
    - /geodata/ - Geojson boundary data
- build/ - build directory
- scripts - Scripts for data collection/processing (e.g. converting source shapefiles to geojson)


## TODOS:

- Add more layers (school districts, municipalities)
    - stitch together school districts (consolidated districts --> elem, hs layers, subset of elem layers)
- Figure out what initial app state should look like
- Look at nested layer display in dropdown
- Try showing non-selected boundaries on map (Turns out this is memory intensive w/out optimization work - maybe try a canvas layer instead of an SVG one)
- Set up address input box to display current address?
- Add map controls: Zoom to street level, Zoom to district extent
- Fix map extent fitting wackiness
- Map: Limit zoom extents to Montana. Maybe highlight state boundary
- Map: Fine-tune Mapbox styling (e.g. deemphasize trailer park names)
- Fine-tune map interaction (e.g. animations between different views)
- Add buttons for 'default locations'
- Add way to select point apart from entering address (e.g. drop pin)
- User testing
- General refactoring

## Potential stretch features

- Add in information for certain districs (e.g. reps, contact information?)
- Set up some sort of async data layer loading? (If initial bundle gets too big)




## References:
- https://github.com/seattleio/boundaries-api
- https://github.com/seattleio/boundaries
- https://github.com/seattleio/seattle-boundaries-data
- https://github.com/mapbox/mapbox-react-examples

Looks like Seattle Boundaries is split into web app, API and geography repos. Web app is built with Choo (some lightweight JS framework) and Mapbox maps. API uses Node's http server, it looks like.

The geography (boundaries) repo stores things as geojsons, with some packaging so they're hosted on [NPM](https://www.npmjs.com/package/seattle-boundaries). The overall project uses node/NPM to collect its parts together.

References for setting up react development environment with webpack/Babel:
- https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel
- https://stanko.github.io/webpack-babel-react-revisited/
- https://blog.jonathanargentiero.com/how-to-load-a-json-content-inside-a-js-module-with-webpack/
- https://github.com/ReactJSResources/react-webpack-babel
- https://webpack.js.org/guides/production/
