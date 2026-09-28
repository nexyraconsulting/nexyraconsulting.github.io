/* ADDA Slough — shared site data + search. Loaded by SiteHeader and Search pages. */
(function () {
  const M = 'assets/images/';
  const P = { home: 'Home.dc.html', about: 'About.dc.html', events: 'Events.dc.html', reg: 'Registration.dc.html', fest: 'Festivals.dc.html', cult: 'Cultural.dc.html', sport: 'Sports.dc.html', charity: 'Charity.dc.html', a22: 'AddaAid2022.dc.html', a21: 'AddaAid2021.dc.html', a20: 'AddaAid2020.dc.html', media: 'Media.dc.html', print: 'Print.dc.html', digital: 'Digital.dc.html', contact: 'Contact.dc.html', signin: 'SignIn.dc.html', terms: 'Terms.dc.html', privacy: 'Privacy.dc.html', search: 'Search.dc.html' };

  const NAV = [['home', 'Home', P.home], ['about', 'About', P.about], ['events', 'Events', P.events], ['charity', 'Charity', P.charity], ['media', 'Media', P.media], ['contact', 'Contact', P.contact]];

  const FAMILY = [['amf001.jpg', 'Neel, Oindrila, Oviyan & Nimisha'], ['amf002.jpg', 'Prady & Indrani'], ['amf003.jpg', 'Prasenjit & Esha'], ['amf004.jpg', 'Debraj, Chaitali & Reyansh'], ['amf005.jpg', 'Anumita, Tojo & Eshana'], ['amf006.jpg', 'Kiaan, Kiyara, Lahori & Samrat'], ['amf007.jpg', 'Abhishek, Ridhaana & Ritwika'], ['amf008.jpg', 'Deeptanal, Debarati & Devadyuti'], ['amf009.jpg', 'Aritra, Mitul, Anmesh & Anumegha'], ['amf010.jpg', 'Arun, Chameli, Anvita & Anika'], ['amf012.jpg', 'Lisa, Leoan, Monideepa & Utpal'], ['amf013.jpg', 'Arijeet, Bandana & Arunava'], ['amf014.jpg', 'Dhiraj & Noopur'], ['amf015.jpg', 'Abhijit Ayetri & Ananya'], ['amf016.png', 'Sudipta & Suhasini'], ['amf017.png', 'Sandip, Ishita & Vivaan'], ['amf018.jpg', 'Aparajita, Raman, Abhinav & Nayontara'], ['amf019.jpg', 'Suvrasis & Juri'], ['amf020.png', 'Sandip, Monica, Ivy & Adi'], ['amf022.jpg', 'Ishita & Saikat'], ['amf023.jpg', 'Souvik, Malini & Arjun'], ['amf024.jpg', 'Archan, Nabanita & Ayush'], ['amf031.jpg', 'Abhishek Roy'], ['amf032.jpg', 'Paromita, Sourav & Parav'], ['amf033.jpg', 'Sandipan, Ria & Risan'], ['amf034.jpg', 'Munmun, Byomkesh, Koyna & Akshita'], ['amf035.jpg', 'Debalok, Saonli & Diwisha'], ['amf036.jpg', 'Poulami, Virat, Vanshika & Vamika'], ['amf037.jpg', 'VaniShree, Rajamarthandan & Dakshayani'], ['amf038.jpg', 'Arindam, Anushreya, Anahi & Ayra'], ['amf039.jpg', 'Sauvik & Tanisha'], ['amf040.jpg', 'Siddhartha, Pritha & Divisha'], ['apf001.png', 'Abhisek, Ishan & Jessica'], ['apf002.jpg', 'Rupali, Indranil & Ayushman']].map(([f, names]) => ({ img: M + 'org/people/' + f, names }));

  const PROGRAMMES = [['Solo/Group Performance', 'Cultural programme'], ['Antakshari', 'Gaata Rahe Mera Dil'], ['Bollywood Quiz', 'Puchho Zara Puchho'], ['Little Champ', 'Taare Zameen Par'], ['Sit & Draw', 'Satrangi Re'], ['Sharod Shriman & Shrimati', 'Competition'], ['Brain Teaser', 'Bheja Fry']];


  const E = M + 'events/';
  const ev = (base, list) => list.map(([id, title]) => ({ id, title, img: E + base + id + '.jpg' }));
  const ARCH = {
    festivals: { key: 'festivals', title: 'Festivals', href: P.fest, intro: 'Homely and attractive Pujo celebrations upholding Bengal’s tradition and culture in the UK.', subs: [
      { id: 'durga-pujo', title: 'Durga Pujo', img: E + 'festivals/durga-pujo/durga-pujo-2023.jpg', text: [
        'The Durga Puja festival holds immense emotional significance for Bengalis and Indians worldwide, recently acknowledged as a UNESCO World Heritage Festival. In Slough, the organization Adda achieved considerable success by orchestrating the Kali Puja since 2014. Building on this achievement, Adda, with the collective efforts of its members, initiated the inaugural Durga Puja in 2019.',
        'Distinguished for its unique presentation, featuring a Bengal-style pandal in an open ground and a central theme of ‘adda’ (chitchat) adjacent to the pandal at Maddox Square on the premises of Slough Cricket Club, the event resonated remarkably well with devotees. The ambiance and offerings, including authentic Indian food available for purchase, created an environment that transported attendees from London to the heart of Kolkata. The event’s success was further solidified when Adda received the esteemed “Best Durga Puja in UK 2019” award.',
        'In 2020, during the COVID-19 pandemic and the subsequent UK lockdown, Adda took a unique initiative to positively impact the mental well-being of the population. Understanding the significance of the auspicious day of Maha Ashtami during the Durga Puja, Adda organized an online pushpanjali over Zoom. This innovative approach garnered significant attendance and received highly encouraging feedback via social media channels. Despite the prevailing grief and sadness, people felt a sense of positivity through this initiative.',
        'Moving into 2021, with permissions granted for large-scale events, Adda, as a recognized charitable organization, remained committed to its societal responsibilities. Acknowledging the immense impact of the COVID pandemic on lives and livelihoods, Adda themed its Durga Puja as the “Gate of Joy,” inspired by Kolkata’s reputation as the “City of Joy.” Moreover, to enhance the Bengali cultural experience during the festival, Adda hosted live cooking sessions on-site with vendors from Kolkata, India, and Dhaka, Bangladesh. This initiative aimed not only to elevate the “Bengali” essence during the event but also served as a humble effort to foster a bond between the two Bengals transcending borders. The event witnessed an average daily footfall of around 3000-4000 people, accumulating an overall attendance of approximately 12,000 individuals throughout the festival.',
        'In our continuous pursuit of enhancement and uniqueness, Adda aims to make 2022 an exceptionally special year. The idols for this year’s celebration have been sourced from West Bengal and are the largest in size among all the celebrations throughout the UK. Devotees can expect a magnificent spectacle and an extraordinary experience.'
      ], events: ev('festivals/durga-pujo/', [['durga-pujo-2025', 'Durga Pujo 2025'], ['durga-pujo-2024', 'Durga Pujo 2024'], ['durga-pujo-2023', 'Durga Pujo 2023'], ['durga-pujo-2022', 'Durga Pujo 2022'], ['durga-pujo-2021', 'Durga Pujo 2021'], ['durga-pujo-2019', 'Durga Pujo 2019']]) },
      { id: 'kali-pujo', title: 'Kali Pujo', img: E + 'festivals/kali-pujo/kali-pujo-2024.jpg', text: [], events: ev('festivals/kali-pujo/', [['kali-pujo-2025', 'Kali Pujo 2025'], ['kali-pujo-2024', 'Kali Pujo 2024'], ['kali-pujo-2023', 'Kali Pujo 2023'], ['kali-pujo-2022', 'Kali Pujo 2022'], ['kali-pujo-2021', 'Kali Pujo 2021'], ['kali-pujo-2019', 'Kali Pujo 2019']]) },
      { id: 'saraswati-pujo', title: 'Saraswati Pujo', img: E + 'festivals/saraswati-pujo/saraswati-pujo-2025.jpg', text: [], events: ev('festivals/saraswati-pujo/', [['saraswati-pujo-2025', 'Saraswati Pujo 2025']]) }
    ] },
    cultural: { key: 'cultural', title: 'Cultural & Other', href: P.cult, intro: 'Concerts, shows and community gatherings, for friends and for the whole community.', subs: [
      { id: 'cultural', title: 'Cultural', img: E + 'cultural-and-other/cultural/madhubanti-bagchi-2026.jpg', text: [], events: ev('cultural-and-other/cultural/', [['lagnajita-chakraborty-live-2025', 'Lagnajita Chakraborty Live 2025'], ['bangla-nababarsho-and-jojo-mukherjee-concert', 'Bangla Nababarsho & Jojo Mukherjee Concert'], ['somlata-and-the-aces-2024', 'Somlata & The Aces 2024'], ['bengali-nababarsho-2024', 'Bengali Nababarsho 2024'], ['bijoyar-adda-with-anupam-2023', 'Bijoyar Adda with Anupam 2023'], ['bengali-new-year-2023', 'Bengali New Year 2023'], ['adda-bijoya-concert-2022', 'Adda Bijoya Concert 2022'], ['10th-year-celebration-of-adda', '10th Year Celebration of Adda'], ['adda-musical-night-2022', 'Adda Musical Night 2022'], ['grand-bijoya-2021-stereo-nation', 'Grand Bijoya 2021 Stereo Nation'], ['2021-cactus-live-(virtual)-bengali-new-year-celebrations', '2021 Cactus Live (Virtual) Bengali New Year Celebrations'], ['zubeen-garg-concert-(bijoya-2019)', 'Zubeen Garg Concert (Bijoya 2019)']]) },
      { id: 'other', title: 'Other', img: E + 'cultural-and-other.jpg', text: [], events: [] }
    ] },
    sports: { key: 'sports', title: 'Sports & Leisure', href: P.sport, intro: 'Promoting sports by organising Cricket, Football and Badminton tournaments.', subs: [
      { id: 'badminton-and-table-tennis', title: 'Badminton & Table Tennis', img: E + 'sports-and-leisure/badminton-and-table-tennis.jpg', text: [], events: [] },
      { id: 'cricket', title: 'Cricket', img: E + 'sports-and-leisure/cricket.jpg', text: [], events: [] },
      { id: 'football', title: 'Football', img: E + 'sports-and-leisure/football.jpg', text: [], events: [] }
    ] }
  };
  const YEAR_NOTES = { 'durga-pujo-2019': 'Adda’s inaugural Durga Puja: a Bengal-style pandal in an open ground at Slough Cricket Club, with the ‘adda’ theme at Maddox Square. Winner of “Best Durga Puja in UK 2019”.', 'durga-pujo-2021': 'Themed “Gate of Joy”, with live cooking from vendors from Kolkata and Dhaka, and around 12,000 visitors across the festival.', 'durga-pujo-2022': 'Idols sourced from West Bengal, the largest in size among all the celebrations throughout the UK.' };
  Object.values(ARCH).forEach(c => c.subs.forEach(s => s.events.forEach(e => { e.cat = c.key; e.catTitle = c.title; e.catHref = c.href; e.sub = s.id; e.subTitle = s.title; e.href = 'Event.dc.html?id=' + encodeURIComponent(e.id); e.note = YEAR_NOTES[e.id] || ''; })));
  const ALL_EVENTS = Object.values(ARCH).flatMap(c => c.subs.flatMap(s => s.events));

  const I = (section, title, url, desc, kw) => ({ section, title, url, desc, kw: kw || '' });
  const INDEX = [
    I('Page', 'Home', P.home, 'Adda Slough: charitable trust organising charity, cultural and sports events in Slough.', 'welcome start main'),
    I('About', 'About Adda Slough', P.about, 'Our story since August 2012. Charity Registration Number 1183906.', 'history story charity number trust who we are'),
    I('About', 'Our mission', P.about + '#mission', 'Cultural integration, promoting sports and social responsibility.', 'aim goals values'),
    I('About', 'Adda Slough in numbers', P.about + '#metrics', '84 events and 9,200 followers.', 'metrics stats followers'),
    I('About', 'ADDA Family', P.about + '#family', 'The 34 families behind Adda Slough.', 'people team members committee volunteers trustees'),
    I('Events', 'Upcoming events', P.events, 'Durga Pujo 2026 and Madhubanti Bagchi live.', 'whats on calendar schedule dates'),
    I('Events', 'Durga Pujo 2026', P.events + '#durga-pujo', '16–20 October 2026 · Slough Cricket Club, Upton Court Road, SL3 7LT.', 'puja festival october pandal bhog prasad'),
    I('Events', 'Sponsor Bhog', P.events + '#bhog', 'Bhog + Puja + Meal £61 per family (max 2 adults & 2 kids).', 'donate offering prasad sponsor food meal'),
    I('Events', 'Madhubanti Bagchi 2026', P.events + '#madhubanti-bagchi', '31 October 2026, 18:00–22:00 · Hexagon, Reading.', 'concert music singer bollywood tickets live show aaj ki raat alrich'),
    I('Forms', 'Durga Pujo 2026 programme registration', P.reg, 'Register to perform or compete at Durga Pujo 2026.', 'register sign up form perform compete talent stage entry'),
    ...PROGRAMMES.map(([n, s]) => I('Forms', n + ' · ' + s, P.reg + '#programmes', 'Durga Pujo 2026 programme. Register online.', 'programme competition register')),
    I('Events', 'Satrangi Re: Sit & Draw 2026', P.reg + '#programmes', 'Drawing and colouring competition for young artists.', 'kids children art drawing colouring'),
    I('Events', 'Srimaan & Srimoti 2026', P.reg + '#programmes', 'Pujo personality titles celebrating style.', 'fashion style competition'),
    I('Events', 'Memory Game Competition', P.reg + '#programmes', 'Pujo te brain-ero ekto pujo hok! Test your memory this Durga Puja.', 'brain game quiz couples'),
    I('Past events', 'Festivals', P.fest, 'Durga Pujo, Kali Pujo and Saraswati Pujo through the years.', 'archive history puja pujo'),
    I('Past events', 'Durga Pujo archive', P.fest + '#durga-pujo', 'Past Durga Pujo celebrations.', 'puja durga'),
    I('Past events', 'Kali Pujo', P.fest + '#kali-pujo', 'Kali Pujo celebrations.', 'puja kali diwali'),
    I('Past events', 'Saraswati Pujo', P.fest + '#saraswati-pujo', 'Saraswati Pujo celebrations.', 'puja saraswati'),
    I('Past events', 'Cultural & Other', P.cult, 'Concerts, shows and community gatherings.', 'music concert culture'),
    I('Past events', 'Sports & Leisure', P.sport, 'Cricket, football, badminton and table tennis.', 'sport games tournament'),
    I('Past events', 'Cricket', P.sport + '#cricket', 'ADDA cricket tournaments.', 'sport tournament'),
    I('Past events', 'Football', P.sport + '#football', 'ADDA football tournaments.', 'sport soccer tournament'),
    I('Past events', 'Badminton & Table Tennis', P.sport + '#badminton-and-table-tennis', 'Badminton and table tennis tournaments.', 'sport tournament ping pong'),
    I('Charity', 'Adda Aid', P.charity, 'How Adda Slough gives back to the community.', 'charity donate help relief'),
    I('Charity', 'Covid-19 support in Slough', P.charity + '#covid', 'Food, essentials and medicines delivered with partners: 50,000 people reached.', 'coronavirus pandemic food bank mitra mandal sewa day thames valley police'),
    I('Charity', 'Cyclone Amphan relief', P.charity + '#amphan', 'Relief in the Sundarbans with Kolkata Mary Ward Social Centre.', 'sundarban bengal kmwsc flood'),
    I('Charity', 'College Street books appeal', P.charity + '#books', 'Helping reprint textbooks lost at Kolkata’s Boi Para.', 'boi para kolkata publishers'),
    I('Charity', 'Adda Aid 2022', P.a22, 'Adda Aid, 2022.', 'charity 2022'),
    I('Charity', 'Adda Aid 2021', P.a21, 'Adda Aid, 2021.', 'charity 2021'),
    I('Charity', 'Adda Aid 2020', P.a20, 'Covid-19 support and Cyclone Amphan relief, 2020.', 'charity 2020 covid amphan'),
    I('Media', 'Media coverage', P.media, 'ADDA in print and digital media.', 'news press coverage'),
    I('Media', 'Print coverage', P.print, 'Times of India, Anandabazar, Bangla Post, Asian Voice, Slough Observer.', 'newspaper press clipping'),
    I('Media', 'The Times of India · Sep 2025', P.print + '#times-of-india', 'Durga Puja celebrations unite Bengali diaspora in England.', 'toi newspaper'),
    I('Media', 'Anandabazar · May 2023', P.print + '#anandabazar', 'Feature on Pujo in London (Bengali).', 'bengali newspaper'),
    I('Media', 'Bangla Post', P.print + '#bangla-post', 'Coverage in 2019, 2021 and 2022.', 'newspaper'),
    I('Media', 'Asian Voice · Oct 2020', P.print + '#asian-voice', 'Print coverage of ADDA Slough.', 'newspaper'),
    I('Media', 'Digital coverage', P.digital, 'ABP News, Republic Bangla TV, S NEWZ and our YouTube channel.', 'tv video online youtube'),
    I('Media', 'YouTube channel', 'https://www.youtube.com/@addaslough5239', 'Watch ADDA videos on YouTube.', 'video watch'),
    I('Contact', 'Contact us', P.contact, '31 Finefield Walk, Slough SL1 2QR · addasloughinformation@gmail.com', 'email phone call address help enquiry'),
    I('Forms', 'Membership form', P.contact + '#membership', 'Become a member of Adda Slough.', 'join member volunteer'),
    I('Forms', 'Sponsorship form', P.contact + '#sponsorship', 'Sponsor an event or book a stall.', 'sponsor stall business advertise'),
    I('Forms', 'Enquiry form', P.contact + '#enquiry', 'Send us a question or message.', 'question message help'),
    I('Page', 'Sign in', P.signin, 'Member and registration sign-in.', 'login account password edit registration'),
    I('Page', 'Terms & Conditions', P.terms, 'Terms of use for adda-slough.org.', 'legal terms'),
    I('Page', 'Privacy Policy', P.privacy, 'How we handle your data.', 'legal data gdpr cookies'),
    ...ALL_EVENTS.map(e => I('Past events', e.title, e.href, e.subTitle + ' · ' + e.catTitle, e.note + ' archive photos')),
    I('Past events', 'Other events', P.cult + '#other', 'Other community events.', 'picnic gathering'),
    I('Media', 'ABP News video', P.digital + '#abp-news', 'Watch ABP News coverage of Adda Slough (August 2022).', 'video tv watch'),
    ...FAMILY.map(f => I('ADDA Family', f.names, P.about + '#family', 'Member of the ADDA Family.', 'family people'))
  ];

  const SYN = { pujo: ['puja', 'durga', 'kali', 'saraswati'], puja: ['pujo'], pooja: ['pujo', 'puja', 'durga'], poojo: ['pujo', 'durga'], puja2: [], durgapuja: ['durga', 'pujo'], durgapujo: ['durga', 'pujo'], durgapooja: ['durga', 'pujo'], kalipuja: ['kali'], saraswatipuja: ['saraswati'], bhogo: ['bhog'], prashad: ['prasad', 'bhog'], prasadam: ['bhog'], adda: ['about', 'home'], donate: ['charity', 'aid', 'sponsor', 'bhog'], donation: ['charity', 'aid'], give: ['charity', 'donate'], help: ['charity', 'contact', 'aid'], photo: ['family', 'media', 'print'], photos: ['family', 'media'], gallery: ['media', 'family', 'festivals'], picture: ['media', 'family'], video: ['youtube', 'digital'], watch: ['youtube', 'digital'], tv: ['digital'], news: ['media', 'press', 'print'], newspaper: ['print'], article: ['print', 'media'], call: ['phone', 'contact'], mail: ['email', 'contact'], join: ['membership', 'register'], signup: ['register', 'membership'], login: ['sign', 'signin'], music: ['concert', 'madhubanti', 'cultural'], song: ['madhubanti', 'antakshari'], sing: ['antakshari', 'performance'], dance: ['performance'], show: ['concert', 'cultural'], sport: ['cricket', 'football', 'badminton'], sports: ['cricket', 'football', 'badminton'], game: ['memory', 'quiz', 'sports'], kids: ['little', 'draw', 'children'], children: ['kids', 'draw', 'little'], child: ['kids', 'draw'], food: ['bhog', 'prasad', 'meal'], ticket: ['madhubanti', 'concert'], tickets: ['madhubanti', 'concert'], team: ['family', 'trustees'], people: ['family'], member: ['membership', 'family'], volunteer: ['membership', 'enquiry'], stall: ['sponsorship'], venue: ['address', 'cricket', 'hexagon'], directions: ['address', 'venue'], location: ['address'], covid: ['aid', '2020'], cyclone: ['amphan'], cookie: ['privacy'], cookies: ['privacy'], data: ['privacy'], legal: ['terms', 'privacy'], diwali: ['kali'], festival: ['festivals', 'pujo'], history: ['festivals', 'about', 'archive'], past: ['archive', 'festivals'] };

  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’'&]/g, ' ').replace(/[^a-z0-9\u0980-\u09ff]+/g, ' ').trim();
  const lev = (a, b) => { if (Math.abs(a.length - b.length) > 2) return 9; let p = Array.from({ length: b.length + 1 }, (_, i) => i); for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[b.length]; };
  INDEX.forEach(it => { it._t = norm(it.title); it._tw = it._t.split(' '); it._k = norm(it.kw + ' ' + it.section); it._d = norm(it.desc); it._all = (it._t + ' ' + it._k + ' ' + it._d).split(' '); });

  function direct(it, t) {
    if (it._tw.some(w => w.startsWith(t))) return 10;
    if (it._t.includes(t)) return 7;
    if (it._k.split(' ').some(w => w.startsWith(t))) return 5;
    if (it._d.includes(t)) return 3;
    return 0;
  }
  function loose(it, t) {
    let s = 0;
    (SYN[t] || []).forEach(x => { const d = direct(it, x); if (d) s = Math.max(s, d * 0.5); });
    if (t.length >= 4) { const tol = t.length >= 5 ? 2 : 1; if (it._all.some(w => w.length >= 3 && lev(t, w.slice(0, t.length + 1)) <= tol || lev(t, w) <= tol)) s = Math.max(s, 2.5); }
    return s;
  }
  function search(q, limit) {
    const toks = norm(q).split(' ').filter(Boolean);
    if (!toks.length) return { q, exact: [], related: [] };
    const exact = [], related = [];
    INDEX.forEach(it => {
      let all = true, score = 0, any = 0;
      toks.forEach(t => { const d = direct(it, t); if (d) { score += d; any++; } else { all = false; const l = loose(it, t); if (l) { score += l; any++; } } });
      if (it.section === 'ADDA Family') score -= 1;
      if (all) exact.push({ it, score }); else if (any) related.push({ it, score: score * (any / toks.length) });
    });
    const out = a => a.sort((x, y) => y.score - x.score).slice(0, limit || 50).map(x => x.it);
    return { q, exact: out(exact), related: out(related) };
  }

  window.ADDA = { M, P, NAV, FAMILY, PROGRAMMES, INDEX, search, ARCH, ALL_EVENTS, SPONSORS: [] };
  window.dispatchEvent(new Event('adda-ready'));
})();
