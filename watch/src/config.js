import { platform } from '@/services/platform';


let API_URL;

if (platform !== 'android') {
    API_URL = 'http://cesium.tv:8000/api/v1/';
} else {
    // Android Emulator "localhost"
    API_URL = 'http://10.0.2.2:8000/api/v1/';
}

const DATA_REFRESH_INTERVAL = 3000;
const VIDEO_LIST_IF_LT = 1024;
const VIDEO_LIST_COL_WIDTH = 320;
const VIDEO_FETCH_LIMIT = 100;

export {
    API_URL,
    DATA_REFRESH_INTERVAL,
    VIDEO_LIST_IF_LT,
    VIDEO_LIST_COL_WIDTH,
    VIDEO_FETCH_LIMIT,
};
