/* NEXCut prototype data + engine.
   SAMPLE DATA ONLY. In production these come from Supabase:
   businesses/locations/services/staff tables and the get_availability() RPC.
   The availability logic below mirrors the planned server function so it can be ported 1:1. */
(function () {
  const p = n => Math.round(n * 100);
  const CATS = [
    { id: 'hair', name: 'Hair', label: 'Hair salon', img: '1560869713-7d0a29430803' },
    { id: 'barber', name: 'Barber', label: 'Barbershop', img: '1503951914875-452162b0f3f1' },
    { id: 'nails', name: 'Nails', label: 'Nail salon', img: '1604654894610-df63bc536371' },
    { id: 'spa', name: 'Spa', label: 'Spa & wellness', img: '1544161515-4ab6ce6db874' },
    { id: 'beauty', name: 'Beauty', label: 'Beauty & aesthetics', img: '1570172619644-dfd03ed5d881' }
  ];
  const H = (o, c) => [o, c];
  const week = (map) => { const h = {}; for (let d = 0; d < 7; d++) h[d] = map[d] || null; return h; };
  const S = (id, group, name, dur, price, extra) => Object.assign({ id, group, name, dur, price: p(price), deposit: 0, desc: '' }, extra || {});

  const B = [
    {
      id: 'b1', publicId: 'NC-000123', slug: 'marlowe-street-studio', status: 'published', name: 'Marlowe Street Studio', cat: 'hair',
      desc: 'Unisex salon for precision cuts, lived-in colour and treatments. Free consultations before any colour service.',
      addr: '14 High Street', town: 'Slough', pc: 'SL1 1EL', lat: 51.5106, lng: -0.5935, phone: '01632 960 101', web: 'marlowestreet.example',
      img: '1560869713-7d0a29430803', rating: { avg: 4.8, count: 126 }, multi: true,
      hours: week({ 2: H('09:00', '18:00'), 3: H('09:00', '18:00'), 4: H('09:00', '20:00'), 5: H('09:00', '18:00'), 6: H('09:00', '17:00') }),
      policy: { cancelHours: 24, late: 'If you arrive more than 15 minutes late we may need to shorten or rebook your appointment.', deposit: 'Colour services need a deposit, deducted from your bill.' },
      amenities: ['Step-free access', 'Card and contactless', 'Wi-Fi', 'Kids welcome'],
      services: [
        S('s1', 'Cuts & styling', 'Cut & blow-dry', 60, 48, { desc: 'Consultation, wash, precision cut and finish.' }),
        S('s2', 'Cuts & styling', 'Wash & cut', 45, 38),
        S('s3', 'Cuts & styling', 'Blow-dry', 30, 26),
        S('s4', 'Cuts & styling', 'Kids cut (under 12)', 30, 18),
        S('s5', 'Colour', 'Full head colour', 120, 95, { deposit: p(20), desc: 'Single permanent colour, root to tip. Patch test 48 hours before.' }),
        S('s6', 'Colour', 'Balayage', 180, 145, { deposit: p(30), promo: p(125) }),
        S('s7', 'Colour', 'Root touch-up', 75, 60, { deposit: p(15) }),
        S('s8', 'Treatments', 'Bond repair treatment', 30, 25)
      ],
      staff: [
        { id: 'st1', name: 'Amara Okafor', role: 'Senior stylist', svc: 'all' },
        { id: 'st2', name: 'Daniel Reyes', role: 'Colourist', svc: ['s3', 's5', 's6', 's7', 's8'] },
        { id: 'st3', name: 'Sophie Lin', role: 'Stylist', svc: ['s1', 's2', 's3', 's4', 's8'], days: [2, 3, 4, 6] }
      ],
      reviews: [
        { name: 'Priya S.', rating: 5, date: '2026-09-28', svc: 'Balayage', body: 'Daniel listened, explained the process and the result is exactly what I asked for.' },
        { name: 'James T.', rating: 5, date: '2026-09-14', svc: 'Cut & blow-dry', body: 'On time, relaxed and a sharp cut. Booking took a minute.' },
        { name: 'Hannah W.', rating: 4, date: '2026-08-30', svc: 'Kids cut', body: 'Patient with my son. Busy on Saturdays, so book ahead.' }
      ]
    },
    {
      id: 'b2', publicId: 'NC-000131', slug: 'fade-and-co-barbers', status: 'published', name: 'Fade & Co Barbers', cat: 'barber',
      desc: 'Skin fades, classic cuts and hot towel shaves. Walk-ins when the diary allows.',
      addr: '82 Windsor Road', town: 'Slough', pc: 'SL1 2EJ', lat: 51.5052, lng: -0.5958, phone: '01632 960 214', web: '',
      img: '1503951914875-452162b0f3f1', rating: { avg: 4.7, count: 212 }, multi: true,
      hours: week({ 0: H('10:00', '16:00'), 1: H('09:00', '19:00'), 2: H('09:00', '19:00'), 3: H('09:00', '19:00'), 4: H('09:00', '19:00'), 5: H('09:00', '19:00'), 6: H('08:00', '18:00') }),
      policy: { cancelHours: 2, late: 'More than 10 minutes late and we will offer the next free chair.', deposit: '' },
      amenities: ['Walk-ins welcome', 'Card and contactless', 'Late opening'],
      services: [
        S('s1', 'Cuts', 'Skin fade', 40, 24),
        S('s2', 'Cuts', "Men's haircut", 30, 20),
        S('s3', 'Cuts', 'Kids cut (under 12)', 25, 15),
        S('s4', 'Beard & shave', 'Beard trim & line-up', 15, 12),
        S('s5', 'Beard & shave', 'Hot towel shave', 30, 22),
        S('s6', 'Packages', 'Cut & beard', 50, 32)
      ],
      staff: [
        { id: 'st1', name: 'Marcus Bell', role: 'Barber', svc: 'all' },
        { id: 'st2', name: 'Idris Khan', role: 'Barber', svc: 'all', days: [1, 2, 3, 5, 6] },
        { id: 'st3', name: 'Tom Walsh', role: 'Junior barber', svc: ['s2', 's3', 's4'] }
      ],
      reviews: [
        { name: 'Ollie R.', rating: 5, date: '2026-10-04', svc: 'Skin fade', body: 'Best fade in Slough. Marcus takes his time.' },
        { name: 'Kwame A.', rating: 4, date: '2026-09-21', svc: 'Cut & beard', body: 'Good cut, slight wait past my slot.' }
      ]
    },
    {
      id: 'b3', publicId: 'NC-000140', slug: 'polished-nail-lounge', status: 'published', name: 'Polished Nail Lounge', cat: 'nails',
      desc: 'Gel, BIAB and extensions in a calm studio off Peascod Street. Vegan-friendly product range.',
      addr: '21 Peascod Street', town: 'Windsor', pc: 'SL4 1DU', lat: 51.4818, lng: -0.611, phone: '01632 960 318', web: 'polishedwindsor.example',
      img: '1604654894610-df63bc536371', rating: { avg: 4.9, count: 88 }, multi: true,
      hours: week({ 0: H('11:00', '17:00'), 1: H('10:00', '19:00'), 2: H('10:00', '19:00'), 3: H('10:00', '19:00'), 4: H('10:00', '20:00'), 5: H('10:00', '19:00'), 6: H('09:00', '18:00') }),
      policy: { cancelHours: 24, late: 'Arriving over 15 minutes late may mean a shorter treatment.', deposit: 'Extensions need a £10 deposit.' },
      amenities: ['Vegan products', 'Card and contactless', 'Step-free access'],
      services: [
        S('s1', 'Hands', 'Gel manicure', 45, 30),
        S('s2', 'Hands', 'BIAB overlay', 60, 40),
        S('s3', 'Extensions', 'Acrylic full set', 90, 45, { deposit: p(10) }),
        S('s4', 'Extensions', 'Gel nail extensions', 90, 50, { deposit: p(10) }),
        S('s5', 'Feet', 'Gel pedicure', 60, 38),
        S('s6', 'Extras', 'Nail art (per set)', 20, 10),
        S('s7', 'Extras', 'Gel removal', 20, 10)
      ],
      staff: [
        { id: 'st1', name: 'Mei Tanaka', role: 'Nail technician', svc: 'all' },
        { id: 'st2', name: 'Lucy Harper', role: 'Nail technician', svc: ['s1', 's2', 's5', 's6', 's7'], days: [1, 3, 4, 5, 6] }
      ],
      reviews: [
        { name: 'Ella M.', rating: 5, date: '2026-10-02', svc: 'Gel nail extensions', body: 'Neat, strong and lasted three weeks.' },
        { name: 'Sana K.', rating: 5, date: '2026-09-19', svc: 'BIAB overlay', body: 'Mei is meticulous. Lovely quiet studio.' }
      ]
    },
    {
      id: 'b4', publicId: 'NC-000152', slug: 'thames-calm-spa', status: 'published', name: 'Thames Calm Spa', cat: 'spa',
      desc: 'Riverside treatment rooms for massage, facials and half-day packages.',
      addr: '3 Thames Side', town: 'Windsor', pc: 'SL4 1QN', lat: 51.4851, lng: -0.608, phone: '01632 960 422', web: 'thamescalm.example',
      img: '1544161515-4ab6ce6db874', rating: { avg: 4.6, count: 64 }, multi: false,
      hours: week({ 0: H('09:00', '18:00'), 1: H('09:00', '20:00'), 2: H('09:00', '20:00'), 3: H('09:00', '20:00'), 4: H('09:00', '20:00'), 5: H('09:00', '20:00'), 6: H('09:00', '18:00') }),
      policy: { cancelHours: 48, late: 'Late arrivals finish at the booked time so the next guest is not delayed.', deposit: 'All treatments need a deposit.' },
      amenities: ['Changing rooms', 'Showers', 'Parking nearby', 'Card and contactless'],
      services: [
        S('s1', 'Massage', 'Swedish massage', 60, 70, { deposit: p(20) }),
        S('s2', 'Massage', 'Deep tissue massage', 60, 80, { deposit: p(20) }),
        S('s3', 'Massage', 'Hot stone massage', 75, 90, { deposit: p(25) }),
        S('s4', 'Facials', 'Signature facial', 60, 75, { deposit: p(20) }),
        S('s5', 'Packages', 'Half-day spa package', 180, 185, { deposit: p(50), desc: 'Massage, facial and use of the relaxation room.' })
      ],
      staff: [
        { id: 'st1', name: 'Elena Popescu', role: 'Senior therapist', svc: 'all' },
        { id: 'st2', name: 'Grace Mensah', role: 'Massage therapist', svc: ['s1', 's2', 's3'] },
        { id: 'st3', name: 'Hannah Cole', role: 'Skin therapist', svc: ['s4'], days: [3, 4, 5, 6, 0] }
      ],
      reviews: [
        { name: 'Laura B.', rating: 5, date: '2026-09-27', svc: 'Hot stone massage', body: 'Properly relaxing, and the room looks onto the river.' },
        { name: 'Tom H.', rating: 4, date: '2026-09-02', svc: 'Deep tissue massage', body: 'Firm pressure as requested. Parking is a short walk.' }
      ]
    },
    {
      id: 'b5', publicId: 'NC-000167', slug: 'lumiere-skin-beauty', status: 'published', name: 'Lumière Skin & Beauty', cat: 'beauty',
      desc: 'Brows, lashes, waxing and advanced facials in central Maidenhead.',
      addr: '47 Queen Street', town: 'Maidenhead', pc: 'SL6 1LT', lat: 51.5221, lng: -0.7196, phone: '01632 960 509', web: '',
      img: '1570172619644-dfd03ed5d881', rating: { avg: 4.8, count: 41 }, multi: true,
      hours: week({ 2: H('10:00', '18:00'), 3: H('10:00', '18:00'), 4: H('10:00', '19:00'), 5: H('10:00', '18:00'), 6: H('09:00', '17:00') }),
      policy: { cancelHours: 24, late: 'Treatments may be shortened if you arrive late.', deposit: 'HydraFacial needs a deposit.' },
      amenities: ['Card and contactless', 'Patch tests available'],
      services: [
        S('s1', 'Brows & lashes', 'Brow shape & tint', 30, 22),
        S('s2', 'Brows & lashes', 'Lash lift & tint', 60, 48),
        S('s3', 'Facials', 'HydraFacial', 60, 95, { deposit: p(25) }),
        S('s4', 'Facials', 'Dermaplaning', 45, 55),
        S('s5', 'Waxing', 'Full leg wax', 45, 35)
      ],
      staff: [
        { id: 'st1', name: 'Zara Ahmed', role: 'Beauty therapist', svc: 'all' },
        { id: 'st2', name: 'Chloe Bennett', role: 'Brow & lash artist', svc: ['s1', 's2'] }
      ],
      reviews: [{ name: 'Aisha R.', rating: 5, date: '2026-09-30', svc: 'Lash lift & tint', body: 'Natural result, exactly what I wanted.' }]
    },
    {
      id: 'b6', publicId: 'NC-000188', slug: 'langley-cuts', status: 'published', name: 'Langley Cuts', cat: 'barber',
      desc: 'Neighbourhood barber by Langley station.',
      addr: '9 Station Road', town: 'Langley', pc: 'SL3 8BT', lat: 51.5086, lng: -0.5427, phone: '01632 960 611', web: '',
      img: '1585747860715-2ba37e788b70', rating: null, multi: true,
      hours: week({ 1: H('09:00', '18:00'), 2: H('09:00', '18:00'), 3: H('09:00', '18:00'), 4: H('09:00', '18:00'), 5: H('09:00', '18:00'), 6: H('09:00', '16:00') }),
      policy: { cancelHours: 2, late: 'Over 10 minutes late may need to rebook.', deposit: '' },
      amenities: ['Walk-ins welcome', 'Cash and card'],
      services: [S('s1', 'Cuts', 'Fade', 35, 20), S('s2', 'Cuts', "Men's haircut", 30, 17), S('s3', 'Beard', 'Beard trim', 15, 10)],
      staff: [{ id: 'st1', name: 'Ahmed Siddiqui', role: 'Owner & barber', svc: 'all' }],
      reviews: []
    },
    {
      id: 'b7', publicId: 'NC-000194', slug: 'the-colour-room-reading', status: 'published', name: 'The Colour Room', cat: 'hair',
      desc: 'Colour specialists: balayage, corrective colour and glossing.',
      addr: '18 Friar Street', town: 'Reading', pc: 'RG1 1DB', lat: 51.4568, lng: -0.9737, phone: '01632 960 702', web: 'colourroom.example',
      img: '1562322140-8baeececf3df', rating: { avg: 4.7, count: 153 }, multi: true,
      hours: week({ 2: H('09:30', '18:00'), 3: H('09:30', '18:00'), 4: H('09:30', '20:00'), 5: H('09:30', '18:00'), 6: H('09:00', '17:00') }),
      policy: { cancelHours: 48, late: 'Colour appointments more than 15 minutes late will be rebooked.', deposit: 'Colour services need a deposit.' },
      amenities: ['Card and contactless', 'Wi-Fi'],
      services: [
        S('s1', 'Cuts', 'Cut & finish', 60, 55), S('s2', 'Cuts', 'Gents cut', 30, 30),
        S('s3', 'Colour', 'Full colour', 120, 105, { deposit: p(25) }), S('s4', 'Colour', 'Balayage', 180, 165, { deposit: p(40) }),
        S('s5', 'Colour', 'Toner & gloss', 45, 45)
      ],
      staff: [{ id: 'st1', name: 'Ruth Adeyemi', role: 'Colour director', svc: 'all' }, { id: 'st2', name: 'Jamie Clarke', role: 'Stylist', svc: ['s1', 's2', 's5'] }],
      reviews: [{ name: 'Megan F.', rating: 5, date: '2026-09-25', svc: 'Balayage', body: 'Corrected a bad box dye. Honest about what was possible.' }]
    },
    {
      id: 'b8', publicId: 'NC-000203', slug: 'soho-nail-bar', status: 'published', name: 'Soho Nail Bar', cat: 'nails',
      desc: 'Quick, precise nails in the middle of Soho. Express services at lunchtime.',
      addr: '26 Old Compton Street', town: 'London', pc: 'W1D 4TT', lat: 51.5134, lng: -0.1318, phone: '020 7946 0812', web: '',
      img: '1604654894610-df63bc536371', rating: { avg: 4.5, count: 301 }, multi: true,
      hours: week({ 0: H('11:00', '18:00'), 1: H('09:00', '21:00'), 2: H('09:00', '21:00'), 3: H('09:00', '21:00'), 4: H('09:00', '21:00'), 5: H('09:00', '21:00'), 6: H('10:00', '20:00') }),
      policy: { cancelHours: 12, late: 'More than 10 minutes late may mean a rebooking.', deposit: 'Extensions need a deposit.' },
      amenities: ['Late opening', 'Card and contactless'],
      services: [
        S('s1', 'Hands', 'Express gel manicure', 30, 28), S('s2', 'Hands', 'Gel manicure', 45, 35),
        S('s3', 'Extensions', 'Gel nail extensions', 75, 55, { deposit: p(10) }), S('s4', 'Feet', 'Gel pedicure', 60, 42)
      ],
      staff: [{ id: 'st1', name: 'Ana Silva', role: 'Nail technician', svc: 'all' }, { id: 'st2', name: 'Priya Nair', role: 'Nail technician', svc: 'all' }, { id: 'st3', name: 'Kim Le', role: 'Nail technician', svc: ['s1', 's2', 's4'] }],
      reviews: [{ name: 'Jo P.', rating: 4, date: '2026-10-06', svc: 'Express gel manicure', body: 'In and out in 30 minutes. Exactly what lunch breaks need.' }]
    },
    {
      id: 'b9', publicId: 'NC-000210', slug: 'haven-day-spa', status: 'published', name: 'Haven Day Spa', cat: 'spa',
      desc: 'Massage, reflexology and facials near Borough Market.',
      addr: '7 Park Street', town: 'London', pc: 'SE1 9AB', lat: 51.5065, lng: -0.0935, phone: '020 7946 0927', web: 'havenspa.example',
      img: '1540555700478-4be289fbecef', rating: { avg: 4.7, count: 97 }, multi: false,
      hours: week({ 0: H('10:00', '18:00'), 1: H('10:00', '21:00'), 2: H('10:00', '21:00'), 3: H('10:00', '21:00'), 4: H('10:00', '21:00'), 5: H('10:00', '21:00'), 6: H('09:00', '19:00') }),
      policy: { cancelHours: 24, late: 'Treatments end at the booked time.', deposit: 'Massages need a deposit.' },
      amenities: ['Showers', 'Changing rooms', 'Card and contactless'],
      services: [
        S('s1', 'Massage', 'Aromatherapy massage', 60, 85, { deposit: p(25) }), S('s2', 'Massage', 'Deep tissue massage', 90, 115, { deposit: p(30) }),
        S('s3', 'Facials', 'Express facial', 30, 45), S('s4', 'Holistic', 'Reflexology', 45, 60)
      ],
      staff: [{ id: 'st1', name: 'Sarah Mitchell', role: 'Therapist', svc: 'all' }, { id: 'st2', name: 'Oliver Grant', role: 'Massage therapist', svc: ['s1', 's2', 's4'] }],
      reviews: [{ name: 'Daniel C.', rating: 5, date: '2026-09-18', svc: 'Deep tissue massage', body: 'Sorted out a stiff back from too much desk time.' }]
    },
    {
      id: 'b10', publicId: 'NC-000216', slug: 'eton-grooming-rooms', status: 'published', name: 'Eton Grooming Rooms', cat: 'barber',
      desc: "Traditional gentleman's barber on Eton High Street.",
      addr: '64 High Street', town: 'Eton', pc: 'SL4 6AA', lat: 51.4912, lng: -0.6087, phone: '01632 960 845', web: '',
      img: '1593702275687-f8b402bf1fb5', rating: { avg: 4.9, count: 58 }, multi: true,
      hours: week({ 2: H('09:00', '18:00'), 3: H('09:00', '18:00'), 4: H('09:00', '18:00'), 5: H('09:00', '18:00'), 6: H('08:30', '16:00') }),
      policy: { cancelHours: 12, late: 'Over 10 minutes late may need to rebook.', deposit: '' },
      amenities: ['Card and contactless'],
      services: [S('s1', 'Cuts', "Gentleman's cut", 45, 32), S('s2', 'Shaves', 'Cut & hot towel shave', 75, 52), S('s3', 'Beard', 'Beard sculpt', 30, 20)],
      staff: [{ id: 'st1', name: 'William Hart', role: 'Master barber', svc: 'all' }, { id: 'st2', name: 'Sam Osei', role: 'Barber', svc: 'all', days: [3, 4, 5, 6] }],
      reviews: [{ name: 'Robert L.', rating: 5, date: '2026-09-12', svc: 'Cut & hot towel shave', body: 'Unhurried and precise.' }]
    },
    {
      id: 'b11', publicId: 'NC-000221', slug: 'brow-and-lash-studio', status: 'published', name: 'Brow & Lash Studio', cat: 'beauty',
      desc: 'Lamination, HD brows and lash extensions.',
      addr: '211 Farnham Road', town: 'Slough', pc: 'SL2 1HA', lat: 51.5251, lng: -0.6086, phone: '01632 960 933', web: '',
      img: '1616394584738-fc6e612e71b9', rating: { avg: 4.6, count: 33 }, multi: true,
      hours: week({ 1: H('10:00', '18:00'), 3: H('10:00', '19:00'), 4: H('10:00', '19:00'), 5: H('10:00', '18:00'), 6: H('09:00', '16:00') }),
      policy: { cancelHours: 24, late: 'Arriving over 10 minutes late may need a rebooking.', deposit: 'Lash extensions need a deposit.' },
      amenities: ['Patch tests available', 'Card and contactless'],
      services: [S('s1', 'Brows', 'Brow lamination', 45, 40), S('s2', 'Brows', 'HD brows', 45, 35), S('s3', 'Lashes', 'Classic lash extensions', 90, 60, { deposit: p(15) }), S('s4', 'Lashes', 'Lash infill', 60, 40)],
      staff: [{ id: 'st1', name: 'Nadia Rahman', role: 'Owner & artist', svc: 'all' }],
      reviews: [{ name: 'Fatima H.', rating: 5, date: '2026-10-01', svc: 'Brow lamination', body: 'Clean studio, careful work.' }]
    },
    {
      id: 'b12', publicId: 'NC-000229', slug: 'new-leaf-salon', status: 'review', name: 'New Leaf Salon', cat: 'hair',
      desc: 'Awaiting platform review. Must not appear in search.', addr: '3 Bath Road', town: 'Slough', pc: 'SL1 3UA', lat: 51.512, lng: -0.61,
      phone: '', web: '', img: '', rating: null, multi: true, hours: week({ 1: H('09:00', '17:00') }), policy: { cancelHours: 24, late: '', deposit: '' }, amenities: [],
      services: [S('s1', 'Cuts', 'Haircut', 45, 30)], staff: [{ id: 'st1', name: 'Staff', role: '', svc: 'all' }], reviews: []
    }
  ];

  const TOWNS = { slough: [51.5105, -0.595], windsor: [51.4816, -0.6097], eton: [51.4925, -0.6093], maidenhead: [51.5225, -0.7197], langley: [51.5085, -0.5427], reading: [51.4543, -0.9781], london: [51.5074, -0.1278], soho: [51.5136, -0.1365], southwark: [51.5035, -0.0804], uxbridge: [51.5465, -0.4787], staines: [51.4335, -0.5104], burnham: [51.5236, -0.6555] };
  const OUTCODES = { SL1: [51.5145, -0.6], SL2: [51.533, -0.6093], SL3: [51.5014, -0.5568], SL4: [51.4792, -0.6227], SL6: [51.5213, -0.7262], RG1: [51.4548, -0.9708], W1D: [51.5134, -0.1324], SE1: [51.4986, -0.0907] };

  // ---- utils
  const pad = n => String(n).padStart(2, '0');
  const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const fmtT = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const dkey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parseD = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = parseD(k); d.setDate(d.getDate() + n); return dkey(d); };
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DOWL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtD = k => { const d = parseD(k); return DOW[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()]; };
  const fmtDLong = k => { const d = parseD(k); return DOWL[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); };
  const money = pence => '£' + (pence % 100 === 0 ? (pence / 100).toString() : (pence / 100).toFixed(2));
  const dur = m => m < 60 ? m + ' min' : (Math.floor(m / 60) + ' hr' + (m % 60 ? ' ' + (m % 60) + ' min' : ''));
  const miles = (a, b) => { const R = 3958.8, r = x => x * Math.PI / 180; const dLat = r(b[0] - a[0]), dLng = r(b[1] - a[1]); const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLng / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const hash = s => { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return h >>> 0; };
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // ---- availability (mirrors planned get_availability RPC)
  const svcOf = (b, id) => b.services.find(s => s.id === id);
  const canDo = (st, ids) => st.svc === 'all' || ids.every(id => st.svc.includes(id));
  const staffHours = (b, st, wd) => { if (st.hours) return st.hours[wd] || null; if (st.days && !st.days.includes(wd)) return null; return b.hours[wd]; };
  const inRange = (list, k) => (list || []).some(c => k >= c.from && k <= c.to);
  let SEEDX = new Set();
  // Other customers' bookings: deterministic per staff/day so the diary looks realistically busy.
  const seededBusy = (b, st, k) => {
    const wd = parseD(k).getDay(); const h = staffHours(b, st, wd); if (!h) return [];
    const r = rng(hash(b.id + st.id + k)); const o = toMin(h[0]), c = toMin(h[1]); const n = 2 + Math.floor(r() * 4); const out = [];
    for (let i = 0; i < n * 3 && out.length < n; i++) {
      const len = [30, 45, 60, 60, 90][Math.floor(r() * 5)]; const st0 = o + Math.floor(r() * ((c - o - len) / 15)) * 15;
      if (!out.some(x => st0 < x[1] && st0 + len > x[0])) out.push([st0, st0 + len]);
    }
    return out.filter(x => !SEEDX.has(b.id + '|' + st.id + '|' + k + '|' + x[0]));
  };
  const CLIENTS = ['Olivia Brown', 'Mohammed Ali', 'Grace Taylor', 'Jack Wilson', 'Amelia Patel', 'Harry Evans', 'Isla Thomas', 'Noah Hughes', 'Ava Roberts', 'Leo Green', 'Freya Hall', 'Oscar Wood', 'Zainab Begum', 'Ruby Clarke', 'Arjun Mehta', 'Chloe Wright'];
  // Sample diary entries for the business app: same slots as seededBusy, with a client and service attached.
  function seedAppts(b, st, k) {
    const elig = b.services.filter(s => canDo(st, [s.id]));
    return seededBusy(b, st, k).map(([s, e]) => { const r = rng(hash(b.id + st.id + k + s)); const len = e - s; const svc = elig.slice().sort((a, c) => Math.abs(a.dur - len) - Math.abs(c.dur - len))[0] || b.services[0]; return { key: b.id + '|' + st.id + '|' + k + '|' + s, t: s, dur: len, client: CLIENTS[Math.floor(r() * CLIENTS.length)], svcName: svc.name, price: svc.promo || svc.price, staffId: st.id, date: k }; });
  }
  const BREAK = [toMin('13:00'), toMin('13:30')];
  function slots(b, svcIds, staffPref, k, bookings, now, ignoreId) {
    if (!svcIds.length) return [];
    const need = svcIds.reduce((a, id) => a + svcOf(b, id).dur, 0);
    const wd = parseD(k).getDay(); const today = dkey(now); if (k < today) return [];
    const nowMin = now.getHours() * 60 + now.getMinutes();
    if (inRange(b.closures, k)) return [];
    const elig = b.staff.filter(st => st.active !== false && canDo(st, svcIds) && (staffPref === 'any' || st.id === staffPref) && !inRange(st.leave, k));
    const map = {};
    elig.forEach(st => {
      const h = staffHours(b, st, wd); if (!h) return;
      const brk = st.brk === null ? null : st.brk ? [toMin(st.brk[0]), toMin(st.brk[1])] : BREAK;
      const busy = seededBusy(b, st, k).concat(brk ? [brk] : []);
      (b.blocks || []).forEach(x => { if (x.date === k && (x.staffId === 'all' || x.staffId === st.id)) busy.push([toMin(x.start), toMin(x.end)]); });
      (bookings || []).forEach(x => { if (x.id !== ignoreId && x.bizId === b.id && x.staffId === st.id && x.date === k && x.status !== 'cancelled') busy.push([x.t, x.t + x.dur]); });
      for (let t = toMin(h[0]); t + need <= toMin(h[1]); t += 15) {
        if (k === today && t < nowMin + 60) continue;
        if (busy.some(x => t < x[1] && t + need > x[0])) continue;
        (map[t] = map[t] || []).push({ id: st.id, load: busy.length });
      }
    });
    return Object.keys(map).map(Number).sort((a, c) => a - c).map(t => { const c = map[t].sort((a, d) => a.load - d.load); return { t, staffId: c[0].id, staffIds: c.map(x => x.id) }; });
  }
  function nextSlot(b, svcIds, staffPref, fromK, bookings, now, days) {
    for (let i = 0; i < (days || 14); i++) { const k = addDays(fromK, i); const s = slots(b, svcIds, staffPref, k, bookings, now); if (s.length) return { date: k, t: s[0].t, staffId: s[0].staffId }; }
    return null;
  }
  // publication rule (mirrors public_businesses view)
  const isPublic = b => b.status === 'published' && b.services.length > 0 && b.staff.length > 0 && b.lat != null;

  // ---- business overrides written by the NEXCut Business app (prototype stand-in for the database)
  const OV = 'nexcut-biz-v1';
  const BASE = JSON.parse(JSON.stringify(B));
  const loadOv = () => { try { return JSON.parse(localStorage.getItem(OV)) || {}; } catch (e) { return {}; } };
  const clone = x => JSON.parse(JSON.stringify(x));
  const liveOffer = (o, today) => o.active !== false && (!o.start || o.start <= today) && (!o.end || o.end >= today);
  function rawBiz(id) { const ov = loadOv(); if (ov.byId && ov.byId[id]) return clone(ov.byId[id]); const c = (ov.created || []).find(x => x.id === id); if (c) return clone(c); const b = BASE.find(x => x.id === id); return b ? clone(b) : null; }
  function apply() {
    const ov = loadOv(), today = dkey(new Date()); SEEDX = new Set(ov.seedX || []);
    const all = BASE.map(clone).concat((ov.created || []).map(clone)).map(b => (ov.byId && ov.byId[b.id]) ? clone(ov.byId[b.id]) : b);
    all.forEach(b => {
      b.services = b.services.filter(s => s.active !== false); b.staff = b.staff.filter(s => s.active !== false);
      (b.offers || []).filter(o => liveOffer(o, today) && +o.pct > 0).forEach(o => b.services.forEach(s => { if (o.target === 'all' || o.target === s.id || o.target === s.group) { const p = Math.round(s.price * (1 - o.pct / 100)); if (!s.promo || p < s.promo) s.promo = p; } }));
      b.liveOffers = (b.offers || []).filter(o => liveOffer(o, today));
    });
    B.length = 0; all.forEach(b => B.push(b));
  }
  function saveBiz(b) { const ov = loadOv(); if (BASE.some(x => x.id === b.id)) { ov.byId = ov.byId || {}; ov.byId[b.id] = b; } else { ov.created = (ov.created || []).filter(x => x.id !== b.id).concat([b]); } localStorage.setItem(OV, JSON.stringify(ov)); apply(); }
  function cancelSeed(key) { const ov = loadOv(); ov.seedX = (ov.seedX || []).concat([key]); localStorage.setItem(OV, JSON.stringify(ov)); apply(); }
  function resetBiz() { localStorage.removeItem(OV); apply(); }
  function nextPublicId() { const n = Math.max.apply(null, B.map(b => +b.publicId.slice(3))) + 1; return 'NC-' + String(n).padStart(6, '0'); }
  apply();
  window.addEventListener('storage', e => { if (e.key === OV) apply(); });

  // ---- geocoding via postcodes.io (free, UK open data). Falls back to a local table offline.
  const PC_FULL = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, PC_OUT = /^[A-Z]{1,2}\d[A-Z\d]?$/i;
  async function geocode(text) {
    const q = (text || '').trim(); if (!q) return null;
    const up = q.toUpperCase().replace(/\s+/g, ' ');
    const local = () => { const o = OUTCODES[up.split(' ')[0]]; if (o) return { lat: o[0], lng: o[1], label: up, src: 'local' }; const t = TOWNS[q.toLowerCase()]; if (t) return { lat: t[0], lng: t[1], label: q.replace(/\b\w/g, c => c.toUpperCase()), src: 'local' }; return null; };
    try {
      let url, pick;
      if (PC_FULL.test(up)) { url = 'https://api.postcodes.io/postcodes/' + encodeURIComponent(up.replace(/\s/g, '')); pick = r => r && { lat: r.latitude, lng: r.longitude, label: r.postcode }; }
      else if (PC_OUT.test(up)) { url = 'https://api.postcodes.io/outcodes/' + encodeURIComponent(up); pick = r => r && { lat: r.latitude, lng: r.longitude, label: r.outcode }; }
      else {
        const known = TOWNS[q.toLowerCase()]; if (known) return { lat: known[0], lng: known[1], label: q.replace(/\b\w/g, c => c.toUpperCase()), src: 'local' };
        url = 'https://api.postcodes.io/places?limit=20&q=' + encodeURIComponent(q);
        const rank = { City: 0, Town: 1, 'Suburban Area': 2, Village: 3, Other: 4, Hamlet: 5 };
        pick = r => { if (!r || !r.length) return null; const ql = q.toLowerCase(); const exact = r.filter(x => (x.name_1 || '').toLowerCase() === ql); const pool = exact.length ? exact : r; const best = pool.slice().sort((a, c) => (rank[a.local_type] ?? 4) - (rank[c.local_type] ?? 4))[0]; return { lat: best.latitude, lng: best.longitude, label: best.name_1 + (best.county_unitary ? ', ' + best.county_unitary : '') }; };
      }
      const res = await fetch(url); if (res.status === 404) return local();
      const j = await res.json(); const v = pick(j.result); if (v && v.lat != null) return Object.assign(v, { src: 'postcodes.io' });
      return local();
    } catch (e) { return local(); }
  }
  async function reverse(lat, lng) {
    try { const r = await fetch('https://api.postcodes.io/postcodes?lon=' + lng + '&lat=' + lat + '&limit=1'); const j = await r.json(); const x = j.result && j.result[0]; if (x) return x.postcode.split(' ')[0] + ', ' + x.admin_district; } catch (e) {}
    return 'Your location';
  }

  function ics(bk, b, svcNames) {
    const d = parseD(bk.date); const s = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(bk.t / 60), bk.t % 60); const e = new Date(s.getTime() + bk.dur * 60000);
    const f = x => x.getUTCFullYear() + pad(x.getUTCMonth() + 1) + pad(x.getUTCDate()) + 'T' + pad(x.getUTCHours()) + pad(x.getUTCMinutes()) + '00Z';
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nexyra//NEXCut//EN', 'BEGIN:VEVENT', 'UID:' + bk.id + '@nexcut', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(s), 'DTEND:' + f(e), 'SUMMARY:' + svcNames + ' at ' + b.name, 'LOCATION:' + b.addr + ', ' + b.town + ' ' + b.pc, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }

  window.NX = { CATS, BUSINESSES: B, isPublic, rawBiz, saveBiz, cancelSeed, resetBiz, nextPublicId, reload: apply, seedAppts, staffHours, inRange, svcOf, canDo, slots, nextSlot, geocode, reverse, miles, money, dur, fmtT, fmtD, fmtDLong, dkey, parseD, addDays, toMin, DOW, ics };
})();
