const LGTV2 = require('lgtv2');
const localDevicesSearch = require('local-devices');

const CONTENT_STORE = require('./content');

const YOUTUBE_IDENTIFIER = 'youtube.leanback.v4';
let lgtv;

function ensureYouTubeInstallation() {
  return new Promise((resolve, reject) => {
    lgtv.request('ssap://com.webos.applicationManager/listLaunchPoints', (err, resp) => {
      const launchPoints = resp.launchPoints;
      const youtubeFoundOnTV = launchPoints.find((lp) => lp.id === YOUTUBE_IDENTIFIER);

      if (!youtubeFoundOnTV) {
        return reject(new Error('YouTube app is not installed on TV'));
      }

      return resolve();
    });
  });
}

function ensureConnectionToTV() {
  const POLL_INTERVAL = 3;
  const MAX_RETRIES = 5; // 5*3 = 15 seconds max wait
  let connectionMade = false;

  return new Promise((resolve, reject) => {
    let currentNumOfTries = 0;

    lgtv.on('connect', () => { connectionMade = true; });

    // eslint-disable-next-line consistent-return
    const performConnectionCheck = () => {
      if (connectionMade) {
        return resolve();
      }

      if (currentNumOfTries === MAX_RETRIES) {
        return reject(new Error(`Connection to TV could not be established after ${MAX_RETRIES * POLL_INTERVAL} seconds`));
      }

      currentNumOfTries++;

      setTimeout(performConnectionCheck, POLL_INTERVAL * 1000);
    };

    // start polling
    performConnectionCheck();
  });
}

function getDeviceIpAddressFromMacAddress(deviceMacAddress) {
  return Promise.resolve()
    .then(localDevicesSearch)
    .then((devices) => devices.find((device) => device.mac === deviceMacAddress))
    .then((deviceFound) => {
      if (!deviceFound) {
        throw new Error(`TV with mac '${deviceMacAddress}' not found on network!`);
      }

      return deviceFound.ip;
    });
}

function initialize(params) {
  const { deviceMacAddress } = params;

  return Promise.resolve()
    .then(() => getDeviceIpAddressFromMacAddress(deviceMacAddress))
    .then((deviceIPAddress) => {
      lgtv = LGTV2({ url: `ws://${deviceIPAddress}:3000` });
      return ensureConnectionToTV();
    })
    .then(() => ensureYouTubeInstallation());
}

function execute(params) {
  const mode = params.mode || Object.keys(CONTENT_STORE)[0];
  const content = CONTENT_STORE[mode]; // eslint-disable-line security/detect-object-injection
  const contentId = content[Math.floor(Math.random() * content.length)];

  return Promise.resolve()
    .then(() => {
      lgtv.request('ssap://system.launcher/launch', { id: YOUTUBE_IDENTIFIER, contentId }, (err) => {
        if (err) {
          throw err;
        }
      });
    });
}

module.exports = { initialize, execute };
