var MD=MD||{};MD.HttpModules={};(async()=>{const HttpSocketModule=class HttpSocketModule{constructor(){var args=arguments[0]||{};this.routes=args.routes;this.loaded=false;}
isSame(){for(var e=0;e<this.routes.length;e++){if(MD.HttpClient.current==this.routes[e]){return true;}}
return false;}
async init(){if(!this.loaded){await this.load(MD.HttpClient.socket);this.loaded=true;for(var e=0;e<this.routes.length;e++){var curr=this.routes[e];if(MD.HttpModules.hasOwnProperty(curr)){MD.HttpModules[curr].push(this);}else{var arr=MD.HttpModules[curr]=[];arr.push(this);}}}}}
MD.HttpSocketModule=HttpSocketModule;})();