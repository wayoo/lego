<template>
  <div class="left-side-bar">
    <div class="menu"></div>
    <div class="panel">
      <div class="comp" ref="comp">List</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      mNode: null,
    };
  },
  methods: {
    dragElement(elmnt) {
      var self = this;
      elmnt.onmousedown = dragMouseDown;
      let mNode;
      function cloneNode() {
        mNode = elmnt.cloneNode();
        mNode.classList.add('comp-moving');
        document.body.appendChild(mNode);
        self.mNode = mNode;
      }

      function dragMouseDown(e) {
        cloneNode();
        e = e || window.event;
        // e.preventDefault();
        // get the mouse cursor position at startup:
        // pos3 = e.clientX;
        // pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        self.sendBridgeMessage({
          action: 'start_tracking_mouse',
        });
      }

      function elementDrag(e) {
        e = e || window.event;
        // set the element's new position:
        mNode.style.left = e.clientX + 20 + "px";
        mNode.style.top = e.clientY + 20 + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        self.sendBridgeMessage({
          action: 'stop_tracking_mouse',
        });
      };
    },
  },
  mounted() {
    const self = this;
    this.dragElement(this.$refs.comp);
    console.log(this.$root);
    this.$root.$on('bridge-message', function(data) {
      if (data.action === 'drag_move') {
        console.log(data);
        self.mNode.style.left = data.data.clientX + 20 + 307 + 'px';
        self.mNode.style.top = data.data.clientY + 20 + 56 + 'px';
      } else if (data.action === 'child_stop_tracking_mouse') {
        document.onmousemove = null;
      }
    })
  }
};
</script>

<style lang="less">
.left-side-bar {
  background-color: #404040;
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  z-index: 32;
  display: flex;

  .menu {
    width: 35px;
    height: 100%;
  }

  .panel {
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
}
</style>
