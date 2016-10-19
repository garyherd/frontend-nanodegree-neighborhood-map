var locations = [
    {name: "Bellagio Apts", location: {lat: 29.888504, lng: -95.5501487}},
    {name: "Rudy's BBQ", location: {lat: 29.866844, lng: -95.538356}},
    {name: "George Bush Park", location: {lat: 29.7196437, lng: -95.686953}},
    {name: "Memorial Park", location: {lat: 29.764992, lng: -95.4373088}},
    {name: "Hermann Park", location: {lat: 29.7183503, lng: -95.3908764}},
    {name: "Bear Creek Pioneers Park", location: {lat: 29.827242, lng: -95.614142}}
];

var navViewModel = function () {
    var self = this;
    var markers = [];
    this.availableLocationsList = locations.slice();
    this.selectedLocation = ko.observable();

    this.displayedLocationsList = ko.computed(function() {
        var displayArray = [];
        if (self.selectedLocation() == undefined) {
            displayArray = self.availableLocationsList;
        } else {
            displayArray.push(self.selectedLocation());
        }
        return displayArray;
    });
};

var map;
var markers = [];
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 29.757974, lng: -95.374924},
    zoom: 10
    });
    createMarkers(locations);
};

function w3_open() {
    document.getElementById("mySidenav").style.display = "block";
};

function w3_close() {
    document.getElementById("mySidenav").style.display = "none";
};

function createMarkers(locArray) {
    // The following group uses the location array to create an array of markers on initialize.
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

ko.applyBindings(new navViewModel());

