/* Stylesheet by William D Gannon, 2019 */
/* For Project 2 Allaire State Park */

//Get Map Tiles and Center Map
function main(){

//connect to dataset
//call carto client if needed for certain operations
var client = new carto.Client({
    apiKey: 'my1W1tvAgI0O8rfr2RsAvA',
    username: 'wgannon42'
});


// layer group layers
var trails = L.layerGroup();
var points = L.layerGroup();
var reports = L.layerGroup();
    
var config = {
  cartoUsername : "wgannon42",
  cartoInsertFunction : "INSERT INTO report (the_geom, name, description, date) VALUES (",
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
var cartoData = null;
//----------------------------------------------------------------------

  //define map object
  var basemap = L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6f28dfe2159642149f08dbf0cfa922a9', {
                attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                apikey: '<6f28dfe2159642149f08dbf0cfa922a9>'
                });
  
  var map = L.map('map', {
    center: [40.159275,  -74.130852],
    zoom: 16,
    zoomControl: true,
    layers: [basemap, trails, points, reports]
  });
var controlMap = false;

//----------------------------------------------------------------------  
//Adding data to the carto dataase
    //http://duspviz.mit.edu/web-map-workshop/cartodb-data-collection/

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
$.getJSON("https://wgannon42.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM report WHERE date >= current_date - interval'1 day'", function(data) {
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
  
  var drawnItems = new L.FeatureGroup();
  // Create Leaflet Draw Control for the draw tools and toolbox  
  var drawControl = new L.Control.Draw({
    position: 'topleft',
    draw : {
      polygon : false,
      polyline : false,
      rectangle : false,
      circle : false
    },
    edit : false,
    remove: false
  }); 
  var controlOnMap = false;
$('#startEdits').click (function(){
    if (controlOnMap === true) {
      map.removeControl(drawControl);
      controlOnMap = false;
    }
    map.addControl(drawControl);
    controlOnMap = true;
});
$('#stopEdits').click (function(){
    map.removeControl(drawControl);
    controlOnMap = false;
});
// create form for leaflet draw control
map.on(L.Draw.Event.CREATED, function (e) {

    var layer = e.layer;
    map.addLayer(drawnItems);
    drawnItems.addLayer(layer);
    dialog.dialog("open");

});

// Use the jQuery UI dialog to create a dialog and set options
var dialog = $("#dialog").dialog({
  autoOpen: false,
  height: 300,
  width: 350,
  modal: true,
  position: {
    my: "center center",
    at: "center center",
    of: "#map"
  },
  buttons: {
    "Add to Database": setData,
    Cancel: function() {
      dialog.dialog("close");
      refreshLayer();
    }
  },
  close: function() {
    form[ 0 ].reset();
    console.log("Dialog closed");
  }
});

// Stops default form submission and ensures that setData or the cancel function run
var form = dialog.find("form").on("submit", function(event) {
  event.preventDefault();
});

function setData() {
  var enteredUsername = username.value;
  var enteredDescription =description.value;
    var ts = new Date();
    
  var date = "'"+ ts.toLocaleDateString()+"'";
    console.log()
  drawnItems.eachLayer(function (layer) {
  
  var coord = "ST_SetSRID(ST_Point(" + layer._latlng.lng+ ","+ layer._latlng.lat + "),4326)";
  //Convert the drawing to a GeoJSON to pass to the Carto sql database
    
      //Construct the SQL query to insert data from the three parameters: the drawing, the input username, and the input description of the drawn shape
    sql = config.cartoInsertFunction;
      sql += coord;
      sql += "," + "'"+enteredUsername+"'";
      sql += "," + "'"+enteredDescription+"'";
      sql += "," + date ;
      sql += ")";


console.log(sql);
    //Sending the data
    $.ajax({
      type: 'POST',
      url: 'https://wgannon42.carto.com/api/v2/sql',
      crossDomain: true,
      data: {"q": sql, "api_key": 'my1W1tvAgI0O8rfr2RsAvA'},
      dataType: 'json',
      success: function (responseData, textStatus, errorThrown) {
        console.log("Data saved");
        dialog.dialog("close");
      },
      error: function (responseData, textStatus, errorThrown) {
        console.log("Problem saving the data");
      }
    });

    /* 
    * Transfer submitted drawing to the Carto layer, this results in the user's data appearing on the map without
    * requerying the database (see the refreshLayer() function for an alternate way of doing this) 
    */

  });
  
  dialog.dialog("close");
}
function refreshLayer() {
  console.log("drawnItems has been cleared");
  map.removeLayer(drawnItems);
  drawnItems = new L.FeatureGroup();
/* 
  This would refresh the data-layer to include new data from the Carto table after each drawing is submitted. 
*/
}

//------------------------------------------------------------------------------------------
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

  }
 window.onload = main; 
