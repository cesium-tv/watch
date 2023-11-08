const fs = require("fs");
const { exec, spawn } = require('child_process');
const package = require('../package.json');

const METADATA = {
    "id": "tv.cesium.watch",
    "version": package.version,
    "vendor": "Ben Timby <btimby@gmail.com>",
    "type": "web",
    "main": "index.html",
    "title": "Cesium TV",
    "icon": "icon.png",
    "largeIcon": "icon_large.png",
    "splashBackground": "splash.jpg",
    "iconColor": "252a33",
    "disableBackHistoryAPI": true
};

const INDEX = `<html lang=en>
    <head>
        <meta http-equiv="refresh" content="0;url={{ BASE_URL }}">
    </head>
</html>
`;

function copy(args) {
    const command = `cp ${args}`;
    console.debug(command);

    const promise = new Promise((resolve, reject) => {
        let error = null;
        const cp = exec(command);

        cp.stdout.on('data', chunk => {
            console.log(chunk.toString());
        });

        cp.stderr.on('data', chunk => {
            console.error(chunk.toString());
        });

        cp.on('error', e => error = e);

        cp.on('close', (code) => {
            if (error) {
                reject(error);
            } else if (code !== 0) {
                reject(new Error(`Exit code: ${code}`));
            } else {
                resolve();
            }
        });
    });

    return promise;
}

async function copyApp() {
    console.log('Copying app');

    await copy('../dist/vite/index.html app/');
    await copy('-r ../dist/vite/assets app/');
}

async function copyAssets() {
    console.log('Copying assets');

    await copy('-fR assets/* app/');
}

function writeIndex(baseUrl = 'http://watch.cesium.tv:8008/') {
    console.log('Writing index.html');

    const promise = new Promise((resolve, reject) => {
        const stream = fs.createWriteStream('app/index.html');
        const index = INDEX.replace('{{ BASE_URL }}', baseUrl)

        stream.write(index, (e) => {
            if (e) {
                reject(e);
                return;
            }
            stream.close();
            resolve();
        });    
    });

    return promise;
}

function writeMetadata() {
    console.log('Writing appinfo.json');

    const promise = new Promise((resolve, reject) => {
        const stream = fs.createWriteStream('app/appinfo.json');

        stream.write(JSON.stringify(METADATA, null, 4), (e) => {
            if (e) {
                reject(e);
                return;
            }
            stream.close();
            resolve()
        });    
    });

    return promise;
}

function build(name) {
    console.log('Building ipk');

    const promise = new Promise((resolve, reject) => {
        let error = null;
        const aresPackage = spawn('ares-package', ['app', '-n', '-o', 'dist/']);

        aresPackage.stdout.on('data', chunk => {
            console.log(chunk.toString());
        });

        aresPackage.stderr.on('data', chunk => {
            console.error(chunk.toString());
        });

        aresPackage.on('error', e => error = e);

        aresPackage.on('close', code => {
            if (error) {
                reject(error);
                return;
            } else {
                fs.rename('dist/tv.cesium.watch_0.0.0_all.ipk', name, resolve);
            }
        });
    });

    return promise;
}

function cleanup() {
    console.log('Cleaning up');

    const promise = new Promise((resolve, reject) => {
        let error = null;
        const aresPackage = spawn('rm', ['-rf', 'app']);

        aresPackage.stdout.on('data', chunk => {
            console.log(chunk.toString());
        });

        aresPackage.stderr.on('data', chunk => {
            console.error(chunk.toString());
        });

        aresPackage.on('error', e => error = e);

        aresPackage.on('close', code => {
            if (error) {
                reject(error);
                return;
            } else {
                resolve();
            }
        });
    });

    return promise;
}

(async () => {
    console.log('Working directory:', process.cwd());

    console.log('Creating app directory');
    fs.mkdirSync('app', { recursive: true });

    console.log('Building hosted app');
    await copyAssets();
    await writeIndex();
    await writeMetadata();
    await build('dist/tv.cesium.watch_0.0.0_hosted.ipk');

    console.log('Building bundled app');
    await copyApp();
    await build('dist/tv.cesium.watch_0.0.0_bundle.ipk');

    cleanup();
})();
