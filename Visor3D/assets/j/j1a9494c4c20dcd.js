(function(){'use strict';function create(){const state={disposers:[],boundKeys:new Set(),generation:0};function bindOnce(key,target,eventName,handler,options){if(!target|| !eventName|| typeof handler!== '\x66\x75\x6e\x63\x74\x69\x6f\x6e')return false;const id=String(key|| eventName);if(state.boundKeys.has(id))return false;state.boundKeys.add(id);target.addEventListener(eventName,handler,options);state.disposers.push(function(){try{target.removeEventListener(eventName,handler,options);}catch(_){}
state.boundKeys.delete(id);});return true;}
function addDisposer(_vd756ed){if(typeof _vd756ed=== '\x66\x75\x6e\x63\x74\x69\x6f\x6e')state.disposers.push(_vd756ed);}
function disposeAll(){state.generation+= 1;const disposers=state.disposers.splice(0);disposers.reverse().forEach(_vd756ed=> {try{_vd756ed();}catch(_){}});state.boundKeys.clear();}
return Object.freeze({state,bindOnce,addDisposer,disposeAll});}
window._wk=Object.freeze({create});})();