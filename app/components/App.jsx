import React from 'react';

import Dropdown from 'react-dropdown';

import DataManager from './../js/DataManager.js'

import LocationForm from './LocationForm.jsx';
import DistrictMap from './DistrictMap.jsx';

import layers from './../js/layers.js'

import './../css/app.css';
import './../css/control-container.css';
import './../css/react-dropdown.css';

// For initial app state config. May not be necessary depending on UI choices.
const initLayerIndex = 0; //'house-districts'
const initAddress = '420 North Higgins Avenue, Missoula'
const initLnglat = [-113.99293899536133, 46.87292510231656];

export default class App extends React.Component {

  /* Lifecycle methods */

  constructor(props){
    super(props);
    this.dataManager = new DataManager(layers);
    this.state = {
      focusLnglat: null,
      focusAddress: null,
      mapsToRender: [],
      currentLayer: {
        key: 'null',
        label: null,
        data: null,
      },
    }

    this.layerDropdownConfig = this.buildLayerDropdownConfig(layers);

    this.handleNewLocation = this.handleNewLocation.bind(this);
    this.handleLayerSelect = this.handleLayerSelect.bind(this);
  }

  componentDidMount(){
    // SET DUMMY DATA
    // TODO: Think through what initial app state should be
    this.setState({
      focusLnglat: initLnglat,
      focusAddress: initAddress,
      mapsToRender: this.dataManager.locatePointOnLayers(initLnglat),
      currentLayer: layers[initLayerIndex],
    })
  }

  /* Render functions */

  render(){
    console.log('rendering w/ state...', this.state)

    return (
       <div className="app-container">

        <h1>Montana Boundaries</h1>

        {this.buildControlPanel()}

        {this.buildMap()}

      </div>
    );
  }

  buildControlPanel(){
    const isPointSelected = (this.state.focusLnglat != null)



    const addressContainer = this.state.focusAddress ? (
        <div className="address-container">
          {this.state.focusAddress}
        </div>
      ) : null;

    const controlContainer = (
      <div className="control-container">

        <div className="label">Location</div>
        {addressContainer}
        <LocationForm
          isPointSelected={isPointSelected}
          focusAddress={this.state.focusAddress}

          handleNewLocation={this.handleNewLocation}
        />

        <div className="label">Layer</div>
        <Dropdown
          options={this.layerDropdownConfig}
          value={this.state.currentLayer.label}
          placeholder={'Select layer'}

          onChange={this.handleLayerSelect}
        />
      </div>
    );

    return controlContainer;

  }

  buildMap(){
    const renderMap = this.state.mapsToRender.filter(map => map.key === this.state.currentLayer.key)[0];// filter returns an array
    const districtMap = renderMap ? (
        <DistrictMap
          key={renderMap.feature.properties.id}
          lnglat={this.state.focusLnglat}
          districtFeature={renderMap.feature}
          districtType={renderMap.label}
          districtName={renderMap.feature.properties.id}
          districts={this.state.currentLayer.data}
        />
      ) : null;

    return districtMap;
  }

  buildLayerDropdownConfig(layers){
    // Build config object for layer select dropdown
    // See https://www.npmjs.com/package/react-dropdown
    const layerCategories = [... new Set(layers.map(layer => layer.category))]

    const layerOptions = layerCategories.map(cat => {
      const items = layers
        .filter(layer => layer.category === cat)
        .map(layer => {
          return {
            value: layer.key,
            label: layer.label
          }
        });
      return { type: 'group', name: cat, items: items }
    })

    return layerOptions;
  }

  /* Utility functions */

  _getLayer(key){
    const curLayer = layers.filter(layer => {
      return layer.key === key;
    })[0];
    return curLayer;
  }

  /* Interaction handlers */

  handleNewLocation(location){
    // pass location as {lnglat, address} object
    const lnglat = location.lnglat;
    const address = location.address;
    const maps = this.dataManager.locatePointOnLayers(lnglat);

    this.setState({
      focusLnglat: lnglat,
      focusAddress: address,
      mapsToRender: maps
    });
  }

  handleLayerSelect(e){
    this.setState({
      currentLayer: this._getLayer(e.value),
    })
  }
}