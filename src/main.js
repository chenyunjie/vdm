import { h, VNode, VTextNode, renderVNode, text, Component, render } from './vdom';

class DisplayHello extends Component {

  constructor(props) {
    super(props);
    this.data = {
      items: [],
      times: 0,
      unrelated: 0
    }
  }

  mounted() {

    this.interval = setInterval(() => {
      let { unrelated, times } = this.data;
      unrelated++;
      times++;
      this.setData({ unrelated, times });
      if (unrelated > 10) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  render() {
    const { name, times, items } = this.data;

    const itemList = items.map(item => h('div', {}, [text(item)]))

    let children = [new HelloBar({ times })].concat(itemList).concat([h('button', {}, [text('删除')])])
    return h('div', {}, children)
  }
}

class HelloBar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { times } = this.props;

    const  name = times % 2 == 0 ? '南京' : '世界';
    console.log('重新渲染');
    return h('span', {}, [text("你好," + name + "," + times + "秒")]);
  }
}

render(document.body, new DisplayHello({ name: "世界"}))