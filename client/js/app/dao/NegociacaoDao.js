import { Negociacao } from '../models/Negociacao.js'

export class NegociacaoDao {
  constructor(connection) {
    this._connection = connection
    this._store = 'negociacoes'
  }

  adiciona(negociacao) {
    return new Promise((resolve, reject) => {
      const request = this._connection
        .transaction([this._store], 'readwrite')
        .objectStore(this._store)
        .add(negociacao)

      request.onsuccess = (event) => {
        resolve()
      }

      request.onerror = (event) => {
        console.log(event.target.error)
        reject('Não foi possível adicionar a negociação')
      }
    })
  }

  listaTodos() {
    return new Promise((resolve, reject) => {
      const cursor = this._connection
        .transaction([this._store], 'readwrite')
        .objectStore(this._store)
        .openCursor()

      const negociacoes = []

      cursor.onsuccess = (event) => {
        const atual = event.target.result

        if (atual) {
          const dado = atual.value
          negociacoes.push(
            new Negociacao(dado._data, dado._quantidade, dado._valor),
          )
          atual.continue()
        } else {
          resolve(negociacoes)
        }
      }

      cursor.onerror = (event) => {
        console.log(event.target.error.name)
        reject('Não foi possível listar as negociações')
      }
    })
  }

  apagaTodos() {
    return new Promise((resolve, reject) => {
      const request = this._connection
        .transaction([this._store], 'readwrite')
        .objectStore(this._store)
        .clear()

      request.onsuccess = () => {
        resolve('Negociações apagadas com sucesso')
      }

      request.onerror = (event) => {
        console.log(event.target.error)
        reject('Não foi possível apagar as negociações')
      }
    })
  }
}
