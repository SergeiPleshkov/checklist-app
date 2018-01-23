class Db {
  getItem(key) {
    return Promise.resolve(JSON.parse(localStorage.getItem(key)));
  }
  
  setItem(key, data) {
    return Promise.resolve(localStorage.setItem(key, JSON.stringify(data)));
  }
}