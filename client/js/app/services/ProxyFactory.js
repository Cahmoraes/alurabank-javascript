export class ProxyFactory {
  static create(object, props, action) {
    return new Proxy(object, {
      get(target, property, receiver) {
        if (
          props.includes(property) &&
          ProxyFactory._ehFuncao(target[property])
        ) {
          return (...args) => {
            Reflect.apply(target[property], target, args)
            return action(target)
          }
        }

        return Reflect.get(target, property, receiver)
      },
      set(target, property, value, receiver) {
        if (props.includes(property)) {
          action(target)
        }
        return Reflect.set(target, property, value, receiver)
      },
    })
  }

  static _ehFuncao(func) {
    return typeof func === 'function'
  }
}
