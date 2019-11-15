/* Stylesheet by William D Gannon, 2019 */
/* For Project 2 Allaire State Park */

//Get Map Tiles and Center Map
function main(){

  //define map object
var map = L.map('mapid').setView([40.159275,  -74.130852], 16);

L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6f28dfe2159642149f08dbf0cfa922a9', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<6f28dfe2159642149f08dbf0cfa922a9>',
	maxZoom: 22
	}).addTo(map);




//connect to dataset
//call carto client
var client = new carto.Client({
    apiKey: 'hOoKOiroadj3UzrLaXpPWQ',
    username: 'wgannon42'
});


// returns the version of the library
const trails_source = new carto.source.Dataset('allaire_trails');
const trails_style = new carto.style.CartoCSS(`
   #layer {
          line-width: 2.5;
          line-color: ramp([trail_name], (#7F3C8D, #11A579, #3969AC, #F2B701, #E73F74, #80BA5A, #E68310, #008695, #A5AA99), ("Boy Scout Trail", "Brisbane Trail", "Canal Trail", "Capital to Coast Connector", "Mountain Laurel Trail", "Nature Trail", "Pine Trail", "Upper Squankum Trail"), "=");
          line-comp-op: overlay;
            ::labels {
              text-name: [trail_name];
              text-face-name: 'DejaVu Sans Book';
              text-size: 10;
              text-fill: #FFFFFF;
              text-label-position-tolerance: 0;
              text-halo-radius: 1;
              text-halo-fill: #6F808D;
              text-dy: -10;
              text-allow-overlap: true;
              text-placement: line;
              text-placement-type: dummy;
                }

            }`);



const points_source = new carto.source.Dataset('allaire_points');
const points_style = new carto.style.CartoCSS(`
   #layer {
  marker-width: 7;
  marker-fill: ramp([feature_ty], (#855C75, #D9AF6B, #AF6458, #736F4C, #526A83, #625377, #68855C, #9C9C5E, #A06177, #8C785D, #7C7C7C), ("Historic Site", "Parking", "Fishing", "Restroom", "Entrance", "Group Campground", "Office", "Picnic Pavilion", "Campground", "Concession"), "=");
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
    }
      `);

const trails_layer = new carto.layer.Layer(trails_source, trails_style, {
  featureClickColumns: ['trail_name', 'trl_diff']
});
const points_layer = new carto.layer.Layer(points_source, points_style, {
  featureClickColumns: ['feature_ty']
});

client.addLayers([trails_layer, points_layer]);
client.getLeafletLayer().addTo(map);

const popup = L.popup({ closeButton: false });
trails_layer.on(carto.layer.events.FEATURE_CLICKED, featureEvent => {
  popup.setLatLng(featureEvent.latLng);
  if (!popup.isOpen()) {
    popup.setContent("Trail Name: " + featureEvent.data.trail_name + "<br/>" + "Dificulty: " + featureEvent.data.trl_diff);
    popup.openOn(map);
  }
});
trails_layer.on(carto.layer.events.FEATURE_OUT, featureEvent => {
  popup.removeFrom(map);
});

const point_popup = L.popup({ closeButton: false });
points_layer.on(carto.layer.events.FEATURE_CLICKED, featureEvent => {
  point_popup.setLatLng(featureEvent.latLng);
  if (!point_popup.isOpen()) {
    point_popup.setContent("Feature: " + featureEvent.data.feature_ty);
    point_popup.openOn(map);
  }
});
points_layer.on(carto.layer.events.FEATURE_OUT, featureEvent => {
  point_popup.removeFrom(map);
});

//Adding data to the carto dataase
    //http://duspviz.mit.edu/web-map-workshop/cartodb-data-collection/
var cartoPoints = null;

var cartoUsername = "wgannon42";    

var sqlQuery = "SELECT * FROM report";
//link to getting the Json of files https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT%20*FROM%20report    
    
function getGeoJSON(){
  $.getJSON("https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM report", function(data) {
    cartoPoints = L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        var marker = L.marker(latlng);
        marker.bindPopup('' + feature.properties.description + 'Submitted by ' + feature.properties.name + '');
        return marker;
      }
    }).addTo(map);
  });
};      
//Legend Checkboxes to show and hide layers
    
$('#trails').on('change', ':checkbox', function(){
    if($(this).is(':checked')) {
       client.addLayers([trails_layer]);
    }else{
        client.removeLayers([trails_layer]);   
    }
});
$('#points').on('change', ':checkbox', function(){
  if($(this).is(':checked')) {
     client.addLayers([points_layer]);
  }else{
      client.removeLayers([points_layer]);   
  }
});
console.log(map);
  }
 window.onload = main; 
