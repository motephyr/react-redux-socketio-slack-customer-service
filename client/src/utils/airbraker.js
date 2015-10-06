import AirbrakeClient from "airbrake-js"

const apiKey = "58cf357d63903fd497476c497a083197";
const host = "https://whispering-taiga-3412.herokuapp.com";

var airbrake = new AirbrakeClient({
  projectId: apiKey, 
  projectKey: apiKey,
});

var env = 'development';

if (document.location.host === 'solda.io') {
  env = 'production';
} else if (document.location.host === 'alpha.solda.io') {
  env = 'alpha';
}

airbrake.setHost(host);
airbrake.setEnvironmentName(env)

exports.captureException = function(app) {
   return airbrake.wrap(app);
}
