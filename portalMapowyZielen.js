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
}).addTo(map);

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
}).addTo(map);
