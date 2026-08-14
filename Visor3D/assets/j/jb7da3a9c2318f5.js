(function(){const fallbackPalette=[0x5DA3F6,0xF48FB1,0x80CBC4,0xCE93D8,0xFFD54F,0xFFAB91,0xDCE775,0xC5CAE9,0xA5D6A7,0xFFCC80,0x4FC3F7,0xB2DFDB,0xFFF176,0xB39DDB,0x64B5F6,0xC5E1A5,0xFFE0B2,0x9FA8DA,0xB3E5FC,0xB0BEC5,0xE1BEE7,0x80DEEA,0xC8E6C9,0xFFE082,0xBCAAA4,0x9BC3F6,0xF0F4C3,0xF8BBD0,0xC5D4DC];function _ph(){if(window._o&& window._o.getPaletteNumbers){const palette=window._o.getPaletteNumbers();if(palette&& palette.length)return palette;}
return fallbackPalette;}
class _xX{constructor(store,viewer){this.store=store;this.viewer=viewer;}
_n48(elements,parameterKey){const map=new Map();for(const element of elements|| []){const value=this.store._n16a(element,parameterKey)|| '\x3c\x53\x69\x6e\x20\x76\x61\x6c\x6f\x72\x3e';if(!map.has(value))map.set(value,[]);map.get(value).push(element);}
const palette=_ph();return Array.from(map.entries()).sort((a,b)=> b[1].length-a[1].length|| a[0].localeCompare(b[0])).map(([value,items],index)=> ({value,elements:items,count:items.length,color:palette[index%palette.length]}));}
apply(elements,parameterKey){const buckets=this._n48(elements,parameterKey);const colorByKey=new Map();for(const bucket of buckets){for(const element of bucket.elements){colorByKey.set(this.store._C(element),bucket.color);}}
if(this.viewer&& this.viewer._fU)this.viewer._fU(colorByKey);return buckets;}
clear(){if(this.viewer&& this.viewer._eL)this.viewer._eL();}}
window._xX=_xX;})();