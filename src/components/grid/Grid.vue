<template>
    <div
        class="grid"
    >
        <div
            v-for="(item, i) in notEmpty"
            :key="i"
        >
            <div style="vertical-align: middle;">
                <Avatar
                    :item="item"
                    class="channel-avatar"
                ></Avatar>
                <ion-text color="medium">
                    <h2 class="channel-name">{{ item.name }}</h2>
                </ion-text>
            </div>

            <grid-row
                :name="item.name"
                :items="getSubItems(item)"
                :item-component="itemComponent"
                ref="rows"
            ></grid-row>
        </div>
    </div>
</template>

<script>
import { IonText } from '@ionic/vue';
import GridRow from '@/components/grid/GridRow.vue';
import Video from '@/components/Video.vue';
import Avatar from '@/components/Avatar.vue';

export default {
    name: 'Grid',

    components: {
        IonText,
        GridRow,
        Avatar,
    },

    props: {
        items: {
            type: Array,
            default: [],
        },

        subItemsName: {
            type: String,
            default: null,
        },

        itemComponent: {
            type: Object,
            default: Video,
        },
    },

    computed: {
        notEmpty() {
            return this.items.filter((o) => {
                return this.getSubItems(o).length > 0;
            });
        },
    },

    methods: {
        getSubItems(o) {
            return o[this.subItemsName];
        },
    },
};
</script>

<style>
.grid {
    width: 100%;
    height: 100%;
}

.channel-name {
    padding-top: 18px;
}

.channel-avatar {
    float: left;
    margin-right: 10px;
    margin-left: 10px;
}
</style>
