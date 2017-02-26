"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

$(function () {
	// 00. DATA 
	// --------------------------------------------------------------------------------
	// -------------------------------------------------------------------------------- 

	var maxpack = 32;
	var itemsInGame = 0;
	var activeSelection;

	var obols = 0;
	var earnings; // defined in Hero.refresh
	var allMercenariesNumber = 0;
	var deadsArray = [];
	var blockStates = false;

	var statistics = {
		gameTime: 0,
		heroAttacks: 0,
		mercsAttacks: 0,
		mercsHired: 0,
		moneySpent: 0,
		usedPoems: 0,
		foundedItems: 0,
		drinkedPotions: 0,
		critisc: 0
	};

	/*! jquery.cookie v1.4.1 | MIT */
	!function (a) {
		"function" == typeof define && define.amd ? define(["jquery"], a) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? a(require("jquery")) : a(jQuery);
	}(function (a) {
		function b(a) {
			return h.raw ? a : encodeURIComponent(a);
		}function c(a) {
			return h.raw ? a : decodeURIComponent(a);
		}function d(a) {
			return b(h.json ? JSON.stringify(a) : String(a));
		}function e(a) {
			0 === a.indexOf('"') && (a = a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));try {
				return a = decodeURIComponent(a.replace(g, " ")), h.json ? JSON.parse(a) : a;
			} catch (b) {}
		}function f(b, c) {
			var d = h.raw ? b : e(b);return a.isFunction(c) ? c(d) : d;
		}var g = /\+/g,
		    h = a.cookie = function (e, g, i) {
			if (void 0 !== g && !a.isFunction(g)) {
				if (i = a.extend({}, h.defaults, i), "number" == typeof i.expires) {
					var j = i.expires,
					    k = i.expires = new Date();k.setTime(+k + 864e5 * j);
				}return document.cookie = [b(e), "=", d(g), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : ""].join("");
			}for (var l = e ? void 0 : {}, m = document.cookie ? document.cookie.split("; ") : [], n = 0, o = m.length; o > n; n++) {
				var p = m[n].split("="),
				    q = c(p.shift()),
				    r = p.join("=");if (e && e === q) {
					l = f(r, g);break;
				}e || void 0 === (r = f(r)) || (l[q] = r);
			}return l;
		};h.defaults = {}, a.removeCookie = function (b, c) {
			return void 0 === a.cookie(b) ? !1 : (a.cookie(b, "", a.extend({}, c, { expires: -1 })), !a.cookie(b));
		};
	});

	var cookiesArr = ['level', 'damage', 'obols', 'maxheath', 'attack', 'defense', 'artism', 'magicAttack', 'potions', 'mercenaries', 'statistics', 'Heroweapon', "Heroarmor", "Heropen", 'deadsArray'];

	function update(whichCookieToUpdade, newValue) {
		if (level > 1) {
			if (whichCookieToUpdade === 'potions') {
				$.cookie('potions', Hero.potions.toString());
			} else if (whichCookieToUpdade === 'mercenaries') {
				$.cookie('mercenaries', mercenariesAmountArray.toString());
			} else if (whichCookieToUpdade === 'deadsArray') {
				$.cookie('deadsArray', deadsArray.toString());
			} else {
				$.cookie(whichCookieToUpdade, newValue);
			}
		}
	}

	function removeCookies() {
		for (var i = 0; i < cookiesArr.length; i++) {
			$.removeCookie(cookiesArr[i]);
		}
	}

	function saveStatistics() {
		$.cookie('statistics', JSON.stringify(statistics));
		$.cookie('health', Hero.health);
	}

	// 01. GAME INITIALIZATION
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------


	// 1. loading ends

	$('#loader-wrapper').hide();
	$('.container').css("opacity", 1);

	// 1.5 resume game


	if ($.cookie("level")) {
		var startingLevel = $.cookie("level");
		addAshesToBag(startingLevel);
	}

	// 2. start game

	$('#startContainer').click(function () {
		startGame(5000);
	});

	function startGame(startingSpeed) {
		$("#startContainer").fadeOut(startingSpeed);
		$('.gameWrapper, #gameContainer').fadeIn(startingSpeed).css("z-index", 1000);
		$('#health').animate({ width: "980px" }, startingSpeed * 0.8);

		// big hide
		$('.obolz, #hero, .kalamarz, .klucz, #choosePoem, td, #healthInfo, #sellInfo, #mercInfo, #nopackinfo, #poemSpec, #poemSpecInfoAbort, #konskrot, #redInfoZaklety').hide();

		// When game has begun
		state("STROFA I", true);
		state("Po śmierci starego władcy synowie Lecha okryli Cię purpurą. Lecz, na swą zgubę, nie wiedzieli, że w twym wenedyjskim sercu jest tylko zemsta. I jeszcze jeden, po stokroć straszniejszy – i po tysiąckroć piękniejszy – cel.", true);
		state("Nastał pierwszy dzień twych ponurych rządów – niech potoczą się głowy poddanych.", true);
		state("[Klikaj w wizerunek orła, bacznie przy tym obserwując dolny pasek symbolizujący twoją witalność. Gdy jej wartość spadnie do zera, pożegnasz się z życiem.]");
		silent(findPotion, 1);

		Hero.regenerationStream();
		Hero.refresh();

		unitsStrike();
		printPoem();

		setInterval(function () {
			statistics.gameTime++;
		}, 1000);
	}
	// 02. ENDGAME
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------


	function endGame(causeOfDeath) {

		removeCookies();
		// Sounds and effects
		if (causeOfDeath === "win") {
			endingSpeed = 10000;
			setTimeout(function () {
				sound("win");
			}, 500);
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
		Hero.nocturno = function () {};
		Hero.nocturnoStream = function () {};

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
			gameSummary = "W ciągnącej się eonami wszechchwili śmierci zadumałeś się nad swym losem. Dorównałeś najsroższym ziemskim tyranom, zbrodnią i żelazem wykułeś lud, który przetrwa każdą dziejową niedogodność. On jednak – milczący gospodarz niebios – nie dał ci ujrzeć swego oblicza.";
		} else if (level > 20) {
			gameSummary = "Zadałeś swemu ludowi wiele cierpień. Umierasz jako władca, który przyniósł ze sobą krew, śmierć i terror. Wiesz jednak dobrze, że tylko takie rządy uczynią rodzącą się na twoich oczach Polskę silną. Przeklną cię, zetrą z kart swoich kronik – nie będą wiedzieć, że dziejowe burze przetrwali tylko dzięki tobie.";
		} else if (level > 10) {
			gameSummary = "Oto gorzkie odniosłeś zwycięstwo. Ani za twe zasługi lud nie postawi ci pomnika, ani jego dzieci nie zbledną ze strachu, słuchając opowieści o twoich czynach. Miot Lecha znał krwawszych tyranów: dziś ci urąga, nazajutrz o tobie zapomni.";
		} else if (level > 5) {
			gameSummary = "Nie dość okrutne były twe rządy, by przekuć dusze poddanych w stal niepodatną na skruszenie. Umierasz śmiercią najpodlejszą, niby brutalny rzezimieszek.";
		} else {
			gameSummary = "Wypuściłeś z rąk berło, nim na dobre rozsiadłeś się na Lechowym tronie. Twój duch powraca do Hadesu w niesławie.";
		}

		function findFavouriteItem() {
			var favouriteItem = "gołe dłonie";
			var favouriteItemUses = 0;
			for (var key in statistics.favouriteWeaponsArray) {
				if (!this.hasOwnProperty(key)) {
					var itemUsage = statistics.favouriteWeaponsArray[key];
					if (itemUsage > favouriteItemUses) {
						favouriteItemUses = itemUsage;
						favouriteItem = key;
					}
				}
			}
			return favouriteItem;
		}

		function findFavouritePoem() {
			var favouritePoem = "żaden";
			var favouritePoemUses = 0;

			for (var arrLen = statistics.favouritePoemsArray.length, i = arrLen; i >= 0; i--) {
				poemUsage = statistics.favouritePoemsArray[i];
				if (poemUsage > favouritePoemUses) {
					favouritePoemUses = poemUsage;
					favouritePoem = book[i].title;
				}
			}
			return favouritePoem;
		}

		function timeConverter(seconds) {
			var date = new Date(seconds * 1000);
			var hh = date.getUTCHours();
			var mm = date.getUTCMinutes();
			var ss = date.getSeconds();
			if (hh < 10) {
				hh = "0" + hh;
			}
			if (mm < 10) {
				mm = "0" + mm;
			}
			if (ss < 10) {
				ss = "0" + ss;
			}
			var t = hh + ":" + mm + ":" + ss;
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
		var currentPage = parseInt($('.endScreens').attr('data-screen'));
		if ($(this).hasClass('left')) {
			var turnPageDirection = currentPage - 1;
		} else {
			var turnPageDirection = currentPage + 1;
		}
		turnEndPage(turnPageDirection);
	});

	$('.summaryOrbs div').click(function () {
		var currentPage = $('.endScreens').attr('data-screen');
		var clickedPage = $(this).attr('data-page');
		if (clickedPage != currentPage) {
			turnEndPage(clickedPage);
		}
	});

	function turnEndPage(newPage) {
		if (newPage == 0) {
			newPage = 1;
		} else if (newPage == 5) {
			newPage = 4;
		} else {
			sound('turn');
		}
		$('.endScreens').attr('data-screen', newPage);
	}

	// ----------------------------------
	// ----------------------------------
	// Winning

	function addKey() {
		if (pack() >= maxpack) {
			sellFirstItem();
		}
		state("Słudzy przynoszą ci tajemniczy klucz.");
		sound("key");
		$('.inventory').prepend("<div class='key' data-descr='key' data-potion-type='-1'><div></div><p></p></div>");

		if ($('.inventory > .key').length > 2) {
			$('.inventory > .key').addClass('finalKey');
			addKey = function addKey() {
				return false;
			};
		}

		function sellFirstItem() {
			var id = $('.inventory .item').first().attr("id");
			itms[id].sell();
		}
	}

	$('.inventory').on("mousedown", ".finalKey", function (e) {
		if (e.which === 1) {
			// find better way to hide it
			$('.finalKey').fadeOut();
			sound("key");
			book[++page] = new Poem("Król-Duch", "Twoje wielkie zadanie zostaje wykonane.", 0, "#003300");
			book[page].short = "krol_duch";
			statistics.favouritePoemsArray.push(0);
			vein(true);
		}
	});
	// 03. GAME
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------


	var level = 1;
	var levelTreshold = 100;

	function levelUp() {
		level++;
		update("level", level);
		printPoem();
		sound('levelup');
		Enemy.fill();
		dev = 0;

		Enemy.damage = 0;
		levelTreshold = 500 * level * level * 1.2;
		if (level > 20) levelTreshold *= 1.5;
		if (level > 25) levelTreshold *= 1.5;
		if (level > 30) levelTreshold *= 2;
		if (level > 30) levelTreshold *= 2;
		if (level > 40) levelTreshold *= 3;
		if (level > 45) levelTreshold *= 3;

		levelTreshold -= levelTreshold % 100;
		if (level) $("#dmg-needed").text(spacing(levelTreshold));

		// boost skills
		Enemy.attack += level * (5 + Math.floor(level / 5) + Math.floor(level / 10) + Math.floor(level / 15) + Math.floor(level / 20) + Math.floor(level / 25) + Math.floor(level / 30) + Math.floor(level / 35)) + 4;
		Hero.maxhealth += (level - 4) * 50 + 200;
		Hero.inn.attack += Math.floor(level / 2);
		Hero.inn.defense += Math.floor(level / 2);
		if (level > 4 && level % 2 != 0 || level === 4) {
			Hero.inn.artism++;
		}

		if (!blockStates) {
			$('#konsolaLOG>.logsDiv').append('<div class="levelSeparator"></div>');
		}

		state("STROFA " + romanize(level), true);

		switch (level) {
			case 2:
				state("Plugawe istoty zgodziły się tobie służyć. Zapłać im obolami, Charonową walutą, a będą siać terror i ginąć z twoim imieniem na ustach.", true);

				merc[0].appear();
				merc[1].appear();
				// show obols
				$('.ownedObols').css('visibility', 'visible');
				obols = 0;
				firstItem();
				cash(0);
				$.removeCookie('mercenaries');
				$.removeCookie('Heroweapon');
				$.removeCookie('Heroarmor');
				$.removeCookie('Heropen');
				$.removeCookie('deadsArray');

				if ($('.ashesOfMemory').length) {
					breakAshes();
				}

				if (Hero.weapon != noItem) {
					$.cookie('Heroweapon', JSON.stringify(itms[Hero.weapon.id]));
				}

				if (Hero.armor != noItem) {
					$.cookie('Heroarmor', JSON.stringify(itms[Hero.armor.id]));
				}

				saveStatistics();
				setInterval(saveStatistics, 5000);

				break;
			case 3:
				newMercState();
				merc[2].appear();
				break;
			case 4:
				Hero.refresh();
				state("Z cierpienia dusz rodzi się sztuka. Użyj kałamarza i stwórz wstrząsające poematy...", true);
				vein();
				break;
			case 7:
				newMercState();
				merc[4].appear();
				break;
			case 10:
				newMercState();
				merc[5].appear();
				break;
			case 14:
				newMercState();
				merc[6].appear();
				break;
			case 33:
				newMercState();
				merc[8].appear();
				break;
			default:
				state("Wróg rośnie w siłę.", true);
				break;
		};

		Hero.refresh();
		Hero.heal(Hero.maxhealth);
	};

	function newMercState() {
		bothState("Nowe sługi przysięgają ci wierność.", true);
	}

	function printPoem() {
		// Warning, damage bar!
		$('#lyrics > h2, #lyrics > p').text("");
		if (level < maxlevel) {
			var stanza = lyrics[level];
		} else {
			var stanza = lyrics[maxlevel];
		}
		var lastLine = "&#160;";
		if (stanza.length === 5) {
			lastLine = stanza[4];
		}

		$('#lyrics h2').text('Strofa ' + romanize(level)).next().text(stanza[0]).next().text(stanza[1]).next().text(stanza[2]).next().text(stanza[3]).next().html(lastLine);
		if (level >= maxlevel) {
			$('#lyrics h2').text('Zakończenie');
		}
	}

	function romanize(num) {
		var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 },
		    roman = '',
		    i;
		for (i in lookup) {
			while (num >= lookup[i]) {
				roman += i;
				num -= lookup[i];
			}
		}
		return roman;
	}

	function fastLevelUp() {
		var damageNeeded = levelTreshold - Enemy.damage;
		Enemy.damaged(damageNeeded);
		cash(damageNeeded * earnings);
	}

	var lyrics = [undefined, ['Cierpienia moje i męki serdeczne,', 'I ciągłą walkę z szatanów gromadą,', 'Ich bronie jasne i tarcze słoneczne,', 'Jamy wężową napełnione zdradą...', 'Powiem... wyroki wypełniając wieczne.'], ['Budzę się. – Straszna nade mną kobieta', 'Śpiewała swoje czarodziejskie runy:', '"Ojczyzna twoja" – wrzeszczała – "zabita!', 'Ja jedna żywa... a ty zamiast trumny', 'Miałeś mój żywot."'], ['"Popiołem nakryta', 'I zapłodniona przez proch i pioruny,', 'Wydałam ciebie, abyś był mścicielem!', 'Synu popiołów, nazwany Popielem..."'], ['Po ciemnych puszczach, gdziem się błąkał – gnana', 'Wichrami straszna przyszłości orlica!', '– Kto mię napotkał – myślał, że szatana,', 'Bo wszystko widział wprzód niż moje lica:', 'Zbroję... i skrzydła... i młot u kolana'], ['Na jednym pustym śród sosen smętarzu', 'Spotkałem smętne i dzikie Germany...', 'O! duchu! dawnej przeszłości malarzu!', 'Ty jeszcze widzisz te sosnowe ściany,', 'Wozy, ogniska, twarze przy rozżarzu...'], ['"Liczni" – krzyknąłem – "jak gwiazdy na niebie!', 'Straszni jak piorun, gdy niebo odmyka!', 'Przez was świat wytnę! pod wami pogrzebię!', 'Ja, syn popiołów – ojciec mogilnika!"'], ['Jam był jak piorun, gdy lasy druzgoce!', 'I napełniłem ten lud przerażeniem,', 'A w przerażeniu takim wielkim żarem,', 'Że mię ukochał i nazwał – Kiejzarem.'], ['Przez wszystkie władze ziemskie ostrzegany,', 'Wpadłem na ziemię moją nieszczęśliwą;', 'Lech nie żył, a lud jego zabijany', 'W królewnę patrzał jako w gwiazdę żywą...'], ['Jeszcze pamiętam ten wrzask i to wycie', 'Różnych narodów i różnych języków,', 'Gdy te ludyszcza przy Wisły korycie', 'Przyparłem do fal falą moich szyków.'], ['Aż mi o jasnym wyprawili świcie', 'Najstarszych z wojska swego tysiączników,', 'Prosząc o pokój i o ziemi bryłę', 'Taką... że ledwo dla nich – na mogiłę.'], ['Tak mój duch w kształty się piramidalne', 'Wyrzucał, dawną tryskając naturą;', 'Tak nowe ciała łańcuchy fatalne', 'Targał... i piorun zawsze miał pod chmurą.'], ['– Potem więc roki się zebrały walne', 'I mnie okryły Lechową purpurą.', 'Lud cały strachem ohydnie znikczemniał;', 'Jam siadł na tronie, zmroczył się i ściemniał.'], ['I któż by to śmiał w księgi ludzkie włożyć', 'Dla sławy marnej, a nie dla spowiedzi?', '– Postanowiłem niebiosa zatrwożyć,', 'Uderzyć w niebo tak jak w tarczę miedzi.', 'Zbrodniami przedrzeć błękit i otworzyć.'], ['I kolumnami praw, na których siedzi', 'Anioł żywota, zatrząść tak z posady,', 'Aż się pokaże Bóg w niebiosach – blady...', 'A nie Bóg nad tą żywota fortecą', 'Zgwałconą twarzy pokaże?'], ['Komety złote na niebie przylecą', 'I bliżej oblicz ukażą na świecie,', 'Nad zamkiem swoje ogony zaniecą', 'Ja widma – jedno – i drugie – i trzecie...', 'Jeśli nie zlęknę się, a krew mię splami...'], ['Wichry skrwawione, głos trupów z kościarzy,', 'Słońce poblednie, księżyc się zatrzyma?', 'Gwiazda zajęczy jaka lub zaszczeka?', 'Wszystko pokaże... że dba o człowieka!...'], ['"Jeśli nie" – rzekłem – "jeśli z tym motłochem', 'Postąpię sobie jak król zwariowany,', 'A żywot jak wąż schowa się pod lochem,', 'Jak gdyby nie czuł w sobie żadnej rany,', 'To ludzie są proch! i ja jestem prochem.'], ['Zaledwo ta myśl poczęła się we mnie,', 'Wzrok zaraz wydał ją... jasny... i suchy...', 'Wchodzący w myśli ludzkie potajemnie.', 'Aby tam widział w kościach, czy są duchy?'], ['Więc naprzód Czerczak, u nóg mi nikczemnie', 'Prosząc o łeb, pod katów obuchy', 'Poszedł, a zanim jacyś dwaj prorocy,', 'Których dziś... krwawe łby... widuję w nocy..'], ['Za wojewodą cały dwór i sługi', 'Posłałem... niby z nim będące w zmowach.', 'I z wież patrzałem na ten łańcuch długi', 'Idący na śmierć z świecami, w okowach.'], ['A niebios!... niebios błękitne framugi,', 'Jakby o zdjętych nie wiedziały głowach,', 'Patrzały na to ciche – obojętne!', 'Mnie się wszelako zdawało, że smętne!'], ['Ogromny szereg tych wymordowanych', 'Poszedł. Myślałem, że duchy zobaczę', 'Gdzieś do łabędzi podobne rumianych,', 'Od których jęczy powietrze i płacze;'], ['Albo że ze ścian, ogniem zapisanych,', 'Wyjdą pająki z ognia... straszne tkacze!', 'Na ściennych ogniach się swych zakołyszą', 'I wyrok jakiś ognisty napiszą!'], ['– I nic!... Ten straszny duch, któremu wojnę', 'Wydałem, dziecko zostawił bezkarne;', 'A ja podniosłem pierś dumną i twardą,', 'Gotów do końca walczyć z bożą wzgardą...'], ['Wtenczas ujrzano mię, że w ciele brzydnę', 'I biorę postać duchów utrapionych.', 'Ludzie myśleli, że mi gniją trzewa,', 'A jam był senny jak wąż, gdy poziewa.'], ['Dziesięć czasami gwiazd i słońc czerwono', 'Zagore... dziesięć wrzasków razem słyszę;', 'I nie podnosi mi się duchem łono', 'Ani się serce strachem zakołysze...'], ['Jako Lucyfer z błyskotną koroną', 'Stoję...a zbrodni mojej towarzysze', 'Na większą niż te wszystkie okropności', 'Patrzą – na mą twarz śmiertelnej bladości.'], ['Dziwią się wszyscy, że jak pies nie szczekam,', 'Jak lew nie ryczę, jak człowiek nie zgrzytam;', 'Nie wiedzą, że ja, duch natchnięty, czekam', 'Gwiazd, deszczów krwawych; i znów za miecz', 'I znowu cały świat na siebie wściekam!'], ['Co tylko mocy ten mózg napięty,', 'Tom ja na męki wynalazek użył.', 'Stosy, na Wiśle spękane okręty,', 'Kołowrót, który ciał długość przedłużył...'], ['Wszystko w męczeństwie ten kraj niepojęty', 'Swą cierpliwością wytrzymał i zużył!', 'A niebo wszystko to cierpliwie zniosło,', 'Póki kruszyłem duchom: łódź i wiosło...'], ['Poszedłem dalej... i w męki wyborze', 'Już nic nie mogąc straszniejszego stworzyć,', 'Zacząłem łamać większe prawa boże,', 'Myśląc naturę samą upokorzyć.'], ['Matkę mi z lasu stawiono na dworze...', 'A ja zamiast się u nóg jej położyć,', 'U tej w łachmanach podartej orlicy', '– Ciała użyłem za knot smolnej świecy...'], ['Rzekłem ludowi, że mnie czarowała,', 'Że serce jadła, że żony mi truła.', 'Z włosem palącym się jak ptak latała', 'I zgasła.'], ['Wtenczas twarz mi się popsuła', 'I pokazała zielonością ciała,', 'Że się duchowi memu szata pruła;', 'On jednak w ciele nie wiedział o sobie,', 'W letargu niby i w czarnej chorobie.'], ['Raz tylko byłem tak na siebie śmiały,', 'Że się przejrzałem, w tarczy patrząc lice;', 'A byłem cały jako trup sczerniały,', 'Który stoletnią miał w ziemi trumnicę,', 'A już robaki z niej pouciekały.'], ['Lecz co dziwniejsze, że tak próchniejący,', 'Taki upadły i taki zużyty,', 'Czasem się czułem jak anioł gorący,', 'Gotów ukochać świat i nieść w błękity', 'Tę ziemię, jako anioł wzlatujący.'], ['A usta milczą – to mój duch omamion', 'Wszystkimi, zda się, kręci księżycami,', 'A gwiazdy na kształt muzykalnych znamion', 'Chwyta... i w głosach to ziemskich wyraża:', 'Tworząc już nie Pieśń Sen, lecz Pieśń Mocarza.'], ['A tymczasem mię wielki Pan niebieski', 'Ubierał w grozę i w powagę strachu.', 'A strach była jakiś ciemny i królewski,', 'Który napełnił wszystkie kąty gmachu.'], ['A co dziwniejsza... że mię ukochano', 'Za siłę – i za strach – i za męczarnie.', 'Gdym wyszedł... lud giął przede mną kolano,', "Lud owiec, który się k' pasterzom garnie!", 'Przed twarzą moja straszliwą klękano,'], ['– Swityn żył jeszcze. Starzec sławą słynął,', 'Bił wrogi moje, winy moje gładził,', 'Na dwu srebrzystych morzach mię posadził;', 'Stary – a miecza do pochwy nie chował.', 'Jam go jak ojca kochał – i szanował...'], ['Pamiętam... biła północna godzina', 'Wtem myśl ohydna o śmierci Swityna', 'W serdeczne moje wstąpiła zgryzoty', 'Z taką potęgą!... żem wnet ku niej dłoni', 'Podał, jak dziecko uśmiechnął się do niej...'], ['"Płomieniom wolno chodzić po dolinach', 'I błyskawicom wolno bić w cnotliwe.', 'Za myślą twoją idź – nie myśl o czynach!', 'Próbuj, czy niebo martwe jest, czy żywe?"', 'Tak mi ktoś szeptał.'], ['Wysłałem katy... lecz myśl, gdy się kwieci,', 'W coraz straszniejsze rozwija się drzewo.', 'Posłałem drugie... dwór – żonę – i dzieci', 'Wyciąć.'], ['Był ciemny dzień i grad z ulewą.', 'Czasami słońce ponuro zaświeci', 'I gradem złotym jak zwichrzoną plewą', 'O pancerz chłośnie i z kitą się zetrze', '– Bom stał... czekając tych katów – na wietrze.'], ['A wtem przyleciał giermek zadyszany', 'I te wyrazy z ust wyrzucił skore:', '"Panie! Ogromny znak jest ukazany!', 'Na niebie miotła płomienista gore".'], ['I obaczyłem w gwieździe niby znamię', 'Ognistsze... powiek mgnięcie i błysk oka:', 'Wtenczas uczułem, że mi ducha łamie', 'Na wieki jakaś moc – straszna – głęboka.'], ['Gwiazdy tę gwiazdę wysłały na zwiady,', 'Czym żyw? czy jeszcze okryty purpurą', 'Czynię rzecz króla, człowieka i zboja?', 'Niebo się zlękło o świat. – To śmierć moja.'], ['"Idźcie... Już więcej nie jesteście sługi', 'Mojej wściekłości, lecz rycerze twardzi.', 'Kupiłem naród krwią... i nad jej strugi', 'Podniosłem ducha, który śmiercią gardzi."'], ['Taki był koniec mojego żywota,', 'Śpiewany długo w kraju przez rapsodów,', 'Którzy nie doszli, w czym była istota', 'Czynów? w czym wyższość od rzymskich Herodów?'], ['Ale przeze mnie ta ojczyzna wzrosła,', 'Nazwiska nawet przeze mnie dostała;', 'I pchnięciem mego skrwawionego wiosła', 'Dotychczas idzie: Polska – na ból – skała...']];

	var maxlevel = lyrics.length - 1;

	// 04. CONSOLES
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------

	// -------------------
	// LOG


	function state(message, bold) {
		if (blockStates) return;
		var bigger = "";
		if (bold) bigger = ' style="font-weight: bold"';
		$('#konsolaLOG>.logsDiv').append('<p' + bigger + '><span class="clock">' + getTime() + ' – </span> ' + message + '</p>');
		var howMuchToScroll = $('.logsDiv').scrollTop() + 50;
		$('.logsDiv').stop().animate({ scrollTop: howMuchToScroll }, 500);
	}

	// will be changed into separated function

	function fastState(message) {
		if (blockStates) return;
		var duration = (message.length + 5) * 80;

		if (typeof hideFastState != "undefined") {
			clearTimeout(hideFastState);
		}

		$('.fastStateContainer').fadeIn(100);

		$('.fastStateContainer p').text(message);
		hideFastState = setTimeout(function () {
			$('.fastStateContainer').fadeOut(100);
		}, duration);
	}

	function bothState(message, bold) {
		state(message, bold);
		fastState(message);
	}

	// -------------------
	// INFO

	var infoScreen = $('#hoverInfo');
	var header = $('#hoverInfo > h2');
	var info = header.next();
	var info2 = info.next();
	var info3 = info2.next();
	var info4 = info3.next();
	var info5 = info4.next();
	var info6 = info5.next();
	var allInfo = $('#hoverInfo > h2, #hoverInfo > p');

	// CONSOLES
	$('body').on("mouseover", "[data-descr]", function () {
		activeSelection = undefined;
		showInfo();
		infoScreen.show().removeClass();
		allInfo.text("");
		var descr = $(this).attr("data-descr");
		switch (descr) {
			case "health":
				header.text("Witalność");
				info2.text("Strzeż każdej kropli krwi. Jeśli ta wartość spadnie do  zera, twoje okrutne rządy dobiegną końca.");
				infoScreen.addClass("healthScreen");
				break;

			case "potion":
				header.text("Wywar");
				info.text("Wypij, aby błyskawicznie uleczyć rany.");
				break;

			case "item":
				infoScreen.addClass("itemScreen");
				itms[$(this).attr("id")].provideInfo();
				break;

			case "mercenary":
				infoScreen.addClass("mercsScreen");
				var id = $(this).attr("id").substr(4);
				merc[id].provideInfo();
				break;

			case "poem":
				infoScreen.addClass("poemScreen");
				var poemNo = $(this).attr("data-poem");
				book[poemNo].provideInfo();
				break;

			case "key":
				header.text("Klucz");
				var howManyKeys = ["Potrzebujesz jeszcze dwóch kluczy.", "Potrzebujesz jeszcze jednego klucza.", "Masz już wszystkie klucze. Wykorzystaj je."];
				info.text('Ciężki, dziwny klucz. Na pewno nie pochodzi z tego świata.');
				var keyInfo = howManyKeys[$('.inventory > .key').length - 1];
				info2.html('<br /><br />' + keyInfo);
				break;

			case "inkwell":
				header.text("Kałamarz");
				info.text('Kilknij, by stworzyć wybrany przez siebie poemat. Wiersz trafi do twojego inwentarza, wykorzystasz go w wybranym przez siebie momencie.');
				break;

			case "ashes":
				header.text("Prochy pamięci");
				info.text('Wspomnienia twego ducha zachowały się w garstce popiołów. Użyj ich, by przypomnieć sobie strofę, do której dotarłeś ostatnio. Sługi, bogactwa, posiadane wywary, przedmioty podręczne i osiągnięcia będą ci zwrócone; poematy, kałamarz i resztę inwentarza - utracisz.');
				break;

			case "eagle":
				infoScreen.addClass("lyricsScreen");
				break;

			// stats
			case "magicAttack":
				header.text("Atak magiczny");
				info.text("Siła ataku, który wykonywany jest bez twojej ingerencji. Magia uderza sama równocześnie z atakiem sług (standardowo co 3 sekundy). Z wysokim atakiem magicznym możesz usiąść z założonymi rękami i obserwować jego niszczycielskie efekty.");
				break;

			case "acceleration":
				header.text("Przyspieszenie sług");
				info.text("Im wyższe przyspieszenie, tym twoi słudzy częściej wykonują ataki. Normalnie dzieje się to co 3 sekundy. Maksymalne przyspieszenie to 300 procent.");
				info2.text("Twoi słudzy uderzają co " + (frequency / 1000).toFixed(2) + " s.");
				break;

			case "regeneration":
				header.text("Szybkość regeneracji");
				info.text("Im wyższa, tym szybciej goją się twoje rany.");
				break;

			case "wealth":
				header.text("Bogactwo");
				info.text("Im wyższe, tym więcej pieniędzy zdobywasz przy każdym ataku twoim i sług.");
				break;

			case "herbalism":
				header.text("Zielarstwo");
				info.text("Im wyższe, tym większa procentowa szansa na przygotowanie życiodajnego wywaru przy każdym ataku.");
				break;

			case "medicine":
				header.text("Żywotność sług");
				info.text("Im wyższa, tym słudzy wolniej tracą wiitalność w walce, dzięki czemu służą ci dłużej.");
				break;

			case "discount":
				header.text("Negocjacje");
				info.text("Cecha pozwala zatrudniać najemników po korzystniejszej cenie.");
				break;

			case "critic":
				header.text("Cios krytyczny");
				info.text("Szansa na to, że słudzy wykonają niszczycielski atak o sile wystarczającej, by natychmiast przejść do kolejnej strofy. Do twojej kieszeni trafiają wszystkie pieniądze, który uzyskałbyś, mozolnie brnąc do celu.");
				break;

			case "volume":
				info.text("Włącz/wyłącz efekty dźwiękowe.");
				break;

		}
	});

	$('body').on("mouseleave", "[data-descr]", function () {
		hideInfo();
	});

	// -------------------
	// SWITCH

	var blockConsoles = false;

	function showInfo() {
		if (blockConsoles) return;
		$('#konsolaLOG').stop().hide();
		$('#konsolaINFO').stop().fadeIn(90);
	}
	function hideInfo() {
		if (blockConsoles) return;
		$('#konsolaLOG').stop().fadeIn(90);
		$('.logsDiv').scrollTop($('.logsDiv')[0].scrollHeight);
		$('#konsolaINFO').stop().hide();
	}

	// HERO

	var noItem = {
		attack: 0,
		defense: 0,
		artism: 0,
		magicAttack: 0,
		title: "gołe pięści"
	};

	var Hero = {

		weapon: noItem,
		armor: noItem,
		pen: noItem,

		inn: {
			attack: 1,
			defense: 0,
			artism: 0,
			magicAttack: 0
		},

		alive: true,
		maxhealth: 500,
		health: 500,
		attack: 0,
		defense: 0,
		artism: 0,

		storm: 0,

		magicAttack: 0,
		acceleration: 0,
		herbalism: 0,
		wealth: 0,
		discount: 0,
		medicine: 0,
		regeneration: 0,
		critic: 0,

		potions: [0, 0, 0, 0],

		strike: function strike() {
			if (!Hero.alive) return;
			if (Hero.attack <= 0) return false;
			statistics.heroAttacks++;
			favouriteWeaponIncreaser();
			// damages
			var damageMultipler = 1;

			// Książę niezłomny
			if (ifPerform('ksiaze_niezlomny') && Hero.health * 2 < Hero.maxhealth) {
				damageMultipler *= 3;
			}

			// Na ruinach
			if (ifPerform('na_ruinach')) {
				if (Hero.attack > sumOfAllMercenariesAttack()) {
					damageMultipler *= 3;
				}
			}

			if (ifPerform('testament_moj')) {
				damageMultipler *= 10;
			}

			if (ifPerform('burza')) {
				Hero.storm += Math.floor(2 + Hero.storm / 100);
				$('.eagle-click').addClass('storm');
				setTimeout(function () {
					$('.eagle-click').removeClass('storm');
				}, 50);
			}

			var hit = Hero.attack * damageMultipler;
			Enemy.damaged(hit, "Hero");
			Hero.hurt(Enemy.attack * notPerform('czulosc') * notPerform('anhelli'));
			Hero.refresh();

			if (ifPerform('nokturn')) {
				Hero.heal(hit / 2, true);
			}
		},

		magicStrike: function magicStrike() {
			if (!Hero.alive) return 0;
			if (this.weapon.subtype === "w_magick") {
				favouriteWeaponIncreaser();
			}

			if (ifPerform('zywa_pochodnia') && this.magicAttack) {
				Hero.hurt(this.magicAttack / 4, 'pochodnia', true);
			}

			return this.magicAttack;
		},

		hurt: function hurt(_hurt, causeOfDeath, noDefense) {

			if (ifPerform('nokturn') && causeOfDeath != 'nokturn') {
				return false;
			}

			if (ifPerform("fatum") && !losuj(0, 10000)) {
				Hero.hurt(Hero.maxhealth, "fatum", true);
				return false;
			}

			if (!noDefense) {
				if (_hurt * 0.9 < this.defense) {
					_hurt *= 0.1;
				} else {
					_hurt -= this.defense;
				}
			}
			this.health -= _hurt;
			Hero.lifeRef();

			if (this.health <= 0) {
				this.ifDead(causeOfDeath);
			}
		},

		regenerationStream: function regenerationStream() {
			for (var i = 0; i < 10; i++) {
				setTimeout(Hero.regenerate, 100 * i);
			}
			setTimeout(Hero.regenerationStream, 1000);
		},

		regenerate: function regenerate() {

			if (Hero.health < Hero.maxhealth && notPerform('nokturn')) {
				var toHeal = Hero.maxhealth / 1000 * 3 * (1 + Hero.regeneration / 100);
				Hero.heal(toHeal);
			}
		},

		nocturnoStream: function nocturnoStream() {

			if (notPerform('nokturn')) return;
			for (var i = 0; i < 10; i++) {
				setTimeout(Hero.nocturno, 100 * i);
			}
			setTimeout(Hero.nocturnoStream, 1000);
		},

		nocturno: function nocturno() {
			if (!Hero.alive || notPerform('nokturn')) return;
			var toHurt = Hero.maxhealth / 1000 * 10;
			Hero.hurt(toHurt, 'nokturn', true);
		},

		heal: function heal(healing, blackheal) {
			if (!Hero.alive) return;
			if (ifPerform('nokturn') && blackheal === undefined) return;
			this.health += Math.floor(healing);
			if (this.health > this.maxhealth) {
				this.health = this.maxhealth;
			}
			Hero.lifeRef();
		},

		lifeRef: function lifeRef() {
			var oldHealthhWidth = $('#health').width();
			var newHealthWidth = Hero.health / Hero.maxhealth * 980;
			var animationTime = Math.abs(newHealthWidth - oldHealthhWidth) / 2;
			$('#health').stop().animate({ width: newHealthWidth }, animationTime);
			$('#heroHealth span').text(Hero.health);
		},

		ifDead: function ifDead(causeOfDeath) {
			// ways to survive
			if (ifPerform("kordian")) {
				abort("kordian");
				Hero.heal(Hero.maxhealth);
				bothState("Twoja odwaga wyrwała cię ze szponów śmierci...");
				sound("magic");
				return false;
			}

			Hero.health = 0;
			Hero.lifeRef();
			Hero.alive = false;
			endGame(causeOfDeath);
		}
	};

	Hero.refresh = function () {

		earnings = 1 / 2;

		this.attack = this.inn.attack + this.weapon.attack + this.armor.attack;
		this.defense = this.inn.defense + this.weapon.defense + this.armor.defense;
		this.artism = this.inn.artism + this.weapon.artism + this.pen.artism + merc[5].amount;

		this.magicAttack = this.inn.magicAttack + this.weapon.magicAttack;
		this.acceleration = 0 + Math.floor(merc[3].amount * 3.5);
		this.herbalism = 0 + Math.ceil(merc[1].amount * 1.5);
		this.wealth = 0;
		this.discount = 0;
		this.medicine = 0;
		this.regeneration = 0;
		this.critic = 0 + merc[7].amount * 0.05;

		update('maxhealth', Hero.maxhealth);
		update('attack', Hero.inn.attack);
		update('defense', Hero.inn.defense);
		update('artism', Hero.inn.artism);
		update('magicAttack', Hero.inn.magicAttack);

		// priority 0
		var that = this;
		$.each(performed, function (index, value) {
			switch (index) {
				case 'godzina_mysli':
					that.artism += 10;
					break;

				case "sonet":
					that.artism += 1;
					break;

				case "fatum":
					that.artism += 3;
					break;

				case "runy":
					that.artism += merc[6].amount;
					break;

				case "znad_wod":
					that.artism -= 4;
					break;
			}
		});

		//priority 1
		$.each(performed, function (index, value) {
			// Magic effects #1
			switch (index) {

				case 'burza':
					that.magicAttack += that.storm;
					break;

				case "lisc_kalinowy":
					that.herbalism += 20;
					break;

				case "matecznik":
					that.defense += merc[1].amount * 6;
					break;

				case "zmija":
					that.magicAttack += 25 * that.artism;
					break;

				case "trojka_koni":
					that.acceleration += 30;
					that.medicine -= 25;
					break;

				case "spartakus":
					that.attack += allMercenariesNumber * 10;
					that.defense -= allMercenariesNumber * 3;
					break;

				case "baranki_moje":
					that.discount += 10;
					break;

				case 'zelazna_rekawica':
					that.artism += that.pen.artism;
					break;

				case "chmury":
					that.defense += that.weapon.defense * 1.5;
					break;

				case "do_matki":
					that.regeneration += 50;
					break;

				case "zbojcy":
					that.attack += merc[2].amount * 10;
					break;

				case "wiatr":
					that.acceleration += that.artism;
					break;

				case "niewiadomo_co":
					if (that.weapon.magicAttack > 0) {
						that.attack += this.weapon.attack * 3;
					}
					break;

				case 'zyjacy_grob':
					that.medicine += 300;
					break;

				case 'zywa_pochodnia':
					that.magicAttack += that.artism * 120;
					break;

				case 'slowik':
					that.discount += merc[5].amount * 3;
					break;

				case 'irydion':
					that.critic += merc[7].amount * 0.2;
					that.acceleration += merc[7].amount * 10;
					break;

				case "tak_mi_boze_dopomoz":
					that.defense += that.artism * 5;
					that.attack += that.artism * 5;
					break;

				case "ogrodnik":
					that.regeneration += 300;
					that.herbalism += 30;
					break;

				// dać zdobywane earning
				case "gaweda":
					that.wealth += merc[6] * 5;
					break;

				case "vivat":
					that.attack += that.defense * 5;
					that.defense = 0;
					that.wealth += 100;

					break;

				case "beniowski":
					that.attack += that.artism * 70;
					break;

				case 'pielgrzym':
					that.defense += that.artism * 25;
					that.discount -= 10;
					break;

				// Possible problems with power-ups sequence
			}
		});

		// priority 2
		$.each(performed, function (index, value) {
			switch (index) {

				case 'smutno_mi_boze':
					that.magicAttack = Math.floor(that.magicAttack * 1.75);
					earnings *= 0.5;
					break;

				case 'arcymistrz':
					that.magicAttack = Math.floor(that.magicAttack * 2.5);
					that.attack = 0;
					break;

				case 'godzina_mysli':
					that.artism -= 10;
					break;

				case 'nokturn':
					that.attack = Math.floor(that.attack / 2);

				case "niedzwiedz":
					if (that.attack < that.defense) {
						that.attack = that.defense;
					}
					break;

				case 'lirnik':
					if (that.weapon.artism) {
						Hero.attack = Hero.magicAttack;
					}
					break;
			}
		});

		var specials = ['maxhealth', "attack", "defense", "artism", "magicAttack", "acceleration", "herbalism", "wealth", "discount", "medicine", "regeneration", 'critic'];

		for (var i = 0; i < specials.length; i++) {
			var something = specials[i];

			if (this[something]) {
				$('#' + something + ' span').text(this[something]);
				$('#' + something).show();
			} else {
				$('#' + something).hide();
			}
		}
	};
	// 06. ENEMY
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------


	var Enemy = {

		attack: 10,
		damage: 0,

		damaged: function damaged(damage, caller) {
			this.damage += damage;
			if (ifPerform('czulosc') && caller === "Hero") this.damage -= damage;
			seekingForItems();
			if (Enemy.damage >= levelTreshold) {
				levelUp();
			}
			var thisStanzaDamage = Enemy.damage;
			$("#dmg").text(spacing(thisStanzaDamage));
			expBar();

			update('damage', Enemy.damage);

			var earn = damage * earnings;
			if (caller === "Hero") {
				this.bounce(3);
			} else {
				var mercBounce = 2 + Math.floor(Math.pow(damage, 1 / 4));
				this.bounce(mercBounce);
				if (caller === "merc") {
					if (ifPerform("praca")) {
						earn += (earn - Hero.magicAttack) * 3;
					}
				}
			}
			silentCash(earn);

			function expBar() {
				var newWidth = thisStanzaDamage / levelTreshold * 250;
				$('.expBar div').width(newWidth);
			}
		},

		// Bouncing

		bounceLvl: 0,

		bounce: function bounce(power) {
			var bouncingEagle = $('.eagleShape');
			Enemy.bounceLvl += power;
			bouncingEagle.css("bottom", Enemy.bounceLvl / 2 + 3 + "px");
			setTimeout(function () {
				bouncingEagle.css("bottom", -Enemy.bounceLvl / 3 + "px");
			}, 50);
			setTimeout(function () {
				bouncingEagle.css("bottom", Enemy.bounceLvl / 3 + "px");
			}, 100);
			setTimeout(function () {
				bouncingEagle.css("bottom", "0px");
			}, 150);
			setTimeout(function () {
				if (Enemy.bounceLvl > 10) {
					bouncingEagle.css("bottom", Enemy.bounceLvl / 4 + "px");
					setTimeout(function () {
						bouncingEagle.css("bottom", "0px");
					}, 50);
				}
			}, 220);
			setTimeout(function () {
				if (Enemy.bounceLvl > 20) {
					bouncingEagle.css("bottom", Enemy.bounceLvl / 4 + "px");
					setTimeout(function () {
						bouncingEagle.css("bottom", "0px");
					}, 60);
				}
			}, 350);
			setTimeout(function () {
				if (Enemy.bounceLvl > 35) {
					bouncingEagle.css("bottom", Enemy.bounceLvl / 5 + "px");
					setTimeout(function () {
						bouncingEagle.css("bottom", "0px");
					}, 80);
				}
			}, 450);
		},

		bounceInterval: function bounceInterval() {
			if (Enemy.bounceLvl > 0) {
				if (Enemy.bounceLvl > 10) {
					Enemy.bounceLvl /= 2;
				} else {
					Enemy.bounceLvl -= 1;
				}
			}
		},

		// Coloring
		overridedColor: undefined,

		fill: function fill() {
			if (this.overridedColor === undefined) {
				var levelPalette = this.rgb[level];
				if (this.rgb.length > level) {
					var newColor = "rgb(" + levelPalette[0] + "," + levelPalette[1] + "," + levelPalette[2] + ")";
				} else {
					var newColor = "red";
				}
				$(".eagleContour").css("fill", newColor);
				// $('.heroContainer').css('border-color', newColor)
			}
		},

		rgb: [// dokończyć
		undefined, [255, 255, 255], [240, 240, 240], [230, 230, 230], [222, 222, 222], [214, 214, 214], [206, 206, 206], [190, 190, 190], [180, 180, 180], [170, 170, 170], [160, 160, 160], [150, 150, 150], [130, 130, 130], [120, 120, 120], [110, 110, 110], [100, 100, 100], [100, 90, 90], [100, 80, 80], [100, 70, 70], [100, 45, 45], [120, 30, 30], [140, 20, 20], [180, 15, 15], [130, 30, 30], [110, 50, 50], [90, 60, 60], [80, 80, 100], [60, 60, 100], [45, 45, 100], [65, 65, 95], [80, 80, 90], [80, 80, 75], [80, 80, 60], [70, 80, 60], [60, 80, 60], [60, 70, 60], [60, 60, 60]]

	};

	setInterval(Enemy.bounceInterval, 300);
	$('.eagle-click').click(Hero.strike);
	// 05. MERCENARIES
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------

	var mercenariesAmountArray = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

	function Mercenary(id, name, namePlur, price, attack, maxhealth) {
		this.id = id;
		this.name = name;
		this.namePlur = namePlur;
		this.currentPrice = price;
		this.price = [price];
		this.baseAttack = attack;
		this.attack = attack;
		this.maxhealth = maxhealth;
		this.health = maxhealth;

		this.check = false;
		this.amount = 0;

		// this.deadTable = 0;
		// this._czescPoleglym = 0;


		this.hire = function (duplicate) {
			this.amount++;
			mercenariesAmountArray[this.id]++;
			update('mercenaries');
			if (this.check === false) {
				this.appear();
			}
			// New unit's price
			// 1. Old price from array
			if (this.price.length > this.amount) {
				this.currentPrice = this.price[this.amount];
				// 2. Generate new price
			} else {
				var cost = this.currentPrice;
				if (this.name === 'harfiarz') {
					cost *= 2;
				} else if (this.name === 'zeitgeist') {
					cost *= 3;
				} else if (cost < 70) {
					cost += 5;
				} else if (cost < 100) {
					cost += 10;
				} else {
					if (i === 9) {
						cost *= 5;
					} else if (i === 4 || i === 6) {
						cost *= 1.3;
						cost -= cost % 10;
					} else {
						cost *= 1.15;
						cost -= cost % 10;
					}
				}
				this.currentPrice = cost;
				this.price.push(cost);
			}
			this.refresh();
			Hero.refresh();
			$('#merc' + this.id + ' .merc-image').removeClass('unhired');
			allMercenariesNumber++;

			// special cases
			if (this.id === 8) {
				addKey();
			} else if (this.id === 3 && ifPerform("lilije")) {
				findPotion(2);
			}

			if (ifPerform('duma') && !duplicate) {
				if (!losuj(0, 4) & this.amount > 1) {
					this.hire('duplicate');
					bothState("Z melancholią dołącza do ciebie " + this.name + '.');
				}
			}
		};

		this.heal = function () {
			this.health = this.maxhealth;
			this.refresh();
		};

		this.fire = function () {
			if (this.amount === 0) {
				return false;
			}
			mercenariesAmountArray[this.id]--;
			update('mercenaries');
			this.amount--;
			this.currentPrice = this.price[this.amount];
			this.health = this.maxhealth;
			this.refresh();
			Hero.refresh();
			deadsArray.unshift(this.id);
			update('deadsArray');
			state("Twój " + this.name + " poległ.");
			allMercenariesNumber--;
			if (this.amount === 0) {
				$('#merc' + this.id + ' .merc-image').addClass('unhired');
			}

			// Najcięższa łza
			if (ifPerform("najciezsza_lza")) {
				fastState('Martwy ' + this.name + ' zostawia po sobie leczniczy wywar.');
				findPotion();
			}

			// Wieniec przeklętych
			if (ifPerform("wieniec_przekletych")) {
				var toGet = godzinaBoost(Hero.artism);
				Hero.inn.attack += toGet;
				Hero.refresh();
				bothState('Twój atak trwale zwiększył się o ' + toGet + '.');
			}

			// Genezis z ducha
			if (ifPerform('genezis_z_ducha')) {
				var toReincarnate = merc[this.id + 1];
				if (toReincarnate === merc[9]) {
					toReincarnate = merc[0];
				}
				toReincarnate.hire();
				state('... i odrodził się jako ' + toReincarnate.name + '.');
			}

			if (ifPerform('mysia_wieza') && this.id === 0 && this.amount === 0) {
				abort('mysia_wieza');
			}
		};

		this.strike = function () {
			if (this.amount === 0 || this.attack === 0) {
				return false;
			} else {
				$('#merc' + this.id + ' .merc-image').addClass('attack');
				setTimeout(function () {
					$('.merc-image').removeClass('attack');
				}, 200);
				var amount = this.amount;
				var attack = this.attack;
				this.hurt();
				var attackPower = amount * attack;

				// Oblężenie
				if (ifPerform('oblezenie') && this.id === 2) {
					this.fire();
					this.health = this.maxhealth;
					findItem(undefined, undefined, undefined, true);
					if (!this.amount) {
						abort('oblezenie');
					}
				}
				// -----

				// Śpiew z mogiły
				if (ifPerform('spiew_z_mogily') && this.health === this.maxhealth) {
					attackPower += this.attack * 29;
					fastState(this.name + ' mści się zza grobu.');
				}
				// -----

				return attackPower;
			}
		};

		this.hurt = function () {
			if (ifPerform('anhelli')) return;
			var hurt = 3 * (1 - Hero.medicine / 100);
			this.health -= hurt;
			this.showHealth();
			if (this.health <= 0) {
				this.fire();
			}
		};

		this.showHealth = function () {
			if (activeSelection == this.id) {
				if (this.amount) {
					info3.text("Witalność: " + Math.floor(this.health) + "/" + this.maxhealth);
				} else {
					info3.text("Witalność: " + this.maxhealth);
				}
			}
		};

		this.infoStrike = function () {
			return this.amount * this.attack;
		};

		this.provideInfo = function () {
			activeSelection = this.id;
			var mercDescription, mercSpecialDescription;

			switch (this.name) {
				case "hycel":
					mercDescription = "Nędzny pomagier.";
					mercSpecialDescription = "";
					break;
				case "rój myszy":
					mercDescription = "Gryzą, póki nie zdechną..";
					mercSpecialDescription = "Silniejsze w grupie. Ranią także ciebie.";
					break;
				case "pajęczarz":
					mercDescription = "Zna ciernistą puszczę i jej sekrety.";
					mercSpecialDescription = "Poprawia zielarstwo.";
					break;
				case "siepacz":
					mercDescription = "Zdolny do wszelkich okrucieństw, kwestią jest tylko cena.";
					mercSpecialDescription = "";
					break;
				case "upiór":
					mercDescription = "Ani żywy, ani martwy.";
					mercSpecialDescription = "Poprawia szybkość ataku.";
					break;
				case "wampir":
					mercDescription = 'Nocny łowca';
					mercSpecialDescription = "Wysysa życie i daje je tobie. Poprawia szybkość ataku.";
					break;
				case "bojar":
					mercDescription = "Niedźwiedź na polu bitwy.";
					mercSpecialDescription = "";
					break;
				case "harfiarz":
					mercDescription = "Nie widzi dobra i zła, a jedynie sztukę.";
					mercSpecialDescription = "Poprawia Artyzm.";
					break;
				case "kolos":
					mercDescription = "Wyłoniony z morza półbóg.";
					mercSpecialDescription = "";
					break;
				case "trojanin":
					mercDescription = "Toczy wieczną bitwę w Tartarze.";
					mercSpecialDescription = "Szansa na cios krytyczny.";
					break;
				case 'hekatoncheir':
					mercDescription = 'Przybysz z najgłębszych czeluści Tartaru.';
					mercSpecialDescription = "Szansa na cios krytyczny i na krytyczne chybienie. Poprawia szybkość ataku.";
					break;
				case "zeitgeist":
					mercDescription = "Byt, który stwarza i obala mocarstwa.";
					mercSpecialDescription = "";
					break;
			}

			header.text(this.name);
			info.text(mercDescription);
			info2.text(mercSpecialDescription);

			var allAttackInfo = sumOfAllMercenariesAttack();
			var thisAttack = this.infoStrike();
			var thisPercentageAttack = Math.floor(thisAttack / allAttackInfo * 1000) / 10;

			if (isNaN(thisPercentageAttack)) {
				thisPercentageAttack = 0;
			}
			info4.text("Atak sług: " + spacing(allAttackInfo));
			info5.text("W tym " + this.namePlur + ": " + thisAttack + " (" + thisPercentageAttack + "%)");
			this.showHealth();
		};

		this.appear = function () {
			if (this.check === false) {
				mercenariesAmountArray[this.id]++;
				update('mercenaries');
				this.check = true;
				this.refresh();
				$('#merc' + this.id).fadeIn();
			}
		};

		this.refresh = function () {

			if (ifPerform('mysia_wieza')) {
				merc[0].attack = Math.floor(merc[0].amount * merc[0].amount / 10 + 5);
			}

			this.showHealth();
			var place = $('#merc' + this.id);
			place.find('.amount').text(this.amount);
			place.find('.price').text(spacing(Math.floor(this.currentPrice * (1 - Hero.discount / 100))));
			place.find('.attack span').text(this.attack);
		};
	} // end of Mercenary constructor

	var merc = {
		0: new Mercenary(0, "hycel", "hycli", 30, 1, 60),
		1: new Mercenary(1, "pajęczarz", "pajęczarzy", 350, 3, 160),
		2: new Mercenary(2, "siepacz", "siepaczy", 2500, 20, 600),
		3: new Mercenary(3, "upiór", "upiorów", 13000, 30, 540),
		4: new Mercenary(4, "bojar", "bojarów", 80000, 200, 2200),
		5: new Mercenary(5, "harfiarz", "harfiarzy", 62500, 0, 3600),
		6: new Mercenary(6, "kolos", "kolosów", 1000000, 2500, 10800),
		7: new Mercenary(7, "trojanin", "trojan", 25000000, 20000, 36000),
		8: new Mercenary(8, "zeitgeist", "zeitgeistów", 100000000, 99999, 360000)
	};

	// ------------------------
	// buying mercenaries

	$('.mercenary').click(function () {

		var id = $(this).attr("id").substr(4);
		var price = merc[id].currentPrice * (1 - Hero.discount / 100);
		if (obols >= price) {
			merc[id].hire();
			merc[id].provideInfo();
			sound("coin");
			statistics.moneySpent += price;
			cash(-price);
			statistics.mercsHired++;
		} else {
			fastState("Nie stać cię na opłacenie sługi.");
		}
	});

	// ------------------------
	// attack!

	var frequency = 3000;
	function unitsStrike() {
		if (!Hero.alive) return false;
		if (Hero.critic) chancesForCriticalHit();
		var hit = 0;
		for (var unit in merc) {
			hit += merc[unit].strike();
		}
		hit /= ifPerform("praca") + 1;
		if (hit) {
			statistics.mercsAttacks++;
		}
		hit += Hero.magicStrike();
		if (hit) {
			Enemy.damaged(hit, "merc");
		}

		if (ifPerform('mysia_wieza') && merc[0].amount) {
			Hero.hurt(merc[0].infoStrike(), 'myszy');
		}

		if (ifPerform('gleboka_noc')) {
			Hero.heal(merc[3].infoStrike());
		}

		// attack frequency
		frequency = 3000 * (1 - Math.floor(Math.sqrt(Hero.acceleration * 20)) / 100);
		setTimeout(unitsStrike, frequency);

		function chancesForCriticalHit() {
			if (losuj(1, 10000) <= Hero.critic * 100) {
				if (notPerform('irydion')) {
					var strikingUnit = 'trojanie';
				} else {
					var strikingUnit = 'hekatoncheirowie';
				}
				var message = strikingUnit + ' przeprowadzili druzgocące uderzenie!';
				bothState(message);
				statistics.critisc++;
				fastLevelUp();
			}

			if (ifPerform('irydion')) {
				if (losuj(0, 20000) < merc[7].amount) {
					console.log('yup');
					Hero.hurt(Hero.maxhealth, 'hekatoncheir', true);
				}
			}
		}
	}

	// --------------------------
	// Extra functions for poems etc.


	function everybody(whatToDo, argument) {
		for (var i = 0; i < 9; i++) {
			if (merc[i].amount) {
				merc[i][whatToDo](argument);
				merc[i].refresh();
			}
		}
	}

	function randomMercenary() {
		var aliveMercenaries = [];
		for (var unit in merc) {
			if (merc[unit].amount) {
				aliveMercenaries.push(unit);
			}
		}
		if (aliveMercenaries.length) {
			return merc[aliveMercenaries[losuj(0, aliveMercenaries.length - 1)]];
		} else {
			return false;
		}
	}

	function strongestMercenary() {
		var strongestOne;
		for (var i = 8; i >= 0; i--) {
			if (merc[i].amount) {
				strongestOne = merc[i];
				break;
			}
		}
		if (strongestOne) {
			return strongestOne;
		} else {
			return false;
		}
	}

	function sumOfAllMercenariesAttack() {
		var allAttackInfo = 0;
		for (var unit in merc) {
			allAttackInfo += merc[unit].infoStrike();
		}
		return Math.floor(allAttackInfo);
	}
	// 08. INVENTORY ARMORY
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------


	var itm = {
		w_regular: ["nóż", "batog", "maczuga", "korbacz", "siekiera", "krótki miecz", "morgensztern", "młot", "kindżał", "germańska maczuga", "stary brzeszczot", "dusiciel", "długi miecz", "podwójny topór", "szabla damasceńska", "tasak", "ogromny topór", "bliźniacze miecze", "rozgniatacz", "ogromny miecz", "topór Tartaru", "tytaniczny młot", "koło boleści", "meteorytowy miecz"],

		w_half: ["proca", "drąg",
		// 
		"dmuchawka", "włócznia",
		//
		"krótki łuk", "cep bojowy",
		// 

		"harpun", "kosa",
		//
		"długi łuk", "halabarda",
		// 
		"kusza", "berdysz",
		// 
		"łuk refleksyjny", "trójząb",
		//
		"cyklopowa proca", "podrzynacz",

		//
		"potrójny łuk", "zeusowy grom"],

		w_magick: ["żagiew", "ząb wiedźmy", "guślarska laska", "kamień z kurhanu", "stara różdżka", "wiedżmi kij", "berło", "królewskie berło", "czarnoksięska różdżka", "marznąca pochodnia", "oko gorgony", "różdżka-arcydzieło", "kaduceusz", "wiekuista różdżka"],

		w_music: ["flet", "fletnia Pana", "róg", "lutnia", "lira", "harfa", "królewski dzwon"],

		a_regular: ["chiton", "barania skóra", "tunika", "zardzewiała zbroja", "zbroja z mchu", "wilcza skóra", "koszulka kolcza", "niedźwiedzia skóra", "napierśnik", "szklana zbroja", "zbroja płytowa", "skóra cyklopa", "twierdza kości", "witrażowa zbroja", "zbroja turniejowa", "kolczuga ojców", "bazaltowa zbroja płytowa", "cesarski napierśnik", "malachitowa zbroja", "antyczny pancerz", "skóra węża morskiego", "okrycie tytana"],

		a_half: ["jeżozbroja", "trujący bluszcz", "germańska zbroja", "ognista koszula", "płaszcz czaronksiężnika", "diabelska skóra", "przeklęta zbroja"],

		p_regular: ["łabędzie pióro", "krucze pióro", "pawie pióro", "wężowe pióro", "białe krucze pióro", "pióro straszydła", "pióro feniksa", "anielskie pióro", "pióro czarnego anioła", "świetliste pióro", "pióro Tyfona"]

	};

	var itm2 = {
		w_regular: ["nóż", "batog", "maczugę", "korbacz", "siekierę", "krótki miecz", "morgensztern", "młot", "kindżał", "germańską maczugę", "stary brzeszczot", "dusiciela", "długi miecz", "podwójny topór", "szablę damasceńską", "tasak", "ogromny topór", "bliźniacze miecze", "rozgniatacz", "ogromny miecz", "topór Tartaru", "tytaniczny młot", "koło boleści", "meteorytowy miecz"],

		w_half: ["procę", "drąg",
		// 
		"dmuchawkę", "włócznię",
		//
		"krótki łuk", "cep bojowy",
		// 

		"harpun", "kosę",
		//
		"długi łuk", "halabardę",
		// 
		"kuszę", "berdysz",
		// 
		"łuk refleksyjny", "trójząb",
		//
		"cyklopową procę", "podrzynacz",

		//
		"potrójny łuk", "zeusowy grom"],

		w_magick: ["żagiew", "ząb wiedźmy", "guślarską laskę", "kamień z kurhanu", "starą różdżkę", "wiedżmi kij", "berło", "królewskie berło", "czarnoksięską różdżką", "marznącą pochodnię", "oko gorgony", "różdżkę-arcydzieło", "kaduceusz", "wiekuistą różdżkę"],

		w_music: ["flet", "fletnię Pana", "róg", "lutnię", "lirę", "harfę", "królewski dzwon"],

		a_regular: ["chiton", "baranią skórę", "tunikę", "zardzewiałą zbroję", "zbroję z mchu", "wilczą skórę", "koszulkę kolczą", "niedźwiedzią skórę", "napierśnik", "szklaną zbroję",
		//'Zbroja karacenowa',
		"zbroję płytową", "skórę cyklopa", "twierdzę kości", "witrażową zbroję", "zbroję turniejową", "kolczugę ojców", "bazaltową zbroję", "cesarski napierśnik", "malachitową zbroję", "antyczny pancerz", "skórę węża morskiego", "okrycie tytana"],

		a_half: ["jeżozbroję", "trujący bluszcz", "germańską zbroję", "ognistą koszulę", "płaszcz czaronksiężnika", "diabelską skórę", "przeklętą zbroję"],

		p_regular: ["łabędzie pióro", "krucze pióro", "pawie pióro", "wężowe pióro", "białe krucze pióro", "pióro straszydła", "pióro feniksa", "anielskie pióro", "pióro czarnego anioła", "świetliste pióro", "pióro Tyfona"]

	};
	// 08. INVENTORY MECHANICS
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------

	var itms = {};

	function Item(type, subtype, name, power, power2, price) {
		this.id = itemsInGame;
		this.type = type;
		this.subtype = subtype;
		this.name = name;
		this.title = itm[subtype][name];
		this.power = power;
		this.power2 = power2;
		this.price = price;

		switch (subtype) {
			case "w_regular":
			case "w_half":
				this.attack = power;
				this.defense = power2;
				break;
			case "w_magick":
				this.attack = power;
				this.magicAttack = power2;
				break;
			case "w_music":
				this.artism = power2;
				break;
			case "a_regular":
			case "a_half":
				this.defense = power;
				this.attack = power2;
				break;
			case "p_regular":
				this.artism = power;
				break;
		}

		this.div = function () {

			var additionalBackgroundOffset = 0;
			function chooseBackground(subtype) {
				switch (subtype) {
					case "w_regular":
						return -35;
						break;
					case "w_half":
						return -70;
						break;
					case "w_magick":
						return -105;
						break;
					case "w_music":
						return -175;
						break;
					case "a_regular":
						return -140;
						break;
					case "a_half":
						additionalBackgroundOffset = -385;
						return -175;
						break;
					default:
						additionalBackgroundOffset = -770;
						return 0;

				}
			}
			var pargraphsToInsert = "<p>" + this.power + "</p>";
			if (this.power2) {
				pargraphsToInsert += "<p>" + this.power2 + "</p>";
			}
			return '<div data-descr="item" id="' + this.id + '" class="item ' + this.type + ' ' + (this.subtype || "") + '"><div style="background-position: ' + chooseBackground(this.subtype) + 'px' + " " + (-55 * this.name + additionalBackgroundOffset) + 'px"></div>' + pargraphsToInsert + '</div>';
		};

		this.toBag = function () {
			sound("swap");
			$('.inventory').append(this.div());
		};

		this.takeOff = function (notCount, ignorePack) {
			if (pack() < maxpack || ignorePack) {
				sound("swap");
				$('#' + this.id).remove();
				Hero[this.type] = noItem;
				$.removeCookie('Hero' + this.type);
				this.toBag();
				if (!notCount) {
					Hero.refresh();
				}
			} else {
				fastState("Brak miejsca w inwentarzu.");
			}
		};

		this.takeOn = function () {
			sound("swap");
			this.slideDown();
			if (Hero[this.type] != noItem) {
				Hero[this.type].takeOff(true, true);
			}
			$('.slot.' + this.type).append(this.div());
			Hero[this.type] = this;
			$.cookie('Hero' + this.type, JSON.stringify(itms[this.id]));
			Hero.refresh();
		};

		this.sell = function (multipler) {
			var icon = $('#' + this.id);

			this.slideDown();
			if (multipler) {
				this.price *= multipler;
			}
			cash(this.price * (ifPerform("nerwy") + 1));
			sound("coin");
			if (Hero[this.type] === this) {
				Hero[this.type] = noItem;
				$.removeCookie('Hero' + this.type);
			}
			setTimeout(function () {
				delete itms[this.id];
			}, 100);

			if (ifPerform('swieta_grota') && !losuj(0, 45)) {
				sound('treasure');
				bothState("Znalazłeś jaskinię pełną cennych przedmiotów.");
				abort("swieta_grota");
				var cave = 0;
				var theWealthOfTheCave = function theWealthOfTheCave() {
					cave++;
					if (cave < 80) {
						findItem(undefined, 4);
						if (pack() < maxpack) {
							setTimeout(theWealthOfTheCave, 40);
						}
					}
				};
				theWealthOfTheCave();
			}
		};

		this.slideDown = function () {
			var icon = $('#' + this.id);
			icon.fadeOut(20, function () {
				icon.replaceWith('<div class="placeholder"></div>');
				icon = $('.placeholder');
				icon.animate({ width: "0px" }, 200, function () {
					icon.remove();
				});
			});
		};

		this.provideInfo = function () {
			header.text(this.title);
			var description;
			var power = spacing(this.power);
			var power2 = spacing(this.power2);

			switch (this.subtype) {
				case "w_regular":
					description = "Oręż zapewnia ci atak " + power + ".";
					break;
				case "w_half":
					description = "Oręż zapewnia ci atak " + power + " oraz premię do obrony " + power2 + ".";
					break;
				case "w_magick":
					description = "Oręż zapewnia ci atak " + power + " oraz atak magiczny " + power2 + ".";
					break;
				case "w_music":
					description = "Oręż zapewnia ci Artyzm " + power2 + ".";
					break;
				case "a_regular":
					description = "Pancerz zapewnia ci obronę " + power + ".";
					break;
				case "a_half":
					description = "Pancerz zapewnia ci obronę " + power + " oraz premię do ataku " + power2 + ".";
					break;
				case "p_regular":
					description = "Pióro zapewnia ci Artyzm " + power + ".";
					break;
			}

			info.text(description);
			$('#sell span').text(spacing(this.price * (ifPerform("nerwy") + 1)));
		};
	}
	Item.prototype = noItem;
	// end of Item constructor


	// --------------------------------------------------------------------
	// --------------------------------------------------------------------
	// Finding items / vein


	function seekingForItems() {

		// Treasure
		if (ifPerform("zlota_czaszka") && !losuj(0, 2500)) {
			sound("treasure");
			bothState("Znalazłeś skarb – 100 tys. oboli.");
			abort("zlota_czaszka");
			cash(100000);
		}

		// chances to find item/potion/poem
		var seek = losuj(0, 7000);
		if (seek <= 400) {
			findItem();
		} else if (seek <= 500 + Hero.herbalism) {
			findPotion();
		} else if (seek >= 1000 && seek <= 1030 + ifPerform('fantazy') * 120 + ifPerform('znad_wod') * 60 && Hero.artism) {
			vein();
		}
	}

	// _____________________________________________________________-
	// I. Finding wearable item

	function findItem(itemSubtype, boost, itemName, noMiss) {
		// False - no space in the inventory
		if (pack() >= maxpack) {
			if (itemSubtype != undefined) {
				fastState("Przedmiot przepadł. Zwolnij miejsce w inwentarzu!");
			}
			return false;
		}
		// True - space is available

		// 0. Item is predefined --> go straight to createNewItem
		// 1. Radom item

		if (itemSubtype === undefined) {
			statistics.foundedItems++;
			var random = losuj(1, 20);
			if (noMiss) {
				random = Math.abs(random - 10);
			}
			if (random <= 5) {
				var random = losuj(1, 10 + ifPerform('bajka') * 2);
				if (random < 7) {
					itemSubtype = "w_regular";
				} else if (random < 10) {
					itemSubtype = "w_half";
				} else {
					var random = losuj(1, 10);
					if (random < 10) {
						itemSubtype = "w_magick";
					} else if (level > 4) {
						itemSubtype = "w_music";
					} else {
						return false;
					}
				}
			} else if (random <= 9) {
				var random = losuj(1, 15);
				if (random < 14) {
					itemSubtype = "a_regular";
				} else {
					itemSubtype = "a_half";
				}
			} else if (random === 10 && Hero.artism) {
				itemSubtype = "p_regular";
			} else if (random === 11 && ifPerform('sonet')) {
				itemSubtype = "p_regular";
			} else {
				statistics.foundedItems--;
				return false;
			}
		}
		return createNewItem(itemSubtype, itemName);

		function createNewItem(itemSubtype, itemName) {
			switch (itemSubtype.substr(0, 1)) {
				case "w":
					var itemType = "weapon";
					break;
				case "a":
					var itemType = "armor";
					break;
				case "p":
					var itemType = "pen";
					break;
			}

			// If weapon is boosted (by magic)
			if (boost === undefined) {
				boost = 1;
			} else {
				boost = 1 + boost / 10;
			}

			if (ifPerform('radosc_w_bolesci') && Hero.health < Hero.maxhealth / 3) {
				boost += 0.6;
			}

			if (ifPerform('zawisza_czarny') && itemType === 'armor') {
				boost += 0.2;
			}

			var itemPower = determineItemPower() * boost;
			var itemPower2 = 0;

			if (itemName === undefined) {
				var itemName = determineItemName(itemPower, itemType);
			}
			var itemPrice = itemPower * (1 + itemPower * 0.01) + itemPower * 4;

			switch (itemSubtype) {
				case "w_regular":
					break;

				case "w_half":
					itemName = Math.floor(itemName * 0.75);
					if (losuj(0, 1)) itemName++;
					if (itemName % 2) {
						// its a bow
						itemPower2 = Math.ceil(itemPower * 0.3);
						itemPower = Math.ceil(itemPower * 0.6);
					} else {
						// its a spear
						itemPower2 = Math.ceil(itemPower * 0.45);
						itemPower = Math.ceil(itemPower * 0.45);
					}
					break;

				case "w_music":
					itemPrice = (itemPower * itemPower + 2) / 10 / 2;
					itemName /= 3;
					itemPower2 = level / 2 * boost;
					itemPower = 0;
					break;

				case "w_magick":
					itemPrice *= 1.5;
					itemName *= 0.6;
					itemPower2 = itemPower - itemPower % 10;
					if (!itemPower2) {
						itemPower2 = 10;
					}
					itemPower = itemPower / 3 + 1;
					break;

				case "a_regular":
					itemPower *= 0.9;
					break;

				case "a_half":
					itemPrice *= 1.3;
					itemPower2 = itemPower * 0.3;
					itemPower = itemPower * 0.8;
					itemName *= 0.3;

					break;

				case "p_regular":
					itemPower = losuj(3, 8) / 10 * (level - 2);
					itemName = Math.floor(itemPower / 3);
					if (!losuj(0, 4) && itemName) {
						itemName--;
					}
					itemPrice = itemPower * 10 * (itemPower * 2) * 5;
					break;
			}

			if (itemName >= itm[itemSubtype].length) {
				itemName = itm[itemSubtype].length - 1;
			}
			itemName = Math.floor(itemName);

			itms[itemsInGame] = new Item(itemType, itemSubtype, itemName, Math.ceil(itemPower), Math.ceil(itemPower2), Math.ceil(itemPrice));
			itms[itemsInGame].toBag();

			var itemNameB = itm2[itemSubtype][itemName];
			state("Znalazłeś " + itemNameB + ".");
			firstItem(itemType);

			// autoseller
			if (ifPerform("kupiec_wenecki")) {
				var itemToSell = itemsInGame;
				setTimeout(function () {
					itms[itemToSell].sell(3);
				}, 100);
				bothState('Kupiec płaci sowicie za ten przedmiot.');
			}

			itemsInGame++;
			return itemNameB;
		}

		function determineItemPower() {
			var itemPower = 0;
			var levelMultipler = 2 + Math.floor(level / 5);
			for (var i = 0; i < level; i++) {
				itemPower += losuj(level - 3, level * levelMultipler + 1) + 3;
			}

			if (losuj(1, 4) === 1) {
				itemPower *= extraMultipler();
			};

			function extraMultipler() {
				var mnoznik = 2;
				var wynik = 1;
				while (mnoznik > 0) {
					if (losuj(1, mnoznik) === 1) {
						wynik *= 1.25;
						mnoznik += 1;
					} else {
						mnoznik = 0;
					}
				}
				return wynik;
			}

			return Math.floor(itemPower);
		}

		function determineItemName(itemPower, itemSubtype) {

			var comparator = Math.floor(itemPower / 18);
			// var tresholds = [0,2,4,7,11,16,21,28,36,45,55,66,78,91,105,120,150,200,250,380,480,620,800,1000];
			var tresholds = [0, 2, 4, 7, 11, 16, 21, 28, 36, 45, 55, 66, 78, 98, 120, 150, 200, 250, 380, 480, 620, 800, 1000, 1200];
			// var tresholds = [0,2,5,12,21,36,55,78,105,140,180,230,310,400,500,620,750,890,1100,1220,1500];

			for (var itemName = 0, k = tresholds.length; itemName < k; k++) {
				if (comparator > tresholds[itemName]) {
					itemName++;
				} else {
					break;
				}
			}

			// Randomize every name a little bit more
			switch (losuj(0, 6)) {
				case 0:
					itemName++;
					break;
				case 1:
					itemName--;
					break;
			}
			// Item name must be 0 or higher

			if (itemName > 0) {
				return itemName;
			} else {
				return 0;
			}
		}
	}

	function firstItem(subtype) {
		if (subtype === 'weapon') {
			fastState('Zdobyłeś swój pierwszy oręż.');
			state('Zdobyłeś swój pierwszy oręż. Uzbrój się w niego, by twoja krucjata stała się skuteczniejsza.', true);
		} else if (subtype === 'armor') {
			fastState('Zdobyłeś swój pierwszy pancerz.');
			state('Zdobyłeś swój pierwszy pancerz. Włóż go, by lepiej uchronić się od wrażych ciosów.', true);
		}

		$('.heroContainer').fadeTo('slow', 1);
		firstItem = function firstItem() {};
	}

	// _____________________________________________________________-
	// II. Finding potion

	function findPotion(ptn) {

		if (ifPerform('mohort')) {
			findItem(undefined, undefined, undefined, true);
			return false;
		}

		// 1. Choose potion if its not defined
		if (ptn === undefined) {
			// test whether potion was succesfully finded or not
			if (losuj(1, 10) < 1) {
				return false;
			}
			// in case of success - choose a potion
			var yourPotion = [1, 1, 1, 1, 1, 1, 1, 1, 1];
			var maxhealth = Hero.maxhealth;
			if (maxhealth > 150000) {
				yourPotion = [3, 3, 4, 4, 4, 4, 4, 4, 4];
			} else if (maxhealth > 100000) {
				yourPotion = [3, 3, 3, 4, 4, 4, 4, 4, 4];
			} else if (maxhealth > 90000) {
				yourPotion = [3, 3, 3, 3, 4, 4, 4, 4, 4];
			} else if (maxhealth > 75000) {
				yourPotion = [3, 3, 3, 3, 3, 4, 4, 4, 4];
			} else if (maxhealth > 60000) {
				yourPotion = [3, 3, 3, 3, 3, 3, 4, 4, 4];
			} else if (maxhealth > 50000) {
				yourPotion = [3, 3, 3, 3, 3, 3, 3, 4, 4];
			} else if (maxhealth > 40000) {
				yourPotion = [3, 3, 3, 3, 3, 3, 3, 3, 4];
			} else if (maxhealth > 25000) {
				yourPotion = [2, 2, 3, 3, 3, 3, 3, 3, 3];
			} else if (maxhealth > 15000) {
				yourPotion = [2, 2, 2, 2, 3, 3, 3, 3, 3];
			} else if (maxhealth > 10000) {
				yourPotion = [1, 2, 2, 2, 2, 2, 3, 3, 3];
			} else if (maxhealth > 5000) {
				yourPotion = [1, 1, 1, 2, 2, 2, 2, 2, 3];
			} else if (maxhealth > 3000) {
				yourPotion = [1, 1, 1, 1, 2, 2, 2, 2, 2];
			} else if (maxhealth > 1500) {
				yourPotion = [1, 1, 1, 1, 1, 1, 2, 2, 2];
			} else if (maxhealth > 1000) {
				yourPotion = [1, 1, 1, 1, 1, 1, 1, 2, 2];
			}

			ptn = yourPotion[losuj(0, 8)];
		}

		// Poems' special effects
		ptn += ifPerform("to_lubie");
		if (ptn > 4) {
			ptn = 4;
		}
		// ------

		// 2. Add specific potion
		var existingPotion = $('.potion[data-potion-type="' + ptn + '"][data-potion-amount="1"]').first();
		if (!existingPotion.length) {
			existingPotion = $('.potion[data-potion-type="' + ptn + '"][data-potion-amount="2"]').first();
		} else if (!existingPotion.length) {
			delete window.existingPotion;
		}
		if (existingPotion.length) {
			existingPotion.attr("data-potion-amount", Number(existingPotion.attr("data-potion-amount")) + 1);
			gotIt();
		} else {
			if (pack() < maxpack) {
				var findPlaceToAppendPotion = function findPlaceToAppendPotion() {
					for (var i = ptn; i > -2; i--) {
						if ($('[data-potion-type="' + i + '"]').length) {
							return $('[data-potion-type="' + i + '"]').last();
						}
					}
				};

				var appendedPotion = '<div data-descr="potion" class="potion" data-potion-type="' + ptn + '" data-potion-amount="1"> <div></div><p></p><p></p></div>';
				var whereToAppend = findPlaceToAppendPotion();
				if (whereToAppend) {
					whereToAppend.after(appendedPotion);
				} else {
					$('.inventory').prepend(appendedPotion);
				}
				gotIt();
			}
		}

		function gotIt() {
			Hero.potions[ptn - 1]++;
			update('potions');
			state("Znalazłeś leczniczy wywar.");
			sound("glass");
		}
	}

	// _____________________________________________________________-
	// III. Finding poem


	// B. USING ITEMS

	// 1. Wearable


	$('body').on("mousedown", ".item", function (e) {
		var id = $(this).attr("id");
		// wear
		if (e.which === 1) {
			if ($(this).is($('.inventory > div'))) {
				itms[id].takeOn();
			} else {
				itms[id].takeOff();
			}
			// sell
		} else {
			itms[id].sell();
		}
		hideInfo();
	});

	// 2.Potions


	$('.inventory').on("mousedown", ".potion", function (e) {
		if (e.which === 1 && Hero.health < Hero.maxhealth || e.which === 3) {
			var potionAmount = $(this).attr("data-potion-amount");
			var potionType = Number($(this).attr("data-potion-type"));
			Hero.potions[potionType - 1]--;
			update('potions');
			$(this).attr("data-potion-amount", potionAmount - 1);
			if (potionAmount - 1 <= 0) {
				slideDown(this);
				hideInfo();
			}
			// drink
			if (e.which === 1) {
				var potionHeal;
				switch (potionType) {
					case 1:
						potionHeal = 1500;
						break;
					case 2:
						potionHeal = 5000;
						break;
					case 3:
						potionHeal = 15000;
						break;
					case 4:
						potionHeal = 50000;
						break;
				}
				if (ifPerform("zmija") === losuj(1, 3)) {
					fastState("Wywar nie zadziałał.");
				} else {
					Hero.heal(potionHeal);
				}
				sound("drink");
				statistics.drinkedPotions++;

				if (ifPerform("snuc_milosc")) {
					Hero.maxhealth *= 1.015;
					Hero.heal(0);
				}

				// break	
			} else {
				sound("crush");
			}
		} else if (e.which === 1 && Hero.health >= Hero.maxhealth) {
			fastState("Jesteś już w pełni zdrowy.");
		}
	});

	function slideDown(e) {
		$(e).fadeOut(100, function () {
			$(e).replaceWith('<div class="placeholder"></div>');
			$('.placeholder').animate({ width: "0px" }, 200, function () {
				this.remove();
			});
		});
	}

	function pack() {
		return $('.inventory > div:not(.placeholder)').length;
	}

	// -----------------------------------------------
	// Find favourite weapon
	var allWeaponsArray = itm.w_regular.concat(itm.w_half).concat(itm.w_magick).concat(itm.w_music);
	statistics.favouriteWeaponsArray = {
		"gołe pięści": 0
	};
	for (var i = 0, favLen = allWeaponsArray.length; i < favLen; i++) {
		statistics.favouriteWeaponsArray[allWeaponsArray[i]] = 0;
	}
	function favouriteWeaponIncreaser() {
		statistics.favouriteWeaponsArray[Hero.weapon.title]++;
	};
	// 09. POEMS BOOK
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------

	function Poem(title, description, time, color) {
		this.page = page;
		this.title = title;
		this.description = description;
		this.time = time;
		// reversed time -> unendable
		this.color = color;
	}

	var book = {};
	var page = 0;

	book[++page] = new Poem("Sonet", "Zwiększa Artyzm o 1 i podwaja szansę na znalezienie pióra.", 600, "#3299CC");

	book[++page] = new Poem("Matecznik", "Twoi pajęczarze tracą zdolność ataku, lecz każdy z nich zapewnia ci 6 punktów premii do obrony.", 1200, "#757E00");
	// 1200


	book[++page] = new Poem("Lambro", "W twoje ręce trafia zaklęta żagiew.", 0, '#A60400');

	book[++page] = new Poem("Złota czaszka", "Przy każdym ataku – twoim lub sług – zapewnia cień szansy na znalezienie skarbu o wartości 100 tys. oboli. Wówczas działanie poematu kończy się.", 1800, "#ff9900");

	book[++page] = new Poem("Pierwiosnek", "Całkowicie cię uzdrawia.", 0, "#BDB402");

	book[++page] = new Poem("Żmija", "Zyskujesz dodatkowy atak magiczny o mocy 25 za każdy posiadany punkt Artyzmu. Istnieje jednak 33 procent szans, że wywary wypite w trakcie działania poematu nie przyniosą żadnego efektu.", -240, "#9900CC");
	// // 480
	book[++page] = new Poem("Trójka koni", "Twoi słudzy atakują zacieklej, zyskując 30 punktów przyśpieszenia. Równocześnie są bardziej narażeni na śmierć w bitwie, przez co ich żywotność spada o 25 procent.", 600, "#330000");
	book[++page] = new Poem("Romantyczność", "Pod twoją komendę trafiają nowe sługi: upiory.", 0, "#330066");
	// 600
	book[++page] = new Poem("Spartakus", "Twój atak rośnie o 10 za każdego sługę, który walczy po twojej stronie. Równocześnie twoja obrona spada o 3 za każdego takiego sługę.", 60, "#F30002");

	book[++page] = new Poem("Liść kalinowy", "Zyskujesz premię do zielarstwa równą 20, dzięki czemu w twoje ręce częściej trafiają życiodajne wywary.", 300, '#006633');

	book[++page] = new Poem("Śpiew z mogiły", "Gdy któryś z twoich sług zginie, wykonując atak, w swym ostanim uderzeniu zada trzydziestokrotnie większe rany.", 600, '#484848');

	book[++page] = new Poem("Baranki moje", "Zmniejsza koszt zatrudnienia sług o 10 procent.", 900, "#AC9989");

	book[++page] = new Poem("Do matki", "Przyspiesza tempo gojenia się twoich ran o 50 procent.", 1800, "#3232CD");

	book[++page] = new Poem("Chmury", "Dwuipółkrotnie zwiększa obronę zapewnianą przez broń drzewcową lub dystansową.", 600, "#adadad");

	// book[++page] = new Poem ("Rozmowa z piramidami", "Twoja obrona powoli, lecz trwale wzrasta. Działa coraz silniej wraz z upływem czasu.",

	book[++page] = new Poem("Wielkie słowa", "Każdy akt stworzenia poematu całkowicie cię uzdrawia.", 1200, "#4A766E");
	// 900, "#5E210B");

	book[++page] = new Poem("Anhelli", "Mroźny syberyjski wiart skuwa lodem całą krainą. Wróg nie atakuje i nie odnosisz żadnych ran w walce.", 10, "#4CB1BB");

	// book[++page] = new Poem ("Bezimienni", "Hycle otrzymują premię do ataku równą twojemu Artyzmowi.",
	// 300, "#663366");


	book[++page] = new Poem("Ironia", "Trwale zmniejsza twoją maksymalną witalność o 15 procent. W zamian za to w twych rękach ląduje pokaźna garść monet – 5 tys. za każdy posiadany punkt Artyzmu.", 0, "#2F4F2F");

	book[++page] = new Poem("Wieniec przeklętych", "Twój atak trwale rośnie o wartość posiadanego Artyzmu za każdego sługę, który zginie podczas trwania poematu.", 300, "#4F2F39");

	book[++page] = new Poem("Nokturn", "Budzi się w tobie zew nocy. Stajesz się niewrażliwy na ataki, a każdy twój atak przywraca ci tym więcej witalności, im jest silniejszy. Witalność samoistnie spada w szybkim tempie i nie może zostać odnowiona przy pomocy wywarów – musisz więc nieustannie atakować.", -90, "#000000");

	book[++page] = new Poem("Tak mi Boże dopomóż", "Zwiększa twoje atak i obronę o pięciokrotność posiadanego Artyzmu.", 600, "#9F5F9F");

	book[++page] = new Poem("Kabała", "Jeden z twoich pajęczarzy – i jeden dodatkowy za każde 10 posiadanych punktów Artyzmu – staje się siepaczem. Trwale tracisz 8 punktów Obrony za każdą taką przemianę.", 0, "#7093DB");

	book[++page] = new Poem("Zbójcy", "Zyskujesz premię 10 do ataku za każdego siepacza, który ci służy.", 120, "#6F4242");

	book[++page] = new Poem("Wiatr", "Twoi słudzy zyskują 1 procent przyspieszenie ataku za każdy twój punkt Artyzmu.", 1200, "#466E88");

	book[++page] = new Poem("Przedświt", "Twój ostatni zmarły sługa powraca do świata żywych.", 0, "white");

	book[++page] = new Poem("Mysia wieża", "Na czas trwania poematu hycle stają się rojami myszy. W tej postaci są tym silniejsi, im posiadasz ich więcej; bardzo szybko giną i kąsają także ciebie, przed czym nie chroni żadna zbroja. Poemat kończy się natychmiast, gdy zdechną wszystkie myszy. Uwaga! Jeśli użyjesz poematu, posiadając wielu hycli, możesz łatwo zginąć.", 600, "#2B2500");

	book[++page] = new Poem("Chochlik", "Istnieją równe szanse, że w twoje ręce trafi potężny przedmiot, że zginie któryś z twoich sług i że nic się nie stanie.", 0, "#C00C25");

	book[++page] = new Poem("Niewiadomo co", "Jeśli walczysz różdżką, jej współczynnik niemagicznego ataku jest czterokrotnie większy.", 780, "#660033");

	book[++page] = new Poem("Żelazna rękawica", "Premia do Artyzmu zapewniana przez twoje pióro podwaja się, lecz przez czas trwania poematu nie nawiedza cię wena.", 600, "#686868");

	book[++page] = new Poem("Zachwycenie", "Natychmiast przychodzi wena.", 0, "#1A9B00");

	book[++page] = new Poem("Niedźwiedź", "Twój atak staje się równy obronie, jeśli jest od niej niższy.", 300, "#401823");

	book[++page] = new Poem("Najcięższa łza", "Ilekroć któryś z twoich sług zginie, w twoje ręce trafia leczniczy wywar.", 600, "#5499B1");

	book[++page] = new Poem("Głęboka noc", "Na czas trwania poematu twoje upiory stają się wampirami. W tej postaci są silniejsze, a każdy ich atak wysysa życie i przywraca tobie część straconej wytrzymałości.", 600, "#000900");

	book[++page] = new Poem("Fatum", "Zyskujesz premię 3 do Artyzmu. Jednak ilekroć zostaniesz zraniony, istnieje SZALENIE znikoma szansa, że natychmiast zginiesz.", -600, "#545454");

	book[++page] = new Poem("Burza", "Na czas trwania poematu zyskujesz atak magiczny, który staje się silniejszy w miarę kolejnych zadawanych przez ciebie uderzeń.", 120, "#425270");

	book[++page] = new Poem("Na ruinach", "Zadajesz trzykrotnie większe rany, jeśli łączna wartość ataku twoich sług jest mniejsza od twojej.", 300, "#7F7F7F");

	book[++page] = new Poem("Bajka", "Szansa na znalezienie różdżek i instrumentów staje się blisko trzykrotnie większa.", 1200, "#5648E8");

	book[++page] = new Poem("Czułość", "Nie zadajesz żadnej krzywdy i nie odnosisz ran w walce. Mimo to wciąż możesz znaleźć pieniądze i przedmioty.", 240, "#ff3366");

	book[++page] = new Poem("Duma", 'Ilekroć wynajmujesz drugiego lub kolejnego sługę danego rodzaju, istnieje 20 procent szans, że nie żądając zapłaty dołączy do ciebie jeszcze jeden sługa tego rodzaju.', 1200, "#9F9F5F");

	book[++page] = new Poem("Znad wód", "Twój Artyzm spada o 4, ale szanse na przyjście weny są trzykrotnie większe.", 600, "#22559D");

	book[++page] = new Poem("Żyjący grób", "Żywotność twoich sług wzrasta o 300 procent.", 1200, "#000033");

	book[++page] = new Poem("Oblężenie", "Siepacze atakują z podwójną siłą, a każdy ich atak kończy się znalezieniem przedmiotu. Przy każdym ataku ginie jeden siepacz. Poemat kończy się z chwilą śmierci ostatniego siepacza.", 60, '#651417'), book[++page] = new Poem("Nerwy", "Cena sprzedaży przedmiotów przez jedno uderzenie serca jest dwukrotnie wyższa.", 6, "#E47833");

	book[++page] = new Poem("Hosanna", "Wszyscy twoi ranni słudzy wracają do pełni witalności.", 0, "#8DBBFF");

	book[++page] = new Poem('Łucznik', "W twoje ręce trafia potężna broń strzelecka lub drzewcowa.", 0, '#534C4A');

	book[++page] = new Poem("Ogrodnik", "Zwiększa szybkość gojenia się twoich ran o 300 procent oraz liczbę znajdowanych wywarów o 30 procent.", 120, "#99cc00");

	book[++page] = new Poem("Mohort", "Za każdym razem, gdy do twojego inwentarza powinien trafić leczniczy wywar, zamiast niego zdobywasz przedmiot użyteczny na polu bitwy.", -300, "#31150E");

	book[++page] = new Poem("Snuć miłość", "Ilekroć wypijesz leczniczy wywar w trakcie trwania poematu, twoja maksymalna witalność zwiększy się o 1,5 procenta.", 60, "#ff0099");

	book[++page] = new Poem("Rozum i wiara", "Zapewnia 5-procentową szansę, że natychmiast przejdziesz do kolejnej strofy (i zdobędziesz wszystkie pieniędze, które zarobiłbyś dążąc do celu powoli).", 0, "#004115");

	book[++page] = new Poem("Kupiec wenecki", "Wszystkie posiadające wartość przedmioty, które trafią w twoje ręce, są natychmiast sprzedawane. Otrzymujesz jednak za nie trzykrotnie lepszą cenę.", -600, "#E47833");

	book[++page] = new Poem("Balladyna", "Znajdujesz potężny instrument.", 0, "#F967C0");

	book[++page] = new Poem("Smutno mi Boże", "Jeśli dysponujesz atakiem magicznym, jest on o 75 procent silniejszy. Przec czas trwania poematu zdobywasz jednak o połowę mniej pieniędzy.", 600, "#996633");

	book[++page] = new Poem("Zawisza Czarny", "Wszyskie pancerze, które trafią w twoje ręce, będe o 20 procent potężniejsze.", 1200, "#181B20");

	book[++page] = new Poem("Przygrywka", "Zapewnia szansę 5 procent za każdego służącego ci harfiarza, że dołączy do ciebie sługa najpotężniejszego dostępnego typu, pod warunkiem, że posiadasz już choć jednego sługę tego typu, oraz dodatkowo szansę 1 procenta za każdego harfiarza, że dołączy do ciebie kolejny harfiarz.", 0, "#2994C8");

	book[++page] = new Poem("Drżenie", "Dołącza do ciebie kolos, najpierw jednak uderza cię z siłą 20 000. Upewnij się, że wyjdziesz z tego cało...", 0, "#33313A");

	book[++page] = new Poem("To lubię", "Wszystkie znalezione przez ciebie wywary są o jedną klasę lepsze, niż byłyby w normalnej sytuacji.", 600, "#FF3333");

	book[++page] = new Poem("Gawęda", "Twoi bojarzy zapewniają ci premię do zdobywanych bogactw.", 1800, "#4F2F4F");

	book[++page] = new Poem("Vivat", "Twoja obrona spada do zera, a pięciokrotność jej dotychczasowej wartość zostaje dodana do ataku. Otrzymujesz też premię 100 procent do zdobywanych bogactw.", 15, "#E19100");

	book[++page] = new Poem("Trzy struny", "Czas trwania aktualnie używanych poematów zostaje odnowiony.", 0, "#BC8F8F");

	book[++page] = new Poem("Pielgrzym", "Twoja obrona rośnie o 25 za każdy posiadany przez ciebie punkt Artyzmu. Za to koszt wynajęcia slug rośnie o 10 procent.", 1800, "#5F9F9F");

	// book[++page] = new Poem ("Białe orlę", "Jeśli któryś z twoich sług zginie, wraca do ciebie 25 procent jego żołdu.",
	// 1200, "#dedede");

	book[++page] = new Poem("Lilije", "Ilekroć zatrudnisz upiora, zdobywasz średni wywar leczniczy.", 1200, "#990099");
	// book[++page] = new Poem ("Testament mój", "Zadajesz 12-krotnie większą krzywdę i nie można cię zabić. Z chwilą zakończenia działania poematu – umierasz.",
	// 45, "#414141");

	book[++page] = new Poem("Radość w boleści", "Trafiające w twoje ręce przedmioty są znacznie potężniejsze, jeśli w trakcie poszukiwań dysponujesz mniej niż jedną trzecią maksymalnej witalności.", 2400, "#9A618A");

	book[++page] = new Poem("Słowik", "Twoi harfiarze zmniejszają koszt zatrudniania sług.", 600, "#EEDC05");

	book[++page] = new Poem("Lilla Weneda", "Twoi harfiarze dobywają mieczy, dzięki czemu zyskują atak 200.", 1200, "#238E23");

	book[++page] = new Poem("Żal rozrzutnika", "Daje 65 procent szans, że podwoisz ilość posiadanych pieniędzy i 35 procent szans, że wszystko stracisz.", 0, "#003333");

	book[++page] = new Poem("Książę niezłomny", "Zadajesz potrójne rany, jeśli w chwili uderzenia masz mniej niż połowę maksymalnej witalności.", 300, "#43534D");

	book[++page] = new Poem("Jesień", "Trwale zyskujesz 1 punkt Artyzmu, lecz płaci za to życiem twój najsilniejszy sługa.", 0, "#FF3300");

	book[++page] = new Poem("Cztery rzeczy", "W twoje ręce trafiają cztery przedmioty.", 0, "#430000");

	book[++page] = new Poem("Karnawał", "Za każdego służącego ci harfiarza dołączają do ciebie hycel, pajęczarz, siepacz i upiór.", 0, "#ff3300");

	// book[++page] = new Poem ("Sfinks", "Twój atak powoli, lecz trwale wzrasta. Działa tym silniej, im mniej czasu pozostało do zakończenia poematu",
	// 900, "#A3952A");


	book[++page] = new Poem("Święta grota", "Za każdym razem, gdy sprzedajesz przedmiot, istnieje niewielka szansa, że trafisz na trop jaskini pełnej skarbów, dzięki czemu wypełnisz swój inwentarz kosztownościami.", 1200, "#996600");

	book[++page] = new Poem("Dziady", "Pięciu twoich ostatnio zmarłych sługów wraca do życia.", 0, "#330033");

	book[++page] = new Poem("Sen srebrny Salomei", "Losowy sługa zostaje złożony w ofierze. Zadajesz ranę równą 300-krotności jego siły ataku. Jeśli ofiarą będzie harfiarz, twój Artyzm trwale wzrasta o 1.", 0, "#8E8E8E");

	book[++page] = new Poem("Żywa pochodnia", "Otrzymujesz atak magiczny 120 za każdy posiadany punkt Artyzmu. Ogień pali także ciebie z jedną czwartą tej siły.", 300, "#E35226");

	book[++page] = new Poem("Lirnik", "Jeśli posługujesz się instrumentem muzycznym, wartość twojego ataku staje się równa sile twojego ataku magicznego", 600, "#909100");

	book[++page] = new Poem("Praca", "Twoi słudzy zadają tylko połowę ran w walce, za to zdobywają dla ciebie dwa razy więcej pieniędzy (uwzględniwszy mniejsze rany).", 1800, "#5c3317");

	book[++page] = new Poem("Grób Agamemnona", "Pod twoją komendę trafiają nowe sługi: trojanie.", 0, "#8E2323");

	book[++page] = new Poem("Godzina myśli", "Na potrzeby zdolności poematów twój Artyzm jest traktowany tak, jakby był o 10 większy.", 3600, "#669999");

	book[++page] = new Poem("Runy", "Kolosy tracą zdolność ataku, ale zapewniają ci Artyzm tak samo, jak harfiarze.", 1800, "#333366");

	book[++page] = new Poem("Beniowski", "Twój atak rośnie o 70 za każdy posiadany przez ciebie punkt Artyzmu.", 60, "#660035");

	book[++page] = new Poem("Ojciec zadżumionych", "Połowa twoich sług (zaokrąglona w górę) ginie. Otrzymujesz trwałą premię do ataku magicznego równą połowie siły ataku zabitych.", 0, "#009966");

	book[++page] = new Poem("Fantazy", "5-krotnie zwiększa szansę na przyjście weny.", 180, "#33FFFF");

	book[++page] = new Poem("Arcymistrz", "Twój atak magiczny staje się 2 i pół razy silniejszy kosztem tradycyjnego ataku, którego wartość staje się równa 0.", 900, "#006600");

	book[++page] = new Poem("Kordian", "Jeśli zginiesz w trakcie trwania poematu, zostajesz uratowany i odzyskujesz pełnię witalności. Wówczas działanie poematu dobiega końca.", 1800, "#FF0019");

	book[++page] = new Poem("Irydion", "Na czas trwania poematu trojanie stają się hekatoncheirami. Zyskują ogromną siłę, przyspieszenie ataku oraz pięciokrotnie większą szansę na cios krytyczny. Przy każdym ich uderzeniu istnieje jednak SZALENIE znikoma szansa na to, że sam zostaniesz przez nich zabity.", 600, "#3D203D");

	book[++page] = new Poem("Meteor", "Natychmiast przechodzisz do kolejnej strofy – i zdobywasz wszystkie pieniędze, które zarobiłbyś po drodze – płacąc za to trwałą utratą 5 punktów Artyzmu.", 0, "#912700");

	book[++page] = new Poem("Genezis z ducha", "Ilekroć któryś z twych sługów zginie, odradza się w kolejnej, silniejszej postaci.", 10800, "#003399");

	// -----------------------------------------
	// -----------------------------------------
	// -----------------------------------------

	// -------------------------------
	// -------------------------------
	// Poems' special effects


	// Magic effects #2
	function poemStartEffect(poem) {
		switch (poem) {
			case "pierwiosnek":
				Hero.heal(Hero.maxhealth);
				abort('nokturn');
				fastState('Od razu czujesz się lepiej.');
				break;

			case "matecznik":
				merc[1].attack -= merc[1].baseAttack;
				merc[1].refresh();
				break;

			case 'lambro':
				findItem('w_magick', 1, 0);
				break;

			case "romantycznosc":
				merc[3].appear();
				newMercState();
				break;

			case "kabala":
				var kabalas = 1 + Math.floor(godzinaBoost(Hero.artism) / 10);
				if (merc[1].amount < kabalas) {
					kabalas = merc[1].amount;
				}
				while (kabalas) {
					kabalas--;
					merc[1].fire();
					merc[2].hire();
					Hero.defense -= 8;
				}
				break;

			case 'przygrywka':
				var flag = 0;
				if (losuj(1, 100) <= merc[5].amount * 5) {
					var newMerc = strongestMercenary();
					flag++;
					newMerc.hire();
				}
				if (losuj(1, 100) <= merc[5].amount) {
					merc[5].hire();
					if (flag) {
						bothState('Przyciągnięci pieśnią harfiarzy, dołączają do ciebie ' + newMerc.name + ' i kolejny harfiarz.');
					} else {
						bothState('Przyciągnięty pieśnią harfiarzy, dołącza do ciebie kolejny harfiarz.');
					}
				} else {
					if (flag) {
						bothState('Przyciągnięty pieśnią harfiarzy, dołącza do ciebie ' + newMerc.name + '.');
					} else {
						fastState('Nikt nie usłyszał pieśni.');
					}
				}

				break;

			case "ironia":
				Hero.maxhealth = Math.floor(Hero.maxhealth * 0.85);
				var toGet = godzinaBoost(Hero.artism) * 5000;
				cash(toGet);
				Hero.heal(0);
				fastState('Własną krwią zapłaciłeś za pełny trzos: ' + spacing(toGet) + ' oboli.');
				break;

			case "zachwycenie":
				vein();
				break;

			case "lilla_weneda":
				merc[5].attack += 200;
				break;

			case "lucznik":
				var theItem = findItem("w_half", 3);
				fastState("Zdobyłeś " + theItem + '.');
				break;

			case "zal_rozrzutnika":
				if (losuj(1, 100) < 66) {
					cash(obols);
					fastState('Pieniądze są twoje.');
				} else {
					cash(-obols);
					fastState('Straciłeś majątek...');
				}
				break;

			case 'cztery_rzeczy':
				for (var i = 0; i < 4; i++) {
					findItem(undefined, undefined, undefined, true);
				}
				break;

			case 'chochlik':
				switch (losuj(1, 3)) {
					case 1:
						var theItem = findItem(undefined, 9, undefined, true);

						fastState('Sukces! Zdobyłeś ' + theItem + '.');
						break;
					case 2:
						var randomMerc = randomMercenary();
						if (!randomMerc) {
							fastState('Nic się nie stało.');
						} else {
							randomMerc.fire();
							fastState(randomMerc.name + ' poniósł śmierć.');
						}
						break;
					case 3:
						fastState('Nic się nie stało.');
						break;
				}
				break;

			case 'drzenie':
				Hero.hurt(20000, 'kolos');
				fastState('Kraina zadrżała w posadach.');
				merc[6].hire();
				break;

			case 'jesien':
				var sacrifice = strongestMercenary();
				if (sacrifice) {
					sacrifice.fire();
					fastState(sacrifice.name + ' poniósł śmierć.');
				}
				Hero.inn.artism++;
				break;

			case "rozum_i_wiara":
				if (losuj(1, 100) <= 5) {
					fastLevelUp();
					fastState("Doznałeś olśnienia.");
				} else {
					fastState('Niczego nie poczułeś.');
				}
				break;

			case "rusalki":
				Hero.inn.artism++;
				state("Twój Artyzm trwale się zwiększył.");
				break;

			case "runy":
				merc[6].attack -= merc[6].baseAttack;
				break;

			case "grob_agamemnona":
				merc[7].appear();
				newMercState();
				break;

			case 'dziady':
				for (var i = 0; i < 5; i++) {
					var resurrected = deadsArray.shift();
					if (resurrected != undefined) {
						merc[resurrected].hire();
						update('deadsArray');
						state("Twój " + merc[resurrected].name + " powstał z martwych.");
						fastState("Twoi słudzy powstali z martwych.");
					} else {
						return;
					}
				}
				break;

			case 'oblezenie':
				merc[2].attack = merc[2].baseAttack * 2;
				merc[2].refresh();
				break;

			case "meteor":
				fastLevelUp();
				Hero.inn.artism -= 5;
				break;

			case "balladyna":
				var theItem = findItem("w_music", 3);
				fastState("Zdobyłeś " + theItem + '.');
				break;

			case "smierc":
				var sacrifice = randomMercenary();
				if (sacrifice) {
					Enemy.damaged(sacrifice.attack * 300);
					sacrifice.fire();
					if (sacrifice.name === "harfiarz") {
						Hero.inn.artism;
					}
					fastState(sacrifice.name + ' spłynął krwią.');
				} else {
					fastState('Nikt nie został poświęcony.');
				}
				break;

			case "przedswit":
				var resurrected = deadsArray.shift();
				if (resurrected != undefined) {
					merc[resurrected].hire();
					bothState("Twój " + merc[resurrected].name + " powstał z martwych.");
					update('deadsArray');
				} else {
					fastState('Nikt nie został ożywiony.');
				}
				break;

			case "karnawal":
				var harpersAmonut = merc[5].amount;
				for (var i = 0; i < harpersAmonut; i++) {
					merc[0].hire();
					merc[1].hire();
					merc[2].hire();
					merc[3].hire();
				}
				if (harpersAmonut) {
					bothState('Nowe sługi zasilają twoje szeregi.');
				}
				break;

			case "mysia_wieza":
				merc[0].name = 'rój myszy';
				merc[0].namePlur = 'rojów myszy';
				merc[0].health = 15;
				merc[0].maxhealth = 15;
				merc[0].refresh();
				$('#merc0 .merc-image').css('background-position', '-450px 0');
				break;

			case "irydion":
				merc[7].name = 'hekatoncheir';
				merc[7].namePlur = 'hekatoncheirów';
				merc[7].attack += 15000;
				merc[7].refresh();
				$('#merc7 .merc-image').css('background-position', '-550px 0');
				break;

			case "gleboka_noc":
				merc[3].name = 'wampir';
				merc[3].namePlur = 'wampirów';
				merc[3].attack += 20;
				merc[3].refresh();
				$('#merc3 .merc-image').css('background-position', '-500px 0');
				break;

			case "trzy_struny":
				$.each(performed, function (index, value) {
					var page = pageByShortTitle(value.short);
					readPoem(page);
					statistics.favouritePoemsArray[page]--;
				});
				break;

			case "krol_duch":

				var godsThunder = function godsThunder() {
					if (level < maxlevel + 10) {
						silent(fastLevelUp);
						setTimeout(godsThunder, 400);
					} else {
						$('.eagleShape').fadeOut(1000);
						Hero.hurt(Hero.maxhealth, "win", true);
					}
				};
				godsThunder();
				break;

			case 'nokturn':
				$('#health').addClass('nokturn');
				Hero.nocturnoStream();
				fastState('Ogarnął cię mroczny szał...');
				break;

			case 'anhelli':
				$('.eagle-click').addClass('frozen');
				break;

			case 'hosanna':
				everybody('heal');
				fastState('Uzdrawiająca fala ogarnęła twoje szeregi.');
				break;

			case "ojciec_zadzumionych":
				var victimsArr = [];
				var plagueBonus = 0;

				for (var z = 0; z <= 8; z++) {
					var numOfVictims = Math.ceil(merc[z].amount / 2);
					victimsArr.push(numOfVictims);
				}
				for (var z = 0; z <= 8; z++) {
					var thisTypeVictims = victimsArr[z];
					if (thisTypeVictims) {
						for (var i = 0; i < thisTypeVictims; i++) {
							merc[z].fire();
							plagueBonus += merc[z].attack;
						}
					}
				}
				plagueBonus = Math.ceil(plagueBonus / 2);
				Hero.inn.magicAttack += plagueBonus;
				if (plagueBonus) bothState('Mroczna plaga przetrzebiła twoje szeregi...');
		}
	}

	function poemCompleteEffect(poem) {
		switch (poem) {
			case "matecznik":
				merc[1].attack += merc[1].baseAttack;
				merc[1].refresh();
				break;

			case "lilla_weneda":
				merc[5].attack -= 200;
				break;

			case "burza":
				Hero.storm = 0;
				break;

			case "runy":
				merc[6].attack += merc[6].baseAttack;
				break;

			case 'anhelli':
				$('.eagle-click').removeClass('frozen');
				break;

			case 'oblezenie':
				merc[2].attack = merc[2].baseAttack;
				merc[2].refresh();
				break;

			case "mysia_wieza":
				merc[0].name = 'hycel';
				merc[0].namePlur = 'hycli';
				merc[0].maxhealth = 60;
				merc[0].attack = 1;
				$('#merc0 .merc-image').css('background-position', '0px 0');
				break;

			case 'nokturn':
				$('#health').removeClass('nokturn');
				break;

			case "irydion":
				merc[7].name = 'trojanin';
				merc[7].namePlur = 'trojan';
				merc[7].attack -= 15000;
				merc[7].refresh();
				$('#merc7 .merc-image').css('background-position', '-350px 0');
				break;

			case "gleboka_noc":
				merc[3].name = 'upiór';
				merc[3].namePlur = 'upiorów';
				merc[3].attack -= 20;
				merc[3].refresh();
				$('#merc3 .merc-image').css('background-position', '-150px 0');
				break;
		}
	}

	function godzinaBoost(val) {
		return val + ifPerform('godzina_mysli') * 10;
	}

	// 09. POEMS PICK
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------

	var inkwell = [];

	function addInkwell() {
		var inkwellIcon = "<div class='inkwell' data-descr='inkwell' data-potion-type='0' data-potion-amount='1'><div></div><p></p></div>";
		if ($('.inventory > .key').length) {
			$('.inventory > .key').last().after(inkwellIcon);
		} else {
			$('.inventory').prepend(inkwellIcon);
		}
	}

	var romantycznosc = pageByShortTitle('romantycznosc');
	var grob_agamemnona = pageByShortTitle('grob_agamemnona');

	function availableByArtism(val) {
		var hugeArtism = 30;
		if (val < hugeArtism) {
			val = val * 2 + 5;
		} else {
			var overHugeArtism = val - hugeArtism;
			val = hugeArtism;
			val = val * 2 + 5 + overHugeArtism;
		}
		return val;
	}

	function vein(theLastVein) {
		if ((inkwell.length < 5 || theLastVein) && notPerform('zelazna_rekawica')) {
			var poemsInVein = function poemsInVein() {
				var artism = Hero.artism;
				var maxVein = availableByArtism(artism);
				var fromVein = [];
				var forbiddenPoemNo1, forbiddenPoemNo2;

				// WARNING!
				// trzeba dać romantyczność i grób agamemnona
				if (merc[3].check === true) {
					forbiddenPoemNo1 = romantycznosc;
				}
				if (merc[8].check === true) {
					forbiddenPoemNo2 = grob_agamemnona;
				}

				for (var j = 0; j < 4; j++) {
					if (fromVein[j] != undefined) {
						break;
					}
					do {
						fromVein[j] = losuj(1, maxVein);
					} while (diverstityTest(fromVein[j]));
				}

				function diverstityTest(x) {
					for (var i = 0; i < fromVein.length; i++) {
						if (x == fromVein[i - 1]) {
							return true;
						}
					}
					if (x === forbiddenPoemNo1 || x === forbiddenPoemNo2) {
						return true;
					}
					return false;
				}

				fromVein.shuffle();
				fromVein.push(Hero.artism);
				return fromVein;
			};

			sound('poem');
			if (theLastVein) {
				inkwell.push([page]);
			} else {
				inkwell.push(poemsInVein());
			}

			if (inkwell.length === 1) {
				addInkwell();
			}
			$('.inkwell').attr("data-potion-amount", inkwell.length);
			state("Nadeszła wena.");
		}
	}

	function pourInkwell() {
		if (inkwell.length > 0 && inkwell[0].length > 0) {
			inkwell.shift();
			var howMany = inkwell.length;
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
	});

	function choosePoem() {
		if (!Hero.alive) return;
		$('.fogContainer').fadeToggle('fast');
		$('.pickContainer').toggle('fast');
		cleanPickPoemInfo();
		if (inkwell[0].length === 5) {
			for (var i = 0; i < 4; i++) {
				var color = book[inkwell[0][i]].color;
				var theSpiral = drawSpiral(color);
				$('.pickContainer .options div:nth-child(' + (i + 1) + ')').attr('data-poem', inkwell[0][i]).html(theSpiral).show();
			}
		} else {
			var color = book[page].color;
			var theSpiral = drawSpiral(color);
			$('.pickContainer .options div').hide();
			$('.pickContainer .options div:first-child').show().attr('data-poem', inkwell[0][0]).html(theSpiral);
		}

		function drawSpiral(color) {
			return '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg4345" viewBox="0 0 40 40.000001" height="40" width="40"> <defs id="defs4347" /> <metadata id="metadata4350"> <rdf:RDF> <cc:Workrdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g transform="translate(0,-1012.3622)" id="layer1"> <path transform="matrix(0.05783034,0,0,0.05603657,-0.99166212,1011.8132)" style="opacity:1;fill:none;fill-rule:evenodd;stroke:' + color + ';stroke-width:33;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path4292" d="m 348.51474,351.37796 c 0.90705,4.43162 -6.07527,3.18648 -7.86976,1.61076 -6.48934,-5.69819 -1.85937,-15.73658 4.19477,-19.56584 11.98047,-7.57769 27.12879,0.3118 32.76448,12.00113 8.87313,18.40434 -2.85479,39.60108 -20.7049,46.91897 -25.09876,10.28957 -52.84098,-5.63492 -61.80855,-30.03037 -11.78179,-32.05126 8.59215,-66.68766 39.83987,-77.30311 39.23488,-13.32885 81.04147,11.69239 93.31532,50.04932 14.91956,46.62503 -14.91331,95.83373 -60.60155,109.78196 -54.20124,16.54717 -111.01391,-18.23901 -126.65491,-71.45489 -18.20711,-61.94665 21.65756,-126.54302 82.57753,-143.89617 69.84731,-19.89611 142.38998,25.15966 161.47487,93.94428 21.61167,77.89149 -28.7378,158.52935 -105.53469,179.36544 C 293.438,526.15123 204.56735,470.4136 181.961,385.46766 156.84615,291.09575 218.05961,193.86419 311.28217,169.46897 414.07429,142.56951 519.78679,209.34069 545.98896,310.95955 574.69339,422.28286 502.28758,536.58929 392.15963,564.61595 272.19995,595.14471 149.19271,517.03165 119.32455,398.28789 86.953043,269.59182 170.84212,137.78232 298.30304,106.05619 435.83091,71.824306 576.53926,161.55482 610.13935,297.82945 646.24851,444.28032 550.61418,593.9798 405.43361,629.46933 249.97232,667.47199 91.193384,565.8742 53.799379,411.69938 13.887569,247.1437 121.506,79.200533 284.75984,39.887462 458.49069,-1.9485764 635.67961,111.74543 676.92592,284.15978 720.70077,467.14369 600.87833,653.65689 419.22493,696.85023" /></g></svg>';
		}
	}

	$('body').on("mouseover", ".pickContainer .options div ", function () {
		$('.veinLevel').hide();
		book[$(this).attr('data-poem')].provideInfo(true);
	});

	$('body').on("mouseleave", ".pickContainer .options div ", function () {
		cleanPickPoemInfo();
	});

	$('body').on("click", ".pickContainer .options div ", function () {
		if (pack() >= maxpack) return;
		book[$(this).attr('data-poem')].toBag();
		pourInkwell();
		choosingQuit();
		if (ifPerform('wielkie_slowa')) {
			sound('poem');
			Hero.heal(Hero.maxhealth);
			fastState('Poryw duszy uzdrowił twoje ciało.');
		}
	});

	$('.choosingQuit').click(choosingQuit);

	function choosingQuit() {
		cleanPickPoemInfo();
		$('.fogContainer').fadeToggle('fast');
		$('.pickContainer').toggle('fast');
	}

	function cleanPickPoemInfo() {
		$('.newPoemInfo').text('');
		if (inkwell[0]) {
			if (inkwell[0].length === 5) {
				$('.pickContainer .veinLevel h2 span').text(inkwell[0][4]);
			} else {
				$('.pickContainer .veinLevel h2 span').text('100');
			}
		} else {
			$('.pickContainer .veinLevel h2 span').text(0);
		}
		$('.veinLevel').show();
		if (pack() >= maxpack) {
			$('.noSpace').show();
		} else {

			$('.noSpace').hide();
		}
	}

	// 09. POEMS THEORY
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------

	// add short names for the array
	$.each(book, function (index, value) {
		value.short = poemNameParse(value.title);
	});

	// Create favourite poems array
	statistics.favouritePoemsArray = [0];
	for (var i = 0; i < 100; i++) {
		statistics.favouritePoemsArray.push(0);
	}

	function poemNameParse(title) {
		return title.toLowerCase().replace(/ /g, '_').replace(/-/g, '_').replace(/ć/g, 'c').replace(/ą/g, 'a').replace(/ę/g, 'e').replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o').replace(/ś/g, 's').replace(/ż/g, 'z').replace(/ź/g, 'z'); //.split(' ')[0]
	}

	// Extra functions

	function pageByShortTitle(short) {
		var searchedPage;
		$.each(book, function (index, value) {
			if (value.short == short) {
				searchedPage = value.page;
				return true;
			}
		});
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

		_header.html('<span style="color: ' + this.color + '">' + this.title + '</span>');
		_info.text(this.description);
		if (time > 0) {
			var timeInfo = "Czas trwania: " + timeLeft(time) + '.';
		} else if (!time) {
			var timeInfo = "Działa natychmiast po użyciu.";
		} else {
			var timeInfo = "Czas trwania: " + timeLeft(Math.abs(time)) + '.';
			_info3.text("Nie można przerwać!");
		}
		_info2.text(timeInfo);
	};

	Poem.prototype.svg = function () {
		var color = this.color;
		return '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="33px" height="48px" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"viewBox="0 0 35 55" xmlns:xlink="http://www.w3.org/1999/xlink"> <g id="Warstwa_x0020_1">  <metadata id="CorelCorpID_0Corel-Layer"/>  <path fill="#D7B56D" stroke="#DCCF73" stroke-width="0.20008" d="M7 2c1,0 1,1 6,1 6,0 17,-2 20,-1 1,0 0,2 0,2l0 0 -2 1 2 0 -1 6 -1 0 -4 0 4 1 1 0 0 3 -1 0 1 0 -1 10 0 2 -3 0 3 1 -1 6c0,1 -1,1 -2,1l-4 0 -2 -1 -2 1 0 0c-2,0 -6,0 -10,-1 -1,0 -5,0 -7,0l0 -1 -1 0 0 0 1 -10 0 0 1 -1 -1 0c0,-4 -1,-18 4,-17z"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M19 18c0,1 -1,1 -1,1 0,0 -1,0 -1,0"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M20 19c-1,1 -2,1 -3,1 -1,0 -1,-1 -1,-1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M19 21c-1,1 -3,0 -4,-1 -1,-1 -1,-2 -1,-3"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M18 22c-2,0 -4,-1 -5,-3 0,-1 0,-2 0,-4"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M16 23c-2,-1 -4,-3 -4,-6 0,-1 1,-3 2,-4"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M13 22c-2,-2 -3,-5 -1,-8 1,-2 2,-3 4,-3"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M10 20c-1,-3 0,-7 2,-9 2,-1 4,-2 6,-2"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M9 16c0,-4 3,-7 7,-8 2,-1 5,0 7,1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M9 12c2,-4 6,-6 10,-5 3,0 5,2 6,4"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M11 8c4,-3 9,-3 13,-1 2,2 4,4 5,7"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M15 5c5,-1 10,1 13,5 2,3 2,6 2,9"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M18 16c1,0 2,1 2,2"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M19 15c1,1 2,2 1,3"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M21 15c1,1 1,4 0,5"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M22 16c1,2 0,5 -3,6"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M23 18c0,3 -3,6 -6,5"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M24 20c-2,3 -6,5 -9,3"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M23 23c-3,3 -8,2 -11,-1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M20 26c-5,1 -10,-2 -11,-6"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M16 27c-5,-1 -9,-6 -8,-11"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M12 26c-5,-3 -7,-10 -3,-15"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M8 24c-4,-6 -2,-13 3,-17"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M16 18c0,0 0,0 0,0 0,-1 0,-1 1,-1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M15 17c0,0 0,0 0,-1 0,-1 1,-2 2,-2"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M15 15c0,0 0,0 1,-1 1,-1 3,-1 4,-1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M15 13c0,0 1,0 1,0 2,-1 4,0 5,1"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M17 12c0,0 1,0 1,0 2,0 4,2 5,4"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M19 11c1,0 1,0 1,1 2,1 4,4 4,7"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M23 11c0,0 1,1 1,1 2,3 2,6 1,9"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M26 13c0,1 1,1 1,2 1,4 0,7 -3,9"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M28 16c0,1 0,2 0,2 -1,4 -4,7 -8,8"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M29 20c0,1 -1,2 -1,2 -2,4 -7,6 -11,5"/>  <path fill="none" stroke="' + color + '" stroke-width="0.800082" d="M27 25c-1,1 -1,1 -2,2 -4,3 -9,3 -14,0"/> </g></svg>';
	};

	Poem.prototype.toBag = function () {
		var div = '<div data-poem="' + this.page + '"data-descr="poem" id="' + itemsInGame + '" class="poem"><div style="background: none">' + this.svg() + '</div></div>';
		sound("paper");
		$('.inventory').append(div);
		itemsInGame++;
	};

	// Currently active poems

	// variable1 and variable2 for saved game

	var activePoemsNumber = 0;
	var performed = {};

	setInterval(function () {
		$.each(performed, function (index, value) {
			value.last();
		});
	}, 1000);

	function activePoem(short, maxtime, time) {
		this.short = short;
		this.maxtime = maxtime;
		this.time = time;

		this.last = function () {
			if (this.time > 0) {
				this.time--;
				var thePoem = $('.poem-slot .' + this.short);
				thePoem.find('p span').text(timeLeftShort(this.time));
				thePoem.find('.line').width(this.time / this.maxtime * 105 + 35 + "px");
			} else {
				this.complete();
			}
		};

		this.complete = function () {
			// remove from the tray
			// ...
			poemCompleteEffect(this.short);
			delete performed[this.short];
			var that = this;
			$('.poem-slot .' + this.short).animate({
				height: "0px",
				opacity: '0'
			}, 200, "swing", function () {
				$('.poem-slot .' + that.short).remove();
				// performed[that.short] = 0;
				activePoemsNumber--;
				// delete currentPoems[short]
				Hero.refresh();
				// as well as mercenaries - todo
			});
		};
	}

	// --------------------------
	// Start or abort poem
	$('.inventory').on("mousedown", ".poem", function (e) {
		var poemPage = $(this).attr('data-poem');
		if (e.which !== 3) {
			if (readPoem(poemPage) !== false) {
				$(this).remove();
				hideInfo();
			}
		} else {
			$(this).remove();
			sound('tear');
			hideInfo();
		}
	});

	function readPoem(page, time) {
		if (isNaN(page)) {
			page = pageByShortTitle(page);
		}
		var short = book[page].short;
		var maxtime = book[page].time;

		if (maxtime != 0) {
			if (activePoemsNumber === 3 && notPerform(short)) {
				fastState('Możesz odczytywać tylko trzy poematy jednocześnie.');
				return false;
			} else {
				sound('poem');
				hideInfo();
				statistics.usedPoems++;
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
					statistics.favouritePoemsArray[page]++;
				}

				//What if its already used?
				if (ifPerform(short)) {
					performed[short].time = time + 1;
					performed[short].last();
					// Not already used 
				} else {
					var firstColor = book[page].color;
					var backgroundColor = colorChanger(firstColor, 3);
					var gradient = "background: " + backgroundColor + "; background: -webkit-radial-gradient(" + backgroundColor + ", " + firstColor + "); background: -o-radial-gradient(" + backgroundColor + ", " + firstColor + "); background: -moz-radial-gradient(" + backgroundColor + ", " + firstColor + "); background: radial-gradient(" + backgroundColor + ", " + firstColor + ")";
					var orb = "<div style='" + gradient + ";' class='orb'></div>";
					var timeLeftInfo = "<p><span>" + timeLeftShort(time) + "</span></p>";
					var line = "<div style='" + gradient + ";' class='line'>" + orb + timeLeftInfo + orb + "</div>";

					var div = "<div" + endable + " data-poem='" + page + "' data-descr='poem' class='" + short + "'>" + line + "</div>";
					$('.poem-slot').append(div);
					performed[short] = new activePoem(short, maxtime, time);
					poemStartEffect(short);
					activePoemsNumber++;
				}
			}
		} else {
			statistics.usedPoems++;
			sound('poem');
			hideInfo();
			poemStartEffect(short);
			statistics.favouritePoemsArray[page]++;
		}
		// remove from poemsInBag
		Hero.refresh();
	}

	// allias
	var read = readPoem;

	// 
	$('.poem-slot').on("mousedown", "> div", function (e) {
		if (e.which === 3) {
			if ($(this).attr("data-unendable") === undefined) {
				var whichPoem = $(this).attr("class");
				if (abort(whichPoem)) {
					hideInfo();
				}
			} else {
				fastState('Nie można przerwać tego poematu.');
			}
		}
	});

	function abort(poem) {
		if (ifPerform(poem)) {
			performed[poem].complete();
			sound('tear');
			return true;
		} else {
			return false;
		}
	}

	// ---------------------
	// Supporting functions

	function timeLeft(time) {
		if (time > 180) {
			return Math.floor(time / 60) + " min";
		} else {
			return time + " s";
		}
	}

	function timeLeftShort(time) {
		if (time > 180) {
			return Math.floor(time / 60) + "'";
		} else {
			return time + '"';
		}
	}

	function ifPerform(a) {
		if (typeof performed[a] !== 'undefined') {
			return 1;
		} else {
			return 0;
		}
	}
	function notPerform(a) {
		if (typeof performed[a] !== 'undefined') {
			return 0;
		} else {
			return 1;
		}
	}

	function colorChanger(hexcolor, modificator) {
		var modificator = modificator || 1;
		var returnedColor = '#';
		hexcolor = hexcolor.split("").splice(1);
		for (var i = 0; i < 6; i++) {
			hexcolor[i] = parseInt(hexcolor[i], 16);
			hexcolor[i] += modificator;
			if (hexcolor[i] > 15) {
				hexcolor[i] = 15;
			} else if (hexcolor[i] < 0) {
				hexcolor[i] = 0;
			}
			hexcolor[i] = hexcolor[i].toString(16);
			returnedColor += hexcolor[i];
		}
		return returnedColor;
	}

	colorChanger(book[5].color);
	// 08. SUPPORTING FUNCTIONS
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------


	function spacing(txt) {
		var arr = txt.toString().split("");
		for (var l = arr.length - 4; l >= 0; l -= 3) {
			arr[l] += " ";
		}
		return arr.join("");
	}

	function cash(howMuch) {
		obols += howMuch;
		if (howMuch > 0) {
			var increasingOrDecreasing = "increasing";
		} else {
			var increasingOrDecreasing = "decreasing";
		}

		$('.ownedObols p').text(spacing(Math.floor(obols))).addClass(increasingOrDecreasing);
		setTimeout(function () {
			$('.ownedObols p').removeClass(increasingOrDecreasing);
		}, 100);

		sound("coin");
		update('obols', obols);
	}

	function silentCash(howMuch) {
		obols += howMuch;
		$('.ownedObols p').text(spacing(Math.floor(obols)));
		update('obols', obols);
	}

	// --------------------------------
	// Volume options

	var mute = false;

	if ($.cookie('sounds') === 'off') {
		$("#volumeContainer").addClass("mute");
		mute = true;
	}

	function sound(snd) {
		if (!mute) {
			var theSound = document.getElementById(snd);
			theSound.currentTime = 0;
			theSound.play();
		}
	}

	function silent(functionName, parameter) {
		var defaultMuteSetting = mute;
		mute = true;
		functionName(parameter);
		mute = defaultMuteSetting;
	}

	$('#volumeContainer').click(switchSounds);

	function switchSounds() {
		$("#volumeContainer").toggleClass("mute");
		mute = !mute;
		if (mute) {
			fastState("Dźwięk wyłączony.");
			$.cookie('sounds', 'off');
		} else {
			fastState('Dźwięk włączony.');
			$.cookie('sounds', 'on');
		}
	}

	// ----------------------------


	function losuj(a, b) {
		return Math.floor(Math.random() * (b - a + 1) + a);
	};

	function getTime() {
		var now = new Date();
		if (now.getMinutes() < 10) {
			return now.getHours() + ":0" + now.getMinutes();
		} else {
			return now.getHours() + ":" + now.getMinutes();
		}
	}

	Array.prototype.shuffle = function () {
		var j, x, i;
		for (i = this.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = this[i - 1];
			this[i - 1] = this[j];
			this[j] = x;
		}
	};

	// Block context menu
	var $ctrl = false;
	var $key = 17,
	    $c = 67,
	    $v = 86,
	    $alt = 18;
	$(document).bind("contextmenu", function (e) {
		return false;
	});
	$(document).keydown(function (e) {
		if (e.keyCode == $key) {
			$ctrl = true;
		}
	}).keyup(function (e) {
		if (e.keyCode == $key) {
			$ctrl = false;
		}
	});
	$(document).keydown(function (e) {
		if (e.keyCode == $alt) {
			$ctrl = false;
		}
		//
	});
	$(document).keydown(function (e) {
		if ($ctrl && (e.keyCode == $v || e.keyCode == $c)) {
			return false;
		}
	});

	// 09. DEVELOPER MODE
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------

	var developerMode = 0;
	var dev = 0;

	$('h3').click(function () {
		dev--;
		console.log(dev);
		if (dev >= 6) {
			developerMode = true;
			fastState('Tryb developera aktywny.');
		}
	});
	$('#health').click(function () {
		console.log(dev);
		dev *= -1;
	});

	if (developerMode) {
		var plz = function plz(poem, howMany) {
			var howMany = howMany || 1;
			for (var i = 0; i < howMany; i++) {
				book[bysh(poem)].toBag();
			}
			return bysh(poem);
		};

		var plzRange = function plzRange(poemFrom, poemTo) {
			for (var i = poemFrom; i < poemTo; i++) {
				book[i].toBag();
			}
		};

		var printAvailablePoemsRaport = function printAvailablePoemsRaport(art) {
			var art = art || Hero.artism;
			art = availableByArtism(art);
			var printedArray = [];
			for (var i = 1; i < art; i++) {
				if (i <= page) {
					printedArray.push(book[i].title);
				} else {
					printedArray.push(undefined);
				}
			}
			return printedArray;
		};

		var availableAt = function availableAt(poemName) {
			var poemNr = bysh(poemName);
			for (var i = 1; i < 100; i++) {
				if (availableByArtism(i) >= poemNr) return i;
			}
		};

		var lvl = function lvl(lvl) {
			var lvl = lvl - level;
			for (var i = 0; i < lvl; i++) {
				silent(fastLevelUp);
			}
		};

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

		for (var s = 1; s < startAtLevel; s++) {
			silent(fastLevelUp);
		}

		// Firing mercenaries
		$('body').on("mousedown", ".mercenary", function (e) {
			if (e.which === 3) {
				var id = $(this).attr("id").substr(4);
				merc[id].fire();
			}
		});
	}

	// developer's keys
	$(document).keydown(function (e) {
		if (developerMode) {
			switch (e.which - 48) {
				case 1:
					// level up
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
	});

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

	// 12. RESUME
	// --------------------------------------------------------------------------------
	// --------------------------------------------------------------------------------


	function addAshesToBag(startingLevel) {
		var paragraph = '<p>' + romanize(startingLevel) + '</p>';
		var div = '<div id="ashes" class="ashesOfMemory" data-descr="ashes"><div></div>' + paragraph + '</div>';
		$('.inventory').prepend(div);
	}

	function breakAshes() {
		sound('crush');
		$('.inventory .ashesOfMemory').fadeOut('fast', function () {
			$(this).remove();
		});
	}

	$('body').on("mousedown", "#ashes", function (e) {
		if (e.which === 3) {
			breakAshes();
			removeCookies();
			fastState('Popioły uleciały z wiatrem...');
		} else {
			useAshes();
		}
		hideInfo();
		$(this).removeAttr('id');
		$('.inventory .ashesOfMemory').fadeOut('fast', function () {
			$(this).remove();
		});
	});

	function useAshes() {

		$('#loader-wrapper').fadeIn();

		var newObols = newDamage = newStats = newMercenaries = newDeads = false;

		if ($.cookie('obols')) newObols = Number($.cookie('obols'));
		if ($.cookie("damage")) newDamage = Number($.cookie("damage"));
		if ($.cookie('mercenaries')) newMercenaries = $.cookie('mercenaries').split(",");
		var newStatistics = $.cookie('statistics');
		if ($.cookie('deadsArray')) newDeads = $.cookie('deadsArray').split(",");

		if ($.cookie('maxhealth')) {
			newStats = 1;
			var newmaxhealth = Number($.cookie('maxhealth'));
			var newinnattack = Number($.cookie('attack'));
			var newinndefense = Number($.cookie('defense'));
			var newinnartism = Number($.cookie('artism'));
			var newinnmagicAttack = Number($.cookie('magicAttack'));
		}

		itms = {};
		if ($.cookie('Heroweapon')) {
			var tmp = JSON.parse($.cookie('Heroweapon'));
			itms['0'] = new Item(tmp.type, tmp.subtype, tmp.name, tmp.power, tmp.power2, tmp.price);
			itms['0'].id = "0";
			itms['0'].takeOn();
		}

		if ($.cookie('Heroarmor')) {
			var tmp = JSON.parse($.cookie('Heroarmor'));
			itms['1'] = new Item(tmp.type, tmp.subtype, tmp.name, tmp.power, tmp.power2, tmp.price);
			itms['1'].id = "1";
			itms['1'].takeOn();
		}

		if ($.cookie('Heropen')) {
			var tmp = JSON.parse($.cookie('Heropen'));
			itms['2'] = new Item(tmp.type, tmp.subtype, tmp.name, tmp.power, tmp.power2, tmp.price);
			itms['2'].id = "2";
			itms['2'].takeOn();
		}

		var startingLevel = $.cookie('level');
		blockStates = true;
		while (level < startingLevel - 1) {
			silent(fastLevelUp);
		}

		$('.inventory').html('');
		inkwell = [];
		Hero.potions = [0, 0, 0, 0];

		if ($.cookie("potions")) {

			var potionsToAdd = $.cookie('potions').split(",");

			for (var v = 0; v < 4; v++) {
				var howManyPotionsOfThisType = potionsToAdd[v];
				for (var j = 0; j < howManyPotionsOfThisType; j++) {
					findPotion(v + 1);
				}
			}
		}

		if (newMercenaries) {
			for (var v = 0; v < 9; v++) {
				var howManyMercenariesOfThisType = newMercenaries[v];
				if (howManyMercenariesOfThisType > -1) {
					merc[v].appear();
				}
				for (var j = 0; j < howManyMercenariesOfThisType; j++) {
					merc[v].hire();
				}
			}
		}

		if (level === startingLevel - 1) {
			blockStates = false;
			fastLevelUp();
		}

		if (newStats) {
			Hero.maxhealth = newmaxhealth;
			Hero.inn.attack = newinnattack;
			Hero.inn.defense = newinndefense;
			Hero.inn.artism = newinnartism;
			Hero.inn.magicAttack = newinnmagicAttack;
		}

		Enemy.damaged(newDamage, "Hero");
		obols = 0;
		silentCash(newObols);

		$('.onHero .slot').html("");
		Hero.weapon = Hero.armor = Hero.pen = noItem;

		for (var k = 0; k < 3; k++) {
			if (itms[k]) {
				itms[k].takeOn();
			}
		}

		itemsInGame = 3;

		statistics = JSON.parse(newStatistics);
		if (newDeads) deadsArray = newDeads;

		$('#loader-wrapper').fadeOut();
		Hero.health = Number($.cookie('health'));
		Hero.refresh();
		Hero.heal(0);
	}
});