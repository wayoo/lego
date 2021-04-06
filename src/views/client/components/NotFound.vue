<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
    },
    data: {
      type: Object,
    },
  },
  data() {
    let msg;
    if (!this.name) {
      msg = 'Block Name not specified!';
    } else {
      msg = `Block [ ${this.name} ] not found!`;
    }
    return {
      msg,
    };
  },
};
</script>

<style lang="less">

</style>
