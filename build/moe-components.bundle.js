window.JSCompiler_renameProperty=function(e){return e};let workingURL,resolveDoc,CSS_URL_RX=/(url\()([^)]*)(\))/g,ABS_URL=/(^\/)|(^#)|(^[\w-\d]*:)/;function resolveUrl(e,t){if(e&&ABS_URL.test(e))return e;if(void 0===workingURL){workingURL=!1;try{const e=new URL("b","http://a");e.pathname="c%20d",workingURL="http://a/c%20d"===e.href}catch(e){}}return t||(t=document.baseURI||window.location.href),workingURL?new URL(e,t).href:(resolveDoc||((resolveDoc=document.implementation.createHTMLDocument("temp")).base=resolveDoc.createElement("base"),resolveDoc.head.appendChild(resolveDoc.base),resolveDoc.anchor=resolveDoc.createElement("a"),resolveDoc.body.appendChild(resolveDoc.anchor)),resolveDoc.base.href=t,resolveDoc.anchor.href=e,resolveDoc.anchor.href||e)}function resolveCss(e,t){return e.replace(CSS_URL_RX,function(e,i,n,s){return i+"'"+resolveUrl(n.replace(/["']/g,""),t)+"'"+s})}function pathFromUrl(e){return e.substring(0,e.lastIndexOf("/")+1)}const useShadow=!window.ShadyDOM,useNativeCSSProperties=Boolean(!window.ShadyCSS||window.ShadyCSS.nativeCss),useNativeCustomElements=!window.customElements.polyfillWrapFlushCallback;let rootPath=pathFromUrl(document.baseURI||window.location.href),sanitizeDOMValue=void 0,passiveTouchGestures=!1,dedupeId=0;const dedupingMixin=function(e){let t=e.__mixinApplications;t||(t=new WeakMap,e.__mixinApplications=t);let i=dedupeId++;return function(n){let s=n.__mixinSet;if(s&&s[i])return n;let o=t,a=o.get(n);a||(a=e(n),o.set(n,a));let r=Object.create(a.__mixinSet||s||null);return r[i]=!0,a.__mixinSet=r,a}},MODULE_STYLE_LINK_SELECTOR="link[rel=import][type~=css]",INCLUDE_ATTR="include",SHADY_UNSCOPED_ATTR="shady-unscoped";function importModule(e){const t=customElements.get("dom-module");return t?t.import(e):null}function styleForImport(e){const t=resolveCss((e.body?e.body:e).textContent,e.baseURI),i=document.createElement("style");return i.textContent=t,i}function stylesFromModules(e){const t=e.trim().split(/\s+/),i=[];for(let e=0;e<t.length;e++)i.push(...stylesFromModule(t[e]));return i}function stylesFromModule(e){const t=importModule(e);if(!t)return console.warn("Could not find style data in module named",e),[];if(void 0===t._styles){const e=[];e.push(..._stylesFromModuleImports(t));const i=t.querySelector("template");i&&e.push(...stylesFromTemplate(i,t.assetpath)),t._styles=e}return t._styles}function stylesFromTemplate(e,t){if(!e._styles){const i=[],n=e.content.querySelectorAll("style");for(let e=0;e<n.length;e++){let s=n[e],o=s.getAttribute(INCLUDE_ATTR);o&&i.push(...stylesFromModules(o).filter(function(e,t,i){return i.indexOf(e)===t})),t&&(s.textContent=resolveCss(s.textContent,t)),i.push(s)}e._styles=i}return e._styles}function stylesFromModuleImports(e){let t=importModule(e);return t?_stylesFromModuleImports(t):[]}function _stylesFromModuleImports(e){const t=[],i=e.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);for(let e=0;e<i.length;e++){let n=i[e];if(n.import){const e=n.import,i=n.hasAttribute(SHADY_UNSCOPED_ATTR);if(i&&!e._unscopedStyle){const t=styleForImport(e);t.setAttribute(SHADY_UNSCOPED_ATTR,""),e._unscopedStyle=t}else e._style||(e._style=styleForImport(e));t.push(i?e._unscopedStyle:e._style)}}return t}function cssFromModules(e){let t=e.trim().split(/\s+/),i="";for(let e=0;e<t.length;e++)i+=cssFromModule(t[e]);return i}function cssFromModule(e){let t=importModule(e);if(t&&void 0===t._cssText){let e=_cssFromModuleImports(t),i=t.querySelector("template");i&&(e+=cssFromTemplate(i,t.assetpath)),t._cssText=e||null}return t||console.warn("Could not find style data in module named",e),t&&t._cssText||""}function cssFromTemplate(e,t){let i="";const n=stylesFromTemplate(e,t);for(let e=0;e<n.length;e++){let t=n[e];t.parentNode&&t.parentNode.removeChild(t),i+=t.textContent}return i}function _cssFromModuleImports(e){let t="",i=_stylesFromModuleImports(e);for(let e=0;e<i.length;e++)t+=i[e].textContent;return t}let modules={},lcModules={};function findModule(e){return modules[e]||lcModules[e.toLowerCase()]}function styleOutsideTemplateCheck(e){e.querySelector("style")&&console.warn("dom-module %s has style outside template",e.id)}class DomModule extends HTMLElement{static get observedAttributes(){return["id"]}static import(e,t){if(e){let i=findModule(e);return i&&t?i.querySelector(t):i}return null}attributeChangedCallback(e,t,i,n){t!==i&&this.register()}get assetpath(){if(!this.__assetpath){const e=window.HTMLImports&&HTMLImports.importForElement?HTMLImports.importForElement(this)||document:this.ownerDocument,t=resolveUrl(this.getAttribute("assetpath")||"",e.baseURI);this.__assetpath=pathFromUrl(t)}return this.__assetpath}register(e){(e=e||this.id)&&(this.id=e,modules[e]=this,lcModules[e.toLowerCase()]=this,styleOutsideTemplateCheck(this))}}function isPath(e){return e.indexOf(".")>=0}function root(e){let t=e.indexOf(".");return-1===t?e:e.slice(0,t)}function isAncestor(e,t){return 0===e.indexOf(t+".")}function isDescendant(e,t){return 0===t.indexOf(e+".")}function translate(e,t,i){return t+i.slice(e.length)}function matches(e,t){return e===t||isAncestor(e,t)||isDescendant(e,t)}function normalize(e){if(Array.isArray(e)){let t=[];for(let i=0;i<e.length;i++){let n=e[i].toString().split(".");for(let e=0;e<n.length;e++)t.push(n[e])}return t.join(".")}return e}function split(e){return Array.isArray(e)?normalize(e).split("."):e.toString().split(".")}function get(e,t,i){let n=e,s=split(t);for(let e=0;e<s.length;e++){if(!n)return;n=n[s[e]]}return i&&(i.path=s.join(".")),n}function set(e,t,i){let n=e,s=split(t),o=s[s.length-1];if(s.length>1){for(let e=0;e<s.length-1;e++){if(!(n=n[s[e]]))return}n[o]=i}else n[t]=i;return s.join(".")}DomModule.prototype.modules=modules,customElements.define("dom-module",DomModule);const caseMap={},DASH_TO_CAMEL=/-[a-z]/g,CAMEL_TO_DASH=/([A-Z])/g;function dashToCamelCase(e){return caseMap[e]||(caseMap[e]=e.indexOf("-")<0?e:e.replace(DASH_TO_CAMEL,e=>e[1].toUpperCase()))}function camelToDashCase(e){return caseMap[e]||(caseMap[e]=e.replace(CAMEL_TO_DASH,"-$1").toLowerCase())}var caseMap$0=Object.freeze({dashToCamelCase:dashToCamelCase,camelToDashCase:camelToDashCase});let microtaskCurrHandle=0,microtaskLastHandle=0,microtaskCallbacks=[],microtaskNodeContent=0,microtaskNode=document.createTextNode("");function microtaskFlush(){const e=microtaskCallbacks.length;for(let t=0;t<e;t++){let e=microtaskCallbacks[t];if(e)try{e()}catch(e){setTimeout(()=>{throw e})}}microtaskCallbacks.splice(0,e),microtaskLastHandle+=e}new window.MutationObserver(microtaskFlush).observe(microtaskNode,{characterData:!0});const timeOut={after:e=>({run:t=>window.setTimeout(t,e),cancel(e){window.clearTimeout(e)}}),run:(e,t)=>window.setTimeout(e,t),cancel(e){window.clearTimeout(e)}},animationFrame={run:e=>window.requestAnimationFrame(e),cancel(e){window.cancelAnimationFrame(e)}},idlePeriod={run:e=>window.requestIdleCallback?window.requestIdleCallback(e):window.setTimeout(e,16),cancel(e){window.cancelIdleCallback?window.cancelIdleCallback(e):window.clearTimeout(e)}},microTask={run:e=>(microtaskNode.textContent=microtaskNodeContent++,microtaskCallbacks.push(e),microtaskCurrHandle++),cancel(e){const t=e-microtaskLastHandle;if(t>=0){if(!microtaskCallbacks[t])throw new Error("invalid async handle: "+e);microtaskCallbacks[t]=null}}},microtask=microTask,PropertiesChanged=dedupingMixin(e=>{return class extends e{static createProperties(e){const t=this.prototype;for(let i in e)i in t||t._createPropertyAccessor(i)}static attributeNameForProperty(e){return e.toLowerCase()}static typeForProperty(e){}_createPropertyAccessor(e,t){this._addPropertyToAttributeMap(e),this.hasOwnProperty("__dataHasAccessor")||(this.__dataHasAccessor=Object.assign({},this.__dataHasAccessor)),this.__dataHasAccessor[e]||(this.__dataHasAccessor[e]=!0,this._definePropertyAccessor(e,t))}_addPropertyToAttributeMap(e){if(this.hasOwnProperty("__dataAttributes")||(this.__dataAttributes=Object.assign({},this.__dataAttributes)),!this.__dataAttributes[e]){const t=this.constructor.attributeNameForProperty(e);this.__dataAttributes[t]=e}}_definePropertyAccessor(e,t){Object.defineProperty(this,e,{get(){return this._getProperty(e)},set:t?function(){}:function(t){this._setProperty(e,t)}})}constructor(){super(),this.__dataEnabled=!1,this.__dataReady=!1,this.__dataInvalid=!1,this.__data={},this.__dataPending=null,this.__dataOld=null,this.__dataInstanceProps=null,this.__serializing=!1,this._initializeProperties()}ready(){this.__dataReady=!0,this._flushProperties()}_initializeProperties(){for(let e in this.__dataHasAccessor)this.hasOwnProperty(e)&&(this.__dataInstanceProps=this.__dataInstanceProps||{},this.__dataInstanceProps[e]=this[e],delete this[e])}_initializeInstanceProperties(e){Object.assign(this,e)}_setProperty(e,t){this._setPendingProperty(e,t)&&this._invalidateProperties()}_getProperty(e){return this.__data[e]}_setPendingProperty(e,t,i){let n=this.__data[e],s=this._shouldPropertyChange(e,t,n);return s&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),!this.__dataOld||e in this.__dataOld||(this.__dataOld[e]=n),this.__data[e]=t,this.__dataPending[e]=t),s}_invalidateProperties(){!this.__dataInvalid&&this.__dataReady&&(this.__dataInvalid=!0,microtask.run(()=>{this.__dataInvalid&&(this.__dataInvalid=!1,this._flushProperties())}))}_enableProperties(){this.__dataEnabled||(this.__dataEnabled=!0,this.__dataInstanceProps&&(this._initializeInstanceProperties(this.__dataInstanceProps),this.__dataInstanceProps=null),this.ready())}_flushProperties(){const e=this.__data,t=this.__dataPending,i=this.__dataOld;this._shouldPropertiesChange(e,t,i)&&(this.__dataPending=null,this.__dataOld=null,this._propertiesChanged(e,t,i))}_shouldPropertiesChange(e,t,i){return Boolean(t)}_propertiesChanged(e,t,i){}_shouldPropertyChange(e,t,i){return i!==t&&(i==i||t==t)}attributeChangedCallback(e,t,i,n){t!==i&&this._attributeToProperty(e,i),super.attributeChangedCallback&&super.attributeChangedCallback(e,t,i,n)}_attributeToProperty(e,t,i){if(!this.__serializing){const n=this.__dataAttributes,s=n&&n[e]||e;this[s]=this._deserializeValue(t,i||this.constructor.typeForProperty(s))}}_propertyToAttribute(e,t,i){this.__serializing=!0,i=arguments.length<3?this[e]:i,this._valueToNodeAttribute(this,i,t||this.constructor.attributeNameForProperty(e)),this.__serializing=!1}_valueToNodeAttribute(e,t,i){const n=this._serializeValue(t);void 0===n?e.removeAttribute(i):e.setAttribute(i,n)}_serializeValue(e){switch(typeof e){case"boolean":return e?"":void 0;default:return null!=e?e.toString():void 0}}_deserializeValue(e,t){switch(t){case Boolean:return null!==e;case Number:return Number(e);default:return e}}}});let caseMap$1=caseMap$0;const nativeProperties={};let proto=HTMLElement.prototype;for(;proto;){let e=Object.getOwnPropertyNames(proto);for(let t=0;t<e.length;t++)nativeProperties[e[t]]=!0;proto=Object.getPrototypeOf(proto)}function saveAccessorValue(e,t){if(!nativeProperties[t]){let i=e[t];void 0!==i&&(e.__data?e._setPendingProperty(t,i):(e.__dataProto?e.hasOwnProperty(JSCompiler_renameProperty("__dataProto",e))||(e.__dataProto=Object.create(e.__dataProto)):e.__dataProto={},e.__dataProto[t]=i))}}const PropertyAccessors=dedupingMixin(e=>{const t=PropertiesChanged(e);return class extends t{static createPropertiesForAttributes(){let e=this.observedAttributes;for(let t=0;t<e.length;t++)this.prototype._createPropertyAccessor(caseMap$1.dashToCamelCase(e[t]))}static attributeNameForProperty(e){return caseMap$1.camelToDashCase(e)}_initializeProperties(){this.__dataProto&&(this._initializeProtoProperties(this.__dataProto),this.__dataProto=null),super._initializeProperties()}_initializeProtoProperties(e){for(let t in e)this._setProperty(t,e[t])}_ensureAttribute(e,t){const i=this;i.hasAttribute(e)||this._valueToNodeAttribute(i,t,e)}_serializeValue(e){switch(typeof e){case"object":if(e instanceof Date)return e.toString();if(e)try{return JSON.stringify(e)}catch(e){return""}default:return super._serializeValue(e)}}_deserializeValue(e,t){let i;switch(t){case Object:try{i=JSON.parse(e)}catch(t){i=e}break;case Array:try{i=JSON.parse(e)}catch(t){i=null,console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${e}`)}break;case Date:i=isNaN(e)?String(e):Number(e),i=new Date(i);break;default:i=super._deserializeValue(e,t)}return i}_definePropertyAccessor(e,t){saveAccessorValue(this,e),super._definePropertyAccessor(e,t)}_hasAccessor(e){return this.__dataHasAccessor&&this.__dataHasAccessor[e]}_isPropertyPending(e){return Boolean(this.__dataPending&&e in this.__dataPending)}}}),templateExtensions={"dom-if":!0,"dom-repeat":!0};function wrapTemplateExtension(e){let t=e.getAttribute("is");if(t&&templateExtensions[t]){let i=e;for(i.removeAttribute("is"),e=i.ownerDocument.createElement(t),i.parentNode.replaceChild(e,i),e.appendChild(i);i.attributes.length;)e.setAttribute(i.attributes[0].name,i.attributes[0].value),i.removeAttribute(i.attributes[0].name)}return e}function findTemplateNode(e,t){let i=t.parentInfo&&findTemplateNode(e,t.parentInfo);if(!i)return e;for(let e=i.firstChild,n=0;e;e=e.nextSibling)if(t.parentIndex===n++)return e}function applyIdToMap(e,t,i,n){n.id&&(t[n.id]=i)}function applyEventListener(e,t,i){if(i.events&&i.events.length)for(let n,s=0,o=i.events;s<o.length&&(n=o[s]);s++)e._addMethodEventListenerToNode(t,n.name,n.value,e)}function applyTemplateContent(e,t,i){i.templateInfo&&(t._templateInfo=i.templateInfo)}function createNodeEventHandler(e,t,i){e=e._methodHost||e;return function(t){e[i]?e[i](t,t.detail):console.warn("listener method `"+i+"` not defined")}}const TemplateStamp=dedupingMixin(e=>{return class extends e{static _parseTemplate(e,t){if(!e._templateInfo){let i=e._templateInfo={};i.nodeInfoList=[],i.stripWhiteSpace=t&&t.stripWhiteSpace||e.hasAttribute("strip-whitespace"),this._parseTemplateContent(e,i,{parent:null})}return e._templateInfo}static _parseTemplateContent(e,t,i){return this._parseTemplateNode(e.content,t,i)}static _parseTemplateNode(e,t,i){let n,s=e;return"template"!=s.localName||s.hasAttribute("preserve-content")?"slot"===s.localName&&(t.hasInsertionPoint=!0):n=this._parseTemplateNestedTemplate(s,t,i)||n,s.firstChild&&(n=this._parseTemplateChildNodes(s,t,i)||n),s.hasAttributes&&s.hasAttributes()&&(n=this._parseTemplateNodeAttributes(s,t,i)||n),n}static _parseTemplateChildNodes(e,t,i){if("script"!==e.localName&&"style"!==e.localName)for(let n,s=e.firstChild,o=0;s;s=n){if("template"==s.localName&&(s=wrapTemplateExtension(s)),n=s.nextSibling,s.nodeType===Node.TEXT_NODE){let i=n;for(;i&&i.nodeType===Node.TEXT_NODE;)s.textContent+=i.textContent,n=i.nextSibling,e.removeChild(i),i=n;if(t.stripWhiteSpace&&!s.textContent.trim()){e.removeChild(s);continue}}let a={parentIndex:o,parentInfo:i};this._parseTemplateNode(s,t,a)&&(a.infoIndex=t.nodeInfoList.push(a)-1),s.parentNode&&o++}}static _parseTemplateNestedTemplate(e,t,i){let n=this._parseTemplate(e,t);return(n.content=e.content.ownerDocument.createDocumentFragment()).appendChild(e.content),i.templateInfo=n,!0}static _parseTemplateNodeAttributes(e,t,i){let n=!1,s=Array.from(e.attributes);for(let o,a=s.length-1;o=s[a];a--)n=this._parseTemplateNodeAttribute(e,t,i,o.name,o.value)||n;return n}static _parseTemplateNodeAttribute(e,t,i,n,s){return"on-"===n.slice(0,3)?(e.removeAttribute(n),i.events=i.events||[],i.events.push({name:n.slice(3),value:s}),!0):"id"===n&&(i.id=s,!0)}static _contentForTemplate(e){let t=e._templateInfo;return t&&t.content||e.content}_stampTemplate(e){e&&!e.content&&window.HTMLTemplateElement&&HTMLTemplateElement.decorate&&HTMLTemplateElement.decorate(e);let t=this.constructor._parseTemplate(e),i=t.nodeInfoList,n=t.content||e.content,s=document.importNode(n,!0);s.__noInsertionPoint=!t.hasInsertionPoint;let o=s.nodeList=new Array(i.length);s.$={};for(let e,t=0,n=i.length;t<n&&(e=i[t]);t++){let i=o[t]=findTemplateNode(s,e);applyIdToMap(this,s.$,i,e),applyTemplateContent(this,i,e),applyEventListener(this,i,e)}return s=s}_addMethodEventListenerToNode(e,t,i,n){let s=createNodeEventHandler(n=n||e,t,i);return this._addEventListenerToNode(e,t,s),s}_addEventListenerToNode(e,t,i){e.addEventListener(t,i)}_removeEventListenerFromNode(e,t,i){e.removeEventListener(t,i)}}}),CaseMap=caseMap$0;let dedupeId$1=0;const TYPES={COMPUTE:"__computeEffects",REFLECT:"__reflectEffects",NOTIFY:"__notifyEffects",PROPAGATE:"__propagateEffects",OBSERVE:"__observeEffects",READ_ONLY:"__readOnly"},capitalAttributeRegex=/[A-Z]/;function ensureOwnEffectMap(e,t){let i=e[t];if(i){if(!e.hasOwnProperty(t)){i=e[t]=Object.create(e[t]);for(let e in i){let t=i[e],n=i[e]=Array(t.length);for(let e=0;e<t.length;e++)n[e]=t[e]}}}else i=e[t]={};return i}function runEffects(e,t,i,n,s,o){if(t){let a=!1,r=dedupeId$1++;for(let l in i)runEffectsForProperty(e,t,r,l,i,n,s,o)&&(a=!0);return a}return!1}function runEffectsForProperty(e,t,i,n,s,o,a,r){let l=!1,h=t[a?root(n):n];if(h)for(let t,c=0,d=h.length;c<d&&(t=h[c]);c++)t.info&&t.info.lastRun===i||a&&!pathMatchesTrigger(n,t.trigger)||(t.info&&(t.info.lastRun=i),t.fn(e,n,s,o,t.info,a,r),l=!0);return l}function pathMatchesTrigger(e,t){if(t){let i=t.name;return i==e||t.structured&&isAncestor(i,e)||t.wildcard&&isDescendant(i,e)}return!0}function runObserverEffect(e,t,i,n,s){let o="string"==typeof s.method?e[s.method]:s.method,a=s.property;o?o.call(e,e.__data[a],n[a]):s.dynamicFn||console.warn("observer method `"+s.method+"` not defined")}function runNotifyEffects(e,t,i,n,s){let o,a,r=e[TYPES.NOTIFY],l=dedupeId$1++;for(let a in t)t[a]&&(r&&runEffectsForProperty(e,r,l,a,i,n,s)?o=!0:s&&notifyPath(e,a,i)&&(o=!0));o&&(a=e.__dataHost)&&a._invalidateProperties&&a._invalidateProperties()}function notifyPath(e,t,i){let n=root(t);if(n!==t){return dispatchNotifyEvent(e,camelToDashCase(n)+"-changed",i[t],t),!0}return!1}function dispatchNotifyEvent(e,t,i,n){let s={value:i,queueProperty:!0};n&&(s.path=n),e.dispatchEvent(new CustomEvent(t,{detail:s}))}function runNotifyEffect(e,t,i,n,s,o){let a=(o?root(t):t)!=t?t:null,r=a?get(e,a):e.__data[t];a&&void 0===r&&(r=i[t]),dispatchNotifyEvent(e,s.eventName,r,a)}function handleNotification(e,t,i,n,s){let o,a=e.detail,r=a&&a.path;r?(n=translate(i,n,r),o=a&&a.value):o=e.target[i],o=s?!o:o,t[TYPES.READ_ONLY]&&t[TYPES.READ_ONLY][n]||!t._setPendingPropertyOrPath(n,o,!0,Boolean(r))||a&&a.queueProperty||t._invalidateProperties()}function runReflectEffect(e,t,i,n,s){let o=e.__data[t];sanitizeDOMValue&&(o=sanitizeDOMValue(o,s.attrName,"attribute",e)),e._propertyToAttribute(t,s.attrName,o)}function runComputedEffects(e,t,i,n){let s=e[TYPES.COMPUTE];if(s){let o=t;for(;runEffects(e,s,o,i,n);)Object.assign(i,e.__dataOld),Object.assign(t,e.__dataPending),o=e.__dataPending,e.__dataPending=null}}function runComputedEffect(e,t,i,n,s){let o=runMethodEffect(e,t,i,n,s),a=s.methodInfo;e.__dataHasAccessor&&e.__dataHasAccessor[a]?e._setPendingProperty(a,o,!0):e[a]=o}function computeLinkedPaths(e,t,i){let n=e.__dataLinkedPaths;if(n){let s;for(let o in n){let a=n[o];isDescendant(o,t)?(s=translate(o,a,t),e._setPendingPropertyOrPath(s,i,!0,!0)):isDescendant(a,t)&&(s=translate(a,o,t),e._setPendingPropertyOrPath(s,i,!0,!0))}}}function addBinding(e,t,i,n,s,o,a){i.bindings=i.bindings||[];let r={kind:n,target:s,parts:o,literal:a,isCompound:1!==o.length};if(i.bindings.push(r),shouldAddListener(r)){let{event:e,negate:t}=r.parts[0];r.listenerEvent=e||CaseMap.camelToDashCase(s)+"-changed",r.listenerNegate=t}let l=t.nodeInfoList.length;for(let i=0;i<r.parts.length;i++){let n=r.parts[i];n.compoundIndex=i,addEffectForBindingPart(e,t,r,n,l)}}function addEffectForBindingPart(e,t,i,n,s){if(!n.literal)if("attribute"===i.kind&&"-"===i.target[0])console.warn("Cannot set attribute "+i.target+' because "-" is not a valid attribute starting character');else{let o=n.dependencies,a={index:s,binding:i,part:n,evaluator:e};for(let i=0;i<o.length;i++){let n=o[i];"string"==typeof n&&((n=parseArg(n)).wildcard=!0),e._addTemplatePropertyEffect(t,n.rootProperty,{fn:runBindingEffect,info:a,trigger:n})}}}function runBindingEffect(e,t,i,n,s,o,a){let r=a[s.index],l=s.binding,h=s.part;if(o&&h.source&&t.length>h.source.length&&"property"==l.kind&&!l.isCompound&&r.__isPropertyEffectsClient&&r.__dataHasAccessor&&r.__dataHasAccessor[l.target]){let n=i[t];t=translate(h.source,l.target,t),r._setPendingPropertyOrPath(t,n,!1,!0)&&e._enqueueClient(r)}else{applyBindingValue(e,r,l,h,s.evaluator._evaluateBinding(e,h,t,i,n,o))}}function applyBindingValue(e,t,i,n,s){if(s=computeBindingValue(t,s,i,n),sanitizeDOMValue&&(s=sanitizeDOMValue(s,i.target,i.kind,t)),"attribute"==i.kind)e._valueToNodeAttribute(t,s,i.target);else{let n=i.target;t.__isPropertyEffectsClient&&t.__dataHasAccessor&&t.__dataHasAccessor[n]?t[TYPES.READ_ONLY]&&t[TYPES.READ_ONLY][n]||t._setPendingProperty(n,s)&&e._enqueueClient(t):e._setUnmanagedPropertyToNode(t,n,s)}}function computeBindingValue(e,t,i,n){if(i.isCompound){let s=e.__dataCompoundStorage[i.target];s[n.compoundIndex]=t,t=s.join("")}return"attribute"!==i.kind&&("textContent"!==i.target&&("value"!==i.target||"input"!==e.localName&&"textarea"!==e.localName)||(t=null==t?"":t)),t}function shouldAddListener(e){return Boolean(e.target)&&"attribute"!=e.kind&&"text"!=e.kind&&!e.isCompound&&"{"===e.parts[0].mode}function setupBindings(e,t){let{nodeList:i,nodeInfoList:n}=t;if(n.length)for(let t=0;t<n.length;t++){let s=n[t],o=i[t],a=s.bindings;if(a)for(let t=0;t<a.length;t++){let i=a[t];setupCompoundStorage(o,i),addNotifyListener(o,e,i)}o.__dataHost=e}}function setupCompoundStorage(e,t){if(t.isCompound){let i=e.__dataCompoundStorage||(e.__dataCompoundStorage={}),n=t.parts,s=new Array(n.length);for(let e=0;e<n.length;e++)s[e]=n[e].literal;let o=t.target;i[o]=s,t.literal&&"property"==t.kind&&(e[o]=t.literal)}}function addNotifyListener(e,t,i){if(i.listenerEvent){let n=i.parts[0];e.addEventListener(i.listenerEvent,function(e){handleNotification(e,t,i.target,n.source,n.negate)})}}function createMethodEffect(e,t,i,n,s,o){o=t.static||o&&("object"!=typeof o||o[t.methodName]);let a={methodName:t.methodName,args:t.args,methodInfo:s,dynamicFn:o};for(let s,o=0;o<t.args.length&&(s=t.args[o]);o++)s.literal||e._addPropertyEffect(s.rootProperty,i,{fn:n,info:a,trigger:s});o&&e._addPropertyEffect(t.methodName,i,{fn:n,info:a})}function runMethodEffect(e,t,i,n,s){let o=e._methodHost||e,a=o[s.methodName];if(a){let n=marshalArgs(e.__data,s.args,t,i);return a.apply(o,n)}s.dynamicFn||console.warn("method `"+s.methodName+"` not defined")}const emptyArray=[],IDENT="(?:[a-zA-Z_$][\\w.:$\\-*]*)",NUMBER="(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)",SQUOTE_STRING="(?:'(?:[^'\\\\]|\\\\.)*')",DQUOTE_STRING='(?:"(?:[^"\\\\]|\\\\.)*")',STRING="(?:"+SQUOTE_STRING+"|"+DQUOTE_STRING+")",ARGUMENT="(?:("+IDENT+"|"+NUMBER+"|"+STRING+")\\s*)",ARGUMENTS="(?:"+ARGUMENT+"(?:,\\s*"+ARGUMENT+")*)",ARGUMENT_LIST="(?:\\(\\s*(?:"+ARGUMENTS+"?)\\)\\s*)",BINDING="("+IDENT+"\\s*"+ARGUMENT_LIST+"?)",OPEN_BRACKET="(\\[\\[|{{)\\s*",CLOSE_BRACKET="(?:]]|}})",NEGATE="(?:(!)\\s*)?",EXPRESSION=OPEN_BRACKET+NEGATE+BINDING+"(?:]]|}})",bindingRegex=new RegExp(EXPRESSION,"g");function literalFromParts(e){let t="";for(let i=0;i<e.length;i++){t+=e[i].literal||""}return t}function parseMethod(e){let t=e.match(/([^\s]+?)\(([\s\S]*)\)/);if(t){let e={methodName:t[1],static:!0,args:emptyArray};if(t[2].trim()){return parseArgs(t[2].replace(/\\,/g,"&comma;").split(","),e)}return e}return null}function parseArgs(e,t){return t.args=e.map(function(e){let i=parseArg(e);return i.literal||(t.static=!1),i},this),t}function parseArg(e){let t=e.trim().replace(/&comma;/g,",").replace(/\\(.)/g,"$1"),i={name:t,value:"",literal:!1},n=t[0];switch("-"===n&&(n=t[1]),n>="0"&&n<="9"&&(n="#"),n){case"'":case'"':i.value=t.slice(1,-1),i.literal=!0;break;case"#":i.value=Number(t),i.literal=!0}return i.literal||(i.rootProperty=root(t),i.structured=isPath(t),i.structured&&(i.wildcard=".*"==t.slice(-2),i.wildcard&&(i.name=t.slice(0,-2)))),i}function marshalArgs(e,t,i,n){let s=[];for(let o=0,a=t.length;o<a;o++){let a,r=t[o],l=r.name;if(r.literal?a=r.value:r.structured?void 0===(a=get(e,l))&&(a=n[l]):a=e[l],r.wildcard){let e=0===l.indexOf(i+"."),t=0===i.indexOf(l)&&!e;s[o]={path:t?i:l,value:t?n[i]:a,base:a}}else s[o]=a}return s}function notifySplices(e,t,i,n){let s=i+".splices";e.notifyPath(s,{indexSplices:n}),e.notifyPath(i+".length",t.length),e.__data[s]={indexSplices:null}}function notifySplice(e,t,i,n,s,o){notifySplices(e,t,i,[{index:n,addedCount:s,removed:o,object:t,type:"splice"}])}function upper(e){return e[0].toUpperCase()+e.substring(1)}const PropertyEffects=dedupingMixin(e=>{const t=TemplateStamp(PropertyAccessors(e));return class extends t{constructor(){super(),this.__isPropertyEffectsClient=!0,this.__dataCounter=0,this.__dataClientsReady,this.__dataPendingClients,this.__dataToNotify,this.__dataLinkedPaths,this.__dataHasPaths,this.__dataCompoundStorage,this.__dataHost,this.__dataTemp,this.__dataClientsInitialized,this.__data,this.__dataPending,this.__dataOld,this.__computeEffects,this.__reflectEffects,this.__notifyEffects,this.__propagateEffects,this.__observeEffects,this.__readOnly,this.__templateInfo}get PROPERTY_EFFECT_TYPES(){return TYPES}_initializeProperties(){super._initializeProperties(),hostStack.registerHost(this),this.__dataClientsReady=!1,this.__dataPendingClients=null,this.__dataToNotify=null,this.__dataLinkedPaths=null,this.__dataHasPaths=!1,this.__dataCompoundStorage=this.__dataCompoundStorage||null,this.__dataHost=this.__dataHost||null,this.__dataTemp={},this.__dataClientsInitialized=!1}_initializeProtoProperties(e){this.__data=Object.create(e),this.__dataPending=Object.create(e),this.__dataOld={}}_initializeInstanceProperties(e){let t=this[TYPES.READ_ONLY];for(let i in e)t&&t[i]||(this.__dataPending=this.__dataPending||{},this.__dataOld=this.__dataOld||{},this.__data[i]=this.__dataPending[i]=e[i])}_addPropertyEffect(e,t,i){this._createPropertyAccessor(e,t==TYPES.READ_ONLY);let n=ensureOwnEffectMap(this,t)[e];n||(n=this[t][e]=[]),n.push(i)}_removePropertyEffect(e,t,i){let n=ensureOwnEffectMap(this,t)[e],s=n.indexOf(i);s>=0&&n.splice(s,1)}_hasPropertyEffect(e,t){let i=this[t];return Boolean(i&&i[e])}_hasReadOnlyEffect(e){return this._hasPropertyEffect(e,TYPES.READ_ONLY)}_hasNotifyEffect(e){return this._hasPropertyEffect(e,TYPES.NOTIFY)}_hasReflectEffect(e){return this._hasPropertyEffect(e,TYPES.REFLECT)}_hasComputedEffect(e){return this._hasPropertyEffect(e,TYPES.COMPUTE)}_setPendingPropertyOrPath(e,t,i,n){if(n||root(Array.isArray(e)?e[0]:e)!==e){if(!n){let i=get(this,e);if(!(e=set(this,e,t))||!super._shouldPropertyChange(e,t,i))return!1}if(this.__dataHasPaths=!0,this._setPendingProperty(e,t,i))return computeLinkedPaths(this,e,t),!0}else{if(this.__dataHasAccessor&&this.__dataHasAccessor[e])return this._setPendingProperty(e,t,i);this[e]=t}return!1}_setUnmanagedPropertyToNode(e,t,i){i===e[t]&&"object"!=typeof i||(e[t]=i)}_setPendingProperty(e,t,i){let n=this.__dataHasPaths&&isPath(e),s=n?this.__dataTemp:this.__data;return!!this._shouldPropertyChange(e,t,s[e])&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),e in this.__dataOld||(this.__dataOld[e]=this.__data[e]),n?this.__dataTemp[e]=t:this.__data[e]=t,this.__dataPending[e]=t,(n||this[TYPES.NOTIFY]&&this[TYPES.NOTIFY][e])&&(this.__dataToNotify=this.__dataToNotify||{},this.__dataToNotify[e]=i),!0)}_setProperty(e,t){this._setPendingProperty(e,t,!0)&&this._invalidateProperties()}_invalidateProperties(){this.__dataReady&&this._flushProperties()}_enqueueClient(e){this.__dataPendingClients=this.__dataPendingClients||[],e!==this&&this.__dataPendingClients.push(e)}_flushProperties(){this.__dataCounter++,super._flushProperties(),this.__dataCounter--}_flushClients(){this.__dataClientsReady?this.__enableOrFlushClients():(this.__dataClientsReady=!0,this._readyClients(),this.__dataReady=!0)}__enableOrFlushClients(){let e=this.__dataPendingClients;if(e){this.__dataPendingClients=null;for(let t=0;t<e.length;t++){let i=e[t];i.__dataEnabled?i.__dataPending&&i._flushProperties():i._enableProperties()}}}_readyClients(){this.__enableOrFlushClients()}setProperties(e,t){for(let i in e)!t&&this[TYPES.READ_ONLY]&&this[TYPES.READ_ONLY][i]||this._setPendingPropertyOrPath(i,e[i],!0);this._invalidateProperties()}ready(){this._flushProperties(),this.__dataClientsReady||this._flushClients(),this.__dataPending&&this._flushProperties()}_propertiesChanged(e,t,i){let n=this.__dataHasPaths;this.__dataHasPaths=!1,runComputedEffects(this,t,i,n);let s=this.__dataToNotify;this.__dataToNotify=null,this._propagatePropertyChanges(t,i,n),this._flushClients(),runEffects(this,this[TYPES.REFLECT],t,i,n),runEffects(this,this[TYPES.OBSERVE],t,i,n),s&&runNotifyEffects(this,s,t,i,n),1==this.__dataCounter&&(this.__dataTemp={})}_propagatePropertyChanges(e,t,i){this[TYPES.PROPAGATE]&&runEffects(this,this[TYPES.PROPAGATE],e,t,i);let n=this.__templateInfo;for(;n;)runEffects(this,n.propertyEffects,e,t,i,n.nodeList),n=n.nextTemplateInfo}linkPaths(e,t){e=normalize(e),t=normalize(t),this.__dataLinkedPaths=this.__dataLinkedPaths||{},this.__dataLinkedPaths[e]=t}unlinkPaths(e){e=normalize(e),this.__dataLinkedPaths&&delete this.__dataLinkedPaths[e]}notifySplices(e,t){let i={path:""};notifySplices(this,get(this,e,i),i.path,t)}get(e,t){return get(t||this,e)}set(e,t,i){i?set(i,e,t):this[TYPES.READ_ONLY]&&this[TYPES.READ_ONLY][e]||this._setPendingPropertyOrPath(e,t,!0)&&this._invalidateProperties()}push(e,...t){let i={path:""},n=get(this,e,i),s=n.length,o=n.push(...t);return t.length&&notifySplice(this,n,i.path,s,t.length,[]),o}pop(e){let t={path:""},i=get(this,e,t),n=Boolean(i.length),s=i.pop();return n&&notifySplice(this,i,t.path,i.length,0,[s]),s}splice(e,t,i,...n){let s,o={path:""},a=get(this,e,o);return t<0?t=a.length-Math.floor(-t):t&&(t=Math.floor(t)),s=2===arguments.length?a.splice(t):a.splice(t,i,...n),(n.length||s.length)&&notifySplice(this,a,o.path,t,n.length,s),s}shift(e){let t={path:""},i=get(this,e,t),n=Boolean(i.length),s=i.shift();return n&&notifySplice(this,i,t.path,0,0,[s]),s}unshift(e,...t){let i={path:""},n=get(this,e,i),s=n.unshift(...t);return t.length&&notifySplice(this,n,i.path,0,t.length,[]),s}notifyPath(e,t){let i;if(1==arguments.length){let n={path:""};t=get(this,e,n),i=n.path}else i=Array.isArray(e)?normalize(e):e;this._setPendingPropertyOrPath(i,t,!0,!0)&&this._invalidateProperties()}_createReadOnlyProperty(e,t){this._addPropertyEffect(e,TYPES.READ_ONLY),t&&(this["_set"+upper(e)]=function(t){this._setProperty(e,t)})}_createPropertyObserver(e,t,i){let n={property:e,method:t,dynamicFn:Boolean(i)};this._addPropertyEffect(e,TYPES.OBSERVE,{fn:runObserverEffect,info:n,trigger:{name:e}}),i&&this._addPropertyEffect(t,TYPES.OBSERVE,{fn:runObserverEffect,info:n,trigger:{name:t}})}_createMethodObserver(e,t){let i=parseMethod(e);if(!i)throw new Error("Malformed observer expression '"+e+"'");createMethodEffect(this,i,TYPES.OBSERVE,runMethodEffect,null,t)}_createNotifyingProperty(e){this._addPropertyEffect(e,TYPES.NOTIFY,{fn:runNotifyEffect,info:{eventName:CaseMap.camelToDashCase(e)+"-changed",property:e}})}_createReflectedProperty(e){let t=this.constructor.attributeNameForProperty(e);"-"===t[0]?console.warn("Property "+e+" cannot be reflected to attribute "+t+' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'):this._addPropertyEffect(e,TYPES.REFLECT,{fn:runReflectEffect,info:{attrName:t}})}_createComputedProperty(e,t,i){let n=parseMethod(t);if(!n)throw new Error("Malformed computed expression '"+t+"'");createMethodEffect(this,n,TYPES.COMPUTE,runComputedEffect,e,i)}static addPropertyEffect(e,t,i){this.prototype._addPropertyEffect(e,t,i)}static createPropertyObserver(e,t,i){this.prototype._createPropertyObserver(e,t,i)}static createMethodObserver(e,t){this.prototype._createMethodObserver(e,t)}static createNotifyingProperty(e){this.prototype._createNotifyingProperty(e)}static createReadOnlyProperty(e,t){this.prototype._createReadOnlyProperty(e,t)}static createReflectedProperty(e){this.prototype._createReflectedProperty(e)}static createComputedProperty(e,t,i){this.prototype._createComputedProperty(e,t,i)}static bindTemplate(e){return this.prototype._bindTemplate(e)}_bindTemplate(e,t){let i=this.constructor._parseTemplate(e),n=this.__templateInfo==i;if(!n)for(let e in i.propertyEffects)this._createPropertyAccessor(e);if(t&&((i=Object.create(i)).wasPreBound=n,!n&&this.__templateInfo)){let e=this.__templateInfoLast||this.__templateInfo;return this.__templateInfoLast=e.nextTemplateInfo=i,i.previousTemplateInfo=e,i}return this.__templateInfo=i}static _addTemplatePropertyEffect(e,t,i){(e.hostProps=e.hostProps||{})[t]=!0;let n=e.propertyEffects=e.propertyEffects||{};(n[t]=n[t]||[]).push(i)}_stampTemplate(e){hostStack.beginHosting(this);let t=super._stampTemplate(e);hostStack.endHosting(this);let i=this._bindTemplate(e,!0);if(i.nodeList=t.nodeList,!i.wasPreBound){let e=i.childNodes=[];for(let i=t.firstChild;i;i=i.nextSibling)e.push(i)}return t.templateInfo=i,setupBindings(this,i),this.__dataReady&&runEffects(this,i.propertyEffects,this.__data,null,!1,i.nodeList),t}_removeBoundDom(e){let t=e.templateInfo;t.previousTemplateInfo&&(t.previousTemplateInfo.nextTemplateInfo=t.nextTemplateInfo),t.nextTemplateInfo&&(t.nextTemplateInfo.previousTemplateInfo=t.previousTemplateInfo),this.__templateInfoLast==t&&(this.__templateInfoLast=t.previousTemplateInfo),t.previousTemplateInfo=t.nextTemplateInfo=null;let i=t.childNodes;for(let e=0;e<i.length;e++){let t=i[e];t.parentNode.removeChild(t)}}static _parseTemplateNode(e,t,i){let n=super._parseTemplateNode(e,t,i);if(e.nodeType===Node.TEXT_NODE){let s=this._parseBindings(e.textContent,t);s&&(e.textContent=literalFromParts(s)||" ",addBinding(this,t,i,"text","textContent",s),n=!0)}return n}static _parseTemplateNodeAttribute(e,t,i,n,s){let o=this._parseBindings(s,t);if(o){let s=n,a="property";capitalAttributeRegex.test(n)?a="attribute":"$"==n[n.length-1]&&(n=n.slice(0,-1),a="attribute");let r=literalFromParts(o);return r&&"attribute"==a&&e.setAttribute(n,r),"input"===e.localName&&"value"===s&&e.setAttribute(s,""),e.removeAttribute(s),"property"===a&&(n=dashToCamelCase(n)),addBinding(this,t,i,a,n,o,r),!0}return super._parseTemplateNodeAttribute(e,t,i,n,s)}static _parseTemplateNestedTemplate(e,t,i){let n=super._parseTemplateNestedTemplate(e,t,i),s=i.templateInfo.hostProps;for(let e in s)addBinding(this,t,i,"property","_host_"+e,[{mode:"{",source:e,dependencies:[e]}]);return n}static _parseBindings(e,t){let i,n=[],s=0;for(;null!==(i=bindingRegex.exec(e));){i.index>s&&n.push({literal:e.slice(s,i.index)});let o=i[1][0],a=Boolean(i[2]),r=i[3].trim(),l=!1,h="",c=-1;"{"==o&&(c=r.indexOf("::"))>0&&(h=r.substring(c+2),r=r.substring(0,c),l=!0);let d=parseMethod(r),p=[];if(d){let{args:e,methodName:i}=d;for(let t=0;t<e.length;t++){let i=e[t];i.literal||p.push(i)}let n=t.dynamicFns;(n&&n[i]||d.static)&&(p.push(i),d.dynamicFn=!0)}else p.push(r);n.push({source:r,mode:o,negate:a,customEvent:l,signature:d,dependencies:p,event:h}),s=bindingRegex.lastIndex}if(s&&s<e.length){let t=e.substring(s);t&&n.push({literal:t})}return n.length?n:null}static _evaluateBinding(e,t,i,n,s,o){let a;return a=t.signature?runMethodEffect(e,i,n,s,t.signature):i!=t.source?get(e,t.source):o&&isPath(i)?get(e,i):e.__data[i],t.negate&&(a=!a),a}}});class HostStack{constructor(){this.stack=[]}registerHost(e){if(this.stack.length){this.stack[this.stack.length-1]._enqueueClient(e)}}beginHosting(e){this.stack.push(e)}endHosting(e){let t=this.stack.length;t&&this.stack[t-1]==e&&this.stack.pop()}}const hostStack=new HostStack;function normalizeProperties(e){const t={};for(let i in e){const n=e[i];t[i]="function"==typeof n?{type:n}:n}return t}const PropertiesMixin=dedupingMixin(e=>{const t=PropertiesChanged(e);function i(e){const t=Object.getPrototypeOf(e);return t.prototype instanceof s?t:null}function n(e){if(!e.hasOwnProperty(JSCompiler_renameProperty("__ownProperties",e))){let t=null;e.hasOwnProperty(JSCompiler_renameProperty("properties",e))&&e.properties&&(t=normalizeProperties(e.properties)),e.__ownProperties=t}return e.__ownProperties}class s extends t{static get observedAttributes(){const e=this._properties;return e?Object.keys(e).map(e=>this.attributeNameForProperty(e)):[]}static finalize(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__finalized",this))){const e=i(this);e&&e.finalize(),this.__finalized=!0,this._finalizeClass()}}static _finalizeClass(){const e=n(this);e&&this.createProperties(e)}static get _properties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__properties",this))){const e=i(this);this.__properties=Object.assign({},e&&e._properties,n(this))}return this.__properties}static typeForProperty(e){const t=this._properties[e];return t&&t.type}_initializeProperties(){this.constructor.finalize(),super._initializeProperties()}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._enableProperties()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback()}}return s}),ElementMixin=dedupingMixin(e=>{const t=PropertiesMixin(PropertyEffects(e));return class extends t{static _finalizeClass(){super._finalizeClass(),this.hasOwnProperty(JSCompiler_renameProperty("is",this))&&this.is&&register(this.prototype);const e=((t=this).hasOwnProperty(JSCompiler_renameProperty("__ownObservers",t))||(t.__ownObservers=t.hasOwnProperty(JSCompiler_renameProperty("observers",t))?t.observers:null),t.__ownObservers);var t;e&&this.createObservers(e,this._properties);let i=this.template;i&&("string"==typeof i?(console.error("template getter must return HTMLTemplateElement"),i=null):i=i.cloneNode(!0)),this.prototype._template=i}static createProperties(e){for(let o in e)t=this.prototype,i=o,n=e[o],s=e,n.computed&&(n.readOnly=!0),n.computed&&!t._hasReadOnlyEffect(i)&&t._createComputedProperty(i,n.computed,s),n.readOnly&&!t._hasReadOnlyEffect(i)&&t._createReadOnlyProperty(i,!n.computed),n.reflectToAttribute&&!t._hasReflectEffect(i)&&t._createReflectedProperty(i),n.notify&&!t._hasNotifyEffect(i)&&t._createNotifyingProperty(i),n.observer&&t._createPropertyObserver(i,n.observer,s[n.observer]),t._addPropertyToAttributeMap(i);var t,i,n,s}static createObservers(e,t){const i=this.prototype;for(let n=0;n<e.length;n++)i._createMethodObserver(e[n],t)}static get template(){return this.hasOwnProperty(JSCompiler_renameProperty("_template",this))||(this._template=DomModule&&DomModule.import(this.is,"template")||Object.getPrototypeOf(this.prototype).constructor.template),this._template}static get importPath(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_importPath",this))){const e=this.importMeta;if(e)this._importPath=pathFromUrl(e.url);else{const e=DomModule&&DomModule.import(this.is);this._importPath=e&&e.assetpath||Object.getPrototypeOf(this.prototype).constructor.importPath}}return this._importPath}constructor(){super(),this._template,this._importPath,this.rootPath,this.importPath,this.root,this.$}_initializeProperties(){this.constructor.finalize(),this.constructor._finalizeTemplate(this.localName),super._initializeProperties(),this.rootPath=rootPath,this.importPath=this.constructor.importPath;let e=function(e){if(!e.hasOwnProperty(JSCompiler_renameProperty("__propertyDefaults",e))){e.__propertyDefaults=null;let t=e._properties;for(let i in t){let n=t[i];"value"in n&&(e.__propertyDefaults=e.__propertyDefaults||{},e.__propertyDefaults[i]=n)}}return e.__propertyDefaults}(this.constructor);if(e)for(let t in e){let i=e[t];if(!this.hasOwnProperty(t)){let e="function"==typeof i.value?i.value.call(this):i.value;this._hasAccessor(t)?this._setPendingProperty(t,e,!0):this[t]=e}}}static _processStyleText(e,t){return resolveCss(e,t)}static _finalizeTemplate(e){const t=this.prototype._template;if(t&&!t.__polymerFinalized){t.__polymerFinalized=!0;const i=this.importPath;!function(e,t,i,n){const s=t.content.querySelectorAll("style"),o=stylesFromTemplate(t),a=stylesFromModuleImports(i),r=t.content.firstElementChild;for(let i=0;i<a.length;i++){let s=a[i];s.textContent=e._processStyleText(s.textContent,n),t.content.insertBefore(s,r)}let l=0;for(let t=0;t<o.length;t++){let i=o[t],a=s[l];a!==i?(i=i.cloneNode(!0),a.parentNode.insertBefore(i,a)):l++,i.textContent=e._processStyleText(i.textContent,n)}window.ShadyCSS&&window.ShadyCSS.prepareTemplate(t,i)}(this,t,e,i?resolveUrl(i):""),this.prototype._bindTemplate(t)}}connectedCallback(){window.ShadyCSS&&this._template&&window.ShadyCSS.styleElement(this),super.connectedCallback()}ready(){this._template&&(this.root=this._stampTemplate(this._template),this.$=this.root.$),super.ready()}_readyClients(){this._template&&(this.root=this._attachDom(this.root)),super._readyClients()}_attachDom(e){if(this.attachShadow)return e?(this.shadowRoot||this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(e),this.shadowRoot):null;throw new Error("ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`.")}updateStyles(e){window.ShadyCSS&&window.ShadyCSS.styleSubtree(this,e)}resolveUrl(e,t){return!t&&this.importPath&&(t=resolveUrl(this.importPath)),resolveUrl(e,t)}static _parseTemplateContent(e,t,i){return t.dynamicFns=t.dynamicFns||this._properties,super._parseTemplateContent(e,t,i)}}});function register(e){}class LiteralString{constructor(e){this.value=e.toString()}toString(){return this.value}}function literalValue(e){if(e instanceof LiteralString)return e.value;throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${e}`)}function htmlValue(e){if(e instanceof HTMLTemplateElement)return e.innerHTML;if(e instanceof LiteralString)return literalValue(e);throw new Error(`non-template value passed to Polymer's html function: ${e}`)}const html=function(e,...t){const i=document.createElement("template");return i.innerHTML=t.reduce((t,i,n)=>t+htmlValue(i)+e[n+1],e[0]),i},PolymerElement=ElementMixin(HTMLElement),nativeShadow=!(window.ShadyDOM&&window.ShadyDOM.inUse);let nativeCssVariables_;function calcCssVariables(e){nativeCssVariables_=(!e||!e.shimcssproperties)&&(nativeShadow||Boolean(!navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/)&&window.CSS&&CSS.supports&&CSS.supports("box-shadow","0 0 0 var(--foo)")))}window.ShadyCSS&&void 0!==window.ShadyCSS.nativeCss?nativeCssVariables_=window.ShadyCSS.nativeCss:window.ShadyCSS?(calcCssVariables(window.ShadyCSS),window.ShadyCSS=void 0):calcCssVariables(window.WebComponents&&window.WebComponents.flags);const nativeCssVariables=nativeCssVariables_;class StyleNode{constructor(){this.start=0,this.end=0,this.previous=null,this.parent=null,this.rules=null,this.parsedCssText="",this.cssText="",this.atRule=!1,this.type=0,this.keyframesName="",this.selector="",this.parsedSelector=""}}function parse(e){return parseCss(lex(e=clean(e)),e)}function clean(e){return e.replace(RX.comments,"").replace(RX.port,"")}function lex(e){let t=new StyleNode;t.start=0,t.end=e.length;let i=t;for(let n=0,s=e.length;n<s;n++)if(e[n]===OPEN_BRACE){i.rules||(i.rules=[]);let e=i,t=e.rules[e.rules.length-1]||null;(i=new StyleNode).start=n+1,i.parent=e,i.previous=t,e.rules.push(i)}else e[n]===CLOSE_BRACE&&(i.end=n+1,i=i.parent||t);return t}function parseCss(e,t){let i=t.substring(e.start,e.end-1);if(e.parsedCssText=e.cssText=i.trim(),e.parent){let n=e.previous?e.previous.end:e.parent.start;i=(i=(i=_expandUnicodeEscapes(i=t.substring(n,e.start-1))).replace(RX.multipleSpaces," ")).substring(i.lastIndexOf(";")+1);let s=e.parsedSelector=e.selector=i.trim();e.atRule=0===s.indexOf(AT_START),e.atRule?0===s.indexOf(MEDIA_START)?e.type=types.MEDIA_RULE:s.match(RX.keyframesRule)&&(e.type=types.KEYFRAMES_RULE,e.keyframesName=e.selector.split(RX.multipleSpaces).pop()):0===s.indexOf(VAR_START)?e.type=types.MIXIN_RULE:e.type=types.STYLE_RULE}let n=e.rules;if(n)for(let e,i=0,s=n.length;i<s&&(e=n[i]);i++)parseCss(e,t);return e}function _expandUnicodeEscapes(e){return e.replace(/\\([0-9a-f]{1,6})\s/gi,function(){let e=arguments[1],t=6-e.length;for(;t--;)e="0"+e;return"\\"+e})}function stringify(e,t,i=""){let n="";if(e.cssText||e.rules){let i=e.rules;if(i&&!_hasMixinRules(i))for(let e,s=0,o=i.length;s<o&&(e=i[s]);s++)n=stringify(e,t,n);else(n=(n=t?e.cssText:removeCustomProps(e.cssText)).trim())&&(n="  "+n+"\n")}return n&&(e.selector&&(i+=e.selector+" "+OPEN_BRACE+"\n"),i+=n,e.selector&&(i+=CLOSE_BRACE+"\n\n")),i}function _hasMixinRules(e){let t=e[0];return Boolean(t)&&Boolean(t.selector)&&0===t.selector.indexOf(VAR_START)}function removeCustomProps(e){return removeCustomPropApply(e=removeCustomPropAssignment(e))}function removeCustomPropAssignment(e){return e.replace(RX.customProp,"").replace(RX.mixinProp,"")}function removeCustomPropApply(e){return e.replace(RX.mixinApply,"").replace(RX.varApply,"")}const types={STYLE_RULE:1,KEYFRAMES_RULE:7,MEDIA_RULE:4,MIXIN_RULE:1e3},OPEN_BRACE="{",CLOSE_BRACE="}",RX={comments:/\/\*[^*]*\*+([^\/*][^*]*\*+)*\//gim,port:/@import[^;]*;/gim,customProp:/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,mixinProp:/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,mixinApply:/@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,varApply:/[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,keyframesRule:/^@[^\s]*keyframes/,multipleSpaces:/\s+/g},VAR_START="--",MEDIA_START="@media",AT_START="@",VAR_ASSIGN=/(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,MIXIN_MATCH=/(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,MEDIA_MATCH=/@media\s(.*)/,styleTextSet=new Set,scopingAttribute="shady-unscoped";function processUnscopedStyle(e){const t=e.textContent;if(!styleTextSet.has(t)){styleTextSet.add(t);const i=e.cloneNode(!0);document.head.appendChild(i)}}function isUnscopedStyle(e){return e.hasAttribute(scopingAttribute)}function toCssText(e,t){return e?("string"==typeof e&&(e=parse(e)),t&&forEachRule(e,t),stringify(e,nativeCssVariables)):""}function rulesForStyle(e){return!e.__cssRules&&e.textContent&&(e.__cssRules=parse(e.textContent)),e.__cssRules||null}function forEachRule(e,t,i,n){if(!e)return;let s=!1,o=e.type;if(n&&o===types.MEDIA_RULE){let t=e.selector.match(MEDIA_MATCH);t&&(window.matchMedia(t[1]).matches||(s=!0))}o===types.STYLE_RULE?t(e):i&&o===types.KEYFRAMES_RULE?i(e):o===types.MIXIN_RULE&&(s=!0);let a=e.rules;if(a&&!s)for(let e,s=0,o=a.length;s<o&&(e=a[s]);s++)forEachRule(e,t,i,n)}function findMatchingParen(e,t){let i=0;for(let n=t,s=e.length;n<s;n++)if("("===e[n])i++;else if(")"===e[n]&&0==--i)return n;return-1}function processVariableAndFallback(e,t){let i=e.indexOf("var(");if(-1===i)return t(e,"","","");let n=findMatchingParen(e,i+3),s=e.substring(i+4,n),o=e.substring(0,i),a=processVariableAndFallback(e.substring(n+1),t),r=s.indexOf(",");return-1===r?t(o,s.trim(),"",a):t(o,s.substring(0,r).trim(),s.substring(r+1).trim(),a)}function getIsExtends(e){let t=e.localName,i="",n="";return t?t.indexOf("-")>-1?i=t:(n=t,i=e.getAttribute&&e.getAttribute("is")||""):(i=e.is,n=e.extends),{is:i,typeExtension:n}}function gatherStyleText(e){const t=[],i=e.querySelectorAll("style");for(let e=0;e<i.length;e++){const n=i[e];isUnscopedStyle(n)?nativeShadow||(processUnscopedStyle(n),n.parentNode.removeChild(n)):(t.push(n.textContent),n.parentNode.removeChild(n))}return t.join("").trim()}const CSS_BUILD_ATTR="css-build";function getCssBuild(e){if(void 0===e.__cssBuild){const t=e.getAttribute(CSS_BUILD_ATTR);if(t)e.__cssBuild=t;else{const t=getBuildComment(e);""!==t&&removeBuildComment(e),e.__cssBuild=t}}return e.__cssBuild||""}function elementHasBuiltCss(e){return""!==getCssBuild(e)}function getBuildComment(e){const t="template"===e.localName?e.content.firstChild:e.firstChild;if(t instanceof Comment){const e=t.textContent.trim().split(":");if(e[0]===CSS_BUILD_ATTR)return e[1]}return""}function removeBuildComment(e){const t="template"===e.localName?e.content.firstChild:e.firstChild;t.parentNode.removeChild(t)}function updateNativeProperties(e,t){for(let i in t)null===i?e.style.removeProperty(i):e.style.setProperty(i,t[i])}function getComputedStyleValue(e,t){const i=window.getComputedStyle(e).getPropertyValue(t);return i?i.trim():""}function detectMixin(e){const t=MIXIN_MATCH.test(e)||VAR_ASSIGN.test(e);return MIXIN_MATCH.lastIndex=0,VAR_ASSIGN.lastIndex=0,t}const APPLY_NAME_CLEAN=/;\s*/m,INITIAL_INHERIT=/^\s*(initial)|(inherit)\s*$/,IMPORTANT=/\s*!important/,MIXIN_VAR_SEP="_-_";class MixinMap{constructor(){this._map={}}set(e,t){e=e.trim(),this._map[e]={properties:t,dependants:{}}}get(e){return e=e.trim(),this._map[e]||null}}let invalidCallback=null;class ApplyShim{constructor(){this._currentElement=null,this._measureElement=null,this._map=new MixinMap}detectMixin(e){return detectMixin(e)}gatherStyles(e){const t=gatherStyleText(e.content);if(t){const i=document.createElement("style");return i.textContent=t,e.content.insertBefore(i,e.content.firstChild),i}return null}transformTemplate(e,t){void 0===e._gatheredStyle&&(e._gatheredStyle=this.gatherStyles(e));const i=e._gatheredStyle;return i?this.transformStyle(i,t):null}transformStyle(e,t=""){let i=rulesForStyle(e);return this.transformRules(i,t),e.textContent=toCssText(i),i}transformCustomStyle(e){let t=rulesForStyle(e);return forEachRule(t,e=>{":root"===e.selector&&(e.selector="html"),this.transformRule(e)}),e.textContent=toCssText(t),t}transformRules(e,t){this._currentElement=t,forEachRule(e,e=>{this.transformRule(e)}),this._currentElement=null}transformRule(e){e.cssText=this.transformCssText(e.parsedCssText),":root"===e.selector&&(e.selector=":host > *")}transformCssText(e){return e=e.replace(VAR_ASSIGN,(e,t,i,n)=>this._produceCssProperties(e,t,i,n)),this._consumeCssProperties(e)}_getInitialValueForProperty(e){return this._measureElement||(this._measureElement=document.createElement("meta"),this._measureElement.setAttribute("apply-shim-measure",""),this._measureElement.style.all="initial",document.head.appendChild(this._measureElement)),window.getComputedStyle(this._measureElement).getPropertyValue(e)}_consumeCssProperties(e){let t=null;for(;t=MIXIN_MATCH.exec(e);){let i=t[0],n=t[1],s=t.index,o=s+i.indexOf("@apply"),a=s+i.length,r=e.slice(0,o),l=e.slice(a),h=this._cssTextToMap(r),c=this._atApplyToCssProperties(n,h);e=`${r}${c}${l}`,MIXIN_MATCH.lastIndex=s+c.length}return e}_atApplyToCssProperties(e,t){e=e.replace(APPLY_NAME_CLEAN,"");let i=[],n=this._map.get(e);if(n||(this._map.set(e,{}),n=this._map.get(e)),n){let s,o,a;this._currentElement&&(n.dependants[this._currentElement]=!0);const r=n.properties;for(s in r)a=t&&t[s],o=[s,": var(",e,MIXIN_VAR_SEP,s],a&&o.push(",",a.replace(IMPORTANT,"")),o.push(")"),IMPORTANT.test(r[s])&&o.push(" !important"),i.push(o.join(""))}return i.join("; ")}_replaceInitialOrInherit(e,t){let i=INITIAL_INHERIT.exec(t);return i&&(t=i[1]?this._getInitialValueForProperty(e):"apply-shim-inherit"),t}_cssTextToMap(e){let t,i,n=e.split(";"),s={};for(let e,o,a=0;a<n.length;a++)(e=n[a])&&(o=e.split(":")).length>1&&(t=o[0].trim(),i=this._replaceInitialOrInherit(t,o.slice(1).join(":")),s[t]=i);return s}_invalidateMixinEntry(e){if(invalidCallback)for(let t in e.dependants)t!==this._currentElement&&invalidCallback(t)}_produceCssProperties(e,t,i,n){if(i&&processVariableAndFallback(i,(e,t)=>{t&&this._map.get(t)&&(n=`@apply ${t};`)}),!n)return e;let s=this._consumeCssProperties(""+n),o=e.slice(0,e.indexOf("--")),a=this._cssTextToMap(s),r=a,l=this._map.get(t),h=l&&l.properties;h?r=Object.assign(Object.create(h),a):this._map.set(t,r);let c,d,p=[],u=!1;for(c in r)void 0===(d=a[c])&&(d="initial"),!h||c in h||(u=!0),p.push(`${t}${MIXIN_VAR_SEP}${c}: ${d}`);return u&&this._invalidateMixinEntry(l),l&&(l.properties=r),i&&(o=`${e};${o}`),`${o}${p.join("; ")};`}}ApplyShim.prototype.detectMixin=ApplyShim.prototype.detectMixin,ApplyShim.prototype.transformStyle=ApplyShim.prototype.transformStyle,ApplyShim.prototype.transformCustomStyle=ApplyShim.prototype.transformCustomStyle,ApplyShim.prototype.transformRules=ApplyShim.prototype.transformRules,ApplyShim.prototype.transformRule=ApplyShim.prototype.transformRule,ApplyShim.prototype.transformTemplate=ApplyShim.prototype.transformTemplate,ApplyShim.prototype._separator=MIXIN_VAR_SEP,Object.defineProperty(ApplyShim.prototype,"invalidCallback",{get:()=>invalidCallback,set(e){invalidCallback=e}});const templateMap={},CURRENT_VERSION="_applyShimCurrentVersion",NEXT_VERSION="_applyShimNextVersion",VALIDATING_VERSION="_applyShimValidatingVersion",promise=Promise.resolve();function invalidate(e){let t=templateMap[e];t&&invalidateTemplate(t)}function invalidateTemplate(e){e[CURRENT_VERSION]=e[CURRENT_VERSION]||0,e[VALIDATING_VERSION]=e[VALIDATING_VERSION]||0,e[NEXT_VERSION]=(e[NEXT_VERSION]||0)+1}function templateIsValid(e){return e[CURRENT_VERSION]===e[NEXT_VERSION]}function templateIsValidating(e){return!templateIsValid(e)&&e[VALIDATING_VERSION]===e[NEXT_VERSION]}function startValidatingTemplate(e){e[VALIDATING_VERSION]=e[NEXT_VERSION],e._validating||(e._validating=!0,promise.then(function(){e[CURRENT_VERSION]=e[NEXT_VERSION],e._validating=!1}))}let resolveFn,readyPromise=null,whenReady=window.HTMLImports&&window.HTMLImports.whenReady||null;function documentWait(e){requestAnimationFrame(function(){whenReady?whenReady(e):(readyPromise||(readyPromise=new Promise(e=>{resolveFn=e}),"complete"===document.readyState?resolveFn():document.addEventListener("readystatechange",()=>{"complete"===document.readyState&&resolveFn()})),readyPromise.then(function(){e&&e()}))})}const SEEN_MARKER="__seenByShadyCSS",CACHED_STYLE="__shadyCSSCachedStyle";let transformFn=null,validateFn=null;class CustomStyleInterface{constructor(){this.customStyles=[],this.enqueued=!1,documentWait(()=>{window.ShadyCSS.flushCustomStyles&&window.ShadyCSS.flushCustomStyles()})}enqueueDocumentValidation(){!this.enqueued&&validateFn&&(this.enqueued=!0,documentWait(validateFn))}addCustomStyle(e){e[SEEN_MARKER]||(e[SEEN_MARKER]=!0,this.customStyles.push(e),this.enqueueDocumentValidation())}getStyleForCustomStyle(e){if(e[CACHED_STYLE])return e[CACHED_STYLE];let t;return t=e.getStyle?e.getStyle():e}processStyles(){const e=this.customStyles;for(let t=0;t<e.length;t++){const i=e[t];if(i[CACHED_STYLE])continue;const n=this.getStyleForCustomStyle(i);if(n){const e=n.__appliedElement||n;transformFn&&transformFn(e),i[CACHED_STYLE]=e}}return e}}CustomStyleInterface.prototype.addCustomStyle=CustomStyleInterface.prototype.addCustomStyle,CustomStyleInterface.prototype.getStyleForCustomStyle=CustomStyleInterface.prototype.getStyleForCustomStyle,CustomStyleInterface.prototype.processStyles=CustomStyleInterface.prototype.processStyles,Object.defineProperties(CustomStyleInterface.prototype,{transformCallback:{get:()=>transformFn,set(e){transformFn=e}},validateCallback:{get:()=>validateFn,set(e){let t=!1;validateFn||(t=!0),validateFn=e,t&&this.enqueueDocumentValidation()}}});const applyShim=new ApplyShim;class ApplyShimInterface{constructor(){this.customStyleInterface=null,applyShim.invalidCallback=invalidate}ensure(){this.customStyleInterface||(this.customStyleInterface=window.ShadyCSS.CustomStyleInterface,this.customStyleInterface&&(this.customStyleInterface.transformCallback=(e=>{applyShim.transformCustomStyle(e)}),this.customStyleInterface.validateCallback=(()=>{requestAnimationFrame(()=>{this.customStyleInterface.enqueued&&this.flushCustomStyles()})})))}prepareTemplate(e,t){if(this.ensure(),elementHasBuiltCss(e))return;templateMap[t]=e;let i=applyShim.transformTemplate(e,t);e._styleAst=i}flushCustomStyles(){if(this.ensure(),!this.customStyleInterface)return;let e=this.customStyleInterface.processStyles();if(this.customStyleInterface.enqueued){for(let t=0;t<e.length;t++){let i=e[t],n=this.customStyleInterface.getStyleForCustomStyle(i);n&&applyShim.transformCustomStyle(n)}this.customStyleInterface.enqueued=!1}}styleSubtree(e,t){if(this.ensure(),t&&updateNativeProperties(e,t),e.shadowRoot){this.styleElement(e);let t=e.shadowRoot.children||e.shadowRoot.childNodes;for(let e=0;e<t.length;e++)this.styleSubtree(t[e])}else{let t=e.children||e.childNodes;for(let e=0;e<t.length;e++)this.styleSubtree(t[e])}}styleElement(e){this.ensure();let{is:t}=getIsExtends(e),i=templateMap[t];if((!i||!elementHasBuiltCss(i))&&i&&!templateIsValid(i)){templateIsValidating(i)||(this.prepareTemplate(i,t),startValidatingTemplate(i));let n=e.shadowRoot;if(n){let e=n.querySelector("style");e&&(e.__cssRules=i._styleAst,e.textContent=toCssText(i._styleAst))}}}styleDocument(e){this.ensure(),this.styleSubtree(document.body,e)}}if(!window.ShadyCSS||!window.ShadyCSS.ScopingShim){const e=new ApplyShimInterface;let t=window.ShadyCSS&&window.ShadyCSS.CustomStyleInterface;window.ShadyCSS={prepareTemplate(t,i,n){e.flushCustomStyles(),e.prepareTemplate(t,i)},prepareTemplateStyles(e,t,i){this.prepareTemplate(e,t,i)},prepareTemplateDom(e,t){},styleSubtree(t,i){e.flushCustomStyles(),e.styleSubtree(t,i)},styleElement(t){e.flushCustomStyles(),e.styleElement(t)},styleDocument(t){e.flushCustomStyles(),e.styleDocument(t)},getComputedStyleValue:(e,t)=>getComputedStyleValue(e,t),flushCustomStyles(){e.flushCustomStyles()},nativeCss:nativeCssVariables,nativeShadow:nativeShadow},t&&(window.ShadyCSS.CustomStyleInterface=t)}window.ShadyCSS.ApplyShim=applyShim;const Debouncer=class e{constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(e,t){this._asyncModule=e,this._callback=t,this._timer=this._asyncModule.run(()=>{this._timer=null,this._callback()})}cancel(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}static debounce(t,i,n){return t instanceof e?t.cancel():t=new e,t.setConfig(i,n),t}};let HAS_NATIVE_TA="string"==typeof document.head.style.touchAction,GESTURE_KEY="__polymerGestures",HANDLED_OBJ="__polymerGesturesHandled",TOUCH_ACTION="__polymerGesturesTouchAction",TAP_DISTANCE=25,TRACK_DISTANCE=5,TRACK_LENGTH=2,MOUSE_TIMEOUT=2500,MOUSE_EVENTS=["mousedown","mousemove","mouseup","click"],MOUSE_WHICH_TO_BUTTONS=[0,1,4,2],MOUSE_HAS_BUTTONS=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(e){return!1}}();function isMouseEvent(e){return MOUSE_EVENTS.indexOf(e)>-1}let SUPPORTS_PASSIVE=!1;function PASSIVE_TOUCH(e){if(!isMouseEvent(e)&&"touchend"!==e)return HAS_NATIVE_TA&&SUPPORTS_PASSIVE&&passiveTouchGestures?{passive:!0}:void 0}!function(){try{let e=Object.defineProperty({},"passive",{get(){SUPPORTS_PASSIVE=!0}});window.addEventListener("test",null,e),window.removeEventListener("test",null,e)}catch(e){}}();let IS_TOUCH_ONLY=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);const clickedLabels=[],labellable={button:!0,input:!0,keygen:!0,meter:!0,output:!0,textarea:!0,progress:!0,select:!0},canBeDisabled={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function canBeLabelled(e){return labellable[e.localName]||!1}function matchingLabels(e){let t=Array.prototype.slice.call(e.labels||[]);if(!t.length){t=[];let i=e.getRootNode();if(e.id){let n=i.querySelectorAll(`label[for = ${e.id}]`);for(let e=0;e<n.length;e++)t.push(n[e])}}return t}let mouseCanceller=function(e){let t=e.sourceCapabilities;if((!t||t.firesTouchEvents)&&(e[HANDLED_OBJ]={skip:!0},"click"===e.type)){let t=!1,i=e.composedPath&&e.composedPath();if(i)for(let e=0;e<i.length;e++){if(i[e].nodeType===Node.ELEMENT_NODE)if("label"===i[e].localName)clickedLabels.push(i[e]);else if(canBeLabelled(i[e])){let n=matchingLabels(i[e]);for(let e=0;e<n.length;e++)t=t||clickedLabels.indexOf(n[e])>-1}if(i[e]===POINTERSTATE.mouse.target)return}if(t)return;e.preventDefault(),e.stopPropagation()}};function setupTeardownMouseCanceller(e){let t=IS_TOUCH_ONLY?["click"]:MOUSE_EVENTS;for(let i,n=0;n<t.length;n++)i=t[n],e?(clickedLabels.length=0,document.addEventListener(i,mouseCanceller,!0)):document.removeEventListener(i,mouseCanceller,!0)}function ignoreMouse(e){POINTERSTATE.mouse.mouseIgnoreJob||setupTeardownMouseCanceller(!0);POINTERSTATE.mouse.target=e.composedPath()[0],POINTERSTATE.mouse.mouseIgnoreJob=Debouncer.debounce(POINTERSTATE.mouse.mouseIgnoreJob,timeOut.after(MOUSE_TIMEOUT),function(){setupTeardownMouseCanceller(),POINTERSTATE.mouse.target=null,POINTERSTATE.mouse.mouseIgnoreJob=null})}function hasLeftMouseButton(e){let t=e.type;if(!isMouseEvent(t))return!1;if("mousemove"===t){let t=void 0===e.buttons?1:e.buttons;return e instanceof window.MouseEvent&&!MOUSE_HAS_BUTTONS&&(t=MOUSE_WHICH_TO_BUTTONS[e.which]||0),Boolean(1&t)}return 0===(void 0===e.button?0:e.button)}function isSyntheticClick(e){if("click"===e.type){if(0===e.detail)return!0;let t=_findOriginalTarget(e);if(!t.nodeType||t.nodeType!==Node.ELEMENT_NODE)return!0;let i=t.getBoundingClientRect(),n=e.pageX,s=e.pageY;return!(n>=i.left&&n<=i.right&&s>=i.top&&s<=i.bottom)}return!1}let POINTERSTATE={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function firstTouchAction(e){let t="auto",i=e.composedPath&&e.composedPath();if(i)for(let e,n=0;n<i.length;n++)if((e=i[n])[TOUCH_ACTION]){t=e[TOUCH_ACTION];break}return t}function trackDocument(e,t,i){e.movefn=t,e.upfn=i,document.addEventListener("mousemove",t),document.addEventListener("mouseup",i)}function untrackDocument(e){document.removeEventListener("mousemove",e.movefn),document.removeEventListener("mouseup",e.upfn),e.movefn=null,e.upfn=null}document.addEventListener("touchend",ignoreMouse,!!SUPPORTS_PASSIVE&&{passive:!0});const gestures={},recognizers=[];function deepTargetFind(e,t){let i=document.elementFromPoint(e,t),n=i;for(;n&&n.shadowRoot&&!window.ShadyDOM;){if(n===(n=n.shadowRoot.elementFromPoint(e,t)))break;n&&(i=n)}return i}function _findOriginalTarget(e){if(e.composedPath){const t=e.composedPath();return t.length>0?t[0]:e.target}return e.target}function _handleNative(e){let t,i=e.type,n=e.currentTarget[GESTURE_KEY];if(!n)return;let s=n[i];if(s){if(!e[HANDLED_OBJ]&&(e[HANDLED_OBJ]={},"touch"===i.slice(0,5))){let t=(e=e).changedTouches[0];if("touchstart"===i&&1===e.touches.length&&(POINTERSTATE.touch.id=t.identifier),POINTERSTATE.touch.id!==t.identifier)return;HAS_NATIVE_TA||"touchstart"!==i&&"touchmove"!==i||_handleTouchAction(e)}if(!(t=e[HANDLED_OBJ]).skip){for(let i,n=0;n<recognizers.length;n++)s[(i=recognizers[n]).name]&&!t[i.name]&&i.flow&&i.flow.start.indexOf(e.type)>-1&&i.reset&&i.reset();for(let n,o=0;o<recognizers.length;o++)s[(n=recognizers[o]).name]&&!t[n.name]&&(t[n.name]=!0,n[i](e))}}}function _handleTouchAction(e){let t=e.changedTouches[0],i=e.type;if("touchstart"===i)POINTERSTATE.touch.x=t.clientX,POINTERSTATE.touch.y=t.clientY,POINTERSTATE.touch.scrollDecided=!1;else if("touchmove"===i){if(POINTERSTATE.touch.scrollDecided)return;POINTERSTATE.touch.scrollDecided=!0;let i=firstTouchAction(e),n=!1,s=Math.abs(POINTERSTATE.touch.x-t.clientX),o=Math.abs(POINTERSTATE.touch.y-t.clientY);e.cancelable&&("none"===i?n=!0:"pan-x"===i?n=o>s:"pan-y"===i&&(n=s>o)),n?e.preventDefault():prevent("track")}}function addListener(e,t,i){return!!gestures[t]&&(_add(e,t,i),!0)}function removeListener(e,t,i){return!!gestures[t]&&(_remove(e,t,i),!0)}function _add(e,t,i){let n=gestures[t],s=n.deps,o=n.name,a=e[GESTURE_KEY];a||(e[GESTURE_KEY]=a={});for(let t,i,n=0;n<s.length;n++)t=s[n],IS_TOUCH_ONLY&&isMouseEvent(t)&&"click"!==t||((i=a[t])||(a[t]=i={_count:0}),0===i._count&&e.addEventListener(t,_handleNative,PASSIVE_TOUCH(t)),i[o]=(i[o]||0)+1,i._count=(i._count||0)+1);e.addEventListener(t,i),n.touchAction&&setTouchAction(e,n.touchAction)}function _remove(e,t,i){let n=gestures[t],s=n.deps,o=n.name,a=e[GESTURE_KEY];if(a)for(let t,i,n=0;n<s.length;n++)(i=a[t=s[n]])&&i[o]&&(i[o]=(i[o]||1)-1,i._count=(i._count||1)-1,0===i._count&&e.removeEventListener(t,_handleNative,PASSIVE_TOUCH(t)));e.removeEventListener(t,i)}function register$1(e){recognizers.push(e);for(let t=0;t<e.emits.length;t++)gestures[e.emits[t]]=e}function _findRecognizerByEvent(e){for(let t,i=0;i<recognizers.length;i++){t=recognizers[i];for(let i,n=0;n<t.emits.length;n++)if((i=t.emits[n])===e)return t}return null}function setTouchAction(e,t){HAS_NATIVE_TA&&microTask.run(()=>{e.style.touchAction=t}),e[TOUCH_ACTION]=t}function _fire(e,t,i){let n=new Event(t,{bubbles:!0,cancelable:!0,composed:!0});if(n.detail=i,e.dispatchEvent(n),n.defaultPrevented){let e=i.preventer||i.sourceEvent;e&&e.preventDefault&&e.preventDefault()}}function prevent(e){let t=_findRecognizerByEvent(e);t.info&&(t.info.prevent=!0)}function resetMouseCanceller(){POINTERSTATE.mouse.mouseIgnoreJob&&POINTERSTATE.mouse.mouseIgnoreJob.flush()}function downupFire(e,t,i,n){t&&_fire(t,e,{x:i.clientX,y:i.clientY,sourceEvent:i,preventer:n,prevent:function(e){return prevent(e)}})}function trackHasMovedEnough(e,t,i){if(e.prevent)return!1;if(e.started)return!0;let n=Math.abs(e.x-t),s=Math.abs(e.y-i);return n>=TRACK_DISTANCE||s>=TRACK_DISTANCE}function trackFire(e,t,i){if(!t)return;let n,s=e.moves[e.moves.length-2],o=e.moves[e.moves.length-1],a=o.x-e.x,r=o.y-e.y,l=0;s&&(n=o.x-s.x,l=o.y-s.y),_fire(t,"track",{state:e.state,x:i.clientX,y:i.clientY,dx:a,dy:r,ddx:n,ddy:l,sourceEvent:i,hover:function(){return deepTargetFind(i.clientX,i.clientY)}})}function trackForward(e,t,i){let n=Math.abs(t.clientX-e.x),s=Math.abs(t.clientY-e.y),o=_findOriginalTarget(i||t);!o||canBeDisabled[o.localName]&&o.hasAttribute("disabled")||(isNaN(n)||isNaN(s)||n<=TAP_DISTANCE&&s<=TAP_DISTANCE||isSyntheticClick(t))&&(e.prevent||_fire(o,"tap",{x:t.clientX,y:t.clientY,sourceEvent:t,preventer:i}))}register$1({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset:function(){untrackDocument(this.info)},mousedown:function(e){if(!hasLeftMouseButton(e))return;let t=_findOriginalTarget(e),i=this;trackDocument(this.info,function(e){hasLeftMouseButton(e)||(downupFire("up",t,e),untrackDocument(i.info))},function(e){hasLeftMouseButton(e)&&downupFire("up",t,e),untrackDocument(i.info)}),downupFire("down",t,e)},touchstart:function(e){downupFire("down",_findOriginalTarget(e),e.changedTouches[0],e)},touchend:function(e){downupFire("up",_findOriginalTarget(e),e.changedTouches[0],e)}}),register$1({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove:function(e){this.moves.length>TRACK_LENGTH&&this.moves.shift(),this.moves.push(e)},movefn:null,upfn:null,prevent:!1},reset:function(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,untrackDocument(this.info)},mousedown:function(e){if(!hasLeftMouseButton(e))return;let t=_findOriginalTarget(e),i=this,n=function(e){let n=e.clientX,s=e.clientY;trackHasMovedEnough(i.info,n,s)&&(i.info.state=i.info.started?"mouseup"===e.type?"end":"track":"start","start"===i.info.state&&prevent("tap"),i.info.addMove({x:n,y:s}),hasLeftMouseButton(e)||(i.info.state="end",untrackDocument(i.info)),t&&trackFire(i.info,t,e),i.info.started=!0)};trackDocument(this.info,n,function(e){i.info.started&&n(e),untrackDocument(i.info)}),this.info.x=e.clientX,this.info.y=e.clientY},touchstart:function(e){let t=e.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchmove:function(e){let t=_findOriginalTarget(e),i=e.changedTouches[0],n=i.clientX,s=i.clientY;trackHasMovedEnough(this.info,n,s)&&("start"===this.info.state&&prevent("tap"),this.info.addMove({x:n,y:s}),trackFire(this.info,t,i),this.info.state="track",this.info.started=!0)},touchend:function(e){let t=_findOriginalTarget(e),i=e.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:i.clientX,y:i.clientY}),trackFire(this.info,t,i))}}),register$1({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset:function(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown:function(e){hasLeftMouseButton(e)&&(this.info.x=e.clientX,this.info.y=e.clientY)},click:function(e){hasLeftMouseButton(e)&&trackForward(this.info,e)},touchstart:function(e){const t=e.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchend:function(e){trackForward(this.info,e.changedTouches[0],e)}});const findOriginalTarget=_findOriginalTarget,add=addListener,remove=removeListener;var gestures$0=Object.freeze({gestures:gestures,recognizers:recognizers,deepTargetFind:deepTargetFind,addListener:addListener,removeListener:removeListener,register:register$1,setTouchAction:setTouchAction,prevent:prevent,resetMouseCanceller:resetMouseCanceller,findOriginalTarget:findOriginalTarget,add:add,remove:remove});const gestures$1=gestures$0,GestureEventListeners=dedupingMixin(e=>{return class extends e{_addEventListenerToNode(e,t,i){gestures$1.addListener(e,t,i)||super._addEventListenerToNode(e,t,i)}_removeEventListenerFromNode(e,t,i){gestures$1.removeListener(e,t,i)||super._removeEventListenerFromNode(e,t,i)}}}),HOST_DIR=/:host\(:dir\((ltr|rtl)\)\)/g,HOST_DIR_REPLACMENT=':host([dir="$1"])',EL_DIR=/([\s\w-#\.\[\]\*]*):dir\((ltr|rtl)\)/g,EL_DIR_REPLACMENT=':host([dir="$2"]) $1',DIR_INSTANCES=[];let observer=null,DOCUMENT_DIR="";function getRTL(){DOCUMENT_DIR=document.documentElement.getAttribute("dir")}function setRTL(e){if(!e.__autoDirOptOut){e.setAttribute("dir",DOCUMENT_DIR)}}function updateDirection(){getRTL(),DOCUMENT_DIR=document.documentElement.getAttribute("dir");for(let e=0;e<DIR_INSTANCES.length;e++)setRTL(DIR_INSTANCES[e])}function takeRecords(){observer&&observer.takeRecords().length&&updateDirection()}const DirMixin=dedupingMixin(e=>{observer||(getRTL(),(observer=new MutationObserver(updateDirection)).observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]}));const t=PropertyAccessors(e);class i extends t{static _processStyleText(e,t){return e=super._processStyleText(e,t),e=this._replaceDirInCssText(e)}static _replaceDirInCssText(e){let t=e;return e!==(t=(t=t.replace(HOST_DIR,HOST_DIR_REPLACMENT)).replace(EL_DIR,EL_DIR_REPLACMENT))&&(this.__activateDir=!0),t}constructor(){super(),this.__autoDirOptOut=!1}ready(){super.ready(),this.__autoDirOptOut=this.hasAttribute("dir")}connectedCallback(){t.prototype.connectedCallback&&super.connectedCallback(),this.constructor.__activateDir&&(takeRecords(),DIR_INSTANCES.push(this),setRTL(this))}disconnectedCallback(){if(t.prototype.disconnectedCallback&&super.disconnectedCallback(),this.constructor.__activateDir){const e=DIR_INSTANCES.indexOf(this);e>-1&&DIR_INSTANCES.splice(e,1)}}}return i.__activateDir=!1,i});function resolve(){document.body.removeAttribute("unresolved")}function newSplice(e,t,i){return{index:e,removed:t,addedCount:i}}"interactive"===document.readyState||"complete"===document.readyState?resolve():window.addEventListener("DOMContentLoaded",resolve);const EDIT_LEAVE=0,EDIT_UPDATE=1,EDIT_ADD=2,EDIT_DELETE=3;function calcEditDistances(e,t,i,n,s,o){let a=o-s+1,r=i-t+1,l=new Array(a);for(let e=0;e<a;e++)l[e]=new Array(r),l[e][0]=e;for(let e=0;e<r;e++)l[0][e]=e;for(let i=1;i<a;i++)for(let o=1;o<r;o++)if(equals(e[t+o-1],n[s+i-1]))l[i][o]=l[i-1][o-1];else{let e=l[i-1][o]+1,t=l[i][o-1]+1;l[i][o]=e<t?e:t}return l}function spliceOperationsFromEditDistances(e){let t=e.length-1,i=e[0].length-1,n=e[t][i],s=[];for(;t>0||i>0;){if(0==t){s.push(EDIT_ADD),i--;continue}if(0==i){s.push(EDIT_DELETE),t--;continue}let o,a=e[t-1][i-1],r=e[t-1][i],l=e[t][i-1];(o=r<l?r<a?r:a:l<a?l:a)==a?(a==n?s.push(EDIT_LEAVE):(s.push(EDIT_UPDATE),n=a),t--,i--):o==r?(s.push(EDIT_DELETE),t--,n=r):(s.push(EDIT_ADD),i--,n=l)}return s.reverse(),s}function calcSplices(e,t,i,n,s,o){let a,r=0,l=0,h=Math.min(i-t,o-s);if(0==t&&0==s&&(r=sharedPrefix(e,n,h)),i==e.length&&o==n.length&&(l=sharedSuffix(e,n,h-r)),s+=r,o-=l,(i-=l)-(t+=r)==0&&o-s==0)return[];if(t==i){for(a=newSplice(t,[],0);s<o;)a.removed.push(n[s++]);return[a]}if(s==o)return[newSplice(t,[],i-t)];let c=spliceOperationsFromEditDistances(calcEditDistances(e,t,i,n,s,o));a=void 0;let d=[],p=t,u=s;for(let e=0;e<c.length;e++)switch(c[e]){case EDIT_LEAVE:a&&(d.push(a),a=void 0),p++,u++;break;case EDIT_UPDATE:a||(a=newSplice(p,[],0)),a.addedCount++,p++,a.removed.push(n[u]),u++;break;case EDIT_ADD:a||(a=newSplice(p,[],0)),a.addedCount++,p++;break;case EDIT_DELETE:a||(a=newSplice(p,[],0)),a.removed.push(n[u]),u++}return a&&d.push(a),d}function sharedPrefix(e,t,i){for(let n=0;n<i;n++)if(!equals(e[n],t[n]))return n;return i}function sharedSuffix(e,t,i){let n=e.length,s=t.length,o=0;for(;o<i&&equals(e[--n],t[--s]);)o++;return o}function calculateSplices(e,t){return calcSplices(e,0,e.length,t,0,t.length)}function equals(e,t){return e===t}function isSlot(e){return"slot"===e.localName}class FlattenedNodesObserver{static getFlattenedNodes(e){return isSlot(e)?(e=e).assignedNodes({flatten:!0}):Array.from(e.childNodes).map(e=>isSlot(e)?(e=e).assignedNodes({flatten:!0}):[e]).reduce((e,t)=>e.concat(t),[])}constructor(e,t){this._shadyChildrenObserver=null,this._nativeChildrenObserver=null,this._connected=!1,this._target=e,this.callback=t,this._effectiveNodes=[],this._observer=null,this._scheduled=!1,this._boundSchedule=(()=>{this._schedule()}),this.connect(),this._schedule()}connect(){isSlot(this._target)?this._listenSlots([this._target]):this._target.children&&(this._listenSlots(this._target.children),window.ShadyDOM?this._shadyChildrenObserver=ShadyDOM.observeChildren(this._target,e=>{this._processMutations(e)}):(this._nativeChildrenObserver=new MutationObserver(e=>{this._processMutations(e)}),this._nativeChildrenObserver.observe(this._target,{childList:!0}))),this._connected=!0}disconnect(){isSlot(this._target)?this._unlistenSlots([this._target]):this._target.children&&(this._unlistenSlots(this._target.children),window.ShadyDOM&&this._shadyChildrenObserver?(ShadyDOM.unobserveChildren(this._shadyChildrenObserver),this._shadyChildrenObserver=null):this._nativeChildrenObserver&&(this._nativeChildrenObserver.disconnect(),this._nativeChildrenObserver=null)),this._connected=!1}_schedule(){this._scheduled||(this._scheduled=!0,microTask.run(()=>this.flush()))}_processMutations(e){this._processSlotMutations(e),this.flush()}_processSlotMutations(e){if(e)for(let t=0;t<e.length;t++){let i=e[t];i.addedNodes&&this._listenSlots(i.addedNodes),i.removedNodes&&this._unlistenSlots(i.removedNodes)}}flush(){if(!this._connected)return!1;window.ShadyDOM&&ShadyDOM.flush(),this._nativeChildrenObserver?this._processSlotMutations(this._nativeChildrenObserver.takeRecords()):this._shadyChildrenObserver&&this._processSlotMutations(this._shadyChildrenObserver.takeRecords()),this._scheduled=!1;let e={target:this._target,addedNodes:[],removedNodes:[]},t=this.constructor.getFlattenedNodes(this._target),i=calculateSplices(t,this._effectiveNodes);for(let t,n=0;n<i.length&&(t=i[n]);n++)for(let i,n=0;n<t.removed.length&&(i=t.removed[n]);n++)e.removedNodes.push(i);for(let n,s=0;s<i.length&&(n=i[s]);s++)for(let i=n.index;i<n.index+n.addedCount;i++)e.addedNodes.push(t[i]);this._effectiveNodes=t;let n=!1;return(e.addedNodes.length||e.removedNodes.length)&&(n=!0,this.callback.call(this._target,e)),n}_listenSlots(e){for(let t=0;t<e.length;t++){let i=e[t];isSlot(i)&&i.addEventListener("slotchange",this._boundSchedule)}}_unlistenSlots(e){for(let t=0;t<e.length;t++){let i=e[t];isSlot(i)&&i.removeEventListener("slotchange",this._boundSchedule)}}}let debouncerQueue=[];const enqueueDebouncer=function(e){debouncerQueue.push(e)};function flushDebouncers(){const e=Boolean(debouncerQueue.length);for(;debouncerQueue.length;)try{debouncerQueue.shift().flush()}catch(e){setTimeout(()=>{throw e})}return e}const flush$1=function(){let e,t;do{e=window.ShadyDOM&&ShadyDOM.flush(),window.ShadyCSS&&window.ShadyCSS.ScopingShim&&window.ShadyCSS.ScopingShim.flush(),t=flushDebouncers()}while(e||t)},p=Element.prototype,normalizedMatchesSelector=p.matches||p.matchesSelector||p.mozMatchesSelector||p.msMatchesSelector||p.oMatchesSelector||p.webkitMatchesSelector,matchesSelector=function(e,t){return normalizedMatchesSelector.call(e,t)};class DomApi{constructor(e){this.node=e}observeNodes(e){return new FlattenedNodesObserver(this.node,e)}unobserveNodes(e){e.disconnect()}notifyObserver(){}deepContains(e){if(this.node.contains(e))return!0;let t=e,i=e.ownerDocument;for(;t&&t!==i&&t!==this.node;)t=t.parentNode||t.host;return t===this.node}getOwnerRoot(){return this.node.getRootNode()}getDistributedNodes(){return"slot"===this.node.localName?this.node.assignedNodes({flatten:!0}):[]}getDestinationInsertionPoints(){let e=[],t=this.node.assignedSlot;for(;t;)e.push(t),t=t.assignedSlot;return e}importNode(e,t){return(this.node instanceof Document?this.node:this.node.ownerDocument).importNode(e,t)}getEffectiveChildNodes(){return FlattenedNodesObserver.getFlattenedNodes(this.node)}queryDistributedElements(e){let t=this.getEffectiveChildNodes(),i=[];for(let n,s=0,o=t.length;s<o&&(n=t[s]);s++)n.nodeType===Node.ELEMENT_NODE&&matchesSelector(n,e)&&i.push(n);return i}get activeElement(){let e=this.node;return void 0!==e._activeElement?e._activeElement:e.activeElement}}function forwardMethods(e,t){for(let i=0;i<t.length;i++){let n=t[i];e[n]=function(){return this.node[n].apply(this.node,arguments)}}}function forwardReadOnlyProperties(e,t){for(let i=0;i<t.length;i++){let n=t[i];Object.defineProperty(e,n,{get:function(){return this.node[n]},configurable:!0})}}function forwardProperties(e,t){for(let i=0;i<t.length;i++){let n=t[i];Object.defineProperty(e,n,{get:function(){return this.node[n]},set:function(e){this.node[n]=e},configurable:!0})}}class EventApi{constructor(e){this.event=e}get rootTarget(){return this.event.composedPath()[0]}get localTarget(){return this.event.target}get path(){return this.event.composedPath()}}DomApi.prototype.cloneNode,DomApi.prototype.appendChild,DomApi.prototype.insertBefore,DomApi.prototype.removeChild,DomApi.prototype.replaceChild,DomApi.prototype.setAttribute,DomApi.prototype.removeAttribute,DomApi.prototype.querySelector,DomApi.prototype.querySelectorAll,DomApi.prototype.parentNode,DomApi.prototype.firstChild,DomApi.prototype.lastChild,DomApi.prototype.nextSibling,DomApi.prototype.previousSibling,DomApi.prototype.firstElementChild,DomApi.prototype.lastElementChild,DomApi.prototype.nextElementSibling,DomApi.prototype.previousElementSibling,DomApi.prototype.childNodes,DomApi.prototype.children,DomApi.prototype.classList,DomApi.prototype.textContent,DomApi.prototype.innerHTML,forwardMethods(DomApi.prototype,["cloneNode","appendChild","insertBefore","removeChild","replaceChild","setAttribute","removeAttribute","querySelector","querySelectorAll"]),forwardReadOnlyProperties(DomApi.prototype,["parentNode","firstChild","lastChild","nextSibling","previousSibling","firstElementChild","lastElementChild","nextElementSibling","previousElementSibling","childNodes","children","classList"]),forwardProperties(DomApi.prototype,["textContent","innerHTML"]);const dom=function(e){if(!(e=e||document).__domApi){let t;t=e instanceof Event?new EventApi(e):new DomApi(e),e.__domApi=t}return e.__domApi};let styleInterface=window.ShadyCSS;const LegacyElementMixin=dedupingMixin(e=>{const t=DirMixin(GestureEventListeners(ElementMixin(e))),i={x:"pan-x",y:"pan-y",none:"none",all:"auto"};class n extends t{constructor(){super(),this.isAttached,this.__boundListeners,this._debouncers,this._applyListeners()}static get importMeta(){return this.prototype.importMeta}created(){}connectedCallback(){super.connectedCallback(),this.isAttached=!0,this.attached()}attached(){}disconnectedCallback(){super.disconnectedCallback(),this.isAttached=!1,this.detached()}detached(){}attributeChangedCallback(e,t,i,n){t!==i&&(super.attributeChangedCallback(e,t,i,n),this.attributeChanged(e,t,i))}attributeChanged(e,t,i){}_initializeProperties(){let e=Object.getPrototypeOf(this);e.hasOwnProperty("__hasRegisterFinished")||(e.__hasRegisterFinished=!0,this._registered()),super._initializeProperties(),this.root=this,this.created()}_registered(){}ready(){this._ensureAttributes(),super.ready()}_ensureAttributes(){}_applyListeners(){}serialize(e){return this._serializeValue(e)}deserialize(e,t){return this._deserializeValue(e,t)}reflectPropertyToAttribute(e,t,i){this._propertyToAttribute(e,t,i)}serializeValueToAttribute(e,t,i){this._valueToNodeAttribute(i||this,e,t)}extend(e,t){if(!e||!t)return e||t;let i=Object.getOwnPropertyNames(t);for(let n,s=0;s<i.length&&(n=i[s]);s++){let i=Object.getOwnPropertyDescriptor(t,n);i&&Object.defineProperty(e,n,i)}return e}mixin(e,t){for(let i in t)e[i]=t[i];return e}chainObject(e,t){return e&&t&&e!==t&&(e.__proto__=t),e}instanceTemplate(e){let t=this.constructor._contentForTemplate(e);return document.importNode(t,!0)}fire(e,t,i){i=i||{},t=null==t?{}:t;let n=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return n.detail=t,(i.node||this).dispatchEvent(n),n}listen(e,t,i){e=e||this;let n=this.__boundListeners||(this.__boundListeners=new WeakMap),s=n.get(e);s||(s={},n.set(e,s));let o=t+i;s[o]||(s[o]=this._addMethodEventListenerToNode(e,t,i,this))}unlisten(e,t,i){e=e||this;let n=this.__boundListeners&&this.__boundListeners.get(e),s=t+i,o=n&&n[s];o&&(this._removeEventListenerFromNode(e,t,o),n[s]=null)}setScrollDirection(e,t){setTouchAction(t||this,i[e]||"auto")}$$(e){return this.root.querySelector(e)}get domHost(){let e=this.getRootNode();return e instanceof DocumentFragment?e.host:e}distributeContent(){window.ShadyDOM&&this.shadowRoot&&ShadyDOM.flush()}getEffectiveChildNodes(){return dom(this).getEffectiveChildNodes()}queryDistributedElements(e){return dom(this).queryDistributedElements(e)}getEffectiveChildren(){return this.getEffectiveChildNodes().filter(function(e){return e.nodeType===Node.ELEMENT_NODE})}getEffectiveTextContent(){let e=this.getEffectiveChildNodes(),t=[];for(let i,n=0;i=e[n];n++)i.nodeType!==Node.COMMENT_NODE&&t.push(i.textContent);return t.join("")}queryEffectiveChildren(e){let t=this.queryDistributedElements(e);return t&&t[0]}queryAllEffectiveChildren(e){return this.queryDistributedElements(e)}getContentChildNodes(e){let t=this.root.querySelector(e||"slot");return t?dom(t).getDistributedNodes():[]}getContentChildren(e){return this.getContentChildNodes(e).filter(function(e){return e.nodeType===Node.ELEMENT_NODE})}isLightDescendant(e){return this!==e&&this.contains(e)&&this.getRootNode()===e.getRootNode()}isLocalDescendant(e){return this.root===e.getRootNode()}scopeSubtree(e,t){}getComputedStyleValue(e){return styleInterface.getComputedStyleValue(this,e)}debounce(e,t,i){return this._debouncers=this._debouncers||{},this._debouncers[e]=Debouncer.debounce(this._debouncers[e],i>0?timeOut.after(i):microTask,t.bind(this))}isDebouncerActive(e){this._debouncers=this._debouncers||{};let t=this._debouncers[e];return!(!t||!t.isActive())}flushDebouncer(e){this._debouncers=this._debouncers||{};let t=this._debouncers[e];t&&t.flush()}cancelDebouncer(e){this._debouncers=this._debouncers||{};let t=this._debouncers[e];t&&t.cancel()}async(e,t){return t>0?timeOut.run(e.bind(this),t):~microTask.run(e.bind(this))}cancelAsync(e){e<0?microTask.cancel(~e):timeOut.cancel(e)}create(e,t){let i=document.createElement(e);if(t)if(i.setProperties)i.setProperties(t);else for(let e in t)i[e]=t[e];return i}elementMatches(e,t){return matchesSelector(t||this,e)}toggleAttribute(e,t,i){i=i||this,1==arguments.length&&(t=!i.hasAttribute(e)),t?i.setAttribute(e,""):i.removeAttribute(e)}toggleClass(e,t,i){i=i||this,1==arguments.length&&(t=!i.classList.contains(e)),t?i.classList.add(e):i.classList.remove(e)}transform(e,t){(t=t||this).style.webkitTransform=e,t.style.transform=e}translate3d(e,t,i,n){n=n||this,this.transform("translate3d("+e+","+t+","+i+")",n)}arrayDelete(e,t){let i;if(Array.isArray(e)){if((i=e.indexOf(t))>=0)return e.splice(i,1)}else{if((i=get(this,e).indexOf(t))>=0)return this.splice(e,i,1)}return null}_logger(e,t){switch(Array.isArray(t)&&1===t.length&&Array.isArray(t[0])&&(t=t[0]),e){case"log":case"warn":case"error":console[e](...t)}}_log(...e){this._logger("log",e)}_warn(...e){this._logger("warn",e)}_error(...e){this._logger("error",e)}_logf(e,...t){return["[%s::%s]",this.is,e,...t]}}return n.prototype.is="",n});let metaProps={attached:!0,detached:!0,ready:!0,created:!0,beforeRegister:!0,registered:!0,attributeChanged:!0,behaviors:!0};function mixinBehaviors(e,t){if(!e)return t=t;t=LegacyElementMixin(t),Array.isArray(e)||(e=[e]);let i=t.prototype.behaviors;return t=_mixinBehaviors(e=flattenBehaviors(e,null,i),t),i&&(e=i.concat(e)),t.prototype.behaviors=e,t}function _mixinBehaviors(e,t){for(let i=0;i<e.length;i++){let n=e[i];n&&(t=Array.isArray(n)?_mixinBehaviors(n,t):GenerateClassFromInfo(n,t))}return t}function flattenBehaviors(e,t,i){t=t||[];for(let n=e.length-1;n>=0;n--){let s=e[n];s?Array.isArray(s)?flattenBehaviors(s,t):t.indexOf(s)<0&&(!i||i.indexOf(s)<0)&&t.unshift(s):console.warn("behavior is null, check for missing or 404 import")}return t}function GenerateClassFromInfo(e,t){class i extends t{static get properties(){return e.properties}static get observers(){return e.observers}static get template(){return e._template||DomModule&&DomModule.import(this.is,"template")||t.template||this.prototype._template||null}created(){super.created(),e.created&&e.created.call(this)}_registered(){super._registered(),e.beforeRegister&&e.beforeRegister.call(Object.getPrototypeOf(this)),e.registered&&e.registered.call(Object.getPrototypeOf(this))}_applyListeners(){if(super._applyListeners(),e.listeners)for(let t in e.listeners)this._addMethodEventListenerToNode(this,t,e.listeners[t])}_ensureAttributes(){if(e.hostAttributes)for(let t in e.hostAttributes)this._ensureAttribute(t,e.hostAttributes[t]);super._ensureAttributes()}ready(){super.ready(),e.ready&&e.ready.call(this)}attached(){super.attached(),e.attached&&e.attached.call(this)}detached(){super.detached(),e.detached&&e.detached.call(this)}attributeChanged(t,i,n){super.attributeChanged(t,i,n),e.attributeChanged&&e.attributeChanged.call(this,t,i,n)}}i.generatedFrom=e;for(let t in e)if(!(t in metaProps)){let n=Object.getOwnPropertyDescriptor(e,t);n&&Object.defineProperty(i.prototype,t,n)}return i}const Class=function(e){e||console.warn("Polymer's Class function requires `info` argument");let t=GenerateClassFromInfo(e,e.behaviors?mixinBehaviors(e.behaviors,HTMLElement):LegacyElementMixin(HTMLElement));return t.is=e.is,t},Polymer$1=function(e){let t;return t="function"==typeof e?e:Polymer$1.Class(e),customElements.define(t.is,t),t};function mutablePropertyChange(e,t,i,n,s){let o;s&&(o="object"==typeof i&&null!==i)&&(n=e.__dataTemp[t]);let a=n!==i&&(n==n||i==i);return o&&a&&(e.__dataTemp[t]=i),a}Polymer$1.Class=Class;const MutableData=dedupingMixin(e=>{return class extends e{_shouldPropertyChange(e,t,i){return mutablePropertyChange(this,e,t,i,!0)}}}),OptionalMutableData=dedupingMixin(e=>{return class extends e{static get properties(){return{mutableData:Boolean}}_shouldPropertyChange(e,t,i){return mutablePropertyChange(this,e,t,i,this.mutableData)}}});MutableData._mutablePropertyChange=mutablePropertyChange;let newInstance=null;function HTMLTemplateElementExtension(){return newInstance}HTMLTemplateElementExtension.prototype=Object.create(HTMLTemplateElement.prototype,{constructor:{value:HTMLTemplateElementExtension,writable:!0}});const DataTemplate=PropertyEffects(HTMLTemplateElementExtension),MutableDataTemplate=MutableData(DataTemplate);function upgradeTemplate(e,t){newInstance=e,Object.setPrototypeOf(e,t.prototype),new t,newInstance=null}const base=PropertyEffects(class{});class TemplateInstanceBase extends base{constructor(e){super(),this._configureProperties(e),this.root=this._stampTemplate(this.__dataHost);let t=this.children=[];for(let e=this.root.firstChild;e;e=e.nextSibling)t.push(e),e.__templatizeInstance=this;this.__templatizeOwner&&this.__templatizeOwner.__hideTemplateChildren__&&this._showHideChildren(!0);let i=this.__templatizeOptions;(e&&i.instanceProps||!i.instanceProps)&&this._enableProperties()}_configureProperties(e){if(this.__templatizeOptions.forwardHostProp)for(let e in this.__hostProps)this._setPendingProperty(e,this.__dataHost["_host_"+e]);for(let t in e)this._setPendingProperty(t,e[t])}forwardHostProp(e,t){this._setPendingPropertyOrPath(e,t,!1,!0)&&this.__dataHost._enqueueClient(this)}_addEventListenerToNode(e,t,i){if(this._methodHost&&this.__templatizeOptions.parentModel)this._methodHost._addEventListenerToNode(e,t,e=>{e.model=this,i(e)});else{let n=this.__dataHost.__dataHost;n&&n._addEventListenerToNode(e,t,i)}}_showHideChildren(e){let t=this.children;for(let i=0;i<t.length;i++){let n=t[i];if(Boolean(e)!=Boolean(n.__hideTemplateChildren__))if(n.nodeType===Node.TEXT_NODE)e?(n.__polymerTextContent__=n.textContent,n.textContent=""):n.textContent=n.__polymerTextContent__;else if("slot"===n.localName)if(e)n.__polymerReplaced__=document.createComment("hidden-slot"),n.parentNode.replaceChild(n.__polymerReplaced__,n);else{const e=n.__polymerReplaced__;e&&e.parentNode.replaceChild(n,e)}else n.style&&(e?(n.__polymerDisplay__=n.style.display,n.style.display="none"):n.style.display=n.__polymerDisplay__);n.__hideTemplateChildren__=e,n._showHideChildren&&n._showHideChildren(e)}}_setUnmanagedPropertyToNode(e,t,i){e.__hideTemplateChildren__&&e.nodeType==Node.TEXT_NODE&&"textContent"==t?e.__polymerTextContent__=i:super._setUnmanagedPropertyToNode(e,t,i)}get parentModel(){let e=this.__parentModel;if(!e){let t;e=this;do{e=e.__dataHost.__dataHost}while((t=e.__templatizeOptions)&&!t.parentModel);this.__parentModel=e}return e}dispatchEvent(e){return!0}}TemplateInstanceBase.prototype.__dataHost,TemplateInstanceBase.prototype.__templatizeOptions,TemplateInstanceBase.prototype._methodHost,TemplateInstanceBase.prototype.__templatizeOwner,TemplateInstanceBase.prototype.__hostProps;const MutableTemplateInstanceBase=MutableData(TemplateInstanceBase);function findMethodHost(e){let t=e.__dataHost;return t&&t._methodHost||t}function createTemplatizerClass(e,t,i){let n=i.mutableData?MutableTemplateInstanceBase:TemplateInstanceBase,s=class extends n{};return s.prototype.__templatizeOptions=i,s.prototype._bindTemplate(e),addNotifyEffects(s,e,t,i),s}function addPropagateEffects(e,t,i){let n=i.forwardHostProp;if(n){let s=t.templatizeTemplateClass;if(!s){let e=i.mutableData?MutableDataTemplate:DataTemplate;s=t.templatizeTemplateClass=class extends e{};let o=t.hostProps;for(let e in o)s.prototype._addPropertyEffect("_host_"+e,s.prototype.PROPERTY_EFFECT_TYPES.PROPAGATE,{fn:createForwardHostPropEffect(e,n)}),s.prototype._createNotifyingProperty("_host_"+e)}upgradeTemplate(e,s),e.__dataProto&&Object.assign(e.__data,e.__dataProto),e.__dataTemp={},e.__dataPending=null,e.__dataOld=null,e._enableProperties()}}function createForwardHostPropEffect(e,t){return function(e,i,n){t.call(e.__templatizeOwner,i.substring("_host_".length),n[i])}}function addNotifyEffects(e,t,i,n){let s=i.hostProps||{};for(let t in n.instanceProps){delete s[t];let i=n.notifyInstanceProp;i&&e.prototype._addPropertyEffect(t,e.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,{fn:createNotifyInstancePropEffect(t,i)})}if(n.forwardHostProp&&t.__dataHost)for(let t in s)e.prototype._addPropertyEffect(t,e.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,{fn:createNotifyHostPropEffect()})}function createNotifyInstancePropEffect(e,t){return function(e,i,n){t.call(e.__templatizeOwner,e,i,n[i])}}function createNotifyHostPropEffect(){return function(e,t,i){e.__dataHost._setPendingPropertyOrPath("_host_"+t,i[t],!0,!0)}}function templatize(e,t,i){if(i=i||{},e.__templatizeOwner)throw new Error("A <template> can only be templatized once");e.__templatizeOwner=t;let n=(t?t.constructor:TemplateInstanceBase)._parseTemplate(e),s=n.templatizeInstanceClass;s||(s=createTemplatizerClass(e,n,i),n.templatizeInstanceClass=s),addPropagateEffects(e,n,i);let o=class extends s{};return o.prototype._methodHost=findMethodHost(e),o.prototype.__dataHost=e,o.prototype.__templatizeOwner=t,o.prototype.__hostProps=n.hostProps,o=o}function modelForElement(e,t){let i;for(;t;)if(i=t.__templatizeInstance){if(i.__dataHost==e)return i;t=i.__dataHost}else t=t.parentNode;return null}const Templatizer={templatize(e,t){this._templatizerTemplate=e,this.ctor=templatize(e,this,{mutableData:Boolean(t),parentModel:this._parentModel,instanceProps:this._instanceProps,forwardHostProp:this._forwardHostPropV2,notifyInstanceProp:this._notifyInstancePropV2})},stamp(e){return new this.ctor(e)},modelForElement(e){return modelForElement(this._templatizerTemplate,e)}},domBindBase=GestureEventListeners(OptionalMutableData(PropertyEffects(HTMLElement)));class DomBind extends domBindBase{static get observedAttributes(){return["mutable-data"]}constructor(){super(),this.root=null,this.$=null,this.__children=null}attributeChangedCallback(){this.mutableData=!0}connectedCallback(){this.style.display="none",this.render()}disconnectedCallback(){this.__removeChildren()}__insertChildren(){this.parentNode.insertBefore(this.root,this)}__removeChildren(){if(this.__children)for(let e=0;e<this.__children.length;e++)this.root.appendChild(this.__children[e])}render(){let e;if(!this.__children){if(!(e=e||this.querySelector("template"))){let t=new MutationObserver(()=>{if(!(e=this.querySelector("template")))throw new Error("dom-bind requires a <template> child");t.disconnect(),this.render()});return void t.observe(this,{childList:!0})}this.root=this._stampTemplate(e),this.$=this.root.$,this.__children=[];for(let e=this.root.firstChild;e;e=e.nextSibling)this.__children[this.__children.length]=e;this._enableProperties()}this.__insertChildren(),this.dispatchEvent(new CustomEvent("dom-change",{bubbles:!0,composed:!0}))}}customElements.define("dom-bind",DomBind);const domRepeatBase=OptionalMutableData(PolymerElement);class DomRepeat extends domRepeatBase{static get is(){return"dom-repeat"}static get template(){return null}static get properties(){return{items:{type:Array},as:{type:String,value:"item"},indexAs:{type:String,value:"index"},itemsIndexAs:{type:String,value:"itemsIndex"},sort:{type:Function,observer:"__sortChanged"},filter:{type:Function,observer:"__filterChanged"},observe:{type:String,observer:"__observeChanged"},delay:Number,renderedItemCount:{type:Number,notify:!0,readOnly:!0},initialCount:{type:Number,observer:"__initializeChunking"},targetFramerate:{type:Number,value:20},_targetFrameTime:{type:Number,computed:"__computeFrameTime(targetFramerate)"}}}static get observers(){return["__itemsChanged(items.*)"]}constructor(){super(),this.__instances=[],this.__limit=1/0,this.__pool=[],this.__renderDebouncer=null,this.__itemsIdxToInstIdx={},this.__chunkCount=null,this.__lastChunkTime=null,this.__sortFn=null,this.__filterFn=null,this.__observePaths=null,this.__ctor=null,this.__isDetached=!0,this.template=null}disconnectedCallback(){super.disconnectedCallback(),this.__isDetached=!0;for(let e=0;e<this.__instances.length;e++)this.__detachInstance(e)}connectedCallback(){if(super.connectedCallback(),this.style.display="none",this.__isDetached){this.__isDetached=!1;let e=this.parentNode;for(let t=0;t<this.__instances.length;t++)this.__attachInstance(t,e)}}__ensureTemplatized(){if(!this.__ctor){let e=this.template=this.querySelector("template");if(!e){let e=new MutationObserver(()=>{if(!this.querySelector("template"))throw new Error("dom-repeat requires a <template> child");e.disconnect(),this.__render()});return e.observe(this,{childList:!0}),!1}let t={};t[this.as]=!0,t[this.indexAs]=!0,t[this.itemsIndexAs]=!0,this.__ctor=templatize(e,this,{mutableData:this.mutableData,parentModel:!0,instanceProps:t,forwardHostProp:function(e,t){let i=this.__instances;for(let n,s=0;s<i.length&&(n=i[s]);s++)n.forwardHostProp(e,t)},notifyInstanceProp:function(e,t,i){if(matches(this.as,t)){let n=e[this.itemsIndexAs];t==this.as&&(this.items[n]=i);let s=translate(this.as,"items."+n,t);this.notifyPath(s,i)}}})}return!0}__getMethodHost(){return this.__dataHost._methodHost||this.__dataHost}__functionFromPropertyValue(e){if("string"==typeof e){let t=e,i=this.__getMethodHost();return function(){return i[t].apply(i,arguments)}}return e}__sortChanged(e){this.__sortFn=this.__functionFromPropertyValue(e),this.items&&this.__debounceRender(this.__render)}__filterChanged(e){this.__filterFn=this.__functionFromPropertyValue(e),this.items&&this.__debounceRender(this.__render)}__computeFrameTime(e){return Math.ceil(1e3/e)}__initializeChunking(){this.initialCount&&(this.__limit=this.initialCount,this.__chunkCount=this.initialCount,this.__lastChunkTime=performance.now())}__tryRenderChunk(){this.items&&this.__limit<this.items.length&&this.__debounceRender(this.__requestRenderChunk)}__requestRenderChunk(){requestAnimationFrame(()=>this.__renderChunk())}__renderChunk(){let e=performance.now(),t=this._targetFrameTime/(e-this.__lastChunkTime);this.__chunkCount=Math.round(this.__chunkCount*t)||1,this.__limit+=this.__chunkCount,this.__lastChunkTime=e,this.__debounceRender(this.__render)}__observeChanged(){this.__observePaths=this.observe&&this.observe.replace(".*",".").split(" ")}__itemsChanged(e){this.items&&!Array.isArray(this.items)&&console.warn("dom-repeat expected array for `items`, found",this.items),this.__handleItemPath(e.path,e.value)||(this.__initializeChunking(),this.__debounceRender(this.__render))}__handleObservedPaths(e){if(this.__sortFn||this.__filterFn)if(e){if(this.__observePaths){let t=this.__observePaths;for(let i=0;i<t.length;i++)0===e.indexOf(t[i])&&this.__debounceRender(this.__render,this.delay)}}else this.__debounceRender(this.__render,this.delay)}__debounceRender(e,t=0){this.__renderDebouncer=Debouncer.debounce(this.__renderDebouncer,t>0?timeOut.after(t):microTask,e.bind(this)),enqueueDebouncer(this.__renderDebouncer)}render(){this.__debounceRender(this.__render),flush$1()}__render(){this.__ensureTemplatized()&&(this.__applyFullRefresh(),this.__pool.length=0,this._setRenderedItemCount(this.__instances.length),this.dispatchEvent(new CustomEvent("dom-change",{bubbles:!0,composed:!0})),this.__tryRenderChunk())}__applyFullRefresh(){let e=this.items||[],t=new Array(e.length);for(let i=0;i<e.length;i++)t[i]=i;this.__filterFn&&(t=t.filter((t,i,n)=>this.__filterFn(e[t],i,n))),this.__sortFn&&t.sort((t,i)=>this.__sortFn(e[t],e[i]));const i=this.__itemsIdxToInstIdx={};let n=0;const s=Math.min(t.length,this.__limit);for(;n<s;n++){let s=this.__instances[n],o=t[n],a=e[o];i[o]=n,s?(s._setPendingProperty(this.as,a),s._setPendingProperty(this.indexAs,n),s._setPendingProperty(this.itemsIndexAs,o),s._flushProperties()):this.__insertInstance(a,n,o)}for(let e=this.__instances.length-1;e>=n;e--)this.__detachAndRemoveInstance(e)}__detachInstance(e){let t=this.__instances[e];for(let e=0;e<t.children.length;e++){let i=t.children[e];t.root.appendChild(i)}return t}__attachInstance(e,t){let i=this.__instances[e];t.insertBefore(i.root,this)}__detachAndRemoveInstance(e){let t=this.__detachInstance(e);t&&this.__pool.push(t),this.__instances.splice(e,1)}__stampInstance(e,t,i){let n={};return n[this.as]=e,n[this.indexAs]=t,n[this.itemsIndexAs]=i,new this.__ctor(n)}__insertInstance(e,t,i){let n=this.__pool.pop();n?(n._setPendingProperty(this.as,e),n._setPendingProperty(this.indexAs,t),n._setPendingProperty(this.itemsIndexAs,i),n._flushProperties()):n=this.__stampInstance(e,t,i);let s=this.__instances[t+1],o=s?s.children[0]:this;return this.parentNode.insertBefore(n.root,o),this.__instances[t]=n,n}_showHideChildren(e){for(let t=0;t<this.__instances.length;t++)this.__instances[t]._showHideChildren(e)}__handleItemPath(e,t){let i=e.slice(6),n=i.indexOf("."),s=n<0?i:i.substring(0,n);if(s==parseInt(s,10)){let e=n<0?"":i.substring(n+1);this.__handleObservedPaths(e);let o=this.__itemsIdxToInstIdx[s],a=this.__instances[o];if(a){let i=this.as+(e?"."+e:"");a._setPendingPropertyOrPath(i,t,!1,!0),a._flushProperties()}return!0}}itemForElement(e){let t=this.modelForElement(e);return t&&t[this.as]}indexForElement(e){let t=this.modelForElement(e);return t&&t[this.indexAs]}modelForElement(e){return modelForElement(this.template,e)}}customElements.define(DomRepeat.is,DomRepeat);class DomIf extends PolymerElement{static get is(){return"dom-if"}static get template(){return null}static get properties(){return{if:{type:Boolean,observer:"__debounceRender"},restamp:{type:Boolean,observer:"__debounceRender"}}}constructor(){super(),this.__renderDebouncer=null,this.__invalidProps=null,this.__instance=null,this._lastIf=!1,this.__ctor=null}__debounceRender(){this.__renderDebouncer=Debouncer.debounce(this.__renderDebouncer,microTask,()=>this.__render()),enqueueDebouncer(this.__renderDebouncer)}disconnectedCallback(){super.disconnectedCallback(),this.parentNode&&(this.parentNode.nodeType!=Node.DOCUMENT_FRAGMENT_NODE||this.parentNode.host)||this.__teardownInstance()}connectedCallback(){super.connectedCallback(),this.style.display="none",this.if&&this.__debounceRender()}render(){flush$1()}__render(){if(this.if){if(!this.__ensureInstance())return;this._showHideChildren()}else this.restamp&&this.__teardownInstance();!this.restamp&&this.__instance&&this._showHideChildren(),this.if!=this._lastIf&&(this.dispatchEvent(new CustomEvent("dom-change",{bubbles:!0,composed:!0})),this._lastIf=this.if)}__ensureInstance(){let e=this.parentNode;if(e){if(!this.__ctor){let e=this.querySelector("template");if(!e){let e=new MutationObserver(()=>{if(!this.querySelector("template"))throw new Error("dom-if requires a <template> child");e.disconnect(),this.__render()});return e.observe(this,{childList:!0}),!1}this.__ctor=templatize(e,this,{mutableData:!0,forwardHostProp:function(e,t){this.__instance&&(this.if?this.__instance.forwardHostProp(e,t):(this.__invalidProps=this.__invalidProps||Object.create(null),this.__invalidProps[root(e)]=!0))}})}if(this.__instance){this.__syncHostProperties();let t=this.__instance.children;if(t&&t.length){if(this.previousSibling!==t[t.length-1])for(let i,n=0;n<t.length&&(i=t[n]);n++)e.insertBefore(i,this)}}else this.__instance=new this.__ctor,e.insertBefore(this.__instance.root,this)}return!0}__syncHostProperties(){let e=this.__invalidProps;if(e){for(let t in e)this.__instance._setPendingProperty(t,this.__dataHost[t]);this.__invalidProps=null,this.__instance._flushProperties()}}__teardownInstance(){if(this.__instance){let e=this.__instance.children;if(e&&e.length){let t=e[0].parentNode;for(let i,n=0;n<e.length&&(i=e[n]);n++)t.removeChild(i)}this.__instance=null,this.__invalidProps=null}}_showHideChildren(){let e=this.__hideTemplateChildren__||!this.if;this.__instance&&this.__instance._showHideChildren(e)}}customElements.define(DomIf.is,DomIf);let ArraySelectorMixin=dedupingMixin(e=>{let t=ElementMixin(e);return class extends t{static get properties(){return{items:{type:Array},multi:{type:Boolean,value:!1},selected:{type:Object,notify:!0},selectedItem:{type:Object,notify:!0},toggle:{type:Boolean,value:!1}}}static get observers(){return["__updateSelection(multi, items.*)"]}constructor(){super(),this.__lastItems=null,this.__lastMulti=null,this.__selectedMap=null}__updateSelection(e,t){let i=t.path;if("items"==i){let i=t.base||[],n=this.__lastItems;if(e!==this.__lastMulti&&this.clearSelection(),n){let e=calculateSplices(i,n);this.__applySplices(e)}this.__lastItems=i,this.__lastMulti=e}else if("items.splices"==t.path)this.__applySplices(t.value.indexSplices);else{let e=i.slice("items.".length),t=parseInt(e,10);e.indexOf(".")<0&&e==t&&this.__deselectChangedIdx(t)}}__applySplices(e){let t=this.__selectedMap;for(let i=0;i<e.length;i++){let n=e[i];t.forEach((e,i)=>{e<n.index||(e>=n.index+n.removed.length?t.set(i,e+n.addedCount-n.removed.length):t.set(i,-1))});for(let e=0;e<n.addedCount;e++){let i=n.index+e;t.has(this.items[i])&&t.set(this.items[i],i)}}this.__updateLinks();let i=0;t.forEach((e,n)=>{e<0?(this.multi?this.splice("selected",i,1):this.selected=this.selectedItem=null,t.delete(n)):i++})}__updateLinks(){if(this.__dataLinkedPaths={},this.multi){let e=0;this.__selectedMap.forEach(t=>{t>=0&&this.linkPaths("items."+t,"selected."+e++)})}else this.__selectedMap.forEach(e=>{this.linkPaths("selected","items."+e),this.linkPaths("selectedItem","items."+e)})}clearSelection(){this.__dataLinkedPaths={},this.__selectedMap=new Map,this.selected=this.multi?[]:null,this.selectedItem=null}isSelected(e){return this.__selectedMap.has(e)}isIndexSelected(e){return this.isSelected(this.items[e])}__deselectChangedIdx(e){let t=this.__selectedIndexForItemIndex(e);if(t>=0){let e=0;this.__selectedMap.forEach((i,n)=>{t==e++&&this.deselect(n)})}}__selectedIndexForItemIndex(e){let t=this.__dataLinkedPaths["items."+e];if(t)return parseInt(t.slice("selected.".length),10)}deselect(e){let t=this.__selectedMap.get(e);if(t>=0){let i;this.__selectedMap.delete(e),this.multi&&(i=this.__selectedIndexForItemIndex(t)),this.__updateLinks(),this.multi?this.splice("selected",i,1):this.selected=this.selectedItem=null}}deselectIndex(e){this.deselect(this.items[e])}select(e){this.selectIndex(this.items.indexOf(e))}selectIndex(e){let t=this.items[e];this.isSelected(t)?this.toggle&&this.deselectIndex(e):(this.multi||this.__selectedMap.clear(),this.__selectedMap.set(t,e),this.__updateLinks(),this.multi?this.push("selected",t):this.selected=this.selectedItem=t)}}}),baseArraySelector=ArraySelectorMixin(PolymerElement);class ArraySelector extends baseArraySelector{static get is(){return"array-selector"}}customElements.define(ArraySelector.is,ArraySelector);const customStyleInterface=new CustomStyleInterface;window.ShadyCSS||(window.ShadyCSS={prepareTemplate(e,t,i){},prepareTemplateDom(e,t){},prepareTemplateStyles(e,t,i){},styleSubtree(e,t){customStyleInterface.processStyles(),updateNativeProperties(e,t)},styleElement(e){customStyleInterface.processStyles()},styleDocument(e){customStyleInterface.processStyles(),updateNativeProperties(document.body,e)},getComputedStyleValue:(e,t)=>getComputedStyleValue(e,t),flushCustomStyles(){},nativeCss:nativeCssVariables,nativeShadow:nativeShadow}),window.ShadyCSS.CustomStyleInterface=customStyleInterface;const attr="include",CustomStyleInterface$1=window.ShadyCSS.CustomStyleInterface;class CustomStyle extends HTMLElement{constructor(){super(),this._style=null,CustomStyleInterface$1.addCustomStyle(this)}getStyle(){if(this._style)return this._style;const e=this.querySelector("style");if(!e)return null;this._style=e;const t=e.getAttribute(attr);return t&&(e.removeAttribute(attr),e.textContent=cssFromModules(t)+e.textContent),this.ownerDocument!==window.document&&window.document.head.appendChild(this),this._style}}let mutablePropertyChange$1;window.customElements.define("custom-style",CustomStyle),mutablePropertyChange$1=MutableData._mutablePropertyChange;const OptionalMutableDataBehavior={properties:{mutableData:Boolean},_shouldPropertyChange(e,t,i){return mutablePropertyChange$1(this,e,t,i,this.mutableData)}},Base=LegacyElementMixin(HTMLElement).prototype,template=html`
<custom-style>
  <style is="custom-style">
    html {

      /* Material Design color palette for Google products */

      --google-red-100: #f4c7c3;
      --google-red-300: #e67c73;
      --google-red-500: #db4437;
      --google-red-700: #c53929;

      --google-blue-100: #c6dafc;
      --google-blue-300: #7baaf7;
      --google-blue-500: #4285f4;
      --google-blue-700: #3367d6;

      --google-green-100: #b7e1cd;
      --google-green-300: #57bb8a;
      --google-green-500: #0f9d58;
      --google-green-700: #0b8043;

      --google-yellow-100: #fce8b2;
      --google-yellow-300: #f7cb4d;
      --google-yellow-500: #f4b400;
      --google-yellow-700: #f09300;

      --google-grey-100: #f5f5f5;
      --google-grey-300: #e0e0e0;
      --google-grey-500: #9e9e9e;
      --google-grey-700: #616161;

      /* Material Design color palette from online spec document */

      --paper-red-50: #ffebee;
      --paper-red-100: #ffcdd2;
      --paper-red-200: #ef9a9a;
      --paper-red-300: #e57373;
      --paper-red-400: #ef5350;
      --paper-red-500: #f44336;
      --paper-red-600: #e53935;
      --paper-red-700: #d32f2f;
      --paper-red-800: #c62828;
      --paper-red-900: #b71c1c;
      --paper-red-a100: #ff8a80;
      --paper-red-a200: #ff5252;
      --paper-red-a400: #ff1744;
      --paper-red-a700: #d50000;

      --paper-pink-50: #fce4ec;
      --paper-pink-100: #f8bbd0;
      --paper-pink-200: #f48fb1;
      --paper-pink-300: #f06292;
      --paper-pink-400: #ec407a;
      --paper-pink-500: #e91e63;
      --paper-pink-600: #d81b60;
      --paper-pink-700: #c2185b;
      --paper-pink-800: #ad1457;
      --paper-pink-900: #880e4f;
      --paper-pink-a100: #ff80ab;
      --paper-pink-a200: #ff4081;
      --paper-pink-a400: #f50057;
      --paper-pink-a700: #c51162;

      --paper-purple-50: #f3e5f5;
      --paper-purple-100: #e1bee7;
      --paper-purple-200: #ce93d8;
      --paper-purple-300: #ba68c8;
      --paper-purple-400: #ab47bc;
      --paper-purple-500: #9c27b0;
      --paper-purple-600: #8e24aa;
      --paper-purple-700: #7b1fa2;
      --paper-purple-800: #6a1b9a;
      --paper-purple-900: #4a148c;
      --paper-purple-a100: #ea80fc;
      --paper-purple-a200: #e040fb;
      --paper-purple-a400: #d500f9;
      --paper-purple-a700: #aa00ff;

      --paper-deep-purple-50: #ede7f6;
      --paper-deep-purple-100: #d1c4e9;
      --paper-deep-purple-200: #b39ddb;
      --paper-deep-purple-300: #9575cd;
      --paper-deep-purple-400: #7e57c2;
      --paper-deep-purple-500: #673ab7;
      --paper-deep-purple-600: #5e35b1;
      --paper-deep-purple-700: #512da8;
      --paper-deep-purple-800: #4527a0;
      --paper-deep-purple-900: #311b92;
      --paper-deep-purple-a100: #b388ff;
      --paper-deep-purple-a200: #7c4dff;
      --paper-deep-purple-a400: #651fff;
      --paper-deep-purple-a700: #6200ea;

      --paper-indigo-50: #e8eaf6;
      --paper-indigo-100: #c5cae9;
      --paper-indigo-200: #9fa8da;
      --paper-indigo-300: #7986cb;
      --paper-indigo-400: #5c6bc0;
      --paper-indigo-500: #3f51b5;
      --paper-indigo-600: #3949ab;
      --paper-indigo-700: #303f9f;
      --paper-indigo-800: #283593;
      --paper-indigo-900: #1a237e;
      --paper-indigo-a100: #8c9eff;
      --paper-indigo-a200: #536dfe;
      --paper-indigo-a400: #3d5afe;
      --paper-indigo-a700: #304ffe;

      --paper-blue-50: #e3f2fd;
      --paper-blue-100: #bbdefb;
      --paper-blue-200: #90caf9;
      --paper-blue-300: #64b5f6;
      --paper-blue-400: #42a5f5;
      --paper-blue-500: #2196f3;
      --paper-blue-600: #1e88e5;
      --paper-blue-700: #1976d2;
      --paper-blue-800: #1565c0;
      --paper-blue-900: #0d47a1;
      --paper-blue-a100: #82b1ff;
      --paper-blue-a200: #448aff;
      --paper-blue-a400: #2979ff;
      --paper-blue-a700: #2962ff;

      --paper-light-blue-50: #e1f5fe;
      --paper-light-blue-100: #b3e5fc;
      --paper-light-blue-200: #81d4fa;
      --paper-light-blue-300: #4fc3f7;
      --paper-light-blue-400: #29b6f6;
      --paper-light-blue-500: #03a9f4;
      --paper-light-blue-600: #039be5;
      --paper-light-blue-700: #0288d1;
      --paper-light-blue-800: #0277bd;
      --paper-light-blue-900: #01579b;
      --paper-light-blue-a100: #80d8ff;
      --paper-light-blue-a200: #40c4ff;
      --paper-light-blue-a400: #00b0ff;
      --paper-light-blue-a700: #0091ea;

      --paper-cyan-50: #e0f7fa;
      --paper-cyan-100: #b2ebf2;
      --paper-cyan-200: #80deea;
      --paper-cyan-300: #4dd0e1;
      --paper-cyan-400: #26c6da;
      --paper-cyan-500: #00bcd4;
      --paper-cyan-600: #00acc1;
      --paper-cyan-700: #0097a7;
      --paper-cyan-800: #00838f;
      --paper-cyan-900: #006064;
      --paper-cyan-a100: #84ffff;
      --paper-cyan-a200: #18ffff;
      --paper-cyan-a400: #00e5ff;
      --paper-cyan-a700: #00b8d4;

      --paper-teal-50: #e0f2f1;
      --paper-teal-100: #b2dfdb;
      --paper-teal-200: #80cbc4;
      --paper-teal-300: #4db6ac;
      --paper-teal-400: #26a69a;
      --paper-teal-500: #009688;
      --paper-teal-600: #00897b;
      --paper-teal-700: #00796b;
      --paper-teal-800: #00695c;
      --paper-teal-900: #004d40;
      --paper-teal-a100: #a7ffeb;
      --paper-teal-a200: #64ffda;
      --paper-teal-a400: #1de9b6;
      --paper-teal-a700: #00bfa5;

      --paper-green-50: #e8f5e9;
      --paper-green-100: #c8e6c9;
      --paper-green-200: #a5d6a7;
      --paper-green-300: #81c784;
      --paper-green-400: #66bb6a;
      --paper-green-500: #4caf50;
      --paper-green-600: #43a047;
      --paper-green-700: #388e3c;
      --paper-green-800: #2e7d32;
      --paper-green-900: #1b5e20;
      --paper-green-a100: #b9f6ca;
      --paper-green-a200: #69f0ae;
      --paper-green-a400: #00e676;
      --paper-green-a700: #00c853;

      --paper-light-green-50: #f1f8e9;
      --paper-light-green-100: #dcedc8;
      --paper-light-green-200: #c5e1a5;
      --paper-light-green-300: #aed581;
      --paper-light-green-400: #9ccc65;
      --paper-light-green-500: #8bc34a;
      --paper-light-green-600: #7cb342;
      --paper-light-green-700: #689f38;
      --paper-light-green-800: #558b2f;
      --paper-light-green-900: #33691e;
      --paper-light-green-a100: #ccff90;
      --paper-light-green-a200: #b2ff59;
      --paper-light-green-a400: #76ff03;
      --paper-light-green-a700: #64dd17;

      --paper-lime-50: #f9fbe7;
      --paper-lime-100: #f0f4c3;
      --paper-lime-200: #e6ee9c;
      --paper-lime-300: #dce775;
      --paper-lime-400: #d4e157;
      --paper-lime-500: #cddc39;
      --paper-lime-600: #c0ca33;
      --paper-lime-700: #afb42b;
      --paper-lime-800: #9e9d24;
      --paper-lime-900: #827717;
      --paper-lime-a100: #f4ff81;
      --paper-lime-a200: #eeff41;
      --paper-lime-a400: #c6ff00;
      --paper-lime-a700: #aeea00;

      --paper-yellow-50: #fffde7;
      --paper-yellow-100: #fff9c4;
      --paper-yellow-200: #fff59d;
      --paper-yellow-300: #fff176;
      --paper-yellow-400: #ffee58;
      --paper-yellow-500: #ffeb3b;
      --paper-yellow-600: #fdd835;
      --paper-yellow-700: #fbc02d;
      --paper-yellow-800: #f9a825;
      --paper-yellow-900: #f57f17;
      --paper-yellow-a100: #ffff8d;
      --paper-yellow-a200: #ffff00;
      --paper-yellow-a400: #ffea00;
      --paper-yellow-a700: #ffd600;

      --paper-amber-50: #fff8e1;
      --paper-amber-100: #ffecb3;
      --paper-amber-200: #ffe082;
      --paper-amber-300: #ffd54f;
      --paper-amber-400: #ffca28;
      --paper-amber-500: #ffc107;
      --paper-amber-600: #ffb300;
      --paper-amber-700: #ffa000;
      --paper-amber-800: #ff8f00;
      --paper-amber-900: #ff6f00;
      --paper-amber-a100: #ffe57f;
      --paper-amber-a200: #ffd740;
      --paper-amber-a400: #ffc400;
      --paper-amber-a700: #ffab00;

      --paper-orange-50: #fff3e0;
      --paper-orange-100: #ffe0b2;
      --paper-orange-200: #ffcc80;
      --paper-orange-300: #ffb74d;
      --paper-orange-400: #ffa726;
      --paper-orange-500: #ff9800;
      --paper-orange-600: #fb8c00;
      --paper-orange-700: #f57c00;
      --paper-orange-800: #ef6c00;
      --paper-orange-900: #e65100;
      --paper-orange-a100: #ffd180;
      --paper-orange-a200: #ffab40;
      --paper-orange-a400: #ff9100;
      --paper-orange-a700: #ff6500;

      --paper-deep-orange-50: #fbe9e7;
      --paper-deep-orange-100: #ffccbc;
      --paper-deep-orange-200: #ffab91;
      --paper-deep-orange-300: #ff8a65;
      --paper-deep-orange-400: #ff7043;
      --paper-deep-orange-500: #ff5722;
      --paper-deep-orange-600: #f4511e;
      --paper-deep-orange-700: #e64a19;
      --paper-deep-orange-800: #d84315;
      --paper-deep-orange-900: #bf360c;
      --paper-deep-orange-a100: #ff9e80;
      --paper-deep-orange-a200: #ff6e40;
      --paper-deep-orange-a400: #ff3d00;
      --paper-deep-orange-a700: #dd2c00;

      --paper-brown-50: #efebe9;
      --paper-brown-100: #d7ccc8;
      --paper-brown-200: #bcaaa4;
      --paper-brown-300: #a1887f;
      --paper-brown-400: #8d6e63;
      --paper-brown-500: #795548;
      --paper-brown-600: #6d4c41;
      --paper-brown-700: #5d4037;
      --paper-brown-800: #4e342e;
      --paper-brown-900: #3e2723;

      --paper-grey-50: #fafafa;
      --paper-grey-100: #f5f5f5;
      --paper-grey-200: #eeeeee;
      --paper-grey-300: #e0e0e0;
      --paper-grey-400: #bdbdbd;
      --paper-grey-500: #9e9e9e;
      --paper-grey-600: #757575;
      --paper-grey-700: #616161;
      --paper-grey-800: #424242;
      --paper-grey-900: #212121;

      --paper-blue-grey-50: #eceff1;
      --paper-blue-grey-100: #cfd8dc;
      --paper-blue-grey-200: #b0bec5;
      --paper-blue-grey-300: #90a4ae;
      --paper-blue-grey-400: #78909c;
      --paper-blue-grey-500: #607d8b;
      --paper-blue-grey-600: #546e7a;
      --paper-blue-grey-700: #455a64;
      --paper-blue-grey-800: #37474f;
      --paper-blue-grey-900: #263238;

      /* opacity for dark text on a light background */
      --dark-divider-opacity: 0.12;
      --dark-disabled-opacity: 0.38; /* or hint text or icon */
      --dark-secondary-opacity: 0.54;
      --dark-primary-opacity: 0.87;

      /* opacity for light text on a dark background */
      --light-divider-opacity: 0.12;
      --light-disabled-opacity: 0.3; /* or hint text or icon */
      --light-secondary-opacity: 0.7;
      --light-primary-opacity: 1.0;

    }

  </style>
</custom-style>
`;template.setAttribute("style","display: none;"),document.head.appendChild(template.content);const $_documentContainer=document.createElement("template");$_documentContainer.setAttribute("style","display: none;"),$_documentContainer.innerHTML="<dom-module id=\"paper-spinner-styles\">\n  <template>\n    <style>\n      /*\n      /**************************/\n      /* STYLES FOR THE SPINNER */\n      /**************************/\n\n      /*\n       * Constants:\n       *      ARCSIZE     = 270 degrees (amount of circle the arc takes up)\n       *      ARCTIME     = 1333ms (time it takes to expand and contract arc)\n       *      ARCSTARTROT = 216 degrees (how much the start location of the arc\n       *                                should rotate each time, 216 gives us a\n       *                                5 pointed star shape (it's 360/5 * 3).\n       *                                For a 7 pointed star, we might do\n       *                                360/7 * 3 = 154.286)\n       *      SHRINK_TIME = 400ms\n       */\n\n      :host {\n        display: inline-block;\n        position: relative;\n        width: 28px;\n        height: 28px;\n\n        /* 360 * ARCTIME / (ARCSTARTROT + (360-ARCSIZE)) */\n        --paper-spinner-container-rotation-duration: 1568ms;\n\n        /* ARCTIME */\n        --paper-spinner-expand-contract-duration: 1333ms;\n\n        /* 4 * ARCTIME */\n        --paper-spinner-full-cycle-duration: 5332ms;\n\n        /* SHRINK_TIME */\n        --paper-spinner-cooldown-duration: 400ms;\n      }\n\n      #spinnerContainer {\n        width: 100%;\n        height: 100%;\n\n        /* The spinner does not have any contents that would have to be\n         * flipped if the direction changes. Always use ltr so that the\n         * style works out correctly in both cases. */\n        direction: ltr;\n      }\n\n      #spinnerContainer.active {\n        -webkit-animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite;\n        animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite;\n      }\n\n      @-webkit-keyframes container-rotate {\n        to { -webkit-transform: rotate(360deg) }\n      }\n\n      @keyframes container-rotate {\n        to { transform: rotate(360deg) }\n      }\n\n      .spinner-layer {\n        position: absolute;\n        width: 100%;\n        height: 100%;\n        opacity: 0;\n        white-space: nowrap;\n        color: var(--paper-spinner-color, var(--google-blue-500));\n      }\n\n      .layer-1 {\n        color: var(--paper-spinner-layer-1-color, var(--google-blue-500));\n      }\n\n      .layer-2 {\n        color: var(--paper-spinner-layer-2-color, var(--google-red-500));\n      }\n\n      .layer-3 {\n        color: var(--paper-spinner-layer-3-color, var(--google-yellow-500));\n      }\n\n      .layer-4 {\n        color: var(--paper-spinner-layer-4-color, var(--google-green-500));\n      }\n\n      /**\n       * IMPORTANT NOTE ABOUT CSS ANIMATION PROPERTIES (keanulee):\n       *\n       * iOS Safari (tested on iOS 8.1) does not handle animation-delay very well - it doesn't\n       * guarantee that the animation will start _exactly_ after that value. So we avoid using\n       * animation-delay and instead set custom keyframes for each color (as layer-2undant as it\n       * seems).\n       */\n      .active .spinner-layer {\n        -webkit-animation-name: fill-unfill-rotate;\n        -webkit-animation-duration: var(--paper-spinner-full-cycle-duration);\n        -webkit-animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);\n        -webkit-animation-iteration-count: infinite;\n        animation-name: fill-unfill-rotate;\n        animation-duration: var(--paper-spinner-full-cycle-duration);\n        animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);\n        animation-iteration-count: infinite;\n        opacity: 1;\n      }\n\n      .active .spinner-layer.layer-1 {\n        -webkit-animation-name: fill-unfill-rotate, layer-1-fade-in-out;\n        animation-name: fill-unfill-rotate, layer-1-fade-in-out;\n      }\n\n      .active .spinner-layer.layer-2 {\n        -webkit-animation-name: fill-unfill-rotate, layer-2-fade-in-out;\n        animation-name: fill-unfill-rotate, layer-2-fade-in-out;\n      }\n\n      .active .spinner-layer.layer-3 {\n        -webkit-animation-name: fill-unfill-rotate, layer-3-fade-in-out;\n        animation-name: fill-unfill-rotate, layer-3-fade-in-out;\n      }\n\n      .active .spinner-layer.layer-4 {\n        -webkit-animation-name: fill-unfill-rotate, layer-4-fade-in-out;\n        animation-name: fill-unfill-rotate, layer-4-fade-in-out;\n      }\n\n      @-webkit-keyframes fill-unfill-rotate {\n        12.5% { -webkit-transform: rotate(135deg) } /* 0.5 * ARCSIZE */\n        25%   { -webkit-transform: rotate(270deg) } /* 1   * ARCSIZE */\n        37.5% { -webkit-transform: rotate(405deg) } /* 1.5 * ARCSIZE */\n        50%   { -webkit-transform: rotate(540deg) } /* 2   * ARCSIZE */\n        62.5% { -webkit-transform: rotate(675deg) } /* 2.5 * ARCSIZE */\n        75%   { -webkit-transform: rotate(810deg) } /* 3   * ARCSIZE */\n        87.5% { -webkit-transform: rotate(945deg) } /* 3.5 * ARCSIZE */\n        to    { -webkit-transform: rotate(1080deg) } /* 4   * ARCSIZE */\n      }\n\n      @keyframes fill-unfill-rotate {\n        12.5% { transform: rotate(135deg) } /* 0.5 * ARCSIZE */\n        25%   { transform: rotate(270deg) } /* 1   * ARCSIZE */\n        37.5% { transform: rotate(405deg) } /* 1.5 * ARCSIZE */\n        50%   { transform: rotate(540deg) } /* 2   * ARCSIZE */\n        62.5% { transform: rotate(675deg) } /* 2.5 * ARCSIZE */\n        75%   { transform: rotate(810deg) } /* 3   * ARCSIZE */\n        87.5% { transform: rotate(945deg) } /* 3.5 * ARCSIZE */\n        to    { transform: rotate(1080deg) } /* 4   * ARCSIZE */\n      }\n\n      @-webkit-keyframes layer-1-fade-in-out {\n        0% { opacity: 1 }\n        25% { opacity: 1 }\n        26% { opacity: 0 }\n        89% { opacity: 0 }\n        90% { opacity: 1 }\n        to { opacity: 1 }\n      }\n\n      @keyframes layer-1-fade-in-out {\n        0% { opacity: 1 }\n        25% { opacity: 1 }\n        26% { opacity: 0 }\n        89% { opacity: 0 }\n        90% { opacity: 1 }\n        to { opacity: 1 }\n      }\n\n      @-webkit-keyframes layer-2-fade-in-out {\n        0% { opacity: 0 }\n        15% { opacity: 0 }\n        25% { opacity: 1 }\n        50% { opacity: 1 }\n        51% { opacity: 0 }\n        to { opacity: 0 }\n      }\n\n      @keyframes layer-2-fade-in-out {\n        0% { opacity: 0 }\n        15% { opacity: 0 }\n        25% { opacity: 1 }\n        50% { opacity: 1 }\n        51% { opacity: 0 }\n        to { opacity: 0 }\n      }\n\n      @-webkit-keyframes layer-3-fade-in-out {\n        0% { opacity: 0 }\n        40% { opacity: 0 }\n        50% { opacity: 1 }\n        75% { opacity: 1 }\n        76% { opacity: 0 }\n        to { opacity: 0 }\n      }\n\n      @keyframes layer-3-fade-in-out {\n        0% { opacity: 0 }\n        40% { opacity: 0 }\n        50% { opacity: 1 }\n        75% { opacity: 1 }\n        76% { opacity: 0 }\n        to { opacity: 0 }\n      }\n\n      @-webkit-keyframes layer-4-fade-in-out {\n        0% { opacity: 0 }\n        65% { opacity: 0 }\n        75% { opacity: 1 }\n        90% { opacity: 1 }\n        to { opacity: 0 }\n      }\n\n      @keyframes layer-4-fade-in-out {\n        0% { opacity: 0 }\n        65% { opacity: 0 }\n        75% { opacity: 1 }\n        90% { opacity: 1 }\n        to { opacity: 0 }\n      }\n\n      .circle-clipper {\n        display: inline-block;\n        position: relative;\n        width: 50%;\n        height: 100%;\n        overflow: hidden;\n      }\n\n      /**\n       * Patch the gap that appear between the two adjacent div.circle-clipper while the\n       * spinner is rotating (appears on Chrome 50, Safari 9.1.1, and Edge).\n       */\n      .spinner-layer::after {\n        left: 45%;\n        width: 10%;\n        border-top-style: solid;\n      }\n\n      .spinner-layer::after,\n      .circle-clipper::after {\n        content: '';\n        box-sizing: border-box;\n        position: absolute;\n        top: 0;\n        border-width: var(--paper-spinner-stroke-width, 3px);\n        border-radius: 50%;\n      }\n\n      .circle-clipper::after {\n        bottom: 0;\n        width: 200%;\n        border-style: solid;\n        border-bottom-color: transparent !important;\n      }\n\n      .circle-clipper.left::after {\n        left: 0;\n        border-right-color: transparent !important;\n        -webkit-transform: rotate(129deg);\n        transform: rotate(129deg);\n      }\n\n      .circle-clipper.right::after {\n        left: -100%;\n        border-left-color: transparent !important;\n        -webkit-transform: rotate(-129deg);\n        transform: rotate(-129deg);\n      }\n\n      .active .gap-patch::after,\n      .active .circle-clipper::after {\n        -webkit-animation-duration: var(--paper-spinner-expand-contract-duration);\n        -webkit-animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);\n        -webkit-animation-iteration-count: infinite;\n        animation-duration: var(--paper-spinner-expand-contract-duration);\n        animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);\n        animation-iteration-count: infinite;\n      }\n\n      .active .circle-clipper.left::after {\n        -webkit-animation-name: left-spin;\n        animation-name: left-spin;\n      }\n\n      .active .circle-clipper.right::after {\n        -webkit-animation-name: right-spin;\n        animation-name: right-spin;\n      }\n\n      @-webkit-keyframes left-spin {\n        0% { -webkit-transform: rotate(130deg) }\n        50% { -webkit-transform: rotate(-5deg) }\n        to { -webkit-transform: rotate(130deg) }\n      }\n\n      @keyframes left-spin {\n        0% { transform: rotate(130deg) }\n        50% { transform: rotate(-5deg) }\n        to { transform: rotate(130deg) }\n      }\n\n      @-webkit-keyframes right-spin {\n        0% { -webkit-transform: rotate(-130deg) }\n        50% { -webkit-transform: rotate(5deg) }\n        to { -webkit-transform: rotate(-130deg) }\n      }\n\n      @keyframes right-spin {\n        0% { transform: rotate(-130deg) }\n        50% { transform: rotate(5deg) }\n        to { transform: rotate(-130deg) }\n      }\n\n      #spinnerContainer.cooldown {\n        -webkit-animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite, fade-out var(--paper-spinner-cooldown-duration) cubic-bezier(0.4, 0.0, 0.2, 1);\n        animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite, fade-out var(--paper-spinner-cooldown-duration) cubic-bezier(0.4, 0.0, 0.2, 1);\n      }\n\n      @-webkit-keyframes fade-out {\n        0% { opacity: 1 }\n        to { opacity: 0 }\n      }\n\n      @keyframes fade-out {\n        0% { opacity: 1 }\n        to { opacity: 0 }\n      }\n    </style>\n  </template>\n</dom-module>",document.head.appendChild($_documentContainer.content);const PaperSpinnerBehavior={properties:{active:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"__activeChanged"},alt:{type:String,value:"loading",observer:"__altChanged"},__coolingDown:{type:Boolean,value:!1}},__computeContainerClasses:function(e,t){return[e||t?"active":"",t?"cooldown":""].join(" ")},__activeChanged:function(e,t){this.__setAriaHidden(!e),this.__coolingDown=!e&&t},__altChanged:function(e){"loading"===e?this.alt=this.getAttribute("aria-label")||e:(this.__setAriaHidden(""===e),this.setAttribute("aria-label",e))},__setAriaHidden:function(e){e?this.setAttribute("aria-hidden","true"):this.removeAttribute("aria-hidden")},__reset:function(){this.active=!1,this.__coolingDown=!1}},template$1=html`
  <style include="paper-spinner-styles"></style>

  <div id="spinnerContainer" class-name="[[__computeContainerClasses(active, __coolingDown)]]" on-animationend="__reset" on-webkit-animation-end="__reset">
    <div class="spinner-layer">
      <div class="circle-clipper left"></div>
      <div class="circle-clipper right"></div>
    </div>
  </div>
`;template$1.setAttribute("strip-whitespace",""),Polymer$1({_template:template$1,is:"paper-spinner-lite",behaviors:[PaperSpinnerBehavior]});const template$2=html`
<custom-style>
  <style is="custom-style">
    [hidden] {
      display: none !important;
    }
  </style>
</custom-style>
<custom-style>
  <style is="custom-style">
    html {

      --layout: {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
      };

      --layout-inline: {
        display: -ms-inline-flexbox;
        display: -webkit-inline-flex;
        display: inline-flex;
      };

      --layout-horizontal: {
        @apply --layout;

        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
      };

      --layout-horizontal-reverse: {
        @apply --layout;

        -ms-flex-direction: row-reverse;
        -webkit-flex-direction: row-reverse;
        flex-direction: row-reverse;
      };

      --layout-vertical: {
        @apply --layout;

        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
      };

      --layout-vertical-reverse: {
        @apply --layout;

        -ms-flex-direction: column-reverse;
        -webkit-flex-direction: column-reverse;
        flex-direction: column-reverse;
      };

      --layout-wrap: {
        -ms-flex-wrap: wrap;
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
      };

      --layout-wrap-reverse: {
        -ms-flex-wrap: wrap-reverse;
        -webkit-flex-wrap: wrap-reverse;
        flex-wrap: wrap-reverse;
      };

      --layout-flex-auto: {
        -ms-flex: 1 1 auto;
        -webkit-flex: 1 1 auto;
        flex: 1 1 auto;
      };

      --layout-flex-none: {
        -ms-flex: none;
        -webkit-flex: none;
        flex: none;
      };

      --layout-flex: {
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
        flex: 1;
        -webkit-flex-basis: 0.000000001px;
        flex-basis: 0.000000001px;
      };

      --layout-flex-2: {
        -ms-flex: 2;
        -webkit-flex: 2;
        flex: 2;
      };

      --layout-flex-3: {
        -ms-flex: 3;
        -webkit-flex: 3;
        flex: 3;
      };

      --layout-flex-4: {
        -ms-flex: 4;
        -webkit-flex: 4;
        flex: 4;
      };

      --layout-flex-5: {
        -ms-flex: 5;
        -webkit-flex: 5;
        flex: 5;
      };

      --layout-flex-6: {
        -ms-flex: 6;
        -webkit-flex: 6;
        flex: 6;
      };

      --layout-flex-7: {
        -ms-flex: 7;
        -webkit-flex: 7;
        flex: 7;
      };

      --layout-flex-8: {
        -ms-flex: 8;
        -webkit-flex: 8;
        flex: 8;
      };

      --layout-flex-9: {
        -ms-flex: 9;
        -webkit-flex: 9;
        flex: 9;
      };

      --layout-flex-10: {
        -ms-flex: 10;
        -webkit-flex: 10;
        flex: 10;
      };

      --layout-flex-11: {
        -ms-flex: 11;
        -webkit-flex: 11;
        flex: 11;
      };

      --layout-flex-12: {
        -ms-flex: 12;
        -webkit-flex: 12;
        flex: 12;
      };

      /* alignment in cross axis */

      --layout-start: {
        -ms-flex-align: start;
        -webkit-align-items: flex-start;
        align-items: flex-start;
      };

      --layout-center: {
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
      };

      --layout-end: {
        -ms-flex-align: end;
        -webkit-align-items: flex-end;
        align-items: flex-end;
      };

      --layout-baseline: {
        -ms-flex-align: baseline;
        -webkit-align-items: baseline;
        align-items: baseline;
      };

      /* alignment in main axis */

      --layout-start-justified: {
        -ms-flex-pack: start;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
      };

      --layout-center-justified: {
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
      };

      --layout-end-justified: {
        -ms-flex-pack: end;
        -webkit-justify-content: flex-end;
        justify-content: flex-end;
      };

      --layout-around-justified: {
        -ms-flex-pack: distribute;
        -webkit-justify-content: space-around;
        justify-content: space-around;
      };

      --layout-justified: {
        -ms-flex-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
      };

      --layout-center-center: {
        @apply --layout-center;
        @apply --layout-center-justified;
      };

      /* self alignment */

      --layout-self-start: {
        -ms-align-self: flex-start;
        -webkit-align-self: flex-start;
        align-self: flex-start;
      };

      --layout-self-center: {
        -ms-align-self: center;
        -webkit-align-self: center;
        align-self: center;
      };

      --layout-self-end: {
        -ms-align-self: flex-end;
        -webkit-align-self: flex-end;
        align-self: flex-end;
      };

      --layout-self-stretch: {
        -ms-align-self: stretch;
        -webkit-align-self: stretch;
        align-self: stretch;
      };

      --layout-self-baseline: {
        -ms-align-self: baseline;
        -webkit-align-self: baseline;
        align-self: baseline;
      };

      /* multi-line alignment in main axis */

      --layout-start-aligned: {
        -ms-flex-line-pack: start;  /* IE10 */
        -ms-align-content: flex-start;
        -webkit-align-content: flex-start;
        align-content: flex-start;
      };

      --layout-end-aligned: {
        -ms-flex-line-pack: end;  /* IE10 */
        -ms-align-content: flex-end;
        -webkit-align-content: flex-end;
        align-content: flex-end;
      };

      --layout-center-aligned: {
        -ms-flex-line-pack: center;  /* IE10 */
        -ms-align-content: center;
        -webkit-align-content: center;
        align-content: center;
      };

      --layout-between-aligned: {
        -ms-flex-line-pack: justify;  /* IE10 */
        -ms-align-content: space-between;
        -webkit-align-content: space-between;
        align-content: space-between;
      };

      --layout-around-aligned: {
        -ms-flex-line-pack: distribute;  /* IE10 */
        -ms-align-content: space-around;
        -webkit-align-content: space-around;
        align-content: space-around;
      };

      /*******************************
                Other Layout
      *******************************/

      --layout-block: {
        display: block;
      };

      --layout-invisible: {
        visibility: hidden !important;
      };

      --layout-relative: {
        position: relative;
      };

      --layout-fit: {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      };

      --layout-scroll: {
        -webkit-overflow-scrolling: touch;
        overflow: auto;
      };

      --layout-fullbleed: {
        margin: 0;
        height: 100vh;
      };

      /* fixed position */

      --layout-fixed-top: {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
      };

      --layout-fixed-right: {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
      };

      --layout-fixed-bottom: {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
      };

      --layout-fixed-left: {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
      };

    }
  </style>
</custom-style>`;template$2.setAttribute("style","display: none;"),document.head.appendChild(template$2.content);var style=document.createElement("style");style.textContent="[hidden] { display: none !important; }",document.head.appendChild(style);const template$3=html`
<custom-style>
  <style is="custom-style">
    html {
      /*
       * You can use these generic variables in your elements for easy theming.
       * For example, if all your elements use \`--primary-text-color\` as its main
       * color, then switching from a light to a dark theme is just a matter of
       * changing the value of \`--primary-text-color\` in your application.
       */
      --primary-text-color: var(--light-theme-text-color);
      --primary-background-color: var(--light-theme-background-color);
      --secondary-text-color: var(--light-theme-secondary-color);
      --disabled-text-color: var(--light-theme-disabled-color);
      --divider-color: var(--light-theme-divider-color);
      --error-color: var(--paper-deep-orange-a700);

      /*
       * Primary and accent colors. Also see color.js for more colors.
       */
      --primary-color: var(--paper-indigo-500);
      --light-primary-color: var(--paper-indigo-100);
      --dark-primary-color: var(--paper-indigo-700);

      --accent-color: var(--paper-pink-a200);
      --light-accent-color: var(--paper-pink-a100);
      --dark-accent-color: var(--paper-pink-a400);


      /*
       * Material Design Light background theme
       */
      --light-theme-background-color: #ffffff;
      --light-theme-base-color: #000000;
      --light-theme-text-color: var(--paper-grey-900);
      --light-theme-secondary-color: #737373;  /* for secondary text and icons */
      --light-theme-disabled-color: #9b9b9b;  /* disabled/hint text */
      --light-theme-divider-color: #dbdbdb;

      /*
       * Material Design Dark background theme
       */
      --dark-theme-background-color: var(--paper-grey-900);
      --dark-theme-base-color: #ffffff;
      --dark-theme-text-color: #ffffff;
      --dark-theme-secondary-color: #bcbcbc;  /* for secondary text and icons */
      --dark-theme-disabled-color: #646464;  /* disabled/hint text */
      --dark-theme-divider-color: #3c3c3c;

      /*
       * Deprecated values because of their confusing names.
       */
      --text-primary-color: var(--dark-theme-text-color);
      --default-primary-color: var(--primary-color);
    }
  </style>
</custom-style>`;template$3.setAttribute("style","display: none;"),document.head.appendChild(template$3.content);const template$4=html`
<custom-style>
  <style is="custom-style">
    html {

      --shadow-transition: {
        transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      };

      --shadow-none: {
        box-shadow: none;
      };

      /* from http://codepen.io/shyndman/pen/c5394ddf2e8b2a5c9185904b57421cdb */

      --shadow-elevation-2dp: {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12),
                    0 3px 1px -2px rgba(0, 0, 0, 0.2);
      };

      --shadow-elevation-3dp: {
        box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
                    0 1px 8px 0 rgba(0, 0, 0, 0.12),
                    0 3px 3px -2px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-4dp: {
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                    0 1px 10px 0 rgba(0, 0, 0, 0.12),
                    0 2px 4px -1px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-6dp: {
        box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                    0 1px 18px 0 rgba(0, 0, 0, 0.12),
                    0 3px 5px -1px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-8dp: {
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
                    0 3px 14px 2px rgba(0, 0, 0, 0.12),
                    0 5px 5px -3px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-12dp: {
        box-shadow: 0 12px 16px 1px rgba(0, 0, 0, 0.14),
                    0 4px 22px 3px rgba(0, 0, 0, 0.12),
                    0 6px 7px -4px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-16dp: {
        box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
                    0  6px 30px 5px rgba(0, 0, 0, 0.12),
                    0  8px 10px -5px rgba(0, 0, 0, 0.4);
      };

      --shadow-elevation-24dp: {
        box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                    0 9px 46px 8px rgba(0, 0, 0, 0.12),
                    0 11px 15px -7px rgba(0, 0, 0, 0.4);
      };
    }
  </style>
</custom-style>`;if(template$4.setAttribute("style","display: none;"),document.head.appendChild(template$4.content),!window.polymerSkipLoadingFontRoboto){const e=document.createElement("link");e.rel="stylesheet",e.type="text/css",e.crossOrigin="anonymous",e.href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,300,300italic,400italic,500,500italic,700,700italic",document.head.appendChild(e)}const template$5=html`<custom-style>
  <style is="custom-style">
    html {

      /* Shared Styles */
      --paper-font-common-base: {
        font-family: 'Roboto', 'Noto', sans-serif;
        -webkit-font-smoothing: antialiased;
      };

      --paper-font-common-code: {
        font-family: 'Roboto Mono', 'Consolas', 'Menlo', monospace;
        -webkit-font-smoothing: antialiased;
      };

      --paper-font-common-expensive-kerning: {
        text-rendering: optimizeLegibility;
      };

      --paper-font-common-nowrap: {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      };

      /* Material Font Styles */

      --paper-font-display4: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 112px;
        font-weight: 300;
        letter-spacing: -.044em;
        line-height: 120px;
      };

      --paper-font-display3: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 56px;
        font-weight: 400;
        letter-spacing: -.026em;
        line-height: 60px;
      };

      --paper-font-display2: {
        @apply --paper-font-common-base;

        font-size: 45px;
        font-weight: 400;
        letter-spacing: -.018em;
        line-height: 48px;
      };

      --paper-font-display1: {
        @apply --paper-font-common-base;

        font-size: 34px;
        font-weight: 400;
        letter-spacing: -.01em;
        line-height: 40px;
      };

      --paper-font-headline: {
        @apply --paper-font-common-base;

        font-size: 24px;
        font-weight: 400;
        letter-spacing: -.012em;
        line-height: 32px;
      };

      --paper-font-title: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
      };

      --paper-font-subhead: {
        @apply --paper-font-common-base;

        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
      };

      --paper-font-body2: {
        @apply --paper-font-common-base;

        font-size: 14px;
        font-weight: 500;
        line-height: 24px;
      };

      --paper-font-body1: {
        @apply --paper-font-common-base;

        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      };

      --paper-font-caption: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0.011em;
        line-height: 20px;
      };

      --paper-font-menu: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 13px;
        font-weight: 500;
        line-height: 24px;
      };

      --paper-font-button: {
        @apply --paper-font-common-base;
        @apply --paper-font-common-nowrap;

        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.018em;
        line-height: 24px;
        text-transform: uppercase;
      };

      --paper-font-code2: {
        @apply --paper-font-common-code;

        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
      };

      --paper-font-code1: {
        @apply --paper-font-common-code;

        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
      };

    }

  </style>
</custom-style>`;template$5.setAttribute("style","display: none;"),document.head.appendChild(template$5.content);var _createClass=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}();function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var FetchInterceptor=function(){function e(){var t=this;_classCallCheck(this,e),this.interceptors=[],this.fetch=function(){for(var e=arguments.length,i=Array(e),n=0;n<e;n++)i[n]=arguments[n];return t.interceptorWrapper.apply(t,[fetch].concat(i))}}return _createClass(e,[{key:"addInterceptors",value:function(e){var t=this,i=[];return Array.isArray(e)?e.map(function(e){return i.push(t.interceptors.length),t.interceptors.push(e)}):e instanceof Object&&(i.push(this.interceptors.length),this.interceptors.push(e)),this.updateInterceptors(),function(){return t.removeInterceptors(i)}}},{key:"removeInterceptors",value:function(e){var t=this;Array.isArray(e)&&(e.map(function(e){return t.interceptors.splice(e,1)}),this.updateInterceptors())}},{key:"updateInterceptors",value:function(){this.reversedInterceptors=this.interceptors.reduce(function(e,t){return[t].concat(e)},[])}},{key:"clearInterceptors",value:function(){this.interceptors=[],this.updateInterceptors()}},{key:"interceptorWrapper",value:function(e){for(var t=arguments.length,i=Array(t>1?t-1:0),n=1;n<t;n++)i[n-1]=arguments[n];var s=Promise.resolve(i);return this.reversedInterceptors.forEach(function(e){var t=e.request,n=e.requestError;(t||n)&&(s=s.then(function(){return t.apply(void 0,i)},n))}),s=s.then(function(){return e.apply(void 0,i)}),this.reversedInterceptors.forEach(function(e){var t=e.response,i=e.responseError;(t||i)&&(s=s.then(t,i))}),s}}]),e}(),FetchQL=function(e){function t(e){var i=e.url,n=e.interceptors,s=e.headers,o=e.onStart,a=e.onEnd,r=e.omitEmptyVariables,l=void 0!==r&&r,h=e.requestOptions,c=void 0===h?{}:h;_classCallCheck(this,t);var d=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return d.requestObject=Object.assign({},{method:"POST",headers:Object.assign({},{Accept:"application/json","Content-Type":"application/json"},s),credentials:"same-origin"},c),d.url=i,d.omitEmptyVariables=l,d.requestQueueLength=0,d.EnumMap={},d.callbacks={onStart:o,onEnd:a},d.addInterceptors(n),d}return _inherits(t,FetchInterceptor),_createClass(t,[{key:"query",value:function(e){var t=this,i=e.operationName,n=e.query,s=e.variables,o=e.opts,a=void 0===o?{}:o,r=e.requestOptions,l=void 0===r?{}:r,h=Object.assign({},this.requestObject,l),c={operationName:i,query:n,variables:this.omitEmptyVariables||a.omitEmptyVariables?this.doOmitEmptyVariables(s):s};return h.body=JSON.stringify(c),this.onStart(),this.fetch(this.url,h).then(function(e){return e.ok?e.json():{errors:[{message:e.statusText,stack:e}]}}).then(function(e){var i=e.data,n=e.errors;return new Promise(function(e,s){return t.onEnd(),i?Object.keys(i).every(function(e){return!i[e]})?s(n):e({data:i,errors:n}):s(n||[{}])})})}},{key:"getUrl",value:function(){return this.url}},{key:"setUrl",value:function(e){this.url=e}},{key:"getEnumTypes",value:function(e){var t=this,i={},n=e.filter(function(e){return!t.EnumMap[e]||(i[e]=t.EnumMap[e],!1)});if(!n.length)return new Promise(function(e){e({data:i})});var s="\n      query {\n        "+n.map(function(e){return e+': __type(name: "'+e+'") {\n        ...EnumFragment\n      }'}).join("\n")+"\n      }\n      \n      fragment EnumFragment on __Type {\n        kind\n        description\n        enumValues {\n          name\n          description\n        }\n      }",o=Object.assign({},this.requestObject);return o.body=JSON.stringify({query:s}),this.onStart(),this.fetch(this.url,o).then(function(e){return e.ok?e.json():{errors:[{message:e.statusText,stack:e}]}}).then(function(e){var n=e.data,s=e.errors;return new Promise(function(e,o){if(t.onEnd(),!n)return o(s||[{message:"Do not get any data."}]);if(Object.keys(n).every(function(e){return!n[e]})&&s&&s.length)return o(s);var a=Object.assign(i,n);return Object.keys(n).map(function(e){return t.EnumMap[e]=n[e],e}),e({data:a,errors:s})})})}},{key:"onStart",value:function(){this.requestQueueLength++,this.requestQueueLength>1||!this.callbacks.onStart||this.callbacks.onStart(this.requestQueueLength)}},{key:"onEnd",value:function(){this.requestQueueLength--,!this.requestQueueLength&&this.callbacks.onEnd&&this.callbacks.onEnd(this.requestQueueLength)}},{key:"doOmitEmptyVariables",value:function(e){var t=this,i={};return Object.keys(e).map(function(n){var s=e[n];return"string"==typeof s&&0===s.length||null==s?n:(s instanceof Object?i[n]=t.doOmitEmptyVariables(s):i[n]=s,n)}),i}}]),t}();const template$6=html`
<custom-style>
  <style is="custom-style">
    html {

        --futaba-red-color: #800000;
        --futaba-pink-color: #f0e0d6;   
        
        --moe-thread-cover-background-color: #fffde5;

        --moe-thread-no-text-color: #ffffff;
        --moe-thread-no-background-color: #0E71B6;
        --moe-thread-no-hover-background-color: #1086da;
        --moe-thread-reply-count-text-color: #ffffff;
        --moe-thread-reply-count-background-color: #579BCC;
        --moe-thread-reply-count-hover-background-color: #73abd4;
        
        --moe-thread-more-replies-button-background-color: #984d4d;
        --moe-thread-more-replies-button-hover-background-color: #af6060;
        --moe-thread-more-replies-button-text-color: #ffffff; 
        
        --moe-thread-firstpost-background-color: #fffde5;
        --moe-thread-reply-odd-background-color: #E7CFC0;
        --moe-thread-reply-even-background-color: #F0E0D6;
        
        --moe-post-header-no-text-color: #ffffff;
        --moe-post-header-no-background-color: #0E71B6;
        --moe-post-header-no-hover-background-color: #1086da;
        --moe-post-header-id-text-color: #909090;
        --moe-post-header-status-text-color: #909090;
        --moe-post-header-date-text-color: #909090;
        
        --moe-post-body-text-color: var(--futaba-red-color);
        --moe-post-action-button-color: #909090;
        --moe-post-quote-text-color: #789922;
        --moe-post-quote-link-color: #0E71B6;
        --moe-post-quote-link-hover-color: #1086da;
        
        --moe-poll-background-color: #fffde5;
        --moe-poll-title-color: var(--futaba-red-color);
        --moe-poll-text-color: var(--futaba-red-color);
        --moe-poll-unvoted-item-background-color: #ffe; 
    }

  </style>
</custom-style>
`;template$6.setAttribute("style","display: none;"),document.head.appendChild(template$6.content),Polymer$1({_template:html`
    <style>
      :host {
        display: inline-block;
        overflow: hidden;
        position: relative;
      }

      #baseURIAnchor {
        display: none;
      }

      #sizedImgDiv {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;

        display: none;
      }

      #img {
        display: block;
        width: var(--iron-image-width, auto);
        height: var(--iron-image-height, auto);
      }

      :host([sizing]) #sizedImgDiv {
        display: block;
      }

      :host([sizing]) #img {
        display: none;
      }

      #placeholder {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;

        background-color: inherit;
        opacity: 1;

        @apply --iron-image-placeholder;
      }

      #placeholder.faded-out {
        transition: opacity 0.5s linear;
        opacity: 0;
      }
    </style>

    <a id="baseURIAnchor" href="#"></a>
    <div id="sizedImgDiv" role="img" hidden\$="[[_computeImgDivHidden(sizing)]]" aria-hidden\$="[[_computeImgDivARIAHidden(alt)]]" aria-label\$="[[_computeImgDivARIALabel(alt, src)]]"></div>
    <img id="img" alt\$="[[alt]]" hidden\$="[[_computeImgHidden(sizing)]]" crossorigin\$="[[crossorigin]]" on-load="_imgOnLoad" on-error="_imgOnError">
    <div id="placeholder" hidden\$="[[_computePlaceholderHidden(preload, fade, loading, loaded)]]" class\$="[[_computePlaceholderClassName(preload, fade, loading, loaded)]]"></div>
`,is:"iron-image",properties:{src:{type:String,value:""},alt:{type:String,value:null},crossorigin:{type:String,value:null},preventLoad:{type:Boolean,value:!1},sizing:{type:String,value:null,reflectToAttribute:!0},position:{type:String,value:"center"},preload:{type:Boolean,value:!1},placeholder:{type:String,value:null,observer:"_placeholderChanged"},fade:{type:Boolean,value:!1},loaded:{notify:!0,readOnly:!0,type:Boolean,value:!1},loading:{notify:!0,readOnly:!0,type:Boolean,value:!1},error:{notify:!0,readOnly:!0,type:Boolean,value:!1},width:{observer:"_widthChanged",type:Number,value:null},height:{observer:"_heightChanged",type:Number,value:null}},observers:["_transformChanged(sizing, position)","_loadStateObserver(src, preventLoad)"],created:function(){this._resolvedSrc=""},_imgOnLoad:function(){this.$.img.src===this._resolveSrc(this.src)&&(this._setLoading(!1),this._setLoaded(!0),this._setError(!1))},_imgOnError:function(){this.$.img.src===this._resolveSrc(this.src)&&(this.$.img.removeAttribute("src"),this.$.sizedImgDiv.style.backgroundImage="",this._setLoading(!1),this._setLoaded(!1),this._setError(!0))},_computePlaceholderHidden:function(){return!this.preload||!this.fade&&!this.loading&&this.loaded},_computePlaceholderClassName:function(){return this.preload&&this.fade&&!this.loading&&this.loaded?"faded-out":""},_computeImgDivHidden:function(){return!this.sizing},_computeImgDivARIAHidden:function(){return""===this.alt?"true":void 0},_computeImgDivARIALabel:function(){return null!==this.alt?this.alt:""===this.src?"":this._resolveSrc(this.src).replace(/[?|#].*/g,"").split("/").pop()},_computeImgHidden:function(){return!!this.sizing},_widthChanged:function(){this.style.width=isNaN(this.width)?this.width:this.width+"px"},_heightChanged:function(){this.style.height=isNaN(this.height)?this.height:this.height+"px"},_loadStateObserver:function(e,t){var i=this._resolveSrc(e);i!==this._resolvedSrc&&(this._resolvedSrc="",this.$.img.removeAttribute("src"),this.$.sizedImgDiv.style.backgroundImage="",""===e||t?(this._setLoading(!1),this._setLoaded(!1),this._setError(!1)):(this._resolvedSrc=i,this.$.img.src=this._resolvedSrc,this.$.sizedImgDiv.style.backgroundImage='url("'+this._resolvedSrc+'")',this._setLoading(!0),this._setLoaded(!1),this._setError(!1)))},_placeholderChanged:function(){this.$.placeholder.style.backgroundImage=this.placeholder?'url("'+this.placeholder+'")':""},_transformChanged:function(){var e=this.$.sizedImgDiv.style,t=this.$.placeholder.style;e.backgroundSize=t.backgroundSize=this.sizing,e.backgroundPosition=t.backgroundPosition=this.sizing?this.position:"",e.backgroundRepeat=t.backgroundRepeat=this.sizing?"no-repeat":""},_resolveSrc:function(e){var t=resolveUrl(e,this.$.baseURIAnchor.href);return"/"===t[0]&&(t=(location.origin||location.protocol+"//"+location.host)+t),t}});const template$7=html`
<dom-module id="paper-material-styles">
  <template>
    <style>
      html {
        --paper-material: {
          display: block;
          position: relative;
        };
        --paper-material-elevation-1: {
          @apply --shadow-elevation-2dp;
        };
        --paper-material-elevation-2: {
          @apply --shadow-elevation-4dp;
        };
        --paper-material-elevation-3: {
          @apply --shadow-elevation-6dp;
        };
        --paper-material-elevation-4: {
          @apply --shadow-elevation-8dp;
        };
        --paper-material-elevation-5: {
          @apply --shadow-elevation-16dp;
        };
      }
      .paper-material {
        @apply --paper-material;
      }
      .paper-material[elevation="1"] {
        @apply --paper-material-elevation-1;
      }
      .paper-material[elevation="2"] {
        @apply --paper-material-elevation-2;
      }
      .paper-material[elevation="3"] {
        @apply --paper-material-elevation-3;
      }
      .paper-material[elevation="4"] {
        @apply --paper-material-elevation-4;
      }
      .paper-material[elevation="5"] {
        @apply --paper-material-elevation-5;
      }

      /* Duplicate the styles because of https://github.com/webcomponents/shadycss/issues/193 */
      :host {
        --paper-material: {
          display: block;
          position: relative;
        };
        --paper-material-elevation-1: {
          @apply --shadow-elevation-2dp;
        };
        --paper-material-elevation-2: {
          @apply --shadow-elevation-4dp;
        };
        --paper-material-elevation-3: {
          @apply --shadow-elevation-6dp;
        };
        --paper-material-elevation-4: {
          @apply --shadow-elevation-8dp;
        };
        --paper-material-elevation-5: {
          @apply --shadow-elevation-16dp;
        };
      }
      :host(.paper-material) {
        @apply --paper-material;
      }
      :host(.paper-material[elevation="1"]) {
        @apply --paper-material-elevation-1;
      }
      :host(.paper-material[elevation="2"]) {
        @apply --paper-material-elevation-2;
      }
      :host(.paper-material[elevation="3"]) {
        @apply --paper-material-elevation-3;
      }
      :host(.paper-material[elevation="4"]) {
        @apply --paper-material-elevation-4;
      }
      :host(.paper-material[elevation="5"]) {
        @apply --paper-material-elevation-5;
      }
    </style>
  </template>
</dom-module>`;template$7.setAttribute("style","display: none;"),document.head.appendChild(template$7.content),Polymer$1({_template:html`
    <style include="paper-material-styles">
      :host {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        background-color: var(--paper-card-background-color, var(--primary-background-color));
        border-radius: 2px;

        @apply --paper-font-common-base;
        @apply --paper-card;
      }

      /* IE 10 support for HTML5 hidden attr */
      :host([hidden]), [hidden] {
        display: none !important;
      }

      .header {
        position: relative;
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        overflow: hidden;

        @apply --paper-card-header;
      }

      .header iron-image {
        display: block;
        width: 100%;
        --iron-image-width: 100%;
        pointer-events: none;

        @apply --paper-card-header-image;
      }

      .header .title-text {
        padding: 16px;
        font-size: 24px;
        font-weight: 400;
        color: var(--paper-card-header-color, #000);

        @apply --paper-card-header-text;
      }

      .header .title-text.over-image {
        position: absolute;
        bottom: 0px;

        @apply --paper-card-header-image-text;
      }

      :host ::slotted(.card-content) {
        padding: 16px;
        position:relative;

        @apply --paper-card-content;
      }

      :host ::slotted(.card-actions) {
        border-top: 1px solid #e8e8e8;
        padding: 5px 16px;
        position:relative;

        @apply --paper-card-actions;
      }

      :host([elevation="1"]) {
        @apply --paper-material-elevation-1;
      }

      :host([elevation="2"]) {
        @apply --paper-material-elevation-2;
      }

      :host([elevation="3"]) {
        @apply --paper-material-elevation-3;
      }

      :host([elevation="4"]) {
        @apply --paper-material-elevation-4;
      }

      :host([elevation="5"]) {
        @apply --paper-material-elevation-5;
      }
    </style>

    <div class="header">
      <iron-image hidden\$="[[!image]]" aria-hidden\$="[[_isHidden(image)]]" src="[[image]]" alt="[[alt]]" placeholder="[[placeholderImage]]" preload="[[preloadImage]]" fade="[[fadeImage]]"></iron-image>
      <div hidden\$="[[!heading]]" class\$="title-text [[_computeHeadingClass(image)]]">[[heading]]</div>
    </div>

    <slot></slot>
`,is:"paper-card",properties:{heading:{type:String,value:"",observer:"_headingChanged"},image:{type:String,value:""},alt:{type:String},preloadImage:{type:Boolean,value:!1},fadeImage:{type:Boolean,value:!1},placeholderImage:{type:String,value:null},elevation:{type:Number,value:1,reflectToAttribute:!0},animatedShadow:{type:Boolean,value:!1},animated:{type:Boolean,reflectToAttribute:!0,readOnly:!0,computed:"_computeAnimated(animatedShadow)"}},_isHidden:function(e){return e?"false":"true"},_headingChanged:function(e){var t=this.getAttribute("heading"),i=this.getAttribute("aria-label");"string"==typeof i&&i!==t||this.setAttribute("aria-label",e)},_computeHeadingClass:function(e){return e?" over-image":""},_computeAnimated:function(e){return e}});var KEY_IDENTIFIER={"U+0008":"backspace","U+0009":"tab","U+001B":"esc","U+0020":"space","U+007F":"del"},KEY_CODE={8:"backspace",9:"tab",13:"enter",27:"esc",33:"pageup",34:"pagedown",35:"end",36:"home",32:"space",37:"left",38:"up",39:"right",40:"down",46:"del",106:"*"},MODIFIER_KEYS={shift:"shiftKey",ctrl:"ctrlKey",alt:"altKey",meta:"metaKey"},KEY_CHAR=/[a-z0-9*]/,IDENT_CHAR=/U\+/,ARROW_KEY=/^arrow/,SPACE_KEY=/^space(bar)?/,ESC_KEY=/^escape$/;function transformKey(e,t){var i="";if(e){var n=e.toLowerCase();" "===n||SPACE_KEY.test(n)?i="space":ESC_KEY.test(n)?i="esc":1==n.length?t&&!KEY_CHAR.test(n)||(i=n):i=ARROW_KEY.test(n)?n.replace("arrow",""):"multiply"==n?"*":n}return i}function transformKeyIdentifier(e){var t="";return e&&(e in KEY_IDENTIFIER?t=KEY_IDENTIFIER[e]:IDENT_CHAR.test(e)?(e=parseInt(e.replace("U+","0x"),16),t=String.fromCharCode(e).toLowerCase()):t=e.toLowerCase()),t}function transformKeyCode(e){var t="";return Number(e)&&(t=e>=65&&e<=90?String.fromCharCode(32+e):e>=112&&e<=123?"f"+(e-112+1):e>=48&&e<=57?String(e-48):e>=96&&e<=105?String(e-96):KEY_CODE[e]),t}function normalizedKeyForEvent(e,t){return e.key?transformKey(e.key,t):e.detail&&e.detail.key?transformKey(e.detail.key,t):transformKeyIdentifier(e.keyIdentifier)||transformKeyCode(e.keyCode)||""}function keyComboMatchesEvent(e,t){return normalizedKeyForEvent(t,e.hasModifiers)===e.key&&(!e.hasModifiers||!!t.shiftKey==!!e.shiftKey&&!!t.ctrlKey==!!e.ctrlKey&&!!t.altKey==!!e.altKey&&!!t.metaKey==!!e.metaKey)}function parseKeyComboString(e){return 1===e.length?{combo:e,key:e,event:"keydown"}:e.split("+").reduce(function(e,t){var i=t.split(":"),n=i[0],s=i[1];return n in MODIFIER_KEYS?(e[MODIFIER_KEYS[n]]=!0,e.hasModifiers=!0):(e.key=n,e.event=s||"keydown"),e},{combo:e.split(":").shift()})}function parseEventString(e){return e.trim().split(" ").map(function(e){return parseKeyComboString(e)})}const IronA11yKeysBehavior={properties:{keyEventTarget:{type:Object,value:function(){return this}},stopKeyboardEventPropagation:{type:Boolean,value:!1},_boundKeyHandlers:{type:Array,value:function(){return[]}},_imperativeKeyBindings:{type:Object,value:function(){return{}}}},observers:["_resetKeyEventListeners(keyEventTarget, _boundKeyHandlers)"],keyBindings:{},registered:function(){this._prepKeyBindings()},attached:function(){this._listenKeyEventListeners()},detached:function(){this._unlistenKeyEventListeners()},addOwnKeyBinding:function(e,t){this._imperativeKeyBindings[e]=t,this._prepKeyBindings(),this._resetKeyEventListeners()},removeOwnKeyBindings:function(){this._imperativeKeyBindings={},this._prepKeyBindings(),this._resetKeyEventListeners()},keyboardEventMatchesKeys:function(e,t){for(var i=parseEventString(t),n=0;n<i.length;++n)if(keyComboMatchesEvent(i[n],e))return!0;return!1},_collectKeyBindings:function(){var e=this.behaviors.map(function(e){return e.keyBindings});return-1===e.indexOf(this.keyBindings)&&e.push(this.keyBindings),e},_prepKeyBindings:function(){for(var e in this._keyBindings={},this._collectKeyBindings().forEach(function(e){for(var t in e)this._addKeyBinding(t,e[t])},this),this._imperativeKeyBindings)this._addKeyBinding(e,this._imperativeKeyBindings[e]);for(var t in this._keyBindings)this._keyBindings[t].sort(function(e,t){var i=e[0].hasModifiers;return i===t[0].hasModifiers?0:i?-1:1})},_addKeyBinding:function(e,t){parseEventString(e).forEach(function(e){this._keyBindings[e.event]=this._keyBindings[e.event]||[],this._keyBindings[e.event].push([e,t])},this)},_resetKeyEventListeners:function(){this._unlistenKeyEventListeners(),this.isAttached&&this._listenKeyEventListeners()},_listenKeyEventListeners:function(){this.keyEventTarget&&Object.keys(this._keyBindings).forEach(function(e){var t=this._keyBindings[e],i=this._onKeyBindingEvent.bind(this,t);this._boundKeyHandlers.push([this.keyEventTarget,e,i]),this.keyEventTarget.addEventListener(e,i)},this)},_unlistenKeyEventListeners:function(){for(var e,t,i,n;this._boundKeyHandlers.length;)t=(e=this._boundKeyHandlers.pop())[0],i=e[1],n=e[2],t.removeEventListener(i,n)},_onKeyBindingEvent:function(e,t){if(this.stopKeyboardEventPropagation&&t.stopPropagation(),!t.defaultPrevented)for(var i=0;i<e.length;i++){var n=e[i][0],s=e[i][1];if(keyComboMatchesEvent(n,t)&&(this._triggerKeyHandler(n,s,t),t.defaultPrevented))return}},_triggerKeyHandler:function(e,t,i){var n=Object.create(e);n.keyboardEvent=i;var s=new CustomEvent(e.event,{detail:n,cancelable:!0});this[t].call(this,s),s.defaultPrevented&&i.preventDefault()}},IronControlState={properties:{focused:{type:Boolean,value:!1,notify:!0,readOnly:!0,reflectToAttribute:!0},disabled:{type:Boolean,value:!1,notify:!0,observer:"_disabledChanged",reflectToAttribute:!0},_oldTabIndex:{type:String},_boundFocusBlurHandler:{type:Function,value:function(){return this._focusBlurHandler.bind(this)}}},observers:["_changedControlState(focused, disabled)"],ready:function(){this.addEventListener("focus",this._boundFocusBlurHandler,!0),this.addEventListener("blur",this._boundFocusBlurHandler,!0)},_focusBlurHandler:function(e){this._setFocused("focus"===e.type)},_disabledChanged:function(e,t){this.setAttribute("aria-disabled",e?"true":"false"),this.style.pointerEvents=e?"none":"",e?(this._oldTabIndex=this.getAttribute("tabindex"),this._setFocused(!1),this.tabIndex=-1,this.blur()):void 0!==this._oldTabIndex&&(null===this._oldTabIndex?this.removeAttribute("tabindex"):this.setAttribute("tabindex",this._oldTabIndex))},_changedControlState:function(){this._controlStateChanged&&this._controlStateChanged()}},IronFitBehavior={properties:{sizingTarget:{type:Object,value:function(){return this}},fitInto:{type:Object,value:window},noOverlap:{type:Boolean},positionTarget:{type:Element},horizontalAlign:{type:String},verticalAlign:{type:String},dynamicAlign:{type:Boolean},horizontalOffset:{type:Number,value:0,notify:!0},verticalOffset:{type:Number,value:0,notify:!0},autoFitOnAttach:{type:Boolean,value:!1},_fitInfo:{type:Object}},get _fitWidth(){return this.fitInto===window?this.fitInto.innerWidth:this.fitInto.getBoundingClientRect().width},get _fitHeight(){return this.fitInto===window?this.fitInto.innerHeight:this.fitInto.getBoundingClientRect().height},get _fitLeft(){return this.fitInto===window?0:this.fitInto.getBoundingClientRect().left},get _fitTop(){return this.fitInto===window?0:this.fitInto.getBoundingClientRect().top},get _defaultPositionTarget(){var e=dom(this).parentNode;return e&&e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&(e=e.host),e},get _localeHorizontalAlign(){if(this._isRTL){if("right"===this.horizontalAlign)return"left";if("left"===this.horizontalAlign)return"right"}return this.horizontalAlign},get __shouldPosition(){return(this.horizontalAlign||this.verticalAlign)&&this.positionTarget},attached:function(){void 0===this._isRTL&&(this._isRTL="rtl"==window.getComputedStyle(this).direction),this.positionTarget=this.positionTarget||this._defaultPositionTarget,this.autoFitOnAttach&&("none"===window.getComputedStyle(this).display?setTimeout(function(){this.fit()}.bind(this)):(window.ShadyDOM&&ShadyDOM.flush(),this.fit()))},detached:function(){this.__deferredFit&&(clearTimeout(this.__deferredFit),this.__deferredFit=null)},fit:function(){this.position(),this.constrain(),this.center()},_discoverInfo:function(){if(!this._fitInfo){var e=window.getComputedStyle(this),t=window.getComputedStyle(this.sizingTarget);this._fitInfo={inlineStyle:{top:this.style.top||"",left:this.style.left||"",position:this.style.position||""},sizerInlineStyle:{maxWidth:this.sizingTarget.style.maxWidth||"",maxHeight:this.sizingTarget.style.maxHeight||"",boxSizing:this.sizingTarget.style.boxSizing||""},positionedBy:{vertically:"auto"!==e.top?"top":"auto"!==e.bottom?"bottom":null,horizontally:"auto"!==e.left?"left":"auto"!==e.right?"right":null},sizedBy:{height:"none"!==t.maxHeight,width:"none"!==t.maxWidth,minWidth:parseInt(t.minWidth,10)||0,minHeight:parseInt(t.minHeight,10)||0},margin:{top:parseInt(e.marginTop,10)||0,right:parseInt(e.marginRight,10)||0,bottom:parseInt(e.marginBottom,10)||0,left:parseInt(e.marginLeft,10)||0}}}},resetFit:function(){var e=this._fitInfo||{};for(var t in e.sizerInlineStyle)this.sizingTarget.style[t]=e.sizerInlineStyle[t];for(var t in e.inlineStyle)this.style[t]=e.inlineStyle[t];this._fitInfo=null},refit:function(){var e=this.sizingTarget.scrollLeft,t=this.sizingTarget.scrollTop;this.resetFit(),this.fit(),this.sizingTarget.scrollLeft=e,this.sizingTarget.scrollTop=t},position:function(){if(this.__shouldPosition){this._discoverInfo(),this.style.position="fixed",this.sizingTarget.style.boxSizing="border-box",this.style.left="0px",this.style.top="0px";var e=this.getBoundingClientRect(),t=this.__getNormalizedRect(this.positionTarget),i=this.__getNormalizedRect(this.fitInto),n=this._fitInfo.margin,s={width:e.width+n.left+n.right,height:e.height+n.top+n.bottom},o=this.__getPosition(this._localeHorizontalAlign,this.verticalAlign,s,e,t,i),a=o.left+n.left,r=o.top+n.top,l=Math.min(i.right-n.right,a+e.width),h=Math.min(i.bottom-n.bottom,r+e.height);a=Math.max(i.left+n.left,Math.min(a,l-this._fitInfo.sizedBy.minWidth)),r=Math.max(i.top+n.top,Math.min(r,h-this._fitInfo.sizedBy.minHeight)),this.sizingTarget.style.maxWidth=Math.max(l-a,this._fitInfo.sizedBy.minWidth)+"px",this.sizingTarget.style.maxHeight=Math.max(h-r,this._fitInfo.sizedBy.minHeight)+"px",this.style.left=a-e.left+"px",this.style.top=r-e.top+"px"}},constrain:function(){if(!this.__shouldPosition){this._discoverInfo();var e=this._fitInfo;e.positionedBy.vertically||(this.style.position="fixed",this.style.top="0px"),e.positionedBy.horizontally||(this.style.position="fixed",this.style.left="0px"),this.sizingTarget.style.boxSizing="border-box";var t=this.getBoundingClientRect();e.sizedBy.height||this.__sizeDimension(t,e.positionedBy.vertically,"top","bottom","Height"),e.sizedBy.width||this.__sizeDimension(t,e.positionedBy.horizontally,"left","right","Width")}},_sizeDimension:function(e,t,i,n,s){this.__sizeDimension(e,t,i,n,s)},__sizeDimension:function(e,t,i,n,s){var o=this._fitInfo,a=this.__getNormalizedRect(this.fitInto),r="Width"===s?a.width:a.height,l=t===n,h=l?r-e[n]:e[i],c=o.margin[l?i:n],d="offset"+s,p=this[d]-this.sizingTarget[d];this.sizingTarget.style["max"+s]=r-c-h-p+"px"},center:function(){if(!this.__shouldPosition){this._discoverInfo();var e=this._fitInfo.positionedBy;if(!e.vertically||!e.horizontally){this.style.position="fixed",e.vertically||(this.style.top="0px"),e.horizontally||(this.style.left="0px");var t=this.getBoundingClientRect(),i=this.__getNormalizedRect(this.fitInto);if(!e.vertically){var n=i.top-t.top+(i.height-t.height)/2;this.style.top=n+"px"}if(!e.horizontally){var s=i.left-t.left+(i.width-t.width)/2;this.style.left=s+"px"}}}},__getNormalizedRect:function(e){return e===document.documentElement||e===window?{top:0,left:0,width:window.innerWidth,height:window.innerHeight,right:window.innerWidth,bottom:window.innerHeight}:e.getBoundingClientRect()},__getOffscreenArea:function(e,t,i){var n=Math.min(0,e.top)+Math.min(0,i.bottom-(e.top+t.height)),s=Math.min(0,e.left)+Math.min(0,i.right-(e.left+t.width));return Math.abs(n)*t.width+Math.abs(s)*t.height},__getPosition:function(e,t,i,n,s,o){var a,r=[{verticalAlign:"top",horizontalAlign:"left",top:s.top+this.verticalOffset,left:s.left+this.horizontalOffset},{verticalAlign:"top",horizontalAlign:"right",top:s.top+this.verticalOffset,left:s.right-i.width-this.horizontalOffset},{verticalAlign:"bottom",horizontalAlign:"left",top:s.bottom-i.height-this.verticalOffset,left:s.left+this.horizontalOffset},{verticalAlign:"bottom",horizontalAlign:"right",top:s.bottom-i.height-this.verticalOffset,left:s.right-i.width-this.horizontalOffset}];if(this.noOverlap){for(var l=0,h=r.length;l<h;l++){var c={};for(var d in r[l])c[d]=r[l][d];r.push(c)}r[0].top=r[1].top+=s.height,r[2].top=r[3].top-=s.height,r[4].left=r[6].left+=s.width,r[5].left=r[7].left-=s.width}t="auto"===t?null:t,(e="auto"===e?null:e)&&"center"!==e||(r.push({verticalAlign:"top",horizontalAlign:"center",top:s.top+this.verticalOffset+(this.noOverlap?s.height:0),left:s.left-n.width/2+s.width/2+this.horizontalOffset}),r.push({verticalAlign:"bottom",horizontalAlign:"center",top:s.bottom-i.height-this.verticalOffset-(this.noOverlap?s.height:0),left:s.left-n.width/2+s.width/2+this.horizontalOffset})),t&&"middle"!==t||(r.push({verticalAlign:"middle",horizontalAlign:"left",top:s.top-n.height/2+s.height/2+this.verticalOffset,left:s.left+this.horizontalOffset+(this.noOverlap?s.width:0)}),r.push({verticalAlign:"middle",horizontalAlign:"right",top:s.top-n.height/2+s.height/2+this.verticalOffset,left:s.right-i.width-this.horizontalOffset-(this.noOverlap?s.width:0)})),"middle"===t&&"center"===e&&r.push({verticalAlign:"middle",horizontalAlign:"center",top:s.top-n.height/2+s.height/2+this.verticalOffset,left:s.left-n.width/2+s.width/2+this.horizontalOffset});for(l=0;l<r.length;l++){var p=r[l],u=p.verticalAlign===t,m=p.horizontalAlign===e;if(!this.dynamicAlign&&!this.noOverlap&&u&&m){a=p;break}var f=(!t||u)&&(!e||m);if(this.dynamicAlign||f){if(p.offscreenArea=this.__getOffscreenArea(p,i,o),0===p.offscreenArea&&f){a=p;break}a=a||p;var g=p.offscreenArea-a.offscreenArea;(g<0||0===g&&(u||m))&&(a=p)}}return a}};var ORPHANS=new Set;const IronResizableBehavior={properties:{_parentResizable:{type:Object,observer:"_parentResizableChanged"},_notifyingDescendant:{type:Boolean,value:!1}},listeners:{"iron-request-resize-notifications":"_onIronRequestResizeNotifications"},created:function(){this._interestedResizables=[],this._boundNotifyResize=this.notifyResize.bind(this),this._boundOnDescendantIronResize=this._onDescendantIronResize.bind(this)},attached:function(){this._requestResizeNotifications()},detached:function(){this._parentResizable?this._parentResizable.stopResizeNotificationsFor(this):(ORPHANS.delete(this),window.removeEventListener("resize",this._boundNotifyResize)),this._parentResizable=null},notifyResize:function(){this.isAttached&&(this._interestedResizables.forEach(function(e){this.resizerShouldNotify(e)&&this._notifyDescendant(e)},this),this._fireResize())},assignParentResizable:function(e){this._parentResizable&&this._parentResizable.stopResizeNotificationsFor(this),this._parentResizable=e,e&&-1===e._interestedResizables.indexOf(this)&&(e._interestedResizables.push(this),e._subscribeIronResize(this))},stopResizeNotificationsFor:function(e){var t=this._interestedResizables.indexOf(e);t>-1&&(this._interestedResizables.splice(t,1),this._unsubscribeIronResize(e))},_subscribeIronResize:function(e){e.addEventListener("iron-resize",this._boundOnDescendantIronResize)},_unsubscribeIronResize:function(e){e.removeEventListener("iron-resize",this._boundOnDescendantIronResize)},resizerShouldNotify:function(e){return!0},_onDescendantIronResize:function(e){this._notifyingDescendant?e.stopPropagation():useShadow||this._fireResize()},_fireResize:function(){this.fire("iron-resize",null,{node:this,bubbles:!1})},_onIronRequestResizeNotifications:function(e){var t=dom(e).rootTarget;t!==this&&(t.assignParentResizable(this),this._notifyDescendant(t),e.stopPropagation())},_parentResizableChanged:function(e){e&&window.removeEventListener("resize",this._boundNotifyResize)},_notifyDescendant:function(e){this.isAttached&&(this._notifyingDescendant=!0,e.notifyResize(),this._notifyingDescendant=!1)},_requestResizeNotifications:function(){if(this.isAttached)if("loading"===document.readyState){var e=this._requestResizeNotifications.bind(this);document.addEventListener("readystatechange",function t(){document.removeEventListener("readystatechange",t),e()})}else this._findParent(),this._parentResizable?this._parentResizable._interestedResizables.forEach(function(e){e!==this&&e._findParent()},this):(ORPHANS.forEach(function(e){e!==this&&e._findParent()},this),window.addEventListener("resize",this._boundNotifyResize),this.notifyResize())},_findParent:function(){this.assignParentResizable(null),this.fire("iron-request-resize-notifications",null,{node:this,bubbles:!0,cancelable:!0}),this._parentResizable?ORPHANS.delete(this):ORPHANS.add(this)}};var p$1=Element.prototype,matches$1=p$1.matches||p$1.matchesSelector||p$1.mozMatchesSelector||p$1.msMatchesSelector||p$1.oMatchesSelector||p$1.webkitMatchesSelector;const IronFocusablesHelper={getTabbableNodes:function(e){var t=[];return this._collectTabbableNodes(e,t)?this._sortByTabIndex(t):t},isFocusable:function(e){return matches$1.call(e,"input, select, textarea, button, object")?matches$1.call(e,":not([disabled])"):matches$1.call(e,"a[href], area[href], iframe, [tabindex], [contentEditable]")},isTabbable:function(e){return this.isFocusable(e)&&matches$1.call(e,':not([tabindex="-1"])')&&this._isVisible(e)},_normalizedTabIndex:function(e){if(this.isFocusable(e)){var t=e.getAttribute("tabindex")||0;return Number(t)}return-1},_collectTabbableNodes:function(e,t){if(e.nodeType!==Node.ELEMENT_NODE||!this._isVisible(e))return!1;var i,n=e,s=this._normalizedTabIndex(n),o=s>0;s>=0&&t.push(n),i="content"===n.localName||"slot"===n.localName?dom(n).getDistributedNodes():dom(n.root||n).children;for(var a=0;a<i.length;a++)o=this._collectTabbableNodes(i[a],t)||o;return o},_isVisible:function(e){var t=e.style;return"hidden"!==t.visibility&&"none"!==t.display&&("hidden"!==(t=window.getComputedStyle(e)).visibility&&"none"!==t.display)},_sortByTabIndex:function(e){var t=e.length;if(t<2)return e;var i=Math.ceil(t/2),n=this._sortByTabIndex(e.slice(0,i)),s=this._sortByTabIndex(e.slice(i));return this._mergeSortByTabIndex(n,s)},_mergeSortByTabIndex:function(e,t){for(var i=[];e.length>0&&t.length>0;)this._hasLowerTabOrder(e[0],t[0])?i.push(t.shift()):i.push(e.shift());return i.concat(e,t)},_hasLowerTabOrder:function(e,t){var i=Math.max(e.tabIndex,0),n=Math.max(t.tabIndex,0);return 0===i||0===n?n>i:i>n}};Polymer$1({_template:html`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--iron-overlay-backdrop-background-color, #000);
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
        @apply --iron-overlay-backdrop;
      }

      :host(.opened) {
        opacity: var(--iron-overlay-backdrop-opacity, 0.6);
        pointer-events: auto;
        @apply --iron-overlay-backdrop-opened;
      }
    </style>

    <slot></slot>
`,is:"iron-overlay-backdrop",properties:{opened:{reflectToAttribute:!0,type:Boolean,value:!1,observer:"_openedChanged"}},listeners:{transitionend:"_onTransitionend"},created:function(){this.__openedRaf=null},attached:function(){this.opened&&this._openedChanged(this.opened)},prepare:function(){this.opened&&!this.parentNode&&dom(document.body).appendChild(this)},open:function(){this.opened=!0},close:function(){this.opened=!1},complete:function(){this.opened||this.parentNode!==document.body||dom(this.parentNode).removeChild(this)},_onTransitionend:function(e){e&&e.target===this&&this.complete()},_openedChanged:function(e){if(e)this.prepare();else{var t=window.getComputedStyle(this);"0s"!==t.transitionDuration&&0!=t.opacity||this.complete()}this.isAttached&&(this.__openedRaf&&(window.cancelAnimationFrame(this.__openedRaf),this.__openedRaf=null),this.scrollTop=this.scrollTop,this.__openedRaf=window.requestAnimationFrame(function(){this.__openedRaf=null,this.toggleClass("opened",this.opened)}.bind(this)))}});const IronOverlayManagerClass=function(){this._overlays=[],this._minimumZ=101,this._backdropElement=null,add(document.documentElement,"tap",function(){}),document.addEventListener("tap",this._onCaptureClick.bind(this),!0),document.addEventListener("focus",this._onCaptureFocus.bind(this),!0),document.addEventListener("keydown",this._onCaptureKeyDown.bind(this),!0)};IronOverlayManagerClass.prototype={constructor:IronOverlayManagerClass,get backdropElement(){return this._backdropElement||(this._backdropElement=document.createElement("iron-overlay-backdrop")),this._backdropElement},get deepActiveElement(){var e=document.activeElement;for(e&&e instanceof Element!=!1||(e=document.body);e.root&&dom(e.root).activeElement;)e=dom(e.root).activeElement;return e},_bringOverlayAtIndexToFront:function(e){var t=this._overlays[e];if(t){var i=this._overlays.length-1,n=this._overlays[i];if(n&&this._shouldBeBehindOverlay(t,n)&&i--,!(e>=i)){var s=Math.max(this.currentOverlayZ(),this._minimumZ);for(this._getZ(t)<=s&&this._applyOverlayZ(t,s);e<i;)this._overlays[e]=this._overlays[e+1],e++;this._overlays[i]=t}}},addOrRemoveOverlay:function(e){e.opened?this.addOverlay(e):this.removeOverlay(e)},addOverlay:function(e){var t=this._overlays.indexOf(e);if(t>=0)return this._bringOverlayAtIndexToFront(t),void this.trackBackdrop();var i=this._overlays.length,n=this._overlays[i-1],s=Math.max(this._getZ(n),this._minimumZ),o=this._getZ(e);if(n&&this._shouldBeBehindOverlay(e,n)){this._applyOverlayZ(n,s),i--;var a=this._overlays[i-1];s=Math.max(this._getZ(a),this._minimumZ)}o<=s&&this._applyOverlayZ(e,s),this._overlays.splice(i,0,e),this.trackBackdrop()},removeOverlay:function(e){var t=this._overlays.indexOf(e);-1!==t&&(this._overlays.splice(t,1),this.trackBackdrop())},currentOverlay:function(){var e=this._overlays.length-1;return this._overlays[e]},currentOverlayZ:function(){return this._getZ(this.currentOverlay())},ensureMinimumZ:function(e){this._minimumZ=Math.max(this._minimumZ,e)},focusOverlay:function(){var e=this.currentOverlay();e&&e._applyFocus()},trackBackdrop:function(){var e=this._overlayWithBackdrop();(e||this._backdropElement)&&(this.backdropElement.style.zIndex=this._getZ(e)-1,this.backdropElement.opened=!!e,this.backdropElement.prepare())},getBackdrops:function(){for(var e=[],t=0;t<this._overlays.length;t++)this._overlays[t].withBackdrop&&e.push(this._overlays[t]);return e},backdropZ:function(){return this._getZ(this._overlayWithBackdrop())-1},_overlayWithBackdrop:function(){for(var e=this._overlays.length-1;e>=0;e--)if(this._overlays[e].withBackdrop)return this._overlays[e]},_getZ:function(e){var t=this._minimumZ;if(e){var i=Number(e.style.zIndex||window.getComputedStyle(e).zIndex);i==i&&(t=i)}return t},_setZ:function(e,t){e.style.zIndex=t},_applyOverlayZ:function(e,t){this._setZ(e,t+2)},_overlayInPath:function(e){e=e||[];for(var t=0;t<e.length;t++)if(e[t]._manager===this)return e[t]},_onCaptureClick:function(e){var t=this._overlays.length-1;if(-1!==t)for(var i,n=dom(e).path;(i=this._overlays[t])&&this._overlayInPath(n)!==i&&(i._onCaptureClick(e),i.allowClickThrough);)t--},_onCaptureFocus:function(e){var t=this.currentOverlay();t&&t._onCaptureFocus(e)},_onCaptureKeyDown:function(e){var t=this.currentOverlay();t&&(IronA11yKeysBehavior.keyboardEventMatchesKeys(e,"esc")?t._onCaptureEsc(e):IronA11yKeysBehavior.keyboardEventMatchesKeys(e,"tab")&&t._onCaptureTab(e))},_shouldBeBehindOverlay:function(e,t){return!e.alwaysOnTop&&t.alwaysOnTop}};const IronOverlayManager=new IronOverlayManagerClass;var _boundScrollHandler,currentLockingElement,lastTouchPosition={pageX:0,pageY:0},lastRootTarget=null,lastScrollableNodes=[],scrollEvents=["wheel","mousewheel","DOMMouseScroll","touchstart","touchmove"];function pushScrollLock(e){_lockingElements.indexOf(e)>=0||(0===_lockingElements.length&&_lockScrollInteractions(),_lockingElements.push(e),currentLockingElement=_lockingElements[_lockingElements.length-1])}function removeScrollLock(e){var t=_lockingElements.indexOf(e);-1!==t&&(_lockingElements.splice(t,1),currentLockingElement=_lockingElements[_lockingElements.length-1],0===_lockingElements.length&&_unlockScrollInteractions())}const _lockingElements=[];function _scrollInteractionHandler(e){if(e.cancelable&&_shouldPreventScrolling(e)&&e.preventDefault(),e.targetTouches){var t=e.targetTouches[0];lastTouchPosition.pageX=t.pageX,lastTouchPosition.pageY=t.pageY}}function _lockScrollInteractions(){_boundScrollHandler=_boundScrollHandler||_scrollInteractionHandler.bind(void 0);for(var e=0,t=scrollEvents.length;e<t;e++)document.addEventListener(scrollEvents[e],_boundScrollHandler,{capture:!0,passive:!1})}function _unlockScrollInteractions(){for(var e=0,t=scrollEvents.length;e<t;e++)document.removeEventListener(scrollEvents[e],_boundScrollHandler,{capture:!0,passive:!1})}function _shouldPreventScrolling(e){var t=dom(e).rootTarget;if("touchmove"!==e.type&&lastRootTarget!==t&&(lastRootTarget=t,lastScrollableNodes=_getScrollableNodes(dom(e).path)),!lastScrollableNodes.length)return!0;if("touchstart"===e.type)return!1;var i=_getScrollInfo(e);return!_getScrollingNode(lastScrollableNodes,i.deltaX,i.deltaY)}function _getScrollableNodes(e){for(var t=[],i=e.indexOf(currentLockingElement),n=0;n<=i;n++)if(e[n].nodeType===Node.ELEMENT_NODE){var s=e[n],o=s.style;"scroll"!==o.overflow&&"auto"!==o.overflow&&(o=window.getComputedStyle(s)),"scroll"!==o.overflow&&"auto"!==o.overflow||t.push(s)}return t}function _getScrollingNode(e,t,i){if(t||i)for(var n=Math.abs(i)>=Math.abs(t),s=0;s<e.length;s++){var o=e[s];if(n?i<0?o.scrollTop>0:o.scrollTop<o.scrollHeight-o.clientHeight:t<0?o.scrollLeft>0:o.scrollLeft<o.scrollWidth-o.clientWidth)return o}}function _getScrollInfo(e){var t={deltaX:e.deltaX,deltaY:e.deltaY};if("deltaX"in e);else if("wheelDeltaX"in e&&"wheelDeltaY"in e)t.deltaX=-e.wheelDeltaX,t.deltaY=-e.wheelDeltaY;else if("wheelDelta"in e)t.deltaX=0,t.deltaY=-e.wheelDelta;else if("axis"in e)t.deltaX=1===e.axis?e.detail:0,t.deltaY=2===e.axis?e.detail:0;else if(e.targetTouches){var i=e.targetTouches[0];t.deltaX=lastTouchPosition.pageX-i.pageX,t.deltaY=lastTouchPosition.pageY-i.pageY}return t}const IronOverlayBehaviorImpl={properties:{opened:{observer:"_openedChanged",type:Boolean,value:!1,notify:!0},canceled:{observer:"_canceledChanged",readOnly:!0,type:Boolean,value:!1},withBackdrop:{observer:"_withBackdropChanged",type:Boolean},noAutoFocus:{type:Boolean,value:!1},noCancelOnEscKey:{type:Boolean,value:!1},noCancelOnOutsideClick:{type:Boolean,value:!1},closingReason:{type:Object},restoreFocusOnClose:{type:Boolean,value:!1},allowClickThrough:{type:Boolean},alwaysOnTop:{type:Boolean},scrollAction:{type:String},_manager:{type:Object,value:IronOverlayManager},_focusedChild:{type:Object}},listeners:{"iron-resize":"_onIronResize"},observers:["__updateScrollObservers(isAttached, opened, scrollAction)"],get backdropElement(){return this._manager.backdropElement},get _focusNode(){return this._focusedChild||dom(this).querySelector("[autofocus]")||this},get _focusableNodes(){return IronFocusablesHelper.getTabbableNodes(this)},ready:function(){this.__isAnimating=!1,this.__shouldRemoveTabIndex=!1,this.__firstFocusableNode=this.__lastFocusableNode=null,this.__rafs={},this.__restoreFocusNode=null,this.__scrollTop=this.__scrollLeft=null,this.__onCaptureScroll=this.__onCaptureScroll.bind(this),this.__rootNodes=null,this._ensureSetup()},attached:function(){this.opened&&this._openedChanged(this.opened),this._observer=dom(this).observeNodes(this._onNodesChange)},detached:function(){for(var e in dom(this).unobserveNodes(this._observer),this._observer=null,this.__rafs)null!==this.__rafs[e]&&cancelAnimationFrame(this.__rafs[e]);this.__rafs={},this._manager.removeOverlay(this),this.__isAnimating&&(this.opened?this._finishRenderOpened():(this._applyFocus(),this._finishRenderClosed()))},toggle:function(){this._setCanceled(!1),this.opened=!this.opened},open:function(){this._setCanceled(!1),this.opened=!0},close:function(){this._setCanceled(!1),this.opened=!1},cancel:function(e){this.fire("iron-overlay-canceled",e,{cancelable:!0}).defaultPrevented||(this._setCanceled(!0),this.opened=!1)},invalidateTabbables:function(){this.__firstFocusableNode=this.__lastFocusableNode=null},_ensureSetup:function(){this._overlaySetup||(this._overlaySetup=!0,this.style.outline="none",this.style.display="none")},_openedChanged:function(e){e?this.removeAttribute("aria-hidden"):this.setAttribute("aria-hidden","true"),this.isAttached&&(this.__isAnimating=!0,this.__deraf("__openedChanged",this.__openedChanged))},_canceledChanged:function(){this.closingReason=this.closingReason||{},this.closingReason.canceled=this.canceled},_withBackdropChanged:function(){this.withBackdrop&&!this.hasAttribute("tabindex")?(this.setAttribute("tabindex","-1"),this.__shouldRemoveTabIndex=!0):this.__shouldRemoveTabIndex&&(this.removeAttribute("tabindex"),this.__shouldRemoveTabIndex=!1),this.opened&&this.isAttached&&this._manager.trackBackdrop()},_prepareRenderOpened:function(){this.__restoreFocusNode=this._manager.deepActiveElement,this._preparePositioning(),this.refit(),this._finishPositioning(),this.noAutoFocus&&document.activeElement===this._focusNode&&(this._focusNode.blur(),this.__restoreFocusNode.focus())},_renderOpened:function(){this._finishRenderOpened()},_renderClosed:function(){this._finishRenderClosed()},_finishRenderOpened:function(){this.notifyResize(),this.__isAnimating=!1,this.fire("iron-overlay-opened")},_finishRenderClosed:function(){this.style.display="none",this.style.zIndex="",this.notifyResize(),this.__isAnimating=!1,this.fire("iron-overlay-closed",this.closingReason)},_preparePositioning:function(){this.style.transition=this.style.webkitTransition="none",this.style.transform=this.style.webkitTransform="none",this.style.display=""},_finishPositioning:function(){this.style.display="none",this.scrollTop=this.scrollTop,this.style.transition=this.style.webkitTransition="",this.style.transform=this.style.webkitTransform="",this.style.display="",this.scrollTop=this.scrollTop},_applyFocus:function(){if(this.opened)this.noAutoFocus||this._focusNode.focus();else{if(this.restoreFocusOnClose&&this.__restoreFocusNode){var e=this._manager.deepActiveElement;(e===document.body||dom(this).deepContains(e))&&this.__restoreFocusNode.focus()}this.__restoreFocusNode=null,this._focusNode.blur(),this._focusedChild=null}},_onCaptureClick:function(e){this.noCancelOnOutsideClick||this.cancel(e)},_onCaptureFocus:function(e){if(this.withBackdrop){var t=dom(e).path;-1===t.indexOf(this)?(e.stopPropagation(),this._applyFocus()):this._focusedChild=t[0]}},_onCaptureEsc:function(e){this.noCancelOnEscKey||this.cancel(e)},_onCaptureTab:function(e){if(this.withBackdrop){this.__ensureFirstLastFocusables();var t=e.shiftKey,i=t?this.__firstFocusableNode:this.__lastFocusableNode,n=t?this.__lastFocusableNode:this.__firstFocusableNode,s=!1;if(i===n)s=!0;else{var o=this._manager.deepActiveElement;s=o===i||o===this}s&&(e.preventDefault(),this._focusedChild=n,this._applyFocus())}},_onIronResize:function(){this.opened&&!this.__isAnimating&&this.__deraf("refit",this.refit)},_onNodesChange:function(){this.opened&&!this.__isAnimating&&(this.invalidateTabbables(),this.notifyResize())},__ensureFirstLastFocusables:function(){if(!this.__firstFocusableNode||!this.__lastFocusableNode){var e=this._focusableNodes;this.__firstFocusableNode=e[0],this.__lastFocusableNode=e[e.length-1]}},__openedChanged:function(){this.opened?(this._prepareRenderOpened(),this._manager.addOverlay(this),this._applyFocus(),this._renderOpened()):(this._manager.removeOverlay(this),this._applyFocus(),this._renderClosed())},__deraf:function(e,t){var i=this.__rafs;null!==i[e]&&cancelAnimationFrame(i[e]),i[e]=requestAnimationFrame(function(){i[e]=null,t.call(this)}.bind(this))},__updateScrollObservers:function(e,t,i){e&&t&&this.__isValidScrollAction(i)?("lock"===i&&(this.__saveScrollPosition(),pushScrollLock(this)),this.__addScrollListeners()):(removeScrollLock(this),this.__removeScrollListeners())},__addScrollListeners:function(){if(!this.__rootNodes){if(this.__rootNodes=[],useShadow)for(var e=this;e;)e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&e.host&&this.__rootNodes.push(e),e=e.host||e.assignedSlot||e.parentNode;this.__rootNodes.push(document)}this.__rootNodes.forEach(function(e){e.addEventListener("scroll",this.__onCaptureScroll,{capture:!0,passive:!0})},this)},__removeScrollListeners:function(){this.__rootNodes&&this.__rootNodes.forEach(function(e){e.removeEventListener("scroll",this.__onCaptureScroll,{capture:!0,passive:!0})},this),this.isAttached||(this.__rootNodes=null)},__isValidScrollAction:function(e){return"lock"===e||"refit"===e||"cancel"===e},__onCaptureScroll:function(e){if(!(this.__isAnimating||dom(e).path.indexOf(this)>=0))switch(this.scrollAction){case"lock":this.__restoreScrollPosition();break;case"refit":this.__deraf("refit",this.refit);break;case"cancel":this.cancel(e)}},__saveScrollPosition:function(){document.scrollingElement?(this.__scrollTop=document.scrollingElement.scrollTop,this.__scrollLeft=document.scrollingElement.scrollLeft):(this.__scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop),this.__scrollLeft=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft))},__restoreScrollPosition:function(){document.scrollingElement?(document.scrollingElement.scrollTop=this.__scrollTop,document.scrollingElement.scrollLeft=this.__scrollLeft):(document.documentElement.scrollTop=document.body.scrollTop=this.__scrollTop,document.documentElement.scrollLeft=document.body.scrollLeft=this.__scrollLeft)}},IronOverlayBehavior=[IronFitBehavior,IronResizableBehavior,IronOverlayBehaviorImpl],NeonAnimatableBehavior={properties:{animationConfig:{type:Object},entryAnimation:{observer:"_entryAnimationChanged",type:String},exitAnimation:{observer:"_exitAnimationChanged",type:String}},_entryAnimationChanged:function(){this.animationConfig=this.animationConfig||{},this.animationConfig.entry=[{name:this.entryAnimation,node:this}]},_exitAnimationChanged:function(){this.animationConfig=this.animationConfig||{},this.animationConfig.exit=[{name:this.exitAnimation,node:this}]},_copyProperties:function(e,t){for(var i in t)e[i]=t[i]},_cloneConfig:function(e){var t={isClone:!0};return this._copyProperties(t,e),t},_getAnimationConfigRecursive:function(e,t,i){var n;if(this.animationConfig)if(this.animationConfig.value&&"function"==typeof this.animationConfig.value)this._warn(this._logf("playAnimation","Please put 'animationConfig' inside of your components 'properties' object instead of outside of it."));else if(n=e?this.animationConfig[e]:this.animationConfig,Array.isArray(n)||(n=[n]),n)for(var s,o=0;s=n[o];o++)if(s.animatable)s.animatable._getAnimationConfigRecursive(s.type||e,t,i);else if(s.id){var a=t[s.id];a?(a.isClone||(t[s.id]=this._cloneConfig(a),a=t[s.id]),this._copyProperties(a,s)):t[s.id]=s}else i.push(s)},getAnimationConfig:function(e){var t={},i=[];for(var n in this._getAnimationConfigRecursive(e,t,i),t)i.push(t[n]);return i}},NeonAnimationRunnerBehaviorImpl={_configureAnimations:function(e){var t=[],i=[];if(e.length>0)for(let t,n=0;t=e[n];n++){let e=document.createElement(t.name);if(e.isNeonAnimation){let n=null;e.configure||(e.configure=function(e){return null}),n=e.configure(t),i.push({result:n,config:t,neonAnimation:e})}else console.warn(this.is+":",t.name,"not found!")}for(var n=0;n<i.length;n++){let e=i[n].result,s=i[n].config,o=i[n].neonAnimation;try{"function"!=typeof e.cancel&&(e=document.timeline.play(e))}catch(t){e=null,console.warn("Couldnt play","(",s.name,").",t)}e&&t.push({neonAnimation:o,config:s,animation:e})}return t},_shouldComplete:function(e){for(var t=!0,i=0;i<e.length;i++)if("finished"!=e[i].animation.playState){t=!1;break}return t},_complete:function(e){for(var t=0;t<e.length;t++)e[t].neonAnimation.complete(e[t].config);for(t=0;t<e.length;t++)e[t].animation.cancel()},playAnimation:function(e,t){var i=this.getAnimationConfig(e);if(i){this._active=this._active||{},this._active[e]&&(this._complete(this._active[e]),delete this._active[e]);var n=this._configureAnimations(i);if(0!=n.length){this._active[e]=n;for(var s=0;s<n.length;s++)n[s].animation.onfinish=function(){this._shouldComplete(n)&&(this._complete(n),delete this._active[e],this.fire("neon-animation-finish",t,{bubbles:!1}))}.bind(this)}else this.fire("neon-animation-finish",t,{bubbles:!1})}},cancelAnimation:function(){for(var e in this._active){var t=this._active[e];for(var i in t)t[i].animation.cancel()}this._active={}}},NeonAnimationRunnerBehavior=[NeonAnimatableBehavior,NeonAnimationRunnerBehaviorImpl];Polymer$1({_template:html`
    <style>
      :host {
        position: fixed;
      }

      #contentWrapper ::slotted(*) {
        overflow: auto;
      }

      #contentWrapper.animating ::slotted(*) {
        overflow: hidden;
        pointer-events: none;
      }
    </style>

    <div id="contentWrapper">
      <slot id="content" name="dropdown-content"></slot>
    </div>
`,is:"iron-dropdown",behaviors:[IronControlState,IronA11yKeysBehavior,IronOverlayBehavior,NeonAnimationRunnerBehavior],properties:{horizontalAlign:{type:String,value:"left",reflectToAttribute:!0},verticalAlign:{type:String,value:"top",reflectToAttribute:!0},openAnimationConfig:{type:Object},closeAnimationConfig:{type:Object},focusTarget:{type:Object},noAnimations:{type:Boolean,value:!1},allowOutsideScroll:{type:Boolean,value:!1,observer:"_allowOutsideScrollChanged"}},listeners:{"neon-animation-finish":"_onNeonAnimationFinish"},observers:["_updateOverlayPosition(positionTarget, verticalAlign, horizontalAlign, verticalOffset, horizontalOffset)"],get containedElement(){for(var e=dom(this.$.content).getDistributedNodes(),t=0,i=e.length;t<i;t++)if(e[t].nodeType===Node.ELEMENT_NODE)return e[t]},ready:function(){this.scrollAction||(this.scrollAction=this.allowOutsideScroll?"refit":"lock"),this._readied=!0},attached:function(){this.sizingTarget&&this.sizingTarget!==this||(this.sizingTarget=this.containedElement||this)},detached:function(){this.cancelAnimation()},_openedChanged:function(){this.opened&&this.disabled?this.cancel():(this.cancelAnimation(),this._updateAnimationConfig(),IronOverlayBehaviorImpl._openedChanged.apply(this,arguments))},_renderOpened:function(){!this.noAnimations&&this.animationConfig.open?(this.$.contentWrapper.classList.add("animating"),this.playAnimation("open")):IronOverlayBehaviorImpl._renderOpened.apply(this,arguments)},_renderClosed:function(){!this.noAnimations&&this.animationConfig.close?(this.$.contentWrapper.classList.add("animating"),this.playAnimation("close")):IronOverlayBehaviorImpl._renderClosed.apply(this,arguments)},_onNeonAnimationFinish:function(){this.$.contentWrapper.classList.remove("animating"),this.opened?this._finishRenderOpened():this._finishRenderClosed()},_updateAnimationConfig:function(){for(var e=this.containedElement,t=[].concat(this.openAnimationConfig||[]).concat(this.closeAnimationConfig||[]),i=0;i<t.length;i++)t[i].node=e;this.animationConfig={open:this.openAnimationConfig,close:this.closeAnimationConfig}},_updateOverlayPosition:function(){this.isAttached&&this.notifyResize()},_allowOutsideScrollChanged:function(e){this._readied&&(e?this.scrollAction&&"lock"!==this.scrollAction||(this.scrollAction="refit"):this.scrollAction="lock")},_applyFocus:function(){var e=this.focusTarget||this.containedElement;e&&this.opened&&!this.noAutoFocus?e.focus():IronOverlayBehaviorImpl._applyFocus.apply(this,arguments)}});const NeonAnimationBehavior={properties:{animationTiming:{type:Object,value:function(){return{duration:500,easing:"cubic-bezier(0.4, 0, 0.2, 1)",fill:"both"}}}},isNeonAnimation:!0,created:function(){document.body.animate||console.warn("No web animations detected. This element will not function without a web animations polyfill.")},timingFromConfig:function(e){if(e.timing)for(var t in e.timing)this.animationTiming[t]=e.timing[t];return this.animationTiming},setPrefixedProperty:function(e,t,i){for(var n,s={transform:["webkitTransform"],transformOrigin:["mozTransformOrigin","webkitTransformOrigin"]}[t],o=0;n=s[o];o++)e.style[n]=i;e.style[t]=i},complete:function(e){}};Polymer$1({is:"fade-in-animation",behaviors:[NeonAnimationBehavior],configure:function(e){var t=e.node;return this._effect=new KeyframeEffect(t,[{opacity:"0"},{opacity:"1"}],this.timingFromConfig(e)),this._effect}}),Polymer$1({is:"fade-out-animation",behaviors:[NeonAnimationBehavior],configure:function(e){var t=e.node;return this._effect=new KeyframeEffect(t,[{opacity:"1"},{opacity:"0"}],this.timingFromConfig(e)),this._effect}}),Polymer$1({is:"paper-menu-grow-height-animation",behaviors:[NeonAnimationBehavior],configure:function(e){var t=e.node,i=t.getBoundingClientRect().height;return this._effect=new KeyframeEffect(t,[{height:i/2+"px"},{height:i+"px"}],this.timingFromConfig(e)),this._effect}}),Polymer$1({is:"paper-menu-grow-width-animation",behaviors:[NeonAnimationBehavior],configure:function(e){var t=e.node,i=t.getBoundingClientRect().width;return this._effect=new KeyframeEffect(t,[{width:i/2+"px"},{width:i+"px"}],this.timingFromConfig(e)),this._effect}}),Polymer$1({is:"paper-menu-shrink-width-animation",behaviors:[NeonAnimationBehavior],configure:function(e){var t=e.node,i=t.getBoundingClientRect().width;return this._effect=new KeyframeEffect(t,[{width:i+"px"},{width:i-i/20+"px"}],this.timingFromConfig(e)),this._effect}}),Polymer$1({is:"paper-menu-shrink-height-animation",behaviors:[NeonAnimationBehavior],configure:function(e){var t=e.node,i=t.getBoundingClientRect().height;return this.setPrefixedProperty(t,"transformOrigin","0 0"),this._effect=new KeyframeEffect(t,[{height:i+"px",transform:"translateY(0)"},{height:i/2+"px",transform:"translateY(-20px)"}],this.timingFromConfig(e)),this._effect}});var config={ANIMATION_CUBIC_BEZIER:"cubic-bezier(.3,.95,.5,1)",MAX_ANIMATION_TIME_MS:400};const PaperMenuButton=Polymer$1({_template:html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 8px;
        outline: none;

        @apply --paper-menu-button;
      }

      :host([disabled]) {
        cursor: auto;
        color: var(--disabled-text-color);

        @apply --paper-menu-button-disabled;
      }

      iron-dropdown {
        @apply --paper-menu-button-dropdown;
      }

      .dropdown-content {
        @apply --shadow-elevation-2dp;

        position: relative;
        border-radius: 2px;
        background-color: var(--paper-menu-button-dropdown-background, var(--primary-background-color));

        @apply --paper-menu-button-content;
      }

      :host([vertical-align="top"]) .dropdown-content {
        margin-bottom: 20px;
        margin-top: -10px;
        top: 10px;
      }

      :host([vertical-align="bottom"]) .dropdown-content {
        bottom: 10px;
        margin-bottom: -10px;
        margin-top: 20px;
      }

      #trigger {
        cursor: pointer;
      }
    </style>

    <div id="trigger" on-tap="toggle">
      <slot name="dropdown-trigger"></slot>
    </div>

    <iron-dropdown id="dropdown" opened="{{opened}}" horizontal-align="[[horizontalAlign]]" vertical-align="[[verticalAlign]]" dynamic-align="[[dynamicAlign]]" horizontal-offset="[[horizontalOffset]]" vertical-offset="[[verticalOffset]]" no-overlap="[[noOverlap]]" open-animation-config="[[openAnimationConfig]]" close-animation-config="[[closeAnimationConfig]]" no-animations="[[noAnimations]]" focus-target="[[_dropdownContent]]" allow-outside-scroll="[[allowOutsideScroll]]" restore-focus-on-close="[[restoreFocusOnClose]]" on-iron-overlay-canceled="__onIronOverlayCanceled">
      <div slot="dropdown-content" class="dropdown-content">
        <slot id="content" name="dropdown-content"></slot>
      </div>
    </iron-dropdown>
`,is:"paper-menu-button",behaviors:[IronA11yKeysBehavior,IronControlState],properties:{opened:{type:Boolean,value:!1,notify:!0,observer:"_openedChanged"},horizontalAlign:{type:String,value:"left",reflectToAttribute:!0},verticalAlign:{type:String,value:"top",reflectToAttribute:!0},dynamicAlign:{type:Boolean},horizontalOffset:{type:Number,value:0,notify:!0},verticalOffset:{type:Number,value:0,notify:!0},noOverlap:{type:Boolean},noAnimations:{type:Boolean,value:!1},ignoreSelect:{type:Boolean,value:!1},closeOnActivate:{type:Boolean,value:!1},openAnimationConfig:{type:Object,value:function(){return[{name:"fade-in-animation",timing:{delay:100,duration:200}},{name:"paper-menu-grow-width-animation",timing:{delay:100,duration:150,easing:config.ANIMATION_CUBIC_BEZIER}},{name:"paper-menu-grow-height-animation",timing:{delay:100,duration:275,easing:config.ANIMATION_CUBIC_BEZIER}}]}},closeAnimationConfig:{type:Object,value:function(){return[{name:"fade-out-animation",timing:{duration:150}},{name:"paper-menu-shrink-width-animation",timing:{delay:100,duration:50,easing:config.ANIMATION_CUBIC_BEZIER}},{name:"paper-menu-shrink-height-animation",timing:{duration:200,easing:"ease-in"}}]}},allowOutsideScroll:{type:Boolean,value:!1},restoreFocusOnClose:{type:Boolean,value:!0},_dropdownContent:{type:Object}},hostAttributes:{role:"group","aria-haspopup":"true"},listeners:{"iron-activate":"_onIronActivate","iron-select":"_onIronSelect"},get contentElement(){for(var e=dom(this.$.content).getDistributedNodes(),t=0,i=e.length;t<i;t++)if(e[t].nodeType===Node.ELEMENT_NODE)return e[t]},toggle:function(){this.opened?this.close():this.open()},open:function(){this.disabled||this.$.dropdown.open()},close:function(){this.$.dropdown.close()},_onIronSelect:function(e){this.ignoreSelect||this.close()},_onIronActivate:function(e){this.closeOnActivate&&this.close()},_openedChanged:function(e,t){e?(this._dropdownContent=this.contentElement,this.fire("paper-dropdown-open")):null!=t&&this.fire("paper-dropdown-close")},_disabledChanged:function(e){IronControlState._disabledChanged.apply(this,arguments),e&&this.opened&&this.close()},__onIronOverlayCanceled:function(e){var t=e.detail,i=this.$.trigger;dom(t).path.indexOf(i)>-1&&e.preventDefault()}});Object.keys(config).forEach(function(e){PaperMenuButton[e]=config[e]});class IronMeta{constructor(e){IronMeta[" "](e),this.type=e&&e.type||"default",this.key=e&&e.key,e&&"value"in e&&(this.value=e.value)}get value(){var e=this.type,t=this.key;if(e&&t)return IronMeta.types[e]&&IronMeta.types[e][t]}set value(e){var t=this.type,i=this.key;t&&i&&(t=IronMeta.types[t]=IronMeta.types[t]||{},null==e?delete t[i]:t[i]=e)}get list(){if(this.type){var e=IronMeta.types[this.type];return e?Object.keys(e).map(function(e){return metaDatas[this.type][e]},this):[]}}byKey(e){return this.key=e,this.value}}IronMeta[" "]=function(){},IronMeta.types={};var metaDatas=IronMeta.types;Polymer$1({is:"iron-meta",properties:{type:{type:String,value:"default"},key:{type:String},value:{type:String,notify:!0},self:{type:Boolean,observer:"_selfChanged"},__meta:{type:Boolean,computed:"__computeMeta(type, key, value)"}},hostAttributes:{hidden:!0},__computeMeta:function(e,t,i){var n=new IronMeta({type:e,key:t});return void 0!==i&&i!==n.value?n.value=i:this.value!==n.value&&(this.value=n.value),n},get list(){return this.__meta&&this.__meta.list},_selfChanged:function(e){e&&(this.value=this)},byKey:function(e){return new IronMeta({type:this.type,key:e}).value}}),Polymer$1({_template:html`
    <style>
      :host {
        @apply --layout-inline;
        @apply --layout-center-center;
        position: relative;

        vertical-align: middle;

        fill: var(--iron-icon-fill-color, currentcolor);
        stroke: var(--iron-icon-stroke-color, none);

        width: var(--iron-icon-width, 24px);
        height: var(--iron-icon-height, 24px);
        @apply --iron-icon;
      }

      :host([hidden]) {
        display: none;
      }
    </style>
`,is:"iron-icon",properties:{icon:{type:String},theme:{type:String},src:{type:String},_meta:{value:Base.create("iron-meta",{type:"iconset"})}},observers:["_updateIcon(_meta, isAttached)","_updateIcon(theme, isAttached)","_srcChanged(src, isAttached)","_iconChanged(icon, isAttached)"],_DEFAULT_ICONSET:"icons",_iconChanged:function(e){var t=(e||"").split(":");this._iconName=t.pop(),this._iconsetName=t.pop()||this._DEFAULT_ICONSET,this._updateIcon()},_srcChanged:function(e){this._updateIcon()},_usesIconset:function(){return this.icon||!this.src},_updateIcon:function(){this._usesIconset()?(this._img&&this._img.parentNode&&dom(this.root).removeChild(this._img),""===this._iconName?this._iconset&&this._iconset.removeIcon(this):this._iconsetName&&this._meta&&(this._iconset=this._meta.byKey(this._iconsetName),this._iconset?(this._iconset.applyIcon(this,this._iconName,this.theme),this.unlisten(window,"iron-iconset-added","_updateIcon")):this.listen(window,"iron-iconset-added","_updateIcon"))):(this._iconset&&this._iconset.removeIcon(this),this._img||(this._img=document.createElement("img"),this._img.style.width="100%",this._img.style.height="100%",this._img.draggable=!1),this._img.src=this.src,dom(this.root).appendChild(this._img))}});const IronButtonStateImpl={properties:{pressed:{type:Boolean,readOnly:!0,value:!1,reflectToAttribute:!0,observer:"_pressedChanged"},toggles:{type:Boolean,value:!1,reflectToAttribute:!0},active:{type:Boolean,value:!1,notify:!0,reflectToAttribute:!0},pointerDown:{type:Boolean,readOnly:!0,value:!1},receivedFocusFromKeyboard:{type:Boolean,readOnly:!0},ariaActiveAttribute:{type:String,value:"aria-pressed",observer:"_ariaActiveAttributeChanged"}},listeners:{down:"_downHandler",up:"_upHandler",tap:"_tapHandler"},observers:["_focusChanged(focused)","_activeChanged(active, ariaActiveAttribute)"],keyBindings:{"enter:keydown":"_asyncClick","space:keydown":"_spaceKeyDownHandler","space:keyup":"_spaceKeyUpHandler"},_mouseEventRe:/^mouse/,_tapHandler:function(){this.toggles?this._userActivate(!this.active):this.active=!1},_focusChanged:function(e){this._detectKeyboardFocus(e),e||this._setPressed(!1)},_detectKeyboardFocus:function(e){this._setReceivedFocusFromKeyboard(!this.pointerDown&&e)},_userActivate:function(e){this.active!==e&&(this.active=e,this.fire("change"))},_downHandler:function(e){this._setPointerDown(!0),this._setPressed(!0),this._setReceivedFocusFromKeyboard(!1)},_upHandler:function(){this._setPointerDown(!1),this._setPressed(!1)},_spaceKeyDownHandler:function(e){var t=e.detail.keyboardEvent,i=dom(t).localTarget;this.isLightDescendant(i)||(t.preventDefault(),t.stopImmediatePropagation(),this._setPressed(!0))},_spaceKeyUpHandler:function(e){var t=e.detail.keyboardEvent,i=dom(t).localTarget;this.isLightDescendant(i)||(this.pressed&&this._asyncClick(),this._setPressed(!1))},_asyncClick:function(){this.async(function(){this.click()},1)},_pressedChanged:function(e){this._changedButtonState()},_ariaActiveAttributeChanged:function(e,t){t&&t!=e&&this.hasAttribute(t)&&this.removeAttribute(t)},_activeChanged:function(e,t){this.toggles?this.setAttribute(this.ariaActiveAttribute,e?"true":"false"):this.removeAttribute(this.ariaActiveAttribute),this._changedButtonState()},_controlStateChanged:function(){this.disabled?this._setPressed(!1):this._changedButtonState()},_changedButtonState:function(){this._buttonStateChanged&&this._buttonStateChanged()}},IronButtonState=[IronA11yKeysBehavior,IronButtonStateImpl];var Utility={distance:function(e,t,i,n){var s=e-i,o=t-n;return Math.sqrt(s*s+o*o)},now:window.performance&&window.performance.now?window.performance.now.bind(window.performance):Date.now};function ElementMetrics(e){this.element=e,this.width=this.boundingRect.width,this.height=this.boundingRect.height,this.size=Math.max(this.width,this.height)}function Ripple(e){this.element=e,this.color=window.getComputedStyle(e).color,this.wave=document.createElement("div"),this.waveContainer=document.createElement("div"),this.wave.style.backgroundColor=this.color,this.wave.classList.add("wave"),this.waveContainer.classList.add("wave-container"),dom(this.waveContainer).appendChild(this.wave),this.resetInteractionState()}ElementMetrics.prototype={get boundingRect(){return this.element.getBoundingClientRect()},furthestCornerDistanceFrom:function(e,t){var i=Utility.distance(e,t,0,0),n=Utility.distance(e,t,this.width,0),s=Utility.distance(e,t,0,this.height),o=Utility.distance(e,t,this.width,this.height);return Math.max(i,n,s,o)}},Ripple.MAX_RADIUS=300,Ripple.prototype={get recenters(){return this.element.recenters},get center(){return this.element.center},get mouseDownElapsed(){var e;return this.mouseDownStart?(e=Utility.now()-this.mouseDownStart,this.mouseUpStart&&(e-=this.mouseUpElapsed),e):0},get mouseUpElapsed(){return this.mouseUpStart?Utility.now()-this.mouseUpStart:0},get mouseDownElapsedSeconds(){return this.mouseDownElapsed/1e3},get mouseUpElapsedSeconds(){return this.mouseUpElapsed/1e3},get mouseInteractionSeconds(){return this.mouseDownElapsedSeconds+this.mouseUpElapsedSeconds},get initialOpacity(){return this.element.initialOpacity},get opacityDecayVelocity(){return this.element.opacityDecayVelocity},get radius(){var e=this.containerMetrics.width*this.containerMetrics.width,t=this.containerMetrics.height*this.containerMetrics.height,i=1.1*Math.min(Math.sqrt(e+t),Ripple.MAX_RADIUS)+5,n=1.1-i/Ripple.MAX_RADIUS*.2,s=this.mouseInteractionSeconds/n,o=i*(1-Math.pow(80,-s));return Math.abs(o)},get opacity(){return this.mouseUpStart?Math.max(0,this.initialOpacity-this.mouseUpElapsedSeconds*this.opacityDecayVelocity):this.initialOpacity},get outerOpacity(){var e=.3*this.mouseUpElapsedSeconds,t=this.opacity;return Math.max(0,Math.min(e,t))},get isOpacityFullyDecayed(){return this.opacity<.01&&this.radius>=Math.min(this.maxRadius,Ripple.MAX_RADIUS)},get isRestingAtMaxRadius(){return this.opacity>=this.initialOpacity&&this.radius>=Math.min(this.maxRadius,Ripple.MAX_RADIUS)},get isAnimationComplete(){return this.mouseUpStart?this.isOpacityFullyDecayed:this.isRestingAtMaxRadius},get translationFraction(){return Math.min(1,this.radius/this.containerMetrics.size*2/Math.sqrt(2))},get xNow(){return this.xEnd?this.xStart+this.translationFraction*(this.xEnd-this.xStart):this.xStart},get yNow(){return this.yEnd?this.yStart+this.translationFraction*(this.yEnd-this.yStart):this.yStart},get isMouseDown(){return this.mouseDownStart&&!this.mouseUpStart},resetInteractionState:function(){this.maxRadius=0,this.mouseDownStart=0,this.mouseUpStart=0,this.xStart=0,this.yStart=0,this.xEnd=0,this.yEnd=0,this.slideDistance=0,this.containerMetrics=new ElementMetrics(this.element)},draw:function(){var e,t,i;this.wave.style.opacity=this.opacity,e=this.radius/(this.containerMetrics.size/2),t=this.xNow-this.containerMetrics.width/2,i=this.yNow-this.containerMetrics.height/2,this.waveContainer.style.webkitTransform="translate("+t+"px, "+i+"px)",this.waveContainer.style.transform="translate3d("+t+"px, "+i+"px, 0)",this.wave.style.webkitTransform="scale("+e+","+e+")",this.wave.style.transform="scale3d("+e+","+e+",1)"},downAction:function(e){var t=this.containerMetrics.width/2,i=this.containerMetrics.height/2;this.resetInteractionState(),this.mouseDownStart=Utility.now(),this.center?(this.xStart=t,this.yStart=i,this.slideDistance=Utility.distance(this.xStart,this.yStart,this.xEnd,this.yEnd)):(this.xStart=e?e.detail.x-this.containerMetrics.boundingRect.left:this.containerMetrics.width/2,this.yStart=e?e.detail.y-this.containerMetrics.boundingRect.top:this.containerMetrics.height/2),this.recenters&&(this.xEnd=t,this.yEnd=i,this.slideDistance=Utility.distance(this.xStart,this.yStart,this.xEnd,this.yEnd)),this.maxRadius=this.containerMetrics.furthestCornerDistanceFrom(this.xStart,this.yStart),this.waveContainer.style.top=(this.containerMetrics.height-this.containerMetrics.size)/2+"px",this.waveContainer.style.left=(this.containerMetrics.width-this.containerMetrics.size)/2+"px",this.waveContainer.style.width=this.containerMetrics.size+"px",this.waveContainer.style.height=this.containerMetrics.size+"px"},upAction:function(e){this.isMouseDown&&(this.mouseUpStart=Utility.now())},remove:function(){dom(this.waveContainer.parentNode).removeChild(this.waveContainer)}},Polymer$1({_template:html`
    <style>
      :host {
        display: block;
        position: absolute;
        border-radius: inherit;
        overflow: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        /* See PolymerElements/paper-behaviors/issues/34. On non-Chrome browsers,
         * creating a node (with a position:absolute) in the middle of an event
         * handler "interrupts" that event handler (which happens when the
         * ripple is created on demand) */
        pointer-events: none;
      }

      :host([animating]) {
        /* This resolves a rendering issue in Chrome (as of 40) where the
           ripple is not properly clipped by its parent (which may have
           rounded corners). See: http://jsbin.com/temexa/4

           Note: We only apply this style conditionally. Otherwise, the browser
           will create a new compositing layer for every ripple element on the
           page, and that would be bad. */
        -webkit-transform: translate(0, 0);
        transform: translate3d(0, 0, 0);
      }

      #background,
      #waves,
      .wave-container,
      .wave {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      #background,
      .wave {
        opacity: 0;
      }

      #waves,
      .wave {
        overflow: hidden;
      }

      .wave-container,
      .wave {
        border-radius: 50%;
      }

      :host(.circle) #background,
      :host(.circle) #waves {
        border-radius: 50%;
      }

      :host(.circle) .wave-container {
        overflow: hidden;
      }
    </style>

    <div id="background"></div>
    <div id="waves"></div>
`,is:"paper-ripple",behaviors:[IronA11yKeysBehavior],properties:{initialOpacity:{type:Number,value:.25},opacityDecayVelocity:{type:Number,value:.8},recenters:{type:Boolean,value:!1},center:{type:Boolean,value:!1},ripples:{type:Array,value:function(){return[]}},animating:{type:Boolean,readOnly:!0,reflectToAttribute:!0,value:!1},holdDown:{type:Boolean,value:!1,observer:"_holdDownChanged"},noink:{type:Boolean,value:!1},_animating:{type:Boolean},_boundAnimate:{type:Function,value:function(){return this.animate.bind(this)}}},get target(){return this.keyEventTarget},keyBindings:{"enter:keydown":"_onEnterKeydown","space:keydown":"_onSpaceKeydown","space:keyup":"_onSpaceKeyup"},attached:function(){11==this.parentNode.nodeType?this.keyEventTarget=dom(this).getOwnerRoot().host:this.keyEventTarget=this.parentNode;var e=this.keyEventTarget;this.listen(e,"up","uiUpAction"),this.listen(e,"down","uiDownAction")},detached:function(){this.unlisten(this.keyEventTarget,"up","uiUpAction"),this.unlisten(this.keyEventTarget,"down","uiDownAction"),this.keyEventTarget=null},get shouldKeepAnimating(){for(var e=0;e<this.ripples.length;++e)if(!this.ripples[e].isAnimationComplete)return!0;return!1},simulatedRipple:function(){this.downAction(null),this.async(function(){this.upAction()},1)},uiDownAction:function(e){this.noink||this.downAction(e)},downAction:function(e){this.holdDown&&this.ripples.length>0||(this.addRipple().downAction(e),this._animating||(this._animating=!0,this.animate()))},uiUpAction:function(e){this.noink||this.upAction(e)},upAction:function(e){this.holdDown||(this.ripples.forEach(function(t){t.upAction(e)}),this._animating=!0,this.animate())},onAnimationComplete:function(){this._animating=!1,this.$.background.style.backgroundColor=null,this.fire("transitionend")},addRipple:function(){var e=new Ripple(this);return dom(this.$.waves).appendChild(e.waveContainer),this.$.background.style.backgroundColor=e.color,this.ripples.push(e),this._setAnimating(!0),e},removeRipple:function(e){var t=this.ripples.indexOf(e);t<0||(this.ripples.splice(t,1),e.remove(),this.ripples.length||this._setAnimating(!1))},animate:function(){if(this._animating){var e,t;for(e=0;e<this.ripples.length;++e)(t=this.ripples[e]).draw(),this.$.background.style.opacity=t.outerOpacity,t.isOpacityFullyDecayed&&!t.isRestingAtMaxRadius&&this.removeRipple(t);this.shouldKeepAnimating||0!==this.ripples.length?window.requestAnimationFrame(this._boundAnimate):this.onAnimationComplete()}},animateRipple:function(){return this.animate()},_onEnterKeydown:function(){this.uiDownAction(),this.async(this.uiUpAction,1)},_onSpaceKeydown:function(){this.uiDownAction()},_onSpaceKeyup:function(){this.uiUpAction()},_holdDownChanged:function(e,t){void 0!==t&&(e?this.downAction():this.upAction())}});const PaperRippleBehavior={properties:{noink:{type:Boolean,observer:"_noinkChanged"},_rippleContainer:{type:Object}},_buttonStateChanged:function(){this.focused&&this.ensureRipple()},_downHandler:function(e){IronButtonStateImpl._downHandler.call(this,e),this.pressed&&this.ensureRipple(e)},ensureRipple:function(e){if(!this.hasRipple()){this._ripple=this._createRipple(),this._ripple.noink=this.noink;var t=this._rippleContainer||this.root;if(t&&dom(t).appendChild(this._ripple),e){var i=dom(this._rippleContainer||this),n=dom(e).rootTarget;i.deepContains(n)&&this._ripple.uiDownAction(e)}}},getRipple:function(){return this.ensureRipple(),this._ripple},hasRipple:function(){return Boolean(this._ripple)},_createRipple:function(){return document.createElement("paper-ripple")},_noinkChanged:function(e){this.hasRipple()&&(this._ripple.noink=e)}},PaperInkyFocusBehaviorImpl={observers:["_focusedChanged(receivedFocusFromKeyboard)"],_focusedChanged:function(e){e&&this.ensureRipple(),this.hasRipple()&&(this._ripple.holdDown=e)},_createRipple:function(){var e=PaperRippleBehavior._createRipple();return e.id="ink",e.setAttribute("center",""),e.classList.add("circle"),e}},PaperInkyFocusBehavior=[IronButtonState,IronControlState,PaperRippleBehavior,PaperInkyFocusBehaviorImpl],template$8=html`
<dom-module id="paper-icon-button">
  <template strip-whitespace>
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 8px;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
        z-index: 0;
        line-height: 1;

        width: 40px;
        height: 40px;

        /* NOTE: Both values are needed, since some phones require the value to be \`transparent\`. */
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;

        /* Because of polymer/2558, this style has lower specificity than * */
        box-sizing: border-box !important;

        @apply --paper-icon-button;
      }

      :host #ink {
        color: var(--paper-icon-button-ink-color, var(--primary-text-color));
        opacity: 0.6;
      }

      :host([disabled]) {
        color: var(--paper-icon-button-disabled-text, var(--disabled-text-color));
        pointer-events: none;
        cursor: auto;

        @apply --paper-icon-button-disabled;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host(:hover) {
        @apply --paper-icon-button-hover;
      }

      iron-icon {
        --iron-icon-width: 100%;
        --iron-icon-height: 100%;
      }
    </style>

    <iron-icon id="icon" src="[[src]]" icon="[[icon]]" alt\$="[[alt]]"></iron-icon>
  </template>
</dom-module>
`;template$8.setAttribute("style","display: none;"),document.body.appendChild(template$8.content),Polymer$1({is:"paper-icon-button",hostAttributes:{role:"button",tabindex:"0"},behaviors:[PaperInkyFocusBehavior],properties:{src:{type:String},icon:{type:String},alt:{type:String,observer:"_altChanged"}},_altChanged:function(e,t){var i=this.getAttribute("aria-label");i&&t!=i||this.setAttribute("aria-label",e)}});class IronSelection{constructor(e){this.selection=[],this.selectCallback=e}get(){return this.multi?this.selection.slice():this.selection[0]}clear(e){this.selection.slice().forEach(function(t){(!e||e.indexOf(t)<0)&&this.setItemSelected(t,!1)},this)}isSelected(e){return this.selection.indexOf(e)>=0}setItemSelected(e,t){if(null!=e&&t!==this.isSelected(e)){if(t)this.selection.push(e);else{var i=this.selection.indexOf(e);i>=0&&this.selection.splice(i,1)}this.selectCallback&&this.selectCallback(e,t)}}select(e){this.multi?this.toggle(e):this.get()!==e&&(this.setItemSelected(this.get(),!1),this.setItemSelected(e,!0))}toggle(e){this.setItemSelected(e,!this.isSelected(e))}}const IronSelectableBehavior={properties:{attrForSelected:{type:String,value:null},selected:{type:String,notify:!0},selectedItem:{type:Object,readOnly:!0,notify:!0},activateEvent:{type:String,value:"tap",observer:"_activateEventChanged"},selectable:String,selectedClass:{type:String,value:"iron-selected"},selectedAttribute:{type:String,value:null},fallbackSelection:{type:String,value:null},items:{type:Array,readOnly:!0,notify:!0,value:function(){return[]}},_excludedLocalNames:{type:Object,value:function(){return{template:1,"dom-bind":1,"dom-if":1,"dom-repeat":1}}}},observers:["_updateAttrForSelected(attrForSelected)","_updateSelected(selected)","_checkFallback(fallbackSelection)"],created:function(){this._bindFilterItem=this._filterItem.bind(this),this._selection=new IronSelection(this._applySelection.bind(this))},attached:function(){this._observer=this._observeItems(this),this._addListener(this.activateEvent)},detached:function(){this._observer&&dom(this).unobserveNodes(this._observer),this._removeListener(this.activateEvent)},indexOf:function(e){return this.items?this.items.indexOf(e):-1},select:function(e){this.selected=e},selectPrevious:function(){var e=this.items.length,t=e-1;void 0!==this.selected&&(t=(Number(this._valueToIndex(this.selected))-1+e)%e),this.selected=this._indexToValue(t)},selectNext:function(){var e=0;void 0!==this.selected&&(e=(Number(this._valueToIndex(this.selected))+1)%this.items.length),this.selected=this._indexToValue(e)},selectIndex:function(e){this.select(this._indexToValue(e))},forceSynchronousItemUpdate:function(){this._observer&&"function"==typeof this._observer.flush?this._observer.flush():this._updateItems()},get _shouldUpdateSelection(){return null!=this.selected},_checkFallback:function(){this._updateSelected()},_addListener:function(e){this.listen(this,e,"_activateHandler")},_removeListener:function(e){this.unlisten(this,e,"_activateHandler")},_activateEventChanged:function(e,t){this._removeListener(t),this._addListener(e)},_updateItems:function(){var e=dom(this).queryDistributedElements(this.selectable||"*");e=Array.prototype.filter.call(e,this._bindFilterItem),this._setItems(e)},_updateAttrForSelected:function(){this.selectedItem&&(this.selected=this._valueForItem(this.selectedItem))},_updateSelected:function(){this._selectSelected(this.selected)},_selectSelected:function(e){if(this.items){var t=this._valueToItem(this.selected);t?this._selection.select(t):this._selection.clear(),this.fallbackSelection&&this.items.length&&void 0===this._selection.get()&&(this.selected=this.fallbackSelection)}},_filterItem:function(e){return!this._excludedLocalNames[e.localName]},_valueToItem:function(e){return null==e?null:this.items[this._valueToIndex(e)]},_valueToIndex:function(e){if(!this.attrForSelected)return Number(e);for(var t,i=0;t=this.items[i];i++)if(this._valueForItem(t)==e)return i},_indexToValue:function(e){if(!this.attrForSelected)return e;var t=this.items[e];return t?this._valueForItem(t):void 0},_valueForItem:function(e){if(!e)return null;if(!this.attrForSelected){var t=this.indexOf(e);return-1===t?null:t}var i=e[dashToCamelCase(this.attrForSelected)];return null!=i?i:e.getAttribute(this.attrForSelected)},_applySelection:function(e,t){this.selectedClass&&this.toggleClass(this.selectedClass,t,e),this.selectedAttribute&&this.toggleAttribute(this.selectedAttribute,t,e),this._selectionChange(),this.fire("iron-"+(t?"select":"deselect"),{item:e})},_selectionChange:function(){this._setSelectedItem(this._selection.get())},_observeItems:function(e){return dom(e).observeNodes(function(e){this._updateItems(),this._updateSelected(),this.fire("iron-items-changed",e,{bubbles:!1,cancelable:!1})})},_activateHandler:function(e){for(var t=e.target,i=this.items;t&&t!=this;){var n=i.indexOf(t);if(n>=0){var s=this._indexToValue(n);return void this._itemActivate(s,t)}t=t.parentNode}},_itemActivate:function(e,t){this.fire("iron-activate",{selected:e,item:t},{cancelable:!0}).defaultPrevented||this.select(e)}},IronMultiSelectableBehaviorImpl={properties:{multi:{type:Boolean,value:!1,observer:"multiChanged"},selectedValues:{type:Array,notify:!0,value:function(){return[]}},selectedItems:{type:Array,readOnly:!0,notify:!0,value:function(){return[]}}},observers:["_updateSelected(selectedValues.splices)"],select:function(e){this.multi?this._toggleSelected(e):this.selected=e},multiChanged:function(e){this._selection.multi=e,this._updateSelected()},get _shouldUpdateSelection(){return null!=this.selected||null!=this.selectedValues&&this.selectedValues.length},_updateAttrForSelected:function(){this.multi?this.selectedItems&&this.selectedItems.length>0&&(this.selectedValues=this.selectedItems.map(function(e){return this._indexToValue(this.indexOf(e))},this).filter(function(e){return null!=e},this)):IronSelectableBehavior._updateAttrForSelected.apply(this)},_updateSelected:function(){this.multi?this._selectMulti(this.selectedValues):this._selectSelected(this.selected)},_selectMulti:function(e){e=e||[];var t=(this._valuesToItems(e)||[]).filter(function(e){return null!=e});this._selection.clear(t);for(var i=0;i<t.length;i++)this._selection.setItemSelected(t[i],!0);this.fallbackSelection&&!this._selection.get().length&&(this._valueToItem(this.fallbackSelection)&&this.select(this.fallbackSelection))},_selectionChange:function(){var e=this._selection.get();this.multi?(this._setSelectedItems(e),this._setSelectedItem(e.length?e[0]:null)):null!=e?(this._setSelectedItems([e]),this._setSelectedItem(e)):(this._setSelectedItems([]),this._setSelectedItem(null))},_toggleSelected:function(e){var t=this.selectedValues.indexOf(e);t<0?this.push("selectedValues",e):this.splice("selectedValues",t,1)},_valuesToItems:function(e){return null==e?null:e.map(function(e){return this._valueToItem(e)},this)}},IronMultiSelectableBehavior=[IronSelectableBehavior,IronMultiSelectableBehaviorImpl],IronMenuBehaviorImpl={properties:{focusedItem:{observer:"_focusedItemChanged",readOnly:!0,type:Object},attrForItemTitle:{type:String},disabled:{type:Boolean,value:!1,observer:"_disabledChanged"}},_MODIFIER_KEYS:["Alt","AltGraph","CapsLock","Control","Fn","FnLock","Hyper","Meta","NumLock","OS","ScrollLock","Shift","Super","Symbol","SymbolLock"],_SEARCH_RESET_TIMEOUT_MS:1e3,_previousTabIndex:0,hostAttributes:{role:"menu"},observers:["_updateMultiselectable(multi)"],listeners:{focus:"_onFocus",keydown:"_onKeydown","iron-items-changed":"_onIronItemsChanged"},keyBindings:{up:"_onUpKey",down:"_onDownKey",esc:"_onEscKey","shift+tab:keydown":"_onShiftTabDown"},attached:function(){this._resetTabindices()},select:function(e){this._defaultFocusAsync&&(this.cancelAsync(this._defaultFocusAsync),this._defaultFocusAsync=null);var t=this._valueToItem(e);t&&t.hasAttribute("disabled")||(this._setFocusedItem(t),IronMultiSelectableBehaviorImpl.select.apply(this,arguments))},_resetTabindices:function(){var e=this.multi?this.selectedItems&&this.selectedItems[0]:this.selectedItem;this.items.forEach(function(t){t.setAttribute("tabindex",t===e?"0":"-1")},this)},_updateMultiselectable:function(e){e?this.setAttribute("aria-multiselectable","true"):this.removeAttribute("aria-multiselectable")},_focusWithKeyboardEvent:function(e){if(-1===this._MODIFIER_KEYS.indexOf(e.key)){this.cancelDebouncer("_clearSearchText");for(var t,i=this._searchText||"",n=(i+=(e.key&&1==e.key.length?e.key:String.fromCharCode(e.keyCode)).toLocaleLowerCase()).length,s=0;t=this.items[s];s++)if(!t.hasAttribute("disabled")){var o=this.attrForItemTitle||"textContent",a=(t[o]||t.getAttribute(o)||"").trim();if(!(a.length<n)&&a.slice(0,n).toLocaleLowerCase()==i){this._setFocusedItem(t);break}}this._searchText=i,this.debounce("_clearSearchText",this._clearSearchText,this._SEARCH_RESET_TIMEOUT_MS)}},_clearSearchText:function(){this._searchText=""},_focusPrevious:function(){for(var e=this.items.length,t=Number(this.indexOf(this.focusedItem)),i=1;i<e+1;i++){var n=this.items[(t-i+e)%e];if(!n.hasAttribute("disabled")){var s=dom(n).getOwnerRoot()||document;if(this._setFocusedItem(n),dom(s).activeElement==n)return}}},_focusNext:function(){for(var e=this.items.length,t=Number(this.indexOf(this.focusedItem)),i=1;i<e+1;i++){var n=this.items[(t+i)%e];if(!n.hasAttribute("disabled")){var s=dom(n).getOwnerRoot()||document;if(this._setFocusedItem(n),dom(s).activeElement==n)return}}},_applySelection:function(e,t){t?e.setAttribute("aria-selected","true"):e.removeAttribute("aria-selected"),IronSelectableBehavior._applySelection.apply(this,arguments)},_focusedItemChanged:function(e,t){t&&t.setAttribute("tabindex","-1"),!e||e.hasAttribute("disabled")||this.disabled||(e.setAttribute("tabindex","0"),e.focus())},_onIronItemsChanged:function(e){e.detail.addedNodes.length&&this._resetTabindices()},_onShiftTabDown:function(e){var t=this.getAttribute("tabindex");IronMenuBehaviorImpl._shiftTabPressed=!0,this._setFocusedItem(null),this.setAttribute("tabindex","-1"),this.async(function(){this.setAttribute("tabindex",t),IronMenuBehaviorImpl._shiftTabPressed=!1},1)},_onFocus:function(e){if(!IronMenuBehaviorImpl._shiftTabPressed){var t=dom(e).rootTarget;(t===this||void 0===t.tabIndex||this.isLightDescendant(t))&&(this._defaultFocusAsync=this.async(function(){var e=this.multi?this.selectedItems&&this.selectedItems[0]:this.selectedItem;this._setFocusedItem(null),e?this._setFocusedItem(e):this.items[0]&&this._focusNext()}))}},_onUpKey:function(e){this._focusPrevious(),e.detail.keyboardEvent.preventDefault()},_onDownKey:function(e){this._focusNext(),e.detail.keyboardEvent.preventDefault()},_onEscKey:function(e){var t=this.focusedItem;t&&t.blur()},_onKeydown:function(e){this.keyboardEventMatchesKeys(e,"up down esc")||this._focusWithKeyboardEvent(e),e.stopPropagation()},_activateHandler:function(e){IronSelectableBehavior._activateHandler.call(this,e),e.stopPropagation()},_disabledChanged:function(e){e?(this._previousTabIndex=this.hasAttribute("tabindex")?this.tabIndex:0,this.removeAttribute("tabindex")):this.hasAttribute("tabindex")||this.setAttribute("tabindex",this._previousTabIndex)},_shiftTabPressed:!1},IronMenuBehavior=[IronMultiSelectableBehavior,IronA11yKeysBehavior,IronMenuBehaviorImpl];Polymer$1({_template:html`
    <style>
      :host {
        display: block;
        padding: 8px 0;

        background: var(--paper-listbox-background-color, var(--primary-background-color));
        color: var(--paper-listbox-color, var(--primary-text-color));

        @apply --paper-listbox;
      }
    </style>

    <slot></slot>
`,is:"paper-listbox",behaviors:[IronMenuBehavior],hostAttributes:{role:"listbox"}});const $_documentContainer$1=document.createElement("template");$_documentContainer$1.setAttribute("style","display: none;"),$_documentContainer$1.innerHTML="<dom-module id=\"paper-item-shared-styles\">\n  <template>\n    <style>\n      :host, .paper-item {\n        display: block;\n        position: relative;\n        min-height: var(--paper-item-min-height, 48px);\n        padding: 0px 16px;\n      }\n\n      .paper-item {\n        @apply --paper-font-subhead;\n        border:none;\n        outline: none;\n        background: white;\n        width: 100%;\n        text-align: left;\n      }\n\n      :host([hidden]), .paper-item[hidden] {\n        display: none !important;\n      }\n\n      :host(.iron-selected), .paper-item.iron-selected {\n        font-weight: var(--paper-item-selected-weight, bold);\n\n        @apply --paper-item-selected;\n      }\n\n      :host([disabled]), .paper-item[disabled] {\n        color: var(--paper-item-disabled-color, var(--disabled-text-color));\n\n        @apply --paper-item-disabled;\n      }\n\n      :host(:focus), .paper-item:focus {\n        position: relative;\n        outline: 0;\n\n        @apply --paper-item-focused;\n      }\n\n      :host(:focus):before, .paper-item:focus:before {\n        @apply --layout-fit;\n\n        background: currentColor;\n        content: '';\n        opacity: var(--dark-divider-opacity);\n        pointer-events: none;\n\n        @apply --paper-item-focused-before;\n      }\n    </style>\n  </template>\n</dom-module>",document.head.appendChild($_documentContainer$1.content);const PaperItemBehaviorImpl={hostAttributes:{role:"option",tabindex:"0"}},PaperItemBehavior=[IronButtonState,IronControlState,PaperItemBehaviorImpl];Polymer$1({_template:html`
    <style include="paper-item-shared-styles">
      :host {
        @apply --layout-horizontal;
        @apply --layout-center;
        @apply --paper-font-subhead;

        @apply --paper-item;
      }
    </style>
    <slot></slot>
`,is:"paper-item",behaviors:[PaperItemBehavior]}),Polymer$1({is:"iron-iconset-svg",properties:{name:{type:String,observer:"_nameChanged"},size:{type:Number,value:24},rtlMirroring:{type:Boolean,value:!1},useGlobalRtlAttribute:{type:Boolean,value:!1}},created:function(){this._meta=new IronMeta({type:"iconset",key:null,value:null})},attached:function(){this.style.display="none"},getIconNames:function(){return this._icons=this._createIconMap(),Object.keys(this._icons).map(function(e){return this.name+":"+e},this)},applyIcon:function(e,t){this.removeIcon(e);var i=this._cloneIcon(t,this.rtlMirroring&&this._targetIsRTL(e));if(i){var n=dom(e.root||e);return n.insertBefore(i,n.childNodes[0]),e._svgIcon=i}return null},removeIcon:function(e){e._svgIcon&&(dom(e.root||e).removeChild(e._svgIcon),e._svgIcon=null)},_targetIsRTL:function(e){if(null==this.__targetIsRTL)if(this.useGlobalRtlAttribute){var t=document.body&&document.body.hasAttribute("dir")?document.body:document.documentElement;this.__targetIsRTL="rtl"===t.getAttribute("dir")}else e&&e.nodeType!==Node.ELEMENT_NODE&&(e=e.host),this.__targetIsRTL=e&&"rtl"===window.getComputedStyle(e).direction;return this.__targetIsRTL},_nameChanged:function(){this._meta.value=null,this._meta.key=this.name,this._meta.value=this,this.async(function(){this.fire("iron-iconset-added",this,{node:window})})},_createIconMap:function(){var e=Object.create(null);return dom(this).querySelectorAll("[id]").forEach(function(t){e[t.id]=t}),e},_cloneIcon:function(e,t){return this._icons=this._icons||this._createIconMap(),this._prepareSvgClone(this._icons[e],this.size,t)},_prepareSvgClone:function(e,t,i){if(e){var n=e.cloneNode(!0),s=document.createElementNS("http://www.w3.org/2000/svg","svg"),o=n.getAttribute("viewBox")||"0 0 "+t+" "+t,a="pointer-events: none; display: block; width: 100%; height: 100%;";return i&&n.hasAttribute("mirror-in-rtl")&&(a+="-webkit-transform:scale(-1,1);transform:scale(-1,1);transform-origin:center;"),s.setAttribute("viewBox",o),s.setAttribute("preserveAspectRatio","xMidYMid meet"),s.setAttribute("focusable","false"),s.style.cssText=a,s.appendChild(n).removeAttribute("id"),s}return null}});const template$9=html`<iron-iconset-svg name="icons" size="24">
<svg><defs>
<g id="3d-rotation"><path d="M7.52 21.48C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32zm.89-6.52c-.19 0-.37-.03-.52-.08-.16-.06-.29-.13-.4-.24-.11-.1-.2-.22-.26-.37-.06-.14-.09-.3-.09-.47h-1.3c0 .36.07.68.21.95.14.27.33.5.56.69.24.18.51.32.82.41.3.1.62.15.96.15.37 0 .72-.05 1.03-.15.32-.1.6-.25.83-.44s.42-.43.55-.72c.13-.29.2-.61.2-.97 0-.19-.02-.38-.07-.56-.05-.18-.12-.35-.23-.51-.1-.16-.24-.3-.4-.43-.17-.13-.37-.23-.61-.31.2-.09.37-.2.52-.33.15-.13.27-.27.37-.42.1-.15.17-.3.22-.46.05-.16.07-.32.07-.48 0-.36-.06-.68-.18-.96-.12-.28-.29-.51-.51-.69-.2-.19-.47-.33-.77-.43C9.1 8.05 8.76 8 8.39 8c-.36 0-.69.05-1 .16-.3.11-.57.26-.79.45-.21.19-.38.41-.51.67-.12.26-.18.54-.18.85h1.3c0-.17.03-.32.09-.45s.14-.25.25-.34c.11-.09.23-.17.38-.22.15-.05.3-.08.48-.08.4 0 .7.1.89.31.19.2.29.49.29.86 0 .18-.03.34-.08.49-.05.15-.14.27-.25.37-.11.1-.25.18-.41.24-.16.06-.36.09-.58.09H7.5v1.03h.77c.22 0 .42.02.6.07s.33.13.45.23c.12.11.22.24.29.4.07.16.1.35.1.57 0 .41-.12.72-.35.93-.23.23-.55.33-.95.33zm8.55-5.92c-.32-.33-.7-.59-1.14-.77-.43-.18-.92-.27-1.46-.27H12v8h2.3c.55 0 1.06-.09 1.51-.27.45-.18.84-.43 1.16-.76.32-.33.57-.73.74-1.19.17-.47.26-.99.26-1.57v-.4c0-.58-.09-1.1-.26-1.57-.18-.47-.43-.87-.75-1.2zm-.39 3.16c0 .42-.05.79-.14 1.13-.1.33-.24.62-.43.85-.19.23-.43.41-.71.53-.29.12-.62.18-.99.18h-.91V9.12h.97c.72 0 1.27.23 1.64.69.38.46.57 1.12.57 1.99v.4zM12 0l-.66.03 3.81 3.81 1.33-1.33c3.27 1.55 5.61 4.72 5.96 8.48h1.5C23.44 4.84 18.29 0 12 0z"></path></g>
<g id="accessibility"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"></path></g>
<g id="accessible"><circle cx="12" cy="4" r="2"></circle><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"></path></g>
<g id="account-balance"><path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"></path></g>
<g id="account-balance-wallet"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g>
<g id="account-box"><path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"></path></g>
<g id="account-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></g>
<g id="add"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></g>
<g id="add-alert"><path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12zM16 13.01h-3v3h-2v-3H8V11h3V8h2v3h3v2.01z"></path></g>
<g id="add-box"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></g>
<g id="add-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></g>
<g id="add-circle-outline"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
<g id="add-shopping-cart"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"></path></g>
<g id="alarm"><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path></g>
<g id="alarm-add"><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"></path></g>
<g id="alarm-off"><path d="M12 6c3.87 0 7 3.13 7 7 0 .84-.16 1.65-.43 2.4l1.52 1.52c.58-1.19.91-2.51.91-3.92 0-4.97-4.03-9-9-9-1.41 0-2.73.33-3.92.91L9.6 6.43C10.35 6.16 11.16 6 12 6zm10-.28l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM2.92 2.29L1.65 3.57 2.98 4.9l-1.11.93 1.42 1.42 1.11-.94.8.8C3.83 8.69 3 10.75 3 13c0 4.97 4.02 9 9 9 2.25 0 4.31-.83 5.89-2.2l2.2 2.2 1.27-1.27L3.89 3.27l-.97-.98zm13.55 16.1C15.26 19.39 13.7 20 12 20c-3.87 0-7-3.13-7-7 0-1.7.61-3.26 1.61-4.47l9.86 9.86zM8.02 3.28L6.6 1.86l-.86.71 1.42 1.42.86-.71z"></path></g>
<g id="alarm-on"><path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-1.46-5.47L8.41 12.4l-1.06 1.06 3.18 3.18 6-6-1.06-1.06-4.93 4.95z"></path></g>
<g id="all-out"><path d="M16.21 4.16l4 4v-4zm4 12l-4 4h4zm-12 4l-4-4v4zm-4-12l4-4h-4zm12.95-.95c-2.73-2.73-7.17-2.73-9.9 0s-2.73 7.17 0 9.9 7.17 2.73 9.9 0 2.73-7.16 0-9.9zm-1.1 8.8c-2.13 2.13-5.57 2.13-7.7 0s-2.13-5.57 0-7.7 5.57-2.13 7.7 0 2.13 5.57 0 7.7z"></path></g>
<g id="android"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"></path></g>
<g id="announcement"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"></path></g>
<g id="apps"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></g>
<g id="archive"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"></path></g>
<g id="arrow-back"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></g>
<g id="arrow-downward"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path></g>
<g id="arrow-drop-down"><path d="M7 10l5 5 5-5z"></path></g>
<g id="arrow-drop-down-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 12l-4-4h8l-4 4z"></path></g>
<g id="arrow-drop-up"><path d="M7 14l5-5 5 5z"></path></g>
<g id="arrow-forward"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></g>
<g id="arrow-upward"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path></g>
<g id="aspect-ratio"><path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"></path></g>
<g id="assessment"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path></g>
<g id="assignment"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g>
<g id="assignment-ind"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"></path></g>
<g id="assignment-late"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 15h-2v-2h2v2zm0-4h-2V8h2v6zm-1-9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></g>
<g id="assignment-return"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-4v3l-5-5 5-5v3h4v4z"></path></g>
<g id="assignment-returned"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15l-5-5h3V9h4v4h3l-5 5z"></path></g>
<g id="assignment-turned-in"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path></g>
<g id="attachment"><path d="M2 12.5C2 9.46 4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4H9.5C8.12 15 7 13.88 7 12.5S8.12 10 9.5 10H17v2H9.41c-.55 0-.55 1 0 1H18c1.1 0 2-.9 2-2s-.9-2-2-2H7.5C5.57 9 4 10.57 4 12.5S5.57 16 7.5 16H17v2H7.5C4.46 18 2 15.54 2 12.5z"></path></g>
<g id="autorenew"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"></path></g>
<g id="backspace"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"></path></g>
<g id="backup"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></g>
<g id="block"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"></path></g>
<g id="book"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path></g>
<g id="bookmark"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></g>
<g id="bookmark-border"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"></path></g>
<g id="bug-report"><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"></path></g>
<g id="build"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g>
<g id="cached"><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"></path></g>
<g id="camera-enhance"><path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-1l1.25-2.75L16 13l-2.75-1.25L12 9l-1.25 2.75L8 13l2.75 1.25z"></path></g>
<g id="cancel"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></g>
<g id="card-giftcard"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"></path></g>
<g id="card-membership"><path d="M20 2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h4v5l4-2 4 2v-5h4c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2zm0 13H4v-2h16v2zm0-5H4V4h16v6z"></path></g>
<g id="card-travel"><path d="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4h6v2H9V4zm11 15H4v-2h16v2zm0-5H4V8h3v2h2V8h6v2h2V8h3v6z"></path></g>
<g id="change-history"><path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"></path></g>
<g id="check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></g>
<g id="check-box"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></g>
<g id="check-box-outline-blank"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></g>
<g id="check-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></g>
<g id="chevron-left"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></g>
<g id="chevron-right"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></g>
<g id="chrome-reader-mode"><path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"></path></g>
<g id="class"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"></path></g>
<g id="clear"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g>
<g id="close"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g>
<g id="cloud"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"></path></g>
<g id="cloud-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H8c-1.66 0-3-1.34-3-3s1.34-3 3-3l.14.01C8.58 8.28 10.13 7 12 7c2.21 0 4 1.79 4 4h.5c1.38 0 2.5 1.12 2.5 2.5S17.88 16 16.5 16z"></path></g>
<g id="cloud-done"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z"></path></g>
<g id="cloud-download"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"></path></g>
<g id="cloud-off"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z"></path></g>
<g id="cloud-queue"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"></path></g>
<g id="cloud-upload"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path></g>
<g id="code"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></g>
<g id="compare-arrows"><path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"></path></g>
<g id="content-copy"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></g>
<g id="content-cut"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"></path></g>
<g id="content-paste"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"></path></g>
<g id="copyright"><path d="M10.08 10.86c.05-.33.16-.62.3-.87s.34-.46.59-.62c.24-.15.54-.22.91-.23.23.01.44.05.63.13.2.09.38.21.52.36s.25.33.34.53.13.42.14.64h1.79c-.02-.47-.11-.9-.28-1.29s-.4-.73-.7-1.01-.66-.5-1.08-.66-.88-.23-1.39-.23c-.65 0-1.22.11-1.7.34s-.88.53-1.2.92-.56.84-.71 1.36S8 11.29 8 11.87v.27c0 .58.08 1.12.23 1.64s.39.97.71 1.35.72.69 1.2.91 1.05.34 1.7.34c.47 0 .91-.08 1.32-.23s.77-.36 1.08-.63.56-.58.74-.94.29-.74.3-1.15h-1.79c-.01.21-.06.4-.15.58s-.21.33-.36.46-.32.23-.52.3c-.19.07-.39.09-.6.1-.36-.01-.66-.08-.89-.23-.25-.16-.45-.37-.59-.62s-.25-.55-.3-.88-.08-.67-.08-1v-.27c0-.35.03-.68.08-1.01zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
<g id="create"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></g>
<g id="create-new-folder"><path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z"></path></g>
<g id="credit-card"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"></path></g>
<g id="dashboard"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path></g>
<g id="date-range"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path></g>
<g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g>
<g id="delete-forever"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></g>
<g id="delete-sweep"><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z"></path></g>
<g id="description"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></g>
<g id="dns"><path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></g>
<g id="done"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></g>
<g id="done-all"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"></path></g>
<g id="donut-large"><path d="M11 5.08V2c-5 .5-9 4.81-9 10s4 9.5 9 10v-3.08c-3-.48-6-3.4-6-6.92s3-6.44 6-6.92zM18.97 11H22c-.47-5-4-8.53-9-9v3.08C16 5.51 18.54 8 18.97 11zM13 18.92V22c5-.47 8.53-4 9-9h-3.03c-.43 3-2.97 5.49-5.97 5.92z"></path></g>
<g id="donut-small"><path d="M11 9.16V2c-5 .5-9 4.79-9 10s4 9.5 9 10v-7.16c-1-.41-2-1.52-2-2.84s1-2.43 2-2.84zM14.86 11H22c-.48-4.75-4-8.53-9-9v7.16c1 .3 1.52.98 1.86 1.84zM13 14.84V22c5-.47 8.52-4.25 9-9h-7.14c-.34.86-.86 1.54-1.86 1.84z"></path></g>
<g id="drafts"><path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z"></path></g>
<g id="eject"><path d="M5 17h14v2H5zm7-12L5.33 15h13.34z"></path></g>
<g id="error"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></g>
<g id="error-outline"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></g>
<g id="euro-symbol"><path d="M15 18.5c-2.51 0-4.68-1.42-5.76-3.5H15v-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15V9H9.24C10.32 6.92 12.5 5.5 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3C19.41 3.87 17.3 3 15 3c-3.92 0-7.24 2.51-8.48 6H3v2h3.06c-.04.33-.06.66-.06 1 0 .34.02.67.06 1H3v2h3.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z"></path></g>
<g id="event"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"></path></g>
<g id="event-seat"><path d="M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3zM2 10h3v3H2zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"></path></g>
<g id="exit-to-app"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></g>
<g id="expand-less"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path></g>
<g id="expand-more"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g>
<g id="explore"><path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"></path></g>
<g id="extension"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"></path></g>
<g id="face"><path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"></path></g>
<g id="favorite"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></g>
<g id="favorite-border"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path></g>
<g id="feedback"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"></path></g>
<g id="file-download"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g>
<g id="file-upload"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"></path></g>
<g id="filter-list"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></g>
<g id="find-in-page"><path d="M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"></path></g>
<g id="find-replace"><path d="M11 6c1.38 0 2.63.56 3.54 1.46L12 10h6V4l-2.05 2.05C14.68 4.78 12.93 4 11 4c-3.53 0-6.43 2.61-6.92 6H6.1c.46-2.28 2.48-4 4.9-4zm5.64 9.14c.66-.9 1.12-1.97 1.28-3.14H15.9c-.46 2.28-2.48 4-4.9 4-1.38 0-2.63-.56-3.54-1.46L10 12H4v6l2.05-2.05C7.32 17.22 9.07 18 11 18c1.55 0 2.98-.51 4.14-1.36L20 21.49 21.49 20l-4.85-4.86z"></path></g>
<g id="fingerprint"><path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"></path></g>
<g id="first-page"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path></g>
<g id="flag"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"></path></g>
<g id="flight-land"><path d="M2.5 19h19v2h-19zm7.18-5.73l4.35 1.16 5.31 1.42c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-5.31-1.42-2.76-9.02L10.12 2v8.28L5.15 8.95l-.93-2.32-1.45-.39v5.17l1.6.43 5.31 1.43z"></path></g>
<g id="flight-takeoff"><path d="M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77 1.33 1.6-.43 5.31-1.42 4.35-1.16L21 11.49c.81-.23 1.28-1.05 1.07-1.85z"></path></g>
<g id="flip-to-back"><path d="M9 7H7v2h2V7zm0 4H7v2h2v-2zm0-8c-1.11 0-2 .9-2 2h2V3zm4 12h-2v2h2v-2zm6-12v2h2c0-1.1-.9-2-2-2zm-6 0h-2v2h2V3zM9 17v-2H7c0 1.1.89 2 2 2zm10-4h2v-2h-2v2zm0-4h2V7h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zM5 7H3v12c0 1.1.89 2 2 2h12v-2H5V7zm10-2h2V3h-2v2zm0 12h2v-2h-2v2z"></path></g>
<g id="flip-to-front"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm2 4v-2H3c0 1.1.89 2 2 2zM3 9h2V7H3v2zm12 12h2v-2h-2v2zm4-18H9c-1.11 0-2 .9-2 2v10c0 1.1.89 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H9V5h10v10zm-8 6h2v-2h-2v2zm-4 0h2v-2H7v2z"></path></g>
<g id="folder"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></g>
<g id="folder-open"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"></path></g>
<g id="folder-shared"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"></path></g>
<g id="font-download"><path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"></path></g>
<g id="forward"><path d="M12 8V4l8 8-8 8v-4H4V8z"></path></g>
<g id="fullscreen"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></g>
<g id="fullscreen-exit"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></g>
<g id="g-translate"><path d="M20 5h-9.12L10 2H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h7l1 3h8c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM7.17 14.59c-2.25 0-4.09-1.83-4.09-4.09s1.83-4.09 4.09-4.09c1.04 0 1.99.37 2.74 1.07l.07.06-1.23 1.18-.06-.05c-.29-.27-.78-.59-1.52-.59-1.31 0-2.38 1.09-2.38 2.42s1.07 2.42 2.38 2.42c1.37 0 1.96-.87 2.12-1.46H7.08V9.91h3.95l.01.07c.04.21.05.4.05.61 0 2.35-1.61 4-3.92 4zm6.03-1.71c.33.6.74 1.18 1.19 1.7l-.54.53-.65-2.23zm.77-.76h-.99l-.31-1.04h3.99s-.34 1.31-1.56 2.74c-.52-.62-.89-1.23-1.13-1.7zM21 20c0 .55-.45 1-1 1h-7l2-2-.81-2.77.92-.92L17.79 18l.73-.73-2.71-2.68c.9-1.03 1.6-2.25 1.92-3.51H19v-1.04h-3.64V9h-1.04v1.04h-1.96L11.18 6H20c.55 0 1 .45 1 1v13z"></path></g>
<g id="gavel"><path d="M1 21h12v2H1zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828zM12.317 1l5.657 5.656-2.83 2.83-5.654-5.66zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z"></path></g>
<g id="gesture"><path d="M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z"></path></g>
<g id="get-app"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g>
<g id="gif"><path d="M11.5 9H13v6h-1.5zM9 9H6c-.6 0-1 .5-1 1v4c0 .5.4 1 1 1h3c.6 0 1-.5 1-1v-2H8.5v1.5h-2v-3H10V10c0-.5-.4-1-1-1zm10 1.5V9h-4.5v6H16v-2h2v-1.5h-2v-1z"></path></g>
<g id="grade"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></g>
<g id="group-work"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></g>
<g id="help"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path></g>
<g id="help-outline"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path></g>
<g id="highlight-off"><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
<g id="history"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></g>
<g id="home"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></g>
<g id="hourglass-empty"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"></path></g>
<g id="hourglass-full"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"></path></g>
<g id="http"><path d="M4.5 11h-2V9H1v6h1.5v-2.5h2V15H6V9H4.5v2zm2.5-.5h1.5V15H10v-4.5h1.5V9H7v1.5zm5.5 0H14V15h1.5v-4.5H17V9h-4.5v1.5zm9-1.5H18v6h1.5v-2h2c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5zm0 2.5h-2v-1h2v1z"></path></g>
<g id="https"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></g>
<g id="important-devices"><path d="M23 11.01L18 11c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5c.55 0 1-.45 1-1v-9c0-.55-.45-.99-1-.99zM23 20h-5v-7h5v7zM20 2H2C.89 2 0 2.89 0 4v12c0 1.1.89 2 2 2h7v2H7v2h8v-2h-2v-2h2v-2H2V4h18v5h2V4c0-1.11-.9-2-2-2zm-8.03 7L11 6l-.97 3H7l2.47 1.76-.94 2.91 2.47-1.8 2.47 1.8-.94-2.91L15 9h-3.03z"></path></g>
<g id="inbox"><path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"></path></g>
<g id="indeterminate-check-box"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"></path></g>
<g id="info"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></g>
<g id="info-outline"><path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"></path></g>
<g id="input"><path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2-2zM11 16l4-4-4-4v3H1v2h10v3z"></path></g>
<g id="invert-colors"><path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"></path></g>
<g id="label"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"></path></g>
<g id="label-outline"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16zM16 17H5V7h11l3.55 5L16 17z"></path></g>
<g id="language"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path></g>
<g id="last-page"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path></g>
<g id="launch"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></g>
<g id="lightbulb-outline"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"></path></g>
<g id="line-style"><path d="M3 16h5v-2H3v2zm6.5 0h5v-2h-5v2zm6.5 0h5v-2h-5v2zM3 20h2v-2H3v2zm4 0h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zM3 12h8v-2H3v2zm10 0h8v-2h-8v2zM3 4v4h18V4H3z"></path></g>
<g id="line-weight"><path d="M3 17h18v-2H3v2zm0 3h18v-1H3v1zm0-7h18v-3H3v3zm0-9v4h18V4H3z"></path></g>
<g id="link"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></g>
<g id="list"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"></path></g>
<g id="lock"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></g>
<g id="lock-open"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"></path></g>
<g id="lock-outline"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z"></path></g>
<g id="low-priority"><path d="M14 5h8v2h-8zm0 5.5h8v2h-8zm0 5.5h8v2h-8zM2 11.5C2 15.08 4.92 18 8.5 18H9v2l3-3-3-3v2h-.5C6.02 16 4 13.98 4 11.5S6.02 7 8.5 7H12V5H8.5C4.92 5 2 7.92 2 11.5z"></path></g>
<g id="loyalty"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7zm11.77 8.27L13 19.54l-4.27-4.27C8.28 14.81 8 14.19 8 13.5c0-1.38 1.12-2.5 2.5-2.5.69 0 1.32.28 1.77.74l.73.72.73-.73c.45-.45 1.08-.73 1.77-.73 1.38 0 2.5 1.12 2.5 2.5 0 .69-.28 1.32-.73 1.77z"></path></g>
<g id="mail"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></g>
<g id="markunread"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></g>
<g id="markunread-mailbox"><path d="M20 6H10v6H8V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"></path></g>
<g id="menu"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g>
<g id="more-horiz"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g>
<g id="more-vert"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g>
<g id="motorcycle"><path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l2.77-2.77c-.21.54-.32 1.14-.32 1.77 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97zM7.82 15C7.4 16.15 6.28 17 5 17c-1.63 0-3-1.37-3-3s1.37-3 3-3c1.28 0 2.4.85 2.82 2H5v2h2.82zM19 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path></g>
<g id="move-to-inbox"><path d="M19 3H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10zm-3-5h-2V7h-4v3H8l4 4 4-4z"></path></g>
<g id="next-week"><path d="M20 7h-4V5c0-.55-.22-1.05-.59-1.41C15.05 3.22 14.55 3 14 3h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm1 13.5l-1-1 3-3-3-3 1-1 4 4-4 4z"></path></g>
<g id="note-add"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"></path></g>
<g id="offline-pin"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 16H7v-2h10v2zm-6.7-4L7 10.7l1.4-1.4 1.9 1.9 5.3-5.3L17 7.3 10.3 14z"></path></g>
<g id="opacity"><path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"></path></g>
<g id="open-in-browser"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z"></path></g>
<g id="open-in-new"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></g>
<g id="open-with"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></g>
<g id="pageview"><path d="M11.5 9C10.12 9 9 10.12 9 11.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5S12.88 9 11.5 9zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-3.21 14.21l-2.91-2.91c-.69.44-1.51.7-2.39.7C9.01 16 7 13.99 7 11.5S9.01 7 11.5 7 16 9.01 16 11.5c0 .88-.26 1.69-.7 2.39l2.91 2.9-1.42 1.42z"></path></g>
<g id="pan-tool"><path d="M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83s1.26-1.23 1.3-1.25c.22-.19.49-.29.79-.29.22 0 .42.06.6.16.04.01 4.31 2.46 4.31 2.46V4c0-.83.67-1.5 1.5-1.5S11 3.17 11 4v7h1V1.5c0-.83.67-1.5 1.5-1.5S15 .67 15 1.5V11h1V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h1V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z"></path></g>
<g id="payment"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"></path></g>
<g id="perm-camera-mic"><path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v-2.09c-2.83-.48-5-2.94-5-5.91h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2c0 2.97-2.17 5.43-5 5.91V21h7c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-6 8c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2v4z"></path></g>
<g id="perm-contact-calendar"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z"></path></g>
<g id="perm-data-setting"><path d="M18.99 11.5c.34 0 .67.03 1 .07L20 0 0 20h11.56c-.04-.33-.07-.66-.07-1 0-4.14 3.36-7.5 7.5-7.5zm3.71 7.99c.02-.16.04-.32.04-.49 0-.17-.01-.33-.04-.49l1.06-.83c.09-.08.12-.21.06-.32l-1-1.73c-.06-.11-.19-.15-.31-.11l-1.24.5c-.26-.2-.54-.37-.85-.49l-.19-1.32c-.01-.12-.12-.21-.24-.21h-2c-.12 0-.23.09-.25.21l-.19 1.32c-.3.13-.59.29-.85.49l-1.24-.5c-.11-.04-.24 0-.31.11l-1 1.73c-.06.11-.04.24.06.32l1.06.83c-.02.16-.03.32-.03.49 0 .17.01.33.03.49l-1.06.83c-.09.08-.12.21-.06.32l1 1.73c.06.11.19.15.31.11l1.24-.5c.26.2.54.37.85.49l.19 1.32c.02.12.12.21.25.21h2c.12 0 .23-.09.25-.21l.19-1.32c.3-.13.59-.29.84-.49l1.25.5c.11.04.24 0 .31-.11l1-1.73c.06-.11.03-.24-.06-.32l-1.07-.83zm-3.71 1.01c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g>
<g id="perm-device-information"><path d="M13 7h-2v2h2V7zm0 4h-2v6h2v-6zm4-9.99L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></g>
<g id="perm-identity"><path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"></path></g>
<g id="perm-media"><path d="M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6zm20-2h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 15l4.5-6 3.5 4.51 2.5-3.01L21 15H7z"></path></g>
<g id="perm-phone-msg"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM12 3v10l3-3h6V3h-9z"></path></g>
<g id="perm-scan-wifi"><path d="M12 3C6.95 3 3.15 4.85 0 7.23L12 22 24 7.25C20.85 4.87 17.05 3 12 3zm1 13h-2v-6h2v6zm-2-8V6h2v2h-2z"></path></g>
<g id="pets"><circle cx="4.5" cy="9.5" r="2.5"></circle><circle cx="9" cy="5.5" r="2.5"></circle><circle cx="15" cy="5.5" r="2.5"></circle><circle cx="19.5" cy="9.5" r="2.5"></circle><path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z"></path></g>
<g id="picture-in-picture"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"></path></g>
<g id="picture-in-picture-alt"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"></path></g>
<g id="play-for-work"><path d="M11 5v5.59H7.5l4.5 4.5 4.5-4.5H13V5h-2zm-5 9c0 3.31 2.69 6 6 6s6-2.69 6-6h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H6z"></path></g>
<g id="polymer"><path d="M19 4h-4L7.11 16.63 4.5 12 9 4H5L.5 12 5 20h4l7.89-12.63L19.5 12 15 20h4l4.5-8z"></path></g>
<g id="power-settings-new"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path></g>
<g id="pregnant-woman"><path d="M9 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm7 9c-.01-1.34-.83-2.51-2-3 0-1.66-1.34-3-3-3s-3 1.34-3 3v7h2v5h3v-5h3v-4z"></path></g>
<g id="print"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"></path></g>
<g id="query-builder"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></g>
<g id="question-answer"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></g>
<g id="radio-button-checked"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></g>
<g id="radio-button-unchecked"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></g>
<g id="receipt"><path d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"></path></g>
<g id="record-voice-over"><circle cx="9" cy="9" r="4"></circle><path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.76-9.64l-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z"></path></g>
<g id="redeem"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"></path></g>
<g id="redo"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"></path></g>
<g id="refresh"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></g>
<g id="remove"><path d="M19 13H5v-2h14v2z"></path></g>
<g id="remove-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"></path></g>
<g id="remove-circle-outline"><path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
<g id="remove-shopping-cart"><path d="M22.73 22.73L2.77 2.77 2 2l-.73-.73L0 2.54l4.39 4.39 2.21 4.66-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h7.46l1.38 1.38c-.5.36-.83.95-.83 1.62 0 1.1.89 2 1.99 2 .67 0 1.26-.33 1.62-.84L21.46 24l1.27-1.27zM7.42 15c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h2.36l2 2H7.42zm8.13-2c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H6.54l9.01 9zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2z"></path></g>
<g id="reorder"><path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"></path></g>
<g id="reply"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path></g>
<g id="reply-all"><path d="M7 8V5l-7 7 7 7v-3l-4-4 4-4zm6 1V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path></g>
<g id="report"><path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"></path></g>
<g id="report-problem"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g>
<g id="restore"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></g>
<g id="restore-page"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l1.6 1.6h-4V9l1.3 1.3C8.69 8.92 10.23 8 12 8c2.76 0 5 2.24 5 5s-2.24 5-5 5z"></path></g>
<g id="room"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></g>
<g id="rounded-corner"><path d="M19 19h2v2h-2v-2zm0-2h2v-2h-2v2zM3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm0-4h2V3H3v2zm4 0h2V3H7v2zm8 16h2v-2h-2v2zm-4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm-8 0h2v-2H7v2zm-4 0h2v-2H3v2zM21 8c0-2.76-2.24-5-5-5h-5v2h5c1.65 0 3 1.35 3 3v5h2V8z"></path></g>
<g id="rowing"><path d="M8.5 14.5L4 19l1.5 1.5L9 17h2l-2.5-2.5zM15 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 20.01L18 24l-2.99-3.01V19.5l-7.1-7.09c-.31.05-.61.07-.91.07v-2.16c1.66.03 3.61-.87 4.67-2.04l1.4-1.55c.19-.21.43-.38.69-.5.29-.14.62-.23.96-.23h.03C15.99 6.01 17 7.02 17 8.26v5.75c0 .84-.35 1.61-.92 2.16l-3.58-3.58v-2.27c-.63.52-1.43 1.02-2.29 1.39L16.5 18H18l3 3.01z"></path></g>
<g id="save"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></g>
<g id="schedule"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></g>
<g id="search"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></g>
<g id="select-all"><path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2zM7 17h10V7H7v10zm2-8h6v6H9V9z"></path></g>
<g id="send"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></g>
<g id="settings"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g>
<g id="settings-applications"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7-7H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-1.75 9c0 .23-.02.46-.05.68l1.48 1.16c.13.11.17.3.08.45l-1.4 2.42c-.09.15-.27.21-.43.15l-1.74-.7c-.36.28-.76.51-1.18.69l-.26 1.85c-.03.17-.18.3-.35.3h-2.8c-.17 0-.32-.13-.35-.29l-.26-1.85c-.43-.18-.82-.41-1.18-.69l-1.74.7c-.16.06-.34 0-.43-.15l-1.4-2.42c-.09-.15-.05-.34.08-.45l1.48-1.16c-.03-.23-.05-.46-.05-.69 0-.23.02-.46.05-.68l-1.48-1.16c-.13-.11-.17-.3-.08-.45l1.4-2.42c.09-.15.27-.21.43-.15l1.74.7c.36-.28.76-.51 1.18-.69l.26-1.85c.03-.17.18-.3.35-.3h2.8c.17 0 .32.13.35.29l.26 1.85c.43.18.82.41 1.18.69l1.74-.7c.16-.06.34 0 .43.15l1.4 2.42c.09.15.05.34-.08.45l-1.48 1.16c.03.23.05.46.05.69z"></path></g>
<g id="settings-backup-restore"><path d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2-9c-4.97 0-9 4.03-9 9H0l4 4 4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44C8.04 20.3 9.94 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"></path></g>
<g id="settings-bluetooth"><path d="M11 24h2v-2h-2v2zm-4 0h2v-2H7v2zm8 0h2v-2h-2v2zm2.71-18.29L12 0h-1v7.59L6.41 3 5 4.41 10.59 10 5 15.59 6.41 17 11 12.41V20h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 3.83l1.88 1.88L13 7.59V3.83zm1.88 10.46L13 16.17v-3.76l1.88 1.88z"></path></g>
<g id="settings-brightness"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02zM8 16h2.5l1.5 1.5 1.5-1.5H16v-2.5l1.5-1.5-1.5-1.5V8h-2.5L12 6.5 10.5 8H8v2.5L6.5 12 8 13.5V16zm4-7c1.66 0 3 1.34 3 3s-1.34 3-3 3V9z"></path></g>
<g id="settings-cell"><path d="M7 24h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zM16 .01L8 0C6.9 0 6 .9 6 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V2c0-1.1-.9-1.99-2-1.99zM16 16H8V4h8v12z"></path></g>
<g id="settings-ethernet"><path d="M7.77 6.76L6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52l-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"></path></g>
<g id="settings-input-antenna"><path d="M12 5c-3.87 0-7 3.13-7 7h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-3.87-3.13-7-7-7zm1 9.29c.88-.39 1.5-1.26 1.5-2.29 0-1.38-1.12-2.5-2.5-2.5S9.5 10.62 9.5 12c0 1.02.62 1.9 1.5 2.29v3.3L7.59 21 9 22.41l3-3 3 3L16.41 21 13 17.59v-3.3zM12 1C5.93 1 1 5.93 1 12h2c0-4.97 4.03-9 9-9s9 4.03 9 9h2c0-6.07-4.93-11-11-11z"></path></g>
<g id="settings-input-component"><path d="M5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H1v6h6V6H5V2zm4 14c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2H9v2zm-8 0c0 1.3.84 2.4 2 2.82V23h2v-4.18C6.16 18.4 7 17.3 7 16v-2H1v2zM21 6V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v6h6V6h-2zm-8-4c0-.55-.45-1-1-1s-1 .45-1 1v4H9v6h6V6h-2V2zm4 14c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2h-6v2z"></path></g>
<g id="settings-input-composite"><path d="M5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H1v6h6V6H5V2zm4 14c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2H9v2zm-8 0c0 1.3.84 2.4 2 2.82V23h2v-4.18C6.16 18.4 7 17.3 7 16v-2H1v2zM21 6V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v6h6V6h-2zm-8-4c0-.55-.45-1-1-1s-1 .45-1 1v4H9v6h6V6h-2V2zm4 14c0 1.3.84 2.4 2 2.82V23h2v-4.18c1.16-.41 2-1.51 2-2.82v-2h-6v2z"></path></g>
<g id="settings-input-hdmi"><path d="M18 7V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3H5v6l3 6v3h8v-3l3-6V7h-1zM8 4h8v3h-2V5h-1v2h-2V5h-1v2H8V4z"></path></g>
<g id="settings-input-svideo"><path d="M8 11.5c0-.83-.67-1.5-1.5-1.5S5 10.67 5 11.5 5.67 13 6.5 13 8 12.33 8 11.5zm7-5c0-.83-.67-1.5-1.5-1.5h-3C9.67 5 9 5.67 9 6.5S9.67 8 10.5 8h3c.83 0 1.5-.67 1.5-1.5zM8.5 15c-.83 0-1.5.67-1.5 1.5S7.67 18 8.5 18s1.5-.67 1.5-1.5S9.33 15 8.5 15zM12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9zm5.5-11c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path></g>
<g id="settings-overscan"><path d="M12.01 5.5L10 8h4l-1.99-2.5zM18 10v4l2.5-1.99L18 10zM6 10l-2.5 2.01L6 14v-4zm8 6h-4l2.01 2.5L14 16zm7-13H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"></path></g>
<g id="settings-phone"><path d="M13 9h-2v2h2V9zm4 0h-2v2h2V9zm3 6.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 9v2h2V9h-2z"></path></g>
<g id="settings-power"><path d="M7 24h2v-2H7v2zm4 0h2v-2h-2v2zm2-22h-2v10h2V2zm3.56 2.44l-1.45 1.45C16.84 6.94 18 8.83 18 11c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 4.44C5.36 5.88 4 8.28 4 11c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.72-1.36-5.12-3.44-6.56zM15 24h2v-2h-2v2z"></path></g>
<g id="settings-remote"><path d="M15 9H9c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1zm-3 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM7.05 6.05l1.41 1.41C9.37 6.56 10.62 6 12 6s2.63.56 3.54 1.46l1.41-1.41C15.68 4.78 13.93 4 12 4s-3.68.78-4.95 2.05zM12 0C8.96 0 6.21 1.23 4.22 3.22l1.41 1.41C7.26 3.01 9.51 2 12 2s4.74 1.01 6.36 2.64l1.41-1.41C17.79 1.23 15.04 0 12 0z"></path></g>
<g id="settings-voice"><path d="M7 24h2v-2H7v2zm5-11c1.66 0 2.99-1.34 2.99-3L15 4c0-1.66-1.34-3-3-3S9 2.34 9 4v6c0 1.66 1.34 3 3 3zm-1 11h2v-2h-2v2zm4 0h2v-2h-2v2zm4-14h-1.7c0 3-2.54 5.1-5.3 5.1S6.7 13 6.7 10H5c0 3.41 2.72 6.23 6 6.72V20h2v-3.28c3.28-.49 6-3.31 6-6.72z"></path></g>
<g id="shop"><path d="M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM9 18V9l7.5 4L9 18z"></path></g>
<g id="shop-two"><path d="M3 9H1v11c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2H3V9zm15-4V3c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H5v11c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5h-5zm-6-2h4v2h-4V3zm0 12V8l5.5 3-5.5 4z"></path></g>
<g id="shopping-basket"><path d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.4L15 9H9zm3 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></g>
<g id="shopping-cart"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path></g>
<g id="sort"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></g>
<g id="speaker-notes"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 14H6v-2h2v2zm0-3H6V9h2v2zm0-3H6V6h2v2zm7 6h-5v-2h5v2zm3-3h-8V9h8v2zm0-3h-8V6h8v2z"></path></g>
<g id="speaker-notes-off"><path d="M10.54 11l-.54-.54L7.54 8 6 6.46 2.38 2.84 1.27 1.73 0 3l2.01 2.01L2 22l4-4h9l5.73 5.73L22 22.46 17.54 18l-7-7zM8 14H6v-2h2v2zm-2-3V9l2 2H6zm14-9H4.08L10 7.92V6h8v2h-7.92l1 1H18v2h-4.92l6.99 6.99C21.14 17.95 22 17.08 22 16V4c0-1.1-.9-2-2-2z"></path></g>
<g id="spellcheck"><path d="M12.45 16h2.09L9.43 3H7.57L2.46 16h2.09l1.12-3h5.64l1.14 3zm-6.02-5L8.5 5.48 10.57 11H6.43zm15.16.59l-8.09 8.09L9.83 16l-1.41 1.41 5.09 5.09L23 13l-1.41-1.41z"></path></g>
<g id="star"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></g>
<g id="star-border"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></g>
<g id="star-half"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></g>
<g id="stars"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"></path></g>
<g id="store"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"></path></g>
<g id="subdirectory-arrow-left"><path d="M11 9l1.42 1.42L8.83 14H18V4h2v12H8.83l3.59 3.58L11 21l-6-6 6-6z"></path></g>
<g id="subdirectory-arrow-right"><path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"></path></g>
<g id="subject"><path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"></path></g>
<g id="supervisor-account"><path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"></path></g>
<g id="swap-horiz"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"></path></g>
<g id="swap-vert"><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"></path></g>
<g id="swap-vertical-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM6.5 9L10 5.5 13.5 9H11v4H9V9H6.5zm11 6L14 18.5 10.5 15H13v-4h2v4h2.5z"></path></g>
<g id="system-update-alt"><path d="M12 16.5l4-4h-3v-9h-2v9H8l4 4zm9-13h-6v1.99h6v14.03H3V5.49h6V3.5H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2z"></path></g>
<g id="tab"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"></path></g>
<g id="tab-unselected"><path d="M1 9h2V7H1v2zm0 4h2v-2H1v2zm0-8h2V3c-1.1 0-2 .9-2 2zm8 16h2v-2H9v2zm-8-4h2v-2H1v2zm2 4v-2H1c0 1.1.9 2 2 2zM21 3h-8v6h10V5c0-1.1-.9-2-2-2zm0 14h2v-2h-2v2zM9 5h2V3H9v2zM5 21h2v-2H5v2zM5 5h2V3H5v2zm16 16c1.1 0 2-.9 2-2h-2v2zm0-8h2v-2h-2v2zm-8 8h2v-2h-2v2zm4 0h2v-2h-2v2z"></path></g>
<g id="text-format"><path d="M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z"></path></g>
<g id="theaters"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"></path></g>
<g id="thumb-down"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path></g>
<g id="thumb-up"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"></path></g>
<g id="thumbs-up-down"><path d="M12 6c0-.55-.45-1-1-1H5.82l.66-3.18.02-.23c0-.31-.13-.59-.33-.8L5.38 0 .44 4.94C.17 5.21 0 5.59 0 6v6.5c0 .83.67 1.5 1.5 1.5h6.75c.62 0 1.15-.38 1.38-.91l2.26-5.29c.07-.17.11-.36.11-.55V6zm10.5 4h-6.75c-.62 0-1.15.38-1.38.91l-2.26 5.29c-.07.17-.11.36-.11.55V18c0 .55.45 1 1 1h5.18l-.66 3.18-.02.24c0 .31.13.59.33.8l.79.78 4.94-4.94c.27-.27.44-.65.44-1.06v-6.5c0-.83-.67-1.5-1.5-1.5z"></path></g>
<g id="timeline"><path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"></path></g>
<g id="toc"><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"></path></g>
<g id="today"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"></path></g>
<g id="toll"><path d="M15 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zM3 12c0-2.61 1.67-4.83 4-5.65V4.26C3.55 5.15 1 8.27 1 12s2.55 6.85 6 7.74v-2.09c-2.33-.82-4-3.04-4-5.65z"></path></g>
<g id="touch-app"><path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"></path></g>
<g id="track-changes"><path d="M19.07 4.93l-1.41 1.41C19.1 7.79 20 9.79 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.08 3.05-7.44 7-7.93v2.02C8.16 6.57 6 9.03 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.66-.67-3.16-1.76-4.24l-1.41 1.41C15.55 9.9 16 10.9 16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.86 1.28-3.41 3-3.86v2.14c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V2h-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.76-1.12-5.26-2.93-7.07z"></path></g>
<g id="translate"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path></g>
<g id="trending-down"><path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"></path></g>
<g id="trending-flat"><path d="M22 12l-4-4v3H3v2h15v3z"></path></g>
<g id="trending-up"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"></path></g>
<g id="turned-in"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></g>
<g id="turned-in-not"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"></path></g>
<g id="unarchive"><path d="M20.55 5.22l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.15.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.49-.17-.93-.45-1.28zM12 9.5l5.5 5.5H14v2h-4v-2H6.5L12 9.5zM5.12 5l.82-1h12l.93 1H5.12z"></path></g>
<g id="undo"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"></path></g>
<g id="unfold-less"><path d="M7.41 18.59L8.83 20 12 16.83 15.17 20l1.41-1.41L12 14l-4.59 4.59zm9.18-13.18L15.17 4 12 7.17 8.83 4 7.41 5.41 12 10l4.59-4.59z"></path></g>
<g id="unfold-more"><path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"></path></g>
<g id="update"><path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79 2.73 2.71 7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58 3.51-3.47 9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"></path></g>
<g id="verified-user"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path></g>
<g id="view-agenda"><path d="M20 13H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm0-10H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"></path></g>
<g id="view-array"><path d="M4 18h3V5H4v13zM18 5v13h3V5h-3zM8 18h9V5H8v13z"></path></g>
<g id="view-carousel"><path d="M7 19h10V4H7v15zm-5-2h4V6H2v11zM18 6v11h4V6h-4z"></path></g>
<g id="view-column"><path d="M10 18h5V5h-5v13zm-6 0h5V5H4v13zM16 5v13h5V5h-5z"></path></g>
<g id="view-day"><path d="M2 21h19v-3H2v3zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 3v3h19V3H2z"></path></g>
<g id="view-headline"><path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z"></path></g>
<g id="view-list"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"></path></g>
<g id="view-module"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"></path></g>
<g id="view-quilt"><path d="M10 18h5v-6h-5v6zm-6 0h5V5H4v13zm12 0h5v-6h-5v6zM10 5v6h11V5H10z"></path></g>
<g id="view-stream"><path d="M4 18h17v-6H4v6zM4 5v6h17V5H4z"></path></g>
<g id="view-week"><path d="M6 5H3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm14 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm-7 0h-3c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1z"></path></g>
<g id="visibility"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></g>
<g id="visibility-off"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></g>
<g id="warning"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g>
<g id="watch-later"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"></path></g>
<g id="weekend"><path d="M21 10c-1.1 0-2 .9-2 2v3H5v-3c0-1.1-.9-2-2-2s-2 .9-2 2v5c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm-3-5H6c-1.1 0-2 .9-2 2v2.15c1.16.41 2 1.51 2 2.82V14h12v-2.03c0-1.3.84-2.4 2-2.82V7c0-1.1-.9-2-2-2z"></path></g>
<g id="work"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path></g>
<g id="youtube-searched-for"><path d="M17.01 14h-.8l-.27-.27c.98-1.14 1.57-2.61 1.57-4.23 0-3.59-2.91-6.5-6.5-6.5s-6.5 3-6.5 6.5H2l3.84 4 4.16-4H6.51C6.51 7 8.53 5 11.01 5s4.5 2.01 4.5 4.5c0 2.48-2.02 4.5-4.5 4.5-.65 0-1.26-.14-1.82-.38L7.71 15.1c.97.57 2.09.9 3.3.9 1.61 0 3.08-.59 4.22-1.57l.27.27v.79l5.01 4.99L22 19l-4.99-5z"></path></g>
<g id="zoom-in"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z"></path></g>
<g id="zoom-out"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"></path></g>
</defs></svg>
</iron-iconset-svg>`;document.head.appendChild(template$9.content);const template$a=html`<iron-iconset-svg name="av" size="24">
<svg><defs>
<g id="add-to-queue"><path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-7v2h-3v3h-2v-3H8v-2h3V7h2v3h3z"></path></g>
<g id="airplay"><path d="M6 22h12l-6-6zM21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-2H3V5h18v12h-4v2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></g>
<g id="album"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"></path></g>
<g id="art-track"><path d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zm-2-8v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zm-1.5 6l-2.25-3-1.75 2.26-1.25-1.51L3.5 15h7z"></path></g>
<g id="av-timer"><path d="M11 17c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1zm0-14v4h2V5.08c3.39.49 6 3.39 6 6.92 0 3.87-3.13 7-7 7s-7-3.13-7-7c0-1.68.59-3.22 1.58-4.42L12 13l1.41-1.41-6.8-6.8v.02C4.42 6.45 3 9.05 3 12c0 4.97 4.02 9 9 9 4.97 0 9-4.03 9-9s-4.03-9-9-9h-1zm7 9c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zM6 12c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"></path></g>
<g id="branding-watermark"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16h-9v-6h9v6z"></path></g>
<g id="call-to-action"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"></path></g>
<g id="closed-caption"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z"></path></g>
<g id="equalizer"><path d="M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z"></path></g>
<g id="explicit"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z"></path></g>
<g id="fast-forward"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"></path></g>
<g id="fast-rewind"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"></path></g>
<g id="featured-play-list"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 8H3V9h9v2zm0-4H3V5h9v2z"></path></g>
<g id="featured-video"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 9H3V5h9v7z"></path></g>
<g id="fiber-dvr"><path d="M17.5 10.5h2v1h-2zm-13 0h2v3h-2zM21 3H3c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h18c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zM8 13.5c0 .85-.65 1.5-1.5 1.5H3V9h3.5c.85 0 1.5.65 1.5 1.5v3zm4.62 1.5h-1.5L9.37 9h1.5l1 3.43 1-3.43h1.5l-1.75 6zM21 11.5c0 .6-.4 1.15-.9 1.4L21 15h-1.5l-.85-2H17.5v2H16V9h3.5c.85 0 1.5.65 1.5 1.5v1z"></path></g>
<g id="fiber-manual-record"><circle cx="12" cy="12" r="8"></circle></g>
<g id="fiber-new"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 15H7.3l-2.55-3.5V15H3.5V9h1.25l2.5 3.5V9H8.5v6zm5-4.74H11v1.12h2.5v1.26H11v1.11h2.5V15h-4V9h4v1.26zm7 3.74c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1V9h1.25v4.51h1.13V9.99h1.25v3.51h1.12V9h1.25v5z"></path></g>
<g id="fiber-pin"><path d="M5.5 10.5h2v1h-2zM20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM9 11.5c0 .85-.65 1.5-1.5 1.5h-2v2H4V9h3.5c.85 0 1.5.65 1.5 1.5v1zm3.5 3.5H11V9h1.5v6zm7.5 0h-1.2l-2.55-3.5V15H15V9h1.25l2.5 3.5V9H20v6z"></path></g>
<g id="fiber-smart-record"><g><circle cx="9" cy="12" r="8"></circle><path d="M17 4.26v2.09c2.33.82 4 3.04 4 5.65s-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74s-2.55-6.85-6-7.74z"></path></g></g>
<g id="forward-10"><path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8zm6.8 3H10v-3.3L9 13v-.7l1.8-.6h.1V16zm4.3-1.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1-.4 0-.6-.1-.3-.2-.5-.3-.2-.3-.3-.6-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1.4 0 .6.1.3.2.5.3.2.3.3.6.1.5.1.8v.7zm-.8-.8v-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5z"></path></g>
<g id="forward-30"><path d="M9.6 13.5h.4c.2 0 .4-.1.5-.2s.2-.2.2-.4v-.2s-.1-.1-.1-.2-.1-.1-.2-.1h-.5s-.1.1-.2.1-.1.1-.1.2v.2h-1c0-.2 0-.3.1-.5s.2-.3.3-.4.3-.2.4-.2.4-.1.5-.1c.2 0 .4 0 .6.1s.3.1.5.2.2.2.3.4.1.3.1.5v.3s-.1.2-.1.3-.1.2-.2.2-.2.1-.3.2c.2.1.4.2.5.4s.2.4.2.6c0 .2 0 .4-.1.5s-.2.3-.3.4-.3.2-.5.2-.4.1-.6.1c-.2 0-.4 0-.5-.1s-.3-.1-.5-.2-.2-.2-.3-.4-.1-.4-.1-.6h.8v.2s.1.1.1.2.1.1.2.1h.5s.1-.1.2-.1.1-.1.1-.2v-.5s-.1-.1-.1-.2-.1-.1-.2-.1h-.6v-.7zm5.7.7c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1-.4 0-.6-.1-.3-.2-.5-.3-.2-.3-.3-.6-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1.4 0 .6.1.3.2.5.3.2.3.3.6.1.5.1.8v.7zm-.9-.8v-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5zM4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8z"></path></g>
<g id="forward-5"><path d="M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8zm6.7.9l.2-2.2h2.4v.7h-1.7l-.1.9s.1 0 .1-.1.1 0 .1-.1.1 0 .2 0h.2c.2 0 .4 0 .5.1s.3.2.4.3.2.3.3.5.1.4.1.6c0 .2 0 .4-.1.5s-.1.3-.3.5-.3.2-.5.3-.4.1-.6.1c-.2 0-.4 0-.5-.1s-.3-.1-.5-.2-.2-.2-.3-.4-.1-.3-.1-.5h.8c0 .2.1.3.2.4s.2.1.4.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-.6l-.1-.2-.2-.2s-.2-.1-.3-.1h-.2s-.1 0-.2.1-.1 0-.1.1-.1.1-.1.1h-.6z"></path></g>
<g id="games"><path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"></path></g>
<g id="hd"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11v6zm2-6h4c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-4V9zm1.5 4.5h2v-3h-2v3z"></path></g>
<g id="hearing"><path d="M17 20c-.29 0-.56-.06-.76-.15-.71-.37-1.21-.88-1.71-2.38-.51-1.56-1.47-2.29-2.39-3-.79-.61-1.61-1.24-2.32-2.53C9.29 10.98 9 9.93 9 9c0-2.8 2.2-5 5-5s5 2.2 5 5h2c0-3.93-3.07-7-7-7S7 5.07 7 9c0 1.26.38 2.65 1.07 3.9.91 1.65 1.98 2.48 2.85 3.15.81.62 1.39 1.07 1.71 2.05.6 1.82 1.37 2.84 2.73 3.55.51.23 1.07.35 1.64.35 2.21 0 4-1.79 4-4h-2c0 1.1-.9 2-2 2zM7.64 2.64L6.22 1.22C4.23 3.21 3 5.96 3 9s1.23 5.79 3.22 7.78l1.41-1.41C6.01 13.74 5 11.49 5 9s1.01-4.74 2.64-6.36zM11.5 9c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5z"></path></g>
<g id="high-quality"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11v6zm7-1c0 .55-.45 1-1 1h-.75v1.5h-1.5V15H14c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v4zm-3.5-.5h2v-3h-2v3z"></path></g>
<g id="library-add"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"></path></g>
<g id="library-books"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"></path></g>
<g id="library-music"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"></path></g>
<g id="loop"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"></path></g>
<g id="mic"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></g>
<g id="mic-none"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1.2-9.1c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2l-.01 6.2c0 .66-.53 1.2-1.19 1.2-.66 0-1.2-.54-1.2-1.2V4.9zm6.5 6.1c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></g>
<g id="mic-off"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"></path></g>
<g id="movie"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"></path></g>
<g id="music-video"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03c-.02 1.64-1.35 2.97-3 2.97-1.66 0-3-1.34-3-3z"></path></g>
<g id="new-releases"><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"></path></g>
<g id="not-interested"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"></path></g>
<g id="note"><path d="M22 10l-6-6H4c-1.1 0-2 .9-2 2v12.01c0 1.1.9 1.99 2 1.99l16-.01c1.1 0 2-.89 2-1.99v-8zm-7-4.5l5.5 5.5H15V5.5z"></path></g>
<g id="pause"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></g>
<g id="pause-circle-filled"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"></path></g>
<g id="pause-circle-outline"><path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"></path></g>
<g id="play-arrow"><path d="M8 5v14l11-7z"></path></g>
<g id="play-circle-filled"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path></g>
<g id="play-circle-outline"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
<g id="playlist-add"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path></g>
<g id="playlist-add-check"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"></path></g>
<g id="playlist-play"><path d="M19 9H2v2h17V9zm0-4H2v2h17V5zM2 15h13v-2H2v2zm15-2v6l5-3-5-3z"></path></g>
<g id="queue"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"></path></g>
<g id="queue-music"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"></path></g>
<g id="queue-play-next"><path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h2v-2H3V5h18v8h2V5c0-1.11-.9-2-2-2zm-8 7V7h-2v3H8v2h3v3h2v-3h3v-2h-3zm11 8l-4.5 4.5L18 21l3-3-3-3 1.5-1.5L24 18z"></path></g>
<g id="radio"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"></path></g>
<g id="recent-actors"><path d="M21 5v14h2V5h-2zm-4 14h2V5h-2v14zM14 5H2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM8 7.75c1.24 0 2.25 1.01 2.25 2.25S9.24 12.25 8 12.25 5.75 11.24 5.75 10 6.76 7.75 8 7.75zM12.5 17h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V17z"></path></g>
<g id="remove-from-queue"><path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-7v2H8v-2h8z"></path></g>
<g id="repeat"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></g>
<g id="repeat-one"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"></path></g>
<g id="replay"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></g>
<g id="replay-10"><path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8zm-1.1 11H10v-3.3L9 13v-.7l1.8-.6h.1V16zm4.3-1.8c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1-.4 0-.6-.1-.3-.2-.5-.3-.2-.3-.3-.6-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1.4 0 .6.1c.2.1.3.2.5.3s.2.3.3.6.1.5.1.8v.7zm-.9-.8v-.5s-.1-.2-.1-.3-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5z"></path></g>
<g id="replay-30"><path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8zm-2.4 8.5h.4c.2 0 .4-.1.5-.2s.2-.2.2-.4v-.2s-.1-.1-.1-.2-.1-.1-.2-.1h-.5s-.1.1-.2.1-.1.1-.1.2v.2h-1c0-.2 0-.3.1-.5s.2-.3.3-.4.3-.2.4-.2.4-.1.5-.1c.2 0 .4 0 .6.1s.3.1.5.2.2.2.3.4.1.3.1.5v.3s-.1.2-.1.3-.1.2-.2.2-.2.1-.3.2c.2.1.4.2.5.4s.2.4.2.6c0 .2 0 .4-.1.5s-.2.3-.3.4-.3.2-.5.2-.4.1-.6.1c-.2 0-.4 0-.5-.1s-.3-.1-.5-.2-.2-.2-.3-.4-.1-.4-.1-.6h.8v.2s.1.1.1.2.1.1.2.1h.5s.1-.1.2-.1.1-.1.1-.2v-.5s-.1-.1-.1-.2-.1-.1-.2-.1h-.6v-.7zm5.7.7c0 .3 0 .6-.1.8l-.3.6s-.3.3-.5.3-.4.1-.6.1-.4 0-.6-.1-.3-.2-.5-.3-.2-.3-.3-.6-.1-.5-.1-.8v-.7c0-.3 0-.6.1-.8l.3-.6s.3-.3.5-.3.4-.1.6-.1.4 0 .6.1.3.2.5.3.2.3.3.6.1.5.1.8v.7zm-.8-.8v-.5c0-.1-.1-.2-.1-.3s-.1-.1-.2-.2-.2-.1-.3-.1-.2 0-.3.1l-.2.2s-.1.2-.1.3v2s.1.2.1.3.1.1.2.2.2.1.3.1.2 0 .3-.1l.2-.2s.1-.2.1-.3v-1.5z"></path></g>
<g id="replay-5"><path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8zm-1.3 8.9l.2-2.2h2.4v.7h-1.7l-.1.9s.1 0 .1-.1.1 0 .1-.1.1 0 .2 0h.2c.2 0 .4 0 .5.1s.3.2.4.3.2.3.3.5.1.4.1.6c0 .2 0 .4-.1.5s-.1.3-.3.5-.3.2-.4.3-.4.1-.6.1c-.2 0-.4 0-.5-.1s-.3-.1-.5-.2-.2-.2-.3-.4-.1-.3-.1-.5h.8c0 .2.1.3.2.4s.2.1.4.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-.6l-.1-.2-.2-.2s-.2-.1-.3-.1h-.2s-.1 0-.2.1-.1 0-.1.1-.1.1-.1.1h-.7z"></path></g>
<g id="shuffle"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></g>
<g id="skip-next"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></g>
<g id="skip-previous"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></g>
<g id="slow-motion-video"><path d="M13.05 9.79L10 7.5v9l3.05-2.29L16 12zm0 0L10 7.5v9l3.05-2.29L16 12zm0 0L10 7.5v9l3.05-2.29L16 12zM11 4.07V2.05c-2.01.2-3.84 1-5.32 2.21L7.1 5.69c1.11-.86 2.44-1.44 3.9-1.62zM5.69 7.1L4.26 5.68C3.05 7.16 2.25 8.99 2.05 11h2.02c.18-1.46.76-2.79 1.62-3.9zM4.07 13H2.05c.2 2.01 1 3.84 2.21 5.32l1.43-1.43c-.86-1.1-1.44-2.43-1.62-3.89zm1.61 6.74C7.16 20.95 9 21.75 11 21.95v-2.02c-1.46-.18-2.79-.76-3.9-1.62l-1.42 1.43zM22 12c0 5.16-3.92 9.42-8.95 9.95v-2.02C16.97 19.41 20 16.05 20 12s-3.03-7.41-6.95-7.93V2.05C18.08 2.58 22 6.84 22 12z"></path></g>
<g id="snooze"><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-3-9h3.63L9 15.2V17h6v-2h-3.63L15 10.8V9H9v2z"></path></g>
<g id="sort-by-alpha"><path d="M14.94 4.66h-4.72l2.36-2.36zm-4.69 14.71h4.66l-2.33 2.33zM6.1 6.27L1.6 17.73h1.84l.92-2.45h5.11l.92 2.45h1.84L7.74 6.27H6.1zm-1.13 7.37l1.94-5.18 1.94 5.18H4.97zm10.76 2.5h6.12v1.59h-8.53v-1.29l5.92-8.56h-5.88v-1.6h8.3v1.26l-5.93 8.6z"></path></g>
<g id="stop"><path d="M6 6h12v12H6z"></path></g>
<g id="subscriptions"><path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z"></path></g>
<g id="subtitles"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"></path></g>
<g id="surround-sound"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.76 16.24l-1.41 1.41C4.78 16.1 4 14.05 4 12c0-2.05.78-4.1 2.34-5.66l1.41 1.41C6.59 8.93 6 10.46 6 12s.59 3.07 1.76 4.24zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm5.66 1.66l-1.41-1.41C17.41 15.07 18 13.54 18 12s-.59-3.07-1.76-4.24l1.41-1.41C19.22 7.9 20 9.95 20 12c0 2.05-.78 4.1-2.34 5.66zM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g>
<g id="video-call"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"></path></g>
<g id="video-label"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V5h18v11z"></path></g>
<g id="video-library"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"></path></g>
<g id="videocam"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path></g>
<g id="videocam-off"><path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"></path></g>
<g id="volume-down"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"></path></g>
<g id="volume-mute"><path d="M7 9v6h4l5 5V4l-5 5H7z"></path></g>
<g id="volume-off"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path></g>
<g id="volume-up"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></g>
<g id="web"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"></path></g>
<g id="web-asset"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 14H5V8h14v10z"></path></g>
</defs></svg>
</iron-iconset-svg>`;document.head.appendChild(template$a.content);const template$b=html`<iron-iconset-svg name="communication" size="24">
<svg><defs>
<g id="business"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"></path></g>
<g id="call"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></g>
<g id="call-end"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"></path></g>
<g id="call-made"><path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"></path></g>
<g id="call-merge"><path d="M17 20.41L18.41 19 15 15.59 13.59 17 17 20.41zM7.5 8H11v5.59L5.59 19 7 20.41l6-6V8h3.5L12 3.5 7.5 8z"></path></g>
<g id="call-missed"><path d="M19.59 7L12 14.59 6.41 9H11V7H3v8h2v-4.59l7 7 9-9z"></path></g>
<g id="call-missed-outgoing"><path d="M3 8.41l9 9 7-7V15h2V7h-8v2h4.59L12 14.59 4.41 7 3 8.41z"></path></g>
<g id="call-received"><path d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z"></path></g>
<g id="call-split"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></g>
<g id="chat"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></g>
<g id="chat-bubble"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></g>
<g id="chat-bubble-outline"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path></g>
<g id="clear-all"><path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"></path></g>
<g id="comment"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></g>
<g id="contact-mail"><path d="M21 8V7l-3 2-3-2v1l3 2 3-2zm1-5H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm8-6h-8V6h8v6z"></path></g>
<g id="contact-phone"><path d="M22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm3.85-4h1.64L21 16l-1.99 1.99c-1.31-.98-2.28-2.38-2.73-3.99-.18-.64-.28-1.31-.28-2s.1-1.36.28-2c.45-1.62 1.42-3.01 2.73-3.99L21 8l-1.51 2h-1.64c-.22.63-.35 1.3-.35 2s.13 1.37.35 2z"></path></g>
<g id="contacts"><path d="M20 0H4v2h16V0zM4 24h16v-2H4v2zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9 10.76 6.75 12 6.75zM17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z"></path></g>
<g id="dialer-sip"><path d="M17 3h-1v5h1V3zm-2 2h-2V4h2V3h-3v3h2v1h-2v1h3V5zm3-2v5h1V6h2V3h-3zm2 2h-1V4h1v1zm0 10.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.27-.26.35-.65.24-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"></path></g>
<g id="dialpad"><path d="M12 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 1c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g>
<g id="email"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></g>
<g id="forum"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"></path></g>
<g id="import-contacts"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"></path></g>
<g id="import-export"><path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z"></path></g>
<g id="invert-colors-off"><path d="M20.65 20.87l-2.35-2.35-6.3-6.29-3.56-3.57-1.42-1.41L4.27 4.5 3 5.77l2.78 2.78c-2.55 3.14-2.36 7.76.56 10.69C7.9 20.8 9.95 21.58 12 21.58c1.79 0 3.57-.59 5.03-1.78l2.7 2.7L21 21.23l-.35-.36zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59c0-1.32.43-2.57 1.21-3.6L12 14.77v4.82zM12 5.1v4.58l7.25 7.26c1.37-2.96.84-6.57-1.6-9.01L12 2.27l-3.7 3.7 1.41 1.41L12 5.1z"></path></g>
<g id="live-help"><path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 16h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path></g>
<g id="location-off"><path d="M12 6.5c1.38 0 2.5 1.12 2.5 2.5 0 .74-.33 1.39-.83 1.85l3.63 3.63c.98-1.86 1.7-3.8 1.7-5.48 0-3.87-3.13-7-7-7-1.98 0-3.76.83-5.04 2.15l3.19 3.19c.46-.52 1.11-.84 1.85-.84zm4.37 9.6l-4.63-4.63-.11-.11L3.27 3 2 4.27l3.18 3.18C5.07 7.95 5 8.47 5 9c0 5.25 7 13 7 13s1.67-1.85 3.38-4.35L18.73 21 20 19.73l-3.63-3.63z"></path></g>
<g id="location-on"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></g>
<g id="mail-outline"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path></g>
<g id="message"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></g>
<g id="no-sim"><path d="M18.99 5c0-1.1-.89-2-1.99-2h-7L7.66 5.34 19 16.68 18.99 5zM3.65 3.88L2.38 5.15 5 7.77V19c0 1.1.9 2 2 2h10.01c.35 0 .67-.1.96-.26l1.88 1.88 1.27-1.27L3.65 3.88z"></path></g>
<g id="phone"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></g>
<g id="phonelink-erase"><path d="M13 8.2l-1-1-4 4-4-4-1 1 4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4zM19 1H9c-1.1 0-2 .9-2 2v3h2V4h10v16H9v-2H7v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"></path></g>
<g id="phonelink-lock"><path d="M19 1H9c-1.1 0-2 .9-2 2v3h2V4h10v16H9v-2H7v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-8.2 10V9.5C10.8 8.1 9.4 7 8 7S5.2 8.1 5.2 9.5V11c-.6 0-1.2.6-1.2 1.2v3.5c0 .7.6 1.3 1.2 1.3h5.5c.7 0 1.3-.6 1.3-1.2v-3.5c0-.7-.6-1.3-1.2-1.3zm-1.3 0h-3V9.5c0-.8.7-1.3 1.5-1.3s1.5.5 1.5 1.3V11z"></path></g>
<g id="phonelink-ring"><path d="M20.1 7.7l-1 1c1.8 1.8 1.8 4.6 0 6.5l1 1c2.5-2.3 2.5-6.1 0-8.5zM18 9.8l-1 1c.5.7.5 1.6 0 2.3l1 1c1.2-1.2 1.2-3 0-4.3zM14 1H4c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 19H4V4h10v16z"></path></g>
<g id="phonelink-setup"><path d="M11.8 12.5v-1l1.1-.8c.1-.1.1-.2.1-.3l-1-1.7c-.1-.1-.2-.2-.3-.1l-1.3.4c-.3-.2-.6-.4-.9-.5l-.2-1.3c0-.1-.1-.2-.3-.2H7c-.1 0-.2.1-.3.2l-.2 1.3c-.3.1-.6.3-.9.5l-1.3-.5c-.1 0-.2 0-.3.1l-1 1.7c-.1.1 0 .2.1.3l1.1.8v1l-1.1.8c-.1.2-.1.3-.1.4l1 1.7c.1.1.2.2.3.1l1.4-.4c.3.2.6.4.9.5l.2 1.3c-.1.1.1.2.2.2h2c.1 0 .2-.1.3-.2l.2-1.3c.3-.1.6-.3.9-.5l1.3.5c.1 0 .2 0 .3-.1l1-1.7c.1-.1 0-.2-.1-.3l-1.1-.9zM8 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM19 1H9c-1.1 0-2 .9-2 2v3h2V4h10v16H9v-2H7v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2z"></path></g>
<g id="portable-wifi-off"><path d="M17.56 14.24c.28-.69.44-1.45.44-2.24 0-3.31-2.69-6-6-6-.79 0-1.55.16-2.24.44l1.62 1.62c.2-.03.41-.06.62-.06 2.21 0 4 1.79 4 4 0 .21-.02.42-.05.63l1.61 1.61zM12 4c4.42 0 8 3.58 8 8 0 1.35-.35 2.62-.95 3.74l1.47 1.47C21.46 15.69 22 13.91 22 12c0-5.52-4.48-10-10-10-1.91 0-3.69.55-5.21 1.47l1.46 1.46C9.37 4.34 10.65 4 12 4zM3.27 2.5L2 3.77l2.1 2.1C2.79 7.57 2 9.69 2 12c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 17.53 4 14.96 4 12c0-1.76.57-3.38 1.53-4.69l1.43 1.44C6.36 9.68 6 10.8 6 12c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-.65.17-1.25.44-1.79l1.58 1.58L10 12c0 1.1.9 2 2 2l.21-.02.01.01 7.51 7.51L21 20.23 4.27 3.5l-1-1z"></path></g>
<g id="present-to-all"><path d="M21 3H3c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 16.02H3V4.98h18v14.04zM10 12H8l4-4 4 4h-2v4h-4v-4z"></path></g>
<g id="ring-volume"><path d="M23.71 16.67C20.66 13.78 16.54 12 12 12 7.46 12 3.34 13.78.29 16.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73s3.15.25 4.6.72v3.1c0 .39.23.74.56.9.98.49 1.87 1.12 2.66 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.27-.11-.52-.29-.7zM21.16 6.26l-1.41-1.41-3.56 3.55 1.41 1.41s3.45-3.52 3.56-3.55zM13 2h-2v5h2V2zM6.4 9.81L7.81 8.4 4.26 4.84 2.84 6.26c.11.03 3.56 3.55 3.56 3.55z"></path></g>
<g id="rss-feed"><circle cx="6.18" cy="17.82" r="2.18"></circle><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"></path></g>
<g id="screen-share"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.11-.9-2-2-2H4c-1.11 0-2 .89-2 2v10c0 1.1.89 2 2 2H0v2h24v-2h-4zm-7-3.53v-2.19c-2.78 0-4.61.85-6 2.72.56-2.67 2.11-5.33 6-5.87V7l4 3.73-4 3.74z"></path></g>
<g id="speaker-phone"><path d="M7 7.07L8.43 8.5c.91-.91 2.18-1.48 3.57-1.48s2.66.57 3.57 1.48L17 7.07C15.72 5.79 13.95 5 12 5s-3.72.79-5 2.07zM12 1C8.98 1 6.24 2.23 4.25 4.21l1.41 1.41C7.28 4 9.53 3 12 3s4.72 1 6.34 2.62l1.41-1.41C17.76 2.23 15.02 1 12 1zm2.86 9.01L9.14 10C8.51 10 8 10.51 8 11.14v9.71c0 .63.51 1.14 1.14 1.14h5.71c.63 0 1.14-.51 1.14-1.14v-9.71c.01-.63-.5-1.13-1.13-1.13zM15 20H9v-8h6v8z"></path></g>
<g id="stay-current-landscape"><path d="M1.01 7L1 17c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3c-1.1 0-1.99.9-1.99 2zM19 7v10H5V7h14z"></path></g>
<g id="stay-current-portrait"><path d="M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></g>
<g id="stay-primary-landscape"><path d="M1.01 7L1 17c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H3c-1.1 0-1.99.9-1.99 2zM19 7v10H5V7h14z"></path></g>
<g id="stay-primary-portrait"><path d="M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></g>
<g id="stop-screen-share"><path d="M21.22 18.02l2 2H24v-2h-2.78zm.77-2l.01-10c0-1.11-.9-2-2-2H7.22l5.23 5.23c.18-.04.36-.07.55-.1V7.02l4 3.73-1.58 1.47 5.54 5.54c.61-.33 1.03-.99 1.03-1.74zM2.39 1.73L1.11 3l1.54 1.54c-.4.36-.65.89-.65 1.48v10c0 1.1.89 2 2 2H0v2h18.13l2.71 2.71 1.27-1.27L2.39 1.73zM7 15.02c.31-1.48.92-2.95 2.07-4.06l1.59 1.59c-1.54.38-2.7 1.18-3.66 2.47z"></path></g>
<g id="swap-calls"><path d="M18 4l-4 4h3v7c0 1.1-.9 2-2 2s-2-.9-2-2V8c0-2.21-1.79-4-4-4S5 5.79 5 8v7H2l4 4 4-4H7V8c0-1.1.9-2 2-2s2 .9 2 2v7c0 2.21 1.79 4 4 4s4-1.79 4-4V8h3l-4-4z"></path></g>
<g id="textsms"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"></path></g>
<g id="voicemail"><path d="M18.5 6C15.46 6 13 8.46 13 11.5c0 1.33.47 2.55 1.26 3.5H9.74c.79-.95 1.26-2.17 1.26-3.5C11 8.46 8.54 6 5.5 6S0 8.46 0 11.5 2.46 17 5.5 17h13c3.04 0 5.5-2.46 5.5-5.5S21.54 6 18.5 6zm-13 9C3.57 15 2 13.43 2 11.5S3.57 8 5.5 8 9 9.57 9 11.5 7.43 15 5.5 15zm13 0c-1.93 0-3.5-1.57-3.5-3.5S16.57 8 18.5 8 22 9.57 22 11.5 20.43 15 18.5 15z"></path></g>
<g id="vpn-key"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></g>
</defs></svg>
</iron-iconset-svg>`;document.head.appendChild(template$b.content);const IronScrollTargetBehavior={properties:{scrollTarget:{type:HTMLElement,value:function(){return this._defaultScrollTarget}}},observers:["_scrollTargetChanged(scrollTarget, isAttached)"],_shouldHaveListener:!0,_scrollTargetChanged:function(e,t){if(this._oldScrollTarget&&(this._toggleScrollListener(!1,this._oldScrollTarget),this._oldScrollTarget=null),t)if("document"===e)this.scrollTarget=this._doc;else if("string"==typeof e){var i=this.domHost;this.scrollTarget=i&&i.$?i.$[e]:dom(this.ownerDocument).querySelector("#"+e)}else this._isValidScrollTarget()&&(this._oldScrollTarget=e,this._toggleScrollListener(this._shouldHaveListener,e))},_scrollHandler:function(){},get _defaultScrollTarget(){return this._doc},get _doc(){return this.ownerDocument.documentElement},get _scrollTop(){return this._isValidScrollTarget()?this.scrollTarget===this._doc?window.pageYOffset:this.scrollTarget.scrollTop:0},get _scrollLeft(){return this._isValidScrollTarget()?this.scrollTarget===this._doc?window.pageXOffset:this.scrollTarget.scrollLeft:0},set _scrollTop(e){this.scrollTarget===this._doc?window.scrollTo(window.pageXOffset,e):this._isValidScrollTarget()&&(this.scrollTarget.scrollTop=e)},set _scrollLeft(e){this.scrollTarget===this._doc?window.scrollTo(e,window.pageYOffset):this._isValidScrollTarget()&&(this.scrollTarget.scrollLeft=e)},scroll:function(e,t){var i;"object"==typeof e?(i=e.left,t=e.top):i=e,i=i||0,t=t||0,this.scrollTarget===this._doc?window.scrollTo(i,t):this._isValidScrollTarget()&&(this.scrollTarget.scrollLeft=i,this.scrollTarget.scrollTop=t)},get _scrollTargetWidth(){return this._isValidScrollTarget()?this.scrollTarget===this._doc?window.innerWidth:this.scrollTarget.offsetWidth:0},get _scrollTargetHeight(){return this._isValidScrollTarget()?this.scrollTarget===this._doc?window.innerHeight:this.scrollTarget.offsetHeight:0},_isValidScrollTarget:function(){return this.scrollTarget instanceof HTMLElement},_toggleScrollListener:function(e,t){var i=t===this._doc?window:t;e?this._boundScrollHandler||(this._boundScrollHandler=this._scrollHandler.bind(this),i.addEventListener("scroll",this._boundScrollHandler)):this._boundScrollHandler&&(i.removeEventListener("scroll",this._boundScrollHandler),this._boundScrollHandler=null)},toggleScrollListener:function(e){this._shouldHaveListener=e,this._toggleScrollListener(e,this.scrollTarget)}};var hookCallback,some,IOS=navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/),IOS_TOUCH_SCROLLING=IOS&&IOS[1]>=8,DEFAULT_PHYSICAL_COUNT=3,HIDDEN_Y="-10000px",SECRET_TABINDEX=-100,IS_V2=null!=flush$1,ANIMATION_FRAME=IS_V2?animationFrame:0,IDLE_TIME=IS_V2?idlePeriod:1,MICRO_TASK=IS_V2?microTask:2;function hooks(){return hookCallback.apply(null,arguments)}function setHookCallback(e){hookCallback=e}function isArray(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function isObject(e){return null!=e&&"[object Object]"===Object.prototype.toString.call(e)}function isObjectEmpty(e){if(Object.getOwnPropertyNames)return 0===Object.getOwnPropertyNames(e).length;var t;for(t in e)if(e.hasOwnProperty(t))return!1;return!0}function isUndefined(e){return void 0===e}function isNumber(e){return"number"==typeof e||"[object Number]"===Object.prototype.toString.call(e)}function isDate(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function map(e,t){var i,n=[];for(i=0;i<e.length;++i)n.push(t(e[i],i));return n}function hasOwnProp(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function extend(e,t){for(var i in t)hasOwnProp(t,i)&&(e[i]=t[i]);return hasOwnProp(t,"toString")&&(e.toString=t.toString),hasOwnProp(t,"valueOf")&&(e.valueOf=t.valueOf),e}function createUTC(e,t,i,n){return createLocalOrUTC(e,t,i,n,!0).utc()}function defaultParsingFlags(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],meridiem:null,rfc2822:!1,weekdayMismatch:!1}}function getParsingFlags(e){return null==e._pf&&(e._pf=defaultParsingFlags()),e._pf}function isValid$1(e){if(null==e._isValid){var t=getParsingFlags(e),i=some.call(t.parsedDateParts,function(e){return null!=e}),n=!isNaN(e._d.getTime())&&t.overflow<0&&!t.empty&&!t.invalidMonth&&!t.invalidWeekday&&!t.weekdayMismatch&&!t.nullInput&&!t.invalidFormat&&!t.userInvalidated&&(!t.meridiem||t.meridiem&&i);if(e._strict&&(n=n&&0===t.charsLeftOver&&0===t.unusedTokens.length&&void 0===t.bigHour),null!=Object.isFrozen&&Object.isFrozen(e))return n;e._isValid=n}return e._isValid}function createInvalid(e){var t=createUTC(NaN);return null!=e?extend(getParsingFlags(t),e):getParsingFlags(t).userInvalidated=!0,t}OptionalMutableDataBehavior||(Polymer.OptionalMutableDataBehavior={}),Polymer$1({_template:html`
    <style>
      :host {
        display: block;
      }

      @media only screen and (-webkit-max-device-pixel-ratio: 1) {
        :host {
          will-change: transform;
        }
      }

      #items {
        @apply --iron-list-items-container;
        position: relative;
      }

      :host(:not([grid])) #items > ::slotted(*) {
        width: 100%;
      }

      #items > ::slotted(*) {
        box-sizing: border-box;
        margin: 0;
        position: absolute;
        top: 0;
        will-change: transform;
      }
    </style>

    <array-selector id="selector" items="{{items}}" selected="{{selectedItems}}" selected-item="{{selectedItem}}"></array-selector>

    <div id="items">
      <slot></slot>
    </div>
`,is:"iron-list",properties:{items:{type:Array},as:{type:String,value:"item"},indexAs:{type:String,value:"index"},selectedAs:{type:String,value:"selected"},grid:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_gridChanged"},selectionEnabled:{type:Boolean,value:!1},selectedItem:{type:Object,notify:!0},selectedItems:{type:Object,notify:!0},multiSelection:{type:Boolean,value:!1},scrollOffset:{type:Number,value:0}},observers:["_itemsChanged(items.*)","_selectionEnabledChanged(selectionEnabled)","_multiSelectionChanged(multiSelection)","_setOverflow(scrollTarget, scrollOffset)"],behaviors:[Templatizer,IronResizableBehavior,IronScrollTargetBehavior,OptionalMutableDataBehavior],_ratio:.5,_scrollerPaddingTop:0,_scrollPosition:0,_physicalSize:0,_physicalAverage:0,_physicalAverageCount:0,_physicalTop:0,_virtualCount:0,_estScrollHeight:0,_scrollHeight:0,_viewportHeight:0,_viewportWidth:0,_physicalItems:null,_physicalSizes:null,_firstVisibleIndexVal:null,_collection:null,_lastVisibleIndexVal:null,_maxPages:2,_focusedItem:null,_focusedVirtualIndex:-1,_focusedPhysicalIndex:-1,_offscreenFocusedItem:null,_focusBackfillItem:null,_itemsPerRow:1,_itemWidth:0,_rowHeight:0,_templateCost:0,_parentModel:!0,get _physicalBottom(){return this._physicalTop+this._physicalSize},get _scrollBottom(){return this._scrollPosition+this._viewportHeight},get _virtualEnd(){return this._virtualStart+this._physicalCount-1},get _hiddenContentSize(){return(this.grid?this._physicalRows*this._rowHeight:this._physicalSize)-this._viewportHeight},get _itemsParent(){return dom(dom(this._userTemplate).parentNode)},get _maxScrollTop(){return this._estScrollHeight-this._viewportHeight+this._scrollOffset},get _maxVirtualStart(){var e=this._convertIndexToCompleteRow(this._virtualCount);return Math.max(0,e-this._physicalCount)},set _virtualStart(e){e=this._clamp(e,0,this._maxVirtualStart),this.grid&&(e-=e%this._itemsPerRow),this._virtualStartVal=e},get _virtualStart(){return this._virtualStartVal||0},set _physicalStart(e){(e%=this._physicalCount)<0&&(e=this._physicalCount+e),this.grid&&(e-=e%this._itemsPerRow),this._physicalStartVal=e},get _physicalStart(){return this._physicalStartVal||0},get _physicalEnd(){return(this._physicalStart+this._physicalCount-1)%this._physicalCount},set _physicalCount(e){this._physicalCountVal=e},get _physicalCount(){return this._physicalCountVal||0},get _optPhysicalSize(){return 0===this._viewportHeight?1/0:this._viewportHeight*this._maxPages},get _isVisible(){return Boolean(this.offsetWidth||this.offsetHeight)},get firstVisibleIndex(){var e=this._firstVisibleIndexVal;if(null==e){var t=this._physicalTop+this._scrollOffset;e=this._iterateItems(function(e,i){return(t+=this._getPhysicalSizeIncrement(e))>this._scrollPosition?this.grid?i-i%this._itemsPerRow:i:this.grid&&this._virtualCount-1===i?i-i%this._itemsPerRow:void 0})||0,this._firstVisibleIndexVal=e}return e},get lastVisibleIndex(){var e=this._lastVisibleIndexVal;if(null==e){if(this.grid)e=Math.min(this._virtualCount,this.firstVisibleIndex+this._estRowsInView*this._itemsPerRow-1);else{var t=this._physicalTop+this._scrollOffset;this._iterateItems(function(i,n){t<this._scrollBottom&&(e=n),t+=this._getPhysicalSizeIncrement(i)})}this._lastVisibleIndexVal=e}return e},get _defaultScrollTarget(){return this},get _virtualRowCount(){return Math.ceil(this._virtualCount/this._itemsPerRow)},get _estRowsInView(){return Math.ceil(this._viewportHeight/this._rowHeight)},get _physicalRows(){return Math.ceil(this._physicalCount/this._itemsPerRow)},get _scrollOffset(){return this._scrollerPaddingTop+this.scrollOffset},ready:function(){this.addEventListener("focus",this._didFocus.bind(this),!0)},attached:function(){this._debounce("_render",this._render,ANIMATION_FRAME),this.listen(this,"iron-resize","_resizeHandler"),this.listen(this,"keydown","_keydownHandler")},detached:function(){this.unlisten(this,"iron-resize","_resizeHandler"),this.unlisten(this,"keydown","_keydownHandler")},_setOverflow:function(e){this.style.webkitOverflowScrolling=e===this?"touch":"",this.style.overflowY=e===this?"auto":"",this._lastVisibleIndexVal=null,this._firstVisibleIndexVal=null,this._debounce("_render",this._render,ANIMATION_FRAME)},updateViewportBoundaries:function(){var e=window.getComputedStyle(this);this._scrollerPaddingTop=this.scrollTarget===this?0:parseInt(e["padding-top"],10),this._isRTL=Boolean("rtl"===e.direction),this._viewportWidth=this.$.items.offsetWidth,this._viewportHeight=this._scrollTargetHeight,this.grid&&this._updateGridMetrics()},_scrollHandler:function(){var e=Math.max(0,Math.min(this._maxScrollTop,this._scrollTop)),t=e-this._scrollPosition,i=t>=0;if(this._scrollPosition=e,this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,Math.abs(t)>this._physicalSize&&this._physicalSize>0){t-=this._scrollOffset;var n=Math.round(t/this._physicalAverage)*this._itemsPerRow;this._virtualStart=this._virtualStart+n,this._physicalStart=this._physicalStart+n,this._physicalTop=Math.floor(this._virtualStart/this._itemsPerRow)*this._physicalAverage,this._update()}else if(this._physicalCount>0){var s=this._getReusables(i);i?(this._physicalTop=s.physicalTop,this._virtualStart=this._virtualStart+s.indexes.length,this._physicalStart=this._physicalStart+s.indexes.length):(this._virtualStart=this._virtualStart-s.indexes.length,this._physicalStart=this._physicalStart-s.indexes.length),this._update(s.indexes,i?null:s.indexes),this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,0),MICRO_TASK)}},_getReusables:function(e){var t,i,n,s=[],o=this._hiddenContentSize*this._ratio,a=this._virtualStart,r=this._virtualEnd,l=this._physicalCount,h=this._physicalTop+this._scrollOffset,c=this._physicalBottom+this._scrollOffset,d=this._scrollTop,p=this._scrollBottom;for(e?(t=this._physicalStart,this._physicalEnd,i=d-h):(t=this._physicalEnd,this._physicalStart,i=c-p);i-=n=this._getPhysicalSizeIncrement(t),!(s.length>=l||i<=o);)if(e){if(r+s.length+1>=this._virtualCount)break;if(h+n>=d-this._scrollOffset)break;s.push(t),h+=n,t=(t+1)%l}else{if(a-s.length<=0)break;if(h+this._physicalSize-n<=p)break;s.push(t),h-=n,t=0===t?l-1:t-1}return{indexes:s,physicalTop:h-this._scrollOffset}},_update:function(e,t){if(!(e&&0===e.length||0===this._physicalCount)){if(this._manageFocus(),this._assignModels(e),this._updateMetrics(e),t)for(;t.length;){var i=t.pop();this._physicalTop-=this._getPhysicalSizeIncrement(i)}this._positionItems(),this._updateScrollerSize()}},_createPool:function(e){var t,i;this._ensureTemplatized();var n=new Array(e);for(t=0;t<e;t++)i=this.stamp(null),n[t]=i.root.querySelector("*"),this._itemsParent.appendChild(i.root);return n},_isClientFull:function(){return 0!=this._scrollBottom&&this._physicalBottom-1>=this._scrollBottom&&this._physicalTop<=this._scrollPosition},_increasePoolIfNeeded:function(e){var t=this._clamp(this._physicalCount+e,DEFAULT_PHYSICAL_COUNT,this._virtualCount-this._virtualStart);if(t=this._convertIndexToCompleteRow(t),this.grid){var i=t%this._itemsPerRow;i&&t-i<=this._physicalCount&&(t+=this._itemsPerRow),t-=i}var n=t-this._physicalCount,s=Math.round(.5*this._physicalCount);if(!(n<0)){if(n>0){var o=window.performance.now();[].push.apply(this._physicalItems,this._createPool(n));for(var a=0;a<n;a++)this._physicalSizes.push(0);this._physicalCount=this._physicalCount+n,this._physicalStart>this._physicalEnd&&this._isIndexRendered(this._focusedVirtualIndex)&&this._getPhysicalIndex(this._focusedVirtualIndex)<this._physicalEnd&&(this._physicalStart=this._physicalStart+n),this._update(),this._templateCost=(window.performance.now()-o)/n,s=Math.round(.5*this._physicalCount)}this._virtualEnd>=this._virtualCount-1||0===s||(this._isClientFull()?this._physicalSize<this._optPhysicalSize&&this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,this._clamp(Math.round(50/this._templateCost),1,s)),IDLE_TIME):this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,s),MICRO_TASK))}},_render:function(){if(this.isAttached&&this._isVisible)if(0!==this._physicalCount){var e=this._getReusables(!0);this._physicalTop=e.physicalTop,this._virtualStart=this._virtualStart+e.indexes.length,this._physicalStart=this._physicalStart+e.indexes.length,this._update(e.indexes),this._update(),this._increasePoolIfNeeded(0)}else this._virtualCount>0&&(this.updateViewportBoundaries(),this._increasePoolIfNeeded(DEFAULT_PHYSICAL_COUNT))},_ensureTemplatized:function(){if(!this.ctor){this._userTemplate=this.queryEffectiveChildren("template"),this._userTemplate||console.warn("iron-list requires a template to be provided in light-dom");var e={__key__:!0};e[this.as]=!0,e[this.indexAs]=!0,e[this.selectedAs]=!0,e.tabIndex=!0,this._instanceProps=e,this.templatize(this._userTemplate,this.mutableData)}},_gridChanged:function(e,t){void 0!==t&&(this.notifyResize(),flush$1(),e&&this._updateGridMetrics())},_itemsChanged:function(e){if("items"===e.path)this._virtualStart=0,this._physicalTop=0,this._virtualCount=this.items?this.items.length:0,this._collection=(this.items,null),this._physicalIndexForKey={},this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,this._physicalCount=this._physicalCount||0,this._physicalItems=this._physicalItems||[],this._physicalSizes=this._physicalSizes||[],this._physicalStart=0,this._scrollTop>this._scrollOffset&&this._resetScrollPosition(0),this._removeFocusedItem(),this._debounce("_render",this._render,ANIMATION_FRAME);else if("items.splices"===e.path){if(this._adjustVirtualIndex(e.value.indexSplices),this._virtualCount=this.items?this.items.length:0,e.value.indexSplices.some(function(e){return e.addedCount>0||e.removed.length>0})){var t=this._getActiveElement();this.contains(t)&&t.blur()}var i=e.value.indexSplices.some(function(e){return e.index+e.addedCount>=this._virtualStart&&e.index<=this._virtualEnd},this);this._isClientFull()&&!i||this._debounce("_render",this._render,ANIMATION_FRAME)}else"items.length"!==e.path&&this._forwardItemPath(e.path,e.value)},_forwardItemPath:function(e,t){var i,n,s,o=(e=e.slice(6)).indexOf(".");-1===o&&(o=e.length);var a=this.modelForElement(this._offscreenFocusedItem);if(IS_V2){var r=parseInt(e.substring(0,o),10);if((i=this._isIndexRendered(r))?(n=this._getPhysicalIndex(r),s=this.modelForElement(this._physicalItems[n])):a&&(s=a),!s||s[this.indexAs]!==r)return}else{var l=e.substring(0,o);if(a&&a.__key__===l)s=a;else if(n=this._physicalIndexForKey[l],!(s=this.modelForElement(this._physicalItems[n]))||s.__key__!==l)return}e=e.substring(o+1),e=this.as+(e?"."+e:""),IS_V2?s._setPendingPropertyOrPath(e,t,!1,!0):s.notifyPath(e,t,!0),s._flushProperties&&s._flushProperties(!0),i&&(this._updateMetrics([n]),this._positionItems(),this._updateScrollerSize())},_adjustVirtualIndex:function(e){e.forEach(function(e){if(e.removed.forEach(this._removeItem,this),e.index<this._virtualStart){var t=Math.max(e.addedCount-e.removed.length,e.index-this._virtualStart);this._virtualStart=this._virtualStart+t,this._focusedVirtualIndex>=0&&(this._focusedVirtualIndex=this._focusedVirtualIndex+t)}},this)},_removeItem:function(e){this.$.selector.deselect(e),this._focusedItem&&this.modelForElement(this._focusedItem)[this.as]===e&&this._removeFocusedItem()},_iterateItems:function(e,t){var i,n,s,o;if(2===arguments.length&&t){for(o=0;o<t.length;o++)if(i=t[o],n=this._computeVidx(i),null!=(s=e.call(this,i,n)))return s}else{for(i=this._physicalStart,n=this._virtualStart;i<this._physicalCount;i++,n++)if(null!=(s=e.call(this,i,n)))return s;for(i=0;i<this._physicalStart;i++,n++)if(null!=(s=e.call(this,i,n)))return s}},_computeVidx:function(e){return e>=this._physicalStart?this._virtualStart+(e-this._physicalStart):this._virtualStart+(this._physicalCount-this._physicalStart)+e},_assignModels:function(e){this._iterateItems(function(e,t){var i=this._physicalItems[e],n=this.items&&this.items[t];if(null!=n){var s=this.modelForElement(i);s.__key__=this._collection?this._collection.getKey(n):null,this._forwardProperty(s,this.as,n),this._forwardProperty(s,this.selectedAs,this.$.selector.isSelected(n)),this._forwardProperty(s,this.indexAs,t),this._forwardProperty(s,"tabIndex",this._focusedVirtualIndex===t?0:-1),this._physicalIndexForKey[s.__key__]=e,s._flushProperties&&s._flushProperties(!0),i.removeAttribute("hidden")}else i.setAttribute("hidden","")},e)},_updateMetrics:function(e){flush$1();var t=0,i=0,n=this._physicalAverageCount,s=this._physicalAverage;this._iterateItems(function(e,n){i+=this._physicalSizes[e],this._physicalSizes[e]=this._physicalItems[e].offsetHeight,t+=this._physicalSizes[e],this._physicalAverageCount+=this._physicalSizes[e]?1:0},e),this.grid?(this._updateGridMetrics(),this._physicalSize=Math.ceil(this._physicalCount/this._itemsPerRow)*this._rowHeight):(i=1===this._itemsPerRow?i:Math.ceil(this._physicalCount/this._itemsPerRow)*this._rowHeight,this._physicalSize=this._physicalSize+t-i,this._itemsPerRow=1),this._physicalAverageCount!==n&&(this._physicalAverage=Math.round((s*n+t)/this._physicalAverageCount))},_updateGridMetrics:function(){this._itemWidth=this._physicalCount>0?this._physicalItems[0].getBoundingClientRect().width:200,this._rowHeight=this._physicalCount>0?this._physicalItems[0].offsetHeight:200,this._itemsPerRow=this._itemWidth?Math.floor(this._viewportWidth/this._itemWidth):this._itemsPerRow},_positionItems:function(){this._adjustScrollPosition();var e=this._physicalTop;if(this.grid){var t=this._itemsPerRow*this._itemWidth,i=(this._viewportWidth-t)/2;this._iterateItems(function(t,n){var s=n%this._itemsPerRow,o=Math.floor(s*this._itemWidth+i);this._isRTL&&(o*=-1),this.translate3d(o+"px",e+"px",0,this._physicalItems[t]),this._shouldRenderNextRow(n)&&(e+=this._rowHeight)})}else this._iterateItems(function(t,i){this.translate3d(0,e+"px",0,this._physicalItems[t]),e+=this._physicalSizes[t]})},_getPhysicalSizeIncrement:function(e){return this.grid?this._computeVidx(e)%this._itemsPerRow!=this._itemsPerRow-1?0:this._rowHeight:this._physicalSizes[e]},_shouldRenderNextRow:function(e){return e%this._itemsPerRow==this._itemsPerRow-1},_adjustScrollPosition:function(){var e=0===this._virtualStart?this._physicalTop:Math.min(this._scrollPosition+this._physicalTop,0);if(0!==e){this._physicalTop=this._physicalTop-e;var t=this._scrollTop;!IOS_TOUCH_SCROLLING&&t>0&&this._resetScrollPosition(t-e)}},_resetScrollPosition:function(e){this.scrollTarget&&e>=0&&(this._scrollTop=e,this._scrollPosition=this._scrollTop)},_updateScrollerSize:function(e){this.grid?this._estScrollHeight=this._virtualRowCount*this._rowHeight:this._estScrollHeight=this._physicalBottom+Math.max(this._virtualCount-this._physicalCount-this._virtualStart,0)*this._physicalAverage,((e=(e=(e=e||0===this._scrollHeight)||this._scrollPosition>=this._estScrollHeight-this._physicalSize)||this.grid&&this.$.items.style.height<this._estScrollHeight)||Math.abs(this._estScrollHeight-this._scrollHeight)>=this._viewportHeight)&&(this.$.items.style.height=this._estScrollHeight+"px",this._scrollHeight=this._estScrollHeight)},scrollToItem:function(e){return this.scrollToIndex(this.items.indexOf(e))},scrollToIndex:function(e){if(!("number"!=typeof e||e<0||e>this.items.length-1)&&(flush$1(),0!==this._physicalCount)){e=this._clamp(e,0,this._virtualCount-1),(!this._isIndexRendered(e)||e>=this._maxVirtualStart)&&(this._virtualStart=this.grid?e-2*this._itemsPerRow:e-1),this._manageFocus(),this._assignModels(),this._updateMetrics(),this._physicalTop=Math.floor(this._virtualStart/this._itemsPerRow)*this._physicalAverage;for(var t=this._physicalStart,i=this._virtualStart,n=0,s=this._hiddenContentSize;i<e&&n<=s;)n+=this._getPhysicalSizeIncrement(t),t=(t+1)%this._physicalCount,i++;this._updateScrollerSize(!0),this._positionItems(),this._resetScrollPosition(this._physicalTop+this._scrollOffset+n),this._increasePoolIfNeeded(0),this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null}},_resetAverage:function(){this._physicalAverage=0,this._physicalAverageCount=0},_resizeHandler:function(){this._debounce("_render",function(){this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null;Math.abs(this._viewportHeight-this._scrollTargetHeight);this.updateViewportBoundaries(),this._isVisible?(this.toggleScrollListener(!0),this._resetAverage(),this._render()):this.toggleScrollListener(!1)},ANIMATION_FRAME)},selectItem:function(e){return this.selectIndex(this.items.indexOf(e))},selectIndex:function(e){if(!(e<0||e>=this._virtualCount)){if(!this.multiSelection&&this.selectedItem&&this.clearSelection(),this._isIndexRendered(e)){var t=this.modelForElement(this._physicalItems[this._getPhysicalIndex(e)]);t&&(t[this.selectedAs]=!0),this.updateSizeForIndex(e)}this.$.selector.selectIndex?this.$.selector.selectIndex(e):this.$.selector.select(this.items[e])}},deselectItem:function(e){return this.deselectIndex(this.items.indexOf(e))},deselectIndex:function(e){if(!(e<0||e>=this._virtualCount)){if(this._isIndexRendered(e))this.modelForElement(this._physicalItems[this._getPhysicalIndex(e)])[this.selectedAs]=!1,this.updateSizeForIndex(e);this.$.selector.deselectIndex?this.$.selector.deselectIndex(e):this.$.selector.deselect(this.items[e])}},toggleSelectionForItem:function(e){return this.toggleSelectionForIndex(this.items.indexOf(e))},toggleSelectionForIndex:function(e){(this.$.selector.isIndexSelected?this.$.selector.isIndexSelected(e):this.$.selector.isSelected(this.items[e]))?this.deselectIndex(e):this.selectIndex(e)},clearSelection:function(){this._iterateItems(function(e,t){this.modelForElement(this._physicalItems[e])[this.selectedAs]=!1}),this.$.selector.clearSelection()},_selectionEnabledChanged:function(e){(e?this.listen:this.unlisten).call(this,this,"tap","_selectionHandler")},_selectionHandler:function(e){var t=this.modelForElement(e.target);if(t){var i,n,s=dom(e).path[0],o=this._getActiveElement(),a=this._physicalItems[this._getPhysicalIndex(t[this.indexAs])];"input"!==s.localName&&"button"!==s.localName&&"select"!==s.localName&&(i=t.tabIndex,t.tabIndex=SECRET_TABINDEX,n=o?o.tabIndex:-1,t.tabIndex=i,o&&a!==o&&a.contains(o)&&n!==SECRET_TABINDEX||this.toggleSelectionForItem(t[this.as]))}},_multiSelectionChanged:function(e){this.clearSelection(),this.$.selector.multi=e},updateSizeForItem:function(e){return this.updateSizeForIndex(this.items.indexOf(e))},updateSizeForIndex:function(e){return this._isIndexRendered(e)?(this._updateMetrics([this._getPhysicalIndex(e)]),this._positionItems(),null):null},_manageFocus:function(){var e=this._focusedVirtualIndex;e>=0&&e<this._virtualCount?this._isIndexRendered(e)?this._restoreFocusedItem():this._createFocusBackfillItem():this._virtualCount>0&&this._physicalCount>0&&(this._focusedPhysicalIndex=this._physicalStart,this._focusedVirtualIndex=this._virtualStart,this._focusedItem=this._physicalItems[this._physicalStart])},_convertIndexToCompleteRow:function(e){return this._itemsPerRow=this._itemsPerRow||1,this.grid?Math.ceil(e/this._itemsPerRow)*this._itemsPerRow:e},_isIndexRendered:function(e){return e>=this._virtualStart&&e<=this._virtualEnd},_isIndexVisible:function(e){return e>=this.firstVisibleIndex&&e<=this.lastVisibleIndex},_getPhysicalIndex:function(e){return IS_V2?(this._physicalStart+(e-this._virtualStart))%this._physicalCount:this._physicalIndexForKey[this._collection.getKey(this.items[e])]},focusItem:function(e){this._focusPhysicalItem(e)},_focusPhysicalItem:function(e){if(!(e<0||e>=this._virtualCount)){this._restoreFocusedItem(),this._isIndexRendered(e)||this.scrollToIndex(e);var t,i=this._physicalItems[this._getPhysicalIndex(e)],n=this.modelForElement(i);n.tabIndex=SECRET_TABINDEX,i.tabIndex===SECRET_TABINDEX&&(t=i),t||(t=dom(i).querySelector('[tabindex="'+SECRET_TABINDEX+'"]')),n.tabIndex=0,this._focusedVirtualIndex=e,t&&t.focus()}},_removeFocusedItem:function(){this._offscreenFocusedItem&&this._itemsParent.removeChild(this._offscreenFocusedItem),this._offscreenFocusedItem=null,this._focusBackfillItem=null,this._focusedItem=null,this._focusedVirtualIndex=-1,this._focusedPhysicalIndex=-1},_createFocusBackfillItem:function(){var e=this._focusedPhysicalIndex;if(!(this._offscreenFocusedItem||this._focusedVirtualIndex<0)){if(!this._focusBackfillItem){var t=this.stamp(null);this._focusBackfillItem=t.root.querySelector("*"),this._itemsParent.appendChild(t.root)}this._offscreenFocusedItem=this._physicalItems[e],this.modelForElement(this._offscreenFocusedItem).tabIndex=0,this._physicalItems[e]=this._focusBackfillItem,this._focusedPhysicalIndex=e,this.translate3d(0,HIDDEN_Y,0,this._offscreenFocusedItem)}},_restoreFocusedItem:function(){if(this._offscreenFocusedItem&&!(this._focusedVirtualIndex<0)){this._assignModels();var e=this._focusedPhysicalIndex=this._getPhysicalIndex(this._focusedVirtualIndex),t=this._physicalItems[e];if(t){var i=this.modelForElement(t),n=this.modelForElement(this._offscreenFocusedItem);i[this.as]===n[this.as]?(this._focusBackfillItem=t,i.tabIndex=-1,this._physicalItems[e]=this._offscreenFocusedItem,this.translate3d(0,HIDDEN_Y,0,this._focusBackfillItem)):(this._removeFocusedItem(),this._focusBackfillItem=null),this._offscreenFocusedItem=null}}},_didFocus:function(e){var t=this.modelForElement(e.target),i=this.modelForElement(this._focusedItem),n=null!==this._offscreenFocusedItem,s=this._focusedVirtualIndex;t&&(i===t?this._isIndexVisible(s)||this.scrollToIndex(s):(this._restoreFocusedItem(),i&&(i.tabIndex=-1),t.tabIndex=0,s=t[this.indexAs],this._focusedVirtualIndex=s,this._focusedPhysicalIndex=this._getPhysicalIndex(s),this._focusedItem=this._physicalItems[this._focusedPhysicalIndex],n&&!this._offscreenFocusedItem&&this._update()))},_keydownHandler:function(e){switch(e.keyCode){case 40:this._focusedVirtualIndex<this._virtualCount-1&&e.preventDefault(),this._focusPhysicalItem(this._focusedVirtualIndex+(this.grid?this._itemsPerRow:1));break;case 39:this.grid&&this._focusPhysicalItem(this._focusedVirtualIndex+(this._isRTL?-1:1));break;case 38:this._focusedVirtualIndex>0&&e.preventDefault(),this._focusPhysicalItem(this._focusedVirtualIndex-(this.grid?this._itemsPerRow:1));break;case 37:this.grid&&this._focusPhysicalItem(this._focusedVirtualIndex+(this._isRTL?1:-1));break;case 13:this._focusPhysicalItem(this._focusedVirtualIndex),this.selectionEnabled&&this._selectionHandler(e)}},_clamp:function(e,t,i){return Math.min(i,Math.max(t,e))},_debounce:function(e,t,i){IS_V2?(this._debouncers=this._debouncers||{},this._debouncers[e]=Debouncer.debounce(this._debouncers[e],i,t.bind(this)),enqueueDebouncer(this._debouncers[e])):enqueueDebouncer(this.debounce(e,t))},_forwardProperty:function(e,t,i){IS_V2?e._setPendingProperty(t,i):e[t]=i},_forwardHostPropV2:function(e,t){(this._physicalItems||[]).concat([this._offscreenFocusedItem,this._focusBackfillItem]).forEach(function(i){i&&this.modelForElement(i).forwardHostProp(e,t)},this)},_notifyInstancePropV2:function(e,t,i){if(matches(this.as,t)){var n=e[this.indexAs];t==this.as&&(this.items[n]=i),this.notifyPath(translate(this.as,"items."+n,t),i)}},_getStampedChildren:function(){return this._physicalItems},_forwardInstancePath:function(e,t,i){0===t.indexOf(this.as+".")&&this.notifyPath("items."+e.__key__+"."+t.slice(this.as.length+1),i)},_forwardParentPath:function(e,t){(this._physicalItems||[]).concat([this._offscreenFocusedItem,this._focusBackfillItem]).forEach(function(i){i&&this.modelForElement(i).notifyPath(e,t,!0)},this)},_forwardParentProp:function(e,t){(this._physicalItems||[]).concat([this._offscreenFocusedItem,this._focusBackfillItem]).forEach(function(i){i&&(this.modelForElement(i)[e]=t)},this)},_getActiveElement:function(){var e=this._itemsParent.node.domHost;return dom(e?e.root:document).activeElement}}),some=Array.prototype.some?Array.prototype.some:function(e){for(var t=Object(this),i=t.length>>>0,n=0;n<i;n++)if(n in t&&e.call(this,t[n],n,t))return!0;return!1};var momentProperties=hooks.momentProperties=[];function copyConfig(e,t){var i,n,s;if(isUndefined(t._isAMomentObject)||(e._isAMomentObject=t._isAMomentObject),isUndefined(t._i)||(e._i=t._i),isUndefined(t._f)||(e._f=t._f),isUndefined(t._l)||(e._l=t._l),isUndefined(t._strict)||(e._strict=t._strict),isUndefined(t._tzm)||(e._tzm=t._tzm),isUndefined(t._isUTC)||(e._isUTC=t._isUTC),isUndefined(t._offset)||(e._offset=t._offset),isUndefined(t._pf)||(e._pf=getParsingFlags(t)),isUndefined(t._locale)||(e._locale=t._locale),momentProperties.length>0)for(i=0;i<momentProperties.length;i++)isUndefined(s=t[n=momentProperties[i]])||(e[n]=s);return e}var updateInProgress=!1;function Moment(e){copyConfig(this,e),this._d=new Date(null!=e._d?e._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),!1===updateInProgress&&(updateInProgress=!0,hooks.updateOffset(this),updateInProgress=!1)}function isMoment(e){return e instanceof Moment||null!=e&&null!=e._isAMomentObject}function absFloor(e){return e<0?Math.ceil(e)||0:Math.floor(e)}function toInt(e){var t=+e,i=0;return 0!==t&&isFinite(t)&&(i=absFloor(t)),i}function compareArrays(e,t,i){var n,s=Math.min(e.length,t.length),o=Math.abs(e.length-t.length),a=0;for(n=0;n<s;n++)(i&&e[n]!==t[n]||!i&&toInt(e[n])!==toInt(t[n]))&&a++;return a+o}function warn(e){!1===hooks.suppressDeprecationWarnings&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+e)}function deprecate(e,t){var i=!0;return extend(function(){if(null!=hooks.deprecationHandler&&hooks.deprecationHandler(null,e),i){for(var n,s=[],o=0;o<arguments.length;o++){if(n="","object"==typeof arguments[o]){for(var a in n+="\n["+o+"] ",arguments[0])n+=a+": "+arguments[0][a]+", ";n=n.slice(0,-2)}else n=arguments[o];s.push(n)}warn(e+"\nArguments: "+Array.prototype.slice.call(s).join("")+"\n"+(new Error).stack),i=!1}return t.apply(this,arguments)},t)}var keys,deprecations={};function deprecateSimple(e,t){null!=hooks.deprecationHandler&&hooks.deprecationHandler(e,t),deprecations[e]||(warn(t),deprecations[e]=!0)}function isFunction(e){return e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function set$1(e){var t,i;for(i in e)isFunction(t=e[i])?this[i]=t:this["_"+i]=t;this._config=e,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)}function mergeConfigs(e,t){var i,n=extend({},e);for(i in t)hasOwnProp(t,i)&&(isObject(e[i])&&isObject(t[i])?(n[i]={},extend(n[i],e[i]),extend(n[i],t[i])):null!=t[i]?n[i]=t[i]:delete n[i]);for(i in e)hasOwnProp(e,i)&&!hasOwnProp(t,i)&&isObject(e[i])&&(n[i]=extend({},n[i]));return n}function Locale(e){null!=e&&this.set(e)}hooks.suppressDeprecationWarnings=!1,hooks.deprecationHandler=null,keys=Object.keys?Object.keys:function(e){var t,i=[];for(t in e)hasOwnProp(e,t)&&i.push(t);return i};var defaultCalendar={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"};function calendar(e,t,i){var n=this._calendar[e]||this._calendar.sameElse;return isFunction(n)?n.call(t,i):n}var defaultLongDateFormat={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"};function longDateFormat(e){var t=this._longDateFormat[e],i=this._longDateFormat[e.toUpperCase()];return t||!i?t:(this._longDateFormat[e]=i.replace(/MMMM|MM|DD|dddd/g,function(e){return e.slice(1)}),this._longDateFormat[e])}var defaultInvalidDate="Invalid date";function invalidDate(){return this._invalidDate}var defaultOrdinal="%d",defaultDayOfMonthOrdinalParse=/\d{1,2}/;function ordinal(e){return this._ordinal.replace("%d",e)}var defaultRelativeTime={future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function relativeTime(e,t,i,n){var s=this._relativeTime[i];return isFunction(s)?s(e,t,i,n):s.replace(/%d/i,e)}function pastFuture(e,t){var i=this._relativeTime[e>0?"future":"past"];return isFunction(i)?i(t):i.replace(/%s/i,t)}var aliases={};function addUnitAlias(e,t){var i=e.toLowerCase();aliases[i]=aliases[i+"s"]=aliases[t]=e}function normalizeUnits(e){return"string"==typeof e?aliases[e]||aliases[e.toLowerCase()]:void 0}function normalizeObjectUnits(e){var t,i,n={};for(i in e)hasOwnProp(e,i)&&(t=normalizeUnits(i))&&(n[t]=e[i]);return n}var priorities={};function addUnitPriority(e,t){priorities[e]=t}function getPrioritizedUnits(e){var t=[];for(var i in e)t.push({unit:i,priority:priorities[i]});return t.sort(function(e,t){return e.priority-t.priority}),t}function zeroFill(e,t,i){var n=""+Math.abs(e),s=t-n.length;return(e>=0?i?"+":"":"-")+Math.pow(10,Math.max(0,s)).toString().substr(1)+n}var formattingTokens=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,localFormattingTokens=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,formatFunctions={},formatTokenFunctions={};function addFormatToken(e,t,i,n){var s=n;"string"==typeof n&&(s=function(){return this[n]()}),e&&(formatTokenFunctions[e]=s),t&&(formatTokenFunctions[t[0]]=function(){return zeroFill(s.apply(this,arguments),t[1],t[2])}),i&&(formatTokenFunctions[i]=function(){return this.localeData().ordinal(s.apply(this,arguments),e)})}function removeFormattingTokens(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function makeFormatFunction(e){var t,i,n=e.match(formattingTokens);for(t=0,i=n.length;t<i;t++)formatTokenFunctions[n[t]]?n[t]=formatTokenFunctions[n[t]]:n[t]=removeFormattingTokens(n[t]);return function(t){var s,o="";for(s=0;s<i;s++)o+=isFunction(n[s])?n[s].call(t,e):n[s];return o}}function formatMoment(e,t){return e.isValid()?(t=expandFormat(t,e.localeData()),formatFunctions[t]=formatFunctions[t]||makeFormatFunction(t),formatFunctions[t](e)):e.localeData().invalidDate()}function expandFormat(e,t){var i=5;function n(e){return t.longDateFormat(e)||e}for(localFormattingTokens.lastIndex=0;i>=0&&localFormattingTokens.test(e);)e=e.replace(localFormattingTokens,n),localFormattingTokens.lastIndex=0,i-=1;return e}var match1=/\d/,match2=/\d\d/,match3=/\d{3}/,match4=/\d{4}/,match6=/[+-]?\d{6}/,match1to2=/\d\d?/,match3to4=/\d\d\d\d?/,match5to6=/\d\d\d\d\d\d?/,match1to3=/\d{1,3}/,match1to4=/\d{1,4}/,match1to6=/[+-]?\d{1,6}/,matchUnsigned=/\d+/,matchSigned=/[+-]?\d+/,matchOffset=/Z|[+-]\d\d:?\d\d/gi,matchShortOffset=/Z|[+-]\d\d(?::?\d\d)?/gi,matchTimestamp=/[+-]?\d+(\.\d{1,3})?/,matchWord=/[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,regexes={};function addRegexToken(e,t,i){regexes[e]=isFunction(t)?t:function(e,n){return e&&i?i:t}}function getParseRegexForToken(e,t){return hasOwnProp(regexes,e)?regexes[e](t._strict,t._locale):new RegExp(unescapeFormat(e))}function unescapeFormat(e){return regexEscape(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(e,t,i,n,s){return t||i||n||s}))}function regexEscape(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}var tokens={};function addParseToken(e,t){var i,n=t;for("string"==typeof e&&(e=[e]),isNumber(t)&&(n=function(e,i){i[t]=toInt(e)}),i=0;i<e.length;i++)tokens[e[i]]=n}function addWeekParseToken(e,t){addParseToken(e,function(e,i,n,s){n._w=n._w||{},t(e,n._w,n,s)})}function addTimeToArrayFromToken(e,t,i){null!=t&&hasOwnProp(tokens,e)&&tokens[e](t,i._a,i,e)}var YEAR=0,MONTH=1,DATE=2,HOUR=3,MINUTE=4,SECOND=5,MILLISECOND=6,WEEK=7,WEEKDAY=8;function daysInYear(e){return isLeapYear(e)?366:365}function isLeapYear(e){return e%4==0&&e%100!=0||e%400==0}addFormatToken("Y",0,0,function(){var e=this.year();return e<=9999?""+e:"+"+e}),addFormatToken(0,["YY",2],0,function(){return this.year()%100}),addFormatToken(0,["YYYY",4],0,"year"),addFormatToken(0,["YYYYY",5],0,"year"),addFormatToken(0,["YYYYYY",6,!0],0,"year"),addUnitAlias("year","y"),addUnitPriority("year",1),addRegexToken("Y",matchSigned),addRegexToken("YY",match1to2,match2),addRegexToken("YYYY",match1to4,match4),addRegexToken("YYYYY",match1to6,match6),addRegexToken("YYYYYY",match1to6,match6),addParseToken(["YYYYY","YYYYYY"],YEAR),addParseToken("YYYY",function(e,t){t[YEAR]=2===e.length?hooks.parseTwoDigitYear(e):toInt(e)}),addParseToken("YY",function(e,t){t[YEAR]=hooks.parseTwoDigitYear(e)}),addParseToken("Y",function(e,t){t[YEAR]=parseInt(e,10)}),hooks.parseTwoDigitYear=function(e){return toInt(e)+(toInt(e)>68?1900:2e3)};var indexOf,getSetYear=makeGetSet("FullYear",!0);function getIsLeapYear(){return isLeapYear(this.year())}function makeGetSet(e,t){return function(i){return null!=i?(set$2(this,e,i),hooks.updateOffset(this,t),this):get$1(this,e)}}function get$1(e,t){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+t]():NaN}function set$2(e,t,i){e.isValid()&&!isNaN(i)&&("FullYear"===t&&isLeapYear(e.year())&&1===e.month()&&29===e.date()?e._d["set"+(e._isUTC?"UTC":"")+t](i,e.month(),daysInMonth(i,e.month())):e._d["set"+(e._isUTC?"UTC":"")+t](i))}function stringGet(e){return isFunction(this[e=normalizeUnits(e)])?this[e]():this}function stringSet(e,t){if("object"==typeof e)for(var i=getPrioritizedUnits(e=normalizeObjectUnits(e)),n=0;n<i.length;n++)this[i[n].unit](e[i[n].unit]);else if(isFunction(this[e=normalizeUnits(e)]))return this[e](t);return this}function mod(e,t){return(e%t+t)%t}function daysInMonth(e,t){if(isNaN(e)||isNaN(t))return NaN;var i=mod(t,12);return e+=(t-i)/12,1===i?isLeapYear(e)?29:28:31-i%7%2}indexOf=Array.prototype.indexOf?Array.prototype.indexOf:function(e){var t;for(t=0;t<this.length;++t)if(this[t]===e)return t;return-1},addFormatToken("M",["MM",2],"Mo",function(){return this.month()+1}),addFormatToken("MMM",0,0,function(e){return this.localeData().monthsShort(this,e)}),addFormatToken("MMMM",0,0,function(e){return this.localeData().months(this,e)}),addUnitAlias("month","M"),addUnitPriority("month",8),addRegexToken("M",match1to2),addRegexToken("MM",match1to2,match2),addRegexToken("MMM",function(e,t){return t.monthsShortRegex(e)}),addRegexToken("MMMM",function(e,t){return t.monthsRegex(e)}),addParseToken(["M","MM"],function(e,t){t[MONTH]=toInt(e)-1}),addParseToken(["MMM","MMMM"],function(e,t,i,n){var s=i._locale.monthsParse(e,n,i._strict);null!=s?t[MONTH]=s:getParsingFlags(i).invalidMonth=e});var MONTHS_IN_FORMAT=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,defaultLocaleMonths="January_February_March_April_May_June_July_August_September_October_November_December".split("_");function localeMonths(e,t){return e?isArray(this._months)?this._months[e.month()]:this._months[(this._months.isFormat||MONTHS_IN_FORMAT).test(t)?"format":"standalone"][e.month()]:isArray(this._months)?this._months:this._months.standalone}var defaultLocaleMonthsShort="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");function localeMonthsShort(e,t){return e?isArray(this._monthsShort)?this._monthsShort[e.month()]:this._monthsShort[MONTHS_IN_FORMAT.test(t)?"format":"standalone"][e.month()]:isArray(this._monthsShort)?this._monthsShort:this._monthsShort.standalone}function handleStrictParse(e,t,i){var n,s,o,a=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],n=0;n<12;++n)o=createUTC([2e3,n]),this._shortMonthsParse[n]=this.monthsShort(o,"").toLocaleLowerCase(),this._longMonthsParse[n]=this.months(o,"").toLocaleLowerCase();return i?"MMM"===t?-1!==(s=indexOf.call(this._shortMonthsParse,a))?s:null:-1!==(s=indexOf.call(this._longMonthsParse,a))?s:null:"MMM"===t?-1!==(s=indexOf.call(this._shortMonthsParse,a))?s:-1!==(s=indexOf.call(this._longMonthsParse,a))?s:null:-1!==(s=indexOf.call(this._longMonthsParse,a))?s:-1!==(s=indexOf.call(this._shortMonthsParse,a))?s:null}function localeMonthsParse(e,t,i){var n,s,o;if(this._monthsParseExact)return handleStrictParse.call(this,e,t,i);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),n=0;n<12;n++){if(s=createUTC([2e3,n]),i&&!this._longMonthsParse[n]&&(this._longMonthsParse[n]=new RegExp("^"+this.months(s,"").replace(".","")+"$","i"),this._shortMonthsParse[n]=new RegExp("^"+this.monthsShort(s,"").replace(".","")+"$","i")),i||this._monthsParse[n]||(o="^"+this.months(s,"")+"|^"+this.monthsShort(s,""),this._monthsParse[n]=new RegExp(o.replace(".",""),"i")),i&&"MMMM"===t&&this._longMonthsParse[n].test(e))return n;if(i&&"MMM"===t&&this._shortMonthsParse[n].test(e))return n;if(!i&&this._monthsParse[n].test(e))return n}}function setMonth(e,t){var i;if(!e.isValid())return e;if("string"==typeof t)if(/^\d+$/.test(t))t=toInt(t);else if(!isNumber(t=e.localeData().monthsParse(t)))return e;return i=Math.min(e.date(),daysInMonth(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,i),e}function getSetMonth(e){return null!=e?(setMonth(this,e),hooks.updateOffset(this,!0),this):get$1(this,"Month")}function getDaysInMonth(){return daysInMonth(this.year(),this.month())}var defaultMonthsShortRegex=matchWord;function monthsShortRegex(e){return this._monthsParseExact?(hasOwnProp(this,"_monthsRegex")||computeMonthsParse.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):(hasOwnProp(this,"_monthsShortRegex")||(this._monthsShortRegex=defaultMonthsShortRegex),this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex)}var defaultMonthsRegex=matchWord;function monthsRegex(e){return this._monthsParseExact?(hasOwnProp(this,"_monthsRegex")||computeMonthsParse.call(this),e?this._monthsStrictRegex:this._monthsRegex):(hasOwnProp(this,"_monthsRegex")||(this._monthsRegex=defaultMonthsRegex),this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex)}function computeMonthsParse(){function e(e,t){return t.length-e.length}var t,i,n=[],s=[],o=[];for(t=0;t<12;t++)i=createUTC([2e3,t]),n.push(this.monthsShort(i,"")),s.push(this.months(i,"")),o.push(this.months(i,"")),o.push(this.monthsShort(i,""));for(n.sort(e),s.sort(e),o.sort(e),t=0;t<12;t++)n[t]=regexEscape(n[t]),s[t]=regexEscape(s[t]);for(t=0;t<24;t++)o[t]=regexEscape(o[t]);this._monthsRegex=new RegExp("^("+o.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+s.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+n.join("|")+")","i")}function createDate(e,t,i,n,s,o,a){var r=new Date(e,t,i,n,s,o,a);return e<100&&e>=0&&isFinite(r.getFullYear())&&r.setFullYear(e),r}function createUTCDate(e){var t=new Date(Date.UTC.apply(null,arguments));return e<100&&e>=0&&isFinite(t.getUTCFullYear())&&t.setUTCFullYear(e),t}function firstWeekOffset(e,t,i){var n=7+t-i;return-((7+createUTCDate(e,0,n).getUTCDay()-t)%7)+n-1}function dayOfYearFromWeeks(e,t,i,n,s){var o,a,r=1+7*(t-1)+(7+i-n)%7+firstWeekOffset(e,n,s);return r<=0?a=daysInYear(o=e-1)+r:r>daysInYear(e)?(o=e+1,a=r-daysInYear(e)):(o=e,a=r),{year:o,dayOfYear:a}}function weekOfYear(e,t,i){var n,s,o=firstWeekOffset(e.year(),t,i),a=Math.floor((e.dayOfYear()-o-1)/7)+1;return a<1?n=a+weeksInYear(s=e.year()-1,t,i):a>weeksInYear(e.year(),t,i)?(n=a-weeksInYear(e.year(),t,i),s=e.year()+1):(s=e.year(),n=a),{week:n,year:s}}function weeksInYear(e,t,i){var n=firstWeekOffset(e,t,i),s=firstWeekOffset(e+1,t,i);return(daysInYear(e)-n+s)/7}function localeWeek(e){return weekOfYear(e,this._week.dow,this._week.doy).week}addFormatToken("w",["ww",2],"wo","week"),addFormatToken("W",["WW",2],"Wo","isoWeek"),addUnitAlias("week","w"),addUnitAlias("isoWeek","W"),addUnitPriority("week",5),addUnitPriority("isoWeek",5),addRegexToken("w",match1to2),addRegexToken("ww",match1to2,match2),addRegexToken("W",match1to2),addRegexToken("WW",match1to2,match2),addWeekParseToken(["w","ww","W","WW"],function(e,t,i,n){t[n.substr(0,1)]=toInt(e)});var defaultLocaleWeek={dow:0,doy:6};function localeFirstDayOfWeek(){return this._week.dow}function localeFirstDayOfYear(){return this._week.doy}function getSetWeek(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")}function getSetISOWeek(e){var t=weekOfYear(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")}function parseWeekday(e,t){return"string"!=typeof e?e:isNaN(e)?"number"==typeof(e=t.weekdaysParse(e))?e:null:parseInt(e,10)}function parseIsoWeekday(e,t){return"string"==typeof e?t.weekdaysParse(e)%7||7:isNaN(e)?null:e}addFormatToken("d",0,"do","day"),addFormatToken("dd",0,0,function(e){return this.localeData().weekdaysMin(this,e)}),addFormatToken("ddd",0,0,function(e){return this.localeData().weekdaysShort(this,e)}),addFormatToken("dddd",0,0,function(e){return this.localeData().weekdays(this,e)}),addFormatToken("e",0,0,"weekday"),addFormatToken("E",0,0,"isoWeekday"),addUnitAlias("day","d"),addUnitAlias("weekday","e"),addUnitAlias("isoWeekday","E"),addUnitPriority("day",11),addUnitPriority("weekday",11),addUnitPriority("isoWeekday",11),addRegexToken("d",match1to2),addRegexToken("e",match1to2),addRegexToken("E",match1to2),addRegexToken("dd",function(e,t){return t.weekdaysMinRegex(e)}),addRegexToken("ddd",function(e,t){return t.weekdaysShortRegex(e)}),addRegexToken("dddd",function(e,t){return t.weekdaysRegex(e)}),addWeekParseToken(["dd","ddd","dddd"],function(e,t,i,n){var s=i._locale.weekdaysParse(e,n,i._strict);null!=s?t.d=s:getParsingFlags(i).invalidWeekday=e}),addWeekParseToken(["d","e","E"],function(e,t,i,n){t[n]=toInt(e)});var defaultLocaleWeekdays="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_");function localeWeekdays(e,t){return e?isArray(this._weekdays)?this._weekdays[e.day()]:this._weekdays[this._weekdays.isFormat.test(t)?"format":"standalone"][e.day()]:isArray(this._weekdays)?this._weekdays:this._weekdays.standalone}var defaultLocaleWeekdaysShort="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_");function localeWeekdaysShort(e){return e?this._weekdaysShort[e.day()]:this._weekdaysShort}var defaultLocaleWeekdaysMin="Su_Mo_Tu_We_Th_Fr_Sa".split("_");function localeWeekdaysMin(e){return e?this._weekdaysMin[e.day()]:this._weekdaysMin}function handleStrictParse$1(e,t,i){var n,s,o,a=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],n=0;n<7;++n)o=createUTC([2e3,1]).day(n),this._minWeekdaysParse[n]=this.weekdaysMin(o,"").toLocaleLowerCase(),this._shortWeekdaysParse[n]=this.weekdaysShort(o,"").toLocaleLowerCase(),this._weekdaysParse[n]=this.weekdays(o,"").toLocaleLowerCase();return i?"dddd"===t?-1!==(s=indexOf.call(this._weekdaysParse,a))?s:null:"ddd"===t?-1!==(s=indexOf.call(this._shortWeekdaysParse,a))?s:null:-1!==(s=indexOf.call(this._minWeekdaysParse,a))?s:null:"dddd"===t?-1!==(s=indexOf.call(this._weekdaysParse,a))?s:-1!==(s=indexOf.call(this._shortWeekdaysParse,a))?s:-1!==(s=indexOf.call(this._minWeekdaysParse,a))?s:null:"ddd"===t?-1!==(s=indexOf.call(this._shortWeekdaysParse,a))?s:-1!==(s=indexOf.call(this._weekdaysParse,a))?s:-1!==(s=indexOf.call(this._minWeekdaysParse,a))?s:null:-1!==(s=indexOf.call(this._minWeekdaysParse,a))?s:-1!==(s=indexOf.call(this._weekdaysParse,a))?s:-1!==(s=indexOf.call(this._shortWeekdaysParse,a))?s:null}function localeWeekdaysParse(e,t,i){var n,s,o;if(this._weekdaysParseExact)return handleStrictParse$1.call(this,e,t,i);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),n=0;n<7;n++){if(s=createUTC([2e3,1]).day(n),i&&!this._fullWeekdaysParse[n]&&(this._fullWeekdaysParse[n]=new RegExp("^"+this.weekdays(s,"").replace(".","\\.?")+"$","i"),this._shortWeekdaysParse[n]=new RegExp("^"+this.weekdaysShort(s,"").replace(".","\\.?")+"$","i"),this._minWeekdaysParse[n]=new RegExp("^"+this.weekdaysMin(s,"").replace(".","\\.?")+"$","i")),this._weekdaysParse[n]||(o="^"+this.weekdays(s,"")+"|^"+this.weekdaysShort(s,"")+"|^"+this.weekdaysMin(s,""),this._weekdaysParse[n]=new RegExp(o.replace(".",""),"i")),i&&"dddd"===t&&this._fullWeekdaysParse[n].test(e))return n;if(i&&"ddd"===t&&this._shortWeekdaysParse[n].test(e))return n;if(i&&"dd"===t&&this._minWeekdaysParse[n].test(e))return n;if(!i&&this._weekdaysParse[n].test(e))return n}}function getSetDayOfWeek(e){if(!this.isValid())return null!=e?this:NaN;var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=parseWeekday(e,this.localeData()),this.add(e-t,"d")):t}function getSetLocaleDayOfWeek(e){if(!this.isValid())return null!=e?this:NaN;var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")}function getSetISODayOfWeek(e){if(!this.isValid())return null!=e?this:NaN;if(null!=e){var t=parseIsoWeekday(e,this.localeData());return this.day(this.day()%7?t:t-7)}return this.day()||7}var defaultWeekdaysRegex=matchWord;function weekdaysRegex(e){return this._weekdaysParseExact?(hasOwnProp(this,"_weekdaysRegex")||computeWeekdaysParse.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):(hasOwnProp(this,"_weekdaysRegex")||(this._weekdaysRegex=defaultWeekdaysRegex),this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex)}var defaultWeekdaysShortRegex=matchWord;function weekdaysShortRegex(e){return this._weekdaysParseExact?(hasOwnProp(this,"_weekdaysRegex")||computeWeekdaysParse.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(hasOwnProp(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=defaultWeekdaysShortRegex),this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)}var defaultWeekdaysMinRegex=matchWord;function weekdaysMinRegex(e){return this._weekdaysParseExact?(hasOwnProp(this,"_weekdaysRegex")||computeWeekdaysParse.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(hasOwnProp(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=defaultWeekdaysMinRegex),this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)}function computeWeekdaysParse(){function e(e,t){return t.length-e.length}var t,i,n,s,o,a=[],r=[],l=[],h=[];for(t=0;t<7;t++)i=createUTC([2e3,1]).day(t),n=this.weekdaysMin(i,""),s=this.weekdaysShort(i,""),o=this.weekdays(i,""),a.push(n),r.push(s),l.push(o),h.push(n),h.push(s),h.push(o);for(a.sort(e),r.sort(e),l.sort(e),h.sort(e),t=0;t<7;t++)r[t]=regexEscape(r[t]),l[t]=regexEscape(l[t]),h[t]=regexEscape(h[t]);this._weekdaysRegex=new RegExp("^("+h.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+l.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+r.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+a.join("|")+")","i")}function hFormat(){return this.hours()%12||12}function kFormat(){return this.hours()||24}function meridiem(e,t){addFormatToken(e,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)})}function matchMeridiem(e,t){return t._meridiemParse}function localeIsPM(e){return"p"===(e+"").toLowerCase().charAt(0)}addFormatToken("H",["HH",2],0,"hour"),addFormatToken("h",["hh",2],0,hFormat),addFormatToken("k",["kk",2],0,kFormat),addFormatToken("hmm",0,0,function(){return""+hFormat.apply(this)+zeroFill(this.minutes(),2)}),addFormatToken("hmmss",0,0,function(){return""+hFormat.apply(this)+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2)}),addFormatToken("Hmm",0,0,function(){return""+this.hours()+zeroFill(this.minutes(),2)}),addFormatToken("Hmmss",0,0,function(){return""+this.hours()+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2)}),meridiem("a",!0),meridiem("A",!1),addUnitAlias("hour","h"),addUnitPriority("hour",13),addRegexToken("a",matchMeridiem),addRegexToken("A",matchMeridiem),addRegexToken("H",match1to2),addRegexToken("h",match1to2),addRegexToken("k",match1to2),addRegexToken("HH",match1to2,match2),addRegexToken("hh",match1to2,match2),addRegexToken("kk",match1to2,match2),addRegexToken("hmm",match3to4),addRegexToken("hmmss",match5to6),addRegexToken("Hmm",match3to4),addRegexToken("Hmmss",match5to6),addParseToken(["H","HH"],HOUR),addParseToken(["k","kk"],function(e,t,i){var n=toInt(e);t[HOUR]=24===n?0:n}),addParseToken(["a","A"],function(e,t,i){i._isPm=i._locale.isPM(e),i._meridiem=e}),addParseToken(["h","hh"],function(e,t,i){t[HOUR]=toInt(e),getParsingFlags(i).bigHour=!0}),addParseToken("hmm",function(e,t,i){var n=e.length-2;t[HOUR]=toInt(e.substr(0,n)),t[MINUTE]=toInt(e.substr(n)),getParsingFlags(i).bigHour=!0}),addParseToken("hmmss",function(e,t,i){var n=e.length-4,s=e.length-2;t[HOUR]=toInt(e.substr(0,n)),t[MINUTE]=toInt(e.substr(n,2)),t[SECOND]=toInt(e.substr(s)),getParsingFlags(i).bigHour=!0}),addParseToken("Hmm",function(e,t,i){var n=e.length-2;t[HOUR]=toInt(e.substr(0,n)),t[MINUTE]=toInt(e.substr(n))}),addParseToken("Hmmss",function(e,t,i){var n=e.length-4,s=e.length-2;t[HOUR]=toInt(e.substr(0,n)),t[MINUTE]=toInt(e.substr(n,2)),t[SECOND]=toInt(e.substr(s))});var defaultLocaleMeridiemParse=/[ap]\.?m?\.?/i;function localeMeridiem(e,t,i){return e>11?i?"pm":"PM":i?"am":"AM"}var globalLocale,getSetHour=makeGetSet("Hours",!0),baseConfig={calendar:defaultCalendar,longDateFormat:defaultLongDateFormat,invalidDate:defaultInvalidDate,ordinal:defaultOrdinal,dayOfMonthOrdinalParse:defaultDayOfMonthOrdinalParse,relativeTime:defaultRelativeTime,months:defaultLocaleMonths,monthsShort:defaultLocaleMonthsShort,week:defaultLocaleWeek,weekdays:defaultLocaleWeekdays,weekdaysMin:defaultLocaleWeekdaysMin,weekdaysShort:defaultLocaleWeekdaysShort,meridiemParse:defaultLocaleMeridiemParse},locales={},localeFamilies={};function normalizeLocale(e){return e?e.toLowerCase().replace("_","-"):e}function chooseLocale(e){for(var t,i,n,s,o=0;o<e.length;){for(t=(s=normalizeLocale(e[o]).split("-")).length,i=(i=normalizeLocale(e[o+1]))?i.split("-"):null;t>0;){if(n=loadLocale(s.slice(0,t).join("-")))return n;if(i&&i.length>=t&&compareArrays(s,i,!0)>=t-1)break;t--}o++}return globalLocale}function loadLocale(e){var t=null;if(!locales[e]&&"undefined"!=typeof module&&module&&module.exports)try{t=globalLocale._abbr,require("./locale/"+e),getSetGlobalLocale(t)}catch(e){}return locales[e]}function getSetGlobalLocale(e,t){var i;return e&&((i=isUndefined(t)?getLocale(e):defineLocale(e,t))?globalLocale=i:"undefined"!=typeof console&&console.warn&&console.warn("Locale "+e+" not found. Did you forget to load it?")),globalLocale._abbr}function defineLocale(e,t){if(null!==t){var i,n=baseConfig;if(t.abbr=e,null!=locales[e])deprecateSimple("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),n=locales[e]._config;else if(null!=t.parentLocale)if(null!=locales[t.parentLocale])n=locales[t.parentLocale]._config;else{if(null==(i=loadLocale(t.parentLocale)))return localeFamilies[t.parentLocale]||(localeFamilies[t.parentLocale]=[]),localeFamilies[t.parentLocale].push({name:e,config:t}),null;n=i._config}return locales[e]=new Locale(mergeConfigs(n,t)),localeFamilies[e]&&localeFamilies[e].forEach(function(e){defineLocale(e.name,e.config)}),getSetGlobalLocale(e),locales[e]}return delete locales[e],null}function updateLocale(e,t){if(null!=t){var i,n,s=baseConfig;null!=(n=loadLocale(e))&&(s=n._config),(i=new Locale(t=mergeConfigs(s,t))).parentLocale=locales[e],locales[e]=i,getSetGlobalLocale(e)}else null!=locales[e]&&(null!=locales[e].parentLocale?locales[e]=locales[e].parentLocale:null!=locales[e]&&delete locales[e]);return locales[e]}function getLocale(e){var t;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return globalLocale;if(!isArray(e)){if(t=loadLocale(e))return t;e=[e]}return chooseLocale(e)}function listLocales(){return keys(locales)}function checkOverflow(e){var t,i=e._a;return i&&-2===getParsingFlags(e).overflow&&(t=i[MONTH]<0||i[MONTH]>11?MONTH:i[DATE]<1||i[DATE]>daysInMonth(i[YEAR],i[MONTH])?DATE:i[HOUR]<0||i[HOUR]>24||24===i[HOUR]&&(0!==i[MINUTE]||0!==i[SECOND]||0!==i[MILLISECOND])?HOUR:i[MINUTE]<0||i[MINUTE]>59?MINUTE:i[SECOND]<0||i[SECOND]>59?SECOND:i[MILLISECOND]<0||i[MILLISECOND]>999?MILLISECOND:-1,getParsingFlags(e)._overflowDayOfYear&&(t<YEAR||t>DATE)&&(t=DATE),getParsingFlags(e)._overflowWeeks&&-1===t&&(t=WEEK),getParsingFlags(e)._overflowWeekday&&-1===t&&(t=WEEKDAY),getParsingFlags(e).overflow=t),e}function defaults(e,t,i){return null!=e?e:null!=t?t:i}function currentDateArray(e){var t=new Date(hooks.now());return e._useUTC?[t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()]:[t.getFullYear(),t.getMonth(),t.getDate()]}function configFromArray(e){var t,i,n,s,o,a=[];if(!e._d){for(n=currentDateArray(e),e._w&&null==e._a[DATE]&&null==e._a[MONTH]&&dayOfYearFromWeekInfo(e),null!=e._dayOfYear&&(o=defaults(e._a[YEAR],n[YEAR]),(e._dayOfYear>daysInYear(o)||0===e._dayOfYear)&&(getParsingFlags(e)._overflowDayOfYear=!0),i=createUTCDate(o,0,e._dayOfYear),e._a[MONTH]=i.getUTCMonth(),e._a[DATE]=i.getUTCDate()),t=0;t<3&&null==e._a[t];++t)e._a[t]=a[t]=n[t];for(;t<7;t++)e._a[t]=a[t]=null==e._a[t]?2===t?1:0:e._a[t];24===e._a[HOUR]&&0===e._a[MINUTE]&&0===e._a[SECOND]&&0===e._a[MILLISECOND]&&(e._nextDay=!0,e._a[HOUR]=0),e._d=(e._useUTC?createUTCDate:createDate).apply(null,a),s=e._useUTC?e._d.getUTCDay():e._d.getDay(),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[HOUR]=24),e._w&&void 0!==e._w.d&&e._w.d!==s&&(getParsingFlags(e).weekdayMismatch=!0)}}function dayOfYearFromWeekInfo(e){var t,i,n,s,o,a,r,l;if(null!=(t=e._w).GG||null!=t.W||null!=t.E)o=1,a=4,i=defaults(t.GG,e._a[YEAR],weekOfYear(createLocal(),1,4).year),n=defaults(t.W,1),((s=defaults(t.E,1))<1||s>7)&&(l=!0);else{o=e._locale._week.dow,a=e._locale._week.doy;var h=weekOfYear(createLocal(),o,a);i=defaults(t.gg,e._a[YEAR],h.year),n=defaults(t.w,h.week),null!=t.d?((s=t.d)<0||s>6)&&(l=!0):null!=t.e?(s=t.e+o,(t.e<0||t.e>6)&&(l=!0)):s=o}n<1||n>weeksInYear(i,o,a)?getParsingFlags(e)._overflowWeeks=!0:null!=l?getParsingFlags(e)._overflowWeekday=!0:(r=dayOfYearFromWeeks(i,n,s,o,a),e._a[YEAR]=r.year,e._dayOfYear=r.dayOfYear)}var extendedIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,basicIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,tzRegex=/Z|[+-]\d\d(?::?\d\d)?/,isoDates=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],isoTimes=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],aspNetJsonRegex=/^\/?Date\((\-?\d+)/i;function configFromISO(e){var t,i,n,s,o,a,r=e._i,l=extendedIsoRegex.exec(r)||basicIsoRegex.exec(r);if(l){for(getParsingFlags(e).iso=!0,t=0,i=isoDates.length;t<i;t++)if(isoDates[t][1].exec(l[1])){s=isoDates[t][0],n=!1!==isoDates[t][2];break}if(null==s)return void(e._isValid=!1);if(l[3]){for(t=0,i=isoTimes.length;t<i;t++)if(isoTimes[t][1].exec(l[3])){o=(l[2]||" ")+isoTimes[t][0];break}if(null==o)return void(e._isValid=!1)}if(!n&&null!=o)return void(e._isValid=!1);if(l[4]){if(!tzRegex.exec(l[4]))return void(e._isValid=!1);a="Z"}e._f=s+(o||"")+(a||""),configFromStringAndFormat(e)}else e._isValid=!1}var rfc2822=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;function extractFromRFC2822Strings(e,t,i,n,s,o){var a=[untruncateYear(e),defaultLocaleMonthsShort.indexOf(t),parseInt(i,10),parseInt(n,10),parseInt(s,10)];return o&&a.push(parseInt(o,10)),a}function untruncateYear(e){var t=parseInt(e,10);return t<=49?2e3+t:t<=999?1900+t:t}function preprocessRFC2822(e){return e.replace(/\([^)]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").replace(/^\s\s*/,"").replace(/\s\s*$/,"")}function checkWeekday(e,t,i){if(e&&defaultLocaleWeekdaysShort.indexOf(e)!==new Date(t[0],t[1],t[2]).getDay())return getParsingFlags(i).weekdayMismatch=!0,i._isValid=!1,!1;return!0}var obsOffsets={UT:0,GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function calculateOffset(e,t,i){if(e)return obsOffsets[e];if(t)return 0;var n=parseInt(i,10),s=n%100;return 60*((n-s)/100)+s}function configFromRFC2822(e){var t=rfc2822.exec(preprocessRFC2822(e._i));if(t){var i=extractFromRFC2822Strings(t[4],t[3],t[2],t[5],t[6],t[7]);if(!checkWeekday(t[1],i,e))return;e._a=i,e._tzm=calculateOffset(t[8],t[9],t[10]),e._d=createUTCDate.apply(null,e._a),e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),getParsingFlags(e).rfc2822=!0}else e._isValid=!1}function configFromString(e){var t=aspNetJsonRegex.exec(e._i);null===t?(configFromISO(e),!1===e._isValid&&(delete e._isValid,configFromRFC2822(e),!1===e._isValid&&(delete e._isValid,hooks.createFromInputFallback(e)))):e._d=new Date(+t[1])}function configFromStringAndFormat(e){if(e._f!==hooks.ISO_8601)if(e._f!==hooks.RFC_2822){e._a=[],getParsingFlags(e).empty=!0;var t,i,n,s,o,a=""+e._i,r=a.length,l=0;for(n=expandFormat(e._f,e._locale).match(formattingTokens)||[],t=0;t<n.length;t++)s=n[t],(i=(a.match(getParseRegexForToken(s,e))||[])[0])&&((o=a.substr(0,a.indexOf(i))).length>0&&getParsingFlags(e).unusedInput.push(o),a=a.slice(a.indexOf(i)+i.length),l+=i.length),formatTokenFunctions[s]?(i?getParsingFlags(e).empty=!1:getParsingFlags(e).unusedTokens.push(s),addTimeToArrayFromToken(s,i,e)):e._strict&&!i&&getParsingFlags(e).unusedTokens.push(s);getParsingFlags(e).charsLeftOver=r-l,a.length>0&&getParsingFlags(e).unusedInput.push(a),e._a[HOUR]<=12&&!0===getParsingFlags(e).bigHour&&e._a[HOUR]>0&&(getParsingFlags(e).bigHour=void 0),getParsingFlags(e).parsedDateParts=e._a.slice(0),getParsingFlags(e).meridiem=e._meridiem,e._a[HOUR]=meridiemFixWrap(e._locale,e._a[HOUR],e._meridiem),configFromArray(e),checkOverflow(e)}else configFromRFC2822(e);else configFromISO(e)}function meridiemFixWrap(e,t,i){var n;return null==i?t:null!=e.meridiemHour?e.meridiemHour(t,i):null!=e.isPM?((n=e.isPM(i))&&t<12&&(t+=12),n||12!==t||(t=0),t):t}function configFromStringAndArray(e){var t,i,n,s,o;if(0===e._f.length)return getParsingFlags(e).invalidFormat=!0,void(e._d=new Date(NaN));for(s=0;s<e._f.length;s++)o=0,t=copyConfig({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[s],configFromStringAndFormat(t),isValid$1(t)&&(o+=getParsingFlags(t).charsLeftOver,o+=10*getParsingFlags(t).unusedTokens.length,getParsingFlags(t).score=o,(null==n||o<n)&&(n=o,i=t));extend(e,i||t)}function configFromObject(e){if(!e._d){var t=normalizeObjectUnits(e._i);e._a=map([t.year,t.month,t.day||t.date,t.hour,t.minute,t.second,t.millisecond],function(e){return e&&parseInt(e,10)}),configFromArray(e)}}function createFromConfig(e){var t=new Moment(checkOverflow(prepareConfig(e)));return t._nextDay&&(t.add(1,"d"),t._nextDay=void 0),t}function prepareConfig(e){var t=e._i,i=e._f;return e._locale=e._locale||getLocale(e._l),null===t||void 0===i&&""===t?createInvalid({nullInput:!0}):("string"==typeof t&&(e._i=t=e._locale.preparse(t)),isMoment(t)?new Moment(checkOverflow(t)):(isDate(t)?e._d=t:isArray(i)?configFromStringAndArray(e):i?configFromStringAndFormat(e):configFromInput(e),isValid$1(e)||(e._d=null),e))}function configFromInput(e){var t=e._i;isUndefined(t)?e._d=new Date(hooks.now()):isDate(t)?e._d=new Date(t.valueOf()):"string"==typeof t?configFromString(e):isArray(t)?(e._a=map(t.slice(0),function(e){return parseInt(e,10)}),configFromArray(e)):isObject(t)?configFromObject(e):isNumber(t)?e._d=new Date(t):hooks.createFromInputFallback(e)}function createLocalOrUTC(e,t,i,n,s){var o={};return!0!==i&&!1!==i||(n=i,i=void 0),(isObject(e)&&isObjectEmpty(e)||isArray(e)&&0===e.length)&&(e=void 0),o._isAMomentObject=!0,o._useUTC=o._isUTC=s,o._l=i,o._i=e,o._f=t,o._strict=n,createFromConfig(o)}function createLocal(e,t,i,n){return createLocalOrUTC(e,t,i,n,!1)}hooks.createFromInputFallback=deprecate("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))}),hooks.ISO_8601=function(){},hooks.RFC_2822=function(){};var prototypeMin=deprecate("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=createLocal.apply(null,arguments);return this.isValid()&&e.isValid()?e<this?this:e:createInvalid()}),prototypeMax=deprecate("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=createLocal.apply(null,arguments);return this.isValid()&&e.isValid()?e>this?this:e:createInvalid()});function pickBy(e,t){var i,n;if(1===t.length&&isArray(t[0])&&(t=t[0]),!t.length)return createLocal();for(i=t[0],n=1;n<t.length;++n)t[n].isValid()&&!t[n][e](i)||(i=t[n]);return i}function min(){return pickBy("isBefore",[].slice.call(arguments,0))}function max(){return pickBy("isAfter",[].slice.call(arguments,0))}var now=function(){return Date.now?Date.now():+new Date},ordering=["year","quarter","month","week","day","hour","minute","second","millisecond"];function isDurationValid(e){for(var t in e)if(-1===indexOf.call(ordering,t)||null!=e[t]&&isNaN(e[t]))return!1;for(var i=!1,n=0;n<ordering.length;++n)if(e[ordering[n]]){if(i)return!1;parseFloat(e[ordering[n]])!==toInt(e[ordering[n]])&&(i=!0)}return!0}function isValid$2(){return this._isValid}function createInvalid$1(){return createDuration(NaN)}function Duration(e){var t=normalizeObjectUnits(e),i=t.year||0,n=t.quarter||0,s=t.month||0,o=t.week||0,a=t.day||0,r=t.hour||0,l=t.minute||0,h=t.second||0,c=t.millisecond||0;this._isValid=isDurationValid(t),this._milliseconds=+c+1e3*h+6e4*l+1e3*r*60*60,this._days=+a+7*o,this._months=+s+3*n+12*i,this._data={},this._locale=getLocale(),this._bubble()}function isDuration(e){return e instanceof Duration}function absRound(e){return e<0?-1*Math.round(-1*e):Math.round(e)}function offset(e,t){addFormatToken(e,0,0,function(){var e=this.utcOffset(),i="+";return e<0&&(e=-e,i="-"),i+zeroFill(~~(e/60),2)+t+zeroFill(~~e%60,2)})}offset("Z",":"),offset("ZZ",""),addRegexToken("Z",matchShortOffset),addRegexToken("ZZ",matchShortOffset),addParseToken(["Z","ZZ"],function(e,t,i){i._useUTC=!0,i._tzm=offsetFromString(matchShortOffset,e)});var chunkOffset=/([\+\-]|\d\d)/gi;function offsetFromString(e,t){var i=(t||"").match(e);if(null===i)return null;var n=((i[i.length-1]||[])+"").match(chunkOffset)||["-",0,0],s=60*n[1]+toInt(n[2]);return 0===s?0:"+"===n[0]?s:-s}function cloneWithOffset(e,t){var i,n;return t._isUTC?(i=t.clone(),n=(isMoment(e)||isDate(e)?e.valueOf():createLocal(e).valueOf())-i.valueOf(),i._d.setTime(i._d.valueOf()+n),hooks.updateOffset(i,!1),i):createLocal(e).local()}function getDateOffset(e){return 15*-Math.round(e._d.getTimezoneOffset()/15)}function getSetOffset(e,t,i){var n,s=this._offset||0;if(!this.isValid())return null!=e?this:NaN;if(null!=e){if("string"==typeof e){if(null===(e=offsetFromString(matchShortOffset,e)))return this}else Math.abs(e)<16&&!i&&(e*=60);return!this._isUTC&&t&&(n=getDateOffset(this)),this._offset=e,this._isUTC=!0,null!=n&&this.add(n,"m"),s!==e&&(!t||this._changeInProgress?addSubtract(this,createDuration(e-s,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,hooks.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?s:getDateOffset(this)}function getSetZone(e,t){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()}function setOffsetToUTC(e){return this.utcOffset(0,e)}function setOffsetToLocal(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(getDateOffset(this),"m")),this}function setOffsetToParsedOffset(){if(null!=this._tzm)this.utcOffset(this._tzm,!1,!0);else if("string"==typeof this._i){var e=offsetFromString(matchOffset,this._i);null!=e?this.utcOffset(e):this.utcOffset(0,!0)}return this}function hasAlignedHourOffset(e){return!!this.isValid()&&(e=e?createLocal(e).utcOffset():0,(this.utcOffset()-e)%60==0)}function isDaylightSavingTime(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function isDaylightSavingTimeShifted(){if(!isUndefined(this._isDSTShifted))return this._isDSTShifted;var e={};if(copyConfig(e,this),(e=prepareConfig(e))._a){var t=e._isUTC?createUTC(e._a):createLocal(e._a);this._isDSTShifted=this.isValid()&&compareArrays(e._a,t.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function isLocal(){return!!this.isValid()&&!this._isUTC}function isUtcOffset(){return!!this.isValid()&&this._isUTC}function isUtc(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}hooks.updateOffset=function(){};var aspNetRegex=/^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,isoRegex=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;function createDuration(e,t){var i,n,s,o=e,a=null;return isDuration(e)?o={ms:e._milliseconds,d:e._days,M:e._months}:isNumber(e)?(o={},t?o[t]=e:o.milliseconds=e):(a=aspNetRegex.exec(e))?(i="-"===a[1]?-1:1,o={y:0,d:toInt(a[DATE])*i,h:toInt(a[HOUR])*i,m:toInt(a[MINUTE])*i,s:toInt(a[SECOND])*i,ms:toInt(absRound(1e3*a[MILLISECOND]))*i}):(a=isoRegex.exec(e))?(i="-"===a[1]?-1:(a[1],1),o={y:parseIso(a[2],i),M:parseIso(a[3],i),w:parseIso(a[4],i),d:parseIso(a[5],i),h:parseIso(a[6],i),m:parseIso(a[7],i),s:parseIso(a[8],i)}):null==o?o={}:"object"==typeof o&&("from"in o||"to"in o)&&(s=momentsDifference(createLocal(o.from),createLocal(o.to)),(o={}).ms=s.milliseconds,o.M=s.months),n=new Duration(o),isDuration(e)&&hasOwnProp(e,"_locale")&&(n._locale=e._locale),n}function parseIso(e,t){var i=e&&parseFloat(e.replace(",","."));return(isNaN(i)?0:i)*t}function positiveMomentsDifference(e,t){var i={milliseconds:0,months:0};return i.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(i.months,"M").isAfter(t)&&--i.months,i.milliseconds=+t-+e.clone().add(i.months,"M"),i}function momentsDifference(e,t){var i;return e.isValid()&&t.isValid()?(t=cloneWithOffset(t,e),e.isBefore(t)?i=positiveMomentsDifference(e,t):((i=positiveMomentsDifference(t,e)).milliseconds=-i.milliseconds,i.months=-i.months),i):{milliseconds:0,months:0}}function createAdder(e,t){return function(i,n){var s;return null===n||isNaN(+n)||(deprecateSimple(t,"moment()."+t+"(period, number) is deprecated. Please use moment()."+t+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),s=i,i=n,n=s),addSubtract(this,createDuration(i="string"==typeof i?+i:i,n),e),this}}function addSubtract(e,t,i,n){var s=t._milliseconds,o=absRound(t._days),a=absRound(t._months);e.isValid()&&(n=null==n||n,a&&setMonth(e,get$1(e,"Month")+a*i),o&&set$2(e,"Date",get$1(e,"Date")+o*i),s&&e._d.setTime(e._d.valueOf()+s*i),n&&hooks.updateOffset(e,o||a))}createDuration.fn=Duration.prototype,createDuration.invalid=createInvalid$1;var add$1=createAdder(1,"add"),subtract=createAdder(-1,"subtract");function getCalendarFormat(e,t){var i=e.diff(t,"days",!0);return i<-6?"sameElse":i<-1?"lastWeek":i<0?"lastDay":i<1?"sameDay":i<2?"nextDay":i<7?"nextWeek":"sameElse"}function calendar$1(e,t){var i=e||createLocal(),n=cloneWithOffset(i,this).startOf("day"),s=hooks.calendarFormat(this,n)||"sameElse",o=t&&(isFunction(t[s])?t[s].call(this,i):t[s]);return this.format(o||this.localeData().calendar(s,this,createLocal(i)))}function clone(){return new Moment(this)}function isAfter(e,t){var i=isMoment(e)?e:createLocal(e);return!(!this.isValid()||!i.isValid())&&("millisecond"===(t=normalizeUnits(isUndefined(t)?"millisecond":t))?this.valueOf()>i.valueOf():i.valueOf()<this.clone().startOf(t).valueOf())}function isBefore(e,t){var i=isMoment(e)?e:createLocal(e);return!(!this.isValid()||!i.isValid())&&("millisecond"===(t=normalizeUnits(isUndefined(t)?"millisecond":t))?this.valueOf()<i.valueOf():this.clone().endOf(t).valueOf()<i.valueOf())}function isBetween(e,t,i,n){return("("===(n=n||"()")[0]?this.isAfter(e,i):!this.isBefore(e,i))&&(")"===n[1]?this.isBefore(t,i):!this.isAfter(t,i))}function isSame(e,t){var i,n=isMoment(e)?e:createLocal(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=normalizeUnits(t||"millisecond"))?this.valueOf()===n.valueOf():(i=n.valueOf(),this.clone().startOf(t).valueOf()<=i&&i<=this.clone().endOf(t).valueOf()))}function isSameOrAfter(e,t){return this.isSame(e,t)||this.isAfter(e,t)}function isSameOrBefore(e,t){return this.isSame(e,t)||this.isBefore(e,t)}function diff(e,t,i){var n,s,o;if(!this.isValid())return NaN;if(!(n=cloneWithOffset(e,this)).isValid())return NaN;switch(s=6e4*(n.utcOffset()-this.utcOffset()),t=normalizeUnits(t)){case"year":o=monthDiff(this,n)/12;break;case"month":o=monthDiff(this,n);break;case"quarter":o=monthDiff(this,n)/3;break;case"second":o=(this-n)/1e3;break;case"minute":o=(this-n)/6e4;break;case"hour":o=(this-n)/36e5;break;case"day":o=(this-n-s)/864e5;break;case"week":o=(this-n-s)/6048e5;break;default:o=this-n}return i?o:absFloor(o)}function monthDiff(e,t){var i=12*(t.year()-e.year())+(t.month()-e.month()),n=e.clone().add(i,"months");return-(i+(t-n<0?(t-n)/(n-e.clone().add(i-1,"months")):(t-n)/(e.clone().add(i+1,"months")-n)))||0}function toString(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function toISOString(e){if(!this.isValid())return null;var t=!0!==e,i=t?this.clone().utc():this;return i.year()<0||i.year()>9999?formatMoment(i,t?"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"):isFunction(Date.prototype.toISOString)?t?this.toDate().toISOString():new Date(this.valueOf()+60*this.utcOffset()*1e3).toISOString().replace("Z",formatMoment(i,"Z")):formatMoment(i,t?"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYY-MM-DD[T]HH:mm:ss.SSSZ")}function inspect(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var e="moment",t="";this.isLocal()||(e=0===this.utcOffset()?"moment.utc":"moment.parseZone",t="Z");var i="["+e+'("]',n=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY",s=t+'[")]';return this.format(i+n+"-MM-DD[T]HH:mm:ss.SSS"+s)}function format(e){e||(e=this.isUtc()?hooks.defaultFormatUtc:hooks.defaultFormat);var t=formatMoment(this,e);return this.localeData().postformat(t)}function from(e,t){return this.isValid()&&(isMoment(e)&&e.isValid()||createLocal(e).isValid())?createDuration({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()}function fromNow(e){return this.from(createLocal(),e)}function to(e,t){return this.isValid()&&(isMoment(e)&&e.isValid()||createLocal(e).isValid())?createDuration({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()}function toNow(e){return this.to(createLocal(),e)}function locale(e){var t;return void 0===e?this._locale._abbr:(null!=(t=getLocale(e))&&(this._locale=t),this)}hooks.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",hooks.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var lang=deprecate("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(e){return void 0===e?this.localeData():this.locale(e)});function localeData(){return this._locale}function startOf(e){switch(e=normalizeUnits(e)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":case"date":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===e&&this.weekday(0),"isoWeek"===e&&this.isoWeekday(1),"quarter"===e&&this.month(3*Math.floor(this.month()/3)),this}function endOf(e){return void 0===(e=normalizeUnits(e))||"millisecond"===e?this:("date"===e&&(e="day"),this.startOf(e).add(1,"isoWeek"===e?"week":e).subtract(1,"ms"))}function valueOf(){return this._d.valueOf()-6e4*(this._offset||0)}function unix(){return Math.floor(this.valueOf()/1e3)}function toDate(){return new Date(this.valueOf())}function toArray(){var e=this;return[e.year(),e.month(),e.date(),e.hour(),e.minute(),e.second(),e.millisecond()]}function toObject(){var e=this;return{years:e.year(),months:e.month(),date:e.date(),hours:e.hours(),minutes:e.minutes(),seconds:e.seconds(),milliseconds:e.milliseconds()}}function toJSON(){return this.isValid()?this.toISOString():null}function isValid$3(){return isValid$1(this)}function parsingFlags(){return extend({},getParsingFlags(this))}function invalidAt(){return getParsingFlags(this).overflow}function creationData(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}}function addWeekYearFormatToken(e,t){addFormatToken(0,[e,e.length],0,t)}function getSetWeekYear(e){return getSetWeekYearHelper.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)}function getSetISOWeekYear(e){return getSetWeekYearHelper.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)}function getISOWeeksInYear(){return weeksInYear(this.year(),1,4)}function getWeeksInYear(){var e=this.localeData()._week;return weeksInYear(this.year(),e.dow,e.doy)}function getSetWeekYearHelper(e,t,i,n,s){var o;return null==e?weekOfYear(this,n,s).year:(t>(o=weeksInYear(e,n,s))&&(t=o),setWeekAll.call(this,e,t,i,n,s))}function setWeekAll(e,t,i,n,s){var o=dayOfYearFromWeeks(e,t,i,n,s),a=createUTCDate(o.year,0,o.dayOfYear);return this.year(a.getUTCFullYear()),this.month(a.getUTCMonth()),this.date(a.getUTCDate()),this}function getSetQuarter(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)}addFormatToken(0,["gg",2],0,function(){return this.weekYear()%100}),addFormatToken(0,["GG",2],0,function(){return this.isoWeekYear()%100}),addWeekYearFormatToken("gggg","weekYear"),addWeekYearFormatToken("ggggg","weekYear"),addWeekYearFormatToken("GGGG","isoWeekYear"),addWeekYearFormatToken("GGGGG","isoWeekYear"),addUnitAlias("weekYear","gg"),addUnitAlias("isoWeekYear","GG"),addUnitPriority("weekYear",1),addUnitPriority("isoWeekYear",1),addRegexToken("G",matchSigned),addRegexToken("g",matchSigned),addRegexToken("GG",match1to2,match2),addRegexToken("gg",match1to2,match2),addRegexToken("GGGG",match1to4,match4),addRegexToken("gggg",match1to4,match4),addRegexToken("GGGGG",match1to6,match6),addRegexToken("ggggg",match1to6,match6),addWeekParseToken(["gggg","ggggg","GGGG","GGGGG"],function(e,t,i,n){t[n.substr(0,2)]=toInt(e)}),addWeekParseToken(["gg","GG"],function(e,t,i,n){t[n]=hooks.parseTwoDigitYear(e)}),addFormatToken("Q",0,"Qo","quarter"),addUnitAlias("quarter","Q"),addUnitPriority("quarter",7),addRegexToken("Q",match1),addParseToken("Q",function(e,t){t[MONTH]=3*(toInt(e)-1)}),addFormatToken("D",["DD",2],"Do","date"),addUnitAlias("date","D"),addUnitPriority("date",9),addRegexToken("D",match1to2),addRegexToken("DD",match1to2,match2),addRegexToken("Do",function(e,t){return e?t._dayOfMonthOrdinalParse||t._ordinalParse:t._dayOfMonthOrdinalParseLenient}),addParseToken(["D","DD"],DATE),addParseToken("Do",function(e,t){t[DATE]=toInt(e.match(match1to2)[0])});var getSetDayOfMonth=makeGetSet("Date",!0);function getSetDayOfYear(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")}addFormatToken("DDD",["DDDD",3],"DDDo","dayOfYear"),addUnitAlias("dayOfYear","DDD"),addUnitPriority("dayOfYear",4),addRegexToken("DDD",match1to3),addRegexToken("DDDD",match3),addParseToken(["DDD","DDDD"],function(e,t,i){i._dayOfYear=toInt(e)}),addFormatToken("m",["mm",2],0,"minute"),addUnitAlias("minute","m"),addUnitPriority("minute",14),addRegexToken("m",match1to2),addRegexToken("mm",match1to2,match2),addParseToken(["m","mm"],MINUTE);var getSetMinute=makeGetSet("Minutes",!1);addFormatToken("s",["ss",2],0,"second"),addUnitAlias("second","s"),addUnitPriority("second",15),addRegexToken("s",match1to2),addRegexToken("ss",match1to2,match2),addParseToken(["s","ss"],SECOND);var token,getSetSecond=makeGetSet("Seconds",!1);for(addFormatToken("S",0,0,function(){return~~(this.millisecond()/100)}),addFormatToken(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),addFormatToken(0,["SSS",3],0,"millisecond"),addFormatToken(0,["SSSS",4],0,function(){return 10*this.millisecond()}),addFormatToken(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),addFormatToken(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),addFormatToken(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),addFormatToken(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),addFormatToken(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),addUnitAlias("millisecond","ms"),addUnitPriority("millisecond",16),addRegexToken("S",match1to3,match1),addRegexToken("SS",match1to3,match2),addRegexToken("SSS",match1to3,match3),token="SSSS";token.length<=9;token+="S")addRegexToken(token,matchUnsigned);function parseMs(e,t){t[MILLISECOND]=toInt(1e3*("0."+e))}for(token="S";token.length<=9;token+="S")addParseToken(token,parseMs);var getSetMillisecond=makeGetSet("Milliseconds",!1);function getZoneAbbr(){return this._isUTC?"UTC":""}function getZoneName(){return this._isUTC?"Coordinated Universal Time":""}addFormatToken("z",0,0,"zoneAbbr"),addFormatToken("zz",0,0,"zoneName");var proto$1=Moment.prototype;function createUnix(e){return createLocal(1e3*e)}function createInZone(){return createLocal.apply(null,arguments).parseZone()}function preParsePostFormat(e){return e}proto$1.add=add$1,proto$1.calendar=calendar$1,proto$1.clone=clone,proto$1.diff=diff,proto$1.endOf=endOf,proto$1.format=format,proto$1.from=from,proto$1.fromNow=fromNow,proto$1.to=to,proto$1.toNow=toNow,proto$1.get=stringGet,proto$1.invalidAt=invalidAt,proto$1.isAfter=isAfter,proto$1.isBefore=isBefore,proto$1.isBetween=isBetween,proto$1.isSame=isSame,proto$1.isSameOrAfter=isSameOrAfter,proto$1.isSameOrBefore=isSameOrBefore,proto$1.isValid=isValid$3,proto$1.lang=lang,proto$1.locale=locale,proto$1.localeData=localeData,proto$1.max=prototypeMax,proto$1.min=prototypeMin,proto$1.parsingFlags=parsingFlags,proto$1.set=stringSet,proto$1.startOf=startOf,proto$1.subtract=subtract,proto$1.toArray=toArray,proto$1.toObject=toObject,proto$1.toDate=toDate,proto$1.toISOString=toISOString,proto$1.inspect=inspect,proto$1.toJSON=toJSON,proto$1.toString=toString,proto$1.unix=unix,proto$1.valueOf=valueOf,proto$1.creationData=creationData,proto$1.year=getSetYear,proto$1.isLeapYear=getIsLeapYear,proto$1.weekYear=getSetWeekYear,proto$1.isoWeekYear=getSetISOWeekYear,proto$1.quarter=proto$1.quarters=getSetQuarter,proto$1.month=getSetMonth,proto$1.daysInMonth=getDaysInMonth,proto$1.week=proto$1.weeks=getSetWeek,proto$1.isoWeek=proto$1.isoWeeks=getSetISOWeek,proto$1.weeksInYear=getWeeksInYear,proto$1.isoWeeksInYear=getISOWeeksInYear,proto$1.date=getSetDayOfMonth,proto$1.day=proto$1.days=getSetDayOfWeek,proto$1.weekday=getSetLocaleDayOfWeek,proto$1.isoWeekday=getSetISODayOfWeek,proto$1.dayOfYear=getSetDayOfYear,proto$1.hour=proto$1.hours=getSetHour,proto$1.minute=proto$1.minutes=getSetMinute,proto$1.second=proto$1.seconds=getSetSecond,proto$1.millisecond=proto$1.milliseconds=getSetMillisecond,proto$1.utcOffset=getSetOffset,proto$1.utc=setOffsetToUTC,proto$1.local=setOffsetToLocal,proto$1.parseZone=setOffsetToParsedOffset,proto$1.hasAlignedHourOffset=hasAlignedHourOffset,proto$1.isDST=isDaylightSavingTime,proto$1.isLocal=isLocal,proto$1.isUtcOffset=isUtcOffset,proto$1.isUtc=isUtc,proto$1.isUTC=isUtc,proto$1.zoneAbbr=getZoneAbbr,proto$1.zoneName=getZoneName,proto$1.dates=deprecate("dates accessor is deprecated. Use date instead.",getSetDayOfMonth),proto$1.months=deprecate("months accessor is deprecated. Use month instead",getSetMonth),proto$1.years=deprecate("years accessor is deprecated. Use year instead",getSetYear),proto$1.zone=deprecate("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",getSetZone),proto$1.isDSTShifted=deprecate("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",isDaylightSavingTimeShifted);var proto$2=Locale.prototype;function get$2(e,t,i,n){var s=getLocale(),o=createUTC().set(n,t);return s[i](o,e)}function listMonthsImpl(e,t,i){if(isNumber(e)&&(t=e,e=void 0),e=e||"",null!=t)return get$2(e,t,i,"month");var n,s=[];for(n=0;n<12;n++)s[n]=get$2(e,n,i,"month");return s}function listWeekdaysImpl(e,t,i,n){"boolean"==typeof e?(isNumber(t)&&(i=t,t=void 0),t=t||""):(i=t=e,e=!1,isNumber(t)&&(i=t,t=void 0),t=t||"");var s,o=getLocale(),a=e?o._week.dow:0;if(null!=i)return get$2(t,(i+a)%7,n,"day");var r=[];for(s=0;s<7;s++)r[s]=get$2(t,(s+a)%7,n,"day");return r}function listMonths(e,t){return listMonthsImpl(e,t,"months")}function listMonthsShort(e,t){return listMonthsImpl(e,t,"monthsShort")}function listWeekdays(e,t,i){return listWeekdaysImpl(e,t,i,"weekdays")}function listWeekdaysShort(e,t,i){return listWeekdaysImpl(e,t,i,"weekdaysShort")}function listWeekdaysMin(e,t,i){return listWeekdaysImpl(e,t,i,"weekdaysMin")}proto$2.calendar=calendar,proto$2.longDateFormat=longDateFormat,proto$2.invalidDate=invalidDate,proto$2.ordinal=ordinal,proto$2.preparse=preParsePostFormat,proto$2.postformat=preParsePostFormat,proto$2.relativeTime=relativeTime,proto$2.pastFuture=pastFuture,proto$2.set=set$1,proto$2.months=localeMonths,proto$2.monthsShort=localeMonthsShort,proto$2.monthsParse=localeMonthsParse,proto$2.monthsRegex=monthsRegex,proto$2.monthsShortRegex=monthsShortRegex,proto$2.week=localeWeek,proto$2.firstDayOfYear=localeFirstDayOfYear,proto$2.firstDayOfWeek=localeFirstDayOfWeek,proto$2.weekdays=localeWeekdays,proto$2.weekdaysMin=localeWeekdaysMin,proto$2.weekdaysShort=localeWeekdaysShort,proto$2.weekdaysParse=localeWeekdaysParse,proto$2.weekdaysRegex=weekdaysRegex,proto$2.weekdaysShortRegex=weekdaysShortRegex,proto$2.weekdaysMinRegex=weekdaysMinRegex,proto$2.isPM=localeIsPM,proto$2.meridiem=localeMeridiem,getSetGlobalLocale("en",{dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10;return e+(1===toInt(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")}}),hooks.lang=deprecate("moment.lang is deprecated. Use moment.locale instead.",getSetGlobalLocale),hooks.langData=deprecate("moment.langData is deprecated. Use moment.localeData instead.",getLocale);var mathAbs=Math.abs;function abs(){var e=this._data;return this._milliseconds=mathAbs(this._milliseconds),this._days=mathAbs(this._days),this._months=mathAbs(this._months),e.milliseconds=mathAbs(e.milliseconds),e.seconds=mathAbs(e.seconds),e.minutes=mathAbs(e.minutes),e.hours=mathAbs(e.hours),e.months=mathAbs(e.months),e.years=mathAbs(e.years),this}function addSubtract$1(e,t,i,n){var s=createDuration(t,i);return e._milliseconds+=n*s._milliseconds,e._days+=n*s._days,e._months+=n*s._months,e._bubble()}function add$2(e,t){return addSubtract$1(this,e,t,1)}function subtract$1(e,t){return addSubtract$1(this,e,t,-1)}function absCeil(e){return e<0?Math.floor(e):Math.ceil(e)}function bubble(){var e,t,i,n,s,o=this._milliseconds,a=this._days,r=this._months,l=this._data;return o>=0&&a>=0&&r>=0||o<=0&&a<=0&&r<=0||(o+=864e5*absCeil(monthsToDays(r)+a),a=0,r=0),l.milliseconds=o%1e3,e=absFloor(o/1e3),l.seconds=e%60,t=absFloor(e/60),l.minutes=t%60,i=absFloor(t/60),l.hours=i%24,a+=absFloor(i/24),r+=s=absFloor(daysToMonths(a)),a-=absCeil(monthsToDays(s)),n=absFloor(r/12),r%=12,l.days=a,l.months=r,l.years=n,this}function daysToMonths(e){return 4800*e/146097}function monthsToDays(e){return 146097*e/4800}function as(e){if(!this.isValid())return NaN;var t,i,n=this._milliseconds;if("month"===(e=normalizeUnits(e))||"year"===e)return t=this._days+n/864e5,i=this._months+daysToMonths(t),"month"===e?i:i/12;switch(t=this._days+Math.round(monthsToDays(this._months)),e){case"week":return t/7+n/6048e5;case"day":return t+n/864e5;case"hour":return 24*t+n/36e5;case"minute":return 1440*t+n/6e4;case"second":return 86400*t+n/1e3;case"millisecond":return Math.floor(864e5*t)+n;default:throw new Error("Unknown unit "+e)}}function valueOf$1(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*toInt(this._months/12):NaN}function makeAs(e){return function(){return this.as(e)}}var asMilliseconds=makeAs("ms"),asSeconds=makeAs("s"),asMinutes=makeAs("m"),asHours=makeAs("h"),asDays=makeAs("d"),asWeeks=makeAs("w"),asMonths=makeAs("M"),asYears=makeAs("y");function clone$1(){return createDuration(this)}function get$3(e){return e=normalizeUnits(e),this.isValid()?this[e+"s"]():NaN}function makeGetter(e){return function(){return this.isValid()?this._data[e]:NaN}}var milliseconds=makeGetter("milliseconds"),seconds=makeGetter("seconds"),minutes=makeGetter("minutes"),hours=makeGetter("hours"),days=makeGetter("days"),months=makeGetter("months"),years=makeGetter("years");function weeks(){return absFloor(this.days()/7)}var round=Math.round,thresholds={ss:44,s:45,m:45,h:22,d:26,M:11};function substituteTimeAgo(e,t,i,n,s){return s.relativeTime(t||1,!!i,e,n)}function relativeTime$1(e,t,i){var n=createDuration(e).abs(),s=round(n.as("s")),o=round(n.as("m")),a=round(n.as("h")),r=round(n.as("d")),l=round(n.as("M")),h=round(n.as("y")),c=s<=thresholds.ss&&["s",s]||s<thresholds.s&&["ss",s]||o<=1&&["m"]||o<thresholds.m&&["mm",o]||a<=1&&["h"]||a<thresholds.h&&["hh",a]||r<=1&&["d"]||r<thresholds.d&&["dd",r]||l<=1&&["M"]||l<thresholds.M&&["MM",l]||h<=1&&["y"]||["yy",h];return c[2]=t,c[3]=+e>0,c[4]=i,substituteTimeAgo.apply(null,c)}function getSetRelativeTimeRounding(e){return void 0===e?round:"function"==typeof e&&(round=e,!0)}function getSetRelativeTimeThreshold(e,t){return void 0!==thresholds[e]&&(void 0===t?thresholds[e]:(thresholds[e]=t,"s"===e&&(thresholds.ss=t-1),!0))}function humanize(e){if(!this.isValid())return this.localeData().invalidDate();var t=this.localeData(),i=relativeTime$1(this,!e,t);return e&&(i=t.pastFuture(+this,i)),t.postformat(i)}var abs$1=Math.abs;function sign(e){return(e>0)-(e<0)||+e}function toISOString$1(){if(!this.isValid())return this.localeData().invalidDate();var e,t,i=abs$1(this._milliseconds)/1e3,n=abs$1(this._days),s=abs$1(this._months);e=absFloor(i/60),t=absFloor(e/60),i%=60,e%=60;var o=absFloor(s/12),a=s%=12,r=n,l=t,h=e,c=i?i.toFixed(3).replace(/\.?0+$/,""):"",d=this.asSeconds();if(!d)return"P0D";var p=d<0?"-":"",u=sign(this._months)!==sign(d)?"-":"",m=sign(this._days)!==sign(d)?"-":"",f=sign(this._milliseconds)!==sign(d)?"-":"";return p+"P"+(o?u+o+"Y":"")+(a?u+a+"M":"")+(r?m+r+"D":"")+(l||h||c?"T":"")+(l?f+l+"H":"")+(h?f+h+"M":"")+(c?f+c+"S":"")}var proto$3=Duration.prototype;proto$3.isValid=isValid$2,proto$3.abs=abs,proto$3.add=add$2,proto$3.subtract=subtract$1,proto$3.as=as,proto$3.asMilliseconds=asMilliseconds,proto$3.asSeconds=asSeconds,proto$3.asMinutes=asMinutes,proto$3.asHours=asHours,proto$3.asDays=asDays,proto$3.asWeeks=asWeeks,proto$3.asMonths=asMonths,proto$3.asYears=asYears,proto$3.valueOf=valueOf$1,proto$3._bubble=bubble,proto$3.clone=clone$1,proto$3.get=get$3,proto$3.milliseconds=milliseconds,proto$3.seconds=seconds,proto$3.minutes=minutes,proto$3.hours=hours,proto$3.days=days,proto$3.weeks=weeks,proto$3.months=months,proto$3.years=years,proto$3.humanize=humanize,proto$3.toISOString=toISOString$1,proto$3.toString=toISOString$1,proto$3.toJSON=toISOString$1,proto$3.locale=locale,proto$3.localeData=localeData,proto$3.toIsoString=deprecate("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",toISOString$1),proto$3.lang=lang,addFormatToken("X",0,0,"unix"),addFormatToken("x",0,0,"valueOf"),addRegexToken("x",matchSigned),addRegexToken("X",matchTimestamp),addParseToken("X",function(e,t,i){i._d=new Date(1e3*parseFloat(e,10))}),addParseToken("x",function(e,t,i){i._d=new Date(toInt(e))}),hooks.version="2.22.2",setHookCallback(createLocal),hooks.fn=proto$1,hooks.min=min,hooks.max=max,hooks.now=now,hooks.utc=createUTC,hooks.unix=createUnix,hooks.months=listMonths,hooks.isDate=isDate,hooks.locale=getSetGlobalLocale,hooks.invalid=createInvalid,hooks.duration=createDuration,hooks.isMoment=isMoment,hooks.weekdays=listWeekdays,hooks.parseZone=createInZone,hooks.localeData=getLocale,hooks.isDuration=isDuration,hooks.monthsShort=listMonthsShort,hooks.weekdaysMin=listWeekdaysMin,hooks.defineLocale=defineLocale,hooks.updateLocale=updateLocale,hooks.locales=listLocales,hooks.weekdaysShort=listWeekdaysShort,hooks.normalizeUnits=normalizeUnits,hooks.relativeTimeRounding=getSetRelativeTimeRounding,hooks.relativeTimeThreshold=getSetRelativeTimeThreshold,hooks.calendarFormat=getCalendarFormat,hooks.prototype=proto$1,hooks.HTML5_FMT={DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss.SSS",DATE:"YYYY-MM-DD",TIME:"HH:mm",TIME_SECONDS:"HH:mm:ss",TIME_MS:"HH:mm:ss.SSS",WEEK:"YYYY-[W]WW",MONTH:"YYYY-MM"};const PaperButtonBehaviorImpl={properties:{elevation:{type:Number,reflectToAttribute:!0,readOnly:!0}},observers:["_calculateElevation(focused, disabled, active, pressed, receivedFocusFromKeyboard)","_computeKeyboardClass(receivedFocusFromKeyboard)"],hostAttributes:{role:"button",tabindex:"0",animated:!0},_calculateElevation:function(){var e=1;this.disabled?e=0:this.active||this.pressed?e=4:this.receivedFocusFromKeyboard&&(e=3),this._setElevation(e)},_computeKeyboardClass:function(e){this.toggleClass("keyboard-focus",e)},_spaceKeyDownHandler:function(e){IronButtonStateImpl._spaceKeyDownHandler.call(this,e),this.hasRipple()&&this.getRipple().ripples.length<1&&this._ripple.uiDownAction()},_spaceKeyUpHandler:function(e){IronButtonStateImpl._spaceKeyUpHandler.call(this,e),this.hasRipple()&&this._ripple.uiUpAction()}},PaperButtonBehavior=[IronButtonState,IronControlState,PaperRippleBehavior,PaperButtonBehaviorImpl],template$c=html`
  <style include="paper-material-styles">
    /* Need to specify the same specificity as the styles imported from paper-material. */
    :host {
      @apply --layout-inline;
      @apply --layout-center-center;
      position: relative;
      box-sizing: border-box;
      min-width: 5.14em;
      margin: 0 0.29em;
      background: transparent;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-tap-highlight-color: transparent;
      font: inherit;
      text-transform: uppercase;
      outline-width: 0;
      border-radius: 3px;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      cursor: pointer;
      z-index: 0;
      padding: 0.7em 0.57em;

      @apply --paper-font-common-base;
      @apply --paper-button;
    }

    :host([elevation="1"]) {
      @apply --paper-material-elevation-1;
    }

    :host([elevation="2"]) {
      @apply --paper-material-elevation-2;
    }

    :host([elevation="3"]) {
      @apply --paper-material-elevation-3;
    }

    :host([elevation="4"]) {
      @apply --paper-material-elevation-4;
    }

    :host([elevation="5"]) {
      @apply --paper-material-elevation-5;
    }

    :host([hidden]) {
      display: none !important;
    }

    :host([raised].keyboard-focus) {
      font-weight: bold;
      @apply --paper-button-raised-keyboard-focus;
    }

    :host(:not([raised]).keyboard-focus) {
      font-weight: bold;
      @apply --paper-button-flat-keyboard-focus;
    }

    :host([disabled]) {
      background: none;
      color: #a8a8a8;
      cursor: auto;
      pointer-events: none;

      @apply --paper-button-disabled;
    }

    :host([disabled][raised]) {
      background: #eaeaea;
    }


    :host([animated]) {
      @apply --shadow-transition;
    }

    paper-ripple {
      color: var(--paper-button-ink-color);
    }
  </style>

  <slot></slot>`;template$c.setAttribute("strip-whitespace",""),Polymer$1({_template:template$c,is:"paper-button",behaviors:[PaperButtonBehavior],properties:{raised:{type:Boolean,reflectToAttribute:!0,value:!1,observer:"_calculateElevation"}},_calculateElevation:function(){this.raised?PaperButtonBehaviorImpl._calculateElevation.apply(this):this._setElevation(0)}});class MoeRate extends PolymerElement{static get template(){return html`
      <style>
        :host {
          display: block;
          --moe-rate-text-color: var(--futaba-red-color);
          --moe-rate-background-color: var(--futaba-pink-color);
        }
        
        :host(.small) {
            --moe-rate-font-size: small;
        }
        
        :host(.x-small) {
            --moe-rate-font-size: x-small;
        }
        
        :host(.xx-small) {
            --moe-rate-font-size: xx-small;
        }
        
        paper-button {
            color: var(--moe-rate-text-color);
            background-color: var(--moe-rate-background-color);
            border-radius: 25px;
            text-transform: none;
            font-size: var(--moe-rate-font-size, medium); 
            padding: 0;
        }
        
        .rate {
            margin-left: 5px;
        }
        
        .votes {
            padding: 5px;
            margin-left: 5px;
            border-radius: 25px;
            background: white;
        }
      </style>
      <paper-button on-click="onDislikeClick" disabled=[[disabled]]>
        <span class="rate">( ・_ゝ・)</span>
        <span class="votes">[[dislike]]</span>
      </paper-button>
      <paper-button on-click="onLikeClick" disabled=[[disabled]]>
        <span class="rate">(・∀・)ｂ</span>
        <span class="votes">[[like]]</span>
      </paper-button>
    `}static get properties(){return{dislike:{type:Number,value:0},like:{type:Number,value:0},disabled:{type:Boolean,reflectToAttribute:!0,value:!1}}}onLikeClick(e){this.dispatchEvent(new CustomEvent("onLikeClick"))}onDislikeClick(e){this.dispatchEvent(new CustomEvent("onDislikeClick"))}}window.customElements.define("moe-rate",MoeRate);const template$d=html`<iron-iconset-svg name="social" size="24">
<svg><defs>
<g id="cake"><path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z"></path></g>
<g id="domain"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"></path></g>
<g id="group"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path></g>
<g id="group-add"><path d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2zm10 1c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86s-.34 2.04-.9 2.86c.28.09.59.14.91.14zm-5 0c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm6.62 2.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84zM13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"></path></g>
<g id="location-city"><path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"></path></g>
<g id="mood"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path></g>
<g id="mood-bad"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 3c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"></path></g>
<g id="notifications"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></g>
<g id="notifications-active"><path d="M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z"></path></g>
<g id="notifications-none"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"></path></g>
<g id="notifications-off"><path d="M20 18.69L7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v.01c-.52.99-.8 2.16-.8 3.42v5l-2 2v1h13.73l2 2L21 19.72l-1-1.03zM12 22c1.11 0 2-.89 2-2h-4c0 1.11.89 2 2 2zm6-7.32V11c0-3.08-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-.15.03-.29.08-.42.12-.1.03-.2.07-.3.11h-.01c-.01 0-.01 0-.02.01-.23.09-.46.2-.68.31 0 0-.01 0-.01.01L18 14.68z"></path></g>
<g id="notifications-paused"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2zm-3.5-6.2l-2.8 3.4h2.8V15h-5v-1.8l2.8-3.4H9.5V8h5v1.8z"></path></g>
<g id="pages"><path d="M3 5v6h5L7 7l4 1V3H5c-1.1 0-2 .9-2 2zm5 8H3v6c0 1.1.9 2 2 2h6v-5l-4 1 1-4zm9 4l-4-1v5h6c1.1 0 2-.9 2-2v-6h-5l1 4zm2-14h-6v5l4-1-1 4h5V5c0-1.1-.9-2-2-2z"></path></g>
<g id="party-mode"><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 3c1.63 0 3.06.79 3.98 2H12c-1.66 0-3 1.34-3 3 0 .35.07.69.18 1H7.1c-.06-.32-.1-.66-.1-1 0-2.76 2.24-5 5-5zm0 10c-1.63 0-3.06-.79-3.98-2H12c1.66 0 3-1.34 3-3 0-.35-.07-.69-.18-1h2.08c.07.32.1.66.1 1 0 2.76-2.24 5-5 5z"></path></g>
<g id="people"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path></g>
<g id="people-outline"><path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"></path></g>
<g id="person"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></g>
<g id="person-add"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></g>
<g id="person-outline"><path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"></path></g>
<g id="plus-one"><path d="M10 8H8v4H4v2h4v4h2v-4h4v-2h-4zm4.5-1.92V7.9l2.5-.5V18h2V5z"></path></g>
<g id="poll"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path></g>
<g id="public"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></g>
<g id="school"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"></path></g>
<g id="sentiment-dissatisfied"><circle cx="15.5" cy="9.5" r="1.5"></circle><circle cx="8.5" cy="9.5" r="1.5"></circle><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"></path></g>
<g id="sentiment-neutral"><path d="M9 14h6v1.5H9z"></path><circle cx="15.5" cy="9.5" r="1.5"></circle><circle cx="8.5" cy="9.5" r="1.5"></circle><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></g>
<g id="sentiment-satisfied"><circle cx="15.5" cy="9.5" r="1.5"></circle><circle cx="8.5" cy="9.5" r="1.5"></circle><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-4c-1.48 0-2.75-.81-3.45-2H6.88c.8 2.05 2.79 3.5 5.12 3.5s4.32-1.45 5.12-3.5h-1.67c-.7 1.19-1.97 2-3.45 2z"></path></g>
<g id="sentiment-very-dissatisfied"><path d="M11.99 2C6.47 2 2 6.47 2 12s4.47 10 9.99 10S22 17.53 22 12 17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm4.18-12.24l-1.06 1.06-1.06-1.06L13 8.82l1.06 1.06L13 10.94 14.06 12l1.06-1.06L16.18 12l1.06-1.06-1.06-1.06 1.06-1.06zM7.82 12l1.06-1.06L9.94 12 11 10.94 9.94 9.88 11 8.82 9.94 7.76 8.88 8.82 7.82 7.76 6.76 8.82l1.06 1.06-1.06 1.06zM12 14c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"></path></g>
<g id="sentiment-very-satisfied"><path d="M11.99 2C6.47 2 2 6.47 2 12s4.47 10 9.99 10S22 17.53 22 12 17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-10.06L14.06 11l1.06-1.06L16.18 11l1.06-1.06-2.12-2.12zm-4.12 0L9.94 11 11 9.94 8.88 7.82 6.76 9.94 7.82 11zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path></g>
<g id="share"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path></g>
<g id="whatshot"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"></path></g>
</defs></svg>
</iron-iconset-svg>`;document.head.appendChild(template$d.content);class MoePoll extends PolymerElement{static get template(){return html`
<style>
:host {
    min-width: 300px;
    display: table;
    padding: 10px;
    background-color: var(--moe-poll-background-color);
    color: var(--moe-poll-text-color);
    @apply --paper-font-body1; 
}

.poll_title {
    @apply --paper-font-title;
    margin-bottom: 0.5em;
    color: var(--moe-poll-title-color);
}

.progress {
    position: relative;
    font-size: 14px;
}

.progress > div {
    margin: 0 0 5px 0;
}

.progress > div > div:nth-child(1) span {
    display: block;
    max-width: 440px;
    white-space: normal;
    line-height: 20px;
}

.progress > div .barCon {
    position: relative;
    overflow: hidden;
    background-color: #ffe;
}

.progress > div .barCon .bar {
    height: 2em;
    text-align: center;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
    background-color: #f0e0d6;
    transition: width 0.8s;
}

.progress > div .barCon .barData {
    position: absolute;
    top: 5px;
    right: 10px;
}

.progress > div .barCon .barData > span:nth-child(1) {
    margin-right: 5px;
}

.progress > div .barCon .barData > span:nth-child(1):after {
    margin-left: 5px;
    content: '/';
}

.control-group {
    font-size: 13px;
}

.control-group form {
    display: inline-block;
}

.control-group .right {
    float: right;
}

.poll_total {
    font-size: small;
}

</style>

<div>
    <!-- unvoted -->
    <template is="dom-if" if="{{!voted}}">
        <div class="poll_container">
            <div class="vote">
                <div class="poll_title">
                    <iron-icon icon="social:poll"></iron-icon>[[subject]]
                </div>						
                <div class="pool">
                    <div class="poll_list">
                        <template is="dom-repeat" items="{{itemsProcessed}}">
                            <moe-poll-item text="{{item.text}}" on-click="_onPollItemClick"></moe-poll-item>
                        </template>
                    </div>
                </div>
            </div>
            <div align="right" class="poll_total">( 目前有 <span>[[totalVotes]]</span> 名投票者 ) </div>
        </div>    
    </template>
    
    <!-- voted -->
    <template is="dom-if" if="{{voted}}">
        <div class="poll_container">
            <div class="vote poll_result">
                <div class="poll_title">
                    <iron-icon icon="social:poll"></iron-icon>[[subject]]
                </div>					
                <div class="progress poll_result_list">
                    <template is="dom-repeat" items="{{itemsProcessed}}">
                        <div>
                            <div><span class="poll_result_item_caption">[[item.text]]</span></div>
                            <div class="barCon poll_result_item_stats">						    		
                                <div class="bar" style="width: {{item.percentage}}%;"></div>
                                <div class="barData"><span class="percent">[[item.percentage]]%</span><span class="count">[[item.votes]]</span></div>
                            </div>						    							    	
                        </div>
                    </template>
                </div>
                <div align="right" class="poll_total">( 目前有 <span>[[totalVotes]]</span> 名投票者 ) </div>
            </div>
        </div>    
    </template>
</div>
    `}static get properties(){return{boardId:{type:Number},no:{type:Number},subject:{type:String,value:""},items:{type:Array,value:[],reflectToAttribute:!0},itemsProcessed:{type:Array,computed:"_processItems(items)"},totalVotes:{type:Number,value:0,reflectToAttribute:!0},voted:{type:Boolean,value:!1,reflectToAttribute:!0}}}_processItems(e){const t=(e||[]).reduce((e,t)=>"object"==typeof t&&"number"==typeof t.votes?e+t.votes:e,0);return this.set("totalVotes",t),e.map(e=>Object.assign({},e,{percentage:Math.round(e.votes/t*100)}))}_onPollItemClick(e){this.dispatchEvent(new CustomEvent("pollItemClick",{bubbles:!0,composed:!0,detail:{board_id:this.boardId,no:this.no,item:e.currentTarget.get("text")}}))}}class MoePollItem extends PolymerElement{static get template(){return html`
<style>
:host {
    display: block;
}
.poll_item {
    @apply --shadow-elevation-2dp;
    position: relative;
    background-color: var(--moe-poll-unvoted-item-background-color);
    margin: 0 0 5px 0;
    padding: 1em 1em 1em 0.5em;
    border: 1px solid #800000;
    border-width: 0 0 0 5px;
    line-height: 25px;
    cursor: pointer;
}

.poll_item:hover {
    background-color: #f0e0d6;
}

.poll_item a {
    width: 100%;
    cursor: pointer;
}
</style>
<div class="poll_item">
    <a>[[text]]</a>
    <paper-ripple></paper-ripple>
</div>
`}static get properties(){return{text:{type:String}}}}window.customElements.define("moe-poll",MoePoll),window.customElements.define("moe-poll-item",MoePollItem);class MoePostImage extends PolymerElement{static get template(){return html`
<style>
:host {
    display: inline-block;
    max-width: 100%;
}
#ihover {
    position: fixed;
    left: 0;
    top: 0;
    display: none;
    padding: 0;
    margin: 0;
    z-index: 100;
}
</style>
<img id="img" src="[[thumbSrc]]" width="[[thumbWidth]]" height="[[thumbHeight]]" on-mouseover="_onMouseOver" on-mouseout="_onMouseOut" on-mousemove="_onMouseMove" />
<img id="ihover" />
`}static get properties(){return{imageSrc:{type:String},imageHeight:{type:Number},imageWidth:{type:Number},thumbSrc:{type:String},thumbHeight:{type:Number},thumbWidth:{type:Number},ihoverPadding:{type:Number,value:40}}}_onMouseOver(e){this.$.ihover.style.display="block",this.$.ihover.src=this.imageSrc,this._updateIhoverSize(e),this._updateIhoverPosition(e)}_onMouseOut(e){this.$.ihover.src="",this.$.ihover.style.display="none"}_onMouseMove(e){this._updateIhoverSize(e),this._updateIhoverPosition(e)}_updateIhoverSize(e){const t=this.$.img.getBoundingClientRect(),i=window.document.documentElement;this.$.ihover.style.maxHeight=i.clientHeight-2*this.ihoverPadding+"px",e.clientX<i.clientWidth/2?this.$.ihover.style.maxWidth=i.clientWidth-t.right-2*this.ihoverPadding+"px":this.$.ihover.style.maxWidth=t.left-2*this.ihoverPadding+"px",console.log(`doc height = ${i.clientHeight}, doc width = ${i.clientWidth}`)}_updateIhoverPosition(e){const t=window.document.documentElement,i=this.$.ihover;e.clientX>t.clientWidth/2?i.style.left=e.clientX-i.offsetWidth-this.ihoverPadding+"px":i.style.left=e.clientX+this.ihoverPadding+"px";let n=Math.min(Math.max(e.clientY-i.offsetHeight/2,0),t.clientHeight-i.offsetHeight);i.style.top=n+"px"}}window.customElements.define("moe-post-image",MoePostImage);class MoeThread extends PolymerElement{static get template(){return html`
<script src="https://www.youtube.com/player_api"></script>
<style>
    :host {
        display: block;
    }
    
    #thread-card {
        @apply --shadow-elevation-8dp;
        @apply --shadow-transition;
        width: 100%;
    }
    #thread-card:hover, #thread-card:focus, #thread-card:active {
        @apply --shadow-elevation-16dp;
        @apply --shadow-transition;
    }
    
    .cover {
        background-color: var(--moe-thread-cover-background-color);
    }
    .header {
        @apply --layout-horizontal;
        margin: 0;
    }
    .header-no {
        @apply --layout-flex;
        position: relative;
        color: var(--moe-thread-no-text-color);
        background-color: var(--moe-thread-no-background-color);
    }
    .header-no:hover {
        cursor: pointer;
        background-color: var(--moe-thread-no-hover-background-color);
    }
    .header-reply-count {
        @apply --layout-flex;
        position: relative;
        color: var(--moe-thread-reply-count-text-color);
        background-color: var(--moe-thread-reply-count-background-color);    
    }
    .header-reply-count:hover {
        cursor: pointer;
        background-color: var(--moe-thread-reply-count-hover-background-color);
    }
    .header-item {
        @apply --layout-horizontal;
        @apply --layout-center-justified;    
        padding: 16px;
    }
    .header-item iron-icon {
        --iron-icon-height: 1.5em;
        --iron-icon-width: 1.5em;
        padding: 0 0.5em;
    }
    
    .post-action-button {
        float: right;
        color: var(--moe-post-action-menu-button-color);
        margin: -1em;
    }
    
    .body {
        color: var(--moe-post-body-text-color);
    }
    .post-subject { 
        @apply --paper-font-title;
    }
    .post-body { @apply --paper-font-body1; }
    
    .firstpost {
        display: block;
        background-color: var(--moe-thread-firstpost-background-color);
        padding: 1em;
    }
    .firstpost-poll-container {
        @apply --layout-horizontal;
    }
    .firstpost-poll-container moe-poll {
        @apply --layout-flex-auto;
    }
    .firstpost .post-body {
        margin-top: 1em; 
    }
    .replies {
        margin: 0;
        padding: 0;
        display: block;
    }
    .reply {
        @apply --layout-vertical;
        @apply --layout-start-aligned;
        @apply --layout-self-stretch;
        justify-content: space-between;
        height: auto;
        min-height: 5em;
        padding: 1em;
    }
    .reply .post-body {
        @apply --layout-self-stretch;
    }
    .replies .reply:nth-child(even) {
        background-color: var(--moe-thread-reply-even-background-color);        
    }
    .replies .reply:nth-child(odd) {
        background-color: var(--moe-thread-reply-odd-background-color);        
    }
    
    moe-post-image {
        position: relative;
    }
    .thumb {
        float: left;
        max-width: 250px;
        max-height: 250px;
        margin-right: 0.5em;
        margin-bottom: 0.5em;
    }
    
    .more-replies {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
        @apply --layout-self-center;
        background-color: var(--moe-thread-more-replies-button-background-color);
        margin: 0;
        padding: 1em;
        position: relative;
    }
    .more-replies .more-replies-text {
        color: var(--moe-thread-more-replies-button-text-color);
    }
    .more-replies:hover {
        cursor: pointer;
        background-color: var(--moe-thread-more-replies-button-hover-background-color);
    }
    .more-replies iron-icon {
        --iron-icon-height: 1.5em;
        --iron-icon-width: 1.5em;
        padding: 0 0.2em;
    }

</style>

<paper-card id="thread-card">
    <!-- thread cover -->
    <div class="cover">
        <template is="dom-if" if="[[showFirstPostEmebeds]]">
            <moe-embeds embeds="{{firstpost.embeds}}"></moe-embeds>
        </template>
        <template is="dom-if" if="[[showFirstPostPoll]]">
            <div class="firstpost-poll-container">
                <moe-poll board-id="{{firstpost.board_id}}" no="{{firstpost.no}}" subject="{{firstpost.poll.subject}}" items="{{firstpost.poll.items}}" voted="{{firstpost.poll.voted}}"></moe-poll>
            </div>
        </template>
    </div>

    <!-- thread header -->
    <div class="header">
        <div class="header-no" on-click="_onThreadHeaderNoClick">
            <div class="header-item">No. [[no]]</div>
            <paper-ripple></paper-ripple>
        </div>
        <div class="header-reply-count" on-click="_onThreadHeaderReplyCountClick">
            <div class="header-item"><iron-icon icon="communication:comment"></iron-icon>[[replyCount]] 篇回應</div>
            <paper-ripple></paper-ripple>        
        </div>
    </div>
       
    <div class="body">
        <!-- firstpost -->
        <div class="firstpost">
            <moe-post-action-menu-button class="post-action-button" board-id="{{firstpost.board_id}}" no="{{firstpost.no}}" is-first-post="true" is-admin="{{isAdmin}}"></moe-post-action-menu-button>
            <div class="post-subject">[[firstpost.sub]]</div>
            <div class="post-body">
                <template is="dom-repeat" items="{{firstpost.images}}" as="image">
                    <a target="_blank" href="{{image.image_src}}">
                        <moe-post-image 
                            image-src="[[image.image_src]]" image-width="[[image.image_width]]" image-height="[[image.image_height]]"
                            thumb-src="{{image.thumb_src}}" thumb-width="{{image.thumb_width}}" thumb-height="{{image.thumb_height}}" 
                            class="thumb" />
                    </a>
                </template>
                <moe-post-comment comment="{{firstpost.com}}" />
            </div>
            <div style="clear: both"></div>
            <moe-post-header post="{{firstpost}}"></moe-post-header>
        </div>
        
        <template is="dom-if" if="{{showMoreReplies}}">
            <div class="more-replies" on-click="_onMoreRepliesClick">
                <div class="more-replies-text"><iron-icon icon="expand-more"></iron-icon>展開 [[omittedReplyCount]] 篇被省略的回應</div>            
                <paper-ripple></paper-ripple>
            </div>
        </template>
        
        <!-- replies -->
        <div class="replies">
            <template is="dom-repeat" items="{{replies}}" as="reply" index-as="reply_i">
                <div class="reply">
                    <div class="post-body">
                        <moe-post-action-menu-button class="post-action-button" board-id="{{firstpost.board_id}}" no="{{reply.no}}"></moe-post-action-menu-button>
                        <template is="dom-repeat" items="{{item.images}}" as="image">
                            <a target="_blank" href="{{image.image_src}}">
                                <moe-post-image 
                                    image-src="[[image.image_src]]" image-width="[[image.image_width]]" image-height="[[image.image_height]]"
                                    thumb-src="{{image.thumb_src}}" thumb-width="{{image.thumb_width}}" thumb-height="{{image.thumb_height}}" 
                                    class="thumb" />
                            </a>
                        </template>
                        <!-- TODO: show reply embeds -->
                        <moe-post-comment comment="{{reply.com}}" />
                    </div>
                    <moe-post-header post="{{reply}}"></moe-post-header>
                </div>                
            </template>
        </div>
    </div>
</paper-card>
    `}static get properties(){return{isAdmin:{type:Boolean,value:!1,reflectToAttribute:!0},no:{type:Number},replyCount:{type:Number},omittedReplyCount:{type:Number,computed:"_computeOmittedReplyCount(replyCount, replies)",reflectToAttribute:!0},showMoreReplies:{type:Boolean,computed:"_computeShowMoreReplies(omittedReplyCount)",reflectToAttribute:!0},flagAdminSticky:{type:Boolean},flagAdminThreadStop:{type:Boolean},flagAdminSage:{type:Boolean},firstpost:{type:Object,reflectToAttribute:!0},replies:{type:Array},showFirstPostPoll:{type:Boolean,computed:"_computeShowFirstPostPoll(firstpost)"},showFirstPostEmebeds:{type:Boolean,computed:"_computeShowFirstPostEmbeds(firstpost)"}}}_computeShowFirstPostEmbeds(e){return e.embeds&&e.embeds.length>0}_computeShowFirstPostPoll(e){return e.poll&&e.poll.items&&e.poll.items.length>0}_computeOmittedReplyCount(e,t){return e-t.length}_computeShowMoreReplies(e){return e>0}_onThreadHeaderNoClick(){this.dispatchEvent(new CustomEvent("threadHeaderNoClick",{composed:!0,bubbles:!0,detail:{no:this.get("no")}}))}_onThreadHeaderReplyCountClick(){this.dispatchEvent(new CustomEvent("threadHeaderReplyCountClick",{composed:!0,bubbles:!0,detail:{no:this.get("no")}}))}_onMoreRepliesClick(){this.dispatchEvent(new CustomEvent("threadMoreRepliesClick",{composed:!0,bubbles:!0,detail:{no:this.get("no")}}))}}class MoePostHeader extends PolymerElement{static get template(){return html`
<style>
:host {
    display: block;
}
.post-header { 
    @apply --layout-horizontal;
    @apply --layout-end-justified;
    margin-top: 1em;
}
.post-header-no {
    @apply --layout-flex-auto;
    color: var(--moe-post-header-no-text-color);
}
.post-header-no-chip {
    position: relative;
    display: inline-block;
    padding-left: 0.5em;
    padding-right: 0.5em;
    border-radius: 1em;
    background-color: var(--moe-post-header-no-background-color);
}
.post-header-no-chip:hover {
    cursor: pointer;
    background-color: var(--moe-post-header-no-hover-background-color);
}
.post-header-id, .post-header-date {
    flex: 0 1 auto;
    flex-basis: auto;
    text-align: right;
    padding-left: 1em;
}
.post-header-no {
}
.post-header-id {
    color: var(--moe-post-header-id-text-color);
}
.post-header-date {
    color: var(--moe-post-header-date-text-color);    
}
</style>
<div class="post-header">
    <div class="post-header-no" on-click="_onPostHeaderNoClick">
        <template is="dom-if" if="{{!hideNo}}">
            <div class="post-header-no-chip">No.[[post.no]]<paper-ripple></paper-ripple></div>
        </template>
    </div>
    <div class="post-header-id">ID:[[post.trip_id]]</div>
    <div class="post-header-date">[[formatCreatedAt(post.created_at)]]</div>
</div>
`}static get properties(){return{hideNo:{type:Boolean,value:!1},post:{type:Object}}}formatCreatedAt(e){return hooks(e).fromNow()}_onPostHeaderNoClick(e){this.hideNo||this.dispatchEvent(new CustomEvent("postHeaderNoClick",{composed:!0,bubbles:!0,detail:{no:this.get("post.no")}}))}}class MoePostComment extends PolymerElement{static get template(){return html`
<style>
:host {
    display: block;
    height: auto;
}

.highlight-quote {
    color: var(--moe-post-quote-text-color);
}
</style>
<span id="html"></span>
`}static get properties(){return{comment:{type:String,observer:"_refreshHtml"}}}_refreshHtml(e){var t=e;t=this._highlightQuotes(t),t=this._linkQuotes(t),this.$.html.innerHTML=t}_highlightQuotes(e){return e.replace(/(^|<br \/>)((?:&gt;|＞).*?)(?=<br \/>|$)/gm,'<span class="highlight-quote">$2</span>')}_linkQuotes(e){return e.replace(/((?:&gt;|＞)+)(?:No\.)?(\d+)/i,'<moe-quote-link no="$2">&gt;No.$2</moe-quote-link>')}}class MoeQuoteLink extends PolymerElement{static get template(){return html`
<style>
:host {
    display: inline-block;
}
span {
    color: var(--moe-post-quote-link-color);
}
span:hover {
    cursor: pointer;
    color: var(--moe-post-quote-link-hover-color);
}
</style>
<span on-click="_onClick"><slot></slot></span>
`}static get properties(){return{no:{type:Number}}}_onClick(){this.dispatchEvent(new CustomEvent("quoteLinkClick",{bubbles:!0,composed:!0,detail:{no:this.no}}))}}class MoePostActionMenuButton extends PolymerElement{static get template(){return html`
<style>
:host {
    display: block;
}
paper-listbox {
    min-width: 5em;
    z-index: 100;
}
</style>
<paper-menu-button class="post-action-button" horizontal-align="right" >
    <paper-icon-button icon="more-vert" slot="dropdown-trigger" alt="more-vert" ></paper-icon-button>
    <paper-listbox slot="dropdown-content">
        <template is="dom-repeat" items="{{items}}">
            <moe-post-action-menu-item board-id="[[boardId]]" no="[[no]]" action="[[item.action]]" text="[[item.text]]"></moe-post-action-menu-item>
        </template>
    </paper-listbox>
</paper-menu-button>
`}static get properties(){return{items:{type:Array,computed:"_computeItems(isAdmin, isFirstPost)"},isAdmin:{type:Boolean,value:!1},isFirstPost:{type:Boolean,value:!1},boardId:{type:Number},no:{type:Number}}}_computeItems(e,t){const i=[{text:"回應",action:"reply",icon:"reply"},{text:"舉報",action:"report",icon:"report"},{text:"刪除",action:"delete",icon:"delete"}];return e&&t&&(i.push({text:"停止討論串",action:"stopThread",icon:"av:pause"}),i.push({text:"強制sage",action:"forceSage",icon:"arrow-downward"})),i}_onItemClick(e){console.log(e.currentTarget)}}class MoePostActionMenuItem extends PolymerElement{static get template(){return html`
<style>
:host {
    display: block;
}
paper-item:hover {
    cursor: pointer;
    background-color: var(--paper-grey-300);
}
</style>
<paper-item on-click="_onClick">[[text]]</paper-item>
`}static get properties(){return{boardId:{type:Number},no:{type:Number},action:{type:String},text:{type:String}}}_onClick(e){this.dispatchEvent(new CustomEvent("postActionMenuItemClick",{composed:!0,bubbles:!0,detail:{board_id:this.boardId,no:this.no,action:this.action}}))}}class MoeEmbeds extends PolymerElement{static get template(){return html`
<style>
:host {
    display: block;
}
#ytplayer {
    height: 360px;
}
</style>
<div id="ytplayer">
</div>
`}static get properties(){return{embeds:{type:Array,observer:"_onEmbedsChange"}}}_onEmbedsChange(e){this.$.ytplayer.innerHTML="";const t=(e||[]).map(e=>{return JSON.parse(e.data).res_id});if(t.length>0){const e=t.length>1?encodeURIComponent(t.slice(1).join(",")):"",i=document.createElement("iframe");i.allowFullscreen=!0,i.lazyLoad=!0,i.type="text/html",i.width="100%",i.height="360",i.src=`//www.youtube.com/embed/${t[0]}?enablejsapi=1&playsinline=1&playlist=${e}`,i.frameBorder=0,this.$.ytplayer.appendChild(i)}}}window.customElements.define("moe-thread",MoeThread),window.customElements.define("moe-post-comment",MoePostComment),window.customElements.define("moe-post-header",MoePostHeader),window.customElements.define("moe-post-action-menu-button",MoePostActionMenuButton),window.customElements.define("moe-post-action-menu-item",MoePostActionMenuItem),window.customElements.define("moe-quote-link",MoeQuoteLink),window.customElements.define("moe-embeds",MoeEmbeds);class MoePage extends PolymerElement{static get template(){return html`
<style>
:host {
    display: block;
}
moe-thread {
    margin-top: 2em;
    width: 100%;
}
.loading {
   	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: center;
}
.loading .loading-text {
    margin-left: 0.5em;
}
</style>
<template is="dom-if" if="[[loading]]">
    <div class="loading">
        <paper-spinner-lite active></paper-spinner-lite>
        <div class="loading-text">Loading...</div>
    </div>
</template>
<template is="dom-repeat" items="[[threads]]" as="thread">
    <moe-thread 
        is-admin="[[isAdmin]]" 
        no="[[thread.no]]" 
        reply-count="[[thread.reply_count]]" 
        flag-admin-sticky="[[thread.flag_admin_sticky]]"
        flag-admin-thread-stop="[[thread.flag_admin_thread_stop]]"
        flag-admin-sage="[[thread.flag_admin_sage]]"
        firstpost="[[thread.first_post]]"
        replies="[[thread.replies]]">
    </moe-thread>
</template>
`}static get properties(){return{graphqlServer:{type:String},isAdmin:{type:Boolean,value:!1,reflectToAttribute:!0,notify:!0},threads:{type:Array,value:[],reflectToAttribute:!0},boardId:{type:Number},page:{type:Number},threadsPerPage:{type:Number},repliesPerThread:{type:Number},loading:{type:Boolean,value:!0}}}ready(){super.ready();const e=this._queryThreads(this.boardId,this.page*this.threadsPerPage,this.threadsPerPage,0,this.repliesPerThread),t=new FetchQL({url:this.graphqlServer});this.set("loading",!0),t.query({operationName:"",query:e}).then(e=>{this.set("threads",e.data.page.threads.map(e=>Object.assign({},e,{replies:(e.replies||[]).reverse()})))}).catch(e=>console.log(e)).finally(()=>this.set("loading",!1))}_queryThreads(e,t,i,n,s){return`{\n  page(board_id:${e}) {\n    board_id\n    threads(offset:${t},limit:${i}) {\n      board_id\n      no\n      reply_count\n      flag_admin_sticky\n      flag_admin_thread_stop\n      flag_admin_sage\n      first_post {\n        ...PostFields\n      }\n      replies(offset:${n},limit:${s}) {\n        ...PostFields\n      }\n    }\n  }\n}\n\nfragment PostFields on Post {\n  id\n  board_id\n  resto\n  no\n  sub\n  trip_id\n  name\n  email\n  com\n  root\n  embeds {\n    data\n  }\n  images {\n    image_src\n    image_height\n    image_width\n    thumb_src\n    thumb_height\n    thumb_width\n  }\n  poll {\n    subject\n    items {\n      text\n      votes\n    }\n    voted\n  }\n  rate {\n    like\n    dislike\n    rated\n  }\n  created_at\n}`}}window.customElements.define("moe-page",MoePage);
//# sourceMappingURL=moe-components.bundle.js.map
