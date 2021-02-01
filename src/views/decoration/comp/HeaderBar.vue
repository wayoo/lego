<template>
  <div class="header-bar">
    <div class="pull-right">
      <el-button @click="generateConfig" type="success" size="mini">保存配置文件</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  computed: {
  },
  methods: {
    generateConfig() {
      this.sendBridgeMessage({
        action: 'download_block_data',
      });
    },
  },
};
</script>

<style lang="less">
.header-bar {
  width: calc(100% - 241px);
  height: 35px;
  background: #404040;
  border-bottom: 1px solid #1a1a1a;
  position: fixed;
  top: 0;

  .pull-right {
    float: right;
    padding: 3px 10px;
  }
}
</style>
