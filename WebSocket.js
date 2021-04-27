var MD=MD||{};(async()=>{if(MD.JsonWebSocket){return;}
const JsonWebSocket=class JsonWebSocket extends MD.EventEmitter{constructor(){super();var args=arguments[0];this.address=args.address;this.reconnect=typeof args.reconnect==="undefined"?true:args.reconnect;this.interval=2000;this.connected=false;}
connect(){if(this.connected){return;}
this.connected=false;this.initSocket();}
send(uid,ob){var ob=JSON.stringify(ob);var send=JSON.stringify({"UID":uid,"Data":ob});this.socket.send(send);}
initSocket(){this.socket=new WebSocket(this.address);this.socket.onopen=()=>{this.connected=true;this.emit("connect",{});};this.socket.onmessage=(message)=>{if(typeof message.data!=="string"){return this.emit("binary",message.data);}
try{var data=JSON.parse(message.data);if(typeof data.UID!=="string"||data.UID.length==0){return;}
var ob=JSON.parse(data.Data);this.emit(data.UID,ob);}catch(e){}};this.socket.onclose=()=>{this.connected=false;this.emit("disconnect",{});if(this.reconnect){setTimeout(()=>{this.connect();},this.interval);}};this.socket.onerror=()=>{};}}
MD.JsonWebSocket=JsonWebSocket;})();