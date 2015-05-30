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
            { hue: "#ffc300" },
            { saturation: -100 },
            { gamma: .17 }
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

    //  send location information back to the server
    socket.emit( 'userLocation', userLocation );

    drawMap( userLocation );
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
    for( var i in distances ) {
        console.log( distances[ i ] );
        // console.log( distances[ i ] );
    }
    var elem = document.getElementById( 'map-main-info-overlay' );
    var height = elem.clientHeight;

    for( var i in distances ) {
        var distance = distances[ i ];
        var locLatLng = {
            lat: distance.lat,
            lng: distance.lng
        }
        var marker = new google.maps.Marker({
            position: locLatLng,
            map: map,
            title: distance.place,
            address: distance.address,
            distance: distance.distance,
            icon: 'img/locMark.png',
            // hours my god there must be a better way...
            monOpen: distance.monOpen,
            monClose: distance.monClose,
            tueOpen: distance.tueOpen,
            tueClose: distance.tueClose,
            wedOpen: distance.wedOpen,
            wedClose: distance.wedClose,
            thuOpen: distance.thuOpen,
            thuClose: distance.thuClose,
            friOpen: distance.friOpen,
            friClose: distance.friClose,
            satOpen: distance.satOpen,
            satClose: distance.satClose,
            sunOpen: distance.sunOpen,
            sunClose: distance.sunClose
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
            var message = '<div class="main-overlay-content"><div class="main-overlay-left">' + (
                this.title + ', ' +
                this.address + ': ' +
                this.distance +
                '</div></div><div class="main-overlay-right">HOURS:<br>' +
                'mon: ' + readableHours( this.monOpen ) + ' - ' + readableHours( this.monClose ) + '<br>' +
                'tue: ' + readableHours( this.tueOpen ) + ' - ' + readableHours( this.tueClose ) + '<br>' +
                'wed: ' + readableHours( this.wedOpen ) + ' - ' + readableHours( this.wedClose ) + '<br>' +
                'thu: ' + readableHours( this.thuOpen ) + ' - ' + readableHours( this.thuClose ) + '<br>' +
                'fri: ' + readableHours( this.friOpen ) + ' - ' + readableHours( this.friClose ) + '<br>' +
                'sat: ' + readableHours( this.satOpen ) + ' - ' + readableHours( this.satClose ) + '<br>' +
                'sun: ' + readableHours( this.sunOpen ) + ' - ' + readableHours( this.sunClose ) + '<br>' );
           document.getElementById( 'overlay-content-one-inside' ).innerHTML = message;
           overlayHeightToggle( 'one' );
        });

    }

    // console.log( map.getCenter() );
    // console.log( 'northeast: ' + map.getBounds().getNorthEast() );
    // console.log( 'southwest: ' + map.getBounds().getSouthWest() );

});

function readableHours( hours ) {
    if( hours < 1200 || hours > 2400 )
        var ampm = 'am';
    else
        var ampm = 'pm';
    if( hours > 1200 ) {
        hours = ( hours % 1200 );
    }
    var time = new String( 0 + hours );
    var l = time.length;
    // return time;
    return time.substring( l-4, l-2 ) + ':' + time.substring( l-2, l ) + ampm;
};

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
