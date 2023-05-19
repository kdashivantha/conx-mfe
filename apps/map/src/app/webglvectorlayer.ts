import Layer from 'ol/layer/Layer.js';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import { asArray } from 'ol/color.js';
import { packColor } from 'ol/renderer/webgl/shaders.js';

export class WebGLLayer extends Layer {
  override createRenderer(): any {
    return new WebGLVectorLayerRenderer(this, {
      fill: {
        attributes: {
          color: (feature: any) => {
            const color = asArray(feature.get('COLOR') || '#329932');
            return packColor(color);
          },

          opacity: () => {
            return 1;
          },
        },
      },

      stroke: {
        attributes: {
          color: (feature: any) => {
            if (feature.get('datatype') == 'sewer') {
              const color = asArray(feature.get('COLOR') || '#323299');
              return packColor(color);
            } else {
              return undefined;
            }
          },

          width: () => {
            return 1;
          },

          opacity: () => {
            return 1;
          },
        },
      },

      point: {
        attributes: {
          color: (feature: any) => {
            if (feature.get('datatype') == 'trees') {
              const color = asArray(feature.get('COLOR') || '#fbb03b');

              //color[3] = 0.85;

              return packColor(color);
            } else {
              return undefined;
            }
          },
        },
      },
    });
  }
}
