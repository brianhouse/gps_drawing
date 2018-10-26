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

geolocate.on('geolocate', function(event) {

    console.log('geolocated', event)

})


let db = new DB()

let shape = []

map.on('click', function(event) {

    let current_location = [event.lngLat.lng, event.lngLat.lat]
    console.log(current_location)
    shape.push(current_location)
    // db.insert('new', {'name': "Brian"})

})

let record_btn = document.getElementById('record_btn')

record_btn.addEventListener('click', function() {

    console.log('clicked')
    if (record_btn.value == 'Record') {
        record_btn.setAttribute('class', 'recording')        
        record_btn.value = 'Stop'
    } else {
        record_btn.value = 'Record'
        record_btn.removeAttribute('class', 'recording')        
    }

})
