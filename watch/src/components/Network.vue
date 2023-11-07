<template>
    <div
        class="network"
        :style="{ display: (visible) ? 'block' : 'none' }"
    >
        <div
            v-if="isDown"
            height="800px"
            width="800px"
        >
            <ion-icon
                :icon="alertCircleOutline"
                size="large"
                color="warning"
            ></ion-icon>
            <p>Network Error</p>
        </div>
        <svg
            v-else-if="isBusy"
            class="spinner"
            viewBox="0 0 50 50"
        >
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
    </div>
</template>

<script>
import { alertCircleOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import { mapGetters } from 'vuex';

export default {
    name: "Network",

    components: {
        IonIcon,
    },

    data() {
        return {
            alertCircleOutline,
        };
    },

    computed: {
        ...mapGetters({
            isBusy: 'network/isBusy',
            isDown: 'network/isDown',
        }),

        visible() {
            return this.isBusy || this.isDown;
        },
    },
}
</script>

<style lang="scss" scoped>
network {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    opacity: 0.8;
    z-index: 100;
}

.spinner {
    animation: rotate 2s linear infinite;
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    width: 50px;
    height: 50px;
  
    & .path {
        stroke: hsl(210, 70, 75);
        stroke-linecap: round;
        animation: dash 1.5s ease-in-out infinite;
    }  
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
}
</style>
