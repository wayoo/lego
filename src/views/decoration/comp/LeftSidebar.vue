<template>
  <div class="left-side-bar">
    <div class="menu"></div>
    <div class="panel">
      <div class="comp-list">
        <div class="comp" data-component-id="List">List</div>
        <div class="comp" data-component-id="Text">Text</div>
        <div class="comp" data-component-id="Banner">Banner</div>
        <div class="comp" data-component-id="Footer">Footer</div>
      </div>
      {{ componentToAdd.id }}
      {{ JSON.stringify(placeholder) }}
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
/* eslint-disable */
export default {
  data() {
    return {
      mNode: null,
      componentToAdd: {
        id: '',
      },
      isDebugMNode: false,
    };
  },
  computed: {
    ...mapState({
      placeholder: (s) => s.workspace.placeholder,
    }),
  },
  methods: {
    ...mapMutations(['hidePlaceholder', 'showPlaceholder']),
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

        // clear events;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        self.sendBridgeMessage({
          action: 'start_tracking_mouse',
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
          this.dispathComponentAddEvent();
          break;
      }
    }
  },
  mounted() {
    document.querySelectorAll('.comp').forEach((item) => {
      this.dragElement(item);
    })
    this.$root.$on('bridge-message', this.onReceiveMessage)
  }
};
</script>

<style lang="less">
.left-side-bar {
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
    overflow: hidden;
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
  }

  .comp-list {
    display: flex;
    flex-wrap: wrap;

    .comp {
      margin: 10px;
    }
  }
}
</style>
