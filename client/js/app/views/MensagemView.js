import { View } from './View.js'

export class MensagemView extends View {
  template(model) {
    return model.texto
      ? /* html */ `<p class="alert alert-info">${model.texto}</p>`
      : /* html */ `<p></p>`
  }
}
