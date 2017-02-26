// 09. DEVELOPER MODE
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var developerMode = 0;
var dev = 0;

$('h3').click(function () {
	dev --;
	console.log(dev)
	if (dev >= 6) {
	developerMode = true;
	fastState('Tryb developera aktywny.')
	}
})
$('#health').click(function () {
	console.log(dev)
	dev *= -1;
})



if (developerMode) {

	var quickStart = 0;
	var quickEnd = 0;
	var instantDeath = 0;

	var startAtLevel = 1;

	obols = 0;

	// Start game alarm
	// sound("coin");

	if (quickStart) {
		startGame(0);
	}
	
	if (instantDeath) {
		Hero.hurt(health, true);
	}

	for (var s=1; s < startAtLevel; s++) {
		silent(fastLevelUp);
	}


	// Firing mercenaries
	$('body').on("mousedown", ".mercenary", function (e) {
		if (e.which === 3) {
			var id = $(this).attr("id").substr(4);
			merc[id].fire();
		}
	})

	function plz (poem, howMany) {
		var howMany = howMany || 1;
		for (var i=0; i<howMany; i++) {
		book[bysh(poem)].toBag();
		}
		return bysh(poem)
	}

	function plzRange (poemFrom, poemTo) {
		for (var i=poemFrom; i<poemTo; i++) {
			book[i].toBag();
		}
	}

	function printAvailablePoemsRaport (art) {
		var art = art || Hero.artism
		art = availableByArtism(art);
		var printedArray = []
		for (var i=1; i<art; i++) {
			if (i<=page) {
			printedArray.push(book[i].title)
			} else {
			printedArray.push(undefined)

			}
		}
		return  printedArray;
	} 

	function availableAt (poemName) {
		var poemNr = bysh(poemName);
		for (var i=1; i<100; i++) {
			if (availableByArtism(i) >= poemNr)
				return i;
		}
	}

	function lvl (lvl) {
		var lvl = lvl - level
		for (var i=0; i<lvl; i++) {
			silent(fastLevelUp)
		}
	}


}

// developer's keys
	$(document).keydown(function (e) {
		if (developerMode) {
			switch (e.which - 48) {
				case 1: // level up
				fastLevelUp();
				break;
				
				case 2:
				findItem();
				break;

				case 3:
				if (Hero.artism > 0) {
					vein();	
				}
				break;

				case 4:
				findPotion();
				break;
			
				case 8:
				blockConsoles = !blockConsoles;
				break;
			}
		}
	}) 

// Titles to use:
// Stokrótki
// Bałtyk
// Za zbłąkanych
// Noc natchnienia
// Sieroty / Modlitwa sierot
// Ze snu
// Słowik
// Potok i serce
// Rojenie wiosenne
