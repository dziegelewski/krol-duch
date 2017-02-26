// 09. POEMS BOOK
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

function Poem(title, description, time, color) {
	this.page = page;
	this.title = title;
	this.description = description;
	this.time = time;
	// reversed time -> unendable
	this.color = color;
}
	

var book = {}
var page = 0;


	
book[++page] = new Poem ("Sonet", "Zwiększa Artyzm o 1 i podwaja szansę na znalezienie pióra.",
	600, "#3299CC");

book[++page] = new Poem ("Matecznik", "Twoi pajęczarze tracą zdolność ataku, lecz każdy z nich zapewnia ci 6 punktów premii do obrony.",
	1200, "#757E00");
// 1200


book[++page] = new Poem ("Lambro", "W twoje ręce trafia zaklęta żagiew.",
0, '#A60400');

book[++page] = new Poem ("Złota czaszka", "Przy każdym ataku – twoim lub sług – zapewnia cień szansy na znalezienie skarbu o wartości 100 tys. oboli. Wówczas działanie poematu kończy się.",
1800, "#ff9900");

book[++page] = new Poem ("Pierwiosnek", "Całkowicie cię uzdrawia.",
0, "#BDB402");
	
book[++page] = new Poem ("Żmija", "Zyskujesz dodatkowy atak magiczny o mocy 25 za każdy posiadany punkt Artyzmu. Istnieje jednak 33 procent szans, że wywary wypite w trakcie działania poematu nie przyniosą żadnego efektu.", 
-240, "#9900CC");
// // 480
book[++page] = new Poem ("Trójka koni", "Twoi słudzy atakują zacieklej, zyskując 30 punktów przyśpieszenia. Równocześnie są bardziej narażeni na śmierć w bitwie, przez co ich żywotność spada o 25 procent.", 
600, "#330000");
book[++page] = new Poem ("Romantyczność", "Pod twoją komendę trafiają nowe sługi: upiory.",
0, "#330066");
// 600
book[++page] = new Poem ("Spartakus", "Twój atak rośnie o 10 za każdego sługę, który walczy po twojej stronie. Równocześnie twoja obrona spada o 3 za każdego takiego sługę.", 
60, "#F30002");

book[++page] = new Poem ("Liść kalinowy", "Zyskujesz premię do zielarstwa równą 20, dzięki czemu w twoje ręce częściej trafiają życiodajne wywary.",
	300, '#006633');

book[++page] = new Poem ("Śpiew z mogiły", "Gdy któryś z twoich sług zginie, wykonując atak, w swym ostanim uderzeniu zada trzydziestokrotnie większe rany.",
	600, '#484848');


book[++page] = new Poem ("Baranki moje", "Zmniejsza koszt zatrudnienia sług o 10 procent.",
900, "#AC9989");

book[++page] = new Poem ("Do matki",	"Przyspiesza tempo gojenia się twoich ran o 50 procent.",
1800, "#3232CD");

book[++page] = new Poem ("Chmury", "Dwuipółkrotnie zwiększa obronę zapewnianą przez broń drzewcową lub dystansową.",
600, "#adadad");

// book[++page] = new Poem ("Rozmowa z piramidami", "Twoja obrona powoli, lecz trwale wzrasta. Działa coraz silniej wraz z upływem czasu.",

book[++page] = new Poem ("Wielkie słowa", "Każdy akt stworzenia poematu całkowicie cię uzdrawia.",
1200, "#4A766E");
// 900, "#5E210B");

book[++page] = new Poem ("Anhelli", "Mroźny syberyjski wiart skuwa lodem całą krainą. Wróg nie atakuje i nie odnosisz żadnych ran w walce.",
10, "#4CB1BB");

// book[++page] = new Poem ("Bezimienni", "Hycle otrzymują premię do ataku równą twojemu Artyzmowi.",
// 300, "#663366");


book[++page] = new Poem ("Ironia", "Trwale zmniejsza twoją maksymalną witalność o 15 procent. W zamian za to w twych rękach ląduje pokaźna garść monet – 5 tys. za każdy posiadany punkt Artyzmu.",
0, "#2F4F2F");

book[++page] = new Poem ("Wieniec przeklętych", "Twój atak trwale rośnie o wartość posiadanego Artyzmu za każdego sługę, który zginie podczas trwania poematu.",
300, "#4F2F39");



book[++page] = new Poem ("Nokturn", "Budzi się w tobie zew nocy. Stajesz się niewrażliwy na ataki, a każdy twój atak przywraca ci tym więcej witalności, im jest silniejszy. Witalność samoistnie spada w szybkim tempie i nie może zostać odnowiona przy pomocy wywarów – musisz więc nieustannie atakować.",
-90, "#000000");


book[++page] = new Poem ("Tak mi Boże dopomóż", "Zwiększa twoje atak i obronę o pięciokrotność posiadanego Artyzmu.",
600, "#9F5F9F");
	

book[++page] = new Poem ("Kabała", "Jeden z twoich pajęczarzy – i jeden dodatkowy za każde 10 posiadanych punktów Artyzmu – staje się siepaczem. Trwale tracisz 8 punktów Obrony za każdą taką przemianę.",
0, "#7093DB");


book[++page] = new Poem ("Zbójcy", "Zyskujesz premię 10 do ataku za każdego siepacza, który ci służy.",
120, "#6F4242");

book[++page] = new Poem ("Wiatr", "Twoi słudzy zyskują 1 procent przyspieszenie ataku za każdy twój punkt Artyzmu.",
1200, "#466E88");

book[++page] = new Poem ("Przedświt", "Twój ostatni zmarły sługa powraca do świata żywych.",
0, "white");

book[++page] = new Poem ("Mysia wieża", "Na czas trwania poematu hycle stają się rojami myszy. W tej postaci są tym silniejsi, im posiadasz ich więcej; bardzo szybko giną i kąsają także ciebie, przed czym nie chroni żadna zbroja. Poemat kończy się natychmiast, gdy zdechną wszystkie myszy. Uwaga! Jeśli użyjesz poematu, posiadając wielu hycli, możesz łatwo zginąć.",
600, "#2B2500");

book[++page] = new Poem ("Chochlik", "Istnieją równe szanse, że w twoje ręce trafi potężny przedmiot, że zginie któryś z twoich sług i że nic się nie stanie.",
0, "#C00C25");

book[++page] = new Poem ("Niewiadomo co", "Jeśli walczysz różdżką, jej współczynnik niemagicznego ataku jest czterokrotnie większy.", 
780, "#660033");

book[++page] = new Poem ("Żelazna rękawica", "Premia do Artyzmu zapewniana przez twoje pióro podwaja się, lecz przez czas trwania poematu nie nawiedza cię wena.",
600, "#686868");

book[++page] = new Poem ("Zachwycenie", "Natychmiast przychodzi wena.",
0, "#1A9B00");


book[++page] = new Poem ("Niedźwiedź", "Twój atak staje się równy obronie, jeśli jest od niej niższy.",
300, "#401823");


book[++page] = new Poem ("Najcięższa łza", "Ilekroć któryś z twoich sług zginie, w twoje ręce trafia leczniczy wywar.",
600, "#5499B1");

book[++page] = new Poem ("Głęboka noc", "Na czas trwania poematu twoje upiory stają się wampirami. W tej postaci są silniejsze, a każdy ich atak wysysa życie i przywraca tobie część straconej wytrzymałości.",
600, "#000900");


book[++page] = new Poem ("Fatum", "Zyskujesz premię 3 do Artyzmu. Jednak ilekroć zostaniesz zraniony, istnieje SZALENIE znikoma szansa, że natychmiast zginiesz.", 
-600, "#545454");

book[++page] = new Poem ("Burza", "Na czas trwania poematu zyskujesz atak magiczny, który staje się silniejszy w miarę kolejnych zadawanych przez ciebie uderzeń.", 
120, "#425270");

book[++page] = new Poem ("Na ruinach", "Zadajesz trzykrotnie większe rany, jeśli łączna wartość ataku twoich sług jest mniejsza od twojej.",
300, "#7F7F7F");

book[++page] = new Poem ("Bajka", "Szansa na znalezienie różdżek i instrumentów staje się blisko trzykrotnie większa.",
1200, "#5648E8");

book[++page] = new Poem ("Czułość", "Nie zadajesz żadnej krzywdy i nie odnosisz ran w walce. Mimo to wciąż możesz znaleźć pieniądze i przedmioty.",
240, "#ff3366");

book[++page] = new Poem ("Duma", 'Ilekroć wynajmujesz drugiego lub kolejnego sługę danego rodzaju, istnieje 20 procent szans, że nie żądając zapłaty dołączy do ciebie jeszcze jeden sługa tego rodzaju.',
1200, "#9F9F5F");


book[++page] = new Poem ("Znad wód", "Twój Artyzm spada o 4, ale szanse na przyjście weny są trzykrotnie większe.",
600, "#22559D");



book[++page] = new Poem ("Żyjący grób", "Żywotność twoich sług wzrasta o 300 procent.",
1200, "#000033"); 


book[++page] = new Poem ("Oblężenie", "Siepacze atakują z podwójną siłą, a każdy ich atak kończy się znalezieniem przedmiotu. Przy każdym ataku ginie jeden siepacz. Poemat kończy się z chwilą śmierci ostatniego siepacza.", 60, '#651417'),



book[++page] = new Poem ("Nerwy", "Cena sprzedaży przedmiotów przez jedno uderzenie serca jest dwukrotnie wyższa.",
6, "#E47833");




book[++page] = new Poem ("Hosanna", "Wszyscy twoi ranni słudzy wracają do pełni witalności.",
0, "#8DBBFF");


book[++page] = new Poem ('Łucznik', "W twoje ręce trafia potężna broń strzelecka lub drzewcowa.",
0, '#534C4A');


book[++page] = new Poem ("Ogrodnik", "Zwiększa szybkość gojenia się twoich ran o 300 procent oraz liczbę znajdowanych wywarów o 30 procent.",
120, "#99cc00");



book[++page] = new Poem ("Mohort", "Za każdym razem, gdy do twojego inwentarza powinien trafić leczniczy wywar, zamiast niego zdobywasz przedmiot użyteczny na polu bitwy.",
-300, "#31150E");

book[++page] = new Poem ("Snuć miłość", "Ilekroć wypijesz leczniczy wywar w trakcie trwania poematu, twoja maksymalna witalność zwiększy się o 1,5 procenta.",
60, "#ff0099");


book[++page] = new Poem ("Rozum i wiara", "Zapewnia 5-procentową szansę, że natychmiast przejdziesz do kolejnej strofy (i zdobędziesz wszystkie pieniędze, które zarobiłbyś dążąc do celu powoli).",
0, "#004115");

book[++page] = new Poem ("Kupiec wenecki", "Wszystkie posiadające wartość przedmioty, które trafią w twoje ręce, są natychmiast sprzedawane. Otrzymujesz jednak za nie trzykrotnie lepszą cenę.",
-600, "#E47833");






book[++page] = new Poem ("Balladyna", "Znajdujesz potężny instrument.",
	0, "#F967C0");



book[++page] = new Poem ("Smutno mi Boże", "Jeśli dysponujesz atakiem magicznym, jest on o 75 procent silniejszy. Przec czas trwania poematu zdobywasz jednak o połowę mniej pieniędzy.",
600, "#996633");


book[++page] = new Poem ("Zawisza Czarny", "Wszyskie pancerze, które trafią w twoje ręce, będe o 20 procent potężniejsze.",
1200, "#181B20");

book[++page] = new Poem ("Przygrywka", "Zapewnia szansę 5 procent za każdego służącego ci harfiarza, że dołączy do ciebie sługa najpotężniejszego dostępnego typu, pod warunkiem, że posiadasz już choć jednego sługę tego typu, oraz dodatkowo szansę 1 procenta za każdego harfiarza, że dołączy do ciebie kolejny harfiarz.",
0, "#2994C8");


book[++page] = new Poem ("Drżenie", "Dołącza do ciebie kolos, najpierw jednak uderza cię z siłą 20 000. Upewnij się, że wyjdziesz z tego cało...",
0, "#33313A");


	book[++page] = new Poem ("To lubię", "Wszystkie znalezione przez ciebie wywary są o jedną klasę lepsze, niż byłyby w normalnej sytuacji.",
600, "#FF3333");

book[++page] = new Poem ("Gawęda", "Twoi bojarzy zapewniają ci premię do zdobywanych bogactw.",
1800, "#4F2F4F");



book[++page] = new Poem ("Vivat", "Twoja obrona spada do zera, a pięciokrotność jej dotychczasowej wartość zostaje dodana do ataku. Otrzymujesz też premię 100 procent do zdobywanych bogactw.",
15, "#E19100");

book[++page] = new Poem ("Trzy struny", "Czas trwania aktualnie używanych poematów zostaje odnowiony.",
0, "#BC8F8F");

book[++page] = new Poem ("Pielgrzym", "Twoja obrona rośnie o 25 za każdy posiadany przez ciebie punkt Artyzmu. Za to koszt wynajęcia slug rośnie o 10 procent.",
1800, "#5F9F9F");

// book[++page] = new Poem ("Białe orlę", "Jeśli któryś z twoich sług zginie, wraca do ciebie 25 procent jego żołdu.",
// 1200, "#dedede");

book[++page] = new Poem ("Lilije", "Ilekroć zatrudnisz upiora, zdobywasz średni wywar leczniczy.",
1200, "#990099");
// book[++page] = new Poem ("Testament mój", "Zadajesz 12-krotnie większą krzywdę i nie można cię zabić. Z chwilą zakończenia działania poematu – umierasz.",
// 45, "#414141");

book[++page] = new Poem ("Radość w boleści", "Trafiające w twoje ręce przedmioty są znacznie potężniejsze, jeśli w trakcie poszukiwań dysponujesz mniej niż jedną trzecią maksymalnej witalności.",
2400, "#9A618A");

book[++page] = new Poem ("Słowik", "Twoi harfiarze zmniejszają koszt zatrudniania sług.",
600, "#EEDC05");



book[++page] = new Poem ("Lilla Weneda", "Twoi harfiarze dobywają mieczy, dzięki czemu zyskują atak 200.",
1200, "#238E23");

book[++page] = new Poem ("Żal rozrzutnika", "Daje 65 procent szans, że podwoisz ilość posiadanych pieniędzy i 35 procent szans, że wszystko stracisz.",
0, "#003333");

book[++page] = new Poem ("Książę niezłomny", "Zadajesz potrójne rany, jeśli w chwili uderzenia masz mniej niż połowę maksymalnej witalności.",
300, "#43534D");

book[++page] = new Poem ("Jesień", "Trwale zyskujesz 1 punkt Artyzmu, lecz płaci za to życiem twój najsilniejszy sługa.",
0, "#FF3300");


book[++page] = new Poem ("Cztery rzeczy","W twoje ręce trafiają cztery przedmioty.", 
0, "#430000")

book[++page] = new Poem ("Karnawał", "Za każdego służącego ci harfiarza dołączają do ciebie hycel, pajęczarz, siepacz i upiór.",
0, "#ff3300");

// book[++page] = new Poem ("Sfinks", "Twój atak powoli, lecz trwale wzrasta. Działa tym silniej, im mniej czasu pozostało do zakończenia poematu",
// 900, "#A3952A");



	book[++page] = new Poem ("Święta grota", "Za każdym razem, gdy sprzedajesz przedmiot, istnieje niewielka szansa, że trafisz na trop jaskini pełnej skarbów, dzięki czemu wypełnisz swój inwentarz kosztownościami.",
1200, "#996600");


book[++page] = new Poem ("Dziady", "Pięciu twoich ostatnio zmarłych sługów wraca do życia.",
0, "#330033");




book[++page] = new Poem ("Sen srebrny Salomei", "Losowy sługa zostaje złożony w ofierze. Zadajesz ranę równą 300-krotności jego siły ataku. Jeśli ofiarą będzie harfiarz, twój Artyzm trwale wzrasta o 1.",
0, "#8E8E8E");


book[++page] = new Poem ("Żywa pochodnia", "Otrzymujesz atak magiczny 120 za każdy posiadany punkt Artyzmu. Ogień pali także ciebie z jedną czwartą tej siły.",
300, "#E35226");


book[++page] = new Poem ("Lirnik", "Jeśli posługujesz się instrumentem muzycznym, wartość twojego ataku staje się równa sile twojego ataku magicznego",
600, "#909100");

book[++page] = new Poem ("Praca", "Twoi słudzy zadają tylko połowę ran w walce, za to zdobywają dla ciebie dwa razy więcej pieniędzy (uwzględniwszy mniejsze rany).",
1800, "#5c3317");


book[++page] = new Poem ("Grób Agamemnona", "Pod twoją komendę trafiają nowe sługi: trojanie.",
0, "#8E2323");

book[++page] = new Poem ("Godzina myśli", "Na potrzeby zdolności poematów twój Artyzm jest traktowany tak, jakby był o 10 większy.",
3600, "#669999");

book[++page] = new Poem ("Runy", "Kolosy tracą zdolność ataku, ale zapewniają ci Artyzm tak samo, jak harfiarze.",
1800, "#333366");

book[++page] = new Poem ("Beniowski", "Twój atak rośnie o 70 za każdy posiadany przez ciebie punkt Artyzmu.",
60, "#660035");



book[++page] = new Poem ("Ojciec zadżumionych", "Połowa twoich sług (zaokrąglona w górę) ginie. Otrzymujesz trwałą premię do ataku magicznego równą połowie siły ataku zabitych.",
0, "#009966");



book[++page] = new Poem ("Fantazy", "5-krotnie zwiększa szansę na przyjście weny.",
180, "#33FFFF");

	

book[++page] = new Poem ("Arcymistrz", "Twój atak magiczny staje się 2 i pół razy silniejszy kosztem tradycyjnego ataku, którego wartość staje się równa 0.",
900, "#006600");



book[++page] = new Poem ("Kordian", "Jeśli zginiesz w trakcie trwania poematu, zostajesz uratowany i odzyskujesz pełnię witalności. Wówczas działanie poematu dobiega końca.",
1800, "#FF0019");

book[++page] = new Poem ("Irydion", "Na czas trwania poematu trojanie stają się hekatoncheirami. Zyskują ogromną siłę, przyspieszenie ataku oraz pięciokrotnie większą szansę na cios krytyczny. Przy każdym ich uderzeniu istnieje jednak SZALENIE znikoma szansa na to, że sam zostaniesz przez nich zabity.",
600, "#3D203D");

 book[++page] = new Poem ("Meteor", "Natychmiast przechodzisz do kolejnej strofy – i zdobywasz wszystkie pieniędze, które zarobiłbyś po drodze – płacąc za to trwałą utratą 5 punktów Artyzmu.",
 0, "#912700");

book[++page] = new Poem ("Genezis z ducha", "Ilekroć któryś z twych sługów zginie, odradza się w kolejnej, silniejszej postaci.",
10800, "#003399");

// -----------------------------------------
// -----------------------------------------
// -----------------------------------------