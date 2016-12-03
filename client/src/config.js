let instance = null;

/*
* Configuration passed in from the loader app.
* TODO - This is a Singleton, so it doesn't need to be a "Class." Use an object literal instead.
*/
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
