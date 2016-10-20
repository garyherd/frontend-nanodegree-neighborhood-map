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
};


function w3_open() {
    document.getElementById("mySidenav").style.display = "block";
};

function w3_close() {
    document.getElementById("mySidenav").style.display = "none";
};

ko.applyBindings(new navViewModel());

