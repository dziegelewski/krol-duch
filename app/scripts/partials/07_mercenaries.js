// 05. MERCENARIES
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var mercenariesAmountArray = [-1,-1,-1,-1,-1,-1,-1,-1,-1]

function Mercenary(id,name,namePlur,price,attack,maxhealth) {
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
		this.amount ++;
		mercenariesAmountArray[this.id] ++;
		update('mercenaries')
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
					cost *= 1.3
					 cost -=  cost % 10;
				} else {
					 cost *= 1.15;
					 cost -=  cost % 10;
				}
			}
			this.currentPrice = cost;
			this.price.push(cost);
		}
		this.refresh();
		Hero.refresh();
		$('#merc' + this.id + ' .merc-image').removeClass('unhired')
		allMercenariesNumber ++;

		// special cases
		if (this.id === 8) {
			addKey();
		} else if (this.id === 3 && ifPerform("lilije")) {
			findPotion(2);
		}

		if (ifPerform('duma') && !duplicate) {
			if (!losuj(0,4) & this.amount > 1) {
				this.hire('duplicate')
				bothState("Z melancholią dołącza do ciebie " + this.name + '.')
			}
		}
	}

	this.heal = function () {
		this.health = this.maxhealth;
		this.refresh()
	}

	this.fire = function () {
		if (this.amount === 0) {
			return false;
		}
		mercenariesAmountArray[this.id] --;
		update('mercenaries')
		this.amount --;
		this.currentPrice = this.price[this.amount];
		this.health = this.maxhealth
		this.refresh();
		Hero.refresh();
		deadsArray.unshift(this.id)
		update('deadsArray')
		state("Twój " + this.name + " poległ.")
		allMercenariesNumber --;
		if (this.amount === 0) {
			$('#merc' + this.id + ' .merc-image').addClass('unhired')
		}

		// Najcięższa łza
		if (ifPerform("najciezsza_lza")) {
			fastState('Martwy ' + this.name + ' zostawia po sobie leczniczy wywar.')
			findPotion();
		}

		// Wieniec przeklętych
		if (ifPerform("wieniec_przekletych")) {
			var toGet = godzinaBoost(Hero.artism)
			Hero.inn.attack += toGet ;
			Hero.refresh();
			bothState('Twój atak trwale zwiększył się o ' + toGet + '.')
		}

		// Genezis z ducha
		if (ifPerform('genezis_z_ducha')) {
			var toReincarnate = merc[this.id + 1];
			if (toReincarnate === merc[9]) {
				toReincarnate = merc[0]
			}
			toReincarnate.hire();
			state ('... i odrodził się jako ' + toReincarnate.name + '.')
		}

		if (ifPerform('mysia_wieza') && this.id === 0 && this.amount === 0) {
			abort('mysia_wieza')
		}
	}


	this.strike = function () {
		if (this.amount === 0 || this.attack === 0) {
			return false;
		} else {
			$('#merc' + this.id + ' .merc-image').addClass('attack')
			setTimeout(function () {
			$('.merc-image').removeClass('attack')
			}, 200)
			var amount = this.amount;
			var attack = this.attack;
			this.hurt()
			var attackPower = amount * attack

			// Oblężenie
			if (ifPerform('oblezenie') && this.id === 2) {
				this.fire();
				this.health = this.maxhealth;
				findItem(undefined, undefined, undefined, true);
				if (!this.amount) {
					abort('oblezenie')
				}
			}
			// -----

			// Śpiew z mogiły
			if (ifPerform('spiew_z_mogily') && this.health === this.maxhealth) {
				attackPower += this.attack * 29;
				fastState(this.name + ' mści się zza grobu.')
			}
			// -----
			
			return attackPower;
		}
	}

	this.hurt = function () {
		if (ifPerform('anhelli')) return
		var hurt = 3 * (1 - Hero.medicine/100);
		this.health -= hurt;
		this.showHealth();
		if (this.health <= 0) {
				this.fire()
			}
	}

	this.showHealth = function () {
		if (activeSelection == this.id) {
			if (this.amount) {
				info3.text("Witalność: " + Math.floor(this.health) + "/" + this.maxhealth)
			} else {
				info3.text("Witalność: " + this.maxhealth)
			}
		}
	}

	this.infoStrike = function () {
		return this.amount * this.attack;
	}

	this.provideInfo = function () {
		activeSelection = this.id;
		var mercDescription, mercSpecialDescription;

		switch(this.name) {
			case "hycel":
			mercDescription = "Nędzny pomagier."
			mercSpecialDescription = "";
			break;
			case "rój myszy":
			mercDescription = "Gryzą, póki nie zdechną.."
			mercSpecialDescription = "Silniejsze w grupie. Ranią także ciebie.";
			break;
			case "pajęczarz":
			mercDescription = "Zna ciernistą puszczę i jej sekrety."
			mercSpecialDescription = "Poprawia zielarstwo.";
			break;
			case "siepacz":
			mercDescription = "Zdolny do wszelkich okrucieństw, kwestią jest tylko cena."
			mercSpecialDescription = "";
			break;
			case "upiór":
			mercDescription = "Ani żywy, ani martwy."
			mercSpecialDescription = "Poprawia szybkość ataku.";
			break;
			case "wampir":
			mercDescription = 'Nocny łowca';
			mercSpecialDescription ="Wysysa życie i daje je tobie. Poprawia szybkość ataku.";
			break;
			case "bojar":
			mercDescription = "Niedźwiedź na polu bitwy."
			mercSpecialDescription = "";
			break;
			case "harfiarz":
			mercDescription = "Nie widzi dobra i zła, a jedynie sztukę."
			mercSpecialDescription = "Poprawia Artyzm.";
			break;
			case "kolos":
			mercDescription = "Wyłoniony z morza półbóg."
			mercSpecialDescription = "";
			break;
			case "trojanin":
			mercDescription = "Toczy wieczną bitwę w Tartarze."
			mercSpecialDescription = "Szansa na cios krytyczny.";
			break;
			case 'hekatoncheir':
			mercDescription = 'Przybysz z najgłębszych czeluści Tartaru.'
			mercSpecialDescription = "Szansa na cios krytyczny i na krytyczne chybienie. Poprawia szybkość ataku."
			break;
			case "zeitgeist":
			mercDescription = "Byt, który stwarza i obala mocarstwa."
			mercSpecialDescription = "";
			break;
		}

		header.text(this.name);
		info.text(mercDescription);
		info2.text(mercSpecialDescription);
		

		var allAttackInfo = sumOfAllMercenariesAttack()
		var thisAttack = this.infoStrike()
		var thisPercentageAttack = (Math.floor(thisAttack/allAttackInfo * 1000))/10
		
		if (isNaN(thisPercentageAttack))  {
			thisPercentageAttack = 0;
		}
		info4.text("Atak sług: " + spacing(allAttackInfo))
		info5.text("W tym " + this.namePlur + ": " + thisAttack + " (" + thisPercentageAttack + "%)")
		this.showHealth();
		}

		this.appear = function () {
			if (this.check === false) {
				mercenariesAmountArray[this.id] ++;
				update('mercenaries')
				this.check = true;
				this.refresh();
				$('#merc' + this.id).fadeIn();
			}
		}


		this.refresh = function () {

			if (ifPerform('mysia_wieza')) {
				merc[0].attack = Math.floor(merc[0].amount * merc[0].amount/10 + 5)
			}

			this.showHealth();
			var place = $('#merc' + this.id);
			place.find('.amount').text(this.amount);
			place.find('.price').text(spacing(Math.floor(this.currentPrice * (1 - Hero.discount/100))));
			place.find('.attack span').text(this.attack);
		}

} // end of Mercenary constructor

var merc = {
0 : new Mercenary(0,"hycel","hycli", 30, 1, 60),
1 : new Mercenary(1,"pajęczarz", "pajęczarzy", 350, 3, 160),
2 : new Mercenary(2,"siepacz", "siepaczy", 2500, 20, 600),
3 : new Mercenary(3,"upiór", "upiorów", 13000, 30, 540),
4 : new Mercenary(4,"bojar", "bojarów", 80000, 200, 2200),
5 : new Mercenary(5,"harfiarz", "harfiarzy", 62500, 0, 3600),
6 : new Mercenary(6,"kolos", "kolosów", 1000000, 2500, 10800),
7 : new Mercenary(7,"trojanin", "trojan", 25000000, 20000, 36000),
8 : new Mercenary(8,"zeitgeist", "zeitgeistów", 100000000, 99999, 360000)
}

// ------------------------
// buying mercenaries

$('.mercenary').click(function () {

	var id = $(this).attr("id").substr(4);
	var price = merc[id].currentPrice * (1 - Hero.discount/100);
	if (obols >= price) {
		merc[id].hire();
		merc[id].provideInfo();
		sound("coin");
		statistics.moneySpent += price;
		cash(-price);
		statistics.mercsHired ++;
	} else {
		fastState("Nie stać cię na opłacenie sługi.")
	}
})

// ------------------------
// attack!

var frequency = 3000
function unitsStrike () {
	if (!Hero.alive) return false;
	if (Hero.critic) chancesForCriticalHit()
	var hit = 0;
	for (var unit in merc) {
		hit += merc[unit].strike();
	}
	hit /= ifPerform("praca") + 1;
	if (hit) {
		statistics.mercsAttacks ++;
	}
	hit += Hero.magicStrike();
	if (hit) {
		Enemy.damaged(hit, "merc");
	}

	if (ifPerform('mysia_wieza') && merc[0].amount) {
		Hero.hurt(merc[0].infoStrike(), 'myszy')
	}

	if (ifPerform('gleboka_noc')) {
		Hero.heal(merc[3].infoStrike())
	}

	// attack frequency
	frequency = 3000 * (1 - Math.floor(Math.sqrt(Hero.acceleration *20))/100)
	setTimeout(unitsStrike, frequency)

	function chancesForCriticalHit () {
		if (losuj(1,10000) <= Hero.critic * 100) {
			if (notPerform('irydion')) {
				var strikingUnit = 'trojanie'
			} else {
				var strikingUnit = 'hekatoncheirowie'
			}
			var message = strikingUnit + ' przeprowadzili druzgocące uderzenie!'
			bothState(message)
			statistics.critisc ++;
			fastLevelUp();
		}

		if (ifPerform('irydion')) {
			if (losuj(0,20000) < merc[7].amount) {
				console.log('yup')
				Hero.hurt(Hero.maxhealth, 'hekatoncheir', true)
			}
		}
	}
}



// --------------------------
// Extra functions for poems etc.


function everybody(whatToDo, argument) {
	for (var i=0; i<9; i++) {
		if (merc[i].amount) {
			merc[i][whatToDo](argument);
			merc[i].refresh();
		}
	}
}


function randomMercenary () {
	var aliveMercenaries = [];
	for (var unit in merc) {
			if (merc[unit].amount) {
				aliveMercenaries.push(unit)
			}
		}
	if (aliveMercenaries.length) {
		return merc[aliveMercenaries[losuj (0, aliveMercenaries.length-1)]]
	} else {
		return false;
	}
}

function strongestMercenary () {
	var strongestOne;
	for (var i=8; i>=0; i--) {
		if (merc[i].amount) {
			strongestOne = merc[i]
			break;
		}
	}
	if (strongestOne) {
		return strongestOne;
	} else {
		return false;
	}
}

function sumOfAllMercenariesAttack () {
	var allAttackInfo = 0;
	for (var unit in merc) {
			allAttackInfo += merc[unit].infoStrike();
		}
	return Math.floor(allAttackInfo);
}