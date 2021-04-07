<template>
  <div>
    <HeaderBar></HeaderBar>
    <LeftSidebar></LeftSidebar>
    <RightSidebar></RightSidebar>
    <Workspace></Workspace>
  </div>
</template>

<script>
import 'element-theme-dark';
import LeftSidebar from './comp/LeftSidebar/LeftSidebar.vue';
import HeaderBar from './comp/HeaderBar.vue';
import RightSidebar from './comp/RightSidebar/RightSidebar.vue';
import Workspace from './comp/Workspace.vue';

export default {
  components: {
    LeftSidebar,
    HeaderBar,
    RightSidebar,
    Workspace,
  },
};
</script>

<style lang="less">
.comp {
  width: 60px;
  height: 60px;
  background: #666;
  text-align: center;
  color: #d9d9d9;
  font-size: 12px;
  line-height: 60px;
  user-select: none;
  box-sizing: border-box;
}

.comp-moving {
  position: absolute;
  z-index: 190;
}

::-webkit-scrollbar {
  width: 6px;
}
</style>
