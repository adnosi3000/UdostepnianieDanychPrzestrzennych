//definicja układu mapy
var crs = new L.Proj.CRS('EPSG:2180',
  '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs', {
  resolutions: [1600, 800, 400, 200, 100, 50, 25, 12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625, 0.1953125, 0.09765625],
  origin: [0, 0],
  bounds: L.bounds([0, 0], [1228800, 819200])
  });

//inicjalizacja mapy
var map = L.map('mapdiv', {
  center: [52.23, 21.01],
  zoom: 11
});

var osm = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Mapa topografoczna &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>',
});

var bdot = L.tileLayer.wms('https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaBazDanychObiektowTopograficznych', {
  layers: 'wdrozenia,bdot',
  format: 'image/png',
  transparent: 'true',
  tileSize: 1024
});

var NDVI = L.tileLayer.wms('http://localhost/cgi-bin/qgis_mapserv.fcgi.exe?MAP=D:/GiK_sem10/UDP/zadanie3/projekt_serwer.qgz', {
  layers:'NDVI',
  maxZoom: 20,
  format: 'image/png',
  transparent: true,
  version: '1.3.0'
})

var orto = L.tileLayer.projwmts('https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/HighResolution', {
    format: 'image/png',
    tileSize: 512,
    version: '1.0.0',
    transparent: true,
    crs: crs,
    origin: [850000.0, 100000.0],
    scales: [3.0238155714285716E7, 1.5119077857142858E7, 7559538.928571429, 3779769.4642857146, 1889884.7321428573, 944942.3660714286, 472471.1830357143, 236235.59151785716, 94494.23660714286, 47247.11830357143, 23623.559151785714, 9449.423660714287, 4724.711830357143, 1889.8847321428573, 944.9423660714286, 472.4711830357143, 236.23559151785716],
    tilematrixSet: 'EPSG:2180',
    opacity: 0.8,
    crossOrigin: true,
    minZoom: 5,
    attribution: 'Dostawca ortofotomapy &copy; <a href="https://www.geoportal.gov.pl/">Geoportal</a>'
});

var topoGUGiK = L.tileLayer.projwmts('https://mapy.geoportal.gov.pl/wss/service/WMTS/guest/wmts/G2_MOBILE_500', {
    format: 'image/png',
    tileSize: 512,
    version: '1.0.0',
    transparent: true,
    crs: crs,
    origin: [850000.0, 100000.0],
    scales: [3.0238155714285716E7, 1.5119077857142858E7, 7559538.928571429, 3779769.4642857146, 1889884.7321428573, 944942.3660714286, 472471.1830357143, 236235.59151785716, 94494.23660714286, 47247.11830357143, 23623.559151785714, 9449.423660714287, 4724.711830357143, 1889.8847321428573, 944.9423660714286, 472.4711830357143],
    tilematrixSet: 'EPSG:2180',
    opacity: 0.8,
    crossOrigin: true,
    minZoom: 5,
    attribution: 'Dostawca ortofotomapy &copy; <a href="https://www.geoportal.gov.pl/">Geoportal</a>'
});

var topoEsri = L.esri.basemapLayer('Topographic').addTo(map);

url = 'http://localhost/cgi-bin/qgis_mapserv.fcgi.exe?MAP=D:/GiK_sem10/UDP/zadanie3/projekt_serwer.qgz';
layer = 'demography'; // CO WPISAĆ JAKO NAMESPACE???
format = "application/json";
maxFeatures = "100";

wfs_url = url+"&service=WFS&version=1.0.0&request=GetFeature"+"&TypeName="+layer+"&maxFeatures="+maxFeatures+"&outputFormat="+format;
console.log(wfs_url);

$.getJSON(wfs_url,  function(data) {
    console.log(data);
    poly_layer = L.geoJson(data, {
        onEachFeature: function(feature, layer){
          layer.bindPopup('<p>Liczba ludności: '+feature.properties.TOT+'</p>')
        }
    });
    overlays["demografia (WFS)"]= poly_layer;
    layersControl.remove();
    layersControl = L.control.layers(baseLayers, overlays).addTo(map);
});

var baseLayers = {
"OSM": osm,
"Ortofotomapa": orto,
"BDOO / BDOT10k WMTS": topoGUGiK,
"BDOT10k WMS": bdot,
"Topografia (esri)": topoEsri
};

var overlays = {"NDVI 08.2020 (WMS)": NDVI}

var layersControl = L.control.layers(baseLayers, overlays).addTo(map);

var graniceMiasta = L.geoJSON(warszawa, {
  style: function(feature) {
    return {color: '#ff3333', fillOpacity: '0'}
  }
}).addTo(map);
