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
      <div class="column is-offset-1">
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
        name: null,
        videos: [],
      },
      _searchHandle: null,
    };
  },

  methods: {
    onInput(s) {
      clearTimeout(this._searchHandle);
      this._searchHandle = setTimeout(() => {
        api.post('/search/', {s})
          .then((r) => {
            this.results.videos = r.data.videos;
          })
          .catch(e => console.error(e));
      }, 2000);
    },
  },
}
</script>

<style scoped>
.keyboard {
/*  margin-left: 100px;*/
}
</style>