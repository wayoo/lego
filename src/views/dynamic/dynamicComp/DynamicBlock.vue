<template>
  <div class="block">
    <component ref="comp" :is="componentId" v-if="componentId && tmplData"
        :data="tmplData" :name="name" @compAction="onCompAction"></component>
  </div>
</template>

<script>
export default {
  name: 'dynamic-block',
  props: {
    name: {
      type: String,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    // if not is adding component, use manually setted data
    // otherwise using props.data, hency you should watch this.props.data for updaing tmplData
    // otherwise will broken data reacting...
    // force update will update this
    // const data = this.data.IS_COMP_ADDING ? this.data : (this.tmplData || null);
    return {
      tmplData: this.data,
      componentId: null,
    };
  },
  computed: {
    loader() {
      // eslint-disable-next-line prefer-template
      return () => import('../components/' + this.name);
    },
  },
  watch: {
    name: {
      handler() {
        this.render();
      },
    },
    data(val) {
      this.tmplData = val;
      // console.log(val);
    },
  },
  methods: {
    render() {
      // test this module getter can get specifiied module
      this.loader()
        .then(() => {
          // if this.loader can be called,
          // assign this module getter to component
          this.componentId = () => this.loader();
        })
        .catch(() => {
          // pre setted loader  () => import(`../components/${this.data.name}`); not working
          // failback to module not found block
          this.componentId = () => import('../components/NotFound.vue');
        });
    },
    setData(data) {
      this.tmplData = data;
      // const fn = this.$refs.comp.setData;
      // fn && fn(data);
    },
    onCompAction(data) {
      this.$emit('compAction', data);
    },
  },
  created() {
    this.render();
  },
};
</script>

<style lang="less">
// .block {
//   padding: 20px;
//   // border: 1px solid red;
//   background: #fff;
// }
</style>
