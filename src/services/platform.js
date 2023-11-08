// Platform dependent items
import { Capacitor } from '@capacitor/core';

const OS_TYPES = [
    { name: "Android", value: "Android" },
    { name: "iPhone", value: "iPhone" },
    { name: "iPad", value: "Mac" },
    { name: "Macintosh", value: "Mac" },
    { name: "Linux", value: "Linux" },
    { name: "Windows", value: "Win" },
];

function detectOS() {
    let userDetails = navigator.userAgent;

    for (let i in OS_TYPES) {
        if (userDetails.includes(OS_TYPES[i].name)) {
            return OS_TYPES[i].value;
        }
    }
}

const clientOS = detectOS();
const platform = Capacitor.getPlatform();

export {
    clientOS,
    platform,
};
