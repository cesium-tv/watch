<template>
    <ion-card
        size="full"
        class="ek-selectable"
        :data-nav-up="navUp"
        :data-nav-down="navDown"
        :data-nav-right="navRight"
        :data-nav-left="navRight"
    >
        <a
            href="#"
            @click="play(item)"
        >
            <img
                class="poster"
                v-lazy="item.poster"
                :alt="item.title"
            >
        </a>

        <div>
            <ion-card-header>
                <ion-card-title class="title" color="primary">
                    {{ item.title }}
                </ion-card-title>
                <ion-card-subtitle color="primary">{{ item.channel.name }}</ion-card-subtitle>
            </ion-card-header>
        </div>

        <ion-card-content class="content">
            <ion-text color="medium">
                <p class="duration">{{ duration }}</p>
                <p class="published">{{ published }}</p>
            </ion-text>
        </ion-card-content>
    </ion-card>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText } from '@ionic/vue';

export default {
    name: 'Video',

    components: {
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonCardContent,
        IonText,
    },

    props: {
        item: {
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

    data() {
        return {
            selected: true,
        };
    },

    computed: {
        ...mapGetters({
            channels: 'videos/channels',
        }),

        published() {
            return moment(this.item.published).fromNow();
        },

        duration() {
            return moment.duration(this.item.duration, 'seconds').humanize();
        },
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
    width: 100% !important;
    max-width: 500px;
    max-height: 240px;
    object-fit: cover;
}

ion-card {
    min-width: 320px;
    /*max-height: 320px;*/
    height: 347px;
}

.ak-selected {
    background-color: lightblue;
}

.published {
    float: left;
}

.duration {
    float: right;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.content {
    position: absolute;
    bottom: 0px;
    right: 0px;
    left: 0px;
}
</style>
