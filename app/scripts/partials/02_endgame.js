// 02. ENDGAME
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------



function endGame(causeOfDeath) {

	removeCookies();
	// Sounds and effects
	if (causeOfDeath === "win") {
		endingSpeed = 10000;
		setTimeout(function () {
			sound("win")
		}, 500)
	} else if (quickEnd) {
		endingSpeed = 0;
	} else {
		sound("bell");
		endingSpeed = 5000;
	}

	$("#endContainer").fadeIn(endingSpeed);
	$("#gameContainer").fadeOut(endingSpeed);
	$('.gameWrapper, .startWrapper').css('z-index', '-100');

	Hero.maxhealth = 0;
	Hero.nocturno = function () {}
	Hero.nocturnoStream = function () {}


	// ---------------------------
	// ---------------------------
	// Info in summary
	var deathDescription, gameSummary;

	switch (causeOfDeath) {
		case "win":
		deathDescription = "Powalił cię Boży grom.";
		break;
		case "myszy":
		deathDescription = "Zjadły cię myszy.";
		break;
		case "hekatoncheir":
		deathDescription = "Hekatoncheirowie rozszarpali cię w bitewnym szale.";
		break;
		case "pochodnia":
		deathDescription = "Spłonąłeś we własnym żarze.";
		break;
		case "kolos":
		deathDescription = "Kamienny posąg rozgniótł cię na miazgę.";
		break;
		case "testament":
		deathDescription = "Postanowiłeś opuścić już świat śmiertelnych i zstąpić do Hadesu.";
		break;
		case "nokturn":
		deathDescription = "Twój głód krwi okazał się zbyt silny.";
		break;
		case "fatum":
		deathDescription = "Los okazał się bezlitosny.";
		break;
		default:
		deathDescription = "Zginąłeś z rąk poddanych.";
		break;
	}

	if (causeOfDeath === "win") {
		gameSummary = "Wywołałeś furię samego Boga, a jego gniew wreszcie cię sięgnął. Spopielił cię jednym mgnieniem oka... Nie na marne więc wypowiedziałeś wojnę światu. Czas na odpoczynek. Jak Ulisses poszedł w prostego oracza, tak i ty, w nowym, uwolnionym od twego jarzma świecie, napijesz się letejskich wód, przyobleczesz nowe ciało, zaznasz upragnionego spokoju.";
	} else if (level > 40) {
		gameSummary = "Świat nie znał okrutniejszego władcy. Nim poległeś, znużony zabijaniem, śród morza krwi, w wąwozie kości... kątem oka niemalże dostrzegłeś jego obecność. Czy to Boże tchnienie doprowadziło do twej zguby? Tego nie dowiesz się już nigdy. Zapadasz się w otchłań niepamięci.";
	} else if (level > 30) {
		gameSummary = "W ciągnącej się eonami wszechchwili śmierci zadumałeś się nad swym losem. Dorównałeś najsroższym ziemskim tyranom, zbrodnią i żelazem wykułeś lud, który przetrwa każdą dziejową niedogodność. On jednak – milczący gospodarz niebios – nie dał ci ujrzeć swego oblicza."
	} else if (level > 20) {
		gameSummary = "Zadałeś swemu ludowi wiele cierpień. Umierasz jako władca, który przyniósł ze sobą krew, śmierć i terror. Wiesz jednak dobrze, że tylko takie rządy uczynią rodzącą się na twoich oczach Polskę silną. Przeklną cię, zetrą z kart swoich kronik – nie będą wiedzieć, że dziejowe burze przetrwali tylko dzięki tobie.";
	} else if (level > 10) {
		gameSummary = "Oto gorzkie odniosłeś zwycięstwo. Ani za twe zasługi lud nie postawi ci pomnika, ani jego dzieci nie zbledną ze strachu, słuchając opowieści o twoich czynach. Miot Lecha znał krwawszych tyranów: dziś ci urąga, nazajutrz o tobie zapomni.";
	}  else if (level > 5) {
		gameSummary = "Nie dość okrutne były twe rządy, by przekuć dusze poddanych w stal niepodatną na skruszenie. Umierasz śmiercią najpodlejszą, niby brutalny rzezimieszek.";
	} else {
		gameSummary = "Wypuściłeś z rąk berło, nim na dobre rozsiadłeś się na Lechowym tronie. Twój duch powraca do Hadesu w niesławie.";
	}


	function findFavouriteItem () {
		var favouriteItem = "gołe dłonie";
		var favouriteItemUses = 0;
		for (var key in statistics.favouriteWeaponsArray) {
		  if (!this.hasOwnProperty(key)) {
		  	var itemUsage = statistics.favouriteWeaponsArray[key]
		  	if (itemUsage > favouriteItemUses) {
		  		favouriteItemUses = itemUsage;
		  		favouriteItem = key;
		  	}
		  }
		}
		return favouriteItem;
	}


	function findFavouritePoem () {
		var favouritePoem = "żaden";
		var favouritePoemUses = 0;

		for (var arrLen = statistics.favouritePoemsArray.length, i=arrLen; i>=0; i--) {
			poemUsage = statistics.favouritePoemsArray[i]
			if (poemUsage > favouritePoemUses) {
				favouritePoemUses = poemUsage;
				favouritePoem = book[i].title;
			}
		}
		return favouritePoem;
	}

	function timeConverter (seconds) {
		var date = new Date(seconds * 1000);
		var hh = date.getUTCHours();
		var mm = date.getUTCMinutes();
		var ss = date.getSeconds();
		if (hh < 10) {hh = "0"+hh;}
		if (mm < 10) {mm = "0"+mm;}
		if (ss < 10) {ss = "0"+ss;}
		var t = hh+":"+mm+":"+ss;
		return t;
	}

	$('#sum_deathDescription').text(deathDescription);
	$('#sum_gameSummary').text(gameSummary);

	$('#sum_level').text(level);
	$('#sum_gameTime').text(timeConverter(statistics.gameTime));
	$('#sum_mercsHired').text(statistics.mercsHired);
	$('#sum_moneySpent').text(spacing(statistics.moneySpent));


	$('#sum_favouriteItem').text(findFavouriteItem());
	$('#sum_favouritePoem').text(findFavouritePoem());

	$('#sum_heroAttacks').text(statistics.heroAttacks);
	$('#sum_mercsAttacks').text(statistics.mercsAttacks);
	$('#sum_foundedItems').text(statistics.foundedItems);
	$('#sum_usedPoems').text(statistics.usedPoems);
	$('#sum_drinkedPotions').text(statistics.drinkedPotions);
	$('#sum_critisc').text(statistics.critisc);
}

$('.summaryArrow').click(function () {
	var currentPage = parseInt($('.endScreens').attr('data-screen'))
	if ($(this).hasClass('left')) {
		var turnPageDirection = currentPage -1;
	} else {
		var turnPageDirection = currentPage +1;
	}
	turnEndPage(turnPageDirection)
})


$('.summaryOrbs div').click(function () {
	var currentPage = $('.endScreens').attr('data-screen');
	var clickedPage = $(this).attr('data-page')
	if (clickedPage != currentPage) {
		turnEndPage(clickedPage)
	}
})

function turnEndPage (newPage) {
	if (newPage == 0) {
		newPage = 1;
	} else if (newPage == 5) {
		newPage = 4
	} else {
		sound('turn')	
	}
	$('.endScreens').attr('data-screen', newPage)
}


// ----------------------------------
// ----------------------------------
// Winning

function addKey () {
	if (pack() >= maxpack) {
		sellFirstItem();
	}
	state("Słudzy przynoszą ci tajemniczy klucz.");
	sound("key");
	$('.inventory').prepend("<div class='key' data-descr='key' data-potion-type='-1'><div></div><p></p></div>")

	if ($('.inventory > .key').length > 2) {
		$('.inventory > .key').addClass('finalKey');
		addKey = function () {return false}
	}

	function sellFirstItem () {
		var id = $('.inventory .item').first().attr("id");
		itms[id].sell();
	}

}

$('.inventory').on("mousedown", ".finalKey", function (e) {
	if (e.which === 1) {
		// find better way to hide it
		$('.finalKey').fadeOut();
		sound("key")
		book[++page] = new Poem ("Król-Duch", "Twoje wielkie zadanie zostaje wykonane.", 0, "#003300");
		book[page].short = "krol_duch"
		statistics.favouritePoemsArray.push(0);
		vein(true);
	} 
})