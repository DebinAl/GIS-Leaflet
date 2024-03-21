// button
var isMarkerActive = true;
var isEditActive = false;

//marker array
var positionsBuffer = [];
var positions = [];
var points = [];

const markerButton = document.querySelector("#btn-marker");
const polylineButton = document.querySelector("#btn-polyline");
const editButton = document.querySelector("#btn-edit");
const editOption = document.querySelector("#edit-option");
const cancelButton = document.querySelector("#btn-cancel");
const saveButton = document.querySelector("#btn-save");
const clearButton = document.querySelector("#btn-clear");

markerButton.addEventListener("click", function () {
    if (!markerButton.classList.contains("btn-active")) {
        toggleOverlay();
    }
    editButton.removeAttribute("disabled");
});

polylineButton.addEventListener("click", function () {
    if (!polylineButton.classList.contains("btn-active")) {
        toggleOverlay();
    }
    editButton.setAttribute("disabled", true);
});

editButton.addEventListener("click", function () {
    if (!editButton.classList.contains("btn-active")) {
        toggleEditButton();
    }
});

clearButton.addEventListener("click", function () {
    points.forEach(point => {
        map.removeLayer(point);
    })

    points = [];
    positions = []; 
    positionsBuffer = [];
});

cancelButton.addEventListener("click", function () {
    toggleEditButton();

    positionsBuffer = Array.from(positions);

    setOverlayView();
});

saveButton.addEventListener("click", function () {
    toggleEditButton();

    positions = Array.from(positionsBuffer);

    localStorage.setItem('positions', JSON.stringify(positions));
});

function toggleEditButton() {
    isEditActive = !isEditActive;

    markerButton.toggleAttribute("disabled");
    polylineButton.toggleAttribute("disabled");
    editButton.classList.toggle("btn-active");
    editOption.classList.toggle("hidden");
}

function toggleOverlay() {
    isMarkerActive = !isMarkerActive;
    markerButton.classList.toggle("btn-active");
    polylineButton.classList.toggle("btn-active");

    setOverlayView();
}

// Leaflet ------------

//leaflet instance
var map = L.map("map").setView([-8.409518, 115.188919], 11);

//leaflet tileLayer map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function setOverlayView() {

    points.forEach(point => {
        map.removeLayer(point);
    })

    if (isMarkerActive) {
        points = [];

        positions.forEach(position => {
            var marker = L.marker(position).addTo(map);
            marker.on("contextmenu", function () {
                deletePoint(marker);
            });
            points.push(marker);
        })
    } else {
        points = [];

        var polyline = L.polyline(positions).addTo(map);
        points.push(polyline);
    }
}

function deletePoint(point) {
    if (point instanceof L.Marker) {
        var index = points.indexOf(point);
        if (index !== -1) {
            // Remove the marker from the map
            map.removeLayer(point);
            // Remove the marker from the markerArray
            points.splice(index, 1);
            positionsBuffer.splice(index, 1);
        }
    }
}

function addPoint(e) {
    if (!isEditActive) return;

    positionsBuffer.push(e.latlng);

    // Add marker
    var marker = L.marker(e.latlng).addTo(map);
    marker.on("contextmenu", function () {
        deletePoint(marker);
    });
    points.push(marker);
}

map.on("click", addPoint);

const savedPositions = localStorage.getItem("positions")

if (savedPositions) {
    positions = JSON.parse(savedPositions);
    positionsBuffer = Array.from(positions);

    positions.forEach(position => {
        var marker = L.marker(position).addTo(map);
        marker.on("contextmenu", function () {
            deletePoint(marker);
        });
        points.push(marker);
    })
}