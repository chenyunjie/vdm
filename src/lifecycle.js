import { isFunctionType } from "./utils";
import { VComponentNode } from "./vnode";

/**
 *  组件生命周期 - 组件加载
 */
function lifecycleMounted(vnode) {
  if (vnode instanceof VComponentNode) {
    if (vnode.mounted && isFunctionType(vnode.mounted)) {
      vnode.mounted.apply(vnode, []);
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
    }
  }
}

export {
  lifecycleMounted,
  lifecycleUnmounted
}