class IndexedDB {
  constructor() {
    this.dbName = 'orderAppDB';
    this.dbVersion = 1;
    this.db = null;
  }

  // 初始化数据库
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('IndexedDB 打开失败:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB 打开成功');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 创建菜品存储
        if (!db.objectStoreNames.contains('dishes')) {
          db.createObjectStore('dishes');
        }

        // 创建选中菜品存储
        if (!db.objectStoreNames.contains('selectedDishes')) {
          db.createObjectStore('selectedDishes');
        }

        // 创建纪念日存储
        if (!db.objectStoreNames.contains('anniversaries')) {
          db.createObjectStore('anniversaries', { keyPath: 'id' });
        }

        console.log('IndexedDB 升级成功');
      };
    });
  }

  // 保存数据
  async save(storeName, key, data) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data, key);

      request.onerror = (event) => {
        console.error('保存数据失败:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('保存数据成功');
        resolve();
      };
    });
  }

  // 获取数据
  async get(storeName, key) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = (event) => {
        console.error('获取数据失败:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('获取数据成功');
        resolve(request.result);
      };
    });
  }

  // 获取所有纪念日数据
  async getAllAnniversaries() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['anniversaries'], 'readonly');
      const store = transaction.objectStore('anniversaries');
      const request = store.getAll();

      request.onerror = (event) => {
        console.error('获取纪念日数据失败:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('获取纪念日数据成功');
        resolve(request.result);
      };
    });
  }

  // 添加纪念日
  async addAnniversary(anniversary) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['anniversaries'], 'readwrite');
      const store = transaction.objectStore('anniversaries');
      const request = store.add(anniversary);

      request.onerror = (event) => {
        console.error('添加纪念日失败:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('添加纪念日成功');
        resolve();
      };
    });
  }

  // 更新纪念日
  async updateAnniversary(anniversary) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['anniversaries'], 'readwrite');
      const store = transaction.objectStore('anniversaries');
      const request = store.put(anniversary);

      request.onerror = (event) => {
        console.error('更新纪念日失败:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('更新纪念日成功');
        resolve();
      };
    });
  }

  // 删除纪念日
  async deleteAnniversary(id) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['anniversaries'], 'readwrite');
      const store = transaction.objectStore('anniversaries');
      const request = store.delete(id);

      request.onerror = (event) => {
        console.error('删除纪念日失败:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('删除纪念日成功');
        resolve();
      };
    });
  }

  // 清除所有数据
  async clear(storeName) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = (event) => {
        console.error('清除数据失败:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('清除数据成功');
        resolve();
      };
    });
  }
}

// 导出单例
export default new IndexedDB();