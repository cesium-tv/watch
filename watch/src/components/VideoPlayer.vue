<template>
    <div
        :id="playerOptions.playerId"
        ref="videoPlayer"
        :style="{ display: (visible) ? 'block' : 'none'}"
    ></div>
</template>

<script>
import { CapacitorVideoPlayer } from 'capacitor-video-player';
import { mapGetters, mapActions } from 'vuex';
import { platform } from '@/services/platform.js';

const CAP_VIDEO_PLAYER_ID = 'fullscreen';
const CAP_VIDEO_TIME_INTERVAL = 3000;

async function callVideoPlayer(methodName, options) {
    console.debug('callVideoPlayer:', methodName, options);
    const r = await CapacitorVideoPlayer[methodName](options);

    if (!r.result) {
        console.error(r);
        throw new Error(r.message);
    }

    return r;
}

export default {
    name: 'VideoPlayer',

    data() {
        return {
            isPlaying: false,
            currentTime: 0,
        };
    },

    mounted() {
        CapacitorVideoPlayer.addListener(
            'jeepCapVideoPlayerEnded', this.onPlayerEnd
        );
        CapacitorVideoPlayer.addListener(
            'jeepCapVideoPlayerPlay', this.onPlayerPlay
        );
        CapacitorVideoPlayer.addListener(
            'jeepCapVideoPlayerExit', this.onPlayerExit
        );
    },

    unmounted() {
        CapacitorVideoPlayer.removeListeners();
    },

    computed: {
        ...mapGetters({
            data: 'player/playing',
        }),

        visible() {
            return Boolean(this.data);
        },

        playerOptions() {
            const playerMode = (platform !== 'electron') ? 'fullscreen' : 'embedded';

            return {
                mode: playerMode,
                displayMode: 'all',
                playerId: CAP_VIDEO_PLAYER_ID,
                componentTag: 'div',
                chromecast: false,
                width: '100%',
                height: '100%',
            }
        },
    },

    watch: {
        data() {
            // start the video
            if (!this.data) {
                this.close();
            } else {
                this.start();
            }
        },

        currentTime(value) {
            this.updateCursor(this.data, value);
        },
    },

    methods: {
        ...mapActions({
            next: 'player/next',
            stop: 'player/stop',
            updateCursor: 'videos/updateCursor',
        }),

        async close() {
            try {
                await callVideoPlayer('stopAllPlayers');
                // NOTE: This apparently does nothing
                await callVideoPlayer('exitPlayer', { playerId: this.playerOptions.playerId });

            } catch (e) {
                console.error('Error closing player, cleaning up');
                console.error(e);
            }

            this.$refs.videoPlayer.innerHTML = '';
            window.removeEventListener('resize', this.onFullScreenChanged);
            window.removeEventListener('keyup', this.onKeyup);

            this.stop();
        },

        async start() {
            const sources = this.data.sources;
            const dimensions = Object.keys(sources).sort();
            const source = sources[dimensions[0]];

            const options = {
                ...this.playerOptions,
                url: source.url,
                title: this.data.title,
            };

            try {
                await callVideoPlayer('initPlayer', options);

            } catch (e) {
                console.error('Error attempting to initialize player');
                consold.error(e);
                return;
            }

            if (platform === 'android') {
                document.addEventListener('ionBackButton', this.onBackButton, { once: true });
            } else {
                window.addEventListener(
                    'resize', this.onFullScreenChanged
                );
                window.addEventListener(
                    'keyup', this.onKeyup,
                );
            }

            await this.resume();
        },

        async pause() {
            try {
                await callVideoPlayer('pause', { playerId: this.playerOptions.playerId });

            } catch (e) {
                console.error('Error attempting to pause video');
                console.error(e);
            }
         },

        async resume() {
            try {
                await callVideoPlayer('play', { playerId: this.playerOptions.playerId });

            } catch (e) {
                console.error('Error attempting to resume video');
                console.error(e);
            }
        },

        onPlayerEnd() {
            this.next();
        },

        onPlayerPlay() {
            console.debug('Starting playback monitor');
            const h = setInterval(async () => {
                let r;

                r = await callVideoPlayer('isPlaying', { playerId: this.playerOptions.playerId });
                this.isPlaying = r.value;

                if (!this.isPlaying) {
                    console.debug('Stopping playback monitor')
                    clearInterval(h);
                    return;
                }

                r = await callVideoPlayer('getCurrentTime', { playerId: this.playerOptions.playerId });
                this.currentTime = r.value;
            }, CAP_VIDEO_TIME_INTERVAL);
        },

        onPlayerExit() {
            console.debug('Player exited...');
            this.close()
                .then(() => {
                    console.debug('Player exited, closed');
                })
                .catch(e => console.error);
        },

        onFullScreenChanged() {
            const isInFullScreen =
                (document.fullscreenElement && document.fullscreenElement !== null) ||
                (document.webkitFullscreenElement &&
                    document.webkitFullscreenElement !== null) ||
                (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
                (document.msFullscreenElement && document.msFullscreenElement !== null);
            if (!isInFullScreen) {
                // Exiting Fullscreen mode
                console.debug('Exited fullscreen');
                this.close()
                    .then(() => {
                        console.debug('Exited fullscreen, stopped video');
                    })
                    .catch(e => console.error);
            } else {
                console.debug('Entering fullscreen mode');
            }
        },

        onBackButton() {
            console.debug('Back button pressed');
            this.close()
                .then(() => {
                    console.debug('Back button pressed, stopped video');
                })
                .catch(e => console.error);
        },

        onKeyup(event) {
            if (event.code === 'Escape') {
                this.close();
            }
        },
    },
};
</script>

<style>
#fullscreen {
    position: absolute;
    z-index: 1000;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
}

#fullscreen > div, #fullscreen > div > div {
    width: 100%;
    height: 100%;
}

video {
    width: 100%;
    height: 100%;
}
</style>