export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'office' | 'dining' | 'outdoor' | 'bathroom' | 'entryway' | 'laundry' | 'home-office' | 'study' | 'gaming' | 'coffee-shop' | 'attic' | 'other';

export interface RoomTypeOption {
  id: RoomType;
  label: string;
  icon: string;
}

export interface RoomStyle {
  id: string;
  name: string;
  emoji: string;
  description: string;
  colorHint: string; // tailwind bg class for visual swatch
  prompt: string;
  previewImgUrl: string;
}

export interface PresetFurniture {
  id: string;
  name: string;
  thumbnailUrl: string;
  style: string; // e.g. 'Modern', 'Scandinavian' - used for filtering
  category: 'seating' | 'tables' | 'storage' | 'beds' | 'lighting' | 'decor';
}

export interface SelectedFurnitureItem {
  id: string;
  name: string;
  file: File;
  previewUrl: string;
  isPreset: boolean;
}

export interface BuildRoomRequest {
  roomImage?: File;
  furnitureItems: File[];
  roomType: RoomType;
  styleId: string;
  styleName: string;
  stylePrompt: string;
  autoComplete: boolean;
  prompt?: string;
  userId: string;
}

export const ROOM_TYPE_OPTIONS: RoomTypeOption[] = [
  { id: 'living', label: 'Living Room', icon: '🛋️' },
  { id: 'bedroom', label: 'Bedroom', icon: '🛏️' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'bathroom', label: 'Bathroom', icon: '🛁' },
  { id: 'dining', label: 'Dining Room', icon: '🍽️' },
  { id: 'entryway', label: 'Entryway', icon: '🚪' },
  { id: 'laundry', label: 'Laundry Room', icon: '🧺' },
  { id: 'office', label: 'Office', icon: '💼' },
  { id: 'home-office', label: 'Home Office', icon: '💻' },
  { id: 'study', label: 'Study Room', icon: '📚' },
  { id: 'gaming', label: 'Gaming Room', icon: '🎮' },
  { id: 'coffee-shop', label: 'Coffee Shop', icon: '☕' },
  { id: 'attic', label: 'Attic', icon: '🪜' },
  { id: 'other', label: 'Other', icon: '✨' }
]

export const ROOM_STYLES: RoomStyle[] = [
  {
    id: 'modern',
    name: 'Modern',
    emoji: '◻️',
    description: 'Sleek, high-contrast, and gallery-inspired',
    colorHint: 'bg-gray-200',
    prompt: 'Ultra-modern high-end interior, bold geometric architectural forms, high-contrast palette of charcoal and soft white, low-profile Italian designer furniture, floor-to-ceiling windows, polished concrete floors, indirect LED cove lighting, oversized abstract canvas art, 8k resolution, cinematic lighting.',
    previewImgUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cozy',
    name: 'Cozy',
    emoji: '☕',
    description: 'Warm layers, soft textures, and glow',
    colorHint: 'bg-orange-100',
    prompt: 'High-end cozy sanctuary, layered heavy-knit boucle and cashmere textiles, oversized plush cloud-style sectional, warm ambient glowing light from designer floor lamps, crackling modern linear fireplace, light oak wood accents, thick wool area rug, amber-toned photography, 8k ultra-detailed.',
    previewImgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    description: 'Magical, nostalgic holiday glow',
    colorHint: 'bg-red-100',
    prompt: 'Magical luxury Christmas interior, 12-foot Balsam Fir tree with thousands of tiny warm-white fairy lights, gold and champagne glass ornaments, velvet stockings on a stone mantel, pine-scented garlands with eucalyptus, warm flickering candlelight, snowy window view, soft bokeh photography, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    emoji: '✨',
    description: 'High-end, elegant and opulent',
    colorHint: 'bg-yellow-100',
    prompt: 'Bespoke luxury penthouse design, book-matched Calacatta marble walls, brushed champagne gold hardware, velvet curved furniture, massive tiered crystal chandelier, inset silk rugs, Architectural Digest photography, opulent textures, grand scale, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    emoji: '🤍',
    description: 'Zen-like, architectural purity',
    colorHint: 'bg-slate-100',
    prompt: 'High-end minimalist sanctuary, museum-quality negative space, seamless handle-less cabinetry, single statement designer lounge chair, limestone flooring, architectural soft shadows, strictly monochromatic warm-whites, hidden lighting, ultra-clean and serene, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    emoji: '🦌',
    description: 'Nordic Hygge, light woods, and air',
    colorHint: 'bg-stone-100',
    prompt: 'Premium Scandinavian Hygge, pale ash wood furniture, Hans Wegner inspired chairs, white linen curtains, minimalist ceramic vase with dried branches, soft natural northern light, muted sage and cream palette, clean functional aesthetics, bright airy photography, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'farmhouse',
    name: 'Farmhouse',
    emoji: '🌾',
    description: 'Modern rustic, shiplap, and charm',
    colorHint: 'bg-amber-100',
    prompt: 'Modern luxury farmhouse, soaring vaulted ceilings with reclaimed oak beams, white shiplap walls, oversized black-framed windows, large apron-front sink, linen-upholstered dining chairs, matte black iron hardware, cozy sophisticated rural aesthetic, 8k photorealistic.',
    previewImgUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mid-century',
    name: 'Mid Century',
    emoji: '🕰️',
    description: 'Iconic 60s design, walnut and brass',
    colorHint: 'bg-orange-200',
    prompt: 'Authentic mid-century modern luxury, rich walnut wood paneling, Eames lounge chair, atomic-age brass Sputnik chandelier, geometric wool rug in burnt orange and teal, tapered furniture legs, sun-drenched 1960s Palm Springs vibe, iconic designer furniture, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    emoji: '🧳',
    description: 'Trendy, photogenic, and boutique',
    colorHint: 'bg-teal-100',
    prompt: 'Boutique Airbnb style, highly curated photogenic corners, neon "good vibes" sign, gallery wall with abstract art, mix of velvet and rattan textures, trendy indoor fiddle leaf fig trees, bright "Instagrammable" professional photography, vibrant and welcoming, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    emoji: '🌊',
    description: 'Ibiza villa, white stucco, sea tones',
    colorHint: 'bg-blue-100',
    prompt: 'Luxury Ibiza villa interior, hand-applied white lime-plaster walls, soft organic arched niches, terracotta Zellige tiles, heavy rustic wooden ceiling beams, woven esparto grass decor, azure blue accents, sun-drenched sunroom, Mediterranean high-end resort feel, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'biophilic',
    name: 'Biophilic',
    emoji: '🌿',
    description: 'Nature-infused, jungle luxury',
    colorHint: 'bg-green-100',
    prompt: 'High-end biophilic architecture, indoor vertical living moss walls, integrated planters with tropical ferns, natural stone water feature, skylights pouring natural light, raw edge wood furniture, organic shapes, seamless connection to nature, fresh and oxygenated atmosphere, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1597218868981-1b68e15f0065?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'rustic',
    name: 'Rustic',
    emoji: '🪵',
    description: 'Mountain lodge, raw wood and stone',
    colorHint: 'bg-yellow-900',
    prompt: 'Modern luxury mountain lodge, massive dry-stack river stone fireplace, hand-hewn cedar log beams, thick faux-fur throws, heavy leather armchairs, wrought iron chandeliers, warm wood-fire glow, panoramic mountain views through glass, 8k ultra-realistic.',
    previewImgUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'zen',
    name: 'Zen',
    emoji: '🧘',
    description: 'Tranquil, balanced, and meditative',
    colorHint: 'bg-stone-200',
    prompt: 'Meditative Zen interior, low-profile black slate furniture, sand-colored walls, bamboo privacy screens, indoor bonsai focal point, soft diffused paper-filtered light, harmonious empty space, pebbles and water element, tranquil sanctuary, 8k resolution.',
    previewImgUrl: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'japandi',
    name: 'Japandi',
    emoji: '🍵',
    description: 'Minimalist soul meets Nordic warmth',
    colorHint: 'bg-orange-50',
    prompt: 'Sophisticated Japandi aesthetic, raw unfinished light oak, Wabi-sabi principles, low-profile black ash furniture, textured plaster walls (Limewash), paper lantern pendant lights (Noguchi style), minimalist ceramic decor, soft natural daylight, serene and balanced, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'coastal',
    name: 'Coastal',
    emoji: '🐚',
    description: 'Hamptons breezy beach house',
    colorHint: 'bg-cyan-100',
    prompt: 'Hamptons luxury coastal style, crisp white linen slipcovered sofas, driftwood coffee table, jute and sisal rugs, coral and seashell decor, nautical navy blue pinstripe accents, bright breezy ocean air, sun-bleached wood floors, high-end beach house photography, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    emoji: '📻',
    description: 'Nostalgic charm and heirloom decor',
    colorHint: 'bg-rose-100',
    prompt: 'Elegant vintage revival, curated antique furniture with patina, floral silk wallpaper, ornate gilded mirrors, lace curtains, rich mahogany wood, nostalgic warm color palette, heirloom decor, beautifully layered and lived-in Victorian-inspired look, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tropical',
    name: 'Tropical',
    emoji: '🌴',
    description: 'Bali resort, lush and exotic',
    colorHint: 'bg-lime-100',
    prompt: 'Ultra-luxury Bali resort interior, thatched Alang-Alang roofing, dark volcanic stone walls, lush exotic jungle indoor landscaping, oversized monsteras and palms, sunken floor lounge, glowing warm outdoor lanterns, exotic paradise vibe, 8k resolution.',
    previewImgUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    emoji: '🏗️',
    description: 'New York loft, raw and edgy',
    colorHint: 'bg-zinc-300',
    prompt: 'Luxury New York loft industrial style, double-height ceilings, weathered red brick, matte black steel beams, cognac distressed leather sofa, reclaimed wood dining table, Edison bulb statement lighting, polished concrete floors, gritty yet high-end, 8k photorealistic.',
    previewImgUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'halloween',
    name: 'Halloween',
    emoji: '🎃',
    description: 'Spooky, festive, and eerie',
    colorHint: 'bg-orange-600',
    prompt: 'Sophisticated Halloween haunted manor, hundreds of glowing floating candles, real carved pumpkins with intricate faces, black lace textiles, gothic candelabras, mist and low-lying fog on the floor, eerie orange and purple ambient light, dark Victorian mystery, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    emoji: '🎨',
    description: '3D Pixar-style, vibrant and playful',
    colorHint: 'bg-yellow-300',
    prompt: 'Stylized 3D cartoon interior, Pixar-style animation render, chunky rounded furniture proportions, vibrant saturated colors, soft plastic textures, glowing toy-like appearance, whimsical and high-quality 3D illustration, volumetric lighting, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'medieval',
    name: 'Medieval',
    emoji: '🛡️',
    description: 'Gothic castle, stone and iron',
    colorHint: 'bg-stone-400',
    prompt: 'Epic Medieval castle hall, massive vaulted stone arches, roaring walk-in fireplace, long solid oak banquet table, wrought iron chandeliers with dripping wax candles, wall-hung tapestries, fur rugs, mysterious torchlight, Game of Thrones aesthetic, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1574610758891-5b809b6e6e2e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'concrete',
    name: 'Concrete',
    emoji: '🧱',
    description: 'Brutalist, raw, and structural',
    colorHint: 'bg-gray-400',
    prompt: 'Architectural Brutalist interior, raw board-formed concrete walls, structural concrete beams, minimalist modular furniture in slate grey, massive glass windows, stark sunlight and deep shadows, industrial monochromatic masterpiece, 8k photorealistic.',
    previewImgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    emoji: '🧶',
    description: 'Artistic, botanical, and free-spirited',
    colorHint: 'bg-fuchsia-100',
    prompt: 'Luxury boho-chic interior, eclectic curated treasures, hand-woven Moroccan rugs, abundant indoor jungle of tropical plants, rattan hanging egg chair, colorful velvet floor cushions, warm sun-drenched photography, macrame art, artistic and vibrant, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1529338296731-c4280a44fc48?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'baroque',
    name: 'Baroque',
    emoji: '👑',
    description: 'Gilded, dramatic, and royal',
    colorHint: 'bg-purple-200',
    prompt: 'Grand Baroque palace interior, 24k gold leaf ornate moldings, ceiling fresco paintings, deep crimson velvet upholstery, intricate marquetry furniture, dramatic chiaroscuro lighting, Versailles-inspired opulence, royal and theatrical, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    emoji: '🌈',
    description: 'Pop-art, maximalist, and neon',
    colorHint: 'bg-pink-100',
    prompt: 'Vibrant Rainbow maximalist interior, Pop-art aesthetic, multicolored acrylic furniture, neon-lit bookshelves, bold clashing patterns, joyful energetic atmosphere, saturated candy colors, highly artistic and avant-garde, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    emoji: '🤖',
    description: 'Futuristic neon and tech-noir',
    colorHint: 'bg-indigo-900',
    prompt: 'High-tech Cyberpunk apartment, futuristic carbon fiber furniture, neon pink and cyan recessed LED strips, dark chrome surfaces, holographic decor elements, rain-streaked window view with city lights, cinematic sci-fi atmosphere, Unreal Engine 5 render style, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'gothic',
    name: 'Gothic',
    emoji: '🦇',
    description: 'Moody Victorian Noir',
    colorHint: 'bg-black',
    prompt: 'Modern Gothic luxury, matte black walls with ornate molding, deep purple velvet wingback chairs, silver candelabras, ravens-wing black decor, mysterious atmospheric lighting, Victorian noir elegance, dramatic and sophisticated, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'techno',
    name: 'Techno',
    emoji: '🎛️',
    description: 'Industrial club, lasers, and steel',
    colorHint: 'bg-blue-900',
    prompt: 'Berlin techno club aesthetic, industrial raw steel surfaces, strobing blue and white laser lights, minimalist black modular seating, Funktion-One speaker stacks, dark moody warehouse vibe, smoke and haze effect, underground nightlife vibe, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'creepy',
    name: 'Creepy',
    emoji: '🕸️',
    description: 'Abandoned, haunted, and chilling',
    colorHint: 'bg-slate-800',
    prompt: 'Chilling abandoned mansion interior, peeling lead paint, rotting floorboards, dust-covered grand piano, cobwebs over antique mirrors, unsettling long shadows, cold moonlight through broken windows, terrifying horror movie atmosphere, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1509909756405-be0199881695?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'japanese',
    name: 'Japanese',
    emoji: '🏯',
    description: 'Traditional Washitsu and Tatami',
    colorHint: 'bg-red-50',
    prompt: 'Traditional Japanese Washitsu room, premium woven tatami flooring, handmade shoji sliding paper doors, low solid cedar wood table, zabuton floor cushions, tokonoma alcove with single scroll and flower, soft diffused paper lighting, extremely serene, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=400&q=80'
  },
{
    id: 'moroccan-style',
    name: 'Moroccan',
    emoji: '🇲🇦',
    description: 'Authentic Moroccan furniture and room design',
    colorHint: 'bg-orange-800',
    prompt: 'Professional Moroccan interior design. Transform this space into an authentic Moroccan room using traditional Moroccan furniture, carved wood tables, authentic seating, and Moroccan architectural influences. Every piece of furniture must be Moroccan style. Photorealistic, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=400&q=80'
  },
];

export const OUTDOOR_STYLES: RoomStyle[] = [
  {
    id: 'outdoor-modern',
    name: 'Modern',
    emoji: '◻️',
    description: 'Architectural, glass-heavy, and sharp',
    colorHint: 'bg-gray-200',
    prompt: 'Contemporary architectural masterpiece, cantilevered rooflines, floor-to-ceiling glass pivot doors, black basalt stone cladding, white smooth stucco, infinity edge pool with turquoise water, minimalist fire pit lounge, professional architectural evening photography, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-retro',
    name: 'Retro',
    emoji: '📻',
    description: '1950s Americana, pastel and neon',
    colorHint: 'bg-yellow-100',
    prompt: 'Mid-century American Googie architecture, pastel pink and mint green facade, boomerang-shaped roof overhang, retro neon signage, classic 1950s vintage cars in driveway, desert palms, nostalgic retro-future aesthetic, Kodachrome photography style, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-christmas',
    name: 'Christmas',
    emoji: '🎄',
    description: 'Holiday magic and winter snow',
    colorHint: 'bg-red-100',
    prompt: 'Magical luxury Christmas exterior, thousands of warm-white LEDs tracing the roofline, professional outdoor light show, giant lit wreaths, snow-covered landscape, glowing interior lights through windows, festive holiday curb appeal, 8k cinematic.',
    previewImgUrl: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-cozy',
    name: 'Cozy',
    emoji: '☕',
    description: 'Storybook cottage and English garden',
    colorHint: 'bg-orange-100',
    prompt: 'Charming English storybook cottage, Cotswold stone walls, thatched roof, climbing pink roses and ivy, cobblestone path, warm glowing windows at dusk, lush perennial garden, inviting porch with wooden swings, 8k ultra-romantic.',
    previewImgUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-rustic',
    name: 'Rustic',
    emoji: '🪵',
    description: 'Timber-frame ranch and wilderness',
    colorHint: 'bg-amber-100',
    prompt: 'Luxury rustic ranch exterior, heavy timber-frame construction, rough-cut stone foundation, wrap-around porch, outdoor stone fireplace, rugged wilderness setting with pine trees, warm lantern lighting, high-end mountain architecture, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-farmhouse',
    name: 'Farmhouse',
    emoji: '🏡',
    description: 'Modern white farmhouse estate',
    colorHint: 'bg-stone-100',
    prompt: 'Modern luxury farmhouse exterior, crisp white board-and-batten siding, black metal standing seam roof, massive wrap-around porch with rocking chairs, symmetrical barn-style windows, manicured lawn with lavender, high-end rural estate, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-minimalist',
    name: 'Minimalist',
    emoji: '⬜',
    description: 'Sculptural, pure, and desert-cool',
    colorHint: 'bg-neutral-100',
    prompt: 'Architectural minimalist exterior, pure white monolithic forms, flat roof, hidden gutters, single desert tree in a courtyard, gravel landscape with sculptural rocks, shadow-play on blank walls, ultra-modern and peaceful, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-tropical',
    name: 'Tropical',
    emoji: '🌴',
    description: 'Bali resort, lush and exotic',
    colorHint: 'bg-green-100',
    prompt: 'Ultra-luxury Bali resort exterior, thatched Alang-Alang roofing, dark volcanic stone walls, lush exotic jungle landscaping, oversized monsteras and palms, sunken poolside lounge, glowing warm outdoor lanterns, exotic paradise vibe, 8k resolution.',
    previewImgUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-luxury',
    name: 'Luxury',
    emoji: '💎',
    description: 'Grand estate, manicured and elite',
    colorHint: 'bg-yellow-50',
    prompt: 'Grand European estate facade, limestone walls, symmetrical formal gardens, white marble fountain, dramatic architectural uplighting, high-end designer outdoor kitchen, Bentley-level luxury, crisp sunset lighting, 8k ultra-detailed.',
    previewImgUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-mediterranean',
    name: 'Mediterranean',
    emoji: '🏛️',
    description: 'Tuscan villa, olive trees, and sun',
    colorHint: 'bg-orange-50',
    prompt: 'Luxury Tuscan villa facade, warm ochre stucco walls, terracotta tile roof, arched stone loggias, climbing purple bougainvillea, century-old olive trees, wrought iron balconies, sun-drenched Italian countryside, 8k photorealistic.',
    previewImgUrl: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-midcentury',
    name: 'Midcentury',
    emoji: '🕰️',
    description: 'Palm Springs chic, desert and glass',
    colorHint: 'bg-teal-50',
    prompt: 'Iconic Palm Springs mid-century exterior, low-slung roofline, decorative breeze blocks, bright orange front door, desert xeriscaping with cacti, swimming pool reflecting the sunset, retro-luxury aesthetic, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-zen',
    name: 'Zen',
    emoji: '🪨',
    description: 'Japanese garden, moss and serenity',
    colorHint: 'bg-stone-50',
    prompt: 'Traditional Japanese garden exterior, raked white sand (Karesansui), aged bonsai trees, moss-covered granite lanterns, dark Shou Sugi Ban wood facade, koi pond with wooden bridge, extremely peaceful and balanced, 8k.',
    previewImgUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=400&q=80'
  }
];

export const PRESET_FURNITURE: PresetFurniture[] = [
  // --- SEATING ---
  { id: 'sofa-modern', name: 'Velvet Modern Sofa', thumbnailUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', category: 'seating', style: 'Modern' },
  { id: 'armchair-tan', name: 'Leather Armchair', thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', category: 'seating', style: 'Mid-Century' },
  { id: 'accent-chair', name: 'Boucle Accent Chair', thumbnailUrl: 'https://images.unsplash.com/photo-1598191950976-397a5cb3a828?w=400&q=80', category: 'seating', style: 'Minimalist' },
  { id: 'bench-wooden', name: 'Entryway Bench', thumbnailUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80', category: 'seating', style: 'Rustic' },
  { id: 'office-chair', name: 'Ergonomic Desk Chair', thumbnailUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80', category: 'seating', style: 'Office' },

  // --- TABLES ---
  { id: 'coffee-table-round', name: 'Marble Coffee Table', thumbnailUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80', category: 'tables', style: 'Luxury' },
  { id: 'dining-table-oak', name: 'Oak Dining Table', thumbnailUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400&q=80', category: 'tables', style: 'Scandinavian' },
  { id: 'desk-minimal', name: 'Floating Desk', thumbnailUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80', category: 'tables', style: 'Minimalist' },
  { id: 'side-table-gold', name: 'Gold Side Table', thumbnailUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&q=80', category: 'tables', style: 'Modern' },
  { id: 'bar-cart', name: 'Industrial Bar Cart', thumbnailUrl: 'https://images.unsplash.com/photo-1538600100414-046607e408d6?w=400&q=80', category: 'tables', style: 'Industrial' },

  // --- BEDS ---
  { id: 'bed-queen-linen', name: 'Linen Platform Bed', thumbnailUrl: 'https://images.unsplash.com/photo-1505693415957-283a9f9b581c?w=400&q=80', category: 'beds', style: 'Cozy' },
  { id: 'bed-canopy', name: 'Iron Canopy Bed', thumbnailUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', category: 'beds', style: 'Luxury' },
  { id: 'headboard-velvet', name: 'Tufted Headboard', thumbnailUrl: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=400&q=80', category: 'beds', style: 'Vintage' },

  // --- STORAGE ---
  { id: 'bookshelf-tall', name: 'Walnut Bookshelf', thumbnailUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&q=80', category: 'storage', style: 'Mid-Century' },
  { id: 'dresser-white', name: 'Minimalist Dresser', thumbnailUrl: 'https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?w=400&q=80', category: 'storage', style: 'Minimalist' },
  { id: 'media-console', name: 'Slatted Media Unit', thumbnailUrl: 'https://images.unsplash.com/photo-1601058268499-e526584ee228?w=400&q=80', category: 'storage', style: 'Modern' },
  { id: 'wardrobe-glass', name: 'Glass Wardrobe', thumbnailUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80', category: 'storage', style: 'Luxury' },

  // --- LIGHTING ---
  { id: 'floor-lamp-arc', name: 'Arc Floor Lamp', thumbnailUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed657f9971?w=400&q=80', category: 'lighting', style: 'Modern' },
  { id: 'pendant-rattan', name: 'Rattan Pendant', thumbnailUrl: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb21?w=400&q=80', category: 'lighting', style: 'Bohemian' },
  { id: 'table-lamp-ceramic', name: 'Ceramic Table Lamp', thumbnailUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=400&q=80', category: 'lighting', style: 'Zen' },
  { id: 'chandelier-modern', name: 'Linear Chandelier', thumbnailUrl: 'https://images.unsplash.com/photo-1513506491741-11636bc526ad?w=400&q=80', category: 'lighting', style: 'Modern' },

  // --- DECOR ---
  { id: 'plant-monstera', name: 'Monstera Plant', thumbnailUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80', category: 'decor', style: 'Biophilic' },
  { id: 'rug-jute', name: 'Natural Jute Rug', thumbnailUrl: 'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?w=400&q=80', category: 'decor', style: 'Coastal' },
  { id: 'mirror-round', name: 'Brass Round Mirror', thumbnailUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80', category: 'decor', style: 'Modern' },
  { id: 'art-abstract', name: 'Abstract Canvas', thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80', category: 'decor', style: 'Modern' },
  { id: 'curtains-linen', name: 'Linen Curtains', thumbnailUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80', category: 'decor', style: 'Cozy' },
  { id: 'vase-terracotta', name: 'Terracotta Vase', thumbnailUrl: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&q=80', category: 'decor', style: 'Mediterranean' },

  // --- KITCHEN/DINING ---
  { id: 'bar-stool', name: 'Leather Bar Stool', thumbnailUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80', category: 'seating', style: 'Industrial' },
  { id: 'kitchen-island', name: 'Marble Island', thumbnailUrl: 'https://images.unsplash.com/photo-1556911223-e250e3383f58?w=400&q=80', category: 'tables', style: 'Luxury' },
  { id: 'shelving-open', name: 'Oak Wall Shelves', thumbnailUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&q=80', category: 'storage', style: 'Scandinavian' },
];

export interface SurfaceEditRequest {
  roomImage: File;
  type: 'walls' | 'flooring';
  styleId: string;
  styleName: string;
  stylePrompt: string;
  customStyle?: string;
  palettePrompt?: string;
  userId: string;
}

export const WALL_STYLES: RoomStyle[] = [
  {
    id: 'wall-white',
    name: 'Pure White',
    emoji: '🤍',
    description: 'Crisp bright white paint finish',
    colorHint: 'bg-white',
    prompt: 'pure white smooth painted walls, bright and clean finish, timeless minimal look',
    previewImgUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-beige',
    name: 'Warm Beige',
    emoji: '🟤',
    description: 'Soft warm neutral paint',
    colorHint: 'bg-amber-100',
    prompt: 'warm beige painted walls, soft neutral earthy tone, cozy and welcoming atmosphere',
    previewImgUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-sage',
    name: 'Sage Green',
    emoji: '🌿',
    description: 'Muted earthy green tone',
    colorHint: 'bg-green-200',
    prompt: 'sage green painted walls, muted earthy green, calming and nature-inspired tone',
    previewImgUrl: 'https://images.unsplash.com/photo-1597218868981-1b68e15f0065?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-navy',
    name: 'Navy Blue',
    emoji: '🔵',
    description: 'Deep rich blue statement wall',
    colorHint: 'bg-blue-900',
    prompt: 'deep navy blue painted walls, bold and dramatic statement color, sophisticated and moody',
    previewImgUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-terracotta',
    name: 'Terracotta',
    emoji: '🏺',
    description: 'Warm earthy clay tones',
    colorHint: 'bg-orange-300',
    prompt: 'terracotta painted walls, warm earthy clay orange tone, Mediterranean and bohemian feel',
    previewImgUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-brick',
    name: 'Exposed Brick',
    emoji: '🧱',
    description: 'Raw industrial red brick',
    colorHint: 'bg-red-400',
    prompt: 'exposed raw red brick walls, industrial loft aesthetic, rustic and textured surface',
    previewImgUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-marble',
    name: 'Marble Cladding',
    emoji: '🏛️',
    description: 'Luxurious white marble panels',
    colorHint: 'bg-gray-100',
    prompt: 'luxury white marble cladding on walls, elegant veined marble panels, high-end and opulent finish',
    previewImgUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09be1587?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-wood',
    name: 'Wood Paneling',
    emoji: '🪵',
    description: 'Warm natural wood slats',
    colorHint: 'bg-amber-700',
    prompt: 'natural wood wall paneling, warm vertical wood slats, organic and Scandinavian inspired texture',
    previewImgUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-concrete',
    name: 'Raw Concrete',
    emoji: '🪨',
    description: 'Brutalist polished concrete',
    colorHint: 'bg-gray-400',
    prompt: 'raw polished concrete walls, brutalist industrial aesthetic, smooth grey textured finish',
    previewImgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-geometric',
    name: 'Geometric Wallpaper',
    emoji: '🔷',
    description: 'Bold geometric patterned wallpaper',
    colorHint: 'bg-indigo-100',
    prompt: 'geometric patterned wallpaper on walls, bold modern shapes, contemporary designer wallcovering',
    previewImgUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-floral',
    name: 'Floral Wallpaper',
    emoji: '🌸',
    description: 'Vintage botanical print wallpaper',
    colorHint: 'bg-rose-100',
    prompt: 'vintage floral botanical wallpaper, delicate botanical print pattern, romantic and classic wallcovering',
    previewImgUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wall-stone',
    name: 'Stone Cladding',
    emoji: '🪨',
    description: 'Natural stacked stone texture',
    colorHint: 'bg-stone-400',
    prompt: 'natural stacked stone wall cladding, rustic textured stone finish, earthy and substantial look',
    previewImgUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&q=80'
  },
];

export const FLOOR_STYLES: RoomStyle[] = [
  {
    id: 'floor-oak',
    name: 'Light Oak',
    emoji: '🪵',
    description: 'Bright Scandinavian oak wood',
    colorHint: 'bg-amber-200',
    prompt: 'light oak hardwood flooring, bright natural wood grain, Scandinavian minimalist style',
    previewImgUrl: 'https://images.unsplash.com/photo-1598928506311-c55dd1b31042?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-walnut',
    name: 'Dark Walnut',
    emoji: '🟫',
    description: 'Rich deep walnut hardwood',
    colorHint: 'bg-amber-900',
    prompt: 'dark rich walnut hardwood flooring, deep brown wood grain, luxurious and classic look',
    previewImgUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-herringbone',
    name: 'Herringbone',
    emoji: '〽️',
    description: 'Classic herringbone parquet pattern',
    colorHint: 'bg-amber-300',
    prompt: 'herringbone parquet wood flooring, classic chevron pattern, sophisticated and timeless design',
    previewImgUrl: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-marble',
    name: 'White Marble',
    emoji: '🏛️',
    description: 'Polished white Carrara marble',
    colorHint: 'bg-gray-50',
    prompt: 'polished white Carrara marble floor tiles, elegant veined marble surface, luxury and high-end finish',
    previewImgUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09be1587?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-terracotta',
    name: 'Terracotta Tile',
    emoji: '🟧',
    description: 'Warm Mediterranean clay tiles',
    colorHint: 'bg-orange-300',
    prompt: 'terracotta clay floor tiles, warm Mediterranean aesthetic, rustic handmade tile texture',
    previewImgUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-concrete',
    name: 'Polished Concrete',
    emoji: '🪨',
    description: 'Smooth industrial concrete',
    colorHint: 'bg-gray-400',
    prompt: 'polished smooth concrete flooring, industrial minimalist aesthetic, seamless grey surface',
    previewImgUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-grey-tile',
    name: 'Grey Porcelain',
    emoji: '⬜',
    description: 'Large format grey porcelain tiles',
    colorHint: 'bg-gray-300',
    prompt: 'large format grey porcelain floor tiles, clean and modern, matte grey finish with thin grout lines',
    previewImgUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-carpet',
    name: 'Plush Carpet',
    emoji: '🟩',
    description: 'Soft thick pile carpet',
    colorHint: 'bg-stone-300',
    prompt: 'plush thick pile carpet flooring, soft and comfortable, cozy and luxurious texture',
    previewImgUrl: 'https://images.unsplash.com/photo-1583847268964-b28ce8fde1e3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-limestone',
    name: 'Limestone',
    emoji: '🌕',
    description: 'Natural beige limestone tiles',
    colorHint: 'bg-yellow-100',
    prompt: 'natural limestone floor tiles, warm beige stone surface, Mediterranean villa aesthetic',
    previewImgUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-checkerboard',
    name: 'Checkerboard',
    emoji: '♟️',
    description: 'Classic black and white tiles',
    colorHint: 'bg-gray-900',
    prompt: 'classic black and white checkerboard floor tiles, retro vintage pattern, bold and graphic design',
    previewImgUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-bamboo',
    name: 'Bamboo',
    emoji: '🎋',
    description: 'Eco-friendly bamboo flooring',
    colorHint: 'bg-lime-200',
    prompt: 'natural bamboo hardwood flooring, eco-friendly sustainable material, light warm green-tan tone',
    previewImgUrl: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'floor-encaustic',
    name: 'Encaustic Tile',
    emoji: '🔶',
    description: 'Decorative patterned cement tiles',
    colorHint: 'bg-teal-200',
    prompt: 'decorative encaustic cement floor tiles, colorful geometric pattern, Moroccan-inspired artistic design',
    previewImgUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80'
  },
];

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[]; // hex values to display as circles
  prompt: string;   // used in AI prompt
}

export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'aqua-drift',     name: 'Aqua Drift',      colors: ['#B2EBF2','#80DEEA','#4DD0E1','#26C6DA'], prompt: 'aqua and teal tones, refreshing water-inspired palette' },
  { id: 'aqua-glow',      name: 'Aqua Glow',       colors: ['#A7FFEB','#64FFDA','#1DE9B6','#00BCD4'], prompt: 'bright aqua and cyan glow palette, vibrant tropical feel' },
  { id: 'arctic-mist',    name: 'Arctic Mist',     colors: ['#ECEFF1','#CFD8DC','#B0BEC5','#90A4AE'], prompt: 'cool grey and blue-grey arctic tones, minimal icy palette' },
  { id: 'autumn-glow',    name: 'Autumn Glow',     colors: ['#FFF176','#FFD54F','#FFB300','#E65100'], prompt: 'warm amber, golden yellow and burnt orange autumn palette' },
  { id: 'azure-coast',    name: 'Azure Coast',     colors: ['#B3E5FC','#81D4FA','#4FC3F7','#0288D1'], prompt: 'ocean blue and sky azure coastal palette' },
  { id: 'blush-bloom',    name: 'Blush Bloom',     colors: ['#FCE4EC','#F8BBD9','#F48FB1','#C2185B'], prompt: 'soft blush pink and rose bloom palette, feminine and delicate' },
  { id: 'candy-sky',      name: 'Candy Sky',       colors: ['#FFD1DC','#FFB7C5','#B5EAD7','#C7CEEA'], prompt: 'pastel candy colors, playful soft pinks, mints and lavenders' },
  { id: 'coral-haze',     name: 'Coral Haze',      colors: ['#FFDDCB','#FFCBA4','#FFB085','#E8735A'], prompt: 'warm coral and peach tones, sun-kissed hazy palette' },
  { id: 'crimson-luxury', name: 'Crimson Luxury',  colors: ['#922B21','#B22222','#C0392B','#8B0000'], prompt: 'deep crimson and rich burgundy red, luxurious and bold palette' },
  { id: 'dusky-calm',     name: 'Dusky Calm',      colors: ['#37474F','#455A64','#78909C','#B0BEC5'], prompt: 'dusky blue-grey and slate tones, calm and sophisticated palette' },
  { id: 'earth-tones',    name: 'Earth Tones',     colors: ['#795548','#8D6E63','#A1887F','#D7CCC8'], prompt: 'warm earthy browns, terracotta and sand natural palette' },
  { id: 'forest-dream',   name: 'Forest Dream',    colors: ['#1B5E20','#2E7D32','#43A047','#66BB6A'], prompt: 'deep forest greens and moss tones, natural woodland palette' },
  { id: 'golden-hour',    name: 'Golden Hour',     colors: ['#F57F17','#F9A825','#FDD835','#FFEE58'], prompt: 'warm golden yellows and amber tones, sunset golden hour palette' },
  { id: 'lavender-haze',  name: 'Lavender Haze',  colors: ['#EDE7F6','#D1C4E9','#9575CD','#7E57C2'], prompt: 'soft lavender and purple haze palette, dreamy and romantic' },
  { id: 'mint-fresh',     name: 'Mint Fresh',      colors: ['#E8F5E9','#C8E6C9','#81C784','#66BB6A'], prompt: 'fresh mint and soft green palette, clean and invigorating' },
  { id: 'nordic-light',   name: 'Nordic Light',    colors: ['#FAFAFA','#F5F5F5','#EEEEEE','#BDBDBD'], prompt: 'clean nordic whites and light greys, airy Scandinavian palette' },
];
