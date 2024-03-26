// button
var isMarkerActive = true;
var isEditActive = false;
var isPopupActive = false;

//marker array
var positions = [];
var points = [];
var uuids = [];

const markerButton = document.querySelector("#btn-marker");
const polylineButton = document.querySelector("#btn-polyline");
const editButton = document.querySelector("#btn-edit");
const editOption = document.querySelector("#edit-option");
const cardPopup = document.querySelector("#card-popup");
const cancelButton = document.querySelector("#btn-cancel");
const saveButton = document.querySelector("#btn-save");
const doneButton = document.querySelector("#btn-done");
const clearButton = document.querySelector("#btn-clear");
const namaInput = document.querySelector("#input-nama");
const alamatInput = document.querySelector("#input-alamat");

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
});

doneButton.addEventListener("click", function () {
    toggleEditButton();
});

cancelButton.addEventListener("click", function () {
    toggleCardPopup();
    var lastMarker = points.pop();

    if (positions.length > 0) {
        console.log("true")
        positions.pop();
        uuids.pop();
    }

    map.removeLayer(lastMarker);
});

saveButton.addEventListener("click", function () {
    var uid = generateUUID()
    var nama = namaInput.value;
    var alamat = alamatInput.value;
    var latLng = positions[positions.length - 1];
    var lat = latLng.lat;
    var lng = latLng.lng;

    uuids.push(uid);
    addMarkerAttributes(points[points.length - 1], nama, alamat, lat, lng);
    insertData(uid, nama, alamat, lat, lng);
    toggleCardPopup();
});

function toggleEditButton() {
    isEditActive = !isEditActive;

    markerButton.toggleAttribute("disabled");
    polylineButton.toggleAttribute("disabled");
    editButton.classList.toggle("btn-active");
    editOption.classList.toggle("hidden");
}

function toggleCardPopup() {
    isPopupActive = !isPopupActive;

    cardPopup.classList.toggle("hidden");
    namaInput.value = '';
    alamatInput.value = '';
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
map.zoomControl.setPosition("bottomright");
map.on("click", addPoint);

//leaflet tileLayer map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function addMarkerAttributes(marker, position = null, nama = null, alamat = null, lat = null, lng = null) {
    if(position instanceof L.LatLng && position !== null){
        this.lat = position.lat;
        this.lng = position.lng;
    }

    marker.on("contextmenu", function () {
        deletePoint(marker);
    });

    if (nama === null || alamat === null) return;

    marker.bindPopup(`nama: ${nama} <br> alamat: ${alamat} <br> lat: ${lat} <br> lng: ${lng}`, {
        closeButton: false
    })
        .on('mouseover', function () {
            this.openPopup();
        })
        .on('mouseout', function () {
            this.closePopup();
        })
        .on('click', function () {
            editPoint();
        });
}

function setOverlayView() {
    points.forEach(point => {
        map.removeLayer(point);
    })

    if (isMarkerActive) {
        points = [];

        positions.forEach(position => {
            var marker = L.marker(position).addTo(map);
            addMarkerAttributes(marker);

            points.push(marker);
        })
    } else {
        points = [];

        var polyline = L.polyline(positions).addTo(map);
        points.push(polyline);
    }
}

function deletePoint(point) {
    if (!isEditActive || isPopupActive) return;
    if (point instanceof L.Marker) {
        var index = points.indexOf(point);
        if (index !== -1) {
            // Remove the marker from the map
            map.removeLayer(point);
            // Remove the marker from the markerArray
            deleteData(uuids[index]);
            points.splice(index, 1);
            uuids.splice(index, 1);
            positions.splice(index, 1);

        }
    }
}

function addPoint(e) {
    if (!isEditActive || isPopupActive) return;
    toggleCardPopup();

    // Add marker
    var marker = L.marker(e.latlng).addTo(map);
    addMarkerAttributes(marker);

    positions.push(e.latlng);
    points.push(marker);
}

function editPoint(e){
    //todo: this
}

$.ajax({
    url: 'query.php',
    type: 'GET',
    success: function (data) {
        // Data telah diterima, lakukan sesuatu dengan data tersebut
        readData(data);
    },
    error: function (xhr, status, error) {
        console.error('Error:', error);
    }
});

function readData(data) {
    data.forEach(row => {
        var position = [row.latitude, row.longitude];
        console.log(position);

        uuids.push(row.id);
        positions.push(position);
        var marker = L.marker(position).addTo(map);
        addMarkerAttributes(marker, position, row.nama, row.alamat);

        points.push(marker);
    })
}

function generateUUID() {
    // Menggunakan Math.random() untuk menghasilkan string acak
    let curUid;
    do {
        curUid = Math.random().toString(36).substring(2, 10);
    } while (uuids.some(uid => uid === curUid));
    return curUid;
}

function insertData(uid, nama, alamat, lat, lng) {
    fetch("exec.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                jenis: "insert",
                id: uid,
                nama: nama,
                alamat: alamat,
                lat: lat,
                lng: lng
            }
        )
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}

function deleteData(uid) {
    fetch("exec.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                jenis: "delete",
                id: uid
            }
        )
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}