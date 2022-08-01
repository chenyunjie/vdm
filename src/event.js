
/**
 * 事件池 Map 结构，使用element元素作为key
 * {
 *    element: {
 *      name:  callback
 *    }
 *    
 * }
 */
const eventPool = new Map();

/**
 * 注册dom事件，禁止事件冒泡
 * 使用原生 
 *  addEventListener(事件名, 事件响应函数, 是否为事件捕获)
 * @param {*} element 
 *  dom元素节点
 * @param {*} event 
 *  事件类型：example：click
 * @param {*} handler 
 */
function catchEvent(element, event, handler) {
  const events = eventHandlersForElement(element, event);

  events[event] = handler;

  element.addEventListener(event, handler, true);

  eventPool.set(element, events);
}

/**
 * 注册dom事件，保留事件冒泡
 * @param {*} element 
 * @param {*} name 
 * @param {*} func 
 */
function bindEvent(element, name, func) {

}

/**
 * 移除dom事件
 * @param {*} element 
 * @param {*} name 
 * @param {*} func 
 */
function unbindEvent(element, name, func) {

}

/**
 * 移除所有事件
 * @param {*} element 
 */
function unbindAllEvent(element) {
  if (element) {
    const events = eventPool.get(element);
    if (events) {
      Object.keys(events).forEach(e => {
        element.removeEventListener(e, events[e]);
      });
    }

    eventPool.delete(element);
  }
}

/**
 * 获取element元素所绑定的所有事件集合
 * 
 * @param {*} element 
 */
function eventHandlersForElement(element, eventName) {
  let events = eventPool.get(element);

  if (!events) {
    events = {};
  }

  return events;
}

const validEventBindTypeList = ['bind', 'catch'];

const eventmap = {
  'tap': 'click'
};

/**
 * 是否为事件绑定
 * @param {*} attrName 
 */
function isEventAttr(attrName) {
  if (attrName && attrName.indexOf(':') > 0) {
    const bindType = attrName.split(':')[0];
    return validEventBindTypeList.includes(bindType);
  }
  return false;
}

/**
 * 解析事件属性
 * @param {*} attrName 
 * @param {*} attrValue 
 */
function parseEventAttr(attrName, attrValue) {
  if (isEventAttr(attrName)) {
    const bindType = attrName.split(':')[0];
    let bindEventTypeName = attrName.split(':')[1];

    if (eventmap[bindEventTypeName]) {
      return { bindType, event: eventmap[bindEventTypeName], handler: attrValue };
    } else {
      return { bindType, event: bindEventTypeName, handler: attrValue };
    }
  }
  return null;
}

/**
 * 为元素添加事件
 * 
 * @param {*} element 
 * @param {*} attrName 
 * @param {*} attrValue 
 */
function event(element, attrName, attrValue) {
  const { bindType, event, handler } = parseEventAttr(attrName);
  if (bindType == 'bind') {
    bindEvent(element, event, attrValue);
  } else if (bindType == 'catch') {
    catchEvent(element, event, attrValue);
  }
}

export {
  catchEvent,
  bindEvent,
  unbindEvent,
  isEventAttr,
  parseEventAttr,
  event,
  unbindAllEvent
}