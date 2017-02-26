// 03. GAME
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------


var level = 1;
var levelTreshold = 100;

function levelUp () {
    level ++;
    update("level", level)
    printPoem();
    sound('levelup');
    Enemy.fill();
    dev = 0;

    Enemy.damage = 0;
    levelTreshold =  500 * level * level * 1.2;
    if (level > 20) levelTreshold *= 1.5
    if (level > 25) levelTreshold *= 1.5
    if (level > 30) levelTreshold *= 2
    if (level > 30) levelTreshold *= 2
    if (level > 40) levelTreshold *= 3
    if (level > 45) levelTreshold *= 3

    
    levelTreshold -=   levelTreshold % 100;
    if (level)
    $("#dmg-needed").text(spacing(levelTreshold))

    // boost skills
	Enemy.attack += level * (5 + Math.floor(level/5) + Math.floor(level/10) + Math.floor(level/15) + Math.floor(level/20) + Math.floor(level/25) + Math.floor(level/30) + Math.floor(level/35)) + 4;
	Hero.maxhealth += (level - 4)* 50 + 200;
	Hero.inn.attack += Math.floor(level/2); 
	Hero.inn.defense += Math.floor(level/2);
	if ((level > 4 && level % 2 != 0) || level === 4) {
	   Hero.inn.artism ++;
	}

    if (!blockStates) {
	   $('#konsolaLOG>.logsDiv').append('<div class="levelSeparator"></div>');
    }

    state("STROFA " + romanize(level), true)

	switch(level) {
        case 2:
        state("Plugawe istoty zgodziły się tobie służyć. Zapłać im obolami, Charonową walutą, a będą siać terror i ginąć z twoim imieniem na ustach.", true);

        merc[0].appear();
        merc[1].appear();
        // show obols
        $('.ownedObols').css('visibility', 'visible');
        obols = 0;
        firstItem();
        cash(0)
        $.removeCookie('mercenaries');
        $.removeCookie('Heroweapon');
        $.removeCookie('Heroarmor');
        $.removeCookie('Heropen');
        $.removeCookie('deadsArray');

        if ($('.ashesOfMemory').length) {
            breakAshes();
        }

        if (Hero.weapon != noItem) {
        $.cookie('Heroweapon', JSON.stringify(itms[Hero.weapon.id])) 

        }

        if (Hero.armor != noItem) {
        $.cookie('Heroarmor', JSON.stringify(itms[Hero.armor.id])) 

        }

        saveStatistics()
        setInterval(saveStatistics, 5000)

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

 function newMercState () {
        bothState("Nowe sługi przysięgają ci wierność.", true)
    }

function printPoem () {
    // Warning, damage bar!
    $('#lyrics > h2, #lyrics > p').text("")
    if (level < maxlevel) {
    var stanza = lyrics[level]
    } else {
    var stanza = lyrics[maxlevel]
    }
    var lastLine = "&#160;";
    if (stanza.length === 5) {
        lastLine = stanza[4]
    }

    $('#lyrics h2').text('Strofa ' + romanize(level))
    .next().text(stanza[0])
    .next().text(stanza[1])
    .next().text(stanza[2])
    .next().text(stanza[3])
    .next().html(lastLine);
    if (level >= maxlevel) {
     $('#lyrics h2').text('Zakończenie')
    }
}

function romanize(num) {
      var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
      for ( i in lookup ) {
        while ( num >= lookup[i] ) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
    }


function fastLevelUp () {
    var damageNeeded = levelTreshold - Enemy.damage
    Enemy.damaged(damageNeeded);
    cash(damageNeeded*earnings)
}

var lyrics = [
undefined,

['Cierpienia moje i męki serdeczne,',
'I ciągłą walkę z szatanów gromadą,',
'Ich bronie jasne i tarcze słoneczne,',
'Jamy wężową napełnione zdradą...',
'Powiem... wyroki wypełniając wieczne.'],

[
'Budzę się. – Straszna nade mną kobieta',
'Śpiewała swoje czarodziejskie runy:',
'"Ojczyzna twoja" – wrzeszczała – "zabita!',
'Ja jedna żywa... a ty zamiast trumny',
'Miałeś mój żywot."'],

['"Popiołem nakryta',
'I zapłodniona przez proch i pioruny,',
'Wydałam ciebie, abyś był mścicielem!',
'Synu popiołów, nazwany Popielem..."'],


['Po ciemnych puszczach, gdziem się błąkał – gnana',
'Wichrami straszna przyszłości orlica!',
'– Kto mię napotkał – myślał, że szatana,',
'Bo wszystko widział wprzód niż moje lica:',
'Zbroję... i skrzydła... i młot u kolana'],

['Na jednym pustym śród sosen smętarzu',
'Spotkałem smętne i dzikie Germany...',
'O! duchu! dawnej przeszłości malarzu!',
'Ty jeszcze widzisz te sosnowe ściany,',
'Wozy, ogniska, twarze przy rozżarzu...'],

['"Liczni" – krzyknąłem – "jak gwiazdy na niebie!',
'Straszni jak piorun, gdy niebo odmyka!',
'Przez was świat wytnę! pod wami pogrzebię!',
'Ja, syn popiołów – ojciec mogilnika!"'],

['Jam był jak piorun, gdy lasy druzgoce!',
'I napełniłem ten lud przerażeniem,',
'A w przerażeniu takim wielkim żarem,',
'Że mię ukochał i nazwał – Kiejzarem.'],


['Przez wszystkie władze ziemskie ostrzegany,',
'Wpadłem na ziemię moją nieszczęśliwą;',
'Lech nie żył, a lud jego zabijany',
'W królewnę patrzał jako w gwiazdę żywą...'],


['Jeszcze pamiętam ten wrzask i to wycie',
'Różnych narodów i różnych języków,',
'Gdy te ludyszcza przy Wisły korycie',
'Przyparłem do fal falą moich szyków.'],


['Aż mi o jasnym wyprawili świcie',
'Najstarszych z wojska swego tysiączników,',
'Prosząc o pokój i o ziemi bryłę',
'Taką... że ledwo dla nich – na mogiłę.'],

['Tak mój duch w kształty się piramidalne',
'Wyrzucał, dawną tryskając naturą;',
'Tak nowe ciała łańcuchy fatalne',
'Targał... i piorun zawsze miał pod chmurą.'],

['– Potem więc roki się zebrały walne',
'I mnie okryły Lechową purpurą.',
'Lud cały strachem ohydnie znikczemniał;',
'Jam siadł na tronie, zmroczył się i ściemniał.'],

 
['I któż by to śmiał w księgi ludzkie włożyć',
'Dla sławy marnej, a nie dla spowiedzi?',
'– Postanowiłem niebiosa zatrwożyć,',
'Uderzyć w niebo tak jak w tarczę miedzi.',
'Zbrodniami przedrzeć błękit i otworzyć.'],

['I kolumnami praw, na których siedzi',
'Anioł żywota, zatrząść tak z posady,',
'Aż się pokaże Bóg w niebiosach – blady...',
'A nie Bóg nad tą żywota fortecą',
'Zgwałconą twarzy pokaże?'],


['Komety złote na niebie przylecą',
'I bliżej oblicz ukażą na świecie,',
'Nad zamkiem swoje ogony zaniecą',
'Ja widma – jedno – i drugie – i trzecie...',
'Jeśli nie zlęknę się, a krew mię splami...'],


['Wichry skrwawione, głos trupów z kościarzy,',
'Słońce poblednie, księżyc się zatrzyma?',
'Gwiazda zajęczy jaka lub zaszczeka?',
'Wszystko pokaże... że dba o człowieka!...'],


['"Jeśli nie" – rzekłem – "jeśli z tym motłochem',
'Postąpię sobie jak król zwariowany,',
'A żywot jak wąż schowa się pod lochem,',
'Jak gdyby nie czuł w sobie żadnej rany,',
'To ludzie są proch! i ja jestem prochem.'],


['Zaledwo ta myśl poczęła się we mnie,',
'Wzrok zaraz wydał ją... jasny... i suchy...',
'Wchodzący w myśli ludzkie potajemnie.',
'Aby tam widział w kościach, czy są duchy?'],


['Więc naprzód Czerczak, u nóg mi nikczemnie',
'Prosząc o łeb, pod katów obuchy',
'Poszedł, a zanim jacyś dwaj prorocy,',
'Których dziś... krwawe łby... widuję w nocy..'],


['Za wojewodą cały dwór i sługi',
'Posłałem... niby z nim będące w zmowach.',
'I z wież patrzałem na ten łańcuch długi',
'Idący na śmierć z świecami, w okowach.'],

['A niebios!... niebios błękitne framugi,',
'Jakby o zdjętych nie wiedziały głowach,',
'Patrzały na to ciche – obojętne!',
'Mnie się wszelako zdawało, że smętne!'],

['Ogromny szereg tych wymordowanych',
'Poszedł. Myślałem, że duchy zobaczę',
'Gdzieś do łabędzi podobne rumianych,',
'Od których jęczy powietrze i płacze;'],


['Albo że ze ścian, ogniem zapisanych,',
'Wyjdą pająki z ognia... straszne tkacze!',
'Na ściennych ogniach się swych zakołyszą',
'I wyrok jakiś ognisty napiszą!'],

['– I nic!... Ten straszny duch, któremu wojnę',
'Wydałem, dziecko zostawił bezkarne;',
'A ja podniosłem pierś dumną i twardą,',
'Gotów do końca walczyć z bożą wzgardą...'],

['Wtenczas ujrzano mię, że w ciele brzydnę',
'I biorę postać duchów utrapionych.',
'Ludzie myśleli, że mi gniją trzewa,',
'A jam był senny jak wąż, gdy poziewa.'],

['Dziesięć czasami gwiazd i słońc czerwono',
'Zagore... dziesięć wrzasków razem słyszę;',
'I nie podnosi mi się duchem łono',
'Ani się serce strachem zakołysze...'],

['Jako Lucyfer z błyskotną koroną',
'Stoję...a zbrodni mojej towarzysze',
'Na większą niż te wszystkie okropności',
'Patrzą – na mą twarz śmiertelnej bladości.'],

['Dziwią się wszyscy, że jak pies nie szczekam,',
'Jak lew nie ryczę, jak człowiek nie zgrzytam;',
'Nie wiedzą, że ja, duch natchnięty, czekam',
'Gwiazd, deszczów krwawych; i znów za miecz',
'I znowu cały świat na siebie wściekam!'],

['Co tylko mocy ten mózg napięty,',
'Tom ja na męki wynalazek użył.',
'Stosy, na Wiśle spękane okręty,',
'Kołowrót, który ciał długość przedłużył...'],

['Wszystko w męczeństwie ten kraj niepojęty',
'Swą cierpliwością wytrzymał i zużył!',
'A niebo wszystko to cierpliwie zniosło,',
'Póki kruszyłem duchom: łódź i wiosło...'],

['Poszedłem dalej... i w męki wyborze',
'Już nic nie mogąc straszniejszego stworzyć,',
'Zacząłem łamać większe prawa boże,',
'Myśląc naturę samą upokorzyć.'],

['Matkę mi z lasu stawiono na dworze...',
'A ja zamiast się u nóg jej położyć,',
'U tej w łachmanach podartej orlicy',
'– Ciała użyłem za knot smolnej świecy...'],


['Rzekłem ludowi, że mnie czarowała,',
'Że serce jadła, że żony mi truła.',
'Z włosem palącym się jak ptak latała',
'I zgasła.'],

['Wtenczas twarz mi się popsuła',
'I pokazała zielonością ciała,',
'Że się duchowi memu szata pruła;',
'On jednak w ciele nie wiedział o sobie,',
'W letargu niby i w czarnej chorobie.'],

['Raz tylko byłem tak na siebie śmiały,',
'Że się przejrzałem, w tarczy patrząc lice;',
'A byłem cały jako trup sczerniały,',
'Który stoletnią miał w ziemi trumnicę,',
'A już robaki z niej pouciekały.'],

['Lecz co dziwniejsze, że tak próchniejący,',
'Taki upadły i taki zużyty,',
'Czasem się czułem jak anioł gorący,',
'Gotów ukochać świat i nieść w błękity',
'Tę ziemię, jako anioł wzlatujący.'],

['A usta milczą – to mój duch omamion',
'Wszystkimi, zda się, kręci księżycami,',
'A gwiazdy na kształt muzykalnych znamion',
'Chwyta... i w głosach to ziemskich wyraża:',
'Tworząc już nie Pieśń Sen, lecz Pieśń Mocarza.'],

['A tymczasem mię wielki Pan niebieski',
'Ubierał w grozę i w powagę strachu.',
'A strach była jakiś ciemny i królewski,',
'Który napełnił wszystkie kąty gmachu.'],

['A co dziwniejsza... że mię ukochano',
'Za siłę – i za strach – i za męczarnie.',
'Gdym wyszedł... lud giął przede mną kolano,',
"Lud owiec, który się k' pasterzom garnie!",
'Przed twarzą moja straszliwą klękano,'],

['– Swityn żył jeszcze. Starzec sławą słynął,',
'Bił wrogi moje, winy moje gładził,',
'Na dwu srebrzystych morzach mię posadził;',
'Stary – a miecza do pochwy nie chował.',
'Jam go jak ojca kochał – i szanował...'],

['Pamiętam... biła północna godzina',
'Wtem myśl ohydna o śmierci Swityna',
'W serdeczne moje wstąpiła zgryzoty',
'Z taką potęgą!... żem wnet ku niej dłoni',
'Podał, jak dziecko uśmiechnął się do niej...'],

['"Płomieniom wolno chodzić po dolinach',
'I błyskawicom wolno bić w cnotliwe.',
'Za myślą twoją idź – nie myśl o czynach!',
'Próbuj, czy niebo martwe jest, czy żywe?"',
'Tak mi ktoś szeptał.'],

['Wysłałem katy... lecz myśl, gdy się kwieci,',
'W coraz straszniejsze rozwija się drzewo.',
'Posłałem drugie... dwór – żonę – i dzieci',
'Wyciąć.'],

['Był ciemny dzień i grad z ulewą.',
'Czasami słońce ponuro zaświeci',
'I gradem złotym jak zwichrzoną plewą',
'O pancerz chłośnie i z kitą się zetrze',
'– Bom stał... czekając tych katów – na wietrze.'],

['A wtem przyleciał giermek zadyszany',
'I te wyrazy z ust wyrzucił skore:',
'"Panie! Ogromny znak jest ukazany!',
'Na niebie miotła płomienista gore".'],

['I obaczyłem w gwieździe niby znamię',
'Ognistsze... powiek mgnięcie i błysk oka:',
'Wtenczas uczułem, że mi ducha łamie',
'Na wieki jakaś moc – straszna – głęboka.'],

['Gwiazdy tę gwiazdę wysłały na zwiady,',
'Czym żyw? czy jeszcze okryty purpurą',
'Czynię rzecz króla, człowieka i zboja?',
'Niebo się zlękło o świat. – To śmierć moja.'],

['"Idźcie... Już więcej nie jesteście sługi',
'Mojej wściekłości, lecz rycerze twardzi.',
'Kupiłem naród krwią... i nad jej strugi',
'Podniosłem ducha, który śmiercią gardzi."'],

['Taki był koniec mojego żywota,',
'Śpiewany długo w kraju przez rapsodów,',
'Którzy nie doszli, w czym była istota',
'Czynów? w czym wyższość od rzymskich Herodów?'],

['Ale przeze mnie ta ojczyzna wzrosła,',
'Nazwiska nawet przeze mnie dostała;',
'I pchnięciem mego skrwawionego wiosła',
'Dotychczas idzie: Polska – na ból – skała...'],
]

var maxlevel = lyrics.length-1;





