(function(){'use strict';class _ve3a2fc{_wf(x,y){this._pc={x,y};if(this._jT)return;const now=this._i?this._i():Date.now();const delay=Math.max(0,(this._IA|| 35)-(now-(this._zp|| 0)));this._jT=setTimeout(()=> {this._jT=null;const point=this._pc;this._pc=null;this._zp=this._i?this._i():Date.now();if(!point|| this.dragging)return;this._yO(point.x,point.y);},delay);}
_lu(){if(this._jT){clearTimeout(this._jT);this._jT=null;}
this._pc=null;}
_yO(x,y){if(this.measureActive&& this._fA())return;const mesh=this._y$(x,y);if(mesh=== this.hoveredMesh)return;const previousKey=this.visualHoverKey;if(!mesh|| this._IQ(mesh)){this.hoveredMesh=null;this.visualHoverKey=null;if(previousKey){if(this._bS)this._bS([previousKey]);else this._X([previousKey]);}
return;}
this.hoveredMesh=mesh;this.visualHoverKey=this._n12a(mesh);const changedKeys=new Set();if(previousKey)changedKeys.add(previousKey);if(this.visualHoverKey)changedKeys.add(this.visualHoverKey);if(this._bS)this._bS(changedKeys);else this._X(changedKeys);this.canvas.style.cursor='\x70\x6f\x69\x6e\x74\x65\x72';}
_b$(){const previousKey=this.visualHoverKey;this.visualHoverKey=null;this.hoveredMesh=null;this._xf=null;this._Ig=null;if(previousKey){if(this._bS)this._bS([previousKey]);else this._X([previousKey]);}
if(!this.dragging)this.canvas.style.cursor=(this.measureActive|| this._az)?'\x63\x72\x6f\x73\x73\x68\x61\x69\x72':'\x64\x65\x66\x61\x75\x6c\x74';}}
function create(){return new _ve3a2fc();}
window._EV=Object.freeze({create});})();