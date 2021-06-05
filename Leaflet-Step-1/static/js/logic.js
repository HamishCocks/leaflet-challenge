d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson", createFeatures);

function createFeatures(response) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(response, {
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);

    //createMap(L.layerGroup(earthquakes))
};

function createMap(earthquakes) {

    var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    var baseMaps = {
    "Outdoor Map": outdoormap
    };

    var overlayMaps = {
        "Earthquakes": earthquakes
    };
    
    var map = L.map("map-id", {
    center: [39.3210, -111.0937],
    zoom: 3,
    layers: [outdoormap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);


    var info = L.control({
    position: "bottomright"
    });

    info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
    };

    // Add the info legend to the map
    info.addTo(map);

};