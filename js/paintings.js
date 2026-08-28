export const GRID = 6;
export const PIECE_COUNT = GRID * GRID;
export const PIXEL_RES = 192;

export const ARTISTS = [
  {
    id: "vangogh",
    name: "Vincent van Gogh",
    years: "1853–1890",
    note: "Dutch post-impressionist",
  },
  {
    id: "monet",
    name: "Claude Monet",
    years: "1840–1926",
    note: "French impressionist",
  },
  {
    id: "klimt",
    name: "Gustav Klimt",
    years: "1862–1918",
    note: "Austrian symbolist",
  },
  {
    id: "picasso",
    name: "Pablo Picasso",
    years: "1881–1973",
    note: "Blue Period, Rose Period, and after",
  },
  {
    id: "whistler",
    name: "James McNeill Whistler",
    years: "1834–1903",
    note: "American painter of nocturnes and arrangements",
  },
  {
    id: "cassatt",
    name: "Mary Cassatt",
    years: "1844–1926",
    note: "American impressionist in Paris",
  },
  {
    id: "hokusai",
    name: "Katsushika Hokusai",
    years: "1760–1849",
    note: "Thirty-six Views of Mount Fuji",
  },
  {
    id: "mondrian",
    name: "Piet Mondrian",
    years: "1872–1944",
    note: "From Dutch landscapes to neo-plastic grids (works published by 1930)",
  },
  {
    id: "klee",
    name: "Paul Klee",
    years: "1879–1940",
    note: "Bauhaus color and line (works published by 1930)",
  },
  {
    id: "toorop",
    name: "Jan Toorop",
    years: "1858–1928",
    note: "Dutch symbolist and Art Nouveau",
  },
];

/** 6 works per artist. Open-access museum images only; Mondrian and Klee limited to works published by 1930 (US public domain). */
export const PAINTINGS = [
  // Van Gogh — National Gallery of Art
  {
    id: "self-portrait",
    title: "Self-Portrait",
    artist: "Vincent van Gogh",
    artistId: "vangogh",
    year: "1889",
    uuid: "54ee6643-e0f9-4b92-a1d2-441e5108724d",
    credit: "National Gallery of Art",
  },
  {
    id: "girl-in-white",
    title: "Girl in White",
    artist: "Vincent van Gogh",
    artistId: "vangogh",
    year: "1890",
    uuid: "6d6753b3-c1ef-494c-9dc3-244e8982c867",
    credit: "National Gallery of Art",
  },
  {
    id: "la-mousme",
    title: "La Mousmé",
    artist: "Vincent van Gogh",
    artistId: "vangogh",
    year: "1888",
    uuid: "a2e6da57-3cd1-4235-b20e-95dcaefed6c8",
    credit: "National Gallery of Art",
  },
  {
    id: "olive-orchard",
    title: "The Olive Orchard",
    artist: "Vincent van Gogh",
    artistId: "vangogh",
    year: "1889",
    uuid: "f07617e8-43ad-4954-8223-4b40dce37061",
    credit: "National Gallery of Art",
  },
  {
    id: "farmhouse-provence",
    title: "Farmhouse in Provence",
    artist: "Vincent van Gogh",
    artistId: "vangogh",
    year: "1888",
    uuid: "51c369a2-cc20-43f6-8262-25877c4377eb",
    credit: "National Gallery of Art",
  },
  {
    id: "roses",
    title: "Roses",
    artist: "Vincent van Gogh",
    artistId: "vangogh",
    year: "1890",
    uuid: "bef8c58d-15ae-4649-b2ff-ae0ead24714e",
    credit: "National Gallery of Art",
  },

  // Monet — National Gallery of Art
  {
    id: "footbridge",
    title: "The Japanese Footbridge",
    artist: "Claude Monet",
    artistId: "monet",
    year: "1899",
    uuid: "0b9cefb5-1ee4-401a-8154-8d4039191a28",
    credit: "National Gallery of Art",
  },
  {
    id: "rouen-cathedral",
    title: "Rouen Cathedral",
    artist: "Claude Monet",
    artistId: "monet",
    year: "1894",
    uuid: "b9b6782a-cbf0-4e36-84da-98af87891775",
    credit: "National Gallery of Art",
  },
  {
    id: "parasol",
    title: "Woman with a Parasol",
    artist: "Claude Monet",
    artistId: "monet",
    year: "1875",
    uuid: "99758d9d-c10b-4d02-a198-7e49afb1f3a6",
    credit: "National Gallery of Art",
  },
  {
    id: "garden-vetheuil",
    title: "The Artist's Garden at Vétheuil",
    artist: "Claude Monet",
    artistId: "monet",
    year: "1881",
    uuid: "9fc88734-2f9a-4da8-8d46-2b570b201223",
    credit: "National Gallery of Art",
  },
  {
    id: "bridge-argenteuil",
    title: "The Bridge at Argenteuil",
    artist: "Claude Monet",
    artistId: "monet",
    year: "1874",
    uuid: "7372b15a-3830-43bf-8c41-4836619312b7",
    credit: "National Gallery of Art",
  },
  {
    id: "palazzo-mula",
    title: "Palazzo da Mula, Venice",
    artist: "Claude Monet",
    artistId: "monet",
    year: "1908",
    uuid: "f339a180-c87a-446b-8605-060f7b53f1a3",
    credit: "National Gallery of Art",
  },

  // Klimt — NGA + Wikimedia Commons (public domain)
  {
    id: "cradle",
    title: "Baby (Cradle)",
    artist: "Gustav Klimt",
    artistId: "klimt",
    year: "1917/1918",
    uuid: "c9129cd8-4893-443a-ac43-8a64fdab5852",
    credit: "National Gallery of Art",
  },
  {
    id: "the-kiss",
    title: "The Kiss",
    artist: "Gustav Klimt",
    artistId: "klimt",
    year: "1907/1908",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Klimt_-_The_Kiss.jpg/960px-Klimt_-_The_Kiss.jpg",
    credit: "Wikimedia Commons / Belvedere",
  },
  {
    id: "adele",
    title: "Portrait of Adele Bloch-Bauer I",
    artist: "Gustav Klimt",
    artistId: "klimt",
    year: "1907",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Gustav_Klimt%2C_1907%2C_Adele_Bloch-Bauer_I%2C_Neue_Galerie_New_York.jpg/960px-Gustav_Klimt%2C_1907%2C_Adele_Bloch-Bauer_I%2C_Neue_Galerie_New_York.jpg",
    credit: "Wikimedia Commons / Neue Galerie",
  },
  {
    id: "judith",
    title: "Judith I",
    artist: "Gustav Klimt",
    artistId: "klimt",
    year: "1901",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Judith_1.jpg/960px-Judith_1.jpg",
    credit: "Wikimedia Commons / Belvedere",
  },
  {
    id: "lady-with-fan",
    title: "Lady with a Fan",
    artist: "Gustav Klimt",
    artistId: "klimt",
    year: "1917/1918",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Gustav_Klimt_-_Dame_mit_F%C3%A4cher.jpeg/960px-Gustav_Klimt_-_Dame_mit_F%C3%A4cher.jpeg",
    credit: "Wikimedia Commons",
  },
  {
    id: "three-ages",
    title: "Birch Forest",
    artist: "Gustav Klimt",
    artistId: "klimt",
    year: "1903",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Gustav_Klimt_006.jpg/960px-Gustav_Klimt_006.jpg",
    credit: "Wikimedia Commons",
  },

  // Picasso — early works that are public domain in the US (published before 1929)
  {
    id: "old-guitarist",
    title: "The Old Guitarist",
    artist: "Pablo Picasso",
    artistId: "picasso",
    year: "1903/1904",
    remote:
      "https://www.artic.edu/iiif/2/4e7f3081-179a-af18-8abd-7908a7ae8c4e/full/800,/0/default.jpg",
    credit: "Art Institute of Chicago",
  },
  {
    id: "family-saltimbanques",
    title: "Family of Saltimbanques",
    artist: "Pablo Picasso",
    artistId: "picasso",
    year: "1905",
    remote:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/Family_of_Saltimbanques.JPG/960px-Family_of_Saltimbanques.JPG",
    credit: "National Gallery of Art",
  },
  {
    id: "blue-room",
    title: "The Blue Room",
    artist: "Pablo Picasso",
    artistId: "picasso",
    year: "1901",
    remote:
      "https://upload.wikimedia.org/wikipedia/en/7/75/Picasso%27s_Blue_Room_1901.jpg",
    credit: "The Phillips Collection",
  },
  {
    id: "the-tragedy",
    title: "The Tragedy",
    artist: "Pablo Picasso",
    artistId: "picasso",
    year: "1903",
    remote: "https://upload.wikimedia.org/wikipedia/en/3/39/The_Tragedy.JPG",
    credit: "National Gallery of Art",
  },
  {
    id: "gertrude-stein",
    title: "Portrait of Gertrude Stein",
    artist: "Pablo Picasso",
    artistId: "picasso",
    year: "1905/1906",
    remote: "https://upload.wikimedia.org/wikipedia/en/d/d6/GertrudeStein.JPG",
    credit: "The Metropolitan Museum of Art",
  },
  {
    id: "la-vie",
    title: "La Vie",
    artist: "Pablo Picasso",
    artistId: "picasso",
    year: "1903",
    remote:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/11/La_Vie_by_Pablo_Picasso.jpg/960px-La_Vie_by_Pablo_Picasso.jpg",
    credit: "Cleveland Museum of Art",
  },

  // Whistler — died 1903; NGA + Wikimedia (public domain)
  {
    id: "white-girl",
    title: "Symphony in White, No. 1: The White Girl",
    artist: "James McNeill Whistler",
    artistId: "whistler",
    year: "1862",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Whistler_James_Symphony_in_White_no_1_%28The_White_Girl%29_1862.jpg/960px-Whistler_James_Symphony_in_White_no_1_%28The_White_Girl%29_1862.jpg",
    credit: "National Gallery of Art",
  },
  {
    id: "whistlers-mother",
    title: "Arrangement in Grey and Black No. 1",
    artist: "James McNeill Whistler",
    artistId: "whistler",
    year: "1871",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Whistlers_Mother_high_res.jpg/960px-Whistlers_Mother_high_res.jpg",
    credit: "Wikimedia Commons / Musée d'Orsay",
  },
  {
    id: "falling-rocket",
    title: "Nocturne in Black and Gold: The Falling Rocket",
    artist: "James McNeill Whistler",
    artistId: "whistler",
    year: "1875",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Whistler-Nocturne_in_black_and_gold.jpg/960px-Whistler-Nocturne_in_black_and_gold.jpg",
    credit: "Wikimedia Commons / Detroit Institute of Arts",
  },
  {
    id: "little-white-girl",
    title: "Symphony in White, No. 2: The Little White Girl",
    artist: "James McNeill Whistler",
    artistId: "whistler",
    year: "1864",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Whistler_James_Symphony_in_White_no_2_%28The_Little_White_Girl%29_1864.jpg",
    credit: "Wikimedia Commons / Tate",
  },
  {
    id: "battersea-bridge",
    title: "Nocturne: Blue and Gold — Old Battersea Bridge",
    artist: "James McNeill Whistler",
    artistId: "whistler",
    year: "c. 1872–1875",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/James_Abbot_McNeill_Whistler_006.jpg/960px-James_Abbot_McNeill_Whistler_006.jpg",
    credit: "Wikimedia Commons / Tate",
  },
  {
    id: "andalusian",
    title: "Mother of Pearl and Silver: The Andalusian",
    artist: "James McNeill Whistler",
    artistId: "whistler",
    year: "1888–1900",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mother_of_Pearl_and_Silver_The_Andalusian.jpg/960px-Mother_of_Pearl_and_Silver_The_Andalusian.jpg",
    credit: "National Gallery of Art",
  },

  // Cassatt — died 1926; NGA + Art Institute (public domain)
  {
    id: "boating-party",
    title: "The Boating Party",
    artist: "Mary Cassatt",
    artistId: "cassatt",
    year: "1893/1894",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Mary_Cassatt_-_The_Boating_Party_-_Google_Art_Project.jpg/960px-Mary_Cassatt_-_The_Boating_Party_-_Google_Art_Project.jpg",
    credit: "National Gallery of Art",
  },
  {
    id: "blue-armchair",
    title: "Little Girl in a Blue Armchair",
    artist: "Mary Cassatt",
    artistId: "cassatt",
    year: "1878",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Cassat_-_Blue_Armchair_NGA.jpg/960px-Cassat_-_Blue_Armchair_NGA.jpg",
    credit: "National Gallery of Art",
  },
  {
    id: "girl-arranging-hair",
    title: "Girl Arranging Her Hair",
    artist: "Mary Cassatt",
    artistId: "cassatt",
    year: "1886",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Mary_Cassatt_-_Girl_Arranging_Her_Hair_-_Google_Art_Project.jpg/960px-Mary_Cassatt_-_Girl_Arranging_Her_Hair_-_Google_Art_Project.jpg",
    credit: "National Gallery of Art",
  },
  {
    id: "childs-bath",
    title: "The Child's Bath",
    artist: "Mary Cassatt",
    artistId: "cassatt",
    year: "1893",
    remote:
      "https://www.artic.edu/iiif/2/3b885ae0-4d46-5fe4-d70a-00474827f02c/full/800,/0/default.jpg",
    credit: "Art Institute of Chicago",
  },
  {
    id: "woman-bathing",
    title: "Woman Bathing",
    artist: "Mary Cassatt",
    artistId: "cassatt",
    year: "1890/1891",
    remote:
      "https://www.artic.edu/iiif/2/9e90fbeb-bd55-7921-26e4-dde3470c5bd9/full/800,/0/default.jpg",
    credit: "Art Institute of Chicago",
  },
  {
    id: "on-a-balcony",
    title: "On a Balcony",
    artist: "Mary Cassatt",
    artistId: "cassatt",
    year: "1878/1879",
    remote:
      "https://www.artic.edu/iiif/2/f0150d21-33ab-f6ea-0d4d-32d459f091fe/full/800,/0/default.jpg",
    credit: "Art Institute of Chicago",
  },

  // Hokusai — died 1849; Met open access, Thirty-six Views of Mount Fuji
  {
    id: "great-wave",
    title: "Under the Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    artistId: "hokusai",
    year: "c. 1830–32",
    remote: "https://images.metmuseum.org/CRDImages/as/web-large/DP130155.jpg",
    credit: "The Metropolitan Museum of Art",
  },
  {
    id: "red-fuji",
    title: "South Wind, Clear Sky (Red Fuji)",
    artist: "Katsushika Hokusai",
    artistId: "hokusai",
    year: "c. 1830–32",
    remote: "https://images.metmuseum.org/CRDImages/as/web-large/DP140971.jpg",
    credit: "The Metropolitan Museum of Art",
  },
  {
    id: "storm-below-fuji",
    title: "Storm below Mount Fuji",
    artist: "Katsushika Hokusai",
    artistId: "hokusai",
    year: "c. 1830–32",
    remote: "https://images.metmuseum.org/CRDImages/as/web-large/DP140976.jpg",
    credit: "The Metropolitan Museum of Art",
  },
  {
    id: "kajikazawa",
    title: "Kajikazawa in Kai Province",
    artist: "Katsushika Hokusai",
    artistId: "hokusai",
    year: "c. 1830–32",
    remote: "https://images.metmuseum.org/CRDImages/as/web-large/DP141085.jpg",
    credit: "The Metropolitan Museum of Art",
  },
  {
    id: "shichirigahama",
    title: "Shichirigahama in Sagami Province",
    artist: "Katsushika Hokusai",
    artistId: "hokusai",
    year: "c. 1830–32",
    remote: "https://images.metmuseum.org/CRDImages/as/web-large/DP140979.jpg",
    credit: "The Metropolitan Museum of Art",
  },
  {
    id: "lake-suwa",
    title: "Lake Suwa in Shinano Province",
    artist: "Katsushika Hokusai",
    artistId: "hokusai",
    year: "c. 1830–32",
    remote: "https://images.metmuseum.org/CRDImages/as/web-large/DP141058.jpg",
    credit: "The Metropolitan Museum of Art",
  },

  // Mondrian — died 1944; US public domain = published 1930 or earlier
  {
    id: "gray-tree",
    title: "The Gray Tree",
    artist: "Piet Mondrian",
    artistId: "mondrian",
    year: "1911",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Gray_Tree_1911.jpg/960px-Gray_Tree_1911.jpg",
    credit: "Wikimedia Commons / Kunstmuseum Den Haag",
  },
  {
    id: "landscape-loosduinen",
    title: "Landscape at Loosduinen",
    artist: "Piet Mondrian",
    artistId: "mondrian",
    year: "1905",
    remote:
      "https://openaccess-cdn.clevelandart.org/1972.213/1972.213_print.jpg",
    credit: "Cleveland Museum of Art",
  },
  {
    id: "farm-duivendrecht",
    title: "Farm near Duivendrecht",
    artist: "Piet Mondrian",
    artistId: "mondrian",
    year: "c. 1916",
    remote:
      "https://www.artic.edu/iiif/2/b8ca5039-1d0c-648d-ad46-838ecea3e14c/full/800,/0/default.jpg",
    credit: "Art Institute of Chicago",
  },
  {
    id: "lozenge-1921",
    title: "Lozenge Composition with Yellow, Black, Blue, Red, and Gray",
    artist: "Piet Mondrian",
    artistId: "mondrian",
    year: "1921",
    remote:
      "https://www.artic.edu/iiif/2/25f660ee-f1db-d13b-42a5-56df97c98ba7/full/800,/0/default.jpg",
    credit: "Art Institute of Chicago",
  },
  {
    id: "composition-1927",
    title: "Composition with Red, Yellow, and Blue",
    artist: "Piet Mondrian",
    artistId: "mondrian",
    year: "1927",
    remote:
      "https://openaccess-cdn.clevelandart.org/1967.215/1967.215_print.jpg",
    credit: "Cleveland Museum of Art",
  },
  {
    id: "composition-ii-1930",
    title: "Composition with Red, Blue and Yellow",
    artist: "Piet Mondrian",
    artistId: "mondrian",
    year: "1930",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/960px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg",
    credit: "Wikimedia Commons",
  },

  // Klee — died 1940; only works published by 1930 (US public domain)
  {
    id: "senecio",
    title: "Senecio",
    artist: "Paul Klee",
    artistId: "klee",
    year: "1922",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Paul_Klee%2C_1922%2C_Senecio%2C_oil_on_gauze%2C_40.3_%C3%97_37.4_cm%2C_Kunstmuseum_Basel.jpg/960px-Paul_Klee%2C_1922%2C_Senecio%2C_oil_on_gauze%2C_40.3_%C3%97_37.4_cm%2C_Kunstmuseum_Basel.jpg",
    credit: "Wikimedia Commons / Kunstmuseum Basel",
  },
  {
    id: "villa-r",
    title: "Villa R",
    artist: "Paul Klee",
    artistId: "klee",
    year: "1919",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Villa_R%2C_1919_-_Paul_Klee.jpg/960px-Villa_R%2C_1919_-_Paul_Klee.jpg",
    credit: "Wikimedia Commons",
  },
  {
    id: "with-the-dot",
    title: "With the Dot",
    artist: "Paul Klee",
    artistId: "klee",
    year: "1916",
    remote: "https://openaccess-cdn.clevelandart.org/1961.50/1961.50_print.jpg",
    credit: "Cleveland Museum of Art",
  },
  {
    id: "small-world",
    title: "Small World",
    artist: "Paul Klee",
    artistId: "klee",
    year: "1914",
    remote:
      "https://openaccess-cdn.clevelandart.org/1984.227/1984.227_print.jpg",
    credit: "Cleveland Museum of Art",
  },
  {
    id: "tightrope-walker",
    title: "Tightrope Walker",
    artist: "Paul Klee",
    artistId: "klee",
    year: "1923",
    remote:
      "https://openaccess-cdn.clevelandart.org/1961.154/1961.154_print.jpg",
    credit: "Cleveland Museum of Art",
  },
  {
    id: "carnival-snow",
    title: "Carnival in the Snow",
    artist: "Paul Klee",
    artistId: "klee",
    year: "1923",
    remote:
      "https://openaccess-cdn.clevelandart.org/1969.46/1969.46_print.jpg",
    credit: "Cleveland Museum of Art",
  },

  // Toorop — died 1928; Kröller-Müller, Art Institute, Cleveland (public domain)
  {
    id: "three-brides",
    title: "The Three Brides",
    artist: "Jan Toorop",
    artistId: "toorop",
    year: "1893",
    remote:
      "https://upload.wikimedia.org/wikipedia/commons/9/91/Toorop%2C_De_drie_bruiden%2C_78x98_non_bruid_helbruid.jpg",
    credit: "Wikimedia Commons / Kröller-Müller Museum",
  },
  {
    id: "joan-of-arc",
    title: "Joan of Arc",
    artist: "Jan Toorop",
    artistId: "toorop",
    year: "1898",
    remote:
      "https://www.artic.edu/iiif/2/d88e68c4-a6e9-a831-0813-83c36dc31a68/full/800,/0/default.jpg",
    credit: "Art Institute of Chicago",
  },
  {
    id: "muses-architecture",
    title: "The Arrival of the Muses of Art at Architecture",
    artist: "Jan Toorop",
    artistId: "toorop",
    year: "1890",
    remote:
      "https://www.artic.edu/iiif/2/4e1f3924-354e-3b92-c2ab-952a67da8936/full/800,/0/default.jpg",
    credit: "Art Institute of Chicago",
  },
  {
    id: "woodland-swans",
    title: "Woodland with a Pond and Swans",
    artist: "Jan Toorop",
    artistId: "toorop",
    year: "1897",
    remote:
      "https://www.artic.edu/iiif/2/c1bf4b05-38bd-6c87-e0dd-7c724e42d29f/full/800,/0/default.jpg",
    credit: "Art Institute of Chicago",
  },
  {
    id: "net-menders",
    title: "The Net Menders",
    artist: "Jan Toorop",
    artistId: "toorop",
    year: "1899",
    remote:
      "https://openaccess-cdn.clevelandart.org/1934.163/1934.163_print.jpg",
    credit: "Cleveland Museum of Art",
  },
  {
    id: "group-laborers",
    title: "A Group of Laborers",
    artist: "Jan Toorop",
    artistId: "toorop",
    year: "1899",
    remote:
      "https://openaccess-cdn.clevelandart.org/1938.37/1938.37_print.jpg",
    credit: "Cleveland Museum of Art",
  },
];

export const FEATURED_IDS = [
  "self-portrait",
  "footbridge",
  "cradle",
  "old-guitarist",
  "parasol",
  "the-kiss",
];

export function paintingById(id) {
  return PAINTINGS.find((p) => p.id === id);
}

export function paintingsByArtist(artistId) {
  return PAINTINGS.filter((p) => p.artistId === artistId);
}

export function featuredPaintings() {
  return FEATURED_IDS.map(paintingById).filter(Boolean);
}
