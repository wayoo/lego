<template>
    <div>
      <comp-render :data="pageConf.components"
        v-if="pageConf.components"
        ref="compRender" @compAction="onCompAction"></comp-render>
    </div>
</template>

<script>
// import ComponentFactory from './dynamicComp/CompFactory';
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
      // return this.pageConf.components = [ComponentFactory.createRootComponent()];
      this.pageConf.components = [
        {
          tag: 'div',
          name: 'root',
          id: 'c_16166533567711',
          class: {
            'dynamic-comp-root': true,
            'comp-empty': false,
            'dynamic-comp-id-c_16166533567711': true,
          },
          children: [
            {
              id: 'c_16166612437992',
              name: 'Section',
              tag: 'div',
              children: [
                {
                  id: 'c_16166612411111',
                  name: 'Container',
                  tag: 'div',
                  class: {
                    container: true,
                    'comp-empty': false,
                    'dynamic-comp-id-c_16166612411111': true,
                    'dynamic-comp': true,
                  },
                  style: {},
                  children: [
                    {
                      tag: 'div',
                      name: 'Component',
                      id: 'c_16166533635933',
                      class: {
                        'comp-container': true,
                        'comp-empty': false,
                        'dynamic-comp-id-c_16166533635933': true,
                        'dynamic-comp': true,
                      },
                      children: [
                        {
                          id: 'c_16166533664524',
                          name: 'Pagination',
                          tag: 'el-pagination',
                          props: {
                            total: 50,
                            'current-page': 3,
                          },
                          on: {},
                          events: {
                            'current-change': "function (val) {\n    this.tmpl.val = val;\n    this.$notify.success({\n        message: '当前页面' + val\n    });\n}",
                          },
                        },
                        {
                          id: 'c_16166540756111',
                          name: 'Pagination',
                          tag: 'el-pagination',
                          props: {
                            total: 50,
                            'current-page': 3,
                            currentPage: 5,
                          },
                          on: {},
                          events: {
                            'current-change': "function (val) {\n    this.tmpl.val = val;\n    this.$notify.info({\n        message: '当前页面' + val\n    });\n}",
                          },
                          propsBinds: {
                            currentPage: 'tmpl.val',
                          },
                        },
                      ],
                      tmplData: {
                        name: 1212,
                        val: 5,
                      },
                      key: 1616653375082,
                    },
                  ],
                },
              ],
            },
            {
              id: 'c_161666142128211',
              name: 'Section',
              tag: 'div',
              children: [
                {
                  id: 'c_161666142290212',
                  name: 'Container',
                  tag: 'div',
                  class: {
                    container: true,
                    'comp-empty': false,
                    'dynamic-comp-id-c_161666142290212': true,
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
                      id: 'c_161666142464813',
                      children: [
                        {
                          tag: 'div',
                          id: 'c_161666142464814',
                          name: 'Flexs',
                          style: {
                            flex: 1,
                          },
                          children: [
                            {
                              id: 'c_16166675951541',
                              name: 'Carousel',
                              tag: 'el-carousel',
                              rootElem: true,
                              props: {
                                autoplay: true,
                                interval: 3000,
                              },
                              children: [
                                {
                                  tag: 'el-carousel-item',
                                  id: 'c_16166675951542',
                                  name: 'Carousel',
                                  children: [
                                    {
                                      tag: 'dynamic-block',
                                      id: 'c_16166676112538',
                                      name: 'Textarea',
                                      category: 'block',
                                      props: {
                                        data: {
                                          content: null,
                                        },
                                        name: 'Textarea',
                                      },
                                    },
                                  ],
                                  subElem: true,
                                },
                                {
                                  tag: 'el-carousel-item',
                                  id: 'c_16166675951543',
                                  name: 'Carousel',
                                  children: [
                                    {
                                      tag: 'dynamic-block',
                                      id: 'c_161666774617670',
                                      name: 'Textarea',
                                      category: 'block',
                                      props: {
                                        data: {
                                          content: null,
                                        },
                                        name: 'Textarea',
                                      },
                                    },
                                  ],
                                  subElem: true,
                                },
                              ],
                            },
                          ],
                          subElem: true,
                        },
                        {
                          tag: 'div',
                          id: 'c_161666142464815',
                          name: 'Flexs',
                          style: {
                            flex: 1,
                          },
                          children: [],
                          subElem: true,
                        },
                        {
                          tag: 'div',
                          id: 'c_16166614267533',
                          name: 'Flexs',
                          style: {
                            flex: 1,
                          },
                          children: [],
                          subElem: true,
                        },
                        {
                          tag: 'div',
                          id: 'c_16166614267534',
                          name: 'Flexs',
                          style: {
                            flex: 1,
                          },
                          children: [],
                          subElem: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'c_161666143003416',
              name: 'Section',
              tag: 'div',
              children: [
                {
                  id: 'c_161666143213917',
                  name: 'Container',
                  tag: 'div',
                  class: {
                    container: true,
                    'comp-empty': false,
                    'dynamic-comp-id-c_161666143213917': true,
                    'dynamic-comp': true,
                  },
                  style: {},
                  children: [
                    {
                      id: 'c_161666143604318',
                      name: 'Tabs',
                      tag: 'el-tabs',
                      rootElem: true,
                      style: {},
                      children: [
                        {
                          tag: 'el-tab-pane',
                          id: 'c_161666143604319',
                          name: 'Tabs',
                          props: {
                            label: 'Tab 1',
                          },
                          children: [],
                          subElem: true,
                        },
                        {
                          tag: 'el-tab-pane',
                          id: 'c_161666143604320',
                          name: 'Tabs',
                          props: {
                            label: 'Tab 2',
                          },
                          children: [],
                          subElem: true,
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
