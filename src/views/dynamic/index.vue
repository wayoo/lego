<template>
    <div>
      <comp-render :data="pageConf.components"
        v-if="pageConf.components"
        ref="compRender" @compAction="onCompAction"></comp-render>
    </div>
</template>

<script>
import ComponentFactory from './dynamicComp/CompFactory';
// import ComponentFactory from './dynamicComp/CompFactory';
import CompRender from './dynamicComp/CompRender';

export default {
  name: 'decoration',
  components: {
    CompRender,
  },
  data() {
    const pageId = this.$route.params.id;
    console.log(pageId);

    return {
      pageId,
      pageConf: {
        url: '/home/index',
        components: [],
      },
    };
  },
  methods: {
    getData() {
      const conf = localStorage.getItem('__dp__conf');
      if (conf) {
        try {
          this.pageConf = JSON.parse(conf);
          return;
        } catch (e) {
          console.log(e);
        }
      }
      this.pageConf.components = [ComponentFactory.createRootComponent()];
      // this.$api.dynamicPages.get({ pageId: this.pageId }).then((res) => {
      //   if (res.code === 0) {
      //     if (!(res.data.components && res.data.components.length !== 0)) {
      //       // eslint-disable-next-line no-param-reassign
      //       res.data.components = [ComponentFactory.create('root')];
      //     }
      //     console.log(res.data);
      //     this.pageConf = res.data;
      //   }
      // });
    },

    onCompAction(data) {
      this[data.name](...data.arguments);
      // this[data.name].apply(this, data.arguments);
      // console.log(data);
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style lang="less" src="./index.less"></style>
