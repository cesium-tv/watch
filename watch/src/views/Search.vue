<template>
  <div>
    <section>
    <div class="columns">
      <div
        class="terms column is-offset-one-fifth is-two-fifths"
      >
        <div
          v-for="term, i in terms"
          :key=i
          v-html="term.ngram_highlighted"
          class="term ek-selectable has-text-light mt-1 pl-2"
          data-ek-scroll="true"
          data-ek-activate-event-name="click"
          @click="onSearch(term.term.ngram)"
        >
        </div>
      </div>
      <div class="column">
        <Board
          class="keyboard"
          @value="onInput"
        />
      </div>
    </div>
    </section>
      <div class="column">
        <div>
          <GridRow
            :category="results"
          />
        </div>
      </div>
  </div>
</template>

<script>
import Board from '@/components/keyboard/Board.vue';
import GridRow from '@/components/grid/GridRow.vue';
import api from '@/services/api';

export default {
  name: 'Search',

  components: {
    Board,
    GridRow,
  },

  data() {
    return {
      terms: null,
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
        this.terms = null;
        this.results.videos = null;
        return;
      }

      clearTimeout(this._searchHandle);
      this._searchHandle = setTimeout(() => {
        api.get('/search/terms/', { params: { s: `${s}*` }})
          .then((r) => {
            this.terms = r.data.results;
          })
          .catch(e => {
            console.error(e);
            this.terms = null;
          });
      }, 1000);
    },

    onSearch(s) {
      api.get('/search/videos/', { params: { s }})
        .then((r) => {
          this.results.videos = r.data.results.map(v => v.video);
        })
        .catch(e => {
          console.error(e);
          this.results.videos = null;
        });
    },
  },
}
</script>

<style scoped>
.terms {
  height: 400px;
  overflow: hidden;
}

.term {
  text-overflow: ellipsis;
}

.ek-selected {
  background-color: var(--primary) !important;
}
</style>