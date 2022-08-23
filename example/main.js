import Tiny, { Component } from '../lib/tinyreact';

class DisplayHello extends Component {

  constructor(props) {
    super(props);
    this.data = {
      items: [],
      times: 0
    }
  }

  mounted() {
    console.log('组件被加载了');
  }

  render() {
    const { name, times, items } = this.data;

    return (
      <div>
        <HelloBar times={times} ref="hello" />
        {
          items.map(item => <div>{item}</div>)
        }
        <button catch:tap={this.add.bind(this)} style="position: fixed; left: 200px; top: 20px;">添加</button>
        <button catch:tap={this.delete.bind(this)} style="position: fixed; left: 260px; top: 20px;">删除</button>
      </div>
    );
  }

  add() {
    let { items } = this.data;
    items.push('条目 ' + items.length);
    this.setData({ items });
  }

  delete() {
    const { items } = this.data;
    items.splice(items.length - 1, 1);
    this.setData({ items });
  }
}

class HelloBar extends Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return true;
  }

  mounted() {
    console.log('HelloBar loaded');
  }

  propsChanged(newProps, oldProps) {
    // console.log('props变更了：', newProps, oldProps);
  }

  render() {
    const { times } = this.props;

    const  name = times % 2 == 0 ? '南京' : '世界';

    return (
      <span style={times % 2 == 0 ? 'color: #ff4f4f' : 'color: #4386f5'}>
        你好,{ name }, {times} 秒
      </span>
    );
  }

  onTap(e) {
    console.log('添加事件', e);
  }
}

Tiny.render(document.body, <DisplayHello name="世界"/>)