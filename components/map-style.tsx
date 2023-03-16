
export const tilestyle = {
    type: 'raster',
    before: 'background',
    paint: {
      'raster-opacity': 1,   
    },
    'background-opacity': 1
  };
  
export const VectorLayer = {
    id: 'Vector',
    type: 'fill',
    paint: {
      'fill-outline-color': 'rgba(0,0,0,1)',
      'fill-color': 'rgba(0,0,0,0)'
    }
  };
  
export const PeatLayer = {
    id: 'Peat',
    type: 'fill',
    paint: {
      'fill-color': '#E1C16E'
    }
  };

  export const DFLayer = {
    id: 'DF',
    type: 'fill',
    paint: {
      'fill-color': '#ff0000'
    }
  };
  
  
 export const PalmsConsessionLayer = {
    id: 'PalmsConsession',
    type: 'line',
    source: 'PalmsConsession',
    paint: {
      'line-color': '#f39c13',
      'line-width': 1
    },
  };

export const ConsessionLabel = {
    id: 'PalmsConsessionLabel',
    type: 'symbol',
    source: 'PalmsConsession',
    layout: {
        "text-field": ["get", "name"],
        'text-variable-anchor': ['top'],
        "text-size": 12,
        "text-offset": [0, -1.5],
        'text-justify': 'auto',
      },
      paint: {
        "text-color": "#1d1485",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
      },
}

export const ProtectedAreaLayer = {
    id: 'ProtectedArea',
    type: 'fill',
    paint: {
      'fill-color': '#1d824c'
    }
  };
export const LineLayer = {
    id: 'LineVector',
    type: 'line',
    source: 'vector',
    paint: {
      'line-color': '#000',
      'line-width': 3
    }
  };
  
  const MAX_ZOOM_LEVEL = 10
  
export const HeatmapLayer = {
    id: 'heatmap',
    maxzoom: MAX_ZOOM_LEVEL,
    type: 'heatmap',
    paint: {
      // Increase the heatmap weight based on frequency and property magnitude
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,10,10,0)',
        0.2,
        'rgb(103,10,10)',
        0.4,
        'rgb(209,10,10)',
        0.6,
        'rgb(253,10,10)',
        0.8,
        'rgb(239,10,10)',
        0.9,
        'rgb(255,10,10)'
      ],
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
    }
  };


export const prevLayer = {
    id: 'radar-layer',
    type: 'raster',
    source: 'imgprev',
    paint: {
        'raster-fade-duration': 2
    }
}