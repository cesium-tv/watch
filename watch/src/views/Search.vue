<template>
  <div>
    <div class="columns">
      <div class="column is-offset-two-thirds">
        <Board
          class="keyboard"
          @value="onInput"
        />
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <GridRow
          :category="results"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Board from '@/components/keyboard/Board.vue';
import GridRow from '@/components/GridRow.vue';
import api from '@/services/api';

export default {
  name: 'Search',

  components: {
    Board,
    GridRow,
  },

  data() {
    return{
      results: {
        name: 'Search Results',
        videos: null,
      },
      _searchHandle: null,
    };
  },

  methods: {
    onInput(s) {
      if (!s) {
        this.results.videos = null;
        return;
      }

      clearTimeout(this._searchHandle);
      this._searchHandle = setTimeout(() => {
        api.post('/search/', {s: s.toLowerCase()})
          .then((r) => {
            this.results.videos = r.data.videos.map(v => v.video);
          })
          .catch(e => {
            console.error(e);
            this.results.videos = null;
          });
      }, 2000);
    },
  },
}
</script>

<style scoped>
</style>