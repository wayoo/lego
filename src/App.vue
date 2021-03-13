<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  // methods: {
  //   receiveMessage(data) {
  //     if (data.data.type === 'bridge-message') {
  //       this.$root.$emit('bridge-message', data.data.data);
  //     }
  //   },
  // },
  // mounted() {
  //   window.addEventListener('message', this.receiveMessage);
  // },
  // beforeDestroy() {
  //   window.removeEventListener('message', this.receiveMessage);
  // },
};
</script>

<style lang="less">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  // overflow: hidden;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#app {
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
