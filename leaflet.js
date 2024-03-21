var map = L.map("map").setView([-8.409518, 115.188919], 11);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var markers = [];

function addMarker(e) {
    //add marker
    var marker = L.marker(e.latlng).addTo(map)
    
    //remove insted if clicked
    marker.on('click', function(){
        var index = markers.indexOf(marker);
        if (index !== -1) {
            // Remove the marker from the map
            map.removeLayer(marker);
        
            // Remove the marker from the markerArray
            markers.splice(index, 1);
        }
    });

    markers.push(marker);
}

map.on("click", addMarker);