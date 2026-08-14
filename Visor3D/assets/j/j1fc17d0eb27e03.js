(function(){class _ut{constructor(){this.selectedParameterKeys=[];this.groupByKeys=['',''];this.colorParameterKey='';}
_sZ(keys){this.selectedParameterKeys=Array.from(new Set(keys|| [])).filter(Boolean);}
_n12(key){if(key&& !this.selectedParameterKeys.includes(key))this.selectedParameterKeys.push(key);}
_n227(key){this.selectedParameterKeys=this.selectedParameterKeys.filter(item=> item!== key);}
_n1d8(key,offset){const index=this.selectedParameterKeys.indexOf(key);if(index<0)return;const next=Math.max(0,Math.min(this.selectedParameterKeys.length-1,index+offset));if(next=== index)return;const _v15ad8b=this.selectedParameterKeys.slice();const[item]=_v15ad8b.splice(index,1);_v15ad8b.splice(next,0,item);this.selectedParameterKeys=_v15ad8b;}
toJson(){return{selectedParameterKeys:this.selectedParameterKeys.slice(),groupByKeys:this.groupByKeys.slice(),colorParameterKey:this.colorParameterKey|| ''};}
_n1c5(data){if(!data)return;this.selectedParameterKeys=Array.isArray(data.selectedParameterKeys)?data.selectedParameterKeys.filter(Boolean):[];const service=window._fa;const _v15ad8a=Array.isArray(data.groupByKeys)&& data.groupByKeys.length?data.groupByKeys:null;this.groupByKeys=service&& service.normalize?service.normalize(_v15ad8a,{min:1,defaultCount:service.DEFAULT_COUNT|| 2}):(_v15ad8a?_v15ad8a.slice():['','']);this.colorParameterKey=data.colorParameterKey|| '';}}
window._ut=_ut;})();