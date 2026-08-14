(function(){class _yT{constructor(store){this.store=store;}
_n5e(elements,groupKeys){const activeKeys=(groupKeys|| []).filter(Boolean);if(!activeKeys.length){return[{name:'\x45\x6c\x65\x6d\x65\x6e\x74\x6f\x73\x20\x76\x69\x73\x69\x62\x6c\x65\x73',count:elements.length,elements,children:[]}];}
const root={name:'\x72\x6f\x6f\x74',count:0,elements:[],children:[],childMap:new Map()};for(const element of elements){let current=root;current.count++ ;current.elements.push(element);for(let groupIndex=0;groupIndex<activeKeys.length;groupIndex++ ){const key=activeKeys[groupIndex];const value=this.store._n16a(element,key)|| '\x3c\x53\x69\x6e\x20\x76\x61\x6c\x6f\x72\x3e';if(!current.childMap.has(value)){const node={name:value,count:0,elements:[],children:[],childMap:new Map(),groupKey:key,groupIndex:groupIndex};current.childMap.set(value,node);current.children.push(node);}
current=current.childMap.get(value);current.count++ ;current.elements.push(element);}}
cleanup(root);return root.children;}}
function cleanup(node){delete node.childMap;node.children.sort((a,b)=> a.name.localeCompare(b.name));for(const child of node.children)cleanup(child);}
window._yT=_yT;})();