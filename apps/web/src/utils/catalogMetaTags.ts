import { ParsedUrlQuery } from 'querystring';

interface MetaInfo {
  title: string;
  description: string;
}

const metaConfig: Record<string, Record<string, MetaInfo>> = {
  plataforma: {
    'XBOX': {
      title: 'Mercado Gamer - Compra aquí Xbox Game Pass y juegos de Xbox',
      description: '¡Paga en pesos y sin impuesto pais! Compra para descargar al instante juegos digitales para Xbox 360, Xbox Series X y Xbox one. Compra seguro con Garantía MG.'
    },
    'PLAY STATION': {
      title: 'Mercado Gamer - Compra juegos digitales baratos de PlayStation',
      description: '¡Paga en pesos, seguro y recibí al instante! ¡Sin impuesto país! Compra gift card de PSN Plus y juegos digitales de ps3, ps4 y ps5. Obtené tu Minecraft, FIFA, UFC, GTA 5, Pes.'
    },
    'STEAM': {
      title: 'Mercado Gamer - Compra juegos de Steam en Argentina',
      description: '¡Paga en pesos y recibí al instante! ¡Sin impuesto pais! Encuentra aquí gift card, skins, packs, keys y más juegos de steam. Seguro con la Garantía MG.'
    },
    'EPIC GAMES': {
      title: 'Mercado Gamer - Compra aquí tus juegos de Epic Games',
      description: '¡Paga en Pesos, seguro y al instante! ¡Sin impuesto país! Aquí la biblioteca de Epic Game de juegos, pavos, gift card, créditos, packs, picos, skins y más.'
    },
    'NINTENDO': {
      title: 'Mercado Gamer - ¡Compra juegos digitales para tu Nintendo!',
      description: '¡Paga en pesos, seguro y al instante! ¡Sin Impuesto país en Argentina! Compra juegos para Nintendo Switch y todo del Mario Kart 8, Zelda y más.'
    },
    'BATTLE NET': {
      title: 'Mercado Gamer - Conocé las mejores ofertas de Battle Net',
      description: '¡Paga en pesos! ¡Sin impuestos país para Argentina! Consigue juegos como Overwatch, Diablo 2 y más. Compra seguro y al instante con Garantía MG.'
    },
    'Mobile': {
      title: 'Mercado Gamer - Compra códigos y más para juegos de celular',
      description: '¡Paga en pesos, seguro y al instante desde Argentina! Compra codigos de Lords Mobile, Free Fire, PUBG Mobile, Mobile Legends, COD Mobile, FIFA Mobile y más.'
    },
    'Origin': {
      title: 'Mercado Gamer - Compra barato y rápido tus juegos de Origin',
      description: '¡Paga en pesos, seguro y al instante desde Argentina! Consigue tus ítems y DLC de Sims 4, Battlefield, FIFA 22 y mas packs, FIFA Points, keys, etc.'
    },
    'Riot Games': {
      title: 'Mercado Gamer - Compra item de LOL, TFT y más de Riot Games',
      description: '¡Compra en pesos, seguro y al instante! ¡Sin Impuesto país en Argentina! Obtené gift cards, items, códigos y más para el League of legends, Valorant, Teamfight Tactics, Runeterra, etc.'
    }
  },
  tipo: {
    'game': {
      title: 'Mercado Gamer - Compra juegos digitales rápido y barato',
      description: '¡Compra en pesos! Sin impuesto país para Argentina. Encontrá juegos de ps3, ps4, ps5, PC y mobile. Como FIFA, Fortnite, Minecraft, Fall Guys, etc. Todos los jueguitos del mercado'
    },
    'giftCard': {
      title: 'Mercado Gamer - Compra tu Gift Card barato, fácil y rápido',
      description: '¡Paga en pesos las Gift Cards! ¡Seguro y al instante! Sin impuesto país desde Argentina. Tarjetas de Steam, PSN Card, Google Play, Roblox card y más.'
    },
    'item': {
      title: 'Mercado Gamer - Compra seguro y rápido ítems para tus juegos',
      description: '¡Paga en Pesos, seguro y al instante desde Argentina! Sin impuesto país. Items de Fortnite, Skins de Free fire, camuflajes de CSGO, Roblox, LoL, tft, isaac items, dota 2, Minecraft, tf2.'
    },
    'moneda': {
      title: 'Mercado Gamer - Compra aquí las monedas para tus juegos',
      description: '¡Compra en pesos y recibí al instante desde Argentina! Encontrá las monedas de tus juegos.🎮 Pavos de Fortnite, Diamantes Free Fire, FIFA Points, Riot Points, Diamantes Mobile Legends, Lords Mobile, FIFA Coins, V-Bucks, COD Points, G-Coin, etc.'
    },
    'pack': {
      title: 'Mercado Gamer - Compra aquí todos los packs para tus juegos',
      description: '¡Paga en pesos, seguro y al instante! ¡Sin impuesto país en Argentina! Packs de inicio fortnite, Pack de Free Fire, Warzone pack, Codigos Warzone, etc.'
    }
  },
  categoria: {
    'Aventura': {
      title: 'Mercado Gamer - Compra juegos de aventura PS3, PS4, PC y más',
      description: '¡Compra seguro y al instante! ¡Paga en Pesos! Sin impuesto país en Argentina. Juegos de Aventura como Half-Life 2, Minecraft para Android y más.'
    },
    'Pelea': {
      title: 'Mercado Gamer - Compra juegos de pelea y recibilo al instante',
      description: '¡Compra en pesos! ¡Sin impuesto país en Argentina! Juegos de Lucha, MMA, Boxeo como Street Fighter V, Mortal Kombat 11, Tekken 7, UFC 2, UFC 3, etc.'
    },
    'Carrera': {
      title: 'Mercado Gamer - Compra juegos de carrera baratos y al instante',
      description: '¡Paga en pesos! ¡Sin impuesto país en Argentina! Juegos de coches como Forza Horizon 4, Colin McRae Rally, Dirt 5, etc. PS3, PS4, PS5, PC y más. Juegos de autos y carros como Dirt Rally 2.0, Proyect Cars 2, Forza Motosport 7.'
    },
    'Estrategia': {
      title: 'Mercado Gamer - Compra juegos de estrategia seguro y rápido',
      description: '¡Paga en pesos! ¡Sin impuesto país en Argentina! Juegos de estrategia y guerra para PC, Android y más, como Age of Empires IV, Dota 2, LoL, etc.'
    },
    'Deporte': {
      title: 'Mercado Gamer - Compra juegos de deporte seguro y barato',
      description: '¡Paga en pesos y sin impuesto país en Argentina! Juegos de Futbol, Tenis, Basquet, Rugby, Golf, Padel y más como FIFA 22, NBA 2K22, Golf it.'
    },
    'Terror': {
      title: 'Mercado Gamer - Compra tus juegos de Terror al mejor costo',
      description: '¡Paga en pesos y sin el 75% de impuesto en Argentina! Compra items, packs, códigos, gift cards y más sobre juegos de miedo como Dead by Daylight, Five Nights at Freddy`s, Outlast, Resident Evil, Slender y mas.'
    }
  },
  juego: {
    'Rocket League': {
      title: 'Mercado Gamer - Compra aquí tus ítems de Rocket League',
      description: '¡Paga en pesos! ¡Sin impuesto país en Argentina! Verás Skins, Packs, Créditos, Gift Card, DLC, Códigos y más. Compra endo, jager, hot wheels, fennec, disolvente, takumi, octane, Nissan Skyline, Dingo, Dominus, Wallpaper, Batmobile. Encontraras items de Rocket League para PS3, PS4, PC, Steam.'
    },
    'Fortnite': {
      title: 'Mercado Gamer - Compra items de Fortnite seguro y al instante',
      description: '¡Paga en Pesos! ¡Sin impuesto país en Argentina! Compra todo de Fortnite, Pavos, V-Bucks, Packs de inicio, Club de Fortnite, skins tryhard, Picos y más. wildcat, cuervo, duende verde, gamer club, caballero oscuro, bailes, wonder woman, Harley quinn, raven, aura, bonesy, bananin, deriva, midas, renegada, kit, codigos y chica zombie. '
    },
    'Warzone': {
      title: 'Mercado Gamer - Compra ítems de Warzone seguro y rapido',
      description: '¡Paga en pesos! ¡Sin impuesto país desde Argentina! Elige tu item de Warzone y lo pagas por Mercado Pago. Encontrarás COD Points, Packs, XP, codigos y más.'
    },
    'CS GO': {
      title: 'Mercado Gamer - Compra skins CSGO en pesos sin impuesto pais',
      description: '¡Compra en pesos tus ítems de Counter Strike desde Argentina! Encontrarás skins baratas de AWP, AK-47, M4-A1, MP9, P90, glock, USP, Osiris, Bayoneta, cuchillos y demás packs, cajas, prime, pegatinas csgo, stickers de 9z como luken, dgt, bit, rox, max, etc.'
    },
    'Valorant': {
      title: 'Mercado Gamer - Compra todo de Valorant en pesos',
      description: '¡Paga en pesos y sin impuesto país en Argentina! Compra seguro y al instante con Garantía MG. Encontrarás codigos, gift card, packs y mucho más.'
    },
    'League of Legends': {
      title: 'Mercado Gamer - Compra skins y más de League of Legends',
      description: '¡Paga en pesos los items y skins de LOL! ¡Sin impuesto país en Argentina! Riot access, Riot points, gift card y más. Compra seguro y al instante.'
    },
    'FIFA 22': {
      title: 'Mercado Gamer - Compra el FIFA 22, monedas y más',
      description: '¡Paga en pesos los FIFA Coins, packs y más! ¡Sin impuesto país en Argentina! Compra Points, codigos, gift card, etc. Conseguí jugadores para fut champions como Messi, Dani Alves, Garnacho, Di Stefano, Haaland. Obtene sus cartas como TOTS, Heroes, TOTY, Promesas, Future Strars, etc.'
    },
    'Free Fire': {
      title: 'Mercado Gamer - Compra Diamantes de Free Fire y mucho más',
      description: '¡Paga en pesos y sin impuesto país en Argentina! Compra carga de Diamantes, códigos, packs, skins, Pase Elite, Gift card, tarjeta semanal, mensual y más.'
    },
    'Player Unknown Battlegrounds': {
      title: 'Mercado Gamer - Explora nuestro catálogo de PUBG',
      description: "¡Paga en pesos los items de Player Unknown's battlegrounds! Como G-Coins, gift card, packs, skins y más. Todo para PUBG Mobile, PC, PS4 y Xbox."
    },
    'Roblox': {
      title: 'Mercado Gamer - Compra items de Roblox seguro y barato',
      description: '¡Paga en pesos y recibí al instante! Compra Roblox Card, Gift Card, Packs, Skins, DLC, Robux, promocodes, códigos y más para PC, Mobile, etc.'
    },
    'FIFA 23': {
      title: 'Mercado Gamer - Compra el FIFA 23, monedas y más',
      description: '¡Paga en pesos y sin impuesto país en Argentina! Obtené FIFA 23, Coins, packs, codigos, Points, gift card, etc. Conseguí jugadores para fut champions como Messi, Haaland, Di Stefano, Garnacho, Dani Alves.'
    },
    'Call of Duty Mobile': {
      title: 'Mercado Gamer - Compra todo de Call of Duty Mobile fácil y rápido',
      description: '¡Paga en pesos! ¡Recibí seguro y al instante! Sin impuesto país en Argentina. Obtené tus DLC, Gift Card, COD Points, pase de batalla y más.'
    },
    'Call of Duty Modern Warfare 2': {
      title: 'Mercado Gamer - Compra el Call of Duty Modern Warfare 2',
      description: '¡Paga en pesos y sin impuesto país en Argentina! ¡Recibí seguro y al instante! Obtené tu MW2, COD Points, DLC, Gift Card, pase de batalla y más.'
    },
    'Mobile Legends': {
      title: 'Mercado Gamer - Diamantes, Códigos y más de Mobile Legends',
      description: '¡Paga en pesos y sin el 75% de impuesto en Argentina! Compra diamantes, personajes, códigos y más. Hace tus recargas seguras y al instante. Adquirí tu personaje al menor costo.'
    }
  }
};

const defaultMeta: MetaInfo = {
  title: 'Mercado Gamer - Compra gift card, items, packs y más del Gaming',
  description: 'Mira nuestro catálogo de keys, ítems, gift cards y más para PC, Celular, PS4, PS5, Xbox, etc. Compra seguro, paga por Mercado Pago y recibí al instante.'
};

export function getCatalogMeta(query: ParsedUrlQuery): MetaInfo {
  // Check each query parameter in priority order
  const queryParams = ['plataforma', 'tipo', 'categoria', 'juego'];

  for (const param of queryParams) {
    const value = query[param];
    if (value && typeof value === 'string' && metaConfig[param]?.[value]) {
      return metaConfig[param][value];
    }
  }

  return defaultMeta;
}
