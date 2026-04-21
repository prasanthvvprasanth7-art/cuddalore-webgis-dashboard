// 1. Create map
const map = L.map('map').setView([11.55, 79.75], 9);

// 2. Basemap
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
});
L.control.scale({
  imperial: false,
  metric: true,
  position: 'bottomright'
}).addTo(map);
const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles &copy; Esri'
});


osm.addTo(map);
const baseMaps = {
  "OpenStreetMap": osm,
  "Satellite": satellite
};
function resetMapView() {
  map.fitBounds(homeBounds);
}
const homeBounds = [
  [11.318786601, 79.425524996],
  [11.891333943, 79.814556434]
];
document.getElementById("resetMapBtn").addEventListener("click", function () {
  map.setView([11.75, 79.75], 10);
});
L.control.layers(baseMaps, null, { collapsed: false }).addTo(map);
let boundaryLayer, coastLayer, floodLayer, lithologyLayer, roadwayLayer, railwayLayer, eprLayer, soilLayer;
function addLayerIfChecked(layer, checkboxId) {
  const cb = document.getElementById(checkboxId);
  if (cb && cb.checked) {
    layer.addTo(map);
  }
}

function toggleLayer(layer, checked) {
  if (!layer) return;

  if (checked) {
    if (!map.hasLayer(layer)) {
      layer.addTo(map);
    }
  } else {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  }
}

function setupLegendCheckboxes() {
  document.getElementById('chkBoundary').addEventListener('change', function () {
    toggleLayer(boundaryLayer, this.checked);
  });

  document.getElementById('chkCoast').addEventListener('change', function () {
    toggleLayer(coastLayer, this.checked);
  });

  document.getElementById('chkLithology').addEventListener('change', function () {
    toggleLayer(lithologyLayer, this.checked);
  });

  document.getElementById('chkRoadways').addEventListener('change', function () {
    toggleLayer(roadwayLayer, this.checked);
  });

  document.getElementById('chkRailways').addEventListener('change', function () {
    toggleLayer(railwayLayer, this.checked);
  });

  document.getElementById('chkEpr').addEventListener('change', function () {
    toggleLayer(eprLayer, this.checked);
  });

  document.getElementById('chkSoil').addEventListener('change', function () {
    toggleLayer(soilLayer, this.checked);
  });

  document.getElementById('chkFlood').addEventListener('change', function () {
    toggleLayer(floodLayer, this.checked);
  });
}
const layerPreviewData = {
  // Vector Layers
  chkBoundary: {
    title: "Boundary Layer Preview",
    image: "data/exportmages/BASE MAP.jpg"
  },
  chkCoast: {
    title: "Distance from Coast Preview",
    image: "data/exportmages/dis_from_coast.jpg"
  },
  chkLithology: {
    title: "Lithology Preview",
    image: "data/exportmages/lithology1.jpg"
  },
  chkRoadways: {
    title: "Roadways Preview",
    image: "data/exportmages/BASE MAP.jpg"
  },
  chkRailways: {
    title: "Railways Preview",
    image: "data/exportmages/BASE MAP.jpg"
  },
  chkEpr: {
    title: "EPR Preview",
    image: "data/exportmages/shorelinechange.jpg"
  },
  chkSoil: {
    title: "Soil Preview",
    image: "data/exportmages/soil1.jpg"
  },
  chkFlood: {
    title: "Flood Zones Preview",
    image: "data/exportmages/Logistic regression.jpg"
  },

  // Raster Layers
  chkRaster: {
    title: "Elevation Raster Preview",
    image: "data/exportmages/elevation1.jpg"
  },
  chkSlopeRaster: {
    title: "Slope Raster Preview",
    image: "data/exportmages/slope.jpg"
  },
  chkRainfallRaster: {
    title: "Rainfall Raster Preview",
    image: "data/exportmages/NErainfall.jpg"
  },
  chkBDRaster: {
    title: "BD Raster Preview",
    image: "data/exportmages/builtupdensity.jpg"
  },
  chkDDRaster: {
    title: "DD Raster Preview",
    image: "data/exportmages/DD.jpg"
  },
  chkLULCRaster: {
    title: "LULC Raster Preview",
    image: "data/exportmages/lulc.jpg"
  },
  chkSSZRaster: {
    title: "SSZ Raster Preview",
    image: "data/exportmages/strom_surge_zone.jpg"
  },
  chkTIZRaster: {
    title: "TIZ Raster Preview",
    image: "data/exportmages/TIDAL_INFLUENCEZONE.jpg"
  },

  // ML Outputs
  chkRF: {
    title: "Random Forest Output Preview",
    image: "data/exportmages/randomforest.jpg"
  },
  chkRegression: {
    title: "Regression Output Preview",
    image: "data/exportmages/Logistic regression.jpg"
  },
  chkGB: {
    title: "Gradient Boost Output Preview",
    image: "data/exportmages/gradientboost.jpg"
  }
};
let previewTimeout;
let activePreviewId = null;

function showLayerPreview(layerId, title, imagePath, duration = 10000) {
  const box = document.getElementById("layerPreviewBox");
  const img = document.getElementById("layerPreviewImg");
  const titleEl = document.getElementById("layerPreviewTitle");

  if (!box || !img || !titleEl) return;

  activePreviewId = layerId;
  titleEl.textContent = title;
  img.src = imagePath;

  img.onerror = function () {
    console.log("Preview image not found:", imagePath);
  };

  box.classList.remove("hidden");

  if (previewTimeout) clearTimeout(previewTimeout);

  previewTimeout = setTimeout(() => {
    hideLayerPreview();
  }, duration);
}

function hideLayerPreview() {
  const box = document.getElementById("layerPreviewBox");
  if (box) box.classList.add("hidden");

  activePreviewId = null;

  if (previewTimeout) clearTimeout(previewTimeout);
}

function openPreviewModal() {
  const previewImg = document.getElementById("layerPreviewImg");
  const previewTitle = document.getElementById("layerPreviewTitle");

  const modal = document.getElementById("previewModal");
  const modalImg = document.getElementById("previewModalImg");
  const modalTitle = document.getElementById("previewModalTitle");

  if (!previewImg || !modal || !modalImg || !modalTitle) return;
  if (!previewImg.src) return;

  modalImg.src = previewImg.src;
  modalTitle.textContent = previewTitle ? previewTitle.textContent : "Preview";
  modal.classList.remove("hidden");
}

function closePreviewModal() {
  const modal = document.getElementById("previewModal");
  if (modal) modal.classList.add("hidden");
}

document.getElementById("layerPreviewImg").addEventListener("click", openPreviewModal);
document.getElementById("closePreviewModal").addEventListener("click", closePreviewModal);

document.getElementById("previewModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closePreviewModal();
  }
});
document.querySelectorAll(".collapsible-toggle").forEach(button => {
  button.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const target = document.getElementById(targetId);
    const icon = this.querySelector(".toggle-icon");

    if (!target) return;

    target.classList.toggle("collapsed");

    if (target.classList.contains("collapsed")) {
      icon.textContent = "+";
      this.classList.remove("active");
    } else {
      icon.textContent = "−";
      this.classList.add("active");
    }
  });
});
document.getElementById("closePreviewBtn").addEventListener("click", hideLayerPreview);

Object.keys(layerPreviewData).forEach(checkId => {
  const checkbox = document.getElementById(checkId);

  if (checkbox) {
    checkbox.addEventListener("change", function () {
      const preview = layerPreviewData[checkId];

      if (this.checked) {
        showLayerPreview(checkId, preview.title, preview.image, 30000);
      } else {
        if (activePreviewId === checkId) {
          hideLayerPreview();
        }
      }
    });
  }
});
// 3. Boundary GeoJSON
fetch('data/Boundery.geojson')
  .then(res => res.json())
  .then(data => {
    boundaryLayer = L.geoJSON(data, {
      style: {
        color: 'red',
        weight: 2,
        fillOpacity: 0.05
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup('Boundary Layer');
      }
    })
    addLayerIfChecked(boundaryLayer, 'chkBoundary');

    map.fitBounds(boundaryLayer.getBounds());
    updateLayerControl();
  })
  .catch(err => console.error('Boundary error:', err));

// 4. Coast GeoJSON
fetch('data/coast.geojson')
  .then(res => res.json())
  .then(data => {
    coastLayer = L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 2
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup('Coast Layer');
      }
    });

    addLayerIfChecked(coastLayer, 'chkCoast');
    updateLayerControl();
  })
  .catch(err => console.error('Coast error:', err));
// 5. Lithology
fetch('data/lithology.geojson')
  .then(res => res.json())
  .then(data => {
    lithologyLayer = L.geoJSON(data, {
      style: {
        color: 'purple',
        weight: 1,
        fillOpacity: 0.2
      },
      onEachFeature: function (feature, layer) {
        const lithName = feature.properties.name || feature.properties.NAME || 'Lithology';
        layer.bindPopup('<b>Lithology:</b> ' + lithName);
      }
    })
    addLayerIfChecked(lithologyLayer, 'chklithology');
    updateLayerControl();
  })
  .catch(err => console.error('Lithology error:', err));

// 6. Roadways 
fetch('data/Roadways.geojson')
  .then(res => res.json())
  .then(data => {
    roadwayLayer = L.geoJSON(data, {
      style: {
        color: 'brown',
        weight: 2
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup('Roadways');
      }
    })
    addLayerIfChecked(RoadwayLayer, 'chkRoadways');

    updateLayerControl();
  })
  .catch(err => console.error('Roadways error:', err));
// 7.Railways

fetch('data/railways.geojson')
  .then(res => res.json())
  .then(data => {
    railwayLayer = L.geoJSON(data, {
      style: {
        color: 'green',
        weight: 2
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup('Roadways / Railways Layer');
      }
    })
    addLayerIfChecked(railwayLayer, 'chkrailways');

    updateLayerControl();
  })
  .catch(err => console.error('Railways error:', err));
 
  //8. EPR
fetch('data/epr.geojson')
  .then(res => res.json())
  .then(data => {
    eprLayer = L.geoJSON(data, {
      style: {
        color: 'green',
        weight: 2,
        fillOpacity: 0.2
      },
      onEachFeature: function (feature, layer) {
        const eprName =
          feature.properties.name ||
          feature.properties.NAME ||
          feature.properties.class ||
          feature.properties.CLASS ||
          'EPR Layer';

        layer.bindPopup('<b>EPR:</b> ' + eprName);
      }
    })
    addLayerIfChecked(eprLayer, 'chkepr');

    updateLayerControl();
  })
  .catch(err => console.error('EPR error:', err));

  // 9.Soil
fetch('data/soil.geojson')
  .then(res => res.json())
  .then(data => {
    soilLayer = L.geoJSON(data, {
      style: {
        color: 'darkgoldenrod',
        weight: 1,
        fillOpacity: 0.3
      },
      onEachFeature: function (feature, layer) {
        const soilName =
          feature.properties.name ||
          feature.properties.NAME ||
          feature.properties.soil ||
          feature.properties.SOIL ||
          'Soil Layer';

        layer.bindPopup('<b>Soil:</b> ' + soilName);
      }
    })
    addLayerIfChecked(soilLayer, 'chksoil');

    updateLayerControl();
  })
  .catch(err => console.error('Soil error:', err));

// 10. Flood Zones GeoJSON
// 10. Flood Zones GeoJSON
fetch('data/Floodlayer_RF.geojson')
  .then(res => res.json())
  .then(data => {
    floodLayer = L.geoJSON(data, {
      style: {
        color: 'orange',
        weight: 1,
        fillOpacity: 0.4
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup('Flood Zone');
      }
    });

    addLayerIfChecked(floodLayer, 'chkFlood');
    updateLayerControl();
  })
  .catch(err => console.error('Flood error:', err));

// 11. Layer control
function updateLayerControl() {
  if (window.layerControl) {
    map.removeControl(window.layerControl);
  }

  const overlayMaps = {};

  if (boundaryLayer) overlayMaps["Boundary"] = boundaryLayer;
  if (coastLayer) overlayMaps["Coast"] = coastLayer;
  if (floodLayer) overlayMaps["Flood Zones"] = floodLayer;
  if (lithologyLayer) overlayMaps["Lithology"] = lithologyLayer;
  if (RoadwaysLayer) overlayMaps["Roadways"] = RoadwayLayer;
  if (roadwaysLayer) overlayMaps["Railways"] = roadwayLayer;
  if (eprLayer) overlayMaps["EPR"] = eprLayer;
  if (soilLayer) overlayMaps["Soil"] = soilLayer;

  window.layerControl = L.control.layers(null, overlayMaps).addTo(map);
}
// Raster PNG Overlay
let rasterOverlay;

const rasterBounds = [
  [11.318786601, 79.425524996],
  [11.891333943, 79.814556434]
];

rasterOverlay = L.imageOverlay('data/Elevation.png', rasterBounds, {
  opacity: 0.7,
  interactive: true,
  alt: 'Elevation raster overlay'
});

if (document.getElementById('chkRaster').checked) {
  rasterOverlay.addTo(map);
}

document.getElementById('chkRaster').addEventListener('change', function () {
  if (this.checked) {
    if (!map.hasLayer(rasterOverlay)) {
      rasterOverlay.addTo(map);
    }
  } else {
    if (map.hasLayer(rasterOverlay)) {
      map.removeLayer(rasterOverlay);
    }
  }
});
let slopeRasterOverlay;

const slopeRasterBounds = [
  [11.318786601, 79.425524996],   // south west [ymin, xmin]
  [11.891333943, 79.814556434]    // north east [ymax, xmax]
];

slopeRasterOverlay = L.imageOverlay('data/Slope.png', slopeRasterBounds, {
  opacity: 0.55,
  interactive: true,
  alt: 'Slope raster overlay',
  className: 'raster-overlay'
});

if (document.getElementById('chkSlopeRaster').checked) {
  slopeRasterOverlay.addTo(map);
}

document.getElementById('chkSlopeRaster').addEventListener('change', function () {
  if (this.checked) {
    if (!map.hasLayer(slopeRasterOverlay)) {
      slopeRasterOverlay.addTo(map);
    }
  } else {
    if (map.hasLayer(slopeRasterOverlay)) {
      map.removeLayer(slopeRasterOverlay);
    }
  }
});
// ===============================
// COMMON BOUNDS FOR PNG RASTERS
// ===============================
const commonRasterBounds = [
  [11.318786601, 79.425524996],   // south west [ymin, xmin]
  [11.891333943, 79.814556434]    // north east [ymax, xmax]
];

// ===============================
// COMMON FUNCTION FOR PNG RASTER OVERLAY
// ===============================
function createRasterOverlay(filePath, checkboxId, altText, opacity = 0.45) {
  const overlay = L.imageOverlay(filePath, commonRasterBounds, {
    opacity: opacity,
    interactive: true,
    alt: altText,
    className: 'raster-overlay'
  });

  const checkbox = document.getElementById(checkboxId);

  if (checkbox && checkbox.checked) {
    overlay.addTo(map);
  }

  if (checkbox) {
    checkbox.addEventListener('change', function () {
      if (this.checked) {
        if (!map.hasLayer(overlay)) {
          overlay.addTo(map);
        }
      } else {
        if (map.hasLayer(overlay)) {
          map.removeLayer(overlay);
        }
      }
    });
  }

  return overlay;
}

// ===============================
// PNG RASTER OVERLAYS
// IMPORTANT:
// File names exact-ah un data folder-oda match aaganum
// ===============================
let rainfallRasterOverlay = createRasterOverlay(
  'data/Rainfall.png',
  'chkRainfallRaster',
  'Rainfall Raster',
  0.45
);

let bdRasterOverlay = createRasterOverlay(
  'data/BD.png',
  'chkBDRaster',
  'BD Raster',
  0.45
);

let ddRasterOverlay = createRasterOverlay(
  'data/DD.png',
  'chkDDRaster',
  'DD Raster',
  0.45
);

let LULCRasterOverlay = createRasterOverlay(
  'data/LULC.png',
  'chkLULCRaster',
  'LULC Raster',
  0.45
);

//raster layers
const tizRasterBounds = [
  [11.349384482, 79.663986612],   // south west [ymin, xmin]
  [11.877465371, 79.814699963]    // north east [ymax, xmax]
];

tizRasterOverlay = L.imageOverlay('data/TIZ.png', tizRasterBounds, {
  opacity: 0.45,
  interactive: true,
  alt: 'TIZ Raster',
  className: 'raster-overlay'
});

if (document.getElementById('chkTIZRaster').checked) {
  tizRasterOverlay.addTo(map);
}

document.getElementById('chkTIZRaster').addEventListener('change', function () {
  if (this.checked) {
    if (!map.hasLayer(tizRasterOverlay)) {
      tizRasterOverlay.addTo(map);
    }
  } else {
    if (map.hasLayer(tizRasterOverlay)) {
      map.removeLayer(tizRasterOverlay);
    }
  }
});
let sszRasterOverlay;

const sszRasterBounds = [
  [11.371637189, 79.691527964],   // south west [ymin, xmin]
  [11.877270768, 79.814494252]    // north east [ymax, xmax]
];

sszRasterOverlay = L.imageOverlay('data/SSZ.png', sszRasterBounds, {
  opacity: 0.45,
  interactive: true,
  alt: 'SSZ Raster',
  className: 'raster-overlay'
});

if (document.getElementById('chkSSZRaster').checked) {
  sszRasterOverlay.addTo(map);
}

document.getElementById('chkSSZRaster').addEventListener('change', function () {
  if (this.checked) {
    if (!map.hasLayer(sszRasterOverlay)) {
      sszRasterOverlay.addTo(map);
    }
  } else {
    if (map.hasLayer(sszRasterOverlay)) {
      map.removeLayer(sszRasterOverlay);
    }
  }
});
let rfOutputOverlay;
let regressionOutputOverlay;
let gbOutputOverlay;
// outputs

const mlOutputBounds = [
  [11.320320543, 79.428274310],   // south west [ymin, xmin]
  [11.889730117, 79.812598554]    // north east [ymax, xmax]
];
// ==============================
// ML OUTPUT IMAGE OVERLAYS
// ==============================

// Random Forest Output
rfOutputOverlay = L.imageOverlay('data/randomforest.png', mlOutputBounds, {
  opacity: 0.6
});

// Regression Output
regressionOutputOverlay = L.imageOverlay('data/regressionoutput.png', mlOutputBounds, {
  opacity: 0.6
});

// Gradient Boost Output
gbOutputOverlay = L.imageOverlay('data/gradientboost.png', mlOutputBounds, {
  opacity: 0.6
});

// Add if checked
addLayerIfChecked(rfOutputOverlay, 'chkRF');
addLayerIfChecked(regressionOutputOverlay, 'chkRegression');
addLayerIfChecked(gbOutputOverlay, 'chkGB');

function openProjectPDF() {
  document.getElementById('projectModal').style.display = 'block';
}

function closeProjectPDF() {
  document.getElementById('projectModal').style.display = 'none';
}

// modal outside click pannina close aaganum
window.addEventListener('click', function (event) {
  const modal = document.getElementById('projectModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
// 12. Supabase URL + key
const SUPABASE_URL = 'https://ctngkzykxelylwxqrcth.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BII5IxxS6Cxo1jFPBy8TXQ_a8hEuyZu';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadCounts() {
  try {
    const { count: boundaryCount, error: boundaryError } = await supabaseClient
      .from('boundary')
      .select('*', { count: 'exact', head: true });

    const { count: coastCount, error: coastError } = await supabaseClient
      .from('distance_from_coast')
      .select('*', { count: 'exact', head: true });

    const { count: floodCount, error: floodError } = await supabaseClient
      .from('randomforestoutput')
      .select('*', { count: 'exact', head: true });

    document.getElementById('boundaryCount').textContent =
      boundaryError ? 'Error' : boundaryCount;

    document.getElementById('coastCount').textContent =
      coastError ? 'Error' : coastCount;

    document.getElementById('floodCount').textContent =
      floodError ? 'Error' : floodCount;

    console.log('Boundary:', boundaryCount, boundaryError);
    console.log('Coast:', coastCount, coastError);
    console.log('Flood:', floodCount, floodError);

  } catch (err) {
    console.error('Supabase error:', err);
    document.getElementById('boundaryCount').textContent = 'Error';
    document.getElementById('coastCount').textContent = 'Error';
    document.getElementById('floodCount').textContent = 'Error';
  }
}

loadCounts();
setupLegendCheckboxes();
function openImpactsModal() {
  document.getElementById('impactsModal').style.display = 'block';
}

function closeImpactsModal() {
  document.getElementById('impactsModal').style.display = 'none';
}

window.addEventListener('click', function (event) {
  const impactsModal = document.getElementById('impactsModal');
  if (event.target === impactsModal) {
    impactsModal.style.display = 'none';
  }
});
document.getElementById('chkRF').addEventListener('change', function () {
  toggleLayer(rfOutputOverlay, this.checked);
});

document.getElementById('chkRegression').addEventListener('change', function () {
  toggleLayer(regressionOutputOverlay, this.checked);
});

document.getElementById('chkGB').addEventListener('change', function () {
  toggleLayer(gbOutputOverlay, this.checked);
});
