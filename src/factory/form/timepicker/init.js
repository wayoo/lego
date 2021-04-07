import { idGenerator } from '../../../utils';

export default () => {
  return {
    id: idGenerator(),
    tag: 'el-time-picker',
    props: {
      placeholder: '选择时间',
    },
  };
};
