import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import DynamicBlock from './DynamicBlock.vue';
import ComponentFactory from './CompFactory';
import { findModulePosition, findModulePath, getModuleMetadata } from './utils';

function scrollTop() {
  const scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName('html')[0].scrollTop;
  return scrollPos;
}

function findParentByClass(elem, c) {
  let container = elem;
  while (container.tagName !== 'BODY'
            && !container.classList.contains(c)) {
    container = container.parentNode;
  }
  return container.tagName === 'BODY' ? null : container;
}

function parentHasComponent(elem, name) {
  let p = elem;
  while (p.tagName !== 'BODY' && (p.getAttribute('data-comp-name') !== name)) {
    p = p.parentNode;
  }
  return p.tagName !== 'BODY';
}

// can't handle complex third-party components like ElementUI Carousel, Tabs
// since they are wrapped with other container
// hence child.parentNode !== rootElement
function findComponent(elem) {
  let comp;
  comp = findParentByClass(elem, 'block');
  if (comp) { return comp; }
  comp = findParentByClass(elem, 'dynamic-comp');
  if (!comp) { return null; }
  // auto find dynamic-comp parentNode like Flexs, Columns, etc
  while (comp.parentNode.getAttribute('data-comp-name')
                === comp.getAttribute('data-comp-name')) {
    comp = comp.parentNode;
  }
  return comp;
}

const componentInstances = {};

const expandEmptyChildrenComps = [
  // layout
  'Section',
  'Container',
  'Columns',
  'Flexs',

  // component
  'Component',

  // ui
  'Tabs',
  'Carousel',
  'Form',
];

export default {
  components: {
    DynamicBlock,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    renderOnly: {
      type: Boolean,
    },
  },
  data() {
    return {
      i: 0,
      compList: [],
      isDragging: false,
      draggingInfo: {},
    };
  },
  computed: {
    ...mapState({
      placeholder: (s) => s.client.placeholder,
      activeComp: (s) => s.client.activeComp,
    }),
  },
  methods: {
    ...mapMutations(['setClientPlaceholder', 'resetClientPlaceholder', 'setClientActiveComp']),
    // 记录选中的模块
    setActiveComponent(comp) {
      this.setClientActiveComp(comp);
      this.reportActiveCompPosition();
    },
    deActiveComponent() {
      this.setClientActiveComp({});
      this.hideOutline();
    },
    reportActiveCompPosition() {
      const { id } = this.activeComp.blockInfo;
      const elem = document.querySelector(`.dynamic-comp-id-${id}`);
      this.reportPosition('click_block', elem, this.activeComp.blockInfo);
    },
    reportUpdateCompPosition() {
      const { id } = this.activeComp.blockInfo;
      const elem = document.querySelector(`.dynamic-comp-id-${id}`);
      this.reportPosition('update_block', elem, this.activeComp.blockInfo);
    },
    /** *** method involve with parent start ** */
    reportPosition(type, elem, block) {
      if (!elem) { return; }
      const rect = elem.getBoundingClientRect();
      const msg = {
        action: type,
        data: {
          blockInfo: block,
          rect,
          scrollTop: scrollTop(),
        },
      };
      this.sendBridgeMessage(msg);
    },
    // highlight hovered block
    onMouseleave() {
      this.hideHover();
      // this.sendBridgeMessage({
      //   action: 'unhover_block',
      // });
    },
    // columns element can't be moved from parent to child
    // same element
    checkWeakValidity(container) {
      const id = container.getAttribute('data-id');
      const pid = container.parentNode.getAttribute('data-id');
      if (id === this.draggingInfo.id) {
        return false;
      }
      if (pid === this.draggingInfo.id) {
        return false;
      }
      return true;
    },
    // section can only be placed at top level
    // container can't be nested
    checkStrongValidity(parent) {
      // const parent = target.parentNode;
      const { name } = this.draggingInfo;
      if (name === 'Section') {
        if (!parent.classList.contains('dynamic-comp-root')) {
          return false;
        }
      }
      if (name === 'Container') {
        if (parentHasComponent(parent, 'Container')) {
          return false;
        }
      }
      return true;
    },
    hidePlaceholder() {
      this.sendBridgeMessage({
        action: 'hide_placeholder',
      });
    },
    hideOutline() {
      this.sendBridgeMessage({
        action: 'hide_outline',
      });
    },
    hideHover() {
      this.sendBridgeMessage({
        action: 'unhover_block',
      });
    },
    // given an block/component
    // validate com
    normalizeCompRootElem(elem) {
      const root = elem;
      // let parent;
      // const compName = root.getAttribute('data-comp-name');
      // // dynamic bubble to root component
      // if (['Carousel'].includes(compName)) {
      //   parent = findParentByClass(root.parentNode, 'dynamic-comp');
      //   if (parent.getAttribute('data-comp-name') === compName) {
      //     root = parent;
      //   }
      // }
      return root;
    },
    // determin which position module will be inserted
    onReportPlaceholder(e, block) {
      // only show place holder in dragging process;
      // if (!this.isDraggingComponent) { return; }
      // only handle left clicked event;
      if (e.which !== 1) { return; }

      let container = findParentByClass(e.target, 'block')
                        || findParentByClass(e.target, 'dynamic-comp');

      if (!container) {
        console.log('parent not found');
        return;
      }

      container = this.normalizeCompRootElem(container);

      if (!this.checkWeakValidity(container)) {
        this.resetClientPlaceholder();
        this.hidePlaceholder();
        return;
      }
      // const parent = container.parentNode;
      const id = container.getAttribute('data-id');

      const isInside = container.classList.contains('comp-empty');
      const isValid = this.checkStrongValidity(isInside ? container : container.parentNode);

      // e = Mouse click event.
      const rect = container.getBoundingClientRect();
      this.sendBridgeMessage({
        action: 'child_show_placeholder',
        data: {
          rect,
          pointer: {
            clientX: e.clientX,
            clientY: e.clientY,
          },
          scrollTop: scrollTop(),
          blockInfo: block,
          isInside,
          isValid,
        },
      });
      const direction = (e.clientY - rect.top) < (rect.height / 2) ? 'top' : 'bottom';
      this.setClientPlaceholder({
        blockInfo: {
          id,
        },
        direction,
        isInside,
        isValid,
      });
    },
    // insert module into returned positon of a list
    insertCompData(ret, module) {
      let i = ret.index;
      if (this.placeholder.isInside) {
        // add to block child;
        ret.list[ret.index].children.push(module);
        this.$forceUpdate();
      } else {
        if (this.placeholder.direction === 'bottom') {
          // eslint-disable-next-line no-plusplus
          i++;
        }
        ret.list.splice(i, 0, module);
      }
      setTimeout(() => {
        this.setActiveComponent(module);
      }, 16);
      this.resetClientPlaceholder();
    },
    /**
     * dragging position of existed components
     */
    moveComponent() {
      // moved and target is the same block, ignore this error triggered click event;
      if (!this.placeholder.blockInfo.id) {
        return;
      }
      if (this.draggingInfo.id === this.placeholder.blockInfo.id) {
        return;
      }
      const movedPos = findModulePosition(this.compList, this.draggingInfo.id);
      const targetPos = findModulePosition(this.compList, this.placeholder.blockInfo.id);
      const module = movedPos.list.splice(movedPos.index, 1);
      console.log(module, this.draggingInfo.id);
      this.insertCompData(targetPos, module[0]);
      this.channelClientSyncModuleList();
    },
    createComponent() {
      // find module position in the json file
      const ret = findModulePosition(this.compList, this.placeholder.blockInfo.id);
      const module = ComponentFactory.create(this.draggingInfo.category, this.draggingInfo.name);
      if (module) {
        module.typeId = this.draggingInfo.typeId;
        module.remote = this.draggingInfo.remote;
        this.insertCompData(ret, module);
      }
      this.channelClientSyncModuleList();
    },
    /**
     * case 1: add_new_component
     * case 2: dragging position of existed component
     */
    afterModuleDragging() {
      this.isDragging = false;
      if (this.placeholder.isValid === false) { return; }

      if (this.draggingInfo.type === 'move_component') {
        this.moveComponent();
        return;
      }
      if (this.draggingInfo.type !== 'add_new_component') { return; }
      this.createComponent();
    },
    renderConfig(h, data) {
      if (!data) { return console.error('no data'); }
      let childNodes = [];

      // auto inject subElem property to prevent drag
      if (data.rootElem) {
        data.children.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.subElem = true;
        });
      }

      if (Object.prototype.toString.call(data) === '[object String]') {
        return data;
      }
      const option = {};

      // @see https://vuejs.org/v2/guide/render-function.html
      option.class = data.class || {};
      option.style = data.style || {};
      option.attrs = data.attrs || {};
      option.props = data.props || {};
      option.domProps = data.domProps || {};
      option.on = data.on || {};
      option.nativeOn = data.nativeOn || {};
      option.ref = data.ref || data.id;
      option.key = data.key || data.id;

      // nativeOn only valid on component
      if (data.tag === 'div') {
        delete option.nativeOn;
      }

      if (this.renderOnly) {
        // handle several events
        if (data.tag === 'dynamic-block') {
          option.props.name = data.name;
          option.props.blockInfo = data;
        }
        if (data.children) {
          childNodes = data.children.map((n) => this.renderConfig(h, n));
        }
        return h(data.tag, option, childNodes);
      }

      // add empty layout class
      if (expandEmptyChildrenComps.includes(data.name) && data.children.length === 0) {
        option.class['comp-empty'] = true;
      } else {
        option.class['comp-empty'] = false;
      }

      // add component id for further usage
      if (data.id) {
        option.attrs['data-id'] = `${data.id}`;
        option.attrs['data-comp-name'] = `${data.name}`;
        option.class[`dynamic-comp-id-${data.id}`] = true;
      }

      // handle several events
      if (data.tag === 'dynamic-block') {
        option.props.name = data.name;
        option.attrs['data-id'] = `${data.id}`;
        option.class[`dynamic-comp-id-${data.id}`] = true;

        // dynamic block
        option.nativeOn.mouseover = (e) => {
          e.stopPropagation();
          const root = findParentByClass(e.target, 'block');
          this.reportPosition('hover_block', root, data);
        };
        option.nativeOn.mouseleave = this.onMouseleave;
        option.nativeOn.click = (e) => {
          e.stopPropagation();
          this.setActiveComponent(data);
        };
        option.on.compAction = this.onReceiveComponentAction;
      } else if (option.class['dynamic-comp-root']) {
        // root element
        option.on.mousemove = (e) => {
          // check left mouse is pressed
          if (e.which !== 1) {
            return;
          }
          if (this.draggingInfo.type === 'prepare_move_component') {
            this.enterMoveCompDragging(e);
          }
          if (!this.isDragging) { return; }
          this.onReportPlaceholder(e);
        };
        option.on.mouseup = () => {
          if (this.draggingInfo.type === 'prepare_move_component') {
            this.resetDraggingInfo();
          }
          this.hidePlaceholder();
          if (!this.isDragging) { return; }
          this.afterModuleDragging();
        };
        option.on.mousedown = this.prepareToMoveComp;
        // mouse moved out of work space, hide placeholder for misleading module insertation
        option.on.mouseleave = () => {
          this.hidePlaceholder();
        };
      } else if (data.name === 'Component' && data.children.length) {
        const self = this;
        if (!componentInstances[`test-comp-${option.key}`]) {
          componentInstances[`test-comp-${option.key}`] = true;
          Vue.component(`test-comp-${option.key}`, {
            data() {
              return {
                tmpl: data.tmplData || {},
              };
            },
            render(c) {
              // eslint-disable-next-line
              const vm = this;

              // eslint-disable-next-line
              for (let i = 0, l = data.children.length; i < l; i++) {
                const pager = data.children[i];
                // eslint-disable-next-line no-param-reassign
                // data.children[0].props['current-page'] = this.val;
                // pager.props['current-page'] = this.tmpl.val;
                // eslint-disable-next-line no-param-reassign
                pager.on = pager.on || {};
                // pager.events = undefined;
                // eslint-disable-next-line
                for (const fnKey in pager.events) {
                  const fnStr = pager.events[fnKey];
                  const fnId = fnKey.replace('-', '') + pager.id;
                  // eslint-disable-next-line
                  const s = `
                  vm.fn${fnId} = ${fnStr};
                  pager.on['${fnKey}'] = function() { vm.fn${fnId}.apply(vm, arguments); }`;
                  // eslint-disable-next-line
                  eval(s);
                  console.log(`====> bind Function: ${fnKey}`);
                }

                // bind props
                // eslint-disable-next-line
                for (const propKey in pager.propsBinds) {
                  const bindVal = pager.propsBinds[propKey];
                  const s = `
                  pager.props.${propKey} = this.${bindVal}
                  `;
                  // eslint-disable-next-line
                  eval(s);
                  console.log(`====> bind Props: ${propKey}`);
                }
              }

              childNodes = data.children.map((n) => {
                if (n.category === 'component') {
                  // eslint-disable-next-line
                  n.template = n.template || 'hell wolrD!';
                  const node = self.renderConfig(h, n);
                  console.log(node);
                  return node;
                }
                return self.renderConfig(h, n);
              });
              childNodes.unshift(h('div', {
                style: { 'white-space': 'pre-wrap' },
              }, [
                '==== [模板数据] ====',
                h('br'),
                `${JSON.stringify({ tmpl: this.tmpl }, null, '  ')}`,
                h('br'),
                h('br'),
              ]));
              // const pager = childNodes[1];
              return c(data.tag, option, childNodes);
            },
            created() {
              console.log('CCCC RRRRR', data.tmplData, data);
            },
          });
        }
        // hook VUE component instance
        return h(`test-comp-${option.key}`, {
          ref: data.id,
        });
      } else if (!data.ignore) {
        // if (data.name === 'Pagination') {
        //   debugger;
        // }

        // dynamic component
        option.class['dynamic-comp'] = true;
        const eventReceiver = data.tag === 'div' ? 'on' : 'nativeOn';
        option[eventReceiver].mouseover = (e) => {
          e.stopPropagation();
          const root = findParentByClass(e.target, 'dynamic-comp');
          this.reportPosition('hover_block', root, {
            name: data.name,
          });
        };
        option[eventReceiver].mouseleave = this.onMouseleave;
        option[eventReceiver].click = (e) => {
          e.stopPropagation();
          let root = findParentByClass(e.target, 'dynamic-comp');
          root = this.normalizeCompRootElem(root);
          // console.log(root.getAttribute('data-id'));
          const ret = findModulePosition(this.compList, root.getAttribute('data-id'));
          this.setActiveComponent(ret.list[ret.index]);
        };
      }

      // FIXME Carousel doesn't watch interval props
      // must rerender;
      if ((data.name === 'Carousel' && data.rootElem)) {
        option.key = ComponentFactory.idGenerator();
      }

      if (data.children) {
        childNodes = data.children.map((n) => this.renderConfig(h, n));
      }
      return h(data.tag, option, childNodes);
    },
    // onReceiveComponentAction
    // used to invoking other component's function
    onReceiveComponentAction(data) {
      // FIXME. do not invking parent api
      this.$emit('compAction', data);
    },
    // ------ end ---------
    channelParentDragNewComp(data) {
      this.isDragging = true;
      this.draggingInfo = {
        ...data,
        type: 'add_new_component',
      };
    },
    channelParentDragExistedComp(data) {
      // FIXME need clear this info while parent mouseup
      this.setDraggingInfo('prepare_move_component', data.data.id, data.data.name);
    },
    resetDraggingInfo() {
      this.draggingInfo = {
        type: '',
        id: '',
        name: '',
      };
    },
    prepareToMoveComp(e) {
      this.deActiveComponent();
      const comp = findComponent(e.target);
      if (comp) {
        const name = comp.getAttribute('data-comp-name');
        this.setDraggingInfo('prepare_move_component', comp.getAttribute('data-id'), name);
      }
    },
    setDraggingInfo(type, id, name) {
      this.draggingInfo = {
        type,
        id,
        name,
      };
    },
    enterMoveCompDragging(e) {
      console.error('move ...');
      // only used to check valid drag, drag target is being setted
      // at previous step prepare_move_component
      const comp = findParentByClass(e.target, 'block')
                  || findParentByClass(e.target, 'dynamic-comp');

      // check this.deaggingInfo.id is valid
      const modPos = findModulePosition(this.compList, this.draggingInfo.id);
      const module = modPos.list[modPos.index];
      if (module.subElem) {
        this.$message.error('无法直接拖拽子组件元素，请点击左上角选择整个组件!');
        this.resetDraggingInfo();
        return;
      }

      if (comp) {
        this.isDragging = true;
        this.draggingInfo.type = 'move_component';
        this.resetClientPlaceholder();
      }
    },
    handleUpdateComponentData(data) {
      const module = data.data;
      const ret = findModulePosition(this.compList, module.id);
      Vue.set(ret.list, ret.index, module);
      this.$nextTick(() => {
        this.reportUpdateCompPosition();
      });
      this.channelClientSyncModuleList();
    },
    channelParentDeleteComp(data) {
      const ret = findModulePosition(this.compList, data.data.id);
      console.log(ret);
      ret.list.splice(ret.index, 1);
      this.deActiveComponent();
      this.channelClientSyncModuleList();
    },
    channelFindCompHierarchy(data) {
      const paths = findModulePath(this.compList, data.data.id);
      this.sendBridgeMessage({
        token: data.token,
        data: paths,
      });
    },
    channelParentClickComp(data) {
      const ret = findModulePosition(this.compList, data.data.id);
      this.setActiveComponent(ret.list[ret.index]);
      // const elem = document.querySelector(`.dynamic-comp-id-${data.data.id}`);
      // this.reportPosition('click_block', elem, data.data);
    },
    channelParentHoverComp(data) {
      // const root = document.querySelector();
      // this.reportPosition('hover_block', root, data.props.data);
      const elem = document.querySelector(`.dynamic-comp-id-${data.data.id}`);
      console.log(data.data);
      this.reportPosition('hover_block', elem, data.data);
    },
    // -------- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    channelClientSyncModuleList() {
      this.sendBridgeMessage({
        action: 'client_sync_module_list',
        data: this.compList,
      });
    },
    // sendMessage(data) {
    //   this.sendBridgeMessage(data);
    // },
    /**
     * *  method involve with parent end  **
     */
    downloadConfFile(d) {
      const data = getModuleMetadata(this.compList);
      console.log(JSON.stringify(data, undefined, 4));
      this.sendBridgeMessage({
        token: d.token,
        data: {
          components: this.compList,
        },
      });
    },
    receiveMessage(msg) {
      if (msg.data.type !== 'bridge-message') { return; }
      switch (msg.data.data.action) {
        case 'start_tracking_mouse':
          window.addEventListener('mousemove', this.docMousemove);
          window.addEventListener('mouseup', this.stopTrackingMouse);
          break;
        case 'stop_tracking_mouse':
          window.removeEventListener('mousemove', this.docMousemove);
          break;
        case 'start_dragging_existed_comp':
          this.channelParentDragExistedComp(msg.data.data);
          break;
        case 'start_dragging_new_comp':
          this.channelParentDragNewComp(msg.data.data.data);
          break;
        case 'update_component_data':
          this.handleUpdateComponentData(msg.data.data);
          break;
        case 'download_block_data':
          this.downloadConfFile(msg.data.data);
          break;
        case 'find_comp_hierarchy':
          this.channelFindCompHierarchy(msg.data.data);
          break;
        case 'parent_hover_comp':
          this.channelParentHoverComp(msg.data.data);
          break;
        case 'parent_click_comp':
          this.channelParentClickComp(msg.data.data);
          break;
        case 'parent_delete_comp':
          this.channelParentDeleteComp(msg.data.data);
          break;
        default:
          console.log(msg.data);
          break;
      }
      this.sendBridgeMessage({
        token: msg.data.data.token,
      });
    },
    // notify child scoll event to parent, for outline position update usage
    onScroll() {
      this.sendBridgeMessage({
        action: 'window_scroll',
        data: {
          scrollTop: scrollTop(),
        },
      });
    },
    // notify mouse movue event when add component
    docMousemove(e) {
      this.sendBridgeMessage({
        action: 'drag_move',
        data: {
          clientX: e.clientX,
          clientY: e.clientY,
        },
      });
    },
    // notify parent frame;
    // after component added, clear related events
    stopTrackingMouse() {
      window.removeEventListener('mousemove', this.docMousemove);
      window.removeEventListener('mouseup', this.stopTrackingMouse);
      // if (findParentByClass(e.target, 'dynamic-comp-root')) {
      //   // dynamic components doesn't need this add method;
      //   return;
      // }
      this.sendBridgeMessage({
        action: 'child_stop_tracking_mouse',
      });
    },
    sendBridgeMessage(data) {
      if (!window.parent) { return; }
      // not as subframe, not as decoration mode
      if (window === window.parent) { return; }
      const d = JSON.parse(JSON.stringify(data));
      // eslint-disable-next-line no-restricted-globals
      parent.postMessage({
        type: 'bridge-message',
        from: 'web',
        data: d,
      }, '*');
    },
    setData(id, data) {
      this.$refs[id].setData(data);
    },
  },
  render(h) {
    //
    this.compList = this.data;
    ComponentFactory.restore(this.compList);
    const childNodes = this.compList.map((n) => this.renderConfig(h, n));
    const result = h('div', childNodes);
    this.channelClientSyncModuleList();
    return result;
    // console.log(this.data);
    // return h('div', ['Text in Parent']);
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage);
    window.addEventListener('scroll', this.onScroll);
    // console.log(this.$refs);
    // setTimeout(() => {
    //   console.log(this.$refs['c_16142229717831'].setData({"trainInfo":{"id":322,"name":"商品支付订单测试商品支付订单测试商品支付","trainStartTime":"2021-02-02 00:00:00","trainEndTime":"2021-02-11 23:59:59","iconUrl":"https://hrss-tes.oss-cn-beijing.aliyuncs.com/hrss/image/54e205c5fb204ac7a8e49fe756285c67-测试图片.JPG","isDraw":0,"isFaceRecognize":0,"isAlertWindow":0,"alertWindowTip":"亲爱的学员，还在吗？请不要走开，点击 ”我在“继续学习，否则您离开的时间将不计入学时","alertTime":10,"description":"商品支付订单测试商品支付订单测试商品支付订单测试商品支付订单测试训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍训练营介绍\n","publishStatus":2,"status":3,"createTime":"2021-02-02 14:54:00","createUserId":409,"updateUserId":409,"updateTime":"2021-02-02 14:55:35","isDel":0,"saasId":80,"studyHours":0.81,"studyProcess":10,"studyUpdateTime":"2021-02-12 00:00:00","isCandidphoto":0,"isFaceExamRecognize":0,"branchId":114,"isTrainTimePassed":3,"isConfigCert":0},"trainProcess":0,"courseCount":1}));
    // }, 1);
  },
  beforeDestroy() {
    this.hideHover();
    this.hideOutline();
    this.hidePlaceholder();
  },
};
