var MD=MD||{};(async()=>{var Animation=function Animation(){this.timing={};this.timing.linear=function(s){return s}}
Animation.prototype.do=function(timing,draw,duration,end){if(timing==null){timing=this.timing.linear;}
var start=performance.now();requestAnimationFrame(function animate(time){var timeFraction=(time-start)/duration;if(timeFraction>1)timeFraction=1;if(timeFraction<0)timeFraction=0;var progress=timing(timeFraction);draw(progress);if(timeFraction<1){requestAnimationFrame(animate);}else{if(end)end();}});}
Animation=new Animation();var Mover=function(to,duration,end,timing,minus){var getScrollPosition=function(){return window.pageYOffset||document.documentElement.scrollTop;}
var setScrollPosition=function(off){document.documentElement.scrollTop=document.body.scrollTop=off;}
var getElementScrollPosition=function(elem){return elem.offsetTop||elem.scrollTop;}
if(!minus){minus=0;}
var current=getScrollPosition();var goal=getElementScrollPosition(to)-minus;var diff=current-goal;Animation.do(timing,function(s){setScrollPosition(current-diff*s);},duration,end);}
var ClickMover=function(from,to,duration,end,timing,minus){from.addEventListener("click",function(){Mover(to,duration,end,timing,minus);});}
const Home=class Home extends MD.HttpSocketModule{constructor(){super({"routes":["default"]});}
async load(socket){if(console)
console.log("LOAD Home");this.socket=socket;}
async reload(load){if(console)
console.log("RELOAD Home");this.nodes={};this.sending=false;this.nodes.goToFeature=document.querySelector("#to-features");this.nodes.features=document.querySelector("#features");ClickMover(this.nodes.goToFeature,this.nodes.features,200,function(){},null,80);if(load){try{for(var e=0;e<6;e++){(adsbygoogle=window.adsbygoogle||[]).push({});}}catch(e){console.log(e);}}}}
MD.Home=Home;})();if(document.readyState=="complete"||document.readyState=="loaded"){(async()=>{if(MD.HomeModule){return;}
const home=new MD.Home();await home.init();MD.HomeModule=home;})();}else{window.addEventListener("DOMContentLoaded",async()=>{const home=new MD.Home();await home.init();await home.reload();MD.HomeModule=home;});}