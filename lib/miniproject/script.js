// ThingSpeak configuration
const THINGSPEAK_CHANNEL_ID = '2943982';
const THINGSPEAK_READ_API_KEY = '1NDJ9LFY1FCG67K4';
const THINGSPEAK_FIELD_NUMBER = 1;
const SOC_UPDATE_INTERVAL = 10000;
const WARNING_REPEAT_INTERVAL = 60000; // 1 minute for repeat warnings

// Global variables
let currentSOC = 0;
let lastSOCValue = null; // Track the last SOC value received
let warningDiv = null;
let lastWarningTime = 0;
let warningTimeout = null;

// Function to fetch SOC from ThingSpeak
async function fetchSOCFromThingSpeak() {
    try {
        const response = await fetch(`https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/fields/${THINGSPEAK_FIELD_NUMBER}/last.json?api_key=${THINGSPEAK_READ_API_KEY}`);
        const data = await response.json();
        const newSOC = parseFloat(data[`field${THINGSPEAK_FIELD_NUMBER}`]);
        
        if (!isNaN(newSOC)) {
            // Check if this is a new SOC value
            const isNewValue = lastSOCValue === null || newSOC !== lastSOCValue;
            lastSOCValue = newSOC;
            
            currentSOC = newSOC;
            updateSOCDisplay(currentSOC);
            
            // Clear any pending timeout
            if (warningTimeout) {
                clearTimeout(warningTimeout);
                warningTimeout = null;
            }
            
            // Check if we should show warning
            if (currentSOC <= 20) {
                if (isNewValue) {
                    // New low SOC value - show immediately if map isn't busy
                    if (!isMapBusy()) {
                        showLowSOCWarning();
                        lastWarningTime = Date.now();
                    }
                }
                
                // Schedule next warning if still low after interval
                warningTimeout = setTimeout(() => {
                    if (currentSOC <= 20 && !isMapBusy()) {
                        showLowSOCWarning();
                        lastWarningTime = Date.now();
                    }
                }, WARNING_REPEAT_INTERVAL);
            } else {
                // SOC is above 20, remove warning if it exists
                removeWarning();
            }
        }
    } catch (error) {
        console.error('Error fetching SOC from ThingSpeak:', error);
    }
}

// Check if map is busy with other operations
function isMapBusy() {
    return isShowingDirections || // Navigation active
           selectedStation !== null || // Station selected
           evMarkers.length > 0; // EV stations displayed
}

// Function to show low SOC warning
function showLowSOCWarning() {
    // Remove existing warning if any
    removeWarning();
    
    warningDiv = document.createElement('div');
    warningDiv.style.position = 'fixed';
    warningDiv.style.top = '50%';
    warningDiv.style.left = '50%';
    warningDiv.style.transform = 'translate(-50%, -50%)';
    warningDiv.style.backgroundColor = '#ff4444';
    warningDiv.style.color = 'white';
    warningDiv.style.padding = '20px';
    warningDiv.style.borderRadius = '5px';
    warningDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    warningDiv.style.zIndex = '1001';
    warningDiv.style.textAlign = 'center';
    
    warningDiv.innerHTML = `
        <h3 style="margin-top: 0;">⚠ WARNING</h3>
        <p>Charge is less than 20 percent (${currentSOC.toFixed(1)}%), charge immediately!</p>
        <button onclick="removeWarning()" 
                style="background: white; border: none; padding: 5px 10px; 
                       border-radius: 3px; cursor: pointer; margin-top: 10px;">
            OK
        </button>
    `;
    
    document.body.appendChild(warningDiv);
}

// Function to remove warning
function removeWarning() {
    if (warningDiv) {
        warningDiv.remove();
        warningDiv = null;
    }
}

// Function to update SOC display
function updateSOCDisplay(soc) {
    const socElement = document.getElementById('soc-display');
    if (socElement) {
        socElement.textContent = `${soc.toFixed(1)}%`;
    }
}

let map;
let marker;
let pathCoordinates = [];
let polyline;
let lastValidPosition = null;
const MAX_POINTS = 100;
const MOVEMENT_THRESHOLD = 5; // meters
const STABILITY_THRESHOLD = 2; // meters
const TIME_THRESHOLD = 10000; // 10 seconds
const SEARCH_RADIUS = 5000; // 5km radius for EV stations

// Navigation variables
let directionsService;
let directionsRenderer;
let isShowingDirections = false;
let selectedStation = null;
let stepDisplay;
let currentStep = 0;

// UI Control variables
let autoCenterEnabled = true;
const AUTO_CENTER_ZOOM = 18;

// EV Stations data
const manualEVStations = [
  { name: "Ather grid charging station", lat: 12.908964824828663, lng: 77.56395755720595 },
  { name: "Kazam Charging station", lat: 12.90879586448604, lng: 77.56401763530806 },
  { name: "S S Sai Ev Mart", lat: 12.914713602862813, lng: 77.56538043008007 },
  { name: "Electricpe Charging Station1", lat: 12.906215911376563, lng: 77.5626522686961 },
  { name: "Tata Power Charging Station", lat: 12.903948210063016, lng: 77.57347698562559 },
  { name: "Electricpe Charging Station2", lat: 12.898473626444714, lng:  77.57146177504956 },
  { name: "Shell Recharge Charging Station", lat: 12.89720423223652, lng:  77.57070051399188 },
  { name: "Electricpe Charging Station3", lat: 12.906815842100526, lng:  77.57142678447993 },
];
let evMarkers = [];

// Kalman Filter for position smoothing
class PositionFilter {
  constructor() {
    this.R = 4; // Measurement noise
    this.Q = 0.1; // Process noise
    this.P = 1; // Estimation error
    this.X = null; // Estimated value
  }

  update(measurement) {
    if (!this.X) {
      this.X = measurement;
      return this.X;
    }
    
    this.P = this.P + this.Q;
    const K = this.P / (this.P + this.R);
    this.X = this.X + K * (measurement - this.X);
    this.P = (1 - K) * this.P;
    
    return this.X;
  }
}

const latFilter = new PositionFilter();
const lngFilter = new PositionFilter();
let lastUpdateTime = 0;
let stationaryMode = false;

// Simulated GPS data for testing
const simulatedPositions = [
  { lat: 12.908211, lng: 77.567759 },
  { lat: 12.908211, lng: 77.567759 }
];
let currentSimulatedIndex = 0;

function initMap() {
  // Initialize map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 12.908211, lng: 77.567759 },
    zoom: AUTO_CENTER_ZOOM,
    mapTypeId: 'roadmap'
  });

  // Initialize directions services
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true,
    preserveViewport: true
  });

  // Initialize step display for navigation
  stepDisplay = new google.maps.InfoWindow();
  
  // Create main vehicle marker
  marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    icon: {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 5,
      fillColor: "#EA4335",
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: "#FFFFFF",
      rotation: 0
    }
  });

  // Create path polyline
  polyline = new google.maps.Polyline({
    path: pathCoordinates,
    strokeColor: "#4285F4",
    strokeOpacity: 0.7,
    strokeWeight: 3,
    geodesic: true
  });
  polyline.setMap(map);

  // Add UI controls
  addDirectionsControls();
  addAutoCenterControl();
  addNavigationControls();

  // Start SOC updates from ThingSpeak
  fetchSOCFromThingSpeak(); // Initial fetch
  setInterval(fetchSOCFromThingSpeak, SOC_UPDATE_INTERVAL); // Periodic updates

  // Start simulated updates (replace with real GPS data source)
  startSimulatedUpdates();
}

function addAutoCenterControl() {
  const autoCenterControl = document.createElement('div');
  const autoCenterButton = document.createElement('button');
  
  autoCenterButton.textContent = 'Auto-Center: ON';
  autoCenterButton.style.backgroundColor = '#4CAF50';
  autoCenterButton.style.color = 'white';
  autoCenterButton.style.padding = '5px 10px';
  autoCenterButton.style.border = 'none';
  autoCenterButton.style.borderRadius = '3px';
  autoCenterButton.style.cursor = 'pointer';
  autoCenterButton.style.margin = '10px';
  
  autoCenterControl.appendChild(autoCenterButton);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(autoCenterControl);

  autoCenterButton.addEventListener('click', () => {
    autoCenterEnabled = !autoCenterEnabled;
    if (autoCenterEnabled) {
      autoCenterButton.textContent = 'Auto-Center: ON';
      autoCenterButton.style.backgroundColor = '#4CAF50';
      if (lastValidPosition) {
        map.setCenter(lastValidPosition);
        map.setZoom(AUTO_CENTER_ZOOM);
      }
    } else {
      autoCenterButton.textContent = 'Auto-Center: OFF';
      autoCenterButton.style.backgroundColor = '#f44336';
    }
  });
}

function addDirectionsControls() {
  const controlDiv = document.createElement('div');
  const locateEVButton = createButton('Locate EV Stations');
  const clearButton = createButton('Clear Route');

  controlDiv.style.padding = '5px';
  controlDiv.style.backgroundColor = 'white';
  controlDiv.style.border = '1px solid #ccc';
  controlDiv.style.borderRadius = '5px';
  controlDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlDiv.style.margin = '10px';
  
  locateEVButton.style.margin = '5px';
  clearButton.style.margin = '5px';

  controlDiv.appendChild(locateEVButton);
  controlDiv.appendChild(clearButton);
  
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);

  locateEVButton.addEventListener('click', async () => {
    if (!lastValidPosition) {
      alert('Current position not available. Please wait for GPS data.');
      return;
    }
    await showClosestStationsPopup();
  });

  clearButton.addEventListener('click', () => {
    clearDirections();
  });
}

function addNavigationControls() {
  const navControlDiv = document.createElement('div');
  const prevButton = createButton('◄ Previous Step');
  const nextButton = createButton('Next Step ►');
  
  navControlDiv.style.padding = '5px';
  navControlDiv.style.backgroundColor = 'white';
  navControlDiv.style.border = '1px solid #ccc';
  navControlDiv.style.borderRadius = '5px';
  navControlDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  navControlDiv.style.margin = '10px';
  navControlDiv.style.display = 'none';
  
  prevButton.style.margin = '5px';
  nextButton.style.margin = '5px';

  navControlDiv.appendChild(prevButton);
  navControlDiv.appendChild(nextButton);
  
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(navControlDiv);

  prevButton.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  nextButton.addEventListener('click', () => {
    if (directionsRenderer.getDirections() && 
        currentStep < directionsRenderer.getDirections().routes[0].legs[0].steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });

  window.navControlDiv = navControlDiv;
}

function createButton(text) {
  const button = document.createElement('button');
  button.textContent = text;
  button.style.padding = '5px 10px';
  button.style.cursor = 'pointer';
  return button;
}

async function getDrivingDistance(origin, destination) {
  return new Promise((resolve) => {
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        resolve(response.routes[0].legs[0].distance.value); // in meters
      } else {
        // Fallback to straight-line distance
        resolve(google.maps.geometry.spherical.computeDistanceBetween(origin, destination));
      }
    });
  });
}

async function showClosestStationsPopup() {
  clearEVMarkers();
  
  // Show loading message
  const loadingPopup = new google.maps.InfoWindow({
    content: '<div style="padding:10px">Finding nearby stations...</div>',
    position: lastValidPosition
  });
  loadingPopup.open(map);
  
  try {
    const stationsWithDistances = [];
    
    // Calculate distances for all stations within radius
    for (const station of manualEVStations) {
      const stationPos = new google.maps.LatLng(station.lat, station.lng);
      const straightLineDistance = google.maps.geometry.spherical.computeDistanceBetween(
        lastValidPosition,
        stationPos
      );
      
      if (straightLineDistance <= SEARCH_RADIUS) {
        const distance = await getDrivingDistance(lastValidPosition, stationPos);
        stationsWithDistances.push({ ...station, distance, position: stationPos });
      }
    }
    
    // Sort by distance and get top 3 for popup
    const closestStations = stationsWithDistances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    
    // Create markers for ALL stations in radius
    stationsWithDistances.forEach(station => {
      const isClosest = closestStations.some(s => 
        s.lat === station.lat && s.lng === station.lng
      );
      
      const markerLabel = {
        text: station.name,
        color: "#EA4335",
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: "Arial Black, Arial, sans-serif",
        className: "station-label"
      };
      
      const evMarker = new google.maps.Marker({
        position: station.position,
        map: map,
        title: station.name,
        label: markerLabel,
        icon: {
          url: isClosest 
            ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          labelOrigin: new google.maps.Point(-25, 0)
        }
      });
      
      evMarker.addListener('click', () => {
        selectStation(station);
      });
      
      evMarkers.push(evMarker);
    });
    
    loadingPopup.close();
    
    if (closestStations.length > 0) {
      showStationSelectionPopup(closestStations);
    } else {
      alert('No charging stations found within 5km radius.');
    }
  } catch (error) {
    loadingPopup.close();
    alert('Error finding stations. Please try again.');
    console.error('Error:', error);
  }
}

function showStationSelectionPopup(stations) {
  const popupContent = document.createElement('div');
  popupContent.style.padding = '10px';
  popupContent.style.minWidth = '250px';
  
  const title = document.createElement('h3');
  title.textContent = 'Nearest Stations (Top 3)';
  title.style.marginTop = '0';
  title.style.color = '#4285F4';
  popupContent.appendChild(title);
  
  const list = document.createElement('ul');
  list.style.paddingLeft = '0';
  list.style.listStyleType = 'none';
  
  stations.forEach((station, index) => {
    const item = document.createElement('li');
    item.style.margin = '10px 0';
    item.style.padding = '8px';
    item.style.borderRadius = '4px';
    item.style.backgroundColor = '#f5f5f5';
    item.style.cursor = 'pointer';
    item.style.transition = 'background-color 0.2s';
    
    const name = document.createElement('div');
    name.textContent = `${index + 1}. ${station.name}`;
    name.style.fontWeight = 'bold';
    name.style.marginBottom = '4px';
    
    const distance = document.createElement('div');
    distance.textContent = `Distance: ${(station.distance / 1000).toFixed(2)} km`;
    distance.style.color = '#666';
    
    item.appendChild(name);
    item.appendChild(distance);
    
    item.addEventListener('click', () => {
      selectStation(station);
      popup.close();
    });
    
    item.addEventListener('mouseover', () => {
      item.style.backgroundColor = '#e0e0e0';
    });
    
    item.addEventListener('mouseout', () => {
      item.style.backgroundColor = '#f5f5f5';
    });
    
    list.appendChild(item);
  });
  
  const note = document.createElement('div');
  note.textContent = 'Other stations shown with blue markers';
  note.style.marginTop = '10px';
  note.style.fontSize = '0.8em';
  note.style.color = '#666';
  
  popupContent.appendChild(list);
  popupContent.appendChild(note);
  
  const popup = new google.maps.InfoWindow({
    content: popupContent,
    position: lastValidPosition
  });
  
  popup.open(map);
}

function selectStation(station) {
  // Reset all markers to default color
  evMarkers.forEach(m => {
    const isSelected = m.getPosition().lat() === station.lat && 
                      m.getPosition().lng() === station.lng;
    m.setIcon({
      url: isSelected 
        ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        : (m.getIcon().url.includes('green') 
           ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
           : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png')
    });
    
    // Update label color for selected station
    if (isSelected) {
      m.setLabel({
        ...m.getLabel(),
        color: "#EA4335",
        fontWeight: "bold"
      });
    } else {
      m.setLabel({
        ...m.getLabel(),
        color: "#EA4335",
        fontWeight: "bold"
      });
    }
  });
  
  selectedStation = new google.maps.LatLng(station.lat, station.lng);
  calculateAndDisplayRoute(lastValidPosition, selectedStation);
}

function calculateAndDisplayRoute(start, end) {
  const request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING',
    provideRouteAlternatives: false
  };

  directionsService.route(request, (response, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(response);
      isShowingDirections = true;
      currentStep = 0;
      
      // Show navigation controls
      window.navControlDiv.style.display = 'block';
      showStep(currentStep);
      
      // Show route summary
      const route = response.routes[0];
      const distance = route.legs[0].distance.text;
      const duration = route.legs[0].duration.text;
      
      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>Route Info</strong><br>Distance: ${distance}<br>Duration: ${duration}</div>`,
        position: route.legs[0].steps[Math.floor(route.legs[0].steps.length/2)].start_location
      });
      
      infoWindow.open(map);
      setTimeout(() => infoWindow.close(), 5000);
    } else {
      alert('Could not calculate route: ' + status);
    }
  });
}

function showStep(index) {
  const directionsData = directionsRenderer.getDirections();
  if (!directionsData || !directionsData.routes[0]) return;

  const steps = directionsData.routes[0].legs[0].steps;
  if (index >= 0 && index < steps.length) {
    const step = steps[index];
    
    stepDisplay.setContent(`<div class="step-instruction">${index + 1}. ${step.instructions}</div>`);
    stepDisplay.setPosition(step.start_location);
    stepDisplay.open(map);
    
    map.panTo(step.start_location);
  }
}

function clearDirections() {
  directionsRenderer.setDirections({routes: []});
  isShowingDirections = false;
  selectedStation = null;
  stepDisplay.close();
  window.navControlDiv.style.display = 'none';
  
  // Reset marker colors but keep them on map
  evMarkers.forEach(m => {
    m.setIcon({
      url: m.getIcon().url.includes('green') 
        ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    m.setLabel({
      ...m.getLabel(),
      color: "#EA4335",
      fontWeight: "bold"
    });
  });
}

function clearEVMarkers() {
  evMarkers.forEach(marker => marker.setMap(null));
  evMarkers = [];
  selectedStation = null;
}

function startSimulatedUpdates() {
  setInterval(() => {
    const position = simulatedPositions[currentSimulatedIndex];
    currentSimulatedIndex = (currentSimulatedIndex + 1) % simulatedPositions.length;
    
    const now = Date.now();
    const rawPos = new google.maps.LatLng(position.lat, position.lng);
    
    const filteredLat = latFilter.update(position.lat);
    const filteredLng = lngFilter.update(position.lng);
    const filteredPos = new google.maps.LatLng(filteredLat, filteredLng);

    if (shouldUpdatePosition(filteredPos, now)) {
      updatePosition(filteredPos, now);
    }
  }, 2000);
}

function shouldUpdatePosition(newPos, currentTime) {
  if (!lastValidPosition) return true;
  
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    lastValidPosition,
    newPos
  );

  if (distance > MOVEMENT_THRESHOLD) {
    stationaryMode = false;
    return true;
  }

  if (distance < STABILITY_THRESHOLD) {
    if (!stationaryMode) {
      stationaryMode = true;
      return true;
    }
    return (currentTime - lastUpdateTime) > TIME_THRESHOLD;
  }

  return true;
}

function updatePosition(newPos, timestamp) {
  marker.setPosition(newPos);
  
  if (lastValidPosition) {
    const heading = google.maps.geometry.spherical.computeHeading(
      lastValidPosition,
      newPos
    );
    marker.setIcon({
      ...marker.getIcon(),
      rotation: heading
    });
  }

  if (autoCenterEnabled && !isShowingDirections) {
    map.setCenter(newPos);
    map.setZoom(AUTO_CENTER_ZOOM);
  }

  if (!isShowingDirections) {
    if (pathCoordinates.length === 0 || 
        google.maps.geometry.spherical.computeDistanceBetween(
          pathCoordinates[pathCoordinates.length-1], 
          newPos
        ) > MOVEMENT_THRESHOLD) {
      pathCoordinates.push(newPos);
      if (pathCoordinates.length > MAX_POINTS) {
        pathCoordinates.shift();
      }
      polyline.setPath(pathCoordinates);
    }
  }

  lastValidPosition = newPos;
  lastUpdateTime = timestamp;
}

// Initialize the application
window.onload = initMap;
window.removeWarning = removeWarning;