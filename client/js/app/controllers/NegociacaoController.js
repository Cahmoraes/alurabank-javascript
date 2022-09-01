import { Bind } from '../helpers/Bind.js'
import { DateHelper } from '../helpers/DateHelper.js'
import { ListaNegociacoes } from '../models/ListaNegociacoes.js'
import { Mensagem } from '../models/Mensagem.js'
import { Negociacao } from '../models/Negociacao.js'
import { NegociacaoService } from '../services/NegociacaoService.js'
import { MensagemView } from '../views/MensagemView.js'
import { NegociacoesView } from '../views/NegociacoesView.js'

export class NegociacaoController {
  constructor() {
    const $ = document.querySelector.bind(document)
    this._inputData = $('#data')
    this._inputQuantidade = $('#quantidade')
    this._inputValor = $('#valor')

    this._listaNegociacoes = new Bind(
      new ListaNegociacoes(),
      new NegociacoesView($('#negociacoesView')),
      'adiciona',
      'esvazia',
    )

    this._mensagem = new Bind(
      new Mensagem(),
      new MensagemView($('#mensagemView')),
      'texto',
    )

    this._service = new NegociacaoService()

    this._init()
  }

  adiciona(event) {
    event.preventDefault()

    const negociacao = this._criaNegociacao()

    this._service
      .cadastra(negociacao)
      .then((mensagem) => {
        this._listaNegociacoes.adiciona(negociacao)
        this._mensagem.texto = mensagem
        this._limpaFormulario()
      })
      .catch((erro) => (this._mensagem.texto = erro))
  }

  apaga() {
    this._service
      .apaga()
      .then((mensagem) => {
        this._mensagem.texto = mensagem
        this._listaNegociacoes.esvazia()
      })
      .catch((error) => (this._mensagem.texto = error))
  }

  importarNegociacoes() {
    this._service
      .importa(this._listaNegociacoes.negociacoes)
      .then((negociacoes) => {
        negociacoes.forEach((negociacao) =>
          this._listaNegociacoes.adiciona(negociacao),
        )
        this._mensagem.texto = 'Negociações importadas'
      })
      .catch((error) => (this._mensagem.texto = error))
  }

  listaTodos() {
    return new Promise((resolve, reject) => {})
  }

  _criaNegociacao() {
    return new Negociacao(
      DateHelper.textoParaData(this._inputData.value),
      parseInt(this._inputQuantidade.value),
      parseFloat(this._inputValor.value),
    )
  }

  _limpaFormulario() {
    this._inputData.value = ''
    this._inputQuantidade.value = ''
    this._inputValor.value = ''
    this._inputData.focus()
  }

  _init() {
    this._service
      .lista()
      .then((negociacoes) =>
        negociacoes.forEach((negociacao) =>
          this._listaNegociacoes.adiciona(negociacao),
        ),
      )
      .catch((erro) => (this._mensagem.texto = erro))

    setInterval(() => {
      this.importarNegociacoes()
    }, 3000)
  }
}
