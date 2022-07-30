import { ta, te } from "date-fns/locale";

const NodeType = {
  Text: 'text',
  Node: 'node',
  Component: 'component'
};

// class RenderNode extends Object {
//   // 父元素节点 RenderNode类型
//   public parent;
// }

// /**
//  * 普通dom元素虚拟节点
//  */
// class VNormalNode extends RenderNode {

//   // 标签
//   public tag;

//   // 属性
//   public attr;

//   // 子元素
//   public children;

//   // 真实元素节点
//   public element;

//   // 元素类型
//   public type;

//   constructor(tag, attr, children) {
//     this.tag = tag;
//     this.attr = children;
//     this.children = children;
//     this.type = NodeType.Node;
//   }

// }

// /**
//  * 文本元素节点
//  */
// class VTextNode extends RenderNode {

//   // 文本内容
//   public text;

//   constructor(text) {
//     this.text = text;
//     this.type = NodeType.Text;
//   }
// }

// /**
//  * 组件节点
//  */
// class VComponentNode extends RenderNode {
//   // 实际渲染节点
//   public renderNode;
// }

// 普通节点
function VNode(tagName, attr, children) {

  this.tag = tagName;
  this.attr = attr;
  this.children = children;
  this._el = null;
  this.isTextNode = false;
  this._parent = null;
  this.type = NodeType.Node;
  this.component = null;
}

// 文本节点
function VTextNode(text) {
  this.text = text;
  this.isTextNode = true;
  this.type = NodeType.Text;
  this.component = null;
}


function issame(n1, n2) {
  return n1 && n2 && ((n1.tag != undefined && n1.tag != null) && n1.tag == n2.tag || (n1.type == NodeType.Text && n1.type == n2.type && n1.text == n2.text));
}

export {
  VNode,
  VTextNode,
  NodeType,
  issame
}