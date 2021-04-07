<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
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

div[data-comp-name="Section"]:not(.comp-empty) {
  padding: 10px;
}
div[data-comp-name="Container"]:not(.comp-empty) {
  padding: 10px;
}
</style>
