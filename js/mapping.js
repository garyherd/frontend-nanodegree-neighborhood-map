var map;
var largeInfoWindow;
var markers = [];
var availableLocationsByType = [
    {
        locations: [
            {name: 'Bellagio Apts', location: {lat: 29.888504, lng: -95.54796}}
        ],
        type: 'Apartments'
    },
    {
        locations: [
            {name: "Rudy's BBQ", location: {lat: 29.866844, lng: -95.538356}}
        ],
        type: 'Restaurants'
    },
    {
        locations: [
            {name: 'George Bush Park', location: {lat: 29.7196437, lng: -95.686953}},
            {name: 'Memorial Park', location: {lat: 29.764992, lng: -95.4373088}},
            {name: 'Hermann Park', location: {lat: 29.7183503, lng: -95.3908764}},
            {name: 'Bear Creek Pioneers Park', location: {lat: 29.827242, lng: -95.614142}},
        ],
        type: 'Parks'
    }
];

// takes an array of one or more objects (locations & type are keys) and
// returns an array of locations only.
function createLocationsArray(locationObjArray) {
    var locList = [];
    locationObjArray.forEach(function(element) {
        $.each(element, function (key, value) {
            if (key === 'locations') {
                value.forEach(function(locObj) {
                    locList.push(locObj);
                });
            }
        });
    }, this);
    return locList;
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

// Creates markers, InfoWindows, and event listeners using the Google Maps API
function placeMarkers(locArray) {

    if (markers.length > 0) {
        deleteMarkers();
    }

    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of
    // markers.
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

        // Create an onclick event to open an infoWindow at each marker
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfoWindow);
            bounceMarker(this);
        });

        // Push the marker to our array of markers.
        markers.push(marker);
        bounds.extend(marker.position);
    }
    map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and poulate based
// on that markers position.

function populateInfoWindow(marker, infowindow) {

    // check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;

        // Callback functions provided for ajax call.
        getFourSquareInfo(infowindow, createInfoWindowContent,
            createDefaultInfoWindowContent, createEmptyInfoWindowContent);

        infowindow.open(map, marker);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
}

// Gets info from the Foursquare API by sending lat/long coordinates.
// Callback functions provided for successful and failed responses from API
function getFourSquareInfo(infowindow, successFunc, errorFunc, emptyFunc) {

    $.ajax({
        url: "https://api.foursquare.com/v2/venues/search",
        data: {
            ll: infowindow.marker.getPosition().lat().toString() + "," +
          		infowindow.marker.getPosition().lng().toString(),
            client_id: "JE3Z0E1BTGQ5H4KPVTMBBKDFK000WAAAO21FMQIW3ZIV2WBW",
            client_secret: "ZJMZH553AONNR5RFOE5QZOBZBOP0GAOJLWEF2H5OC1IPRCJK",
            v: '20161026'
        },
        dataType: "json",
        success: function(data) {
            var venue = data.response.venues[0];
            var iwData = {
                name: venue.name,
                contactInfo: venue.contact,
                foursquareUrl: "https://foursquare.com/v/" + venue.id.toString()
            };
            if (data.hasOwnProperty('response') === false || venue.hasOwnProperty('contact') === false) {
                emptyFunc(iwData, infowindow);
            } else {
                successFunc(iwData, infowindow);
            }
        },
        error: function (xhr) {
            errorFunc(infowindow);
        }
    });
}

function createInfoWindowContent(iwObj, infowindow){
    var targetKeys = ["formattedPhone", "twitter", "facebookUsername"];
    var keyUrls = {formattedPhone: "", twitter: "https://twitter.com/",
        facebookUsername: "https://facebook.com/"};
    var resultStr = '<div style="color:black">From Foursquare:</div><div style="color:black"><b>' +
        	iwObj.name + '</b></div><br>';

    $.each(iwObj.contactInfo, function(key, value) {
        if (targetKeys.indexOf(key) > -1) {
            if (key == "formattedPhone") {
                resultStr += '<div style="color:black"><b>' +
                    key + '</b>:&nbsp;' +
                    keyUrls[key].toString() +
                    value.toString() + '</div>';
            } else {
                resultStr += '<div style="color:black"><b>' +
                    key + ':&nbsp;<a style="color:blue" target="_blank" href="' +
                    keyUrls[key].toString() + value.toString() + '">' +
                    value.toString() + '</a></div>';
            }
        }
    });

    resultStr += '<br><a style="color:blue" target="_blank" href="' +
        iwObj.foursquareUrl + '">See more at FourSquare</a>';
    var replacedPhone = resultStr.replace("formattedPhone", "phone");
    var finalResultStr = replacedPhone.replace("facebookUsername", "facebook");
    infowindow.setContent(finalResultStr);
}

function createDefaultInfoWindowContent(infowindow) {
    infowindow.setContent('<div style="color:black">' +
        infowindow.marker.getTitle() + '</div>' +
        '<div style="color:black">There was a problem reaching Foursquare. Please try again later :(');
}

function createEmptyInfoWindowContent(infowindow) {
    infowindow.setContent('<div style="color:black">' +
        infowindow.marker.getTitle() + '</div>' +
        '<div style="color:black">There is no information on this location in Foursquare. :(');
}

function bounceMarker(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function() {marker.setAnimation(null);},1400);
}

// Initialize map. Provides error handing in case of problem with request
function initMap() {
    try {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 29.757974, lng: -95.374924 },
            zoom: 10
        });
        largeInfoWindow = new google.maps.InfoWindow();
        placeMarkers(createLocationsArray(availableLocationsByType));

    } catch (error) {
        window.alert("There was a problem contacting Google Maps. Please try again later.");
        console.log("Error on initMap: " + error.toString());
    }
}