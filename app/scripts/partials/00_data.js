// 00. DATA
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

$(function () {

var maxpack = 32;
var itemsInGame = 0;
var activeSelection;

var obols = 0;
var earnings; // defined in Hero.refresh
var allMercenariesNumber = 0;
var deadsArray = [];
var blockStates = false;

var statistics = {
	gameTime : 0,
	heroAttacks: 0,
	mercsAttacks: 0,
	mercsHired: 0,
	moneySpent: 0,
	usedPoems: 0,
	foundedItems: 0,
	drinkedPotions: 0,
	critisc: 0
}

/*! jquery.cookie v1.4.1 | MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?a(require("jquery")):a(jQuery)}(function(a){function b(a){return h.raw?a:encodeURIComponent(a)}function c(a){return h.raw?a:decodeURIComponent(a)}function d(a){return b(h.json?JSON.stringify(a):String(a))}function e(a){0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return a=decodeURIComponent(a.replace(g," ")),h.json?JSON.parse(a):a}catch(b){}}function f(b,c){var d=h.raw?b:e(b);return a.isFunction(c)?c(d):d}var g=/\+/g,h=a.cookie=function(e,g,i){if(void 0!==g&&!a.isFunction(g)){if(i=a.extend({},h.defaults,i),"number"==typeof i.expires){var j=i.expires,k=i.expires=new Date;k.setTime(+k+864e5*j)}return document.cookie=[b(e),"=",d(g),i.expires?"; expires="+i.expires.toUTCString():"",i.path?"; path="+i.path:"",i.domain?"; domain="+i.domain:"",i.secure?"; secure":""].join("")}for(var l=e?void 0:{},m=document.cookie?document.cookie.split("; "):[],n=0,o=m.length;o>n;n++){var p=m[n].split("="),q=c(p.shift()),r=p.join("=");if(e&&e===q){l=f(r,g);break}e||void 0===(r=f(r))||(l[q]=r)}return l};h.defaults={},a.removeCookie=function(b,c){return void 0===a.cookie(b)?!1:(a.cookie(b,"",a.extend({},c,{expires:-1})),!a.cookie(b))}});




var cookiesArr = [
'level', 'damage', 'obols', 'maxheath', 'attack', 'defense', 'artism', 'magicAttack', 'potions', 'mercenaries', 'statistics', 'Heroweapon', "Heroarmor", "Heropen", 'deadsArray'
]


function update (whichCookieToUpdade, newValue) {
	if (level > 1) {
		if (whichCookieToUpdade === 'potions') {
			$.cookie('potions', Hero.potions.toString())
		} else if (whichCookieToUpdade === 'mercenaries') {
			$.cookie('mercenaries', mercenariesAmountArray.toString())
		} else if (whichCookieToUpdade === 'deadsArray') {
			$.cookie('deadsArray', deadsArray.toString())
		} else {
			$.cookie(whichCookieToUpdade, newValue)
			
		}
	}
}

function removeCookies () {
	for (var i=0; i<cookiesArr.length; i ++) {
		$.removeCookie(cookiesArr[i])
	}
}

function saveStatistics () {
	$.cookie('statistics', JSON.stringify(statistics));
	$.cookie('health', Hero.health);
}



