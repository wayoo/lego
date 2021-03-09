<template>
  <div id="workspace">
    <div class="bem-tools">
      <!-- 滑动的容器 -->
      <div class="outline hovered-node" :style="{
          display: !isDrag && hover.display ? 'block' : 'none',
          width: hover.width + 'px',
          height: hover.height + 'px',
          transform: `translate(${hover.x}px, ${hover.y - frame.scroll}px)`,
        }">
        <div class="breadcrumb">
          <div class="crumb">
            <div class="inner">{{ hoverInfo.name }}</div>
          </div>
        </div>
      </div>

      <!-- 选中的容器 -->
      <div ref="outline-selected" class="outline selected-node" :style="{
          display: !isDrag && outlineInfo.display ? 'block' : 'none',
          width: outline.width + 'px',
          height: outline.height + 'px',
          transform: `translate(${outline.x}px, ${outline.y - frame.scroll}px)`,
        }">
        <div class="breadcrumb">
          <div class="crumb">
            <template v-if="isCompHierarchyShow">
              <div class="inner" v-for="(comp) in compHierarchy" :key="comp.id"
                @mouseover="onCompHover(comp)"
                @click="onCompClick(comp)">
                {{ comp.name }}
              </div>
            </template>
            <div class="inner" @click="toggleCompHierarchy">{{ outlineInfo.blockInfo.name }}</div>
          </div>
          <div class="close" title="删除模块" @click="onCompDeletion(outlineInfo.blockInfo)"> x </div>
        </div>
      </div>
    </div>

    <!-- 占位符号 -->
    <div class="bem-placeholder" :style="{
          display: placeholderInfo.display ? 'block' : 'none',
          width: placeholder.width + 'px',
          height: placeholder.height + 'px',
          transform: `translate(${placeholder.x}px, ${placeholder.y - frame.scroll}px)`,
        }" :class="{ invalid: !placeholderInfo.isValid }">

    </div>

    <iframe id="work-frame" ref="frame" class="work-frame"
      :src="`http://${hostname}/dynamic/${pageId}`" frameborder="0"></iframe>
    <!-- <iframe id="work-frame" ref="frame" class="work-frame" src="http://localhost:8809/" frameborder="0"></iframe> -->
    <!-- <div class="page" ref="pageRoot"> -->
    <!-- </div> -->
    <!-- <div class="green block">asas</div> -->
  </div>
</template>

<script>
/* eslint-disable */
import { mapMutations, mapState } from 'vuex';
import { debounce } from '../common/utils';
import Messenger from '../common/messenger';

const msgr = new Messenger('#work-frame');
// import Vue from 'vue';
// import Home from '../../template/Home.vue';

export default {
  data() {
    // const hostname = this.$route.query.site;
    // this.$store.state.workspace.hostname = hostname;

    return {
      pageId: this.$route.params.id,
      shadow: null,
      outline: {
        width: 100,
        height: 12,
        x: 0,
        y: 0,
        display: false,
      },
      // outlineInfo: {},
      hover: {
        display: false,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      },
      hoverInfo: {},
      placeholder: {
        width: 100,
        height: 2,
        x: 0,
        y: 0,
      },
      compHierarchy: [],
      isCompHierarchyShow: false,
      frame: {
        scroll: 0,
      },
      isDrag: false,
    };
  },
  computed: {
    ...mapState({
      placeholderInfo: (state) => state.workspace.placeholder,
      outlineInfo: (state) => state.workspace.outline,
      hostname: (state) => state.workspace.hostname,
    })
  },
  methods: {
    ...mapMutations(['setBlockData', 'setPlaceholder', 'showPlaceholder',
      'stateSetOutline',
      'stateShowOutline',
      'stateHideOutline',
    ]),
    onFrameScroll: debounce(function (data) {
      this.frame.scroll = data.scrollTop;
    }, 10),
    // onFrameScroll(data) {
    //   this.frame.scroll = data.scrollTop;
    // },
    drawOutline(data) {
      // this.outline.display = true;
      this.isCompHierarchyShow = false;
      // this.$refs['outline-selected']
      this.outline.width = data.rect.width;
      this.outline.height = data.rect.height;
      this.outline.x = data.rect.x;
      this.outline.y = data.rect.y + data.scrollTop;

      this.stateSetOutline({ blockInfo: data.blockInfo, display: true });
      // this.outlineInfo = data.blockInfo;
    },
    hoverBlock(data) {
      if (this.isDrag) { return; }
      this.hover.display = true;
      this.hover.width = data.rect.width;
      this.hover.height = data.rect.height;
      this.hover.x = data.rect.x;
      this.hover.y = data.rect.y + data.scrollTop;

      this.hoverInfo = data.blockInfo;
    },
    updatePlaceholder(data) {
      this.showPlaceholder();
      // const clientX = data.pointer.clientX;
      const clientY = data.pointer.clientY;
      const rect = data.rect;
      const pointToElement = clientY - rect.top;
      let direction;
      this.placeholder.x = rect.left;
      const outsideSep = 10;
      const insideSep = -12;
      const sep = data.isInside ? insideSep : outsideSep;
      if (pointToElement < (rect.height / 2) || data.isInside) {
        direction = 'top';
        // place at top of current element
        this.placeholder.y = rect.top - sep + data.scrollTop;
      } else {
        direction = 'bottom';
        // place at bottom of current element
        this.placeholder.y = rect.top + rect.height + sep + data.scrollTop;
      }
      this.placeholder.width = rect.width;

      const placeholderInfo = {
        blockInfo: data.blockInfo,
        direction,
        isInside: data.isInside,
        isValid: data.isValid,
      };
      this.setPlaceholder(placeholderInfo);
      // TODO save this information to vuex
      // this.placeholderInfo = {
      //   blockId: data.blockId,
      //   direction,
      // };
    },
    onCompClick(comp) {
      msgr.sendMessage({
        action: 'parent_click_comp',
        data: comp,
      }).then(res => {
        console.log(res);
      })
    },
    onCompHover(comp) {
      msgr.sendMessage({
        action: 'parent_hover_comp',
        data: comp,
      }).then(res => {
        console.log(res);
      })
    },
    onCompDeletion(comp) {
      msgr.sendMessage({
        action: 'parent_delete_comp',
        data: comp,
      }).then(res => {
        console.log(res);
      })
    },
    toggleCompHierarchy() {
      if (this.isCompHierarchyShow) {
        this.isCompHierarchyShow = false;
        return;
      }

      msgr.sendMessage({
        action: 'find_comp_hierarchy',
        data: {
          id: this.outlineInfo.blockInfo.id,
        }
      }).then((res) => {
        this.compHierarchy = res.slice(0, -1);
        this.isCompHierarchyShow = true;
        console.log(res);
      });
    },
    onReceiveMessage(data) {
      switch (data.action) {
        case 'click_block':
        case 'update_block':
          this.drawOutline(data.data);
          break;
        case 'hide_outline':
          // this.outline.display = false;
          this.stateHideOutline();
          break;
        case 'hover_block':
          this.hoverBlock(data.data);
          break;
        case 'unhover_block':
          this.hover.display = false;
          break;
        case 'window_scroll':
          this.onFrameScroll(data.data);
          break;
        case 'drag_start':
          this.stateHideOutline();
          // this.outline.display = false;
          this.isDrag = true;
          break;
        case 'drag_end':
          console.log(data);
          setTimeout(() => {
            this.isDrag = false;
          }, 300);
          break;
        // 显示占位标记
        case 'child_show_placeholder':
          this.updatePlaceholder(data.data);
          break;
        case 'parent_show_comp_hierarchy':
          this.
          break;
        default:
          // console.log('Unhandled action: ', data.action);
          break;
      }
    },
    sendMessage(data) {
      const cWindow = this.$refs.frame.contentWindow;
      cWindow.postMessage({
        type: 'bridge-message',
        from: 'dashboard',
        data,
      }, '*');
    },
  },
  filters: {
    hierarchy(comps) {
      return comps.slice(0, -1);
    }
  },
  mounted() {
    window.addEventListener('message', (data) => {
      if (data.data.type === 'bridge-message') {
        this.onReceiveMessage(data.data.data);
      }
    });
    window.stateHideOutline = () => {
      this.stateHideOutline();
    }
  },
  beforeDestroy() {
    // window.removeEventListener('message', this.receiveMessage);
  },
};
</script>

<style lang="less">
#workspace {
  position: fixed;
  top: 35px;
  left: 287px;
  z-index: 10;
  width: calc(100% - 287px - 242px);
  height: calc(100% - 36px);
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  background: #F5F7FA;
  user-select: none;

  .page {
    background: #fff;
  }

  .work-frame {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .bem-tools {
    position: absolute;
    z-index: 13;
    left: 20px;
    top: 20px;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: visible;
    line-height: 12px;
  }

  .bem-placeholder {
    position: absolute;
    background: #178df7;

    &.invalid {
      background: #f33750;
    }
  }

  .outline {
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    border: 1px solid #178df7;
    z-index: 7;

    .breadcrumb {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 25px;
      margin-top: -24px;
      margin-left: -1px;

      .close {
        width: 25px;
        height: 25px;
        line-height: 25px;
        color: #f33750;
        // background: red;
        position: absolute;
        right: 0;
        cursor: pointer;
        pointer-events: initial;
        z-index: 100;
      }
    }

    .crumb {
      position: absolute;
      bottom: 0;

      .inner {
        padding: 0 10px;
        height: 18px;
        line-height: 18px;
        background-color: #178df7;
        color: #fff;
        border-radius: 2px;
        font-size: 14px;
        white-space: nowrap;
        float: left;
        clear: both;
        pointer-events: initial;
        cursor: pointer;
        z-index: 100;
        margin-bottom: 1px;
      }
    }
  }
}
</style>
