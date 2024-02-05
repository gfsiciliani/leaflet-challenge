// url that holds geojson data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


// define map defaults
let myMap = L.map("map", {
    center: [40, -115],
    zoom: 5
});

// add tile layer (background map image) to map
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// fn for defining color based on depth of quake
function getColor(depth) {
  if (depth < 10) return '#2F4D2A';
  else if (depth < 30) return '#616D3D';
  else if (depth < 50) return '#F7A400';
  else if (depth < 70) return "#F38701";
  else if (depth < 90) return '#F37410';
  else return 'RED';
}

// Fetch and plot data
d3.json(url).then(function (data) {
    console.log("=== Data successfully fetched! ===")
    console.log(data);
    



    // make choropleth layer
    let earthquakes = L.geoJSON(data, {
        pointToLayer: function(feature,coordinates) {
          
          console.log(coordinates.alt);
          
          let marker = L.circleMarker(coordinates, {
                radius: feature.properties.mag * 10,
                fillColor: getColor(coordinates.alt),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            })
        
            marker.bindPopup("<h3>" + feature.properties.title+"</h3><hr><p>" + `Depth: ${feature.geometry.coordinates[2]}` + "</p>");
            return marker;
        }
    });

    let baseMaps = {
        Street: street,
      };
      
      let overlayMaps = {
        Earthquakes: earthquakes,
      };
      
      // L.control.layers(baseMaps, overlayMaps,{collapsed: false}).addTo(myMap);

// draw legend
var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
  
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);

});