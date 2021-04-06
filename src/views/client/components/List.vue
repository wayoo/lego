<template>
  <div class="comp-list container">
    <img class="img" src="../asset/component/list/list.png" alt="">
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="less">
.comp-list {
  padding: 50px 0 20px 0;

  .img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
