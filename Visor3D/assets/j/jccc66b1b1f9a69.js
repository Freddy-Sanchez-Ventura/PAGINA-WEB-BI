(function(){'use strict';function _vf34e5c(value){if(value== null)return null;const normalized=String(value).replace(/,/g,'\x2e').replace(/[^0-9.+\-eE]/g,'');if(!normalized)return null;const number=Number(normalized);return Number.isFinite(number)?number:null;}
function normalizeFilterLogic(value){return String(value|| '').toLowerCase()=== '\x6f\x72'?'\x6f\x72':'\x61\x6e\x64';}
function _Gg(){const _vf34e5e=new Set(['\x68\x61\x73\x76\x61\x6c\x75\x65','\x65\x6d\x70\x74\x79']);return(this.filters|| []).filter(filter=> filter&& filter.key&& (_vf34e5e.has(filter.operator)|| String(filter.value|| '').trim()));}
function _n194(){return!!((this.tableColumnFilters&& this.tableColumnFilters.size)|| String(this.dataSearch|| '').trim());}
function _n193(){return false;}
function _vf34e58(){const active=this._Gg();return active.map(filter=> ({key:filter.key,operator:filter.operator|| '\x63\x6f\x6e\x74\x61\x69\x6e\x73',logic:normalizeFilterLogic(filter.logic),needle:this._E(filter.value),needleNumber:_vf34e5c(filter.value)}));}
function _vf34e59(){this._cw();this._eO=this._eT.slice();this._lT();return this._eT|| [];}
function _vf34e5b(element,filter){const rawValue=this.store&& this.store._n16a?this.store._n16a(element,filter.key):this._ej(element,filter.key);const value=this._E(rawValue);if(filter.operator=== '\x65\x71\x75\x61\x6c\x73')return value=== filter.needle;if(filter.operator=== '\x6e\x6f\x74\x65\x71\x75\x61\x6c\x73')return value!== filter.needle;if(filter.operator=== '\x73\x74\x61\x72\x74\x73')return value.startsWith(filter.needle);if(filter.operator=== '\x65\x6e\x64\x73')return value.endsWith(filter.needle);if(filter.operator=== '\x68\x61\x73\x76\x61\x6c\x75\x65')return!!value;if(filter.operator=== '\x65\x6d\x70\x74\x79')return!value;if(filter.operator=== '\x6e\x6f\x74\x63\x6f\x6e\x74\x61\x69\x6e\x73')return!value.includes(filter.needle);if(filter.operator=== '\x67\x74'|| filter.operator=== '\x67\x74\x65'|| filter.operator=== '\x6c\x74'|| filter.operator=== '\x6c\x74\x65'){const valueNumber=_vf34e5c(rawValue);if(valueNumber== null|| filter.needleNumber== null)return false;if(filter.operator=== '\x67\x74')return valueNumber>filter.needleNumber;if(filter.operator=== '\x67\x74\x65')return valueNumber>= filter.needleNumber;if(filter.operator=== '\x6c\x74')return valueNumber<filter.needleNumber;return valueNumber<= filter.needleNumber;}
return value.includes(filter.needle);}
function _vf34e5a(element,_vf34e5d){let result=_vf34e5b.call(this,element,_vf34e5d[0]);for(let index=1;index<_vf34e5d.length;index++ ){const filter=_vf34e5d[index];const matches=_vf34e5b.call(this,element,filter);result=filter.logic=== '\x6f\x72'?(result|| matches):(result&& matches);}
return result;}
function _dH(){const _vf34e5d=_vf34e58.call(this);const source=_vf34e59.call(this);if(!_vf34e5d.length){this._er=source.slice();return this._er;}
this._er=source.filter(element=> _vf34e5a.call(this,element,_vf34e5d));return this._er;}
async function _ER(report,options){const opts=options&& typeof options=== '\x6f\x62\x6a\x65\x63\x74'?options:{};const _vf34e5d=_vf34e58.call(this);const source=_vf34e59.call(this);const totalElements=source.length;const offset=Math.max(0,Number(opts.offset)|| 0);const span=Math.max(0,Number(opts.span)|| 1);const total=Math.max(offset+span,Number(opts.total)|| 0);const batchSize=Math.max(250,Number(opts.batchSize)|| 2500);const result=[];if(!_vf34e5d.length){this._er=source.slice();if(typeof report=== '\x66\x75\x6e\x63\x74\x69\x6f\x6e'){report({message:totalElements?'\x41\x63\x74\x75\x61\x6c\x69\x7a\x61\x6e\x64\x6f\x20\x61\x6c\x63\x61\x6e\x63\x65\x20\x64\x65\x20\x65\x6c\x65\x6d\x65\x6e\x74\x6f\x73\x2e\x2e\x2e':'\x4e\x6f\x20\x68\x61\x79\x20\x65\x6c\x65\x6d\x65\x6e\x74\x6f\x73\x20\x70\x61\x72\x61\x20\x66\x69\x6c\x74\x72\x61\x72\x2e',current:offset+span,total});}
return this._er;}
for(let start=0;start<totalElements;start+= batchSize){const end=Math.min(totalElements,start+batchSize);for(let index=start;index<end;index++ ){const element=source[index];if(_vf34e5a.call(this,element,_vf34e5d))result.push(element);}
if(typeof report=== '\x66\x75\x6e\x63\x74\x69\x6f\x6e'){report({message:'\x46\x69\x6c\x74\x72\x61\x6e\x64\x6f\x20\x65\x6c\x65\x6d\x65\x6e\x74\x6f\x73\x2e\x2e\x2e\x20'+end+'\x20\x64\x65\x20'+totalElements,current:offset+((end/Math.max(1,totalElements))*span),total});}
if(end<totalElements&& this._ac){await this._ac();}}
this._er=result;return result;}
function _DK(delayMs){clearTimeout(this._fy);const delay=Number.isFinite(delayMs)?delayMs:240;this._fy=setTimeout(()=> {this._fy=null;this._fF();},delay);}
function _n211(){this._dH();this._n232({__renderOptions:{skipVisualSync:true}});this._bq();this._m();}
function _E(value){return String(value== null?'':value).normalize('\x4e\x46\x44').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();}
function _ne0(query,currentKey){const q=this._dt(query);const filtered=this._hx(this._jA(),q);if(currentKey&& !filtered.some(param=> param.key=== currentKey)){const current=this.store._ao.get(currentKey);if(current)filtered.unshift(current);}
return filtered;}
function _Hd(query,currentKey){const q=this._dt(query);const filtered=this._hx(this._jA(),q);if(currentKey&& !filtered.some(param=> param.key=== currentKey)){const current=this.store._ao.get(currentKey);if(current)filtered.unshift(current);}
return filtered;}
function _zD(query){const q=this._dt(query);return this._hx(this._jA(),q);}
function create(){return Object.freeze({normalizeFilterLogic,_Gg,_n194,_n193,_dH,_ER,_DK,_n211,_E,_ne0,_Hd,_zD});}
window._G_=Object.freeze({create});})();