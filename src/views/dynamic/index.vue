<template>
    <div>
      <comp-render :data="pageConf.components"
        v-if="pageConf.components"
        ref="compRender" @compAction="onCompAction"></comp-render>
    </div>
</template>

<script>
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
      this.pageConf.components = [
        {
          tag: 'div',
          name: 'root',
          id: 'c_16156286044931',
          class: {
            'dynamic-comp-root': true,
            'comp-empty': false,
            'dynamic-comp-id-c_16156286044931': true,
          },
          children: [
            {
              id: 'c_16156286044932',
              name: 'Section',
              tag: 'div',
              children: [
                {
                  id: 'c_16156286136503',
                  name: 'Container',
                  tag: 'div',
                  class: {
                    container: true,
                    'comp-empty': true,
                    'dynamic-comp-id-c_16156286136503': true,
                    'dynamic-comp': true,
                  },
                  style: {},
                  children: [],
                },
              ],
            },
            {
              id: 'c_16156286167664',
              name: 'Section',
              tag: 'div',
              children: [
                {
                  id: 'c_16156286336868',
                  name: 'Container',
                  tag: 'div',
                  class: {
                    container: true,
                    'comp-empty': false,
                    'dynamic-comp-id-c_16156286336868': true,
                    'dynamic-comp': true,
                  },
                  style: {},
                  children: [
                    {
                      tag: 'div',
                      name: 'Flexs',
                      style: {
                        display: 'flex',
                      },
                      rootElem: true,
                      id: 'c_16156286356349',
                      children: [
                        {
                          tag: 'div',
                          id: 'c_161562863563410',
                          name: 'Flexs',
                          style: {
                            width: '280px',
                            margin: '0 10px 0 0',
                          },
                          children: [],
                        },
                        {
                          tag: 'div',
                          id: 'c_161562863563411',
                          name: 'Flexs',
                          style: {
                            flex: 1,
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'c_161562865368912',
              name: 'Section',
              tag: 'div',
              children: [
                {
                  id: 'c_161562865850413',
                  name: 'Container',
                  tag: 'div',
                  class: {
                    container: true,
                    'comp-empty': false,
                    'dynamic-comp-id-c_161562865850413': true,
                    'dynamic-comp': true,
                  },
                  style: {},
                  children: [
                    {
                      id: 'c_16156289298452',
                      name: 'Carousel',
                      tag: 'el-carousel',
                      rootElem: true,
                      props: {
                        autoplay: false,
                        interval: 3000,
                      },
                      children: [
                        {
                          tag: 'el-carousel-item',
                          id: 'c_16156289298463',
                          name: 'Carousel',
                          children: [],
                        },
                        {
                          tag: 'el-carousel-item',
                          id: 'c_16156289298464',
                          name: 'Carousel',
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'c_161562866058514',
                      name: 'Tabs',
                      tag: 'el-tabs',
                      rootElem: true,
                      style: {},
                      children: [
                        {
                          tag: 'el-tab-pane',
                          id: 'c_161562866058515',
                          name: 'Tabs',
                          props: {
                            label: 'Tab 1',
                          },
                          children: [],
                        },
                        {
                          tag: 'el-tab-pane',
                          id: 'c_161562866058516',
                          name: 'Tabs',
                          props: {
                            label: 'Tab 2',
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'c_161562872737716',
              name: 'Section',
              tag: 'div',
              children: [
                {
                  id: 'c_161562873026817',
                  name: 'Container',
                  tag: 'div',
                  class: {
                    container: true,
                    'comp-empty': false,
                    'dynamic-comp-id-c_161562873026817': true,
                    'dynamic-comp': true,
                  },
                  style: {},
                  children: [
                    {
                      tag: 'el-carousel-item',
                      id: 'c_161562873275619',
                      name: 'Carousel',
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'c_16156286890481',
              name: 'Section',
              tag: 'div',
              children: [
                {
                  id: 'c_16156286957993',
                  name: 'Container',
                  tag: 'div',
                  class: {
                    container: true,
                    'comp-empty': false,
                    'dynamic-comp-id-c_16156286957993': true,
                    'dynamic-comp': true,
                  },
                  style: {},
                  children: [
                    {
                      tag: 'el-form',
                      name: 'Form',
                      rootElem: true,
                      id: 'c_16156286975204',
                      children: [
                        {
                          tag: 'el-form-item',
                          name: 'Switch',
                          props: {
                            label: '属性12',
                          },
                          id: 'c_16156286991755',
                          children: [
                            {
                              tag: 'el-switch',
                              id: 'c_16156286991756',
                              ignore: true,
                              props: {
                                value: true,
                              },
                              on: {},
                              category: 'form',
                              children: [],
                            },
                          ],
                        },
                        {
                          tag: 'el-form-item',
                          name: 'Switch',
                          props: {
                            label: '属性2',
                          },
                          id: 'c_16156287072297',
                          children: [
                            {
                              tag: 'el-switch',
                              id: 'c_16156287072298',
                              ignore: true,
                              props: {
                                value: false,
                              },
                              on: {},
                              category: 'form',
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
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
