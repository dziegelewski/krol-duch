// 01. GAME INITIALIZATION
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------


// 1. loading ends

$('#loader-wrapper').hide();
$('.container').css("opacity", 1);

// 1.5 resume game


if ($.cookie("level")) {
	var startingLevel = $.cookie("level")
	addAshesToBag(startingLevel);
}

// 2. start game

$('#startContainer').click(function () {
	startGame(5000);
})

function startGame(startingSpeed) {
	$("#startContainer").fadeOut(startingSpeed);
	$('.gameWrapper, #gameContainer').fadeIn(startingSpeed).css("z-index", 1000);
	$('#health').animate({width: "980px"}, startingSpeed *0.8);

	// big hide
	$('.obolz, #hero, .kalamarz, .klucz, #choosePoem, td, #healthInfo, #sellInfo, #mercInfo, #nopackinfo, #poemSpec, #poemSpecInfoAbort, #konskrot, #redInfoZaklety').hide();

	// When game has begun
	state ("STROFA I", true)
	state("Po śmierci starego władcy synowie Lecha okryli Cię purpurą. Lecz, na swą zgubę, nie wiedzieli, że w twym wenedyjskim sercu jest tylko zemsta. I jeszcze jeden, po stokroć straszniejszy – i po tysiąckroć piękniejszy – cel.", true)
	state("Nastał pierwszy dzień twych ponurych rządów – niech potoczą się głowy poddanych.", true)
	state("[Klikaj w wizerunek orła, bacznie przy tym obserwując dolny pasek symbolizujący twoją witalność. Gdy jej wartość spadnie do zera, pożegnasz się z życiem.]")
	silent(findPotion, 1);

	Hero.regenerationStream();
	Hero.refresh();

	unitsStrike();
	printPoem();

	setInterval(function () {
		statistics.gameTime ++ ;
	}, 1000)
}