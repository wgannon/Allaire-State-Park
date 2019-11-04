/* Stylesheet by William D Gannon, 2019 */
/* For Project 2 Allaire State Park */

//Get Map Tiles and Center Map
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
console.log(trails_source);
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
console.log(points_source);
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

const trails_layer = new carto.layer.Layer(trails_source, trails_style);
console.log(trails_layer);
const points_layer = new carto.layer.Layer(points_source, points_style);
console.log(points_layer);


client.addLayers([trails_layer, points_layer]);
client.getLeafletLayer().addTo(map);
console.log(carto.version);
console.log(map);
