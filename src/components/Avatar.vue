<template>
    <IonAvatar
        slot="start"
        :style="{ backgroundColor: color }"
        class="avatar"
    >
        <img
            v-if="image"
            :src="image"
        />
        <h1
            style="color: black;"
            v-else="letter"
        >{{ letter }}</h1>
    </IonAvatar>
</template>

<script>
import { IonAvatar } from '@ionic/vue';

function stringToColour(str) {
  let hash = 0;
  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  })
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).padStart(2, '0')
  }
  return colour
}

export default {
    name: "Avatar",

    components: {
        IonAvatar,
    },

    props: {
        item: {
            type: Object,
            default: null,
        },
    },

    computed: {
        image() {
            return this.item.poster;
        },

        letter() {
            return this.item.name.substr(1, 1).toUpperCase();
        },

        color() {
            return stringToColour(this.item.name);
        },
    },
};
</script>

<style scoped>
.avatar {
    display: inline-block;
    text-align: center;
    vertical-align: middle;
}
</style>
