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
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


// data wranglings
d3.json(url).then(function (data) {
    console.log("=== Data successfully fetched! ===")
    console.log(data);

    // make choropleth layer
    let earthquakes = L.geoJSON(data, {
        pointToLayer: function(feature,coordinates) {
            let marker = L.circleMarker(coordinates, {
                radius: feature.properties.mag * 10,
                fillColor: null,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            })
        
            marker.bindPopup("<h3>" + feature.properties.title+"</h3><hr><p>" + `Depth: ${feature.geometry.coordinates[2]}` + "</p>");
            return marker;
        }
    });

    console.log(earthquakes)

    let baseMaps = {
        Street: street,
        Topography: topo
      };
      
      let overlayMaps = {
        Earthquakes: earthquakes,
      };
      
      L.control.layers(baseMaps, overlayMaps,{collapsed: false}).addTo(myMap);



var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
  
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);

});