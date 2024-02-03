// url that holds geojson data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// define map defaults
let myMap = L.map("map", {
    center: [40, -115],
    zoom: 5
  });

// add tile layer (background map image) to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// data wranglings
d3.json(url).then(function (data) {
    console.log("=== Data successfully fetched! ===")
    console.log(data);

    // store data locally
    // globalData = data;

    let markers = L.markerClusterGroup();

    for (let i = 0; i < data.features.length; i++) {
        let location = data.features[i].geometry.coordinates;
                
        if (location) {
            
            markers.addLayer(L.marker(location[0],location[1]))
                .bindPopup(data.features[i].descriptor);
        }
        
    }   

    myMap.addLayer(markers);

});