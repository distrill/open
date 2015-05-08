function initialize() {
    var myLatlng = new google.maps.LatLng(49.8856767,-119.47838449999999);

    var styles = [
      {
        stylers: [
          { hue: "#00ffe6" },
          { saturation: -20 }
        ]
      },{
        featureType: "road",
        elementType: "geometry",
        stylers: [
          { lightness: 100 },
          { visibility: "simplified" }
        ]
      },{
        featureType: "road",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];

    var styledMap = new google.maps.StyledMapType(styles,
        {name: "Styled Map"});

    var mapOptions = {
        zoom: 13,
        center: myLatlng,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    }

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Hello World!'
    });

    <% for( var i in distance ) { %>
            var myLatlng = new google.maps.LatLng( <%= distance[ i ].lat %>,<%= distance[ i ].long %> );
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map
            });
    <% } %>
}

google.maps.event.addDomListener(window, 'load', initialize);
