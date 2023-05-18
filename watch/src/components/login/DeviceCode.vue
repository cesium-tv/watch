<template>
  <div
    v-if="authInfo"
    class="columns"
  >
    <div class="column is-two-fifths is-offset-one-fifth">
      <p class="title is-5 mt-6">On your phone or computer</p>
      <ol class="ml-5 has-text-light">
        <li>
          <p>Go to: <a
            :href="verifyUrl"
            target="_new"
          >{{ verifyUrl }}</a></p>
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
    <div class="column is-one-fifth has-text-centered">
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
import utils from '@/utils';
import { API_URL, CLIENT_ID } from '@/config';

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
      const urlp = new URL(API_URL);
      return utils.urlJoin(`${urlp.origin}`, this.authInfo.verification_uri, {
        user_code: this.authInfo.user_code
      });
    },

    verifyUrlShort() {
      const urlp = new URL(API_URL);
      return `http://${urlp.host}${this.authInfo.verification_uri}`;
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
      this.$store
        .dispatch('device', this.authInfo.device_code)
        .then(() => {
          clearInterval(this.interval);
          this.$router.push('/');
        })
        .catch(() => {})
    },
  },
}
</script>

<style scoped>

</style>
