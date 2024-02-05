// url that holds recent geojson data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// fn to create marker layer
function createMarkers(response) {
  console.log("=== Data successfully fetched! ===");
  console.log(response);

  // function that creates the popup information
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Depth: ${feature.geometry.coordinates[2]} // Magnitude: ${feature.properties.mag}.</p>`);
  }

  // create choropleth layer
  let earthquakes = L.geoJSON(response, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, coordinates) {
      let mag = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];
      return new L.circle(coordinates, {
        fillOpacity: 0.5,
        color: "black",
        weight: 1,
        fillColor: defColor(depth, response),
        radius: feature.properties.mag * 15000
      });
    } 
  });
  createMap(earthquakes)
};

// fn for defining color of circle based on depth of quake
function defColor(depth) {
  if (depth < 10) return '#2F4D2A';
  else if (depth < 30) return '#616D3D';
  else if (depth < 50) return '#F7A400';
  else if (depth < 70) return "#F38701";
  else if (depth < 90) return '#F37410';
  else return 'RED';
}

// fn to map it all together!   
function createMap(earthquakes) {
    
  // add tile layer (background map image) to map
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  
  let baseMaps = {
    Street: street,
  };

  let overlayMaps = {
    Earthquakes: earthquakes,
  };

  // define map defaults
  let myMap = L.map("map", {
    center: [40, -115],
    zoom: 5,
    layers: [street, earthquakes]
  });

  let info = L.control({
    position: "bottomright"
  });

  info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
  };
  
  info.addTo(myMap);
  // updateLegend(info);

  // draw legend
  var legend = L.control({
    position: "bottomright"
  });

  // define legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
  
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + defColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
}; 

// fetch data and begin making map
d3.json(url).then(console.log("Fetcing data...")).then(createMarkers);