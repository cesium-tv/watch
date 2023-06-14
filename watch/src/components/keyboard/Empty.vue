<template>
  <button
    class="button"
    :style="style"
    ref="empty"
    disabled
  />
</template>

<script>
import { KEY_WIDTH } from '@/config';

export default {
  name: 'Empty',

  data() {
    return {
      style: `border-color: transparent; width: ${KEY_WIDTH}`,
    };
  },
}
</script>

<style scoped>
</style>
