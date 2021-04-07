<template>
  <div class="right-side-bar">
    <el-tabs type="border-card">
      <el-tab-pane label="配置">
        <div class="property-editor">
          <el-form ref="form" :model="form" :rules="rules"
            label-width="70px">
            <el-form-item label="模块id">
              <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="模块名" prop="name">
              <el-input v-model="form.name" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="所属模块">
              <el-input v-model="form.module" disabled></el-input>
            </el-form-item> -->

            <el-collapse v-model="activeNames" class="collapse">
              <el-collapse-item title="Props" name="1">
                <template v-if="form.name === 'Textarea'">
                  <block-textarea :key="form.id" :data="form" @change="onChange"></block-textarea>
                </template>
                <template v-if="form.name === 'Columns' && form.tag === 'el-row'">
                  <div>
                    <layout-columns :data="form" @change="onChange"></layout-columns>
                  </div>
                </template>
                <template v-if="form.name === 'Flexs'">
                  <div>
                    <layout-flexs :key="form.id" :data="form" @change="onChange"></layout-flexs>
                  </div>
                </template>
                <template v-if="form.name === 'Container'">
                    <layout-container :key="form.id" :data="form"
                      @change="onChange"></layout-container>
                </template>
                <template v-if="form.name === 'Tabs'">
                  <basic-tabs :key="form.id" :data="form" @change="onChange"></basic-tabs>
                </template>
                <template v-if="form.name === 'Carousel'">
                  <basic-carousel :key="form.id" :data="form" @change="onChange"></basic-carousel>
                </template>
                <template v-if="['Form', 'Switch'].includes(form.name)">
                  <form-index :key="form.id" :data="form" @change="onChange"></form-index>
                </template>
                <!-- <template v-if="form.name === 'Component'">
                  <component-editor :key="form.id" :data="form"
                    @change="onChange"></component-editor>
                </template> -->
                <template>
                  <CommonProps :key="form.id" :data="form" @change="onChange"></CommonProps>
                </template>
              </el-collapse-item>

              <el-collapse-item title="Events" name="2">
                <CommonEvent :key="form.id" :data="form" @change="onChange"></CommonEvent>
              </el-collapse-item>
              <el-collapse-item title="Data" name="3" v-if="form.name === 'Component'">
                <CommonData :key="form.id" :data="form" @change="onChange"></CommonData>
              </el-collapse-item>

            </el-collapse>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="结构">
        <render-tree></render-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/* eslint-disable */
import Messenger from '../../common/messenger';
const msgr = new Messenger('#work-frame');
import { mapState, mapMutations, mapActions } from 'vuex';
import renderTree from '../renderTree';
import layoutContainer from './editor/layout/Container.vue';
import layoutColumns from './editor/layout/Columns.vue';
import layoutFlexs from './editor/layout/Flexs.vue';
import blockTextarea from './editor/block/Textarea.vue';
import basicTabs from './editor/basic/Tabs.vue';
import basicCarousel from './editor/basic/Carousel.vue';
import FormIndex from './editor/form/Index.vue';
import ComponentEditor from './editor/block/Component.vue';
import CommonProps from './editor/CommonProps.vue';
import CommonEvent from './editor/CommonEvent.vue';
import CommonData from './editor/CommonData.vue';

export default {
  components: {
    // layouts
    layoutContainer,
    layoutColumns,
    layoutFlexs,
    // basic
    basicTabs,
    basicCarousel,
    // blocks
    blockTextarea,
    //
    FormIndex,
    //
    renderTree,
    //
    ComponentEditor,
    //
    CommonProps,
    CommonEvent,
    CommonData,
  },
  data() {
    // const blockData = this.$store.state.editor.blockData;

    return {
      activeNames: ['2', '3'],
      form: {
        name: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入模块名称', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    blockData: {
      get () {
        return this.$store.state.editor.blockData;
      },
      set (value) {
        this.setBlockData(value);
      }
    },
    // how to use v-model with Vuex. Computed setter in action.
    // see https://itnext.io/anyway-this-is-how-to-use-v-model-with-vuex-computed-setter-in-action-320eb682c976
    content: {
      get() {
        return this.blockData.content;
      },
      set(val) {
        console.log(val);
      },
    },
  },
  methods: {
    ...mapMutations(['setBlockData']),
    ...mapActions(['syncBlockData', 'syncComponentData']),
    onChange() {
      console.log(JSON.stringify(this.form));
      const data = JSON.parse(JSON.stringify(this.form));
      // this.syncComponentData(this.form);
      // console.log(data);
      // return;
      msgr.sendMessage({
        action: 'update_component_data',
        data,
      }).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    },
    // ignore
    onLoadBlockInfo(data) {
      // this.$refs.form.clearValidate();
      // assign to editor
      this.form = data;
      // assign to store
      // this.setBlockData(data);
      // this.setBlockData = data;
    },
    onReceiveMessage(data) {
      switch (data.action) {
        case 'click_block':
          this.onLoadBlockInfo(data.data.blockInfo);
          break;
      }
    },
  },
  mounted() {
    window.addEventListener('message', (data) => {
      if (data.data.type === 'bridge-message') {
        this.onReceiveMessage(data.data.data);
      }
    });
    // this.$root.$on('bridge-message', this.onReceiveMessage);
  },
};
</script>

<style lang="less" src="./RightSidebar.less">
</style>
