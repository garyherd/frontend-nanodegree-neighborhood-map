// Knockout ViewModel that handles displaying initial list of locations,
// and the interacting with the dropdown list
var navViewModel = function() {
    var self = this;
    // this.availableLocationsList = locations.slice();
    this.selectedType = ko.observable();
    this.selectedLocation = ko.observable();
    this.displayedLocations = ko.observableArray(createLocationsArray(availableLocationsByType));

    this.selectedType.subscribe(function() {
        self.displayedLocations.removeAll();
        var locList = [];
        var singleTypeArray = [];
        if (self.selectedType() === undefined) {
            locList = createLocationsArray(availableLocationsByType);
            self.displayedLocations(locList);
            placeMarkers(self.displayedLocations());
        }

        if (self.selectedType()) {
            singleTypeArray.push(self.selectedType());
            self.displayedLocations(createLocationsArray(singleTypeArray));
            placeMarkers(self.displayedLocations());
        }
    });

    this.bounceMarker = function(location) {
        var marker = findMarkerByName(location.name);
        populateInfoWindow(marker, largeInfoWindow);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function() {marker.setAnimation(null);},1400);
    };
};

// Helper functions

function findMarkerByName(locStr) {
    var foundMarker;
    markers.forEach(function(marker) {
        if (marker.getTitle() == locStr) {
            foundMarker = marker;
        }
    }, this);
    return foundMarker;
}

function w3_open() {
    document.getElementById("mySidenav").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidenav").style.display = "none";
}

function displayErrorMessage() {
    window.alert("There was a problem with Google Maps. Please close this page from your browser and try again later");
}

// Initiate ViewModel and display error message if maps.googleapis.com doesn't load
try {
    ko.applyBindings(new navViewModel());
} catch (error) {
    window.alert("There is a problem initializing the application. Please try again later.");
}





