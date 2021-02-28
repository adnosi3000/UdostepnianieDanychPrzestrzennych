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

//warstwa Szpitale zakaźne
var szpitale= L.tileLayer.wms('https://integracja.gugik.gov.pl/cgi-bin/SzpitaleZakazne', {
  subdomains: ['integracja01','integracja02'],
  layers: 'oddzialzakazny,przystosowane,istniejace',
  transparent: 'true',
  maxZoom: 16,
  minZoom: 0,
  format: 'image/png',
  tileSize: 1024,
  attribution: 'GUGiK'
}).addTo(map);

//warstwa Zdrowie
var oupz = L.tileLayer.wms('https://integracja.gugik.gov.pl/cgi-bin/zdrowie', {
  subdomains: ['integracja01','integracja02'],
  layers: 'szpitale,apteki,sor,nocna_pomoc,zdrowie',
  transparent: 'true',
  maxZoom: 16,
  minZoom: 0,
  format: 'image/png',
  tileSize: 1024,
  attribution: 'GUGiK'
}).addTo(map);

var baseLayers = {
"OSM": osm
};

var overlayMaps = {
"Szpitale zakaźne": szpitale,
"OUPZ": oupz
};

L.control.layers(baseLayers, overlayMaps).addTo(map);
