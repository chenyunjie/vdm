import { isFunctionType } from "./utils";
import { VComponentNode } from "./vnode";

/**
 *  组件生命周期 - 组件加载
 */
function lifecycleMounted(vnode) {
  if (vnode instanceof VComponentNode) {
    if (vnode.mounted && isFunctionType(vnode.mounted)) {
      vnode.mounted.apply(vnode, []);
    } else if (vnode.componentDidMount && isFunctionType(vnode.componentDidMount)) {
      // 兼容react生命周期
      vnode.componentDidMount.apply(vnode, []);
    }
  }
}

/**
 *  组件生命周期 - 组件卸载
 */
function lifecycleUnmounted(vnode) {
  if (vnode instanceof VComponentNode) {
    if (vnode.unmounted && isFunctionType(vnode.unmounted)) {
      vnode.unmounted.apply(vnode, []);
    } else if (vnode.componentWillUnmount && isFunctionType(componentWillUnmount)) {
      // 兼容react生命周期
      vnode.componentWillUnmount.apply(vnode, []);
    }
  }
}

export {
  lifecycleMounted,
  lifecycleUnmounted
}