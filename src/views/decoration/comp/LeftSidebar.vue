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
            { name: '表单容器', id: 'Form' },
            // { name: '单选框', id: 'Radio' },
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

<style lang="less" src="./LeftSidebar.less">
</style>
