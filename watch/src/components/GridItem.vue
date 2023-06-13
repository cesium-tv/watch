<template>
  <div
    ref="card"
    class="card is-shadowless ek-selectable video"
    data-ek-activate-event-name="ek:activate"
    @ek:activate="$bus.$emit('video:play', video)"
    @ek:selected="scrollTop()"
  >
    <div class="card-image">
      <figure>
        <lazy-image
          class="poster"
          :source="video.poster"
        />
        <b-button
          icon-left="play"
          size="is-large"
          type="is-primary"
          rounded
          class="play-button"
        ></b-button>
        <div class="played-container">
          <div
            class="played"
            :style="`width: ${percentPlayed()}%;`"
          ></div>
        </div>
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <p
          class="title is-4 has-text-light"
        >{{ video.title }}</p>
        <p
          class="duration has-text-light"
        >{{ duration }}</p>
        <p
          class="published has-text-light"
        >{{ published }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import LazyImage from '@/components/LazyImage.vue';

export default {
  name: "GridItem",
  
  components: {
    LazyImage,
  },

  props: {
    video: {
      type: Object,
      default: {
        name: null,
        previewPath: null,
      },
    },
  },

  computed: {
    duration() {
      return moment.duration(this.video.duration, 'seconds').humanize();
    },

    published() {
      return moment(this.video.published).fromNow();
    }
  },

  methods: {
    percentPlayed() {
      const cursor = this.video.cursor;
      if (!cursor || !cursor.current) return 0;
      return cursor.current / cursor.duration * 100;
    },

    scrollTop() {
      /*
      NOTE: scrollIntoView() is broken on webOS. Also, it is not quite what we
      want since we want the row top vs. the video left.
      */
      const $vid = this.$refs.card;
      const row = $vid.parentNode.parentNode;
      const top = row.offsetTop, rowWidth = row.offsetWidth;
      const left = $vid.offsetLeft, vidWidth = $vid.offsetWidth;
      row.parentNode.scrollTo({
        behavior: 'smooth',
        top,
      });
      $vid.parentNode.scrollTo({
        behavior: 'smooth',
        left: (left + (vidWidth / 4)) - (rowWidth / 2),
      });
    },
  }
}
</script>

<style scoped>
.video {
  min-width: 480px;
  max-width: 480px;
  height: 400px;
  margin: 4px;
}

.title {
  overflow: hidden;
  max-height: 128px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.duration {
  float: right;
}

.poster {
  width: 320px;
  min-width: 476;
}

.play-button {
  position: absolute;
  z-index: 10;
  margin-left: -262px;
  margin-top: 120px;
  display: none;
}

.played-container {
  position: relative;
  height: 5px;
  bottom: 5px;
  z-index: 10;
}

.played {
  height: 5px;
  background-color: rgba(255, 0, 0, 128);
}

.ek-selectable {
  border: solid 2px transparent;
}

.ek-selected {
  border: solid 2px var(--primary);
}

.ek-selected .play-button {
  display: inline;
}
</style>
