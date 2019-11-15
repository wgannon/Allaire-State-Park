/* Stylesheet by William D Gannon, 2019 */
/* For Project 2 Allaire State Park */

//Get Map Tiles and Center Map
function main(){

//connect to dataset
//call carto client
var client = new carto.Client({
    apiKey: 'hOoKOiroadj3UzrLaXpPWQ',
    username: 'wgannon42'
});


// returns the version of the library
var trails = L.layerGroup();
var points = L.layerGroup();

//----------------------------------------------------------------------

  //define map object
  var basemap = L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6f28dfe2159642149f08dbf0cfa922a9', {
                attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                apikey: '<6f28dfe2159642149f08dbf0cfa922a9>'
                });
  
  var map = L.map('map', {
    center: [40.159275,  -74.130852],
    zoom: 16,
    layers: [basemap, trails, points]
  });
  
  var baseMaps = {
    "Basemap": basemap
  };
  var overlayMaps = {
    "trails":trails,
    "points":points
  };
  L.control.layers(baseMaps,overlayMaps).addTo(map);
//----------------------------------------------------------------------  
//Adding data to the carto dataase
    //http://duspviz.mit.edu/web-map-workshop/cartodb-data-collection/
var cartoPoints = null;

//link to getting the Json of files https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT%20*FROM%20report    
function style_trails(data) {
  return {
    color: '#855C75',
    weight: 3,
    opacity: .7,
    dashArray: '20,15',
    lineJoin: 'round'
  };
}; 
function style_points(data) {
  return {
    color: '#855C75',
    weight: 3,
    opacity: .7
  };
};  

$.getJSON("https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM report", function(data) {
    reportPoints = L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        var marker = L.marker(latlng);
        marker.bindPopup('' + feature.properties.description + 'Submitted by ' + feature.properties.name + '');
        return marker;
      }
    }).addTo(map);
    console.log(reportPoints);
  });
  
$.getJSON("https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM allaire_trails", function(data) {
    allaire_trails = L.geoJson(data,{ 
    style: style_trails
    }).bindPopup(function (layer) {
      return layer.feature.properties.trail_name; 
    }).addTo(trails);
    console.log(allaire_trails);
  });
$.getJSON("https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM allaire_points", function(data) {
    allaire_points = L.geoJson(data,{ 
    style: style_points
    }).bindPopup(function (layer) {
      return layer.feature.properties.feature_na; 
    }).addTo(points);
    console.log(allaire_points);
  });
  
//Legend Checkboxes to show and hide layers
    
$('#trails').on('change', ':checkbox', function(){
    if($(this).is(':checked')) {
      map.addLayer(trails);
    }else{
      map.removeLayer(trails);  
    }
});
$('#points').on('change', ':checkbox', function(){
  if($(this).is(':checked')) {
    map.addLayer(points);
  }else{
    map.removeLayer(points);   
  }
});
$('#reports').on('change', ':checkbox', function(){
  if($(this).is(':checked')) {
     client.addLayers([points_layer]);
  }else{
      client.removeLayers([points_layer]);   
  }
});
//console.log(map);
  }
 window.onload = main; 

