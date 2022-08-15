
const NodeType = {
  Text: 'text',
  Node: 'node',
  Component: 'component'
};

class RenderNode extends Object {
  // 父元素节点 RenderNode类型
  parent;
}

/**
 * 普通dom元素虚拟节点
 */
class VNormalNode extends RenderNode {

  // 标签
  tag;

  // 属性
  attr;

  // 子元素
  children;

  // 真实元素节点
  element;

  // 元素类型
  type;

  // 所属组件
  holder;

  constructor(tag, attr, children) {
    super();
    this.tag = tag;
    this.attr = attr;
    this.children = children;
    this.type = NodeType.Node;
  }

}

/**
 * 文本元素节点
 */
class VTextNode extends RenderNode {

  // 文本内容
  text;

  // 所属组件
  holder;

  constructor(text) {
    super();
    this.text = text;
    this.type = NodeType.Text;
  }
}

/**
 * 组件节点
 */
class VComponentNode extends RenderNode {
  // 实际渲染节点
  renderVNode;
}

function issame(n1, n2) {
  return n1 && n2 && ((n1.tag != undefined && n1.tag != null) && n1.tag == n2.tag || (n1.type == NodeType.Text && n1.type == n2.type && n1.text == n2.text));
}

export {
  VNormalNode,
  VTextNode,
  VComponentNode,
  NodeType,
  RenderNode,
  issame
}