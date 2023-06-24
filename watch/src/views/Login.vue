<template>
  <component :is="componentName"/>
</template>

<script>
import Password from '@/components/login/Password.vue';
import DeviceCode from '@/components/login/DeviceCode.vue';

const AUTH_TYPES  = {
  password: Password,
  device_code: DeviceCode,
};

export default {
  name: 'Login',
  
  components: {
    Password,
    DeviceCode,
  },

  computed: {
    componentName() {
      return AUTH_TYPES[window.CesiumTheme.auth_method];
    },
  },
}
</script>

<style scoped>
</style>
