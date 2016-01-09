let instance = null;

export default class Config {

  constructor(config) {
    if (!instance) {
      this.hostUrl = config.hostUrl;
      this.apiUrl = config.apiUrl;
      this.uid = config.uid;
      this.cn = config.cn;
      instance = this;
    }
    return instance;
  }

  static getInstance() {
    return instance;
  }

}
