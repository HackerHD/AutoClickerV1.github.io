var MD=MD||{};(()=>{if(MD.HttpClient){return;}
const HttpClient=class HttpClient{constructor(){this.loaded={};this.loaded.css={};this.loaded.js={};this.initSocket();}
initSocket(){var url=document.querySelector(".http-socket").textContent.trim();this.currLanguage=document.querySelector(".current-language").textContent.trim();this.langs=JSON.parse(document.querySelector(".lang-list").textContent.trim());this.fetching=false;this.indicatorBase=document.getElementById("page-loader");this.indicator=this.indicatorBase.querySelector("div");if(url=="-"){return location.reload();}
if(BroadcastChannel)
this.initBroadcast();this.active=true;this.needsSendage=false;window.onfocus=()=>{if(this.needsSendage&&this.socket.connected){this.socket.send("http-request",{"Url":this.getPathname(),"IsRender":false});this.needsSendage=false;}
this.active=true;}
window.onblur=()=>{this.active=false;}
this.socket=new MD.JsonWebSocket({"address":url});this.socket.on("connect",async()=>{if(this.active){this.socket.send("http-request",{"Url":this.getPathname(),"IsRender":false});this.current=this.getPathname();this.needsSendage=false;}else{this.needsSendage=true;}});this.socket.on("http-get-data-client",async(data)=>{console.log(data);});this.socket.on("http-request-result",async(data)=>{if(data.Code==200){this.fetching=true;this.updateLanguage(data.Language);this.currLanguage=data.CurrentLanguage;this.setProgress(40);await this.loadCSSs(data.Styles);this.setProgress(55);await this.loadJSs(data.Scripts);this.setProgress(85);document.getElementById("page-content").innerHTML=data.Body;document.title=data.Title;if(data.Url=="default")
window.history.pushState(null,null,"/");else
window.history.pushState(null,null,"/"+data.Url+data.Query);await this.initLinks();this.setProgress(0);this.current=data.Url;if(MD.HttpModules.hasOwnProperty(data.Url)){var arr=MD.HttpModules[data.Url];for(var e=0;e<arr.length;e++){await arr[e].reload(true);}}else if(data.AlternateCode&&MD.HttpModules.hasOwnProperty(data.AlternateCode)){var arr=MD.HttpModules[data.AlternateCode];for(var e=0;e<arr.length;e++){await arr[e].reload(true);}}
this.fetching=false;if(data.Url=="default"){ga('set','page',"/");}else{ga('set','page',"/"+data.Url+data.Query);}
ga('send','pageview');}});this.socket.on("http-update-remember",async(data)=>{if(this.channel){this.channel.postMessage(data);}
var rdata=await(fetch("/set-remember-cookie/"+data.RememberID,{"method":"GET","mode":"same-origin","cache":"no-cache","credentials":"same-origin","headers":{}}).then(resp=>resp.json()));});this.socket.on("http-update-session",async(data)=>{if(this.channel){this.channel.postMessage(data);}
var rdata=await(fetch("/set-session-cookie/"+data.SessionID,{"method":"GET","mode":"same-origin","cache":"no-cache","credentials":"same-origin","headers":{}}).then(resp=>resp.json()));});window.onpopstate=async(event)=>{await this.sendHttpRequest(this.getPathname()+document.location.search);};this.socket.connect();}
getPathname(){var path=location.pathname.replace(new RegExp("^["+"/"+"]+"),"").replace(new RegExp("["+"/"+"]+$"),"");var spl=path.split("/");if(this.containsLanguage(spl[0])){spl.splice(0,1);return spl.join("/");}
return path;}
containsLanguage(lang){return this.langs.indexOf(lang)>-1;}
getLanguage(path){if(typeof path==="string"){path=path.replace("{{","").replace("}}","").split(".");}
var curr=this.language;for(var e=0;e<path.length;e++){if(!curr.hasOwnProperty(path[e])){return "{NotFound}";}
curr=curr[path[e]];}
return curr;}
initLanguage(){this.language={};var node=document.querySelector("#language-data");if(node){var data=JSON.parse(node.innerHTML.trim());this.updateLanguage(data);}}
updateLanguage(data){if(data!=null){for(var prop in data){var items=data[prop];var tar={};for(var inner in items){var split=inner.split(".");var index=split.length>1?split[1]:split[0];tar[index]=items[inner];}
this.language[prop]=tar;}}}
initBroadcast(){this.channel=new BroadcastChannel('app-data');this.channel.addEventListener('message',(event)=>{var data=event.data;if(data.SessionID){this.socket.send("http-update-session",data);}
if(data.RememberID){this.socket.send("http-update-remember",data);}});}
async loadJSs(jss){var p=Promise.resolve();for(var e=0;e<jss.length;e++){var js=jss[e];if(this.loaded.js.hasOwnProperty(js)){continue;}
if(this.shouldRefresh(js,this.loaded.js)){location.reload();return;}
p=p.then(function(jsx){return this.loadJS(jsx);}.bind(this,js));}
await p;}
async loadCSSs(styles){var p=Promise.resolve();for(var e=0;e<styles.length;e++){var style=styles[e];if(this.loaded.css.hasOwnProperty(style)){continue;}
if(this.shouldRefresh(style,this.loaded.css)){location.reload();return;}
p=p.then(function(jsx){return this.loadCSS(jsx);}.bind(this,style));}
await p;}
shouldRefresh(url,ob){if(url.indexOf("?")==-1){return false;}
var spl=url.split("?");if(spl.length!=2){return false;}
var params=new URLSearchParams("?"+spl[1]);var version=params.get("v");if(version&&ob.hasOwnProperty(spl[0])){return true;}else if(version){for(var prop in ob){var split=prop.split("?");if(split.length==2&&spl[0]==split[0]){return true;}}}
return false;}
loadJS(js){return new Promise((res,rej)=>{var scr=document.createElement("script");scr.type="text/javascript";scr.src=js;scr.onload=()=>{this.loaded.js[js]=true;res();}
scr.onerror=()=>res();scr.setAttribute("defer","");scr.defer=true;document.head.appendChild(scr);});}
loadCSS(style){return new Promise((res,rej)=>{var link=document.createElement('link');link.setAttribute("rel","stylesheet");link.setAttribute("type","text/css");link.onload=()=>{this.loaded.css[style]=true;res();}
link.onerror=()=>res();link.setAttribute("href",style);document.head.appendChild(link);});}
async sendHttpRequest(url){if(this.fetching||document.readyState!="complete"){return;}
if(this.socket.connected){this.setProgress(20);this.socket.send("http-request",{"Url":url,"IsRender":true});}}
async initLinks(){this.links=document.querySelectorAll(".int-link");for(var e=0;e<this.links.length;e++){var curr=this.links[e];if(curr.classList.contains("handled"))continue;this.link(curr);curr.classList.add("handled");}}
link(node){node.addEventListener("click",async(e)=>{e.preventDefault();var node=e.currentTarget;var url=node.getAttribute("href");if(this.socket.connected){await this.sendHttpRequest(url);}else{location.href=url;}
return false;});}
setProgress(n){if(n>0&&n<100){this.indicatorBase.classList.remove("hidden");}else if(!this.indicatorBase.classList.contains("hidden")){this.indicatorBase.classList.add("hidden");}
this.indicator.style.transform="translateX(-"+(100-n)+"vw)";}}
MD.HttpClient=HttpClient;})();window.addEventListener("DOMContentLoaded",async()=>{if(MD.HttpClient.socket){return;}
MD.HttpClient=new MD.HttpClient();await MD.HttpClient.initLinks();MD.HttpClient.initLanguage();});