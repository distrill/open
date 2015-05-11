var socket = io();
var map;

google.maps.event.addDomListener(window, 'load', function(){} );

function drawMap( userLocation ) {
    var mapOptions = {
        center: userLocation,
        zoom: 13,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        },
        disableDefaultUI: true
    };

    var styles = [ {
        stylers: [
            { hue: "#00ffe6" },
            { saturation: -20 }
        ]
        }, {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                { lightness: 100 },
                { visibility: "simplified" }
            ]
        },{
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];

    var styledMap = new google.maps.StyledMapType(styles, {
        name: "Styled Map"
    });

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    var marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        icon: 'img/userMark.png'
    });
}


//  get location information from browser if
//  no info, or user declines, default is
//  underlying prompt for manual location entry
navigator.geolocation.getCurrentPosition( function( position ) {

    document.getElementById( 'no-geoloation-wrap' ).style.display = "none";
    document.getElementById( 'map-canvas' ).style.display = "block";

    var userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    drawMap( userLocation )

    //  send location information back to the server
    socket.emit( 'userLocation', userLocation );
});


//  listener for when socket controller is
//  finished. it sends back distance info,
//  which just gets thrown into markers atm
socket.on( 'distances', function( distances ) {
    for( var i in distances ) {
        var locLatLng = {
            lat: distances[ i ].lat,
            lng: distances[ i ].lng
        }
        var marker = new google.maps.Marker({
            position: locLatLng,
            map: map,
            title: distances[ i ].place,
            icon: 'img/locMark.png'
        });
    }
});
