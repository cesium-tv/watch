<template>
    <div
        id="swipe-container"
        ref="swipeContainer"
        :class="{ 'overflow-left': overflowLeft, 'overflow-right': overflowRight }"
    >
        <div
            id="swipe"
        >
            <IonAvatar
                :class="{ 'avatar-swipe': true, 'avatar-selected': selected === null }"
                @click="clear()"
            >
                <h1>All</h1>
            </IonAvatar>
            <component
                v-for="(item, i) of items"
                :key="i"
                :item="item"
                :is="itemComponent"
                :class="{ 'avatar-swipe': true, 'avatar-selected': selected === getAttr(item) }"
                @click="select(item)"
            ></component>
        </div>
    </div>
</template>

<script>
import { IonAvatar } from '@ionic/vue';
import Avatar from '@/components/Avatar.vue';

export default {
    name: "Swipe",

    components: {
        IonAvatar,
        Avatar,
    },

    props: {
        items: {
            type: Array,
            default: [],
        },

        modelValue: {
            type: String,
            default: null,
        },

        selectedAttr: {
            type: String,
            default: null,
        },

        itemComponent: {
            type: Object,
            default: Avatar,
        },
    },

    data() {
        return {
            selected: this.modelValue,
            swipeWidth: 0,
            swipeScroll: 0,
            overflowLeft: false,
            overflowRight: true,
        };
    },

    mounted() {
        this.$refs.swipeContainer.addEventListener('scroll', this.onScroll);
    },

    unmounted() {
        this.$refs.swipeContainer.removeEventListener('scroll', this.onScroll);
    },

    methods: {
        clear() {
            this.selected = null;
            this.$emit('update:modelValue', null);
        },

        select(item) {
            this.selected = this.getAttr(item);
            this.$emit('update:modelValue', this.selected);
        },

        getAttr(o) {
            return o[this.selectedAttr];
        },

        onScroll() {
            const container = this.$refs.swipeContainer;

            this.swipeWidth = container.children[0].clientWidth - container.clientWidth;
            this.swipeScroll = container.scrollLeft;

            this.overflowLeft = (this.swipeScroll > 0);
            this.overflowRight = (this.swipeScroll < this.swipeWidth);
        },
    },
};
</script>

<style scoped>
#swipe-container {
    display: flex;
    overflow-y: hidden;
    padding-top: 10px;
}

#swipe-container::-webkit-scrollbar {
    display: none;
}

#swipe {
    white-space: nowrap;
}

.avatar-swipe {
    display: inline-block;
    text-align: center;
    vertical-align: middle;

    background-color: white;
    margin-left: 10px;
    margin-top: 4px;
    margin-bottom: 4px;
    opacity: 0.4;
}

.avatar-selected {
    box-shadow: 0 0 8px var(--ion-color-success);
    opacity: 1.0;
}

/*
TODO: learn css mask so that we can mask both directions
as well as one or the other. Will likely need to make the
class list a computed property that returns: overflow-left,
overflow-right or overflow-both. I would also like the
gradient to be more pronounced and shorter (from the edge).
*/

.overflow-left {
  --mask: linear-gradient(to left, 
      rgba(0,0,0, 1) 0,   rgba(0,0,0, 1) 40%, 
      rgba(0,0,0, 0) 95%, rgba(0,0,0, 0) 0
  ) 100% 50% / 100% 100% repeat-x;
  
  -webkit-mask: var(--mask); 
  mask: var(--mask);
}

.overflow-right {
  --mask: linear-gradient(to right, 
      rgba(0,0,0, 1) 0,   rgba(0,0,0, 1) 40%, 
      rgba(0,0,0, 0) 95%, rgba(0,0,0, 0) 0
  ) 100% 50% / 100% 100% repeat-x;
  
  -webkit-mask: var(--mask); 
  mask: var(--mask);
}
</style>
