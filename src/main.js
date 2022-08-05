import { BuildComponent } from './component';
import { h, VTextNode, text, Component, render } from './vdom';

class DisplayHello extends Component {

  constructor(props) {
    super(props);
    this.data = {
      items: [],
      times: 0,
      unrelated: 0,
      total: 0
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

    const hello = BuildComponent({ properties: { times, ref: 'hello'} }, HelloBar);

    return (
      <div>
        {hello}
        {itemList}
        <button catch:tap={this.add.bind(this)}>添加</button>
      </div>
    );
  }

  add() {
    console.log('添加条目');
    let { items, total } = this.data;
    total++;
    items.push('条目 ' + total);
    this.setData({ items, total });
  }
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

    const expression = '你好,' + name + ',' + times + '秒';

    return (
      <span style={times % 2 == 0 ? 'color: #ff4f4f' : 'color: #4386f5'}>
        { expression }
      </span>
    );
  }

  onTap(e) {
    console.log('添加事件', e);
  }
}

render(document.body, new DisplayHello({ name: "世界"}))