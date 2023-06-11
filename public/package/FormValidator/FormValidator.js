export default class FormValidator {
  constructor(form, option) {
    this.el = document.querySelector(`[data-form=${form}]`)
    this.rules = this.getRules(option.rules)
    this.invalid = option.invalid
    this.genValid()
  }

  getRules(rules) {
    return {
      required: {
        message: '不能为空',
        pattern: /^\S+$/,
      },
      phone: {
        message: '手机号不正确',
        pattern: /^1[3456789]\d{9}$/,
      },
      email: {
        message: '邮箱不正确',
        pattern: /^\S+@\S+\.\S+$/,
      },
      url: {
        message: '链接格式不正确',
        pattern: /^(http|https):\/\/([\w.]+\/?)\S*$/,
      },
      number: {
        message: '必须是数字值',
        pattern: /^-?\d*(\.\d+)?$/,
      },
      integer: {
        message: '必须是整数',
        pattern: /^-?\d+$/,
      },
      positiveNumber: {
        message: '必须是正数',
        pattern: /^(\d+(\.\d*)?)|(0\.\d+)$/,
      },
      positiveInteger: {
        message: '必须是正整数',
        pattern: /^[1-9]\d*$/,
      },
      negativeNumber: {
        message: '必须是负数',
        pattern: /^-(\d+(\.\d*)?)|(0\.\d+)$/,
      },
      negativeInteger: {
        message: '必须是负整数',
        pattern: /^-[1-9]\d*$/,
      },
      ...rules,
    }
  }

  genValid() {
    Object.values(this.rules).forEach((rule) => {
      rule.valid = function (item) {
        if (rule.pattern.test(item.value)) return true

        this.invalid(rule.message, item)
      }
    })
  }

  validate(evt) {
    const validRefs = this.getNodeAll('[data-valid]')
    const validItem = [...validRefs].find((item) => {
      const valid = item.dataset.valid
      const valids = valid.split('|')

      item.classList.remove('invalid')
      return !!valids.find(
        (rule) => !this.rules[rule].valid.call(this, item)
      )
    })

    if (validItem) {
      validItem.focus()
      validItem.classList.add('invalid')
      return
    }

    return true
  }

  getNodeAll(selector) {
    return this.el.querySelectorAll(selector)
  }
}
