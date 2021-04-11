//definicja układu mapy
var crs = new L.Proj.CRS('EPSG:2180',
  '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs', {
    resolutions: [1600, 800, 400, 200, 100, 50, 25, 12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625, 0.1953125, 0.09765625],
    origin: [0, 0],
    bounds: L.bounds([0, 0], [1228800, 819200])
  });

//inicjalizacja mapy
var map = new L.Map('mapdiv', {
    crs: crs,
    minZoom: 1,
    zoom: 6,
    center: [52.23, 21.01]
});

//warstwa kafelki OSM
var osm = new L.TileLayer('http://mapy.geoportal.gov.pl/wss/ext/OSM/BaseMap/tms/1.0.0/osm/grid_2180/{z}/{x}/{y}.png', {
  maxZoom: 16,
  minZoom: 0,
  tileSize: 512,
  continuousWorld: true,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>',
  tms: true
}).addTo(map);

//warstwa Ochrona Środowiska
var gdos = L.tileLayer.wms('http://sdi.gdos.gov.pl/wms', {
  subdomains: ['integracja01','integracja02'],
  layers: 'GDOS:ObszaryChronionegoKrajobrazu,GDOS:ObszarySpecjalnejOchrony,GDOS:ParkiKrajobrazowe,GDOS:ParkiNarodowe,GDOS:PomnikiPrzyrody,GDOS:Rezerwaty,GDOS:SpecjalneObszaryOchrony,GDOS:StanowiskaDokumentacyjne,GDOS:UzytkiEkologiczne,GDOS:ZespolyPrzyrodniczoKrajobrazowe',
  transparent: 'true',
  maxZoom: 8,
  minZoom: 1,
  format: 'image/png',
  tileSize: 1024,
  attribution: 'GUGiK'
})

//warstwa Lasy
var lasy = L.tileLayer.wms('http://mapserver.bdl.lasy.gov.pl/ArcGIS/services/WMS_BDL/mapserver/WMSServer', {
  subdomains: ['integracja01','integracja02'],
  layers: '0,1,2,3,4,5,6',
  transparent: 'true',
  maxZoom: 16,
  minZoom: 6,
  format: 'image/png',
  tileSize: 1024,
  attribution: 'BDL'
})

function smog(feature, layer) {
  layer.bindPopup("<p>Pył PM10: " + Math.round(feature.properties.PM10*100)/100 + " &microgm<sup>-3</sup></p>");
  layer.setIcon(czujnik)
};

var czujnik = new L.Icon({iconUrl: 'sensorIcon.png', iconSize: [30, 30]});

var myRequest = new XMLHttpRequest();
myRequest.open('GET', 'https://data.sensor.community/airrohr/v1/filter/area=52.23,21.01,12');
myRequest.onload = function(){
  var dataFromLuftdaten = JSON.parse(myRequest.responseText);
  features = [];
  for (i=0; i<dataFromLuftdaten.length; i++){
    if (500 > parseFloat(dataFromLuftdaten[i].sensordatavalues[0].value) > 0){ //Przedział 0 - 500 aby wykluczyć błędy grube
    point = {"type": "Feature",
          "geometry":{
            "type": "Point",
            "coordinates":[parseFloat(dataFromLuftdaten[i].location.longitude), parseFloat(dataFromLuftdaten[i].location.latitude)]},
          "properties": {"PM10": parseFloat(dataFromLuftdaten[i].sensordatavalues[0].value)}};
    features.push(point);
  }};
  var geoJsonObject = {
  "type": "FeatureCollection",
  "features": features
  };
  var data = L.geoJson(geoJsonObject, {
    onEachFeature: smog
  }).addTo(map);
  console.log(geoJsonObject);
  var options = {gridType: 'hex', property: 'PM10', units: 'kilometers'};
  var hexGrid = turf.interpolate(geoJsonObject, 0.75, options);
  var interpolacja = L.geoJSON(hexGrid, {
    style: function(feature){
      if (feature.properties.PM10 < 20){
        return {fillColor:'#33cc33', weight:1, color:'black', fillOpacity:0.7}
      } else if (feature.properties.PM10 < 50){
        return {fillColor:'#66ff33', weight:1, color:'black', fillOpacity:0.7}
      } else if (feature.properties.PM10 < 80){
        return {fillColor:'#ffff66', weight:1, color:'black', fillOpacity:0.7}
      } else if (feature.properties.PM10 < 100){
        return {fillColor:'#ff9900', weight:1, color:'black', fillOpacity:0.7}
      } else if (feature.properties.PM10 < 150){
        return {fillColor:'#ff3300', weight:1, color:'black', fillOpacity:0.7}
      } else {
        return {fillColor:'#cc0000', weight:1, color:'black', fillOpacity:0.7}
      }
    },
    onEachFeature: function(feature, layer){
      layer.bindPopup('<p>PM10: '+Math.round(feature.properties.PM10*100)/100+' &microgm<sup>-3</sup></p>');
      layer.on('mousemove', function(e){
        layer.setStyle({fillOpacity:1});
        document.getElementById('showPM10').value = Math.round(feature.properties.PM10*100)/100;
      });
      layer.on('mouseout', function(e){
        layer.setStyle({fillOpacity:0.7})
      });
    }
  }).addTo(map);

  var baseLayers = {
  "OSM": osm
  };

  var overlayMaps = {
  "GDOŚ - obszary chronione": gdos,
  "Lasy": lasy,
  "Czujniki": data,
  "Interpolacja": interpolacja
  };

  L.control.layers(baseLayers, overlayMaps).addTo(map);
}
myRequest.send();
