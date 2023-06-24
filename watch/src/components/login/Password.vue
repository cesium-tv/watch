<template>
  <div class="columns">
    <div class="column is-half is-offset-one-quarter">
      <form
        class="mt-6"
        @submit="onLogin"
      >
        <b-field
          label="Username"
        >
          <b-input
            class="errokees-selectable"
            v-model="form.username"
            maxlength="30"
          ></b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            class="errokees-selectable"
            v-model="form.password"
            type="password"
          ></b-input>
        </b-field>
        <b-button
          class="mt-4 errokees-selectable"
          type="is-dark"
        >Login</b-button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL, CLIENT_ID, CLIENT_SECRET } from '@/config';
import { urlJoin } from '@/utils';

export default {
  name: 'Password',

  data() {
    return {
      form: {
        username: null,
        password: null,
      }
    };
  },

  methods: {
    async onLogin() {
      const data = {
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        ...this.form,
      };
      let r = await axios.post(urlJoin(API_URL, '/oauth2/token/'), data);
      this.$store.commit('SET_AUTH', r.json());
      this.$router.push('/');
    }
  },
}
</script>

<style scoped>
.errokees-selected input {
  color: var(--primary);
}

.errokees-selected > button {
  background-color: var(--primary);
}
</style>
