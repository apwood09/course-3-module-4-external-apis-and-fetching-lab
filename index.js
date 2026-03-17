// index.js 
const fetchButton = document.getElementById('fetch-alerts'); 
const stateInput = document.getElementById('state-input');
const alertsDisplay = document.getElementById('alerts-display'); 
const errorMessage = document.getElementById('error-message');

// fetch function
async function fetchWeatherAlerts(state) {
  // clear previous data
  alertsDisplay.innerHTML = '';
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');

  if (!state) {
    // display error message in div for empty input 
    errorMessage.textContent = 'Please enter a state abbreviation.';
    errorMessage.classList.remove('hidden');
    return;

  }

  const url = `https://api.weather.gov/alerts/active?area=${state.toUpperCase()}`;

try {
  // GET request
  const response = await fetch(url);                

    // check request was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Parse JSON
    const data = await response.json();
    
    // log data
    console.log(`Alerts for ${state.toUpperCase()}:`, data);

    displayAlerts(data);

  } catch (error) {
    // handle errors
    console.error('Fetch error:', error);
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
  }
}

// event listener: button
fetchButton.addEventListener('click', () => {
  const state = stateInput.value.trim();
  fetchWeatherAlerts(state);
});

// display the error message
function displayError(message) {
  const errorMessageDiv = document.getElementById('error-message');
  // Set the text content and make it visible
  errorMessageDiv.textContent = `Error: ${message}`;
  errorMessageDiv.style.display = 'block'; 
}

// clear and hide the error message div
function clearError() {
  const errorMessageDiv = document.getElementById('error-message');
  // Clear the text content and hide the element
  errorMessageDiv.textContent = '';
  errorMessageDiv.style.display = 'none'; 
}

// display alerts 
function displayAlerts(data) {
    clearError(); 
  // container element 
  const alertsDisplay = document.getElementById('alerts-display');
  const stateInput = document.getElementById('state-input');

  alertsDisplay.innerHTML = ''; //  clear previous alerts

  // check features (alerts)
  if (!data.features || data.features.length === 0) {
    alertsDisplay.innerHTML = '<p>No active alerts.</p>';
    stateInput.value = ''; 
    return;
  }

  // summary message
  const summary = document.createElement('h3');
  summary.textContent = `Weather Alerts: ${data.features.length} for ${stateInput.value.toUpperCase()}`
  alertsDisplay.appendChild(summary);

  // list of headlines
  const list = document.createElement('ul');
  
  // iterate through features array
  data.features.forEach(alert => {
    const listItem = document.createElement('li');
    // Extract headline from properties.headline
    listItem.textContent = alert.properties.headline;
    list.appendChild(listItem);
  });

  alertsDisplay.appendChild(list);
  stateInput.value = '';
}