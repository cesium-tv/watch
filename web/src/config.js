const API_URL = 'http://cesium.tv:8000/api/v1/';
const CLIENT_ID = '19bbc55f-0f6f-4fca-95bc-f86286db43da';
const CLIENT_SECRET = '50ec237f-20b0-4a47-8a25-b329f6d53beb';

const KEYCODE = {
  BACK: 461,
  ESC: 27,
  PLAY: 179,
  PLAY_TV: 415,  // NOTE: different on TV vs. emu.
  PAUSE: 19,
  FFD: 228,
  RWD: 227,
  STOP: 169,
  STOP_TV: 413,  // NOTE: different on TV vs. emu.
  CHANUP: 33,
  CHANDN: 34,
  RIGHT: 39,
  LEFT: 37,
  SPACE: 32,
  ENTER: 13,
};

const STATUS = {
  LOADING: 0,
  PLAYING: 1,
  PAUSED: 2,
  STOPPED: 3,
  SEEKING: 4,
  RESUME: 5,
};

export {
  API_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  KEYCODE,
  STATUS,
};
