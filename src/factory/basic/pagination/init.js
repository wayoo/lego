import { idGenerator } from '../../../utils';

export default () => {
  return {
    id: idGenerator(),
    name: 'Pagination',
    tag: 'el-pagination',
    props: {
      total: 50,
    },
  };
};
