var socket = io();

navigator.geolocation.getCurrentPosition( function( position ) {
    var userLocation = {
        userLat: position.coords.latitude,
        userLng: position.coords.longitude
    };
    socket.emit( 'userLocation', userLocation );
});
















// function initialize() {
//
//     var latlng = { lat: 49.8879519, lng: -119.4960106 };
//
//   // Create an array of styles.
//   var styles = [
//     {
//       stylers: [
//         { hue: "#00ffe6" },
//         { saturation: -20 }
//       ]
//     },{
//       featureType: "road",
//       elementType: "geometry",
//       stylers: [
//         { lightness: 100 },
//         { visibility: "simplified" }
//       ]
//     },{
//       featureType: "road",
//       elementType: "labels",
//       stylers: [
//         { visibility: "off" }
//       ]
//     }
//   ];
//
//   // Create a new StyledMapType object, passing it the array of styles,
//   // as well as the name to be displayed on the map type control.
//   var styledMap = new google.maps.StyledMapType(styles,
//     {name: "Styled Map"});
//
//   // Create a map object, and include the MapTypeId to add
//   // to the map type control.
//   var mapOptions = {
//     zoom: 13,
//     center: latlng,
//     mapTypeControlOptions: {
//       mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
//     }
//   };
//   var map = new google.maps.Map(document.getElementById('map-canvas'),
//     mapOptions);
//
//   //Associate the styled map with the MapTypeId and set it to display.
//   map.mapTypes.set('map_style', styledMap);
//   map.setMapTypeId('map_style');
// }
// google.maps.event.addDomListener(window, 'load', initialize);
