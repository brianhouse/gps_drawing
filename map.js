'use strict'

console.log('Loaded map.js')

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJpYW5ob3VzZSIsImEiOiJXcER4MEl3In0.5EayMxFZ4h8v4_UGP20MjQ'

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/brianhouse/cjnozrbwt087i2ss4v03wg70z',
    center: [-73.96216,40.80779],
    zoom: 16
})

let navigation = new mapboxgl.NavigationControl({
    showCompass: false
})
map.addControl(navigation, 'top-left')

let scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
})
map.addControl(scale, 'bottom-right')

let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true,
    fitBoundsOptions: {
    }
})
map.addControl(geolocate, 'top-left')



// create a variable to keep track of the user's current location
// we're going to initialize it to the default center of the map
let current_location = [-73.96216, 40.80779]

// update the variable whenever a geolcation event fires
geolocate.on('geolocate', function(event) {
    current_location = [event.coords.longitude, event.coords.latitude]
    console.log('geolocated', current_location)   

    if (recording) {
        path.push(current_location)
        updateGeoJSON()    
    }

})

// for testing purposes, also update the variable whenever you click on the map
map.on('click', function(event) {
    current_location = [event.lngLat.lng, event.lngLat.lat]
    console.log('clicked', current_location)        

    if (recording) {
        path.push(current_location)
        updateGeoJSON()    
    }

})


// this array will hold the sequence of points in our path
let path = []

// this variable will keep track of whether we should be adding points to our path or not
let recording = false

// create variables that reference our HTML buttons
let record_btn = document.getElementById('record_btn')

let cancel_btn = document.getElementById('cancel_btn')
cancel_btn.style['display'] = "none"    // initially hidden


// keep track of start and stop markers
let start_marker = null
let stop_marker = null


// create a new database
let db = new DB()


// these functions will manage the state of the application

function startRecording() {
    recording = true                                // toggle recording mode 
    record_btn.style['background-color'] = "red"    // make the button red
    record_btn.style['color'] = "white"             // make it's text white
    record_btn.value = 'Stop and save'              // change the text
    cancel_btn.style['display'] = "block"           // display the cancel button

    // create the start marker and place it at the current location
    start_marker = new mapboxgl.Marker()    
    start_marker.setLngLat(current_location)
    start_marker.addTo(map)

    startGeoJSON()
    path.push(current_location)
}

function cancelRecording() {
    recording = false
    record_btn.value = 'Start'
    record_btn.style['background-color'] = "white"
    record_btn.style['color'] = "black"        
    cancel_btn.style['display'] = "none"

    start_marker.remove()
    path = []   // clear the path

    updateGeoJSON()
}

function stopRecording() {
    recording = false
    record_btn.value = 'Start'
    record_btn.style['background-color'] = "white"
    record_btn.style['color'] = "black"        
    cancel_btn.style['display'] = "none"

    // create the start marker and place it at the current location
    stop_marker = new mapboxgl.Marker()    
    stop_marker.setLngLat(current_location)
    stop_marker.addTo(map)

    db.insert('paths', path)
    path = []   // clear the path
}

record_btn.addEventListener('click', function() {
    console.log('clicked record_btn')
    if (record_btn.value == 'Start') {
        startRecording()
    } else {
        stopRecording()
    }
})

cancel_btn.addEventListener('click', function() {
    console.log('clicked cancel_btn')    
    cancelRecording()
})


//

var geojson = {
    "type": "FeatureCollection",
    "features": []
}

map.on('load', function() {
    map.addLayer({
        'id': 'drawing',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': geojson
        },
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#50C3DF',
            'line-width': 5,
            'line-opacity': .8
        }
    })
})



function startGeoJSON() {
    geojson.features.push({
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": []
        }
    })
}

function updateGeoJSON() {
    geojson.features[geojson.features.length - 1].geometry.coordinates = path
    map.getSource('drawing').setData(geojson)
}



