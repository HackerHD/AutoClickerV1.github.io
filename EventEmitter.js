var MD=MD||{};(async()=>{if(MD.EventEmitter){return;}
const EventEmitter=class EventEmitter{constructor(){this._events={};}
once(event,listener){var func=async(ob)=>{this.remove(event,func);await listener(ob);};this.on(event,func.bind(this));}
on(event,listener){var evt=null;if(!this._events.hasOwnProperty(event)){this._events[event]=evt=[];}else{evt=this._events[event];}
evt.push(listener);}
async emit(event,ob){if(!this._events.hasOwnProperty(event)){return;}
var arr=this._events[event];for(var e=0;e<arr.length;e++){await arr[e](ob);}}
remove(event,listener){if(!this._events.hasOwnProperty(event)){return;}
var arr=this._events[event];for(var e=arr.length-1;e>=0;e--){if(arr[e]==listener){arr.splice(e,1);}}}}
MD.EventEmitter=EventEmitter;})();