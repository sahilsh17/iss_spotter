const request = require('request-promise-native');

const fetchMYIP = function() {
  return request('https://api.ipify.org?format=json');

};
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request("http://ip-api.com/json/" + ip);
   
};

const fetchISSFlyOverTimes = function(body) {
  const latitude = JSON.parse(body).lat;
  const longitude = JSON.parse(body).lon;

  const url = request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`);
  return request(url);
};

const nextISSTimesForMyLocation = function() {
  return fetchMYIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(data => {
      const duration = JSON.parse(data)['response'];
      return duration;
    });
};
module.exports = {nextISSTimesForMyLocation};