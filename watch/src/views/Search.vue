<template>
  <div>
    <section>
    <div class="columns">
      <div
        class="terms column is-one-fifth pl-5 mt-2"
      >
        <div
          v-for="term, i in terms"
          :key=i
        >
          <button
            class="ek-selectable button is-small is-rounded has-text-light mt-1 pl-2"
            data-ek-scroll="true"
            data-ek-activate-event-name="click"
            @click="onSearch(term.term.ngram)"
          >
            <span class="icon is-small pl-3">
              <b-icon icon="magnify"></b-icon>
            </span>
            <span
              class="term pl-2"
              v-html="term.ngram_highlighted"
            />
          </button>
        </div>
      </div>
      <div class="column">
        <Board
          v-model="keywords"
          class="keyboard"
        />
      </div>
    </div>
    </section>
      <div class="column">
        <div ref="results">
          <GridRow
            :category="results"
            :auto-select="true"
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
      keywords: null,
      results: {
        name: 'Search Results',
        videos: null,
      },
      _searchHandle: null,
    };
  },

  watch: {
    keywords(s) {
      this.onInput(s);
    },
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
        this.onTerms(s);
      }, 1000);
    },

    onTerms(s) {
      if (s.indexOf(' ') === -1) {
        s = `${s}*`;
      }

      api.get('/search/terms/', { params: { s }})
        .then((r) => {
          this.terms = r.data.results.map(v => {
            v.term.ngram = v.term.ngram.toUpperCase();
            return v;
          });
        })
        .catch(e => {
          console.error(e);
          this.terms = null;
        });
    },

    onSearch(s) {
      this.keywords = s;

      api.get('/search/videos/', { params: { s }})
        .then((r) => {
          this.results.videos = r.data.results.map(v => v.video);
          this.results.count = r.data.results.length;
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