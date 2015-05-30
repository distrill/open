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
            { hue: "#00ffe6" },
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




/*******************************************************************************
                vanilla + CSS DOM and animation ( brentQuery :D )
********************************************************************************/
function htmlFunctionOverlayHeight() {
    console.log( 'htmlFunctionOverlayHeight is getting //TRIGGEREDDDD//')
    var overlay = document.getElementById( 'map-main-info-overlay' );
    var height = Math.round( overlay.clientHeight/window.innerHeight + 'e2' );
    if( height === 40 ) {
        overlayHeightToggle( 'min' );
    } else {
        overlayHeightToggle( 'two' );
    }
}

function overlayHeightToggle( show ) {
    if( show !== 'min' && show !== 'one' && show !== 'two' ) {
        console.log( 'invalid parameter, please pass "min", "one", or "two"' );
        return;
    }
    var overlay = document.getElementById( 'map-main-info-overlay' );
    if( show === 'min' ) {
        overlay.style.height = '50px';
    } else {
        overlay.style.height = '40%';
    }
    overlayContentShow( show );
};

function overlayContentShow( show ) {
    var contentOne = document.getElementById( 'overlay-content-one-inside' ),
        contentTwo = document.getElementById( 'overlay-content-two-inside' ),
        contentMin = document.getElementById( 'overlay-content-min-inside' );
    contentOne.style.display = 'none';
    contentTwo.style.display = 'none';
    contentMin.style.display = 'none';
    // switch statement instead of if/else?
    if( show === 'one' ) {
        contentOne.style.display = 'block';
        contentOne.parentNode.parentNode.style.overflow = 'auto';
        document.getElementById( 'chevron-left' ).style.display = 'block';
        document.getElementById( 'chevron-right' ).style.display = 'block';
    } else if( show === 'two' ) {
        contentTwo.style.display = 'block';
        contentTwo.parentNode.parentNode.style.overflow = 'auto';
    } else if( show === 'min' ) {
        contentMin.style.display = 'block';
        contentMin.parentNode.parentNode.style.overflow = 'hidden';

    }
};

function manualLocationInput( id ) {
    var location = document.getElementById( id ).value;
    socket.emit( 'manualLocationEntry', location );
    socket.on( 'manualLocationGeocoded', function( location ) {
        drawMap( location );
    });
    return false;
};

function chevronToggle( side ) {
    content = document.getElementById( 'overlay-content-one-inside' );
    if( window.getComputedStyle( content, null ).getPropertyValue( 'display' ) === 'block' ) {
        overlayContentShow( 'two' );
    } else {
        overlayContentShow( 'one' );
    }
};

var prevents = document.getElementsByClassName( 'chevron' );
for( var i = 0; i < prevents.length; i++ ) {
    prevents[ i ].addEventListener( 'click', function( e ) {
        e.stopPropagation();
    });
};
/*                          end brentQuery
********************************************************************************/




//  listener for when socket controller is
//  finished. it sends back distance info,
//  which just gets thrown into markers atm
socket.on( 'distances', function( distances ) {
    var elem = document.getElementById( 'map-main-info-overlay' );
    var height = elem.clientHeight;

    for( var i in distances ) {
        var locLatLng = {
            lat: distances[ i ].lat,
            lng: distances[ i ].lng
        }
        var marker = new google.maps.Marker({
            position: locLatLng,
            map: map,
            title: distances[ i ].place,
            address: distances[ i ].address,
            distance: distances[ i ].distance,
            icon: 'img/locMark.png'
        });


        google.maps.event.addListener(marker, 'mouseover', function() {
            if( height === 50 ) {
                var message = (
                    this.title + ", " +
                    this.address + ": " +
                    this.distance
                );
               document.getElementById( 'overlay-content-min-inside' ).innerHTML = message;
            }
        });

        google.maps.event.addListener( marker, 'mouseout', function() {
            if( height === 50 ) {
               document.getElementById( 'overlay-content-min-inside' ).innerHTML = "";
            }
        });

        google.maps.event.addListener(marker, 'click', function() {
            // overlayHeightToggle( 'map-main-info-overlay', false );
            var message = '<div class="main-overlay-content">' + (
                this.title + ', ' +
                this.address + ': ' +
                this.distance
            ) + '</div>';
           document.getElementById( 'overlay-content-one-inside' ).innerHTML = message;
           overlayHeightToggle( 'one' );
        });

    }

});

socket.on( 'distanceReturn', function( distances ) {
    console.log( 'butthole' );
    var content = '<div class="main-overlay-content">'
    for( var i in distances ) {
        content += (
            distances[ i ].place + ', ' +
            distances[ i ].address + ': ' +
            distances[ i ].distance + '<br><br>'
        );
    }
    content += '</div>';
    var contentTwo = document.getElementById( 'overlay-content-two-inside' );
    contentTwo.innerHTML = content;

});

function secondaryChevronControl( id ) {
    var chevron = document.getElementById( id );
    var contentOne = document.getElementById( 'main-info-overlay-content-one' );
    var contentTwo = document.getElementById( 'main-info-overlay-content-two' );
    if(  window.getComputedStyle( contentOne, null ).display === 'block' ) {
        contentOne.style.display = 'none';
        contentTwo.style.display = 'block';
        chevron.style.transform = 'rotate( -180deg )';
    } else {
        contentOne.style.display = 'block';
        contentTwo.style.display = 'none';
        chevron.style.transform = 'rotate( 0deg )';
    }

}
