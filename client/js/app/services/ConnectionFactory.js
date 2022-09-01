export const ConnectionFactory = (function () {
  let connection = null
  let close = null

  return class ConnectionFactory {
    static stores = []
    static version = 4
    static dbName = 'aluraframe'

    constructor() {
      throw Error('Não é possível criar instancias de ConnectionFactory')
    }

    static getConnection() {
      return new Promise((resolve, reject) => {
        const openRequest = window.indexedDB.open(this.dbName, this.version)

        openRequest.onupgradeneeded = (event) => {
          this._createStores(connection)
        }

        openRequest.onsuccess = (event) => {
          if (!connection) {
            connection = event.target.result
            close = connection.close
            connection.close = function () {
              throw Error('Você não pode fechar diretamente a conexão')
            }
          }
          resolve(event.target.result)
        }

        openRequest.onerror = (event) => {
          console.log(event.target.error)
          reject(event.target.error.name)
        }
      })
    }

    static closeConnection() {
      console.log(connection)
      if (connection) {
        // Reflect.apply(close, connection, [])
        console.log('aqui')
        close()
        connection = null
      }
    }

    static _createStores(connection) {
      this.stores.forEach((store) => {
        if (connection.objectStoreNames.contains(store)) {
          connection.deleteObjectStore(store)
        }

        connection.createObjectStore(store, { autoIncrement: true })
      })
    }
  }
})()
