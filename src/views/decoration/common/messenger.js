class Messenger {
  constructor(selector) {
    this.selector = selector;
    // this.window = iframe.frame.contentWindow;
  }

  checkMsgTarget() {
    if (!this.window) {
      const iframe = document.querySelector(this.selector);
      if (!iframe) {
        console.error(`iframe [${this.sendMessage}] not found`);
        // return new Error(`iframe [${this.sendMessage}] not found`);
      }
      this.window = iframe.contentWindow;
    }
    return this.window;
  }

  sendMessage(data) {
    this.checkMsgTarget();

    return new Promise((resolve, reject) => {
      const token = new Date() - 0;
      let tid;
      this.window.postMessage({
        type: 'bridge-message',
        from: 'dashboard',
        data: {
          token,
          ...data,
        },
      }, '*');

      const fn = function _fn(res) {
        const d = res.data.data;
        if (res.data.type === 'bridge-message') {
          if (d.token === token) {
            clearTimeout(tid);
            window.removeEventListener('message', fn);
            resolve(d.data);
          }
        }
      };

      tid = setTimeout(() => {
        window.removeEventListener('message', fn);
        reject(new Error('timeout 60s'));
      }, 1000 * 10);
      window.addEventListener('message', fn);
    });
  }

  sendMessageWithoutCheck(data) {
    this.checkMsgTarget();

    this.window.postMessage({
      type: 'bridge-message',
      from: 'dashboard',
      data,
    }, '*');
  }
}

export default Messenger;
