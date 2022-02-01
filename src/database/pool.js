const mysql = require("mysql2/promise");

module.exports = {
  pool: null,

  getPool() {
    if (!this.pool) {
      throw new Error("Pool is not instantiated");
    }

    return this.pool;
  },

  connect({ host, port, user, password, database }) {
    if (this.pool) {
      throw new Error("Pool is already instantiated");
    }

    this.pool = mysql.createPool({ host, port, user, password, database });
  },

  disconnect() {
    if (!this.pool) {
      throw new Error("Cannot disconnect, there is no pool instantiated");
    }
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
      this.pool = null;
    });
  },
};
