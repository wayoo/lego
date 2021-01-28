<template>
  <div>
    <HeaderBar></HeaderBar>
    <LeftSidebar></LeftSidebar>
    <RightSidebar></RightSidebar>
    <Workspace></Workspace>
  </div>
</template>

<script>
import LeftSidebar from './comp/LeftSidebar.vue';
import HeaderBar from './comp/HeaderBar.vue';
import RightSidebar from './comp/RightSidebar.vue';
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
