// HERO

var noItem = {
	attack: 0,
	defense: 0,
	artism: 0,
	magicAttack: 0,
	title: "gołe pięści"
}

var Hero = {

	weapon: noItem,
	armor: noItem,
	pen: noItem,

	inn : {
	attack : 1,
	defense: 0,
	artism: 0,
	magicAttack: 0,	
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

	potions: [0,0,0,0],
	


	strike: function () {
		if (!Hero.alive) return
		if (Hero.attack <= 0) return false
		statistics.heroAttacks ++;
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
			Hero.storm +=Math.floor(2 + Hero.storm/100);
			$('.eagle-click').addClass('storm');
			setTimeout(function () {
				$('.eagle-click').removeClass('storm');
			}, 50)
		}

		var hit = Hero.attack * damageMultipler;
		Enemy.damaged(hit, "Hero")
		Hero.hurt(Enemy.attack * notPerform('czulosc') * notPerform('anhelli') );
		Hero.refresh();

		if (ifPerform('nokturn')) {
			Hero.heal(hit/2, true)
		}
	},

	magicStrike: function () {
		if (!Hero.alive) return 0;
		if (this.weapon.subtype === "w_magick") {
			favouriteWeaponIncreaser();
		}

		if (ifPerform('zywa_pochodnia') && this.magicAttack) {
			Hero.hurt(this.magicAttack/4, 'pochodnia', true)
		}

		return this.magicAttack;

	},



	hurt: function (hurt,causeOfDeath, noDefense) {

		if (ifPerform('nokturn') && causeOfDeath != 'nokturn') {
				return false;
		}

		if (ifPerform("fatum") && !losuj(0,10000)) {
			Hero.hurt(Hero.maxhealth, "fatum", true)
			return false
		}

		if (!noDefense) {
			if (hurt * 0.9 < this.defense) {
				hurt *= 0.1;
			} else {
				hurt -= this.defense
			}
		}
		this.health -= hurt;
		Hero.lifeRef();

		if (this.health <= 0) {
			this.ifDead(causeOfDeath);
		}
	},

	regenerationStream: function () {
		for (var i=0; i<10; i++) {
			setTimeout(Hero.regenerate, 100*i);
		}
		setTimeout(Hero.regenerationStream, 1000)
	},

	regenerate: function () {

		if (Hero.health < Hero.maxhealth && notPerform('nokturn')) {
			var toHeal = Hero.maxhealth/1000 * 3 * (1 + Hero.regeneration/100);
			Hero.heal(toHeal)
		}
	},

	nocturnoStream: function () {

		if (notPerform('nokturn')) return
		for (var i=0; i<10; i++) {
			setTimeout(Hero.nocturno, 100*i);
		}
		setTimeout(Hero.nocturnoStream, 1000)
	},

	nocturno: function () {
			if (!Hero.alive || notPerform('nokturn')) return
			var toHurt = Hero.maxhealth/1000 * 10;
			Hero.hurt(toHurt, 'nokturn', true)
	},


	heal: function (healing, blackheal) {
		if (!Hero.alive) return
		if (ifPerform('nokturn') && blackheal === undefined) return
		this.health += Math.floor(healing);
		if (this.health > this.maxhealth) {
			this.health = this.maxhealth;
		}
		Hero.lifeRef();
	},


	lifeRef: function () {
		var oldHealthhWidth = $('#health').width();
		var newHealthWidth = (Hero.health / Hero.maxhealth) * 980;
		var animationTime = Math.abs(newHealthWidth - oldHealthhWidth)/2;
		$('#health').stop().animate({width: newHealthWidth}, animationTime);
		$('#heroHealth span').text(Hero.health)
	},

	ifDead: function (causeOfDeath) {
		// ways to survive
		if (ifPerform("kordian")) {
			abort("kordian")
			Hero.heal(Hero.maxhealth)
			bothState("Twoja odwaga wyrwała cię ze szponów śmierci...");
			sound("magic");
			return false;
		}

		Hero.health = 0;
		Hero.lifeRef();
		Hero.alive = false;
		endGame(causeOfDeath);

	}
}
