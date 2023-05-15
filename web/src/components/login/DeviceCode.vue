<template>
  <div class="columns">
    <div class="column is-one-quarter is-offset-one-quarter">
      <p class="title is-5 mt-6">On your phone or computer</p>
      <ol class="ml-5">
        <li>
          <p>Go to: <b>{{ verifyUrlShort }}</b></p>
        </li>
        <li>
          <p>Sign in to your account</p>
        </li>
        <li>
          <p>Enter this code: <b>{{ authInfo.user_code }}</b></p>
        </li>
      </ol>
    </div>
    <div class="is-divider-vertical" data-content="OR"></div>
    <div class="column is-one-quarter has-text-centered">
      <p class="title is-5 mt-6">Scan the code on your phone:</p>
      <VueQrcode
        :value="verifyUrl"
        :options="{ width: 200 }"
      ></VueQrcode>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { API_URL, CLIENT_ID, CLIENT_SECRET } from '@/config';
import utils from '@/utils';

const axios_poll = axios.create();

export default {
  name: 'DeviceCode',
  
  components: {
    VueQrcode,
  },

  data() {
    return {
      authInfo: null,
      interval: null,
    };
  },

  beforeCreate() {
    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:device_code');
    params.append('client_id', CLIENT_ID);
    axios
      .post(utils.urlJoin(API_URL, '/oauth2/device/'), params)
      .then(r => {
        this.authInfo = r.data;
        this.interval = setInterval(this.onPoll.bind(this), 6000);
      })
      .catch(console.error);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  computed: {
    verifyUrl() {
      if (!this.authInfo) {
        return;
      }

      const urlp = new URL(API_URL);
      return utils.urlJoin(`${urlp.origin}`, this.authInfo.verification_uri, {
        user_code: this.authInfo.user_code
      });
    },

    verifyUrlShort() {
      if (!this.authInfo) {
        return;
      }

      const urlp = new URL(API_URL);
      return `${urlp.host}${this.authInfo.verification_uri}`;
    },
},

  methods: {
    isVisible() {
      return this.$router.currentRoute.name === 'login';
    },

    onPoll() {
      if (!this.isVisible()) {
        return;
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'urn:ietf:params:oauth:grant-type:device_code');
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('device_code', this.authInfo.device_code);

      // Use our private instance to avoid triggering loading component.
      axios_poll
        .post(utils.urlJoin(API_URL, '/oauth2/token/'), params)
        .then(r => {
          // NOTE: check http status code.
          this.onLogin(r.data);
        })
        .catch(console.error);
    },

    onLogin(token) {
      this.$store.commit('SET_AUTH', token);
      this.$router.push('/');
    }
  },
}
</script>

<style scoped>

</style>
