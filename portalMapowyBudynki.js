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
    zoom: 10,
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

var kieg = L.tileLayer.wms('https://{s}.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow?', {
  subdomains: ['integracja01','integracja02'],
  layers: 'dzialki,numery_dzialek,budynki',
  transparent: 'true',
  minZoom: 8,
  format: 'image/png',
  tileSize: 1024,
  attribution: 'GUGiK'
}).addTo(map);

map.on('click', function(e){
	if (map.hasLayer(kieg)){

		var myRequest = new XMLHttpRequest();
    // PARAMETRY DO ZAPYTANIA GETFEATUREINFO
		// console.log(map.getBounds().getNorth());
		// console.log(map.getBounds().getSouth());
		// console.log(map.getBounds().getEast());
		// console.log(map.getBounds().getWest());
		// console.log(map.getSize().x);
		// console.log(map.getSize().y);
		// console.log(e.containerPoint.x);
		// console.log(e.containerPoint.y);
		var link = 'https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow?VERSION=1.1.1&SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=dzialki,numery_dzialek,budynki&QUERY_LAYERS=dzialki,numery_dzialek,budynki&SRS=EPSG:4326&WIDTH='+ map.getSize().x + '&HEIGHT=' + map.getSize().y + '&X=' + e.containerPoint.x + '&Y=' + e.containerPoint.y + '&TRANSPARENT=TRUE&FORMAT=text/html&BBOX='+map.getBounds().getWest()+','+ map.getBounds().getSouth()+','+map.getBounds().getEast() +','+map.getBounds().getNorth()
		console.log(link)
		myRequest.open('GET', link);
		myRequest.onload = function(){
			var response = myRequest.responseXML;
      var popupText = '<p><b>Informacje z usługi GetFeatureInfo:</b></p><table><tr><td>ID działki</td><td>'+response.getElementsByTagName("Attribute")[0].childNodes[0].nodeValue+'</td></tr><tr><td>Województwo</td><td>'+response.getElementsByTagName("Attribute")[1].childNodes[0].nodeValue+'</td></tr><tr><td>Powiat</td><td>'+response.getElementsByTagName("Attribute")[2].childNodes[0].nodeValue+'</td></tr><tr><td>Gmina</td><td>'+response.getElementsByTagName("Attribute")[3].childNodes[0].nodeValue+'</td></tr><tr><td>Obręb</td><td>'+response.getElementsByTagName("Attribute")[4].childNodes[0].nodeValue+'</td></tr><tr><td>Numer działki</td><td>'+response.getElementsByTagName("Attribute")[5].childNodes[0].nodeValue+'</td></tr></table>'
      L.popup()
			.setLatLng(e.latlng)
			.setContent(popupText)
			.openOn(map);
      map.setView(e.latlng);
		};
		myRequest.send();
	}
});
