console.log("working")
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

 



//var earthquakes = L.layerGroup();

 


var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {

  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",

  tileSize: 512,

  maxZoom: 18,

  zoomOffset: -1,

  id: "mapbox/light-v10",

  accessToken: "pk.eyJ1IjoidGhlbGlvbjI3IiwiYSI6ImNrcGhweWRrOTByM2gybm85ZHVzZHp3ZzEifQ.6SViftPa8EIoW3H99Z3bOg"

});

 console.log(grayscaleMap)


var myMap = L.map("mapid", {

  center: [

    40.09, -95.71

  ],

  zoom: 3

  //layers: [grayscaleMap, earthquakes]

});

grayscaleMap.addTo(myMap); 

d3.json(earthquakesURL).then(function(earthquakeData) {
  console.log(earthquakeData);

  

  function markerSize(magnitude) {

    return magnitude * 4;

  };

  

  function chooseColor(depth) {

    switch(true) {

      case depth > 90:

        return "red";

      case depth > 70:

        return "orangered";

      case depth > 50:

        return "orange";

      case depth > 30:

        return "gold";

      case depth > 10:

        return "yellow";

      default:

        return "lightgreen";

    }

  }

  function stylemap(feature){
    return {

            radius: markerSize(feature.properties.mag),
  
            fillColor: chooseColor(feature.geometry.coordinates[2]),
  
            fillOpacity: 0.7,
  
            color: "black",
  
            stroke: true,
  
            weight: 0.5
  
      };
  }

  

  L.geoJSON(earthquakeData, {

    pointToLayer: function (feature, latlng) {

      return L.circleMarker(latlng);
    },

        

    style: stylemap,

   

    onEachFeature: function(feature, layer) {

      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "

      + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");

    }

  }).addTo(myMap);



  //earthquakes.addTo(myMap);

 

    

  var legend = L.control({position: "bottomright"});

  legend.onAdd = function() {

    var div = L.DomUtil.create("div", "info legend"),

    depth = [-10, 10, 30, 50, 70, 90];

   

    //div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

  for (var i =0; i < depth.length; i++) {

    div.innerHTML +=

    '<i style="background: ' + chooseColor(depth[i] ) + '"></i> ' +

        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');

      }

    return div;

  };

  legend.addTo(myMap);

});