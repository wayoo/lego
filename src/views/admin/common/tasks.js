import Messenger from './messenger';

const msgr = new Messenger('#work-frame');
/* eslint-disable */
export const saveSiteData = function(pid) {
  return msgr.sendMessage({
    action: 'download_block_data',
  }).then((data) => {
    console.log(data);
    // eslint-disable-next-line no-param-reassign
    // data.pageId = this.$route.params.id;
    localStorage.setItem('__dp__conf', JSON.stringify(data));
  });
}
