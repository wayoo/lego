<template>
  <div class="header-bar">
    <div class="pull-left">
      <!-- <el-form-item label="装修站点地址"> -->
        <el-input size="mini" v-model="decoHostname"
          @keydown.native="onKeyDown" @blur="changeHost"></el-input>
      <!-- </el-form-item> -->
    </div>
    <div class="pull-right">
      <el-button @click="generateConfig" class="action" size="mini">保存配置文件</el-button>
      <el-button @click="preview" class="action" size="mini">预览</el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import Messenger from '../common/messenger';

const msgr = new Messenger('#work-frame');

export default {
  data() {
    return {
      decoHostname: this.$store.state.workspace.hostname,
      preview_path: this.$route.query.preview_path,
    };
  },
  computed: {
    ...mapState({
      hostname: (state) => state.workspace.hostname,
    }),
  },
  methods: {
    ...mapMutations(['storeSetHostname']),
    generateConfig() {
      msgr.sendMessage({
        action: 'download_block_data',
      }).then((data) => {
        console.log(data);
        // eslint-disable-next-line no-param-reassign
        data.pageId = this.$route.params.id;
        try {
          this.$api.dynamicPages.save(data).then((res) => {
            if (res.code === 0) {
              this.$message({
                message: '保存成功',
                type: 'success',
              });
            }
          });
        } catch (e) {
          this.$message({
            message: '非联网环境，请在业务后台操作保存!',
            type: 'error',
          });
        }
      });
    },
    preview() {
      window.open(`https://${this.hostname}${this.preview_path}`);
    },
    onKeyDown(e) {
      if (e.keyCode === 13) {
        this.changeHost();
      }
    },
    changeHost() {
      this.storeSetHostname(this.decoHostname);
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

  .pull-left {
    float: left;
    padding: 5px 10px;
    width: 300px;
  }

  .action {
    background: #6b6b6b;
  }
}
</style>
