const url = 'https://api.ipify.org?format=json';

const request = require('request');
const fetchMyIP = function(callback) {
  request(url, (error, response, body) =>{
    if (error) {
      callback(error, null);
      return;
      
    } if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;

    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};
const fetchCoordsByIP = function(ip, callback) {
  request("http://ip-api.com/json/" + ip, (error, response, body)=> {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }
    
    const latitude = JSON.parse(body).lat;
    
    const longitude = JSON.parse(body).lon;
    
    callback(null,{latitude,longitude});

  });
};
const fetchISSFlyOverTimes = function(ob, callback) {
  const lat = ob['latitude'];
  const long = ob['longitude'];
  const par = `lat=${lat}&lon=${long}`;
 
  request("http://api.open-notify.org/iss-pass.json?" + par ,(error, response, body) =>{
    if (error) {
      callback(error,null);
      return;
    } if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching passtimes: ${body}`),null);
      return;
    }
      
   
    const duration = JSON.parse(body)['response'];
    return callback(null,duration);
    
  });
};
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip,(error, coor) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coor, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, nextPasses);
      });
    });
  }); 
};

module.exports = { fetchMyIP, fetchCoordsByIP, nextISSTimesForMyLocation, fetchISSFlyOverTimes};