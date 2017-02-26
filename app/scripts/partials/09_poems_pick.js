// 09. POEMS PICK
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var inkwell = []


function addInkwell () {
	var inkwellIcon = "<div class='inkwell' data-descr='inkwell' data-potion-type='0' data-potion-amount='1'><div></div><p></p></div>"
	if ($('.inventory > .key').length) {
		$('.inventory > .key').last().after(inkwellIcon);
	} else {
		$('.inventory').prepend(inkwellIcon);
	}
}

var romantycznosc = pageByShortTitle('romantycznosc')
var grob_agamemnona = pageByShortTitle('grob_agamemnona')

function availableByArtism (val) {
	var hugeArtism = 30
	if (val < hugeArtism) {
		val = val * 2 + 5
	} else {
		var overHugeArtism = val - hugeArtism;
		val = hugeArtism;
		val = val * 2 + 5 + overHugeArtism
	}
	return val;
}

function vein (theLastVein) {
	if ((inkwell.length < 5 || theLastVein) && notPerform('zelazna_rekawica')) {
		sound('poem');
		if (theLastVein) {
			inkwell.push([page])
		} else {
			inkwell.push(poemsInVein())
		}

		if (inkwell.length === 1) {
				addInkwell()
			}
		$('.inkwell').attr("data-potion-amount", inkwell.length);
		state("Nadeszła wena.")

		function poemsInVein () {
			var artism = Hero.artism
			var maxVein = availableByArtism(artism)
			var fromVein  = [];
			var forbiddenPoemNo1, forbiddenPoemNo2;


			// WARNING!
			// trzeba dać romantyczność i grób agamemnona
			if (merc[3].check === true) {
				forbiddenPoemNo1 = romantycznosc;
			}
			if (merc[8].check === true) {
				forbiddenPoemNo2 = grob_agamemnona;
			}

			for (var j=0; j<4; j++) {
				if (fromVein[j] != undefined) {
					break;
				}
				do {
					fromVein[j] = losuj(1,maxVein)
				} while (diverstityTest(fromVein[j]))
			}

			function diverstityTest(x) {
				for (var i = 0; i < fromVein.length; i ++) {
					if (x == fromVein[i-1]) {
						return true;
					}
				}
				if (x === forbiddenPoemNo1 || x === forbiddenPoemNo2) {
					return true;
				}
				return false;
			}

			fromVein.shuffle()
			fromVein.push(Hero.artism)
			return fromVein;
		}
	}
}

function pourInkwell () {
	if (inkwell.length > 0 && inkwell[0].length > 0) {
		inkwell.shift();
		var howMany = inkwell.length
		$('.inkwell').attr("data-potion-amount", howMany);
		if (howMany < 1) {
			$('.inkwell').remove();
		}
	}
}

$('.inventory').on("mousedown", ".inkwell", function (e) {
	if (e.which === 1) {
		choosePoem();
	} else if (e.which === 3) {
		pourInkwell();
		sound("crush");
	}
})

function choosePoem () {
	if (!Hero.alive) return
	$('.fogContainer').fadeToggle('fast');
	$('.pickContainer').toggle('fast');
	cleanPickPoemInfo()
	if (inkwell[0].length === 5) {
		for (var i=0; i<4; i++) {
			var color = book[inkwell[0][i]].color
			var theSpiral = drawSpiral(color)
			$('.pickContainer .options div:nth-child(' + (i+1) + ')').attr('data-poem', inkwell[0][i]).html(theSpiral).show()
		}
	} else {
		var color = book[page].color
		var theSpiral = drawSpiral(color)
		$('.pickContainer .options div').hide();
		$('.pickContainer .options div:first-child').show().attr('data-poem', inkwell[0][0]).html(theSpiral);
	}



	function drawSpiral (color) {
		return '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg4345" viewBox="0 0 40 40.000001" height="40" width="40"> <defs id="defs4347" /> <metadata id="metadata4350"> <rdf:RDF> <cc:Workrdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g transform="translate(0,-1012.3622)" id="layer1"> <path transform="matrix(0.05783034,0,0,0.05603657,-0.99166212,1011.8132)" style="opacity:1;fill:none;fill-rule:evenodd;stroke:'+color+';stroke-width:33;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path4292" d="m 348.51474,351.37796 c 0.90705,4.43162 -6.07527,3.18648 -7.86976,1.61076 -6.48934,-5.69819 -1.85937,-15.73658 4.19477,-19.56584 11.98047,-7.57769 27.12879,0.3118 32.76448,12.00113 8.87313,18.40434 -2.85479,39.60108 -20.7049,46.91897 -25.09876,10.28957 -52.84098,-5.63492 -61.80855,-30.03037 -11.78179,-32.05126 8.59215,-66.68766 39.83987,-77.30311 39.23488,-13.32885 81.04147,11.69239 93.31532,50.04932 14.91956,46.62503 -14.91331,95.83373 -60.60155,109.78196 -54.20124,16.54717 -111.01391,-18.23901 -126.65491,-71.45489 -18.20711,-61.94665 21.65756,-126.54302 82.57753,-143.89617 69.84731,-19.89611 142.38998,25.15966 161.47487,93.94428 21.61167,77.89149 -28.7378,158.52935 -105.53469,179.36544 C 293.438,526.15123 204.56735,470.4136 181.961,385.46766 156.84615,291.09575 218.05961,193.86419 311.28217,169.46897 414.07429,142.56951 519.78679,209.34069 545.98896,310.95955 574.69339,422.28286 502.28758,536.58929 392.15963,564.61595 272.19995,595.14471 149.19271,517.03165 119.32455,398.28789 86.953043,269.59182 170.84212,137.78232 298.30304,106.05619 435.83091,71.824306 576.53926,161.55482 610.13935,297.82945 646.24851,444.28032 550.61418,593.9798 405.43361,629.46933 249.97232,667.47199 91.193384,565.8742 53.799379,411.69938 13.887569,247.1437 121.506,79.200533 284.75984,39.887462 458.49069,-1.9485764 635.67961,111.74543 676.92592,284.15978 720.70077,467.14369 600.87833,653.65689 419.22493,696.85023" /></g></svg>'
	}


}

$('body').on("mouseover", ".pickContainer .options div ", function () {
		$('.veinLevel').hide();
		book[$(this).attr('data-poem')].provideInfo(true)
		
	})

$('body').on("mouseleave", ".pickContainer .options div ", function () {
	cleanPickPoemInfo();
})


$('body').on("click", ".pickContainer .options div ", function () {
		if (pack() >= maxpack) return
		book[$(this).attr('data-poem')].toBag();
		pourInkwell();
		choosingQuit();
		if (ifPerform('wielkie_slowa')) {
			sound('poem');
			Hero.heal(Hero.maxhealth)
			fastState('Poryw duszy uzdrowił twoje ciało.')
		}
	})

$('.choosingQuit').click(choosingQuit)


function choosingQuit () {
	cleanPickPoemInfo()
	$('.fogContainer').fadeToggle('fast');
	$('.pickContainer').toggle('fast');
}

function cleanPickPoemInfo () {
	$('.newPoemInfo').text('');
	if (inkwell[0]) {
		if(inkwell[0].length === 5) {
			$('.pickContainer .veinLevel h2 span').text((inkwell[0][4]))
		} else {
			$('.pickContainer .veinLevel h2 span').text('100')

		}
	} else {
		$('.pickContainer .veinLevel h2 span').text(0)
	}
	$('.veinLevel').show();
	if (pack() >= maxpack) {
		$('.noSpace').show();
	} else {

		$('.noSpace').hide();

	}

}

