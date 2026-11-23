require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Rozpoczynanie seedowania bazy danych...");

  // 1. Upewnij się, że mamy użytkownika-autora dla talii
  let author = await prisma.user.findFirst();

  if (!author) {
    author = await prisma.user.create({
      data: {
        email: "edukacja@quizzinger.pl",
        username: "Quizzinger Edu",
        passwordHash: "$2b$10$epkK.wL11h0M6M8o2hGvF.z3tVdQWwFhZ/7G3o7j1TfS9mFwYn7tW",
        role: "ADMIN",
      },
    });
    console.log(`Utworzono domyślnego użytkownika: ${author.username}`);
  } else {
    console.log(`Użyto istniejącego użytkownika: ${author.username}`);
  }

  // 2. Definicje 5 zestawów fiszek
  const decksData = [
    {
      title: "II Wojna Światowa – Najważniejsze Wydarzenia",
      description: "Historia, II Wojna Światowa, Bitwy, Historia Świata",
      isPublic: true,
      authorId: author.id,
      flashcards: [
        {
          frontText: "W którym roku i od jakiego wydarzenia rozpoczęła się II wojna światowa w Europie?",
          backText: "1 września 1939 roku, od napaści III Rzeszy Niemieckiej na Polskę (atak na Westerplatte i Wieluń).",
          hint: "Wrzesień 1939 r.",
        },
        {
          frontText: "Czym był pakt Ribbentrop-Mołotow i kiedy został podpisany?",
          backText: "Tajny układ o nieagresji między III Rzeszą a ZSRR z tajnym protokołem o podziale stref wpływów w Europie Środkowo-Wschodniej, podpisany 23 sierpnia 1939 r.",
          hint: "Podpisany w Moskwie w sierpniu 1939 r.",
        },
        {
          frontText: "Jaka bitwa powietrzna stoczona w 1940 roku pokrzyżowała niemieckie plany inwazji na Wielką Brytanię?",
          backText: "Bitwa o Anglię (Bitwa o Brytanię) – walczyli w niej wybitni polscy piloci m.in. z Dywizjonu 303.",
          hint: "Lato i jesień 1940 r., RAF vs Luftwaffe.",
        },
        {
          frontText: "Jak nazywała się niemiecka inwazja na Związek Radziecki rozpoczęta 22 czerwca 1941 roku?",
          backText: "Operacja Barbarossa.",
          hint: "Nazwana na cześć średniowiecznego cesarza Fryderyka I Barbarossy.",
        },
        {
          frontText: "Jaki atak doprowadził do bezpośredniego przystąpienia Stanów Zjednoczonych do II wojny światowej?",
          backText: "Japoński atak z zaskoczenia na amerykańską bazę morską Pearl Harbor na Hawajach (7 grudnia 1941 r.).",
          hint: "Dzień, który okrył się hańbą – Pacyfik, Hawaje.",
        },
        {
          frontText: "Jaka bitwa stoczona na przełomie 1942 i 1943 roku uważana jest za punkt zwrotny na froncie wschodnim?",
          backText: "Bitwa pod Stalingradem – zakończona kapitulacją niemieckiej 6. Armii pod dowództwem feldmarszałka Paulusa.",
          hint: "Miasto nad Wołgą.",
        },
        {
          frontText: "Kiedy i gdzie odbyło się lądowanie aliantów w Normandii (D-Day, Operacja Overlord)?",
          backText: "6 czerwca 1944 roku na plażach Normandii we Francji, otwierając drugi front w Europie Zachodniej.",
          hint: "Plaże Omaha, Utah, Sword, Juno, Gold.",
        },
        {
          frontText: "Na jakie dwa japońskie miasta zrzucono bomby atomowe w sierpniu 1945 roku?",
          backText: "Na Hiroszimę (6 sierpnia, bomba Little Boy) oraz Nagasaki (9 sierpnia, bomba Fat Man).",
          hint: "Doprowadziło to do bezwarunkowej kapitulacji Japonii.",
        },
      ],
    },
    {
      title: "Inżynieria Materiałowa – Podstawy i Właściwości",
      description: "Inżynieria Materiałowa, Metalurgia, Polimery, Nanomateriały, Fizyka",
      isPublic: true,
      authorId: author.id,
      flashcards: [
        {
          frontText: "Co to jest wykres równowagi fazowej żelazo-węgiel (Fe-Fe3C)?",
          backText: "Wykres przedstawiający przemiany fazowe zachodzące w stopach żelaza z węglem w funkcji temperatury i zawartości węgla (do 6,67% C).",
          hint: "Podstawa klasyfikacji i obróbki stali oraz żeliw.",
        },
        {
          frontText: "Czym różni się stal od żeliwa pod względem zawartości węgla?",
          backText: "Stal zawiera do ok. 2,11% węgla (jest kowalna i plastyczna), natomiast żeliwo zawiera powyżej 2,11% węgla (jest twardsze i bardziej kruche).",
          hint: "Granicą jest punkt maksymalnej rozpuszczalności węgla w austenicie (2,11%).",
        },
        {
          frontText: "Co to jest hartowanie stali i jaki jest jego główny cel?",
          backText: "Obróbka cieplna polegająca na nagrzaniu stali do temperatury austenityzowania, wytrzymaniu i gwałtownym chłodzeniu w celu uzyskania struktury martenzytycznej o dużej twardości.",
          hint: "Często po nim stosuje się odpuszczanie w celu zmniejszenia kruchości.",
        },
        {
          frontText: "Czym charakteryzuje się statyczna próba rozciągania i jakie kluczowe parametry pozwala wyznaczyć?",
          backText: "Podstawowe badanie niszczące wyznaczające granicę plastyczności (Re), wytrzymałość na rozciąganie (Rm) oraz wydłużenie procentowe (A).",
          hint: "Krzywa naprężenie – odkształcenie.",
        },
        {
          frontText: "Co oznacza pojęcie 'dyslokacja' w krystalografii?",
          backText: "Liniowy defekt struktury krystalicznej (krawędziowy lub śrubowy), którego przemieszczanie się odpowiada za odkształcenie plastyczne metali.",
          hint: "Defekt sieci krystalicznej ułatwiający poślizg płaszczyzn atomowych.",
        },
        {
          frontText: "Czym są materiały kompozytowe?",
          backText: "Materiały niejednorodne składające się z co najmniej dwóch różnych faz: osnowy (matrix) i zbrojenia (reinforcement), łączące najlepsze cechy obu składników.",
          hint: "Przykłady: włókno węglowe (CFRP), laminaty szklane, żelbet.",
        },
        {
          frontText: "Co to jest twardość i jakimi głównymi metodami się ją mierzy?",
          backText: "Opór materiału przed trwałym odkształceniem przy wciskaniu wgłębnika; mierzy się ją metodami Brinella (kulka), Vickersa (ostrosłup diamentowy) i Rockwella (stożek/kulka).",
          hint: "Skale HB, HV, HRC.",
        },
      ],
    },
    {
      title: "Motoryzacja – Budowa i Działanie Samochodu",
      description: "Motoryzacja, Samochody, Mechanika, Silniki, Technika",
      isPublic: true,
      authorId: author.id,
      flashcards: [
        {
          frontText: "Jakie są cztery suwy w klasycznym czterosuwowym silniku tłokowym?",
          backText: "1. Ssanie (dolot mieszanki/powietrza), 2. Sprężanie, 3. Praca (zapłon i rozprężanie), 4. Wydech (usuwanie spalin).",
          hint: "Cykl pracy silnika czterosuwowego.",
        },
        {
          frontText: "Czym różni się zapłon iskrowy (silnik benzynowy) od samoczynnego (silnik Diesla)?",
          backText: "W benzynie mieszanka zapala się od iskry ze świecy zapłonowej, a w Dieslu wtryśnięte paliwo zapala się samoczynnie od wysokiej temperatury mocno sprężonego powietrza.",
          hint: "Świeca zapłonowa vs wysoki stopień sprężania.",
        },
        {
          frontText: "Do czego służy turbosprężarka w silniku spalinowym?",
          backText: "Wykorzystuje energię gazów wylotowych do napędzania wirnika sprężarki, która tłoczy więcej powietrza do cylindrów, zwiększając moc i sprawność silnika.",
          hint: "Doładowanie silnika spalinami.",
        },
        {
          frontText: "Czym jest układ ABS i jakie jest jego główne zadanie podczas hamowania?",
          backText: "Układ zapobiegający blokowaniu kół podczas nagłego hamowania (Anti-Lock Braking System), dzięki czemu kierowca zachowuje sterowność i może ominąć przeszkodę.",
          hint: "Pozwala na skręcanie kołami przy wciśniętym hamulcu do dechy.",
        },
        {
          frontText: "Do czego służy mechanizm różnicowy (dyferencjał)?",
          backText: "Umożliwia kołom tej samej osi napędowej obracanie się z różnymi prędkościami obrotowymi podczas pokonywania zakrętów.",
          hint: "Koło zewnętrzne w zakręcie musi pokonać dłuższą drogę niż wewnętrzne.",
        },
        {
          frontText: "Co oznacza skrót ESP w nowoczesnych samochodach?",
          backText: "Electronic Stability Program – elektroniczny system stabilizacji toru jazdy, który w razie poślizgu selektywnie przyhamowuje pojedyncze koła.",
          hint: "Przeciwdziała podsterowności i nadsterowności.",
        },
        {
          frontText: "Jaka jest kluczowa różnica między momentem obrotowym (Nm) a mocą (KM/kW)?",
          backText: "Moment obrotowy to siła z jaką wał korbowy może obracać koła (odczuwana jako dynamiczny zryw od niskich obrotów), a moc to tempo wykonywania pracy (wpływa na prędkość maksymalną).",
          hint: "Moc = Moment obrotowy × Prędkość obrotowa.",
        },
      ],
    },
    {
      title: "Algorytmy Sortowania – Złożoność i Działanie",
      description: "Algorytmy, Informatyka, Programowanie, Sortowanie, Złożoność",
      isPublic: true,
      authorId: author.id,
      flashcards: [
        {
          frontText: "Jaka jest średnia i pesymistyczna złożoność czasowa algorytmu QuickSort?",
          backText: "Średnia złożoność wynosi O(n log n), natomiast pesymistyczna O(n²) – występuje przy złym doborze elementu osiowego (pivota).",
          hint: "Algorytm oparty na strategii 'dziel i zwyciężaj'.",
        },
        {
          frontText: "Czym charakteryzuje się stabilny algorytm sortowania?",
          backText: "Zachowuje pierwotną, wzajemną kolejność elementów o takich samych kluczach/wartościach.",
          hint: "Równe elementy nie zamieniają się miejscami po sortowaniu.",
        },
        {
          frontText: "Jak działa algorytm Merge Sort (sortowanie przez scalanie) i jaka jest jego złożoność?",
          backText: "Dzieli tablicę rekurencyjnie na połowy do pojedynczych elementów, a potem scala posortowane podciągi. Złożoność wynosi zawsze O(n log n) kosztem pamięci O(n).",
          hint: "Stabilny algorytm typu 'dziel i zwyciężaj'.",
        },
        {
          frontText: "Jaka jest pesymistyczna złożoność czasowa algorytmu Bubble Sort (sortowania bąbelkowego)?",
          backText: "O(n²) – w dwóch zagnieżdżonych pętlach porównuje sąsiednie elementy i zamienia je miejscami.",
          hint: "Najprostszy algorytm szkoleniowy, niezalecany dla dużych zbiorów.",
        },
        {
          frontText: "Czym jest HeapSort (sortowanie przez kopcowanie) i jaka jest jego złożoność?",
          backText: "Sortowanie wykorzystujące strukturę kopca binarnego (max-heap) do wybierania kolejnych elementów największych; złożoność wynosi O(n log n) w każdym przypadku i działa w miejscu O(1).",
          hint: "Drzewiasta struktura kopca w tablicy.",
        },
        {
          frontText: "Kiedy Counting Sort (sortowanie przez zliczanie) osiąga liniową złożoność czasową O(n + k)?",
          backText: "Gdy sortowane elementy to liczby całkowite ze znanego, stosunkowo niewielkiego przedziału od 0 do k.",
          hint: "Algorytm nieporównaniowy zliczający wystąpienia kluczy.",
        },
        {
          frontText: "Dla jakich danych Insertion Sort (sortowanie przez wstawianie) działa w czasie liniowym O(n)?",
          backText: "Dla danych, które są już niemal całkowicie posortowane lub mają małą liczbę inwersji.",
          hint: "Działa podobnie jak układanie kart trzymanych w dłoni.",
        },
      ],
    },
    {
      title: "Świat Mody i Stylu – Historia i Pojęcia",
      description: "Moda, Styl, Design, Haute Couture, Trendy",
      isPublic: true,
      authorId: author.id,
      flashcards: [
        {
          frontText: "Co dokładnie oznacza francuskie pojęcie 'Haute Couture'?",
          backText: "Luksusowe krawiectwo wysokiej klasy – unikatowe kreacje szyte ręcznie na indywidualne zamówienie z najdroższych tkanin, podlegające rygorystycznym kryteriom paryskiego syndykatu.",
          hint: "Prawnie chroniony termin w Paryżu.",
        },
        {
          frontText: "Kto w 1947 roku zaprezentował rewolucyjną kolekcję zwaną 'New Look'?",
          backText: "Christian Dior – kolekcja z mocno zwężoną talią, uwydatnionym biustem i obfitą rozkloszowaną spódnicą przywróciła powojenny szyk.",
          hint: "Słynny francuski dom mody Dior.",
        },
        {
          frontText: "Jaka projektantka stworzyła kultową 'małą czarną' sukienkę oraz perfumy No. 5?",
          backText: "Coco Chanel (Gabrielle Chanel) – zrewolucjonizowała modę kobiecą, wprowadzając wygodę, tweedowe kostiumy i prostotę.",
          hint: "Inicjały CC.",
        },
        {
          frontText: "Czym różni się linia 'Prêt-à-porter' od 'Haute Couture'?",
          backText: "Prêt-à-porter (ready-to-wear) to kolekcje ubrań gotowych do noszenia, produkowanych seryjnie w standardowych rozmiarach i sprzedawanych w butikach.",
          hint: "Masowa lub butikowa produkcja seryjna.",
        },
        {
          frontText: "Kto w 1966 roku zaprojektował słynny damski garnitur wieczorowy 'Le Smoking'?",
          backText: "Yves Saint Laurent (YSL) – przeniósł męski smoking do garderoby kobiecej, wywołując przełom społeczno-modowy.",
          hint: "Legendarny francuski projektant YSL.",
        },
        {
          frontText: "Czym charakteryzuje się moda 'Vintage'?",
          backText: "Noszeniem lub stylizowaniem oryginalnych ubrań i akcesoriów pochodzących z minionych epok (najczęściej mających co najmniej 20-25 lat).",
          hint: "Klasyczne ubrania z historią w opozycji do fast fashion.",
        },
        {
          frontText: "Jakie cztery miasta tworzą tzw. 'Wielką Czwórkę' (Big Four) światowych stolic mody?",
          backText: "Paryż, Mediolan, Londyn i Nowy Jork – to tam dwa razy w roku odbywają się najważniejsze Tygodnie Mody (Fashion Weeks).",
          hint: "Dwa miasta w Europie, jedno w UK, jedno w USA.",
        },
      ],
    },
  ];

  for (const deckData of decksData) {
    const existing = await prisma.deck.findFirst({
      where: { title: deckData.title },
    });

    if (existing) {
      console.log(`Talia już istnieje: "${deckData.title}" (pomijanie)`);
      continue;
    }

    const { flashcards, ...deckInfo } = deckData;

    const created = await prisma.deck.create({
      data: {
        ...deckInfo,
        flashcards: {
          create: flashcards,
        },
      },
      include: {
        _count: { select: { flashcards: true } },
      },
    });

    console.log(
      `✓ Utworzono talię: "${created.title}" (${created._count.flashcards} fiszek)`
    );
  }

  console.log("Seedowanie zakończone sukcesem!");
}

main()
  .catch((e) => {
    console.error("Błąd podczas seedowania:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
