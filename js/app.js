var navViewModel = function() {
    var self = this;
    this.availableLocationsList = locations.slice();
    this.selectedLocation = ko.observable();
    this.displayedLocations = ko.observableArray(locations);

    this.selectedLocation.subscribe(function() {
        self.displayedLocations.removeAll();
        if (self.selectedLocation()) {
            self.displayedLocations.push(self.selectedLocation());
            placeMarkers(self.displayedLocations());
        }

        if (self.selectedLocation() == undefined) {
            self.displayedLocations(self.availableLocationsList.slice());
            placeMarkers(self.displayedLocations());
        }
    });

    this.bounceMarker = function(location) {
        var marker = findMarkerByName(location.name);
        populateInfoWindow(marker, largeInfoWindow);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function() {marker.setAnimation(null);},2000);
    };
};

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
};

function w3_close() {
    document.getElementById("mySidenav").style.display = "none";
};
try {
    ko.applyBindings(new navViewModel());
} catch (error) {
    window.alert("There is a problem with the application. Please try again later.")
}

function displayErrorMessage() {
    window.alert("There was a problem with Google Maps. Please close this page from the browswer and try again later");
}



