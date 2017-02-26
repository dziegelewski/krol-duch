
// -------------------------------
// -------------------------------
// Poems' special effects


// Magic effects #2
function poemStartEffect (poem) {
	switch (poem) {
		case "pierwiosnek":
		Hero.heal(Hero.maxhealth)
		abort('nokturn')
		fastState('Od razu czujesz się lepiej.')
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
		var kabalas = 1 + Math.floor(godzinaBoost(Hero.artism) / 10)
		if (merc[1].amount < kabalas) {
			kabalas = merc[1].amount;
		}
		while (kabalas) {
			kabalas --;
			merc[1].fire();
			merc[2].hire();
			Hero.defense -= 8;
		}
		break;

		case 'przygrywka':
		var flag = 0;
		if (losuj(1,100) <= merc[5].amount * 5) {
			var newMerc = strongestMercenary();
			flag ++;
			newMerc.hire();
		}
		if (losuj(1,100) <= merc[5].amount) {
			merc[5].hire()
			if (flag) {
				bothState('Przyciągnięci pieśnią harfiarzy, dołączają do ciebie ' + newMerc.name + ' i kolejny harfiarz.')
			} else {
				bothState('Przyciągnięty pieśnią harfiarzy, dołącza do ciebie kolejny harfiarz.')

			}
		} else {
			if (flag) {
				bothState('Przyciągnięty pieśnią harfiarzy, dołącza do ciebie ' + newMerc.name + '.')
			} else {
				fastState('Nikt nie usłyszał pieśni.')
			}
		}


		break;

		case "ironia":
		Hero.maxhealth = Math.floor(Hero.maxhealth * 0.85);
		var toGet = godzinaBoost(Hero.artism) * 5000
		cash(toGet)
		Hero.heal(0)
		fastState('Własną krwią zapłaciłeś za pełny trzos: ' + spacing(toGet) + ' oboli.' );
		break;

		case "zachwycenie":
		vein();
		break;
		
		case "lilla_weneda":
		merc[5].attack += 200;
		break;
		
		case "lucznik":
		var theItem = findItem("w_half", 3);
		fastState("Zdobyłeś " + theItem + '.')
		break;
		
		case "zal_rozrzutnika":
		if (losuj(1,100) < 66) {
			cash(obols)
			fastState('Pieniądze są twoje.')
		} else {
			cash(-obols)
			fastState('Straciłeś majątek...')
		}
		break;

		case 'cztery_rzeczy':
		for (var i=0; i<4; i++) {
			findItem(undefined, undefined, undefined, true)
		}
		break;

		case 'chochlik':
		switch(losuj(1,3)) {
			case 1:
			var theItem = findItem(undefined, 9, undefined, true)

			fastState('Sukces! Zdobyłeś ' + theItem + '.')
			break;
			case 2:
			var randomMerc = randomMercenary()
			if (!randomMerc) {
				fastState('Nic się nie stało.')
			} else {
				randomMerc.fire();
				fastState(randomMerc.name + ' poniósł śmierć.')
			}
			break;
			case 3:
			fastState('Nic się nie stało.')
			break;
		}
		break;

		case 'drzenie':
		Hero.hurt(20000, 'kolos');
		fastState('Kraina zadrżała w posadach.')
		merc[6].hire();
		break;

		case 'jesien':
		var sacrifice = strongestMercenary();
		if (sacrifice) {
			sacrifice.fire();
			fastState(sacrifice.name + ' poniósł śmierć.')
		} 
		Hero.inn.artism ++;
		break;

		case "rozum_i_wiara":
		if (losuj(1,100) <= 5) {
			fastLevelUp();
			fastState("Doznałeś olśnienia.")
		} else {
			fastState('Niczego nie poczułeś.')
		}
		break;

		case "rusalki":
		Hero.inn.artism ++;
		state("Twój Artyzm trwale się zwiększył.")
		break;

		case "runy":
		merc[6].attack -= merc[6].baseAttack;
		break;

		case "grob_agamemnona":
		merc[7].appear();
		newMercState();
		break;

		case 'dziady':
		for (var i=0; i<5; i++) {
			var resurrected = deadsArray.shift();
			if (resurrected != undefined) {
			merc[resurrected].hire();
			update('deadsArray')
			state("Twój " + merc[resurrected].name + " powstał z martwych.")
			fastState("Twoi słudzy powstali z martwych.")
			} else {
				return;
			}
		}
		break;

		case 'oblezenie':
		merc[2].attack = merc[2].baseAttack *2;
		merc[2].refresh();
		break;


		case "meteor":
		fastLevelUp();
		Hero.inn.artism -= 5;
		break;

		case "balladyna":
		var theItem = findItem("w_music", 3);
		fastState("Zdobyłeś " + theItem + '.')
		break;

		case "smierc":
		var sacrifice = randomMercenary();
		if (sacrifice) {
			Enemy.damaged(sacrifice.attack * 300);
			sacrifice.fire();
			if (sacrifice.name === "harfiarz") {
				Hero.inn.artism
			}
			fastState(sacrifice.name + ' spłynął krwią.')
		} else {
			fastState('Nikt nie został poświęcony.')
		}
		break;

		case "przedswit":
		var resurrected = deadsArray.shift();
		if (resurrected != undefined) {
			merc[resurrected].hire();
			bothState("Twój " + merc[resurrected].name + " powstał z martwych.")
			update('deadsArray')
		} else {
			fastState('Nikt nie został ożywiony.')
		}
		break;

		case "karnawal":
		var harpersAmonut = merc[5].amount;
		for (var i=0; i<harpersAmonut; i++) {
			merc[0].hire();
			merc[1].hire();
			merc[2].hire();
			merc[3].hire();
		}
		if (harpersAmonut) {
			bothState('Nowe sługi zasilają twoje szeregi.')
		}
		break;

		case "mysia_wieza":
		merc[0].name = 'rój myszy';
		merc[0].namePlur = 'rojów myszy';
		merc[0].health = 15;
		merc[0].maxhealth = 15;
		merc[0].refresh();
		$('#merc0 .merc-image').css('background-position', '-450px 0')
		break;

		case "irydion":
		merc[7].name = 'hekatoncheir';
		merc[7].namePlur = 'hekatoncheirów';
		merc[7].attack += 15000;
		merc[7].refresh();
		$('#merc7 .merc-image').css('background-position', '-550px 0')
		break;

		case "gleboka_noc":
		merc[3].name = 'wampir';
		merc[3].namePlur = 'wampirów';
		merc[3].attack += 20;
		merc[3].refresh();
		$('#merc3 .merc-image').css('background-position', '-500px 0')
		break;

		case "trzy_struny":
		$.each(performed, function(index, value) {
			var page = pageByShortTitle(value.short);
			readPoem(page);
			statistics.favouritePoemsArray[page] --;
		})
		break;

		case "krol_duch":

		var godsThunder = function () {
			if (level < maxlevel + 10) {
			silent(fastLevelUp)
			setTimeout(godsThunder, 400)
			} else {
				$('.eagleShape').fadeOut(1000)
				Hero.hurt(Hero.maxhealth, "win", true)
			}
		}
		godsThunder()
		break;

		case 'nokturn':
  		$('#health').addClass('nokturn')
  		Hero.nocturnoStream();
  		fastState('Ogarnął cię mroczny szał...')
  		break;

  		case 'anhelli':
		$('.eagle-click').addClass('frozen');
  		break;

		
  		case 'hosanna':
  		everybody('heal')
  		fastState('Uzdrawiająca fala ogarnęła twoje szeregi.')
  		break;

  		case "ojciec_zadzumionych":
  		var victimsArr = []
		var plagueBonus = 0;

		for (var z=0; z<=8; z++) {
			var numOfVictims = Math.ceil(merc[z].amount/2)
			victimsArr.push(numOfVictims)
		}
		for (var z=0; z<=8; z++) {
			var thisTypeVictims = victimsArr[z]
			if (thisTypeVictims) {
				for (var i=0; i<thisTypeVictims; i++) {
					merc[z].fire()
					plagueBonus += merc[z].attack;
				}
			}
		}
		plagueBonus = Math.ceil(plagueBonus/2)
		Hero.inn.magicAttack += plagueBonus;
		if (plagueBonus) bothState ('Mroczna plaga przetrzebiła twoje szeregi...')
	}
}

function poemCompleteEffect (poem) {
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
		$('#merc0 .merc-image').css('background-position', '0px 0')
		break;

		case 'nokturn':
  		$('#health').removeClass('nokturn')
  		break;

  		case "irydion":
		merc[7].name = 'trojanin';
		merc[7].namePlur = 'trojan';
		merc[7].attack -= 15000;
		merc[7].refresh();
		$('#merc7 .merc-image').css('background-position', '-350px 0')
		break;

		case "gleboka_noc":
		merc[3].name = 'upiór';
		merc[3].namePlur = 'upiorów';
		merc[3].attack -= 20;
		merc[3].refresh();
		$('#merc3 .merc-image').css('background-position', '-150px 0')
		break;
	}
}

function godzinaBoost (val) {
	return val + ifPerform('godzina_mysli') * 10;
}


