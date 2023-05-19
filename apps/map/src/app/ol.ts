import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import MVT from 'ol/format/MVT.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js';

import db from './indexDB';
import { WebGLLayer } from './webglvectorlayer';

export class OL {
  public featureInfo!: string;
  public zoomInfo: number = 0;

  public osm = new TileLayer({
    source: new OSM(),
  });
  public mvtLayer = new VectorTileLayer({
    renderMode: 'vector', //'hybrid'
  });
  public vtLayer = new VectorLayer({
    declutter: true,
  });
  public webGlvtLayer = new WebGLLayer({});

  public map!: Map;
  private registerMapEvents() {
    let selected: any = null;
    this.map.on('pointermove', (e) => {
      if (selected !== null) {
        selected = null;
      }

      this.map.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        return true;
      });

      if (selected) {
        let prop = selected.getProperties();
        delete prop.geometry;
        delete prop.location;

        this.featureInfo = JSON.stringify(prop);
      } else {
        this.featureInfo = '';
      }
    });

    this.map.on('moveend', () => {
      this.zoomInfo = this.map.getView().getZoom() || 0;
    });
  }
  public sources = {
    combined_data: new VectorTileSource({
      maxZoom: 14,
      format: new MVT(),
      url: 'https://res-func-mapping-dev-westeu-1.azurewebsites.net/api/{z}/{x}/{y}.pbf?code=NMZeax8nx1jeZaojOMawLxscEBqd9xSIi-e_7pNep5fFAzFuTpjHkg==',
    }),
    combined_data_idb: new VectorTileSource({
      maxZoom: 14,
      format: new MVT(),
      url: undefined,
      tileUrlFunction: (coords) =>
        `https://res-func-mapping-dev-westeu-1.azurewebsites.net/api/${coords[0]}/${coords[1]}/${coords[2]}.pbf?code=NMZeax8nx1jeZaojOMawLxscEBqd9xSIi-e_7pNep5fFAzFuTpjHkg==`,
      tileLoadFunction: (tile: any, url: any) => {
        tile.setLoader(
          async (extent: any, resolution: any, projection: any) => {
            //console.log(url);
            const pbf = await (db as any).pbfStore.get({
              key: url,
            });

            if (pbf) {
              try {
                const format = tile.getFormat();
                const features = format.readFeatures(pbf.data, {
                  extent: extent,
                  featureProjection: projection,
                });
                tile.setFeatures(features);
              } catch (e) {
                console.log(e);
              }
            } else {
              fetch(url)
                .then((res) => {
                  if (res.status != 200) {
                    throw new Error('Bad server response');
                  }
                  return res.arrayBuffer();
                })
                .then(async (data) => {
                  //debugger;
                  await (db as any).pbfStore.put({ key: url, data: data });

                  try {
                    const format = tile.getFormat();
                    const features = format.readFeatures(data, {
                      extent: extent,
                      featureProjection: projection,
                    });
                    tile.setFeatures(features);
                  } catch (e) {
                    tile.setState(3);
                    console.log(e);
                  }

                  return data;
                });
            }
          }
        );
      },
    }),
    combined_data_geojson: new VectorSource({
      format: new GeoJSON(),
      loader: async (extent, resolution, projection) => {
        const url =
          'https://res-func-mapping-dev-westeu-1.azurewebsites.net/api/data.geojson?code=NMZeax8nx1jeZaojOMawLxscEBqd9xSIi-e_7pNep5fFAzFuTpjHkg==';
        const format = new GeoJSON();

        const _geojson = await (db as any).geojsonStore.get({
          key: url,
        });

        if (_geojson) {
          try {
            // const features = format.readFeatures({
            //   type: 'FeatureCollection',
            //   features: _geojson.data.map((item: any) => {
            //     return {
            //       geometry: JSON.parse(item.location),
            //       properties: item,
            //       type: 'Feature',
            //     };
            //   }),
            // });

            this.sources.combined_data_geojson.addFeatures(_geojson.data);
          } catch (e) {
            console.log(e);
          }
        } else {
          fetch(url)
            .then((res) => {
              if (res.status != 200) {
                throw new Error('Bad server response');
              }
              return res.json();
            })
            .then(async (resp) => {
              // const features = format.readFeatures({
              //   type: 'FeatureCollection',
              //   features: resp.map((item: any) => {
              //     return {
              //       geometry: JSON.parse(item.location),
              //       properties: item,
              //       type: 'Feature',
              //     };
              //   }),
              // });

              this.sources.combined_data_geojson.addFeatures(resp);

              await (db as any).geojsonStore.put({ key: url, data: resp });
              return resp;
            });
        }
      },
      //url: 'https://res-func-mapping-dev-westeu-1.azurewebsites.net/api/data.geojson?code=NMZeax8nx1jeZaojOMawLxscEBqd9xSIi-e_7pNep5fFAzFuTpjHkg==',
    }),
  };
  private getResolutions(): number[] {
    return [
      26458.31904584105, 21166.65523667284, 15874.99142750463,
      10583.32761833642, 5291.66380916821, 2645.831904584105, 2116.665523667284,
      1587.499142750463, 1058.332761833642, 793.7495713752315, 529.166380916821,
      264.5831904584105, 132.29159522920526, 66.14579761460263,
      26.45831904584105, 13.229159522920526, 6.614579761460263,
      2.6458319045841048, 1.9843739284380788, 1.3229159522920524,
      0.9260411666044367, 0.529166380916821, 0.2645831904584105,
      0.19843739284380787, 0.13229159522920525, 0.06614579761460262,
      0.02645831904584105, 0.013229159522920525, 0.006614579761460263,
      0.002645831904584105, 0.0013229159522920525,
    ];
  }
  public initMap() {
    this.map = new Map({
      layers: [this.osm],
      pixelRatio: 1,
      target: 'map',
      view: new View({
        center: [598501.931473, 6843980.420084],
        projection: 'EPSG:3857',
        zoom: 17,
      }),
    });

    this.registerMapEvents();
  }
}
