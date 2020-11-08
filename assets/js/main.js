let orcas = [];
let yearsOfObservation = [];
let whales = {};
let mymap = L.map('mapid').setView([49,-123],7);

var orcaIcon = L.icon({
  iconUrl: './assets/icons/whale_low_quality.png',
  iconSize:     [50, 95], // size of the icon
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; OpenStreetMap',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);

// Begin: API REQUEST 
var myHeaders = new Headers();
myHeaders.append("Cookie", "__cfduid=deef5891276775fad2921c8c0e49f4b841603242417; request_method=GET");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://hotline.whalemuseum.org/api.json", requestOptions)
  .then(response => response.text())
  .then(result => {
    whales = JSON.parse(result);
    for (whale in whales){
      if (whales[whale]["species"]=="orca"){
        orcas.push(whales[whale]);
      }
    }
    addToYearsToArray();
  })
  .catch(error => console.log('error', error));

// End: API REQUEST 


// Begin: HELPER FUNCTIONS
function addToYearsDropDown(year) {
  let menu = document.getElementById("drop-down");
  menu.innerHTML+=`<a class="dropdown-item" onclick="plotOrcas(${year})">${year}</a>`;
}

function addToYearsToArray() {
  for (orca in orcas){
    let year = new Date (orcas[orca]["sighted_at"]).getFullYear();
    if (yearsOfObservation.indexOf(year)===-1){
      yearsOfObservation.push(year);
      addToYearsDropDown(year);
    }
  }
}

function plotOrcas(year){

  document.getElementById("mapid").remove();
  document.getElementById("map-container").innerHTML+=`<div id="mapid" style="width: 1000px; height: 450px;" ></div>`;
  mymap = L.map('mapid').setView([49,-123],7);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; OpenStreetMap',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);
  for (orca in orcas){
    if (new Date (orcas[orca]["sighted_at"]).getFullYear() == year){
      L.marker([orcas[orca]["latitude"], orcas[orca]["longitude"]], {icon: orcaIcon}).addTo(mymap);
        // .bindPopup("<b>I'm whaelo</b><br />observed at.");
    }
  }
}
// End: HELPER FUNCTIONS
