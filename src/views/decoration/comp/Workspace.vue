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
          display: !isDrag && outline.display ? 'block' : 'none',
          width: outline.width + 'px',
          height: outline.height + 'px',
          transform: `translate(${outline.x}px, ${outline.y - frame.scroll}px)`,
        }">
        <div class="breadcrumb">
          <div class="crumb">
            <div class="inner">{{ outlineInfo.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 占位符号 -->
    <div class="bem-placeholder" :style="{
          display: placeholderInfo.display ? 'block' : 'none',
          width: placeholder.width + 'px',
          height: placeholder.height + 'px',
          transform: `translate(${placeholder.x}px, ${placeholder.y - frame.scroll}px)`,
        }">

    </div>
    <iframe id="work-frame" ref="frame" class="work-frame" src="http://localhost:8809/" frameborder="0"></iframe>
    <!-- <div class="page" ref="pageRoot"> -->
    <!-- </div> -->
    <!-- <div class="green block">asas</div> -->
  </div>
</template>

<script>
/* eslint-disable */
import { mapMutations, mapState } from 'vuex';
import { debounce } from '../../../common/utils';
// import Vue from 'vue';
// import Home from '../../template/Home.vue';

export default {
  data() {
    return {
      shadow: null,
      outline: {
        width: 100,
        height: 12,
        x: 0,
        y: 0,
        display: false,
      },
      outlineInfo: {},
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
      frame: {
        scroll: 0,
      },
      isDrag: false,
    };
  },
  computed: {
    ...mapState({
      placeholderInfo: (state) => state.workspace.placeholder,
    })
  },
  methods: {
    ...mapMutations(['setBlockData', 'setPlaceholder', 'showPlaceholder']),
    onFrameScroll: debounce(function (data) {
      this.frame.scroll = data.scrollTop;
    }, 10),
    // onFrameScroll(data) {
    //   this.frame.scroll = data.scrollTop;
    // },
    drawOutline(data) {
      this.outline.display = true;
      // this.$refs['outline-selected']
      this.outline.width = data.rect.width;
      this.outline.height = data.rect.height;
      this.outline.x = data.rect.x;
      this.outline.y = data.rect.y + data.scrollTop;

      this.outlineInfo = data.blockInfo;
      // this.setBlockData(data.blockInfo);
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
      if (pointToElement < (rect.height / 2)) {
        direction = 'top';
        // place at top of current element
        this.placeholder.y = rect.top - 10 + data.scrollTop;
      } else {
        direction = 'bottom';
        // place at bottom of current element
        this.placeholder.y = rect.top + rect.height + 10 + data.scrollTop;
      }
      this.placeholder.width = rect.width;

      const placeholderInfo = {
        blockInfo: data.blockInfo,
        direction,
      };
      this.setPlaceholder(placeholderInfo);
      // TODO save this information to vuex
      // this.placeholderInfo = {
      //   blockId: data.blockId,
      //   direction,
      // };
    },
    onReceiveMessage(data) {
      switch (data.action) {
        case 'click_block':
          this.drawOutline(data.data);
          break;
        case 'hover_block':
          this.hoverBlock(data.data);
          break;
        case 'unhover_block':
          console.log('un hover');
          this.hover.display = false;
          break;
        case 'window_scroll':
          this.onFrameScroll(data.data);
          break;
        case 'drag_start':
          this.outline.display = false;
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
        default:
          console.log('Unhandled action: ', data.action);
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
  mounted() {
    this.$root.$on('bridge-message', (data) => {
      this.onReceiveMessage(data);
    });
    this.$root.$on('send-bridge-message', (data) => {
      this.sendMessage(data);
    });
    // window.addEventListener('message', this.receiveMessage);

    // bind scroll information
    // window.addEventListener('scroll', this.onScroll);
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
      margin-top: -19px;
      margin-left: -1px;
    }

    .crumb {
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
      }
    }
  }
}
</style>
