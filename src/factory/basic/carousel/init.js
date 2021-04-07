import { idGenerator } from '../../../utils';

export default () => ({
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
});
