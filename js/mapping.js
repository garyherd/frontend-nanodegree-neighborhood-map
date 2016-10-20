var map;
var markers = [];
var locations = [
    {name: "Bellagio Apts", location: {lat: 29.888504, lng: -95.5501487}},
    {name: "Rudy's BBQ", location: {lat: 29.866844, lng: -95.538356}},
    {name: "George Bush Park", location: {lat: 29.7196437, lng: -95.686953}},
    {name: "Memorial Park", location: {lat: 29.764992, lng: -95.4373088}},
    {name: "Hermann Park", location: {lat: 29.7183503, lng: -95.3908764}},
    {name: "Bear Creek Pioneers Park", location: {lat: 29.827242, lng: -95.614142}}
];

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function placeMarkers(locArray) {

    if (markers.length > 0) {
        deleteMarkers();
    }
    // The following group uses the location array to create an array of
    // markers on initialize.
    for (var i = 0; i < locArray.length; i++) {
        // Get the position from the location array
        var position = locArray[i].location;
        var title = locArray[i].name;
        // Create a marker per location, and put into markers array
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infoWindow at each marker
        // marker.addListener('click', function () {
        //     populateInfoWindow(this, largeInfoWindow);
        // });
    };
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 29.757974, lng: -95.374924 },
        zoom: 10
    });
    placeMarkers(locations);
};