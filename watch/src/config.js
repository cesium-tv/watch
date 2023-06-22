const API_URL = 'http://cesium.tv:8000/api/v1/';
const CLIENT_ID = '19bbc55f-0f6f-4fca-95bc-f86286db43da';
const CLIENT_SECRET = '50ec237f-20b0-4a47-8a25-b329f6d53beb';

const KEYCODES = {
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

const KEYBOARD_LAYOUT = {
  // Letters
/*  0: [
    '!@QWERTYUIOP\\⌫⌦',
    ' ⇭ASDFGHJKL:\'"',
    '⇪ZXCVBNM,./?←→',
    '    ␣⌧',
  ],
  // Numbers
  1: [
    '!@#$%^&*()-_=+⌫',
    ' ⇭0123456789',
  ],*/
  0: [
    'ABCDEFG',
    'HIJKLMN',
    'OPQRSTU',
    'VWXYZ-\'',
    '␣⌧⇭⌫',
  ],
  1: [
    '123~!@#',
    '456$%^&',
    '789*()_',
    '0+=-`?,',
    '␣⌧⇭⌫',
  ]
};

const LABEL_MAP = {
  '⇪': 'caps',
  '⇭': 'num',
  '␣': 'space',
  '⌧': 'clear',
//  '⌫': '<<',
};
const CODE_MAP = {
  '␣': ' ',
};

const KEY_WIDTH = 40;
const KEY_MARGIN = 0;

const SENTRY_DSN = "http://466bcf0d1721484aac3610d3df695041@cesium.tv:9000/3";

export {
  API_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  KEYCODES,
  STATUS,
  KEYBOARD_LAYOUT,
  LABEL_MAP,
  CODE_MAP,
  KEY_WIDTH,
  KEY_MARGIN,
  SENTRY_DSN,
};
