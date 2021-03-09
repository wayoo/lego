/* eslint-disable func-names */
/* eslint-disable consistent-return */
let i = 0;

function idGenerator() {
  i += 1;
  return `c_${new Date() - 0}${i}`;
}

const ComponentFactory = {};
const factorys = {};

ComponentFactory.idGenerator = idGenerator;

ComponentFactory.create = function (category, name) {
  let comp;
  let fn;
  switch (category) {
    case 'block':
      fn = factorys[category] && factorys[category][name];
      if (fn) {
        comp = fn();
      } else {
        comp = this.createBlock(name);
      }
      break;
    case 'layout':
      fn = factorys[category] && factorys[category][name];
      if (fn) {
        comp = fn();
      } else {
        // not registerd module type
        console.error(`module type [${name}] is not defined! `);
        comp = null;
      }
      break;
    case 'root':
      comp = this.createRootComponent();
      break;
    default:
      console.log('un handled create');
      break;
  }
  return comp;
};

ComponentFactory.register = function (category, name, fn) {
  if (!factorys[category]) {
    factorys[category] = {};
  }

  factorys[category][name] = fn;
};

ComponentFactory.createBlock = function (name) {
  return {
    tag: 'dynamic-block',
    id: idGenerator(),
    name,
    category: 'block',
    props: {
      data: {
        IS_COMP_ADDING: true,
      },
    },
  };
};

ComponentFactory.createRootComponent = function () {
  return {
    tag: 'div',
    name: 'root',
    id: idGenerator(),
    class: {
      'dynamic-comp-root': true,
    },
    children: [
      this.create('layout', 'Section'),
    ],
  };
};

ComponentFactory.register('block', 'Tabs', () => ({
  id: idGenerator(),
  name: 'Tabs',
  tag: 'el-tabs',
  rootElem: true,
  style: {
  },
  children: [
    {
      tag: 'el-tab-pane',
      id: idGenerator(),
      name: 'Tabs',
      props: {
        label: 'Tab 1',
      },
      children: [],
    },
    {
      tag: 'el-tab-pane',
      id: idGenerator(),
      name: 'Tabs',
      props: {
        label: 'Tab 2',
      },
      children: [],
    },
  ],
}));

ComponentFactory.register('block', 'Carousel', () => ({
  id: idGenerator(),
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
      id: idGenerator(),
      name: 'Carousel',
      children: [],
    },
    {
      tag: 'el-carousel-item',
      id: idGenerator(),
      name: 'Carousel',
      children: [],
    },
  ],
}));

ComponentFactory.register('block', 'Text', () => ({
  tag: 'dynamic-block',
  id: idGenerator(),
  name: 'Text',
  category: 'block',
  props: {
    data: {
      IS_COMP_ADDING: true,
      content: '',
    },
  },
}));

ComponentFactory.register('layout', 'Section', () => ({
  id: idGenerator(),
  name: 'Section',
  tag: 'div',
  children: [],
}));

ComponentFactory.register('layout', 'Container', () => ({
  id: idGenerator(),
  name: 'Container',
  tag: 'div',
  class: {
    container: true,
  },
  style: {
  },
  children: [],
}));

ComponentFactory.register('layout', 'Columns', () => ({
  tag: 'el-row',
  name: 'Columns',
  rootElem: true,
  id: idGenerator(),
  children: [{
    tag: 'el-col',
    id: idGenerator(),
    name: 'Columns',
    props: {
      span: 12,
    },
    children: [],
  },
  {
    tag: 'el-col',
    id: idGenerator(),
    name: 'Columns',
    props: {
      span: 12,
    },
    children: [],
  },
  ],
}));

ComponentFactory.register('layout', 'Flexs', () => ({
  tag: 'div',
  name: 'Flexs',
  style: {
    display: 'flex',
  },
  rootElem: true,
  id: idGenerator(),
  children: [{
    tag: 'div',
    id: idGenerator(),
    name: 'Flexs',
    style: {
      flex: 1,
    },
    children: [],
  },
  {
    tag: 'div',
    id: idGenerator(),
    name: 'Flexs',
    style: {
      flex: 1,
    },
    children: [],
  },
  ],
}));

export default ComponentFactory;
