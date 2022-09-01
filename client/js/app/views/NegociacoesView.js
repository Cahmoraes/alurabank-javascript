import { DateHelper } from '../helpers/DateHelper.js'
import { View } from './View.js'

export class NegociacoesView extends View {
  template(model) {
    return /* html */ `
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
              <th>DATA</th>
              <th>QUANTIDADE</th>
              <th>VALOR</th>
              <th>VOLUME</th>
          </tr>
        </thead>

        <tbody>
          ${model.negociacoes
            .map(
              (negociacao) =>
                `
            <tr>
              <td>${DateHelper.dataParaTexto(negociacao.data)}</td>
              <td>${negociacao.quantidade}</td>
              <td>${negociacao.valor}</td>
              <td>${negociacao.volume}</td>
            </tr>
            `,
            )
            .join('')}
        </tbody>
        
        <tfoot>
          <td colspan="3"></td>
          <td>${model.negociacoes.reduce(
            (total, negociacao) => negociacao.volume + total,
            0,
          )}</td>
        </tfoot>
      </table>
    `
  }
}
