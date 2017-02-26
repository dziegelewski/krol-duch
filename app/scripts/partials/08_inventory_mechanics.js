// 08. INVENTORY MECHANICS
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var itms = {};  

function Item (type,subtype,name,power,power2,price) {
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
		this.magicAttack = power2
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
		function chooseBackground (subtype) {
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
				additionalBackgroundOffset = -385
				return -175;
				break;
				default:
				additionalBackgroundOffset = -770
				return 0;
				
			}
		}
		var pargraphsToInsert = "<p>" + this.power + "</p>";
		if (this.power2) {
			pargraphsToInsert += "<p>" + this.power2 + "</p>";
		}
		return '<div data-descr="item" id="'+ this.id +'" class="item ' + this.type + ' ' + (this.subtype || "") + '"><div style="background-position: ' + chooseBackground(this.subtype) + 'px' + " " + (-55 * this.name + additionalBackgroundOffset) +'px"></div>' + pargraphsToInsert + '</div>';

	}

	this.toBag = function () {
		sound("swap");
		$('.inventory').append(this.div())
	}


	this.takeOff = function (notCount, ignorePack) {
		if (pack()<maxpack || ignorePack) {
			sound("swap");
			$('#' + this.id).remove();
			Hero[this.type] = noItem;
			$.removeCookie('Hero' +this.type)
			this.toBag();
			if (!notCount) {
				Hero.refresh();
			}
		} else {
			fastState("Brak miejsca w inwentarzu.")
		}
	}

	this.takeOn = function () {
		sound("swap");
		this.slideDown();
		if (Hero[this.type] != noItem) {
			Hero[this.type].takeOff(true, true);
		}
		$('.slot.' + this.type).append(this.div())
		Hero[this.type] = this;
		$.cookie('Hero' + this.type, JSON.stringify(itms[this.id])) 
		Hero.refresh();


	}

	this.sell = function (multipler) {
		var icon =  $('#' + this.id)
		
		this.slideDown();
		if (multipler) {
			this.price *= multipler;
		}
		cash(this.price * (ifPerform("nerwy") +1));
		sound("coin");
		if (Hero[this.type] === this) {
			Hero[this.type] = noItem;
			$.removeCookie('Hero' +this.type)
		}
		setTimeout(function () {
			delete itms[this.id];
		}, 100);

		if (ifPerform('swieta_grota') && !losuj(0,45)) {
			sound('treasure')
			bothState("Znalazłeś jaskinię pełną cennych przedmiotów.");
			abort("swieta_grota");
			var cave = 0;
			var theWealthOfTheCave = function () {
				cave ++;
				if (cave < 80) {
					findItem(undefined, 4);
					if (pack() < maxpack) {
						setTimeout(theWealthOfTheCave, 40)
					}
				}
			}
			theWealthOfTheCave();
		}
	}

	this.slideDown = function () {
		var icon = $('#' + this.id);
		icon.fadeOut(20, function () {
		icon.replaceWith('<div class="placeholder"></div>');
		icon = $('.placeholder')
		icon.animate({width: "0px"},200, function() {
			icon.remove()
			});
		})
	}

	this.provideInfo = function () {
		header.text(this.title);
		var description;
		var power = spacing(this.power);
		var power2 = spacing(this.power2);

		switch(this.subtype) {
			case "w_regular":
			description = "Oręż zapewnia ci atak " + power + ".";
			break;
			case "w_half":
			description = "Oręż zapewnia ci atak " + power + " oraz premię do obrony " + power2 +".";
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
		$('#sell span').text(spacing(this.price * (ifPerform("nerwy") +1)));
	}

}
Item.prototype = noItem;
// end of Item constructor



// --------------------------------------------------------------------
// --------------------------------------------------------------------
// Finding items / vein


function seekingForItems () {

	// Treasure
	if (ifPerform("zlota_czaszka") && !losuj(0,2500)) {
		sound("treasure")
		bothState("Znalazłeś skarb – 100 tys. oboli.");
		abort("zlota_czaszka");
		cash(100000);
		}

	// chances to find item/potion/poem
	var seek = losuj(0,7000)
	if (seek <= 400) {
		findItem();
	} else if (seek <= 500 + Hero.herbalism) {
		findPotion();
	} else if ((seek >= 1000 && seek <= 1030 + (ifPerform('fantazy') * 120) + (ifPerform('znad_wod') * 60)) && Hero.artism) {
		vein();
	}
}

// _____________________________________________________________-
// I. Finding wearable item

function findItem (itemSubtype, boost, itemName, noMiss) {
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
		statistics.foundedItems ++;
		var random = losuj(1,20);
		if (noMiss) {
			random = Math.abs(random -10)
		}
		if (random <= 5) {
			var random = losuj(1,10+(ifPerform('bajka') *2))
			if (random < 7) {
				itemSubtype = "w_regular";

			} else if (random < 10) {
				itemSubtype = "w_half";

			} else {
				var random = losuj(1,10)
				if (random < 10) {
					itemSubtype = "w_magick";

				} else if (level >4) {
					itemSubtype = "w_music";

				} else {
					return false;
				}
			}
						
		} else if (random <= 9) {
			var random = losuj(1,15)
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
			statistics.foundedItems --;
			return false
			


		}
	}
	return createNewItem(itemSubtype, itemName);
	

	function createNewItem(itemSubtype, itemName) {
		switch(itemSubtype.substr(0,1)) {
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
			boost = 1 + boost/10;
		}

		if (ifPerform('radosc_w_bolesci') && Hero.health < Hero.maxhealth/3) {
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
		var itemPrice = (itemPower * (1 + itemPower * 0.01 )) + (itemPower * 4);

		

		switch(itemSubtype) {
			case "w_regular":
			break;

			case "w_half":
			itemName = Math.floor(itemName * 0.75)
			if (losuj(0,1)) itemName++;
			if (itemName % 2) {
				// its a bow
				itemPower2 = Math.ceil(itemPower*0.3)
				itemPower = Math.ceil(itemPower*0.6)

			} else {
				// its a spear
				itemPower2 = Math.ceil(itemPower*0.45)
				itemPower = Math.ceil(itemPower*0.45);
			}
			break;

			case "w_music":
			itemPrice = (itemPower * itemPower + 2)/10 /2;
			itemName /= 3;
			itemPower2 = level/2 * boost;
			itemPower = 0;
			break;

			case "w_magick":
			itemPrice *= 1.5;
			itemName *= 0.6;
			itemPower2 = itemPower - (itemPower % 10);
			if (!itemPower2) {
				itemPower2 = 10;
			}
			itemPower = itemPower/3 +1
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
			itemPower = losuj(3,8)/10 * (level -2);
			itemName = Math.floor((itemPower)/3)
			if (!losuj (0,4) && itemName) {
				itemName --;
			}
			itemPrice = (itemPower *10) * (itemPower *2) * 5
			break;
			}
		
		if (itemName >= itm[itemSubtype].length) {
			itemName = itm[itemSubtype].length - 1;
		}
		itemName = Math.floor(itemName)

		itms[itemsInGame] = new Item(itemType, itemSubtype, itemName, Math.ceil(itemPower), Math.ceil(itemPower2), Math.ceil(itemPrice))
		itms[itemsInGame].toBag();

		var itemNameB = itm2[itemSubtype][itemName]
		state("Znalazłeś " + itemNameB  + ".");
		firstItem(itemType)

		// autoseller
		if (ifPerform("kupiec_wenecki")) {
			var itemToSell = itemsInGame;
			setTimeout(function() {
				itms[itemToSell].sell(3);
			}, 100);
			bothState('Kupiec płaci sowicie za ten przedmiot.')
		}

		itemsInGame ++;
		return itemNameB;
	}

	function determineItemPower () {
		var itemPower = 0
		var levelMultipler = 2 + Math.floor(level/5)
		for (var i=0; i<level; i++) {
			itemPower += losuj(level-3,level*levelMultipler +1) +3;
		}

		if (losuj(1,4) === 1) {
			itemPower *= extraMultipler()
			};

		function extraMultipler () {
			var mnoznik = 2;
			var wynik = 1
			while (mnoznik >0) {
					if (losuj(1,mnoznik) === 1) {
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

	function determineItemName (itemPower, itemSubtype) {

			var comparator = Math.floor(itemPower/18)
			// var tresholds = [0,2,4,7,11,16,21,28,36,45,55,66,78,91,105,120,150,200,250,380,480,620,800,1000];
			var tresholds = [0,2,4,7,11,16,21,28,36,45,55,66,78,98,120,150,200,250,380,480,620,800,1000, 1200];
			// var tresholds = [0,2,5,12,21,36,55,78,105,140,180,230,310,400,500,620,750,890,1100,1220,1500];

			for (var itemName=0, k=tresholds.length; itemName<k; k++) {
				if (comparator > tresholds[itemName]) {
					itemName++;
				} else {
					break;
				}
			}

		// Randomize every name a little bit more
		switch(losuj(0,6)) {
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

function firstItem (subtype) {
	if (subtype === 'weapon') {
		fastState('Zdobyłeś swój pierwszy oręż.')
		state('Zdobyłeś swój pierwszy oręż. Uzbrój się w niego, by twoja krucjata stała się skuteczniejsza.', true)
	} else if (subtype === 'armor' ) {
		fastState('Zdobyłeś swój pierwszy pancerz.')
		state('Zdobyłeś swój pierwszy pancerz. Włóż go, by lepiej uchronić się od wrażych ciosów.', true)
	}
	
	$('.heroContainer').fadeTo('slow', 1)
	firstItem = function () {}
}



// _____________________________________________________________-
// II. Finding potion

function findPotion(ptn) {

	if (ifPerform('mohort')) {
		findItem(undefined,undefined,undefined,true)
		return false;
	}

	// 1. Choose potion if its not defined
	if (ptn === undefined) {
		// test whether potion was succesfully finded or not
		if (losuj(1,10) < 1) {
			return false
		}
		// in case of success - choose a potion
		var yourPotion = [1,1,1,1,1,1,1,1,1]
		var maxhealth = Hero.maxhealth
		if (maxhealth > 150000) {
			yourPotion = [3,3,4,4,4,4,4,4,4]
		} else if (maxhealth > 100000) {
			yourPotion = [3,3,3,4,4,4,4,4,4]
		} else if (maxhealth > 90000) {
			yourPotion = [3,3,3,3,4,4,4,4,4]
		} else if (maxhealth > 75000) {
			yourPotion = [3,3,3,3,3,4,4,4,4]
		} else if (maxhealth > 60000) {
			yourPotion = [3,3,3,3,3,3,4,4,4]
		} else if (maxhealth > 50000) {
			yourPotion = [3,3,3,3,3,3,3,4,4]
		} else if (maxhealth > 40000) {
			yourPotion = [3,3,3,3,3,3,3,3,4]
		} else if (maxhealth > 25000) {
			yourPotion = [2,2,3,3,3,3,3,3,3]
		} else if (maxhealth > 15000) {
			yourPotion = [2,2,2,2,3,3,3,3,3]
		} else if (maxhealth > 10000) {
			yourPotion = [1,2,2,2,2,2,3,3,3]
		} else if (maxhealth > 5000) {
			yourPotion = [1,1,1,2,2,2,2,2,3]
		} else if (maxhealth > 3000) {
			yourPotion = [1,1,1,1,2,2,2,2,2]
		} else if (maxhealth > 1500) {
			yourPotion = [1,1,1,1,1,1,2,2,2]
		} else if (maxhealth > 1000) {
			yourPotion = [1,1,1,1,1,1,1,2,2]
		}

		ptn = yourPotion[losuj(0,8)]
	}

	// Poems' special effects
	ptn += ifPerform("to_lubie")
	if (ptn > 4) {
		ptn = 4
	}
	// ------

	// 2. Add specific potion
	var existingPotion = $('.potion[data-potion-type="' + ptn + '"][data-potion-amount="1"]').first();
	if (!(existingPotion.length)) {
		existingPotion = $('.potion[data-potion-type="' + ptn + '"][data-potion-amount="2"]').first()
	} else if (!(existingPotion.length)) {
		delete window.existingPotion
	}
	if (existingPotion.length) {
		existingPotion.attr("data-potion-amount", Number(existingPotion.attr("data-potion-amount"))+1);
		gotIt()
		
	} else {
		if (pack() < maxpack) {
			function findPlaceToAppendPotion() {
				for (var i=ptn; i>-2; i--) {
					if ($('[data-potion-type="' + i + '"]').length) {
						return $('[data-potion-type="' + i + '"]').last()
					}
				}
			}

			var appendedPotion = '<div data-descr="potion" class="potion" data-potion-type="'+ ptn +'" data-potion-amount="1"> <div></div><p></p><p></p></div>'
			var whereToAppend = findPlaceToAppendPotion();
			if (whereToAppend) {
				whereToAppend.after(appendedPotion)
			} else {
				$('.inventory').prepend(appendedPotion);
			}
			gotIt()
		}
	}

	function gotIt () {
		Hero.potions[ptn-1] ++;
		update('potions')
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
})


// 2.Potions


$('.inventory').on("mousedown", ".potion", function (e) {
	if ((e.which === 1 && Hero.health < Hero.maxhealth) || e.which === 3) {
		var potionAmount = $(this).attr("data-potion-amount");
		var potionType = Number($(this).attr("data-potion-type"));
		Hero.potions[potionType-1] --;
		update('potions')
		$(this).attr("data-potion-amount", potionAmount -1)
		if (potionAmount -1 <= 0) {
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
			if (ifPerform("zmija") === losuj(1,3)) {
				fastState("Wywar nie zadziałał.")
			} else {
				Hero.heal(potionHeal)
			}
			sound("drink");
			statistics.drinkedPotions ++;
			

			if (ifPerform("snuc_milosc")) {
				Hero.maxhealth *= 1.015;
				Hero.heal(0)
			}

		// break	
		} else {
			sound("crush");
		}
	} else if (e.which === 1 && Hero.health >= Hero.maxhealth) {
		fastState("Jesteś już w pełni zdrowy.")
	}
	
})


function slideDown (e) {
	$(e).fadeOut(100, function () {
		$(e).replaceWith('<div class="placeholder"></div>');
		$('.placeholder').animate({width: "0px"},200, function() {this.remove()});
		

	})
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
for (var i=0, favLen = allWeaponsArray.length; i<favLen; i++) {
	statistics.favouriteWeaponsArray[allWeaponsArray[i]] = 0;
}
function favouriteWeaponIncreaser () {
		statistics.favouriteWeaponsArray[Hero.weapon.title] ++;
};