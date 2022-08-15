const e="text",t="node";class n extends Object{parent}class r extends n{tag;attr;children;element;type;holder;constructor(e,n,r){super(),this.tag=e,this.attr=n,this.children=r,this.type=t}}class o extends n{text;holder;constructor(t){super(),this.text=t,this.type=e}}class l extends n{renderVNode}function d(e){if(e instanceof o)e.element=document.createTextNode(e.text);else if(e instanceof r)e.element=document.createElement(e.tag);else if(e instanceof l){d(e.renderVNode)}}function c(e,t){e&&t&&e.element&&t.element&&(t.parent=e,e.element.appendChild(t.element))}function i(e,t,n=""){e&&t&&e.setAttribute(t,n)}function s(e){return"function"==typeof e}function a(e){return"string"==typeof e}const p=new Map;function u(e,t,n){h(e,t,handler,!0)}function h(e,t,n,r){const o=y(e),l=function(e){e&&!r&&e.stopPropagation(),n&&n(e)};o[t]=l,e.addEventListener(t,l),p.set(e,o)}function f(e,t,n){if(e){if(n)e.removeEventListener(t,n);else{const n=y(e);n&&n[t]&&e.removeEventListener(t,n[t])}p.delete(e)}}function m(e){if(e){const t=p.get(e);t&&Object.keys(t).forEach((n=>{f(e,n,t[n])})),p.delete(e)}}function y(e,t){let n=p.get(e);return n||(n={}),n}const E=["bind","catch"],N={tap:"click"};function V(e){if(e&&e.indexOf(":")>0){const t=e.split(":")[0];return E.includes(t)}return!1}function g(e,t){if(V(e)){const n=e.split(":")[0];let r=e.split(":")[1];return N[r]?{bindType:n,eventType:N[r],handler:t}:{bindType:n,eventType:r,handler:t}}return null}function A(e,t,n){const{bindType:r,eventType:o,handler:l}=g(t);"bind"==r?u(e,o):"catch"==r&&function(e,t,n){h(e,t,n,!1)}(e,o,n)}function T(e){e instanceof l&&(e.mounted&&s(e.mounted)?e.mounted.apply(e,[]):e.componentDidMount&&s(e.componentDidMount)&&e.componentDidMount.apply(e,[]))}function R(e){e instanceof l&&(e.unmounted&&s(e.unmounted)?e.unmounted.apply(e,[]):e.componentWillUnmount&&s(componentWillUnmount)&&e.componentWillUnmount.apply(e,[]))}const b={REPLACE:1,REMOVE:2,APPEND:3,MOVE:5,REMOVE_ALL:6,REMOVE_ATTR:7,ADD_ATTR:8,REPLACE_ATTR:9};function O(e){e.forEach((e=>{const{newVNode:t,oldVNode:r,parentNode:o}=e;switch(e.type){case b.APPEND:o&&o.element&&(d(t),v(t),c(o,t),T(t),x(t),C(t));break;case b.MOVE:break;case b.REMOVE:r.element&&(m(r.element),(a=r).element&&a.element.remove()),R(r);break;case b.REPLACE:d(t),t.element&&r.element&&(t.parent=o,function(e,t){e instanceof n&&t instanceof n&&e.element&&t.element&&e.element.replaceWith(t.element)}(r,t)),v(t),T(t),R(r),r&&r.element&&m(r.element),x(t),C(t);break;case b.REPLACE_ATTR:case b.ADD_ATTR:if(t.element){const{attrKey:n,value:o}=e;if(V(n)){if(r&&r.element){const{eventType:e}=g(n);f(r.element,e)}x(t)}else i(t.element,n,o)}break;case b.REMOVE_ATTR:if(t.element){const{attrKey:n}=e;if(l=t.element,s=n,l&&s&&l.removeAttribute(s),V(key)&&r&&r.element){const{eventType:e}=g(n);f(r.element,e)}}}var l,s,a}))}function C(e){e.element&&e.children&&e.children.length>0&&e.children.forEach((t=>{d(t),v(t),x(t),c(e,t),T(t),t.children&&t.children.length>0&&C(t)}))}function v(e){if(!(e instanceof l||e instanceof o)){Object.keys(e.attr||{}).forEach((t=>{e.element&&!V(t)&&i(e.element,t,e.attr[t])}))}}function x(e){let t=e;e instanceof l&&(t=e.renderVNode),t.element&&Object.keys(t.attr||{}).forEach((e=>{V(e)&&A(t.element,e,t.attr[e])}))}function L(e,t,n){let r=[];const o=P(e,t,n,r),l=o&&o.type!=b.REMOVE&&o.type!=b.REPLACE||!o;if(t&&e&&l)if(e.children&&e.children.length>0&&t.children&&t.children.length>0){let n=e.children;e.children.length<t.children.length&&(n=t.children),n.forEach(((n,o)=>{let l=null,d=null;t.children.length>o&&(l=t.children[o]),e.children.length>o&&(d=e.children[o]);const c=L(d,l,e);r=r.concat(c)}))}else(!e.children||0==e.children.length)&&t.children&&t.children.length>0?r.push({type:b.REMOVE_ALL,newVNode:e,oldVNode:t}):e.children&&e.children.length>0&&(!t.children||0==t.children.length)&&r.push({type:b.APPEND_ALL,newVNode:e,oldVNode:t});return r}function P(t,n,r,o){let d=null;if(!t&&n)d={type:b.REMOVE,newVNode:t,oldVNode:n,parentNode:r},o.push(d);else if(t&&!n)d={type:b.APPEND,newVNode:t,oldVNode:n,parentNode:r},o.push(d);else if(t&&n)if(i=n,(c=t)&&i&&(null!=c.tag&&null!=c.tag&&c.tag==i.tag||c.type==e&&c.type==i.type&&c.text==i.text)&&(t.element=n.element),t&&(t.parent=r),t instanceof l&&n instanceof l){if(t.constructor.name==n.constructor.name)return M(t,n,o),P(t.renderVNode,n.renderVNode,r,o);d={type:b.REPLACE,newVNode:t,oldVNode:n,parentNode:r},o.push(d)}else t.tag!=n.tag||t.type==e&&t.text!=n.text?(d={type:b.REPLACE,newVNode:t,oldVNode:n,parentNode:r},o.push(d)):t.tag==n.tag&&M(t,n,o);var c,i;return d}function M(e,t,n){if(n||(n=[]),e instanceof l){e.propsChanged&&s(e.propsChanged)&&e.propsChanged.apply(e,[e.props,t.props]);const n=e.props.ref;if(n){const t=w(e);t&&(s(n)?n.apply(t,[e]):a(n)&&(t.refs[e.props.ref]=e))}}else{e.attr=e.attr||{},t.attr=t.attr||{};const r=Object.keys(e.attr),o=Object.keys(t.attr);let l=Math.max(r.length,o.length),d=0;for(;d<l;){const o=r[d],l=e.attr[o],c=t.attr[o];!l&&c?n.push({newVNode:e,oldVNode:t,attrKey:o,type:b.REMOVE_ATTR}):l&&!c?n.push({newVNode:e,oldVNode:t,attrKey:o,value:l,type:b.ADD_ATTR}):l&&c&&l!==c&&n.push({newVNode:e,oldVNode:t,attrKey:o,value:l,type:b.REPLACE_ATTR}),d++}}}function w(e){return e&&e.parent?e.parent.holder?e.parent.holder:w(e.parent):null}class D extends l{refs;constructor(e){super(),this.refs={},e||(e={}),this.props=JSON.parse(JSON.stringify(e))}propsChanged(e,t){}shouldComponentUpdate(){return!0}setData(e,t){if(this.data=Object.assign({},this.data,e),this.render){const e=this.render();e&&(e.holder=this);O(L(e,this.renderVNode,this.parent)),this.renderVNode=e}t&&t.apply(this,[])}render(){return null}forceUpdate(){const e=this.render();e.holder=this;O(L(e,null,this.parent))}get children(){return this.renderVNode?this.renderVNode.children:[]}get element(){return this.renderVNode?this.renderVNode.element:null}set element(e){this.renderVNode&&(this.renderVNode.element=e)}}let k=1;function _(e,t,n){let l=new r(e,t,n);if(l.id=++k,n&&n.length>0){const e=U(n,1/0).map((e=>{let t=e;if(t instanceof D){let e=!0;if(t.shouldComponentUpdate&&s(t.shouldComponentUpdate)&&(e=t.shouldComponentUpdate.apply(t,[])),e){const e=t.render();t.renderVNode=e,e.holder=t}}else(a(e)||"number"==typeof e)&&(t=function(e){let t=new o(e);return t.id=++k,t}(e));return t.parent=l,t}));l.children=e}return l}function U(e,t=1){return t>0?e.reduce(((e,n)=>e.concat(Array.isArray(n)?U(n,t-1):n)),[]):e.slice()}const j={c:function(e){return function(t){const n=new e(t),{lifetime:r}=t;if(r){let{created:e,attached:t,destroyed:o}=r;e&&s(e)&&e.apply(n,[]),t&&s(t)&&(t=t.bind(n),n.mounted=t),o&&s(o)&&(o=o.bind(n),n.unmounted=o)}return n}},h:_,Component:D,render:function(e,t){const n=t.render(),r=_(e.tagName,{},[t]);r.element=e,t.parent=r,t.renderVNode=n,n.holder=t,O(L(t,null,r)),t.renderVNode=n}};export{D as Component,j as default};
//# sourceMappingURL=tinyreact.js.map