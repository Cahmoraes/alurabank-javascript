import { Negociacao } from './models/Negociacao.js'

const openRequest = window.indexedDB.open('aluraframe', 3)
let connection = null

openRequest.onupgradeneeded = (event) => {
  console.log('cria ou altera um banco já existente')
  const myConnection = event.target.result

  if (myConnection.objectStoreNames.contains('negociacoes')) {
    myConnection.deleteObjectStore('negociacoes')
  }

  myConnection.createObjectStore('negociacoes', { autoIncrement: true })
}

openRequest.onsuccess = (event) => {
  console.log('Conexão obtida com sucesso')
  connection = event.target.result

  adiciona()
}

openRequest.onerror = (event) => {
  console.log(event.target.error)
}

function adiciona() {
  const transaction = connection.transaction(['negociacoes'], 'readwrite')
  const store = transaction.objectStore('negociacoes')

  const negociacao = new Negociacao(new Date(), 1, 200)
  const request = store.add(negociacao)

  listaTodos()

  request.onsuccess = (event) => {
    console.log('negociação incluída com sucesso')
  }

  request.onerror = (event) => {
    console.log('não foi possível incluir a negociação')
  }
}

function listaTodos() {
  const transaction = connection.transaction(['negociacoes'], 'readwrite')
  const store = transaction.objectStore('negociacoes')

  const cursor = store.openCursor()

  const negociacoes = []

  cursor.onsuccess = (event) => {
    const atual = event.target.result

    if (atual) {
      const dado = atual.value
      negociacoes.push(new Negociacao(dado._data, dado.quantidade, dado._valor))
      atual.continue()
    } else {
      console.log(negociacoes)
    }
  }

  cursor.onerror = (event) => {
    console.log(event.target.error.name)
  }
}
