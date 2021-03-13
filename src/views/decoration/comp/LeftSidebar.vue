<template>
  <div class="left-side-bar">
    <div class="menu"></div>
    <div class="panel">
      <div class="panel-header">
        <h2>
          Add Component
        </h2>
      </div>
      <!-- <div class="group-header">
        Layout
      </div> -->
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item :title="grp.title" :name="k"
          v-for="(grp, k) in components"
          :key="k">
          <div class="comp-list">
            <div class="comp"
                    :key="item.id"
                    v-for="item in grp.items"
                    :data-component-id="item.id"
                    :data-component-cate="grp.type">{{ item.name }}</div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import Messenger from '../common/messenger';

const msgr = new Messenger('#work-frame');
/* eslint-disable */
export default {
  data() {
    return {
      mNode: null,
      componentToAdd: {
        id: '',
      },
      activeNames: [0, 1, 2, 3],
      isDebugMNode: false,
      components: [
        {
          type: 'layout',
          title: '布局 Layout',
          items: [
            { name: 'Section', id: 'Section' },
            { name: 'Container', id: 'Container' },
            { name: 'Columns', id: 'Columns' },
            { name: 'Flexs', id: 'Flexs' },
          ]
        },
        {
          type: 'block',
          title: '基础 Basic',
          items: [
            { name: 'Form', id: 'Form' },
            { name: 'Tabs', id: 'Tabs' },
            { name: 'Carousel', id: 'Carousel' },
          ]
        },
        {
          type: 'block',
          title: '组件 Component',
          items: [
            { name: 'List', id: 'List' },
            { name: 'Text', id: 'Text' },
            { name: 'Banner', id: 'Banner' },
            { name: 'Footer', id: 'Footer' },
          ],
        },
        {
          type: 'form',
          title: '表单 Form',
          items: [
            { name: '单选框', id: 'Radio' },
            { name: '开关', id: 'Switch' },
          ]
        }
      ],
    };
  },
  computed: {
    ...mapState({
      placeholder: (s) => s.workspace.placeholder,
    }),
  },
  methods: {
    ...mapMutations(['hidePlaceholder', 'showPlaceholder']),
    handleChange(val) {
      console.log(val);
    },
    finishDrag() {
      if (!this.isDebugMNode) {
        this.mNode.remove();
      }
      this.hidePlaceholder();
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    },
    dragElement(elmnt) {
      var self = this;
      elmnt.onmousedown = dragMouseDown;
      let mNode;

      // clone
      function cloneNode() {
        mNode = elmnt.cloneNode(true);
        mNode.style.display = "none";
        mNode.classList.add('comp-moving');
        document.body.appendChild(mNode);
        self.mNode = mNode;
      }

      // start moving
      function dragMouseDown(e) {
        cloneNode();
        self.componentToAdd.id = elmnt.getAttribute('data-component-id');
        const category = elmnt.getAttribute('data-component-cate');

        // clear events;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        // FIXME deprecated this usage
        self.sendBridgeMessage({
          action: 'start_tracking_mouse',
        });
        self.sendBridgeMessage({
          action: 'start_dragging_new_comp',
          data: {
            category,
            name: self.componentToAdd.id,
          }
        });
      }

      // on move
      function elementDrag(e) {
        e = e || window.event;
        mNode.style.display = 'block';
        // set the element's new position:
        mNode.style.left = e.clientX + 5 + "px";
        mNode.style.top = e.clientY + 5 + "px";
      }

      function closeDragElement() {
        self.finishDrag();
        self.sendBridgeMessage({
          action: 'stop_tracking_mouse',
        });
      };
    },

    // notifiy client
    dispathComponentAddEvent() {
      return;
      console.log(this.placeholder.blockInfo);
      const data = {
        targetBlockId: this.placeholder.blockInfo.id,
        direction: this.placeholder.direction,
        componentId: this.componentToAdd.id,
      };
      this.sendBridgeMessage({
        action: 'add_component',
        data,
      })
    },
    onReceiveMessage(data) {
      switch (data.action) {
        case 'drag_move':
          this.mNode.style.left = data.data.clientX + 5 + 307 + 'px';
          this.mNode.style.top = data.data.clientY + 5 + 56 + 'px';
          break;
        case 'child_stop_tracking_mouse':
          // only call back received from child will treated as success
          this.finishDrag();
          // this.dispathComponentAddEvent();
          break;
        case 'hide_placeholder':
          this.hidePlaceholder();
          break;
      }
    },
    sendBridgeMessage(data) {
      msgr.sendMessageWithoutCheck(data);
    },
  },
  mounted() {
    document.querySelectorAll('.comp').forEach((item) => {
      this.dragElement(item);
    })
    // this.$root.$on('bridge-message', this.onReceiveMessage)
    window.addEventListener('message', (data) => {
      if (data.data.type === 'bridge-message') {
        this.onReceiveMessage(data.data.data);
      }
    });
  }
};
</script>

<style lang="less">
.left-side-bar {
  user-select: none;
  background-color: #404040;
  height: calc(100% - 35px);
  left: 0;
  top: 0;
  position: fixed;
  z-index: 32;
  display: flex;
  top: 35px;

  .menu {
    width: 35px;
    height: 100%;
  }

  .panel {
    padding-left: 6px;
    background: #404040;
    border: 1px solid #212121;
    color: #d9d9d9;
    font-size: 12px;
    line-height: 16px;
    overflow-x: hidden;
    overflow-y: scroll;
    pointer-events: auto;
    width: 250px;
    height: 100%;
    position: relative;
    box-sizing: border-box;

    &::before {
      background: #4d4d4d;
      border-right: 1px solid #212121;
      bottom: 0;
      content: '';
      display: block;
      left: 0;
      position: absolute;
      top: 1px;
      width: 6px;
      pointer-events: auto;
    }

    .panel-header {
      align-items: center;
      color: #d9d9d9;
      background: #4d4d4d;
      padding: 0 10px;
      height: 45px;

      h2 {
        font-size: 20px;
        line-height: 24px;
        margin: 0;
        line-height: 45px;
      }
    }

    .group-header {
      outline: 0px;
      cursor: default;
      user-select: none;
      background: rgb(43, 43, 43);
      border-bottom: 1px solid rgb(33, 33, 33);
      height: 28px;
      padding-left: 4px;
      padding-top: 4px;
      padding-bottom: 4px;
      box-sizing: border-box;
      overflow: visible;
      display: flex;
      align-items: center;
      flex: 0 1 auto;
    }
  }

  .comp-list {
    display: flex;
    flex-wrap: wrap;
    margin-right: -10px;

    .comp {
      margin: 10px;
      cursor: pointer;
    }
  }

  .el-collapse-item__header {
    background: #2b2b2b;
    padding-left: 10px;
    height: 32px;
    line-height: 32px;
  }

  .el-collapse-item__content {
    background: #404040;
    padding: 0;
  }
}
</style>
