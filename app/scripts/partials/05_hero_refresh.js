Hero.refresh = function () {

	earnings = 1/2;

	this.attack = this.inn.attack + this.weapon.attack + this.armor.attack ;
	this.defense = this.inn.defense + this.weapon.defense + this.armor.defense
	this.artism = this.inn.artism + this.weapon.artism + this.pen.artism + merc[5].amount;

	this.magicAttack = this.inn.magicAttack + this.weapon.magicAttack;
	this.acceleration = 0 + Math.floor(merc[3].amount * 3.5);
	this.herbalism = 0 + Math.ceil(merc[1].amount * 1.5);
	this.wealth = 0;
	this.discount = 0;
	this.medicine = 0;
	this.regeneration = 0;
	this.critic = 0 + (merc[7].amount * 0.05) ;

	update('maxhealth', Hero.maxhealth)
	update('attack', Hero.inn.attack)
	update('defense', Hero.inn.defense)
	update('artism', Hero.inn.artism)
	update('magicAttack', Hero.inn.magicAttack)


	// priority 0
	var that = this
	$.each(performed, function(index, value) {
		switch(index) {
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
	})


	//priority 1
	$.each(performed, function(index, value) {
		// Magic effects #1
		switch(index) {

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
			that.attack += allMercenariesNumber *  10;
			that.defense -= allMercenariesNumber * 3;
			break;

			case "baranki_moje":
			that.discount += 10;
			break;

			case 'zelazna_rekawica':
			that.artism += that.pen.artism;
			break;

			case "chmury":
			that.defense += that.weapon.defense * 1.5
			break;

			case "do_matki":
			that.regeneration += 50;
			break;

			case "zbojcy":
			that.attack += merc[2].amount * 10;
			break;

			case "wiatr":
			that.acceleration += that.artism
			break;

			case "niewiadomo_co":
			if (that.weapon.magicAttack > 0) {
				that.attack += this.weapon.attack *3;
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
			that.critic += (merc[7].amount * 0.2)
			that.acceleration += (merc[7].amount * 10)
			break;



			case "tak_mi_boze_dopomoz":
			that.defense += that.artism *5;
			that.attack += that.artism *5;
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
			that.attack += that.defense*5;
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
	})


	// priority 2
	$.each(performed, function(index, value) {
		switch(index) {

			case 'smutno_mi_boze':
			that.magicAttack = Math.floor(that.magicAttack * 1.75)
			earnings *= 0.5;
			break;

			case 'arcymistrz':
			that.magicAttack = Math.floor(that.magicAttack * 2.5)
			that.attack = 0;
			break;

			case 'godzina_mysli':
			that.artism -= 10;
			break;

			case 'nokturn':
			that.attack = Math.floor(that.attack/2);

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
	})




		var specials = [
		'maxhealth',
		"attack",
		"defense",
		"artism",
		"magicAttack",
		"acceleration",
		"herbalism",
		"wealth",
		"discount",
		"medicine",
		"regeneration",
		'critic'
		]

	for (var i=0; i<specials.length; i++) {
		var something = specials[i];

		if (this[something]) {
			$('#' + something + ' span').text(this[something]);
			$('#' + something ).show()
		} else {
			$('#' + something).hide()
		}
	}
}