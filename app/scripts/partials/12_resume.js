// 12. RESUME
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------




function addAshesToBag (startingLevel) {
	var paragraph = '<p>' + romanize(startingLevel) + '</p>'
	var div = '<div id="ashes" class="ashesOfMemory" data-descr="ashes"><div></div>' + paragraph + '</div>'
		$('.inventory').prepend(div)
}


function breakAshes () {
	sound('crush')
	$('.inventory .ashesOfMemory').fadeOut('fast', function () {
	$(this).remove();
	});
}

$('body').on("mousedown", "#ashes", function (e) {
	 if (e.which === 3) {
		breakAshes();
		removeCookies();
		fastState('Popioły uleciały z wiatrem...')
	 } else {
		useAshes();
	 }
	hideInfo();
	$(this).removeAttr('id')
	$('.inventory .ashesOfMemory').fadeOut('fast', function () {
		$(this).remove();
	});
})


function useAshes () {
	
	$('#loader-wrapper').fadeIn();

	var newObols = newDamage = newStats = newMercenaries = newDeads = false;

	if ($.cookie('obols')) newObols = Number($.cookie('obols'))
	if ($.cookie("damage")) newDamage = Number($.cookie("damage"))
	if ($.cookie('mercenaries')) newMercenaries = $.cookie('mercenaries').split(",")
	var newStatistics = $.cookie('statistics')
	if ($.cookie('deadsArray')) newDeads = $.cookie('deadsArray').split(",")
	

	if ($.cookie('maxhealth')) {
		newStats = 1;
		var newmaxhealth = Number($.cookie('maxhealth'));
		var newinnattack = Number($.cookie('attack'));
		var newinndefense = Number($.cookie('defense'));
		var newinnartism = Number($.cookie('artism'));
		var newinnmagicAttack = Number($.cookie('magicAttack'));
	}

	itms = {}
	if ($.cookie('Heroweapon')) {
		var tmp = JSON.parse($.cookie('Heroweapon'))
		itms['0'] = new Item(tmp.type, tmp.subtype, tmp.name, tmp.power, tmp.power2, tmp.price);
		itms['0'].id = "0";
		itms['0'].takeOn()
	}

	if ($.cookie('Heroarmor')) {
		var tmp = JSON.parse($.cookie('Heroarmor'))
		itms['1'] = new Item(tmp.type, tmp.subtype, tmp.name, tmp.power, tmp.power2, tmp.price);
		itms['1'].id = "1";
		itms['1'].takeOn()
	}

	if ($.cookie('Heropen')) {
		var tmp = JSON.parse($.cookie('Heropen'))
		itms['2'] = new Item(tmp.type, tmp.subtype, tmp.name, tmp.power, tmp.power2, tmp.price);
		itms['2'].id = "2";
		itms['2'].takeOn()
	}

	var startingLevel = $.cookie('level')
	blockStates = true;
	while (level < startingLevel -1) {
		silent(fastLevelUp)
	}
	
	$('.inventory').html('')
	inkwell = [];
	Hero.potions = [0,0,0,0]


	
	if ($.cookie("potions")) {

		var potionsToAdd = $.cookie('potions').split(",");

		for (var v=0; v<4; v++) {
			var howManyPotionsOfThisType = potionsToAdd[v]
			for (var j=0; j<howManyPotionsOfThisType; j++) {
				findPotion(v+1);
			}
		}
	}

	if (newMercenaries) {
		for (var v=0; v<9; v++) {
			var howManyMercenariesOfThisType = newMercenaries[v]
				if (howManyMercenariesOfThisType > -1) {
				merc[v].appear()
				}
			for (var j=0; j<howManyMercenariesOfThisType; j++) {
				merc[v].hire();
			}
		}
	}

	if (level === startingLevel -1) {
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

	$('.onHero .slot').html("")
	Hero.weapon = Hero.armor = Hero.pen = noItem;

	for (var k=0; k<3; k++) {
		if (itms[k]) {
			itms[k].takeOn();
		}
	}

	itemsInGame = 3;

	statistics = JSON.parse(newStatistics);
	if (newDeads) deadsArray = newDeads;


	$('#loader-wrapper').fadeOut();
	Hero.health = Number($.cookie('health'))
	Hero.refresh();
	Hero.heal(0)

}

})