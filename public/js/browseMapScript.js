var socket = io();
var map;

google.maps.event.addDomListener(window, 'load', function(){} );

function drawMap( userLocation ) {

    document.getElementById( 'no-geoloation-wrap' ).style.display = 'none';
    document.getElementById( 'map-canvas' ).style.display = 'block';
    document.getElementById( 'map-main-info-overlay' ).style.display = 'block';

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
            // { hue: "#00ffe6" },
            { hue: "#a9bcd0" },
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
        icon: 'img/userMark2.png'
    });
}


//  get location information from browser if
//  no info, or user declines, default is
//  underlying prompt for manual location entry
navigator.geolocation.getCurrentPosition( function( position ) {
    
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


function overlayHeightToggle( id ) {
    var elem = document.getElementById( id );
    var height = Math.round( elem.clientHeight/window.innerHeight + 'e2' );
    if( height === 7 ) {
        elem.style.height = '40%';
    } else {
        elem.style.height = '7%';
    }
}

function manualLocationInput( id ) {
    var location = document.getElementById( id ).value;
    socket.emit( 'manualLocationEntry', location );
    socket.on( 'manualLocationGeocoded', function( location ) {
        drawMap( location );
    });
    return false;
}
