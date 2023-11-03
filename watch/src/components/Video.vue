<template>
    <ion-card
        class="ak-selectable"
        :data-nav-up="navUp"
        :data-nav-down="navDown"
        :data-nav-right="navRight"
        :data-nav-left="navRight"
    >
        <a
            href="#"
            @click="play(data)"
        >
            <img
                class="poster"
                :src="data.poster"
                :alt="data.title"
            >
        </a>

        <ion-card-header>
            <ion-card-title>{{ data.title }}</ion-card-title>
            <ion-card-subtitle>{{ channels[data.channels[0]].name }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>{{ data.description }}</ion-card-content>
    </ion-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

export default {
    name: 'Video',

    components: {
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
    },

    props: {
        data: {
            type: Object,
            default: null,
        },
        navUp: {
            type: String,
            default: null,
        },
        navDown: {
            type: String,
            default: null,
        },
        navLeft: {
            type: String,
            default: null,
        },
        navRight: {
            type: String,
            default: null,
        },
    },

    computed: {
        ...mapGetters({
            channels: 'videos/channels',
        }),
    },

    methods: {
        ...mapActions({
            play: 'player/play',
        }),
    }
};
</script>

<style scoped>
.poster {
    width: 300px !important;
    height: 200px;
}

ion-card {
    min-width: 320px;
    max-width: 320px;
}

.ak-selected {
    background-color: lightblue;
}
</style>
