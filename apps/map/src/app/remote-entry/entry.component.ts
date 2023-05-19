import { Component, OnInit } from '@angular/core';
import { OL } from '../ol';
import { stylefunction } from 'ol-mapbox-style';

@Component({
  selector: 'conx-mfe-map-entry',
  template: `
    <div class="d-flex h-100">
      <div id="map" class="map">
        <pre id="info" class="info">{{ ol.featureInfo }}</pre>
        <pre class="zoom-info btn btn-info btn-sm m-2">
 zoom: {{ ol.zoomInfo | number : '2.0-2' }}</pre
        >
      </div>
    </div>
  `,
})
export class RemoteEntryComponent implements OnInit {
  ol!: OL;

  constructor() {
    this.ol = new OL();
  }

  ngOnInit(): void {
    this.ol.osm.setVisible(true);
    this.ol.vtLayer.setSource(this.ol.sources.combined_data_geojson);

    this.ol.initMap();
    this.ol.map.addLayer(this.ol.vtLayer);

    try {
      fetch('http://localhost:4201/assets/mystyle3-geojson2.json')
        .then((res) => {
          return res.json();
        })
        .then((glStyle) => {
          //stylefunction(this.ol.vtLayer, glStyle, 'states');
        });
    } catch (e) {
      console.log(e);
    }
  }
}
