/* Stylesheet by William D Gannon, 2019 */
/* For Project 2 Allaire State Park */

//Get Map Tiles and Center Map
var map = L.map('mapid').setView([40.159275,  -74.130852], 16);

L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6f28dfe2159642149f08dbf0cfa922a9', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<6f28dfe2159642149f08dbf0cfa922a9>',
	maxZoom: 22
	}).addTo(map);
console.log(map);




//connect to dataset
//call carto client
var client = new carto.Client({
    apiKey: 'PUzc3fQC_OgJS8Ppcp1h2Q',
    username: 'wgannon42'
});


// returns the version of the library
const source = new carto.source.Dataset('allairestatepark');
const style = new carto.style.CartoCSS(`
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
        #layer{
          line-color: #826DBA;
          line-width: 1.5;
          line-opacity: 1;
            }

      `);
const layer = new carto.layer.Layer(source, style);


client.addLayer(layer, style);
client.getLeafletLayer().addTo(map);
console.log(carto.version);s