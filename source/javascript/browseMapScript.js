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

function manualLocationInput( id ) {
    var location = document.getElementById( id ).value;
    socket.emit( 'manualLocationEntry', location );
    socket.on( 'manualLocationGeocoded', function( location ) {
        drawMap( location );
    });
    return false;
};


//  listener for when socket controller is
//  finished. it sends back distance info,
//  which just gets thrown into markers atm
socket.on( 'distances', function( distances ) {
    var elem = document.getElementById( 'map-main-info-overlay' );
    var height = elem.clientHeight;

    for( var i in distances ) {
        var distance = distances[ i ];
        var locLatLng = {
            lat: distance.lat,
            lng: distance.lng
        };
        console.log( 'what the heck is going on' );
        var open = isOpen( distance.hours );
        var marker = new google.maps.Marker({
            position: locLatLng,
            map: map,
            title: distance.place,
            address: distance.address,
            distance: distance.distance,
            hours: distance.hours,
            isOpen: ( open ) ? 'OPEN' : 'closed',
            icon: ( open ) ? 'img/locMark.png' : 'img/locMarkClose.png',
            zIndex: ( open ) ? 999 : 0,
            image: 'img/locationThumbs/' + distance.image
        });
        google.maps.event.addListener(marker, 'mouseover', function() {
            // marker.zIndex = 99999;
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
            console.log
            var message = '<div class="main-overlay-content"><div class="main-overlay-left">' +
                '<img src=' + this.image + ' class="location-thumb">' +
                this.title + ', ' +
                this.address + ': ' +
                this.distance +
                '<br><br>' + this.isOpen +
                // '<br><br> <img src=' + this.image + ' class="location-thumb">' +
                '</div></div><div class="main-overlay-right">HOURS:<br>' +
                'mon: ' + readableHours( this.hours.mon[ 0 ].open ) + ' - ' + readableHours( this.hours.mon[ 0 ].close ) + '<br>' +
                'tue: ' + readableHours( this.hours.tue[ 0 ].open ) + ' - ' + readableHours( this.hours.tue[ 0 ].close ) + '<br>' +
                'wed: ' + readableHours( this.hours.wed[ 0 ].open ) + ' - ' + readableHours( this.hours.wed[ 0 ].close ) + '<br>' +
                'thu: ' + readableHours( this.hours.thu[ 0 ].open ) + ' - ' + readableHours( this.hours.thu[ 0 ].close ) + '<br>' +
                'fri: ' + readableHours( this.hours.fri[ 0 ].open ) + ' - ' + readableHours( this.hours.fri[ 0 ].close ) + '<br>' +
                'sat: ' + readableHours( this.hours.sat[ 0 ].open ) + ' - ' + readableHours( this.hours.sat[ 0 ].close ) + '<br>' +
                'sun: ' + readableHours( this.hours.sun[ 0 ].open ) + ' - ' + readableHours( this.hours.sun[ 0 ].close ) + '<br>';
           document.getElementById( 'overlay-content-one-inside' ).innerHTML = message;
           overlayHeightToggle( 'one' );
        });
    }

});



socket.on( 'distanceReturn', function( distances ) {
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




/*******************************************************************************
                vanilla + CSS DOM and animation ( brentQuery :D )
********************************************************************************/
function htmlFunctionOverlayHeight() {
    var overlay = document.getElementById( 'map-main-info-overlay' );
    var height = Math.round( overlay.clientHeight/window.innerHeight + 'e2' );
    if( height === 40 ) {
        overlayHeightToggle( 'min' );
    } else {
        overlayHeightToggle( 'two' );
    }
    socket.emit( 'distancesToggle', null );
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

var prevents = document.getElementsByClassName( 'chevron' );
for( var i = 0; i < prevents.length; i++ ) {
    prevents[ i ].addEventListener( 'click', function( e ) {
        e.stopPropagation();
    });
};

function chevronToggle( side ) {
    content = document.getElementById( 'overlay-content-one-inside' );
    if( window.getComputedStyle( content, null ).getPropertyValue( 'display' ) === 'block' ) {
        overlayContentShow( 'two' );
    } else {
        overlayContentShow( 'one' );
    }
};

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
/***                            end brentQuery                               ***/



/*******************************************************************************
                    hours (controller?) like a motherfucker
********************************************************************************/
function readableHours( toReadableHours ) {
    var hours = parseInt( toReadableHours );
    if( hours < 1200 || hours > 2359 )
        var ampm = 'am';
    else
        var ampm = 'pm';
    if( hours === 2400 ) {
        hours = 1200;
    } else if( hours > 1300 ) {
        hours = ( hours % 1200 );
    }
    var time = new String( 0 + hours );
    var l = time.length;
    return time.substring( l-4, l-2 ) + ':' + time.substring( l-2, l ) + ampm;
};

function isOpen( hours ) {
    var date = new Date();
    var day = date.getDay();
    var time = ( ( date.getHours() === 0 ? 12 : date.getHours() ) * 100 ) + date.getMinutes();
    switch( day ) {
        case 1:
            return isOpenHelper( 'mon', 'sun', hours, time );
        case 2:
            return isOpenHelper( 'tue', 'mon', hours, time );
        case 3:
            return isOpenHelper( 'wed', 'tue', hours, time );
        case 4:
            return isOpenHelper( 'thu', 'wed', hours, time );
        case 5:
            return isOpenHelper( 'fri', 'thu', hours, time );
        case 6:
            return isOpenHelper( 'sat', 'fri', hours, time );
        case 0:
            return isOpenHelper( 'sun', 'sat', hours, time );
    }
    function isOpenHelper( today, yesterday, hours, time ) {
        if( time > hours[ today ][ 0 ].open && time < hours[ today ][ 0 ].close )
            return true;
        if( time < hours[today][ 0 ].open )
            return ( time < ( hours[ yesterday ][ 0 ].close % 1200 )) ? true : false;
        return false;
    }
}
/*                        end motherfucker hours                             ***/
