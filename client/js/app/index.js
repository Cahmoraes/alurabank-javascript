import { NegociacaoController } from './controllers/NegociacaoController.js'

const form = document.forms[0]

if (!form) {
  throw Error('Form não encontrado')
}

const negociacaoController = new NegociacaoController()

form.addEventListener('submit', (event) => {
  negociacaoController.adiciona(event)
})

const buttonApagar = document.querySelector('#apagar')
if (!buttonApagar) {
  throw Error('Botão apagar não encontrado')
}

buttonApagar.addEventListener('click', () => {
  negociacaoController.apaga()
})

// const buttonImportar = document.querySelector('#importar')
// if (!buttonImportar) {
//   throw Error('Botão importar não encontrado')
// }

// buttonImportar.addEventListener('click', () => {
//   negociacaoController.importarNegociacoes()
// })
