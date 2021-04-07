import { idGenerator } from '../../../utils';

export default () => {
  const conf = {
    id: idGenerator(),
    name: 'datepicker',
    tag: 'el-date-picker',
    props: {
      type: 'date',
      placeholder: '选择日期',
      value: '',
    },
    // propsBinds
    // events
  };

  return conf;
};
