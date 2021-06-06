
function createMap(data) {

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
        "Magnitude": data
    };

    var map = L.map("map-id", {
        center: [31.7917, -7.0926],
        zoom: 3,
        layers: [outdoormap, data]
        });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(map);

    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 3, 3.5, 4, 4.5, 5];
            labels = ['<strong> Magnitude </strong>'];

    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += labels.push(
                '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
        }
        div.innerHTML = labels.join('<br>');
    
        return div;

    };
    
    legend.addTo(map);

};

function getColor(d) {
    return d >= 5 ? '#800026' :
           d >= 4.5  ? '#f60000' :
           d >= 4  ? '#f6a200' :
           d >= 3.5  ? '#f6e000' :
           d >= 3   ? '#c3f600' :
           '#3af600';
}

function getColour(d) {
        var color = "";

            if (d.properties.mag > 5) {
                return color = '#800026';
            }
            else if (d.properties.mag > 4.5) {
                return color = '#f60000';
            }
            else if (d.properties.mag > 4) {
                return color = '#f6a200';
            }
            else if (d.properties.mag > 3.5) {
                return color = '#f6e000';
            }
            else if (d.properties.mag > 3) {
                return color = '#c3f600';
            }
            else {
                return color = '#3af600';
            }
};

function createMarkers(response) {

    var data = response.features;

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }


    var quake = L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return new L.circle(latlng, {
                stroke: false,
                fillOpacity: 0.75,
                fillColor: getColour(feature),
                radius: (feature.properties.mag**4)*200
              })
        },
        onEachFeature: onEachFeature
    });
    
    createMap(quake);

};

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson", function(data) {
    createMarkers(data);
});