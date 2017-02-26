// 04. CONSOLES
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

// -------------------
// LOG


function state (message, bold) {
    if (blockStates) return
    var bigger = ""
    if (bold) bigger = ' style="font-weight: bold"'
	$('#konsolaLOG>.logsDiv').append('<p' + bigger + '><span class="clock">' + getTime() + ' – </span> ' + message + '</p>');
	var howMuchToScroll = $('.logsDiv').scrollTop() + 50
	$('.logsDiv').stop().animate({scrollTop: howMuchToScroll}, 500);
}

// will be changed into separated function

function fastState (message) {
    if (blockStates) return
    var duration = (message.length + 5) * 80;

    if (typeof hideFastState != "undefined") {
    clearTimeout(hideFastState)
    }

    $('.fastStateContainer').fadeIn(100);

    $('.fastStateContainer p').text(message)
    hideFastState = setTimeout(function () {
        $('.fastStateContainer').fadeOut(100);
    }, duration)
}

function bothState (message, bold) {
    state(message, bold);
    fastState(message)
}


// -------------------
// INFO

var infoScreen = $('#hoverInfo')
    header = $('#hoverInfo > h2')
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
    infoScreen.show().removeClass()
    allInfo.text("")
    var descr = $(this).attr("data-descr");
    switch(descr) {
        case "health":
        header.text("Witalność")
        info2.text("Strzeż każdej kropli krwi. Jeśli ta wartość spadnie do  zera, twoje okrutne rządy dobiegną końca.");
        infoScreen.addClass("healthScreen")
        break;


        case "potion":
        header.text("Wywar")
        info.text("Wypij, aby błyskawicznie uleczyć rany.")
        break;


        case "item":
        infoScreen.addClass("itemScreen")
        itms[$(this).attr("id")].provideInfo();
        break;


        case "mercenary":
        infoScreen.addClass("mercsScreen");
        var id = $(this).attr("id").substr(4);
        merc[id].provideInfo();
        break;


        case "poem":
        infoScreen.addClass("poemScreen");
        var poemNo = $(this).attr("data-poem")
        book[poemNo].provideInfo();
        break;


        case "key":
        header.text("Klucz");
        var howManyKeys = ["Potrzebujesz jeszcze dwóch kluczy.", "Potrzebujesz jeszcze jednego klucza.", "Masz już wszystkie klucze. Wykorzystaj je."]
        info.text('Ciężki, dziwny klucz. Na pewno nie pochodzi z tego świata.')
        var keyInfo = howManyKeys[$('.inventory > .key').length -1];
        info2.html('<br /><br />'+keyInfo);
        break;

        case "inkwell":
        header.text("Kałamarz");
        info.text('Kilknij, by stworzyć wybrany przez siebie poemat. Wiersz trafi do twojego inwentarza, wykorzystasz go w wybranym przez siebie momencie.')
        break;

        case "ashes":
        header.text("Prochy pamięci");
        info.text('Wspomnienia twego ducha zachowały się w garstce popiołów. Użyj ich, by przypomnieć sobie strofę, do której dotarłeś ostatnio. Sługi, bogactwa, posiadane wywary, przedmioty podręczne i osiągnięcia będą ci zwrócone; poematy, kałamarz i resztę inwentarza - utracisz.')
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
        info2.text("Twoi słudzy uderzają co " + (frequency/1000).toFixed(2) + " s.")
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
})


$('body').on("mouseleave", "[data-descr]", function () {
    hideInfo();
})


// -------------------
// SWITCH

blockConsoles = false;

function showInfo() {
    if (blockConsoles) return
    $('#konsolaLOG').stop().hide();
    $('#konsolaINFO').stop().fadeIn(90);
}
function hideInfo() {
    if (blockConsoles) return
    $('#konsolaLOG').stop().fadeIn(90);
    $('.logsDiv').scrollTop($('.logsDiv')[0].scrollHeight);
    $('#konsolaINFO').stop().hide();
}


    












