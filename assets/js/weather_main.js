import * as Storage_Ctrl from './weather_storage.js';
import * as UI_Ctrl from './weather_ui.js';
import * as Weather_Ctrl from './weather_weather.js';

const WeatherUnderground = (() => {
  // document load
  document.addEventListener('DOMContentLoaded', (event) => {
    // setup the modal so it will dispaly
    let xModal = document.querySelector('.modal');
    let xModalInstances = M.Modal.init(xModal);
  });

  let location = '';

  // load event listeners
  const loadEventListeners = () => {
    // set location when user clicks 'save changes' button
    document.querySelector('#setLocation').addEventListener('click', updateLocation);

    // clear fields for city/state when user opens the modal
    document.querySelector('.modal-trigger').addEventListener('click', () => {
      // clear fields
      document.querySelector('#city').value = '';
      document.querySelector('#state').value = '';
    });
  }

  const updateLocation = (event) => {
    event.preventDefault();

    let setCity = document.querySelector('#city').value;
    let setState = document.querySelector('#state').value;

    // validation checking, make sure fields are not empty
    if (setCity !== '' && setState !== '') {
      // update local storage
      Storage_Ctrl.Storage.setLocationData(setCity, setState);

      // get location data
      location = Storage_Ctrl.Storage.getLocationData();

      // get weather information
      getWeather(location.city, location.state);

      // close modal
      let elems = document.querySelector('.modal');
      let instances = M.Modal.getInstance(elems);
      instances.close();
    } else {
      // no values supplied
      M.toast({html: 'Please Supply a City and State.', classes: 'rounded'});

      // clear fields
      UI_Ctrl.UI.clearLocationFields();
    }
  };

  const getWeather = (city, state) => {
    // jQuery(document).ready(function($) {
    //   $.ajax({
    //   url : "http://api.wunderground.com/api/5a1b209e966659bb/geolookup/conditions/q/IA/Cedar_Rapids.json",
    //   dataType : "jsonp",
    //   success : function(parsed_json) {
    //   var location = parsed_json['location']['city'];
    //   var temp_f = parsed_json['current_observation']['temp_f'];
    //   alert("Current temperature in " + location + " is: " + temp_f);
    //   }
    //   });
    // });
    const weather = Weather_Ctrl.Weather.getWeather(location.city, location.state)
      .then((response) => {
        if (response !== undefined) {
          // valid data returned

          // paint the ui with returned data
          UI_Ctrl.UI.paint(response);

          // show/hide valid data ui elements
          UI_Ctrl.UI.validDataReturn();
        } else {
          // invalid data returned
          M.toast({html: 'Invalid data returned from Weather Underground. Please set City & State location.', classes: 'rounded'});
          
          // show/hide invalid data ui elements
          UI_Ctrl.UI.invalidDataReturn();
        }
      })
      .catch((error) => { 
        console.log(error); 
      });
  }

  // public methods
  return {
    init: () => {
      // get location data
      location = Storage_Ctrl.Storage.getLocationData();

      // get weather information
      getWeather(location.city, location.state);

      // load event listeners
      loadEventListeners();
    }
  }
})();

WeatherUnderground.init();