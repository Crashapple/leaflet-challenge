var map = L.map('map').setView([37.7749, -122.4194], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

function chooseColor(depth) {
    if (depth > 90) return '#ee6937'; 
    else if (depth > 70) return '#eea137';
    else if (depth > 50) return '#eec037';
    else if (depth > 30) return '#eed937';
    else if (depth > 10) return '#c5e56c';
    else return '#a0ee5d';
}

d3.json(link).then(function(data) {
  
    function radius(magnitude) {
        return magnitude * 4;
    }

    function mapStyle(feature) {
      return {
      radius: radius(feature.properties.mag),  
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 0.5,
      opacity: 1,
      fillOpacity: 1
    };
    }

    function quakeInfo(feature, layer) {
        layer.bindPopup('<h3>' + feature.properties.place +
        '<p>Magnitude: ' + feature.properties.mag + '</p>' +
        '<p>Depth: ' + feature.geometry.coordinates[2] + ' km</p>');
    }

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },
        style: mapStyle,
        onEachFeature: quakeInfo
    }).addTo(map);
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);