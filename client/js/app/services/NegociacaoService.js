import { NegociacaoDao } from '../dao/NegociacaoDao.js'
import { Negociacao } from '../models/Negociacao.js'
import { ConnectionFactory } from './ConnectionFactory.js'
import { HttpService } from './HttpService.js'

export class NegociacaoService {
  constructor() {
    this._http = new HttpService()
  }

  obterNegociacoesDaSemana() {
    return new Promise((resolve, reject) => {
      this._http
        .get('/negociacoes/semana')
        .then((negociacoes) =>
          resolve(
            negociacoes.map(
              (objeto) =>
                new Negociacao(
                  new Date(objeto.data),
                  objeto.quantidade,
                  objeto.valor,
                ),
            ),
          ),
        )
        .catch((error) => {
          console.log(error)
          reject('Não foi possível obter as negociações da semana')
        })
    })
  }

  obterNegociacoesDaSemanaAnterior() {
    return new Promise((resolve, reject) => {
      this._http
        .get('/negociacoes/anterior')
        .then((negociacoes) =>
          resolve(
            negociacoes.map(
              (objeto) =>
                new Negociacao(
                  new Date(objeto.data),
                  objeto.quantidade,
                  objeto.valor,
                ),
            ),
          ),
        )
        .catch((error) => {
          console.log(error)
          reject('Não foi possível obter as negociações da semana anterior')
        })
    })
  }

  obterNegociacoesDaSemanaRetrasada(cb) {
    return new Promise((resolve, reject) => {
      this._http
        .get('/negociacoes/retrasada')
        .then((negociacoes) =>
          resolve(
            negociacoes.map(
              (objeto) =>
                new Negociacao(
                  new Date(objeto.data),
                  objeto.quantidade,
                  objeto.valor,
                ),
            ),
          ),
        )
        .catch((error) => {
          console.log(error)
          reject('Não foi possível obter as negociações da semana retrasada')
        })
    })
  }

  cadastra(negociacao) {
    return ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.adiciona(negociacao))
      .then(() => 'Negociação adicionada com sucesso')
      .catch((error) => {
        console.log(error)
        throw new Error('Não foi possível adicionar a negociação')
      })
  }

  lista() {
    return ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.listaTodos())
      .catch((error) => {
        console.log(error)
        throw new Error('Não foi possível obter as negociações')
      })
  }

  apaga() {
    return ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.apagaTodos())
      .then(() => 'Negociações apagadas com sucesso')
      .catch((error) => {
        console.log(error)
        throw new Error('Não foi possível apagar as negociações')
      })
  }

  importa(listaAtual) {
    return Promise.all([
      this.obterNegociacoesDaSemana(),
      this.obterNegociacoesDaSemanaAnterior(),
      this.obterNegociacoesDaSemanaRetrasada(),
    ])
      .then((negociacoes) =>
        negociacoes
          .reduce((array, negociacoes) => array.concat(negociacoes), [])
          .filter((negociacao) => {
            return !listaAtual.some(
              (negociacaoExistente) =>
                JSON.stringify(negociacaoExistente) ===
                JSON.stringify(negociacao),
            )
          }),
      )
      .catch((error) => {
        console.log(error)
        throw new Error('Não foi possível importar as negociações')
      })
  }
}
