import { h, VTextNode, renderVNode, text, Component, render } from './vdom';

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
      // if (unrelated > 10) {
      //   clearInterval(this.interval);
      // }

      if (this.refs && this.refs['hello']) {
        console.log('hello: ',this.refs['hello']);
      }
    }, 1000);
  }

  render() {
    const { name, times, items } = this.data;

    const itemList = items.map(item => h('div', {}, [text(item)]))

    let children = [new HelloBar({ times, ref: 'hello' })].concat(itemList).concat([h('button', {}, [text('删除')])])
    return h('div', {}, children)
  }
}

// 需要考虑两种情况
// 1. 条件式组件加载
// 2. 组件引用参数变更

// 收集条件参数
// if 条件
// 三目运算符 a > b ? a : b
function conditionRender(ctx, expression, component) {

}

class HelloBar extends Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return true;
  }

  propsChanged(newProps, oldProps) {
    console.log('props变更了：', newProps, oldProps);
  }

  render() {
    const { times } = this.props;

    const  name = times % 2 == 0 ? '南京' : '世界';
    console.log('重新渲染');
    return h('span', {
                        'style': times % 2 == 0 ? 'color: #ff4f4f' : 'color: #4386f5'
                    }, [text("你好," + name + "," + times + "秒")]);
  }
}

render(document.body, new DisplayHello({ name: "世界"}))