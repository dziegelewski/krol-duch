// 06. ENEMY
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------


var Enemy = {

	attack: 10, 
	damage : 0,

	damaged: function (damage, caller) {
		this.damage += damage
		if (ifPerform('czulosc') && caller==="Hero") this.damage -= damage
		seekingForItems();
		if (Enemy.damage >= levelTreshold) {
			levelUp();
		}
		var thisStanzaDamage = Enemy.damage
		$("#dmg").text(spacing(thisStanzaDamage))
		expBar();

		update('damage', Enemy.damage)
		
		var earn = damage * earnings
		if (caller === "Hero") {
			this.bounce(3)
		} else {
			var mercBounce = 2 + Math.floor(Math.pow(damage, 1/4));
			this.bounce(mercBounce);
			if (caller === "merc") {
				if (ifPerform("praca")) {
					earn += (earn - Hero.magicAttack) * 3;
				}
			}
		}
		silentCash(earn);

		function expBar () {
			var newWidth = thisStanzaDamage/levelTreshold * 250
		$('.expBar div').width(newWidth)
		}
	},


	// Bouncing

	bounceLvl: 0,

	bounce: function(power) {
	var bouncingEagle = $('.eagleShape');
		Enemy.bounceLvl += power;
		bouncingEagle.css("bottom", Enemy.bounceLvl/2 +3 + "px");
		setTimeout(function () {bouncingEagle.css("bottom", -Enemy.bounceLvl/3 + "px")},50)
		setTimeout(function () {bouncingEagle.css("bottom", Enemy.bounceLvl/3 + "px")},100)
		setTimeout(function () {bouncingEagle.css("bottom", "0px")},150)
		setTimeout(function () {
			if (Enemy.bounceLvl > 10) {
			bouncingEagle.css("bottom", Enemy.bounceLvl/4 + "px");
			setTimeout(function () {bouncingEagle.css("bottom", "0px")},50)
			}
		},220)
		setTimeout(function () {
			if (Enemy.bounceLvl > 20) {
			bouncingEagle.css("bottom", Enemy.bounceLvl/4 + "px");
			setTimeout(function () {bouncingEagle.css("bottom", "0px")},60)
			}
		},350)
		setTimeout(function () {
			if (Enemy.bounceLvl > 35) {
			bouncingEagle.css("bottom", Enemy.bounceLvl/5 + "px");
			setTimeout(function () {bouncingEagle.css("bottom", "0px")},80)
			}
		},450)
	},

	bounceInterval: function () {
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

	fill: function () {
		if (this.overridedColor === undefined) {
			var levelPalette = this.rgb[level]
			if (this.rgb.length > level) {
				var newColor = "rgb("+levelPalette[0]+","+levelPalette[1]+","+levelPalette[2]+")"
			} else {
				var newColor = "red"
			}
			$(".eagleContour").css("fill", newColor)
			// $('.heroContainer').css('border-color', newColor)
		}
	},

	rgb: [ // dokończyć
	undefined,
	[255,255,255],
	[240,240,240],
	[230,230,230],
	[222,222,222],
	[214,214,214],
	[206,206,206],
	[190,190,190],
	[180,180,180],
	[170,170,170],
	[160,160,160],
	[150,150,150],
	[130,130,130],
	[120,120,120],
	[110,110,110],
	[100,100,100],
	[100,90,90],
	[100,80,80],
	[100,70,70],
	[100,45,45],
	[120,30,30],
	[140,20,20],
	[180,15,15],
	[130,30,30],
	[110,50,50],
	[90,60,60],
	[80,80,100],
	[60,60,100],
	[45,45,100],
	[65,65,95],
	[80,80,90],
	[80,80,75],
	[80,80,60],
	[70,80,60],
	[60,80,60],
	[60,70,60],
	[60,60,60],
	],

}

setInterval (Enemy.bounceInterval, 300);
$('.eagle-click').click(Hero.strike);