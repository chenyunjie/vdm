
import { VNode, VTextNode, NodeType, issame } from "./vnode";
import { createElement } from "./dom";

const PatchType = {
  // 替换节点
  REPLACE: 1,
  // 删除节点
  REMOVE: 2,
  // 追加节点
  APPEND: 3,
  APPEND_ALL: 6,
  // 移动节点
  MOVE: 4,
  // 移除所有
  REMOVE_ALL: 5
};


function diff(newVNode, oldVNode, parentNode) {
  
  let patches = [];

  const patch = diffVNode(newVNode, oldVNode, parentNode);
  if (patch) {
    patches.push(patch);
  }
  
  const shouldCompareChildren = (patch && (patch.type != PatchType.REMOVE || patch.type != PatchType.REPLACE)) || !patch;

  if (oldVNode && newVNode && shouldCompareChildren) {
    // 两节点相同，处理后续子元素节点

    if (newVNode.children && newVNode.children.length > 0 && oldVNode.children && oldVNode.children.length > 0) {
      // 都存在子元素
      let iteratorChildren = newVNode.children;

      if (newVNode.children.length < oldVNode.children.length) {
        iteratorChildren = oldVNode.children;
      }

      iteratorChildren.forEach((_, index) => {
        let vOldChild = null;
        let vNewChild = null;
        if (oldVNode.children.length > index) {
          vOldChild = oldVNode.children[index];
        }

        if (newVNode.children.length > index) {
          vNewChild = newVNode.children[index];
        }

        const childrenPatches = diff(vNewChild, vOldChild, newVNode);
        patches = patches.concat(childrenPatches);
      });
    } else {
      
        if ((!newVNode.children || newVNode.children.length == 0) && (oldVNode.children && oldVNode.children.length > 0)) {
          // 新节点没有子元素，旧节点存在子元素
          // 清空子元素
          patches.push({
            type: PatchType.REMOVE_ALL,
            newVNode,
            oldVNode
          });
        } else if ((newVNode.children && newVNode.children.length > 0) && (!oldVNode.children || oldVNode.children.length == 0)) {
          // 新节点存在子元素，旧节点没有子元素
          // 添加新元素
          patches.push({
            type: PatchType.APPEND_ALL,
            newVNode,
            oldVNode
          });
        }
    }
  }

  return patches;
}

function diffVNode(newVNode, oldVNode, parentNode) {

  if (newVNode == null && oldVNode != null) {
    return {
      type: PatchType.REMOVE,
      newVNode,
      oldVNode,
      parentNode
    }
  } else if (newVNode != null && oldVNode == null) {
    return {
      type: PatchType.APPEND,
      newVNode,
      oldVNode,
      parentNode
    }
  } else {
    // 元素未变更丢弃老的dom
    if (issame(newVNode, oldVNode)) {
      newVNode._el = oldVNode._el;
    }
    newVNode._parent = oldVNode._parent;
    if (newVNode.tag != oldVNode.tag || (newVNode.type == NodeType.Text && newVNode.text != oldVNode.text)) {
      // 替换
      return {
        type: PatchType.REPLACE,
        newVNode,
        oldVNode,
        parentNode
      }
    }
  }

  return null;
}

function diffAttr() {

}

function createChildren(node) {
  // 处理子元素
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      createElement(child);
      node._el.appendChild(child._el);
      if (child.component && child.component.mounted) {
        child.component.mounted.apply(child.component, []);
        child.component._vnode = child;
      }

      if (child.children && child.children.length > 0) {
        createChildren(child);
      }
    });
  }
}

function patch(patches) {
  patches.forEach(patch => {
    const { newVNode, oldVNode, parentNode } = patch;
    switch(patch.type) {
      case PatchType.APPEND:
        if (parentNode && parentNode._el) {

          createElement(newVNode);
          
          newVNode._parent = parentNode;
          parentNode._el.appendChild(newVNode._el);
          if (newVNode.component && newVNode.component.mounted) {
            newVNode.component.mounted.apply(newVNode.component, []);
          }
          
          // 创建子元素
          createChildren(newVNode);
        }
        break;
      case PatchType.APPEND_ALL:
        break;
      case PatchType.MOVE:
        break;
      case PatchType.REMOVE:
        if (oldVNode._el) {
          oldVNode._el.remove();
        }

        if (oldVNode.component && oldVNode.component.unmounted) {
          oldVNode.component.unmounted.apply(oldVNode.component, []);
        }
        break;
      case PatchType.REPLACE:
        createElement(newVNode);
        if (newVNode._el && oldVNode._el) {
          newVNode._parent = parentNode;
          oldVNode._el.replaceWith(newVNode._el);
        }

        break;
    }
  });
}

export {
  PatchType,
  diff,
  patch
}