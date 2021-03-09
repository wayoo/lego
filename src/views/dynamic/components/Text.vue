<template>
  <div class="comp-text">
    {{ data.content || '暂无内容～' }}
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
  data() {
    return {};
  },
};
</script>

<style lang="less">
.comp-text {
  padding: 50px;
}
</style>
