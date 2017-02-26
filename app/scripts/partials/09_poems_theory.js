// 09. POEMS THEORY
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

// add short names for the array
$.each(book, function(index, value) {
	value.short = poemNameParse(value.title)
})

// Create favourite poems array
statistics.favouritePoemsArray = [0]
for (var i=0; i<100; i++) {
	statistics.favouritePoemsArray.push(0)
}



function poemNameParse(title) {
	return title.toLowerCase().replace(/ /g, '_').replace(/-/g, '_').replace(/ć/g, 'c').replace(/ą/g, 'a').replace(/ę/g, 'e').replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o').replace(/ś/g, 's').replace(/ż/g, 'z').replace(/ź/g, 'z')//.split(' ')[0]
}

// Extra functions

function pageByShortTitle (short) {
	var searchedPage;
	$.each(book, function(index, value) {
		if (value.short == short) {
			searchedPage = value.page;
			return true;
		}
	})
	return searchedPage;
}

//alias
var bysh = pageByShortTitle;


Poem.prototype.provideInfo = function (whilePicking) {
	var time = this.time;
		if (whilePicking) {
			var _header = $('.pickPoemInfo h2.newPoemInfo');
			var _info = _header.next();
			var _info2 = _info.next();
			var _info3 = _info2.next();
		} else {
			var _header = header;
			var _info = info;
			var _info2 = info2;
			var _info3 = info3;
		}


		_header.html('<span style="color: ' + this.color + '">' + this.title + '</span>')
		_info.text(this.description);
		if (time>0) {
			var timeInfo = "Czas trwania: " + timeLeft(time) + '.'
		} else if (!time) {
			var timeInfo = "Działa natychmiast po użyciu."
		} else {
			var timeInfo = "Czas trwania: " + timeLeft(Math.abs(time)) + '.'
			_info3.text("Nie można przerwać!")
		}
		_info2.text(timeInfo)
	}

	Poem.prototype.svg = function () {
		var color = this.color;
	return '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="33px" height="48px" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"viewBox="0 0 35 55" xmlns:xlink="http://www.w3.org/1999/xlink"> <g id="Warstwa_x0020_1">  <metadata id="CorelCorpID_0Corel-Layer"/>  <path fill="#D7B56D" stroke="#DCCF73" stroke-width="0.20008" d="M7 2c1,0 1,1 6,1 6,0 17,-2 20,-1 1,0 0,2 0,2l0 0 -2 1 2 0 -1 6 -1 0 -4 0 4 1 1 0 0 3 -1 0 1 0 -1 10 0 2 -3 0 3 1 -1 6c0,1 -1,1 -2,1l-4 0 -2 -1 -2 1 0 0c-2,0 -6,0 -10,-1 -1,0 -5,0 -7,0l0 -1 -1 0 0 0 1 -10 0 0 1 -1 -1 0c0,-4 -1,-18 4,-17z"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M19 18c0,1 -1,1 -1,1 0,0 -1,0 -1,0"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M20 19c-1,1 -2,1 -3,1 -1,0 -1,-1 -1,-1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M19 21c-1,1 -3,0 -4,-1 -1,-1 -1,-2 -1,-3"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M18 22c-2,0 -4,-1 -5,-3 0,-1 0,-2 0,-4"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M16 23c-2,-1 -4,-3 -4,-6 0,-1 1,-3 2,-4"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M13 22c-2,-2 -3,-5 -1,-8 1,-2 2,-3 4,-3"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M10 20c-1,-3 0,-7 2,-9 2,-1 4,-2 6,-2"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M9 16c0,-4 3,-7 7,-8 2,-1 5,0 7,1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M9 12c2,-4 6,-6 10,-5 3,0 5,2 6,4"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M11 8c4,-3 9,-3 13,-1 2,2 4,4 5,7"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M15 5c5,-1 10,1 13,5 2,3 2,6 2,9"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M18 16c1,0 2,1 2,2"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M19 15c1,1 2,2 1,3"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M21 15c1,1 1,4 0,5"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M22 16c1,2 0,5 -3,6"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M23 18c0,3 -3,6 -6,5"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M24 20c-2,3 -6,5 -9,3"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M23 23c-3,3 -8,2 -11,-1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M20 26c-5,1 -10,-2 -11,-6"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M16 27c-5,-1 -9,-6 -8,-11"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M12 26c-5,-3 -7,-10 -3,-15"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M8 24c-4,-6 -2,-13 3,-17"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M16 18c0,0 0,0 0,0 0,-1 0,-1 1,-1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M15 17c0,0 0,0 0,-1 0,-1 1,-2 2,-2"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M15 15c0,0 0,0 1,-1 1,-1 3,-1 4,-1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M15 13c0,0 1,0 1,0 2,-1 4,0 5,1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M17 12c0,0 1,0 1,0 2,0 4,2 5,4"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M19 11c1,0 1,0 1,1 2,1 4,4 4,7"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M23 11c0,0 1,1 1,1 2,3 2,6 1,9"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M26 13c0,1 1,1 1,2 1,4 0,7 -3,9"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M28 16c0,1 0,2 0,2 -1,4 -4,7 -8,8"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M29 20c0,1 -1,2 -1,2 -2,4 -7,6 -11,5"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M27 25c-1,1 -1,1 -2,2 -4,3 -9,3 -14,0"/> </g></svg>';
	}


	Poem.prototype.toBag = function () {
		var div = '<div data-poem="'+this.page+'"data-descr="poem" id="'+ itemsInGame +'" class="poem"><div style="background: none">'+this.svg()+'</div></div>';
		sound("paper");
		$('.inventory').append(div)
		itemsInGame ++;
	}


// Currently active poems

// variable1 and variable2 for saved game

var activePoemsNumber = 0;
var performed = {}

setInterval(function () {
	$.each(performed, function(index, value) {
    value.last();
	})
}, 1000);


function activePoem (short, maxtime, time) {
	this.short = short
	this.maxtime = maxtime;
	this.time = time

	this.last = function () {
		if (this.time > 0) {
			this.time --;
			var thePoem = $('.poem-slot .' + this.short)
			thePoem.find('p span').text(timeLeftShort(this.time));
			thePoem.find('.line').width(this.time/this.maxtime * 105 + 35 + "px")
		} else {
			this.complete();
		}
	}


	this.complete = function () {
		// remove from the tray
		// ...
		poemCompleteEffect(this.short)
		delete performed[this.short]
		var that = this;
		$('.poem-slot .' + this.short).animate({
			height: "0px",
			opacity: '0'
			}, 200, "swing", function () {
				$('.poem-slot .' + that.short).remove();
				// performed[that.short] = 0;
				activePoemsNumber --;
				// delete currentPoems[short]
				Hero.refresh();
				// as well as mercenaries - todo
			})
	}
}









// --------------------------
// Start or abort poem
$('.inventory').on("mousedown", ".poem", function (e) {
	var poemPage = $(this).attr('data-poem')
	if (e.which !== 3) {
		if (readPoem(poemPage) !== false) {
			$(this).remove();
			hideInfo()
		}
	} else {
		$(this).remove();
		sound('tear');
		hideInfo()
	}
})


function readPoem (page, time) {
	if (isNaN(page)) {
		page = pageByShortTitle(page)
	}
	var short = book[page].short;  
	var maxtime = book[page].time

	if (maxtime != 0) {
		if (activePoemsNumber === 3 && notPerform(short)) {
			fastState('Możesz odczytywać tylko trzy poematy jednocześnie.')
			return false
		} else {
			sound('poem');
			hideInfo();
			statistics.usedPoems ++;
			// adding (or not) unendable sign
			if (maxtime > 0) {
				var endable = "";
			} else {
				maxtime = Math.abs(maxtime);
				var endable = " data-unendable ";
			}
			// if poem is uded normally (not by resuming game)
			if (time === undefined) {
			time = maxtime;
			statistics.favouritePoemsArray[page] ++
			}

			//What if its already used?
			if (ifPerform(short)) {
				performed[short].time = time +1;
				performed[short].last();
			// Not already used 
			} else {
				var firstColor = book[page].color;
				var backgroundColor = colorChanger(firstColor,3)
				var gradient = "background: "+backgroundColor+"; background: -webkit-radial-gradient("+backgroundColor+", "+firstColor+"); background: -o-radial-gradient("+backgroundColor+", "+firstColor+"); background: -moz-radial-gradient("+backgroundColor+", "+firstColor+"); background: radial-gradient("+backgroundColor+", "+firstColor+")"
				var orb = "<div style='"+gradient+";' class='orb'></div>";
				var timeLeftInfo = "<p><span>"+ timeLeftShort(time) +"</span></p>"
				var line = "<div style='"+gradient+";' class='line'>"+orb+timeLeftInfo+orb+"</div>";
	
				var div = "<div"+endable+" data-poem='"+ page +"' data-descr='poem' class='" + short + "'>" + line + "</div>"
				$('.poem-slot').append(div)
				performed[short] = new activePoem (short, maxtime, time);
				poemStartEffect(short);
				activePoemsNumber ++;
			}
		}
	} else {
		statistics.usedPoems ++;
		sound('poem');
		hideInfo();
		poemStartEffect(short);
		statistics.favouritePoemsArray[page] ++
	}
	// remove from poemsInBag
	Hero.refresh();
}

// allias
var read = readPoem


// 
$('.poem-slot').on("mousedown", "> div", function (e) {
	if (e.which === 3) {
		if ($(this).attr("data-unendable") === undefined) {
			var whichPoem = $(this).attr("class");
			if (abort(whichPoem)) {
				hideInfo();
			}	
		} else {
			fastState('Nie można przerwać tego poematu.')

		}
		
	}
})



function abort (poem) {
	if (ifPerform(poem)) {
		performed[poem].complete();
		sound('tear');
		return true;
	} else {
		return false
	}
}


// ---------------------
// Supporting functions

function timeLeft (time) {
	if (time > 180) {
		return Math.floor(time/60) + " min"
	} else {
		return time + " s";
	}
}

function timeLeftShort (time) {
	if (time > 180) {
		return Math.floor(time/60) + "'"
	} else {
		return time + '"';
	}
}

function ifPerform (a) {
	if (typeof performed[a] !== 'undefined') {
   		return 1;
	} else {
		return 0;
	}
}
function notPerform (a) {
	if (typeof performed[a] !== 'undefined') {
   		return 0;
	} else {
		return 1;
	}
}

function colorChanger (hexcolor, modificator) {
	var modificator = modificator || 1;
	var returnedColor = '#'
	hexcolor = hexcolor.split("").splice(1)
	for (var i=0; i<6; i++) {
		hexcolor[i] = parseInt(hexcolor[i], 16);
		hexcolor[i] += modificator;
		if (hexcolor[i] > 15) {
			hexcolor[i] = 15;
		} else if (hexcolor[i] < 0) {
			hexcolor[i] = 0;
		}
		hexcolor[i] = hexcolor[i].toString(16)
		returnedColor += hexcolor[i]
	}
	return returnedColor
}

colorChanger(book[5].color)