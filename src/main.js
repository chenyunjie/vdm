import { h, VTextNode, text, Component, render } from './vdom';

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

    let children = [new HelloBar({ times, ref: 'hello' })].concat(itemList).concat([h('button', {
      'catch:tap': this.reset.bind(this)
    }, [text('重置')])])
    return h('div', {}, children)
  }

  reset() {
    clearInterval(this.interval);
    this.setData({ times: 0, unrelated: 0 }, () => {
      this.interval = setInterval(() => {
        let { unrelated, times } = this.data;
        unrelated++;
        times++;
        this.setData({ unrelated, times });
        if (unrelated > 10) {
          clearInterval(this.interval);
        }
  
      }, 1000);
    });
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
    // console.log('props变更了：', newProps, oldProps);
  }

  render() {
    const { times } = this.props;

    const  name = times % 2 == 0 ? '南京' : '世界';
    return h('span', {
                        'style': times % 2 == 0 ? 'color: #ff4f4f' : 'color: #4386f5'
                    }, [text("你好," + name + "," + times + "秒")]);
  }

  onTap(e) {
    console.log('添加事件', e);
  }
}

render(document.body, new DisplayHello({ name: "世界"}))