// 08. SUPPORTING FUNCTIONS
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------


function spacing(txt) {
	var arr = txt.toString().split("");
	for (var l = arr.length -4; l >= 0; l -= 3) {
		arr[l] += " ";
	}
	return arr.join("");
}

function cash (howMuch) {
	obols += howMuch;
	if (howMuch > 0) {
		var increasingOrDecreasing = "increasing";
	} else {
		var increasingOrDecreasing = "decreasing";
	}

	$('.ownedObols p').text(spacing(Math.floor(obols))).addClass(increasingOrDecreasing);
	setTimeout(function () {
		$('.ownedObols p').removeClass(increasingOrDecreasing);
	},100)

	sound("coin");
	update('obols', obols)
	
}

function silentCash (howMuch) {
	obols += howMuch;
	$('.ownedObols p').text(spacing(Math.floor(obols)))
	update('obols', obols)
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
		var theSound = document.getElementById(snd)
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


$('#volumeContainer').click(switchSounds)

function switchSounds () {
	$("#volumeContainer").toggleClass("mute");
	mute = !mute;
	if (mute) {
		fastState("Dźwięk wyłączony.")
		$.cookie('sounds', 'off')
	}
	else {
		fastState('Dźwięk włączony.')
		$.cookie('sounds', 'on')
	}
}

// ----------------------------


function losuj(a, b) {
	return (Math.floor((Math.random() * (b - a +1)) + a))
};

function getTime() {
	var now = new Date;
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
}

// Block context menu
  var $ctrl = false;
  var $key = 17, $c = 67, $v = 86, $alt = 18;
  $(document).bind("contextmenu",function(e){ 
    return false;
  });
  $(document).keydown(function(e) {
    if (e.keyCode == $key) { $ctrl = true; }
  }).keyup(function(e) {
    if (e.keyCode == $key) { $ctrl = false; }
  });
  $(document).keydown(function(e) {
    if (e.keyCode == $alt) { $ctrl = false; }
    //
  });
  $(document).keydown(function(e) {
    if ($ctrl && (e.keyCode == $v || e.keyCode == $c)) {
      return false;
    }
  });


