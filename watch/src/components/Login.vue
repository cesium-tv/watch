<template>
  <b-modal
    :active="true"
    :can-cancel="false"
  >
    <form>
      <header class="modal-card-head">
        <img
          id="logo"
          :src="icon"
          alt="Video player"
        />
        <p class="modal-card-title">Login</p>
      </header>
      <section class="has-background-color-dark modal-card-body">
        <b-field label="Username">
          <b-input
            class="errokees-selectable"
            type="username"
            v-model="username"
            placeholder="Your username"
            required>
          </b-input>
        </b-field>

        <b-field label="Password">
          <b-input
            class="errokees-selectable"
            type="password"
            v-model="password"
            placeholder="Your password"
            required>
          </b-input>
        </b-field>

        <b-checkbox
          type="is-info"
          class="errokees-selectable"
          v-model="remember"
        >Remember me</b-checkbox>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-info errokees-selectable"
          @click.prevent="login"
        >Login</button>
      </footer>
    </form>
  </b-modal>
</template>

<script>
import icon from '@/assets/icon.png';

export default {
  name: 'Login',

  data() {
    return {
      username: null,
      password: null,
      remember: null,
      icon,
    };
  },

  methods: {
    login() {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password,
        remember: this.remember,
      })
        .catch(e => console.error);
    },
  },
}
</script>

<style>
.modal-card {
  margin: 0 auto;
  margin-top: 80px;
  width: auto;
}

#logo {
  margin-right: 30px;
}

.errokees-selectable {
  border: 2px solid transparent;
}

.errokees-selected {
  border: 2px solid var(--active-color);
}
</style>
