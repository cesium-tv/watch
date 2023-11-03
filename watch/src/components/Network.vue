<template>
    <div
        class="network"
        :style="{ display: (visible) ? 'block' : 'none' }"
    >
        <svg
            v-if="isDown"
            height="800px"
            width="800px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            viewBox="0 0 490.001 490.001" xml:space="preserve"
        >
            <g>
                <g>
                    <path style="fill:#E64C3D;" d="M343.6,159.9c0,9.4-7.6,16.9-16.9,16.9H163.3c-9.4,0-16.9-7.6-16.9-16.9V42.6
                        c0-9.4,7.6-16.9,16.9-16.9h163.4c9.4,0,16.9,7.6,16.9,16.9V159.9z"/>
                    <path style="fill:#2C2F33;" d="M326.7,185.9c14.3,0,26-11.7,26-26V42.6c0-14.3-11.7-26-26-26H163.3c-14.3,0-26,11.7-26,26v117.3
                        c0,14.3,11.7,26,26,26h72.6v24.2h-23.8c-5,0-9.1,4.1-9.1,9.1s4.1,9.1,9.1,9.1h65.7c5,0,9.1-4.1,9.1-9.1s-4.1-9.1-9.1-9.1H254
                        v-24.2H326.7z M155.4,159.9V42.6c0-4.3,3.5-7.9,7.9-7.9h163.4c4.3,0,7.9,3.5,7.9,7.9v117.3c0,4.3-3.5,7.9-7.9,7.9H163.3
                        C159,167.8,155.4,164.3,155.4,159.9z"/>
                    <path style="fill:#94A4A4;" d="M206.3,405.1c0,9.4-7.6,16.9-16.9,16.9H26c-9.4,0-16.9-7.6-16.9-16.9V287.8
                        c0-9.4,7.6-16.9,16.9-16.9h163.4c9.4,0,16.9,7.6,16.9,16.9L206.3,405.1L206.3,405.1z"/>
                    <path style="fill:#94A4A4;" d="M481,405.1c0,9.4-7.6,16.9-16.9,16.9H300.7c-9.4,0-16.9-7.6-16.9-16.9V287.8
                        c0-9.4,7.6-16.9,16.9-16.9H464c9.4,0,16.9,7.6,16.9,16.9v117.3L481,405.1L481,405.1z"/>
                    <path style="fill:#2C2F33;" d="M189.3,261.7H26c-14.3,0-26,11.7-26,26V405c0,14.3,11.7,26,26,26h72.6v24.2H74.8
                        c-5,0-9.1,4.1-9.1,9.1s4.1,9.1,9.1,9.1h65.7c5,0,9.1-4.1,9.1-9.1s-4.1-9.1-9.1-9.1h-23.8V431h72.6c14.3,0,26-11.7,26-26V287.8
                        C215.3,273.4,203.7,261.7,189.3,261.7z M197.2,405.1c0,4.3-3.5,7.9-7.9,7.9H26c-4.3,0-7.9-3.5-7.9-7.9V287.8
                        c0-4.3,3.5-7.9,7.9-7.9h163.4c4.3,0,7.9,3.5,7.9,7.9v117.3L197.2,405.1L197.2,405.1z"/>
                    <path style="fill:#2C2F33;" d="M464,261.7H300.7c-14.3,0-26,11.7-26,26V405c0,14.3,11.7,26,26,26h72.6v24.2h-23.8
                        c-5,0-9.1,4.1-9.1,9.1s4.1,9.1,9.1,9.1h65.7c5,0,9.1-4.1,9.1-9.1s-4.1-9.1-9.1-9.1h-23.8V431H464c14.3,0,26-11.7,26-26V287.8
                        C490.1,273.4,478.4,261.7,464,261.7z M471.9,405.1c0,4.3-3.5,7.9-7.9,7.9H300.7c-4.3,0-7.9-3.5-7.9-7.9V287.8
                        c0-4.3,3.5-7.9,7.9-7.9H464c4.3,0,7.9,3.5,7.9,7.9V405.1z"/>
                    <path style="fill:#2C2F33;" d="M36.8,228.2c5,0,9.1-4.1,9.1-9.1V94.6h54.4c5,0,9.1-4.1,9.1-9.1s-4.1-9.1-9.1-9.1H36.8
                        c-5,0-9.1,4.1-9.1,9.1v133.7C27.7,224.2,31.8,228.2,36.8,228.2z"/>
                    <path style="fill:#2C2F33;" d="M453.2,228.2c5,0,9.1-4.1,9.1-9.1V85.5c0-5-4.1-9.1-9.1-9.1h-63.5c-5,0-9.1,4.1-9.1,9.1
                        s4.1,9.1,9.1,9.1h54.4v124.6C444.2,224.2,448.2,228.2,453.2,228.2z"/>
                </g>
            </g>
        </svg>
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
import { mapGetters } from 'vuex';

export default {
    name: "Network",

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
    width: 100%;
    height: 100%;
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
