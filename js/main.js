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
    apiKey: 'PUzc3fQC_OgJS8Ppcp1h2Q',
    username: 'wgannon42'
});


// returns the version of the library
const trails = new carto.source.Dataset('allairestatepark');
console.log(trails);
const style = new carto.style.CartoCSS(`
    
#layer {
	  line-width: 2.5;
	  line-color: ramp([trail_name], (#7F3C8D, #11A579, #3969AC, #F2B701, #E73F74, #80BA5A, #E68310, #008695, #A5AA99), ("Boy Scout Trail", "Brisbane Trail", "Canal Trail", "Capital to Coast Connector", "Mountain Laurel Trail", "Nature Trail", "Pine Trail", "Upper Squankum Trail"), "=");
	  line-comp-op: overlay;
	}

#layer{
      marker-width: 7;
      marker-fill: #EE4D5A;
      marker-fill-opacity: 0.9;
      marker-line-color: #FFFFFF;
      marker-line-width: 1;
      marker-line-opacity: 1;
      marker-type: ellipse;
      marker-allow-overlap: true;
           }

	#layer::labels {
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

      `);
const layer = new carto.layer.Layer(trails, style);


client.addLayer(layer, style);
client.getLeafletLayer().addTo(map);
console.log(carto.version);
console.log(map);
