<template>
  <div>
    <component :is="componentName"/>
  </div>
</template>

<script>
import Password from '@/components/login/Password';
import DeviceCode from '@/components/login/DeviceCode';

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
