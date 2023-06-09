# HtmlPlus

> 写着玩的作品。慎用。

一个增强原生开发体验的……js。

## 使用方法

使用 HtmlPlus 就需要用面向对象的方式……即，你需要写一个类，这个类就对应一定范围的 html，通过继承 HtmlPlus 的基类（Base）你可以在这个类中使用基类提供便捷的指令，例如：`ref` 指令帮助你获取元素到类实例上、`event` 指令帮助你为某个标签绑定事件、`bind` 指令帮助你绑定数据。

```html
<div 
  class="example-box" 
  data-bind="innerHTML: name"
></div>

<script type="module">
  import Base from './Base/index.js'

  class ExampleBox extends Base {
    constructor(selector) {
      super(selector, () => {
        return {
          name: 'htmlPlus'
        }
      })
    }
  }

  new ExampleBox('.example-box')
</script>
```

上面 html 中的 `data-bind` 就是 `bind` 指令的只用方法。

继承基类之后，需要传递给 `Base` 构造函数有两个参数，第一个是选择器，该选择器是 HtmlPlus 的作用范围。第二个是一个函数（可选），该函数必须要返回Object、Array类型的数据，这些数据将用于 `bind` 指令。

## ref 指令

原生开发中会大量使用 `document.querySelector` 获取元素。

使用 `ref` 指令可以简化这个步骤。

```html
<div class="example-box">
  <p data-ref="greet">hello world</p>
</div>

<script type="module">
  import Base from './Base/index.js'

  class ExampleBox extends Base {
    constructor(selector) {
      super(selector)
    }
  }

  console.log(new ExampleBox('.example-box'))
</script>
```

打印 `ExampleBox` 实例即可看到名为 `greet` 的属性，该属性值就是 p 标签。

## event 指令

原生开发中也会大量使用 `node.addEventLisenter` 绑定事件。

使用 `event` 指令可以简化这个步骤。

```html
<div class="example-box">
  <p data-ref="greet">hello world</p>
  <button data-event="click:show">click me</button>
</div>

<script type="module">
  import Base from './Base/index.js'

  class ExampleBox extends Base {
    constructor(selector) {
      super(selector)
    }

    show() {
      this.greet.innerHTML = 'hi~'
    }
  }

  console.log(new ExampleBox('.example-box'))
</script>
```

`event` 指令需要两个参数，一个是事件名，另一个是需要绑定的函数，该函数会从 `ExampleBox` 实例上找，并且会把函数的 `this` 指向为实例。

指令的参数以 `:` 分隔。

## bind 指令

从后端请求数据之后，通常需要经历下面步骤：根据数据克隆对应数量的元素节点->遍历数据->填充数据。

`bind` 指令可以帮你完成填充数据这个步骤。

```html
<div class="example-box">
  <a data-bind="{innerHTML:name, href: url}">hello </a>
</div>

<script type="module">
  import Base from './Base/index.js'

  class ExampleBox extends Base {
    constructor(selector) {
      super(selector, () => {
        return {
          name: 'htmlplus',
          url: './test'
        }
      })
      this.bindStart()
    }
  }

  console.log(new ExampleBox('.example-box'))
</script>
```

`bind` 指令会在原有内容上进行拼接。所以 a 标签最终显示结果是： `<a href="./test">hello htmlplus</a>` 。

上面是需要在元素上为多个属性绑定数据的情况，所以 `bind` 指令接受的参数是一个对象类型。如果仅需要绑定一个属性，可以不使用 `{` 和 `}`。

## clone 指令

该指令能够帮助你根据数据克隆对应数量的元素节点，再借助 `bind` 指令就能大大简化流程。

```html
<ul class="example-box">
  <template data-clone="listItem:true">
    <li data-target="listItem">
      <p data-bind="innerHTML:name"></p>

      <template data-clone="spanItem:false:texts">
        <p data-target="spanItem" data-bind="innerHTML:$item"></p>
      </template>
    </li>
  </template>
</ul>

<script type="module">
  import Base from './Base/index.js'

  class ExampleBox extends Base {
    constructor(selector) {
      super(selector, () => {
        return [
          {
            name: 'hello-1',
            texts: [1, 2, 3],
          },
          {
            name: 'hello-2',
            texts: [4, 5, 6],
          },
          {
            name: 'hello-3',
            texts: [7, 8, 9],
          },
        ]
      })
      this.cloneStart()
    }
  }

  console.log(new ExampleBox('.example-box'))
</script>
```

`data-clone` 指令有三个参数：

- 第一个：克隆的目标项，即与 `<template>` 里的第一个元素节点的 `data-target` 属性相同。
- 第二个：是否深度克隆。可选值：true/false。
- 第三个：克隆的数据，必须是数组。如果不写第三个参数，那么默认为 `super` 回调函数的返回值。

`bind` 指令有一个特殊关键字（`$item`），它表示当前的数据项。

在上面例子，需要克隆的数据有3项，每项的数据都有 `name`、`texts` 两个属性。
那么，第一个 `clone` 指令就会克隆 3 个节点（`<li>`），同理，第二个克隆指令也是一样。
值得注意的是，每个克隆的节点都有自己的数据作用域。例如：第一个被克隆的 `<li>` 的数据作用域就是含有 hello-1 的那个对象。在第一个被克隆的 `<li>` 里面的所有 `bind` 指令都将都这个数据对象里面查找绑定数据。
