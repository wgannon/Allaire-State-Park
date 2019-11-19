/* Stylesheet by William D Gannon, 2019 */
/* For Project 2 Allaire State Park */

//Get Map Tiles and Center Map
function main(){

//connect to dataset
//call carto client if needed for certain operations
var client = new carto.Client({
    apiKey: 'hOoKOiroadj3UzrLaXpPWQ',
    username: 'wgannon42'
});


// layer group layers
var trails = L.layerGroup();
var points = L.layerGroup();
var reports = L.layerGroup();

var config = {
  cartoUsername : "wgannon42",
  cartoInsertFunction : "insert_park_goer_data",
  cartoTablename : "report",
  mapcenter: [40.159275, -74.130852],
  drawOptions: {
    draw : {
      marker: true
    },
    edit : false,
    remove: false
  }
};
var cartodata
//----------------------------------------------------------------------

  //define map object
  var basemap = L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6f28dfe2159642149f08dbf0cfa922a9', {
                attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                apikey: '<6f28dfe2159642149f08dbf0cfa922a9>'
                });
  
  var map = L.map('map', {
    center: [40.159275,  -74.130852],
    zoom: 16,
    layers: [basemap, trails, points, reports]
  });
  
  var baseMaps = {
    "Basemap": basemap
  };
  var overlayMaps = {
    "trails":trails,
    "points":points,
    "reports":reports
  };
  //L.control.layers(baseMaps,overlayMaps).addTo(map); //A different style layer manager
//----------------------------------------------------------------------  
//Adding data to the carto dataase
    //http://duspviz.mit.edu/web-map-workshop/cartodb-data-collection/
var cartoPoints = null;

function style_lines(c) {
  if (c ==="Mountain Laurel Trail"){
		var color1 = "#F47A38"
		return color1;
  } else if (c==="Canal Trail"){
    var color1 = "#8C2633"
    return color1;
  } else if (c==="Nature Trail"){
    var color1 = "#FFB81C"
    return color1;
  } else if (c==="Pine Trail"){
    var color1 = "#002654"
    return color1;
  } else if (c==="Boy Scout Trail"){
    var color1 = "#C8102E"
    return color1;
  } else if (c==="Brisbane Trail"){
    var color1 = "#8F8F8C"
    return color1;
  } else if (c==="Capital to Coast Connector"){
    var color1 = "#6FF63D"
    return color1;
  } else if (c==="Upper Squankum Trail"){
    var color1 = "#0038A8"
    return color1;
  }  else {
    var color1 = "#60223B"
    return color1;
  }
};

//link to getting the Json of files https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT%20*FROM%20report    
function styleIcons(I) {
  if (I==="Campground"){
    var icon = L.icon({iconUrl: 'png/camping-icon.png'})
    return icon;
  } else if (I==="Canoe"){
    var icon = L.icon({iconUrl: 'png/canoe-icon.png'})
    return icon;
  } else if (I==="Concession"){
    var icon = L.icon({iconUrl: 'png/shop-icon.png'})
    return icon;
  } else if (I==="Entrance"){
    var icon = L.icon({iconUrl: 'png/enter-icon.png'})
    return icon;
  } else if (I==="Fishing"){
    var icon = L.icon({iconUrl: 'png/fishing-icon.png'})
    return icon;
  } else if (I==="Historic Site"){
    var icon = L.icon({iconUrl: 'png/historic-icon.png'})
    return icon;
  } else if (I==="Nature Feature"){
    var icon = L.icon({iconUrl: 'png/nature-icon.png'})
    return icon;
  } else if (I==="Park Building"){
    var icon = L.icon({iconUrl: 'png/info-icon.png'})
    return icon;
  } else if (I==="Parking"){
    var icon = L.icon({iconUrl: 'png/parking-icon.png'})
    return icon;
  } else if (I==="Picnic Area"){
    var icon = L.icon({iconUrl: 'png/picnic-icon.png'})
    return icon;
  } else if (I==="Restroom"){
    var icon = L.icon({iconUrl: 'png/restroom-icon.png'})
    return icon;
  } else{
    console.log("Icon" + I + " Had an error");
  }
};
  
// REquest getting the reports information from carto
$.getJSON("https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM report", function(data) {
    report_points = L.geoJson(data,{
    pointToLayer: function(feature,latlng){
      reportsIcon = L.icon({iconUrl: 'png/report-icon.png'});
      var marker = L.marker(latlng,{icon: reportsIcon});
      return marker;
    }
    }).bindPopup(function (layer) {
      return layer.feature.properties.description; 
    }).addTo(reports);
  });
 //request getting the trails data from carto 
$.getJSON("https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM allaire_trails", function(data) {
    allaire_trails = L.geoJson(data,{ 
    style: function (feature){
      t_name = feature.properties.trail_name;
      return {
        color: style_lines(t_name),
        weight: 3,
        opacity: .7,
        dashArray: '20,15',
        lineJoin: 'round'
      };
       ///NOTEs when left need to make the color the style Here, somehow either put the function here or not
      }
    }).bindPopup(function (layer) {
      return layer.feature.properties.trail_name; 
    }).addTo(trails);
  });
//Request getting the points from carto
$.getJSON("https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM allaire_points WHERE feature_ty IN ('Restroom', 'Picnic Area', 'Parking', 'Park Building', 'Nature Feature', 'Historic Site', 'Fishing', 'Canoe', 'Entrance', 'Concession', 'Campground'); ", function(data) {
    allaire_points = L.geoJson(data,{ 
    pointToLayer: function(feature,latlng){
      p_type = feature.properties.feature_ty;
      var marker = L.marker(latlng, {icon: styleIcons(p_type)});
      return marker;
      
    }
    }).bindPopup(function (layer) {
      return layer.feature.properties.feature_ty + ": " + layer.feature.properties.feature_na; 
    }).addTo(points);
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
    map.addLayer(reports);
  }else{
    map.removeLayer(reports);   
  }
});
//console.log(map);
  }
 window.onload = main; 
