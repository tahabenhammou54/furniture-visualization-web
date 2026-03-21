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
  // --- IMAGE 1 ---
  {
    id: 'modern',
    name: 'Modern',
    emoji: '◻️',
    description: 'Clean lines, sleek and neutral tones',
    colorHint: 'bg-gray-200',
    prompt: 'modern interior design style, clean geometric lines, neutral color palette of whites grays and blacks, minimalist furniture with sleek surfaces, open floor plan, abundant natural light, contemporary finishes, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cozy',
    name: 'Cozy',
    emoji: '☕',
    description: 'Warm, plush, and inviting',
    colorHint: 'bg-orange-100',
    prompt: 'cozy warm interior design, plush fabrics, soft warm ambient lighting, comfortable oversized furniture, inviting atmosphere, warm earth tones, soft textiles like knit blankets and rugs, realistic interior photography',
    previewImgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    description: 'Festive holiday atmosphere',
    colorHint: 'bg-red-100',
    prompt: 'Christmas interior decor, festive holiday decorations, decorated Christmas tree with glowing warm lights, stockings, glowing fireplace, pine garlands, red and green accents, magical winter atmosphere',
    previewImgUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    emoji: '✨',
    description: 'High-end, elegant and opulent',
    colorHint: 'bg-yellow-100',
    prompt: 'luxury interior design, elegant opulent decor, high-end materials like marble and polished brass, plush velvet furniture, grand crystal chandelier, sophisticated rich color palette, glamorous and expensive look, architectural digest style',
    previewImgUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    emoji: '🤍',
    description: 'Ultra clean, less is more',
    colorHint: 'bg-slate-100',
    prompt: 'minimalist interior design, ultra clean uncluttered space, essential modern furniture only, strictly monochromatic or light neutral palette, beautiful negative space, simple functional forms, maximizing natural light',
    previewImgUrl: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    emoji: '🦌',
    description: 'Light woods, airy and functional',
    colorHint: 'bg-stone-100',
    prompt: 'Scandinavian interior design, hygge aesthetic, light natural wood floors and furniture, crisp white walls, functional and simple layout, soft natural textiles, muted pastel or neutral tones, bright airy photography',
    previewImgUrl: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'farmhouse',
    name: 'Farmhouse',
    emoji: '🌾',
    description: 'Rustic charm meets modern comfort',
    colorHint: 'bg-amber-100',
    prompt: 'modern farmhouse interior, rustic elegance, distressed wood elements, white shiplap walls, sliding barn doors, vintage matte black metal fixtures, cozy and comfortable rural aesthetic, neutral base with earthy accents',
    previewImgUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mid-century',
    name: 'Mid Century',
    emoji: '🕰️',
    description: 'Retro 60s vibes, organic shapes',
    colorHint: 'bg-orange-200',
    prompt: 'Mid-century modern interior, retro 1950s 1960s aesthetic, teak wood furniture with tapered legs, organic curved shapes, bold geometric patterns, mustard yellow and teal accents, vintage classic iconic design',
    previewImgUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    emoji: '🧳',
    description: 'Trendy, photogenic, universal appeal',
    colorHint: 'bg-teal-100',
    prompt: 'trendy boutique Airbnb style interior, highly photogenic and inviting space, contemporary chic decor, mix of modern and subtle bohemian elements, indoor plants, stylish abstract wall art, bright and airy professional photography style',
    previewImgUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
  },

  // --- IMAGE 2 ---
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    emoji: '🌊',
    description: 'Coastal European, terracotta accents',
    colorHint: 'bg-blue-100',
    prompt: 'Mediterranean interior style, coastal European aesthetic, warm terracotta tiles, arched doorways, white stucco walls, wrought iron details, vibrant sea blue accents, airy and sun-drenched space',
    previewImgUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'biophilic',
    name: 'Biophilic',
    emoji: '🌿',
    description: 'Nature-inspired, abundant plants',
    colorHint: 'bg-green-100',
    prompt: 'biophilic interior design, abundant lush indoor plants, living green walls, natural materials like raw wood and stone, organic flowing shapes mimicking nature, maximizing daylight, seamless indoor-outdoor connection',
    previewImgUrl: 'https://images.unsplash.com/photo-1597218868981-1b68e15f0065?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'rustic',
    name: 'Rustic',
    emoji: '🪵',
    description: 'Raw wood, stone, earthy warmth',
    colorHint: 'bg-yellow-900',
    prompt: 'rustic interior design, rugged natural beauty, raw unfinished heavy wood beams, large stone fireplace, earthy warm colors, heavy sturdy furniture, cozy mountain cabin atmosphere, textured natural fabrics',
    previewImgUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'zen',
    name: 'Zen',
    emoji: '🧘',
    description: 'Peaceful, balanced, minimal',
    colorHint: 'bg-stone-200',
    prompt: 'Zen interior design, tranquil and peaceful space, minimalist layout inspired by traditional Japanese interiors, low profile furniture, bamboo elements, neutral earthy palette, soft diffused lighting, harmonious and highly balanced',
    previewImgUrl: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'japandi',
    name: 'Japandi',
    emoji: '🍵',
    description: 'Japanese minimalism meets Nordic',
    colorHint: 'bg-orange-50',
    prompt: 'Japandi interior design, perfect blend of Japanese minimalism and Scandinavian functionality, light oak wood, wabi-sabi aesthetics, muted warm neutrals, uncluttered surfaces, simple elegant forms, highly serene',
    previewImgUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'coastal',
    name: 'Coastal',
    emoji: '🐚',
    description: 'Breezy beach house vibes',
    colorHint: 'bg-cyan-100',
    prompt: 'coastal interior design, beach house aesthetic, light and breezy atmosphere, crisp white and soft blue ocean color palette, natural textures like rattan and jute, comfortable slipcovered furniture, subtle nautical touches',
    previewImgUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    emoji: '📻',
    description: 'Nostalgic charm, antique decor',
    colorHint: 'bg-rose-100',
    prompt: 'vintage interior design, eclectic mix of beautiful antique furniture, delicate floral wallpaper, ornate classic details, rich nostalgic color palette, heirloom decor pieces, classic retro charm, beautifully layered and lived-in look',
    previewImgUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tropical',
    name: 'Tropical',
    emoji: '🌴',
    description: 'Lush exotic plants, bold colors',
    colorHint: 'bg-lime-100',
    prompt: 'tropical interior design, lush exotic island atmosphere, bold botanical prints, large palm leaves, bamboo and rattan furniture, vibrant accent colors like emerald green and bright coral, airy and high-end resort feel',
    previewImgUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    emoji: '🏗️',
    description: 'Urban loft, exposed brick and metal',
    colorHint: 'bg-zinc-300',
    prompt: 'industrial interior design, urban loft aesthetic, exposed red brick walls, visible metal pipes and ducts, polished concrete floors, raw and unfinished architectural look, distressed leather furniture, dark moody tones',
    previewImgUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80'
  },

  // --- IMAGE 3 ---
  {
    id: 'halloween',
    name: 'Halloween',
    emoji: '🎃',
    description: 'Spooky, festive, orange and black',
    colorHint: 'bg-orange-600',
    prompt: 'Halloween interior decor, spooky and festive atmosphere, carved glowing jack-o-lantern pumpkins, faux cobwebs, dark black and orange color scheme, dim eerie lighting, gothic candles, playfully spooky seasonal decorations',
    previewImgUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    emoji: '🎨',
    description: 'Stylized 3D, bright primary colors',
    colorHint: 'bg-yellow-300',
    prompt: 'cartoon style interior, stylized 3D illustration look, bright saturated vibrant colors, exaggerated chunky furniture proportions, playful and whimsical atmosphere, soft cel-shaded or glossy toy-like appearance, highly fun and vibrant',
    previewImgUrl: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'medieval',
    name: 'Medieval',
    emoji: '🛡️',
    description: 'Castle-like, heavy wood, stone',
    colorHint: 'bg-stone-400',
    prompt: 'medieval interior design, historical castle-like atmosphere, heavy dark solid wood furniture, rough stone walls, forged iron chandeliers, tapestries, rich velvet fabrics, gothic architectural arches, warm flickering firelight',
    previewImgUrl: 'https://images.unsplash.com/photo-1574610758891-5b809b6e6e2e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'concrete',
    name: 'Concrete',
    emoji: '🧱',
    description: 'Brutalist, stark, monochrome',
    colorHint: 'bg-gray-400',
    prompt: 'concrete interior design, brutalist architectural elements, exposed poured concrete walls and floors, minimalist and highly industrial, stark structural forms, monochrome gray palette, sleek modern furniture contrasting the raw concrete',
    previewImgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    emoji: '🧶',
    description: 'Eclectic, colorful, layered textures',
    colorHint: 'bg-fuchsia-100',
    prompt: 'bohemian interior design, boho chic, highly eclectic and free-spirited, layered patterned rugs, macrame wall hangings, colorful warm vibrant palette, lots of indoor hanging plants, low floor seating, global inspired artisanal decor',
    previewImgUrl: 'https://images.unsplash.com/photo-1529338296731-c4280a44fc48?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'baroque',
    name: 'Baroque',
    emoji: '👑',
    description: 'Highly ornate, dramatic, luxurious',
    colorHint: 'bg-purple-200',
    prompt: 'baroque interior design, ultra ornate and highly dramatic, rich deep colors like burgundy red and bright gold leaf, elaborate molding and carved stucco, grand crystal chandeliers, luxurious heavy fabrics, intricate highly detailed antique furniture',
    previewImgUrl: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    emoji: '🌈',
    description: 'Extremely colorful and energetic',
    colorHint: 'bg-pink-100',
    prompt: 'rainbow interior design, extremely colorful and vibrant space, multicolored brightly painted furniture and accents, playful and bold maximalist aesthetic, pop art influences, highly energetic and joyful atmosphere',
    previewImgUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    emoji: '🤖',
    description: 'Neon lights, futuristic tech',
    colorHint: 'bg-indigo-900',
    prompt: 'cyberpunk interior design, futuristic sci-fi apartment aesthetic, glowing neon lights in hot pink and electric blue, high-tech gadgets, dark reflective metallic surfaces, dystopian urban elements, LED strips everywhere, sleek and highly advanced look',
    previewImgUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'gothic',
    name: 'Gothic',
    emoji: '🦇',
    description: 'Dark, moody, Victorian elegance',
    colorHint: 'bg-black',
    prompt: 'modern gothic interior design, dark and moody atmospheric space, pitch black walls or dark rich jewel tones, ornate Victorian gothic architecture elements, tufted velvet upholstery, dramatic focused lighting, antique mysterious decor',
    previewImgUrl: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'techno',
    name: 'Techno',
    emoji: '🎛️',
    description: 'Club vibes, LED lights, sleek',
    colorHint: 'bg-blue-900',
    prompt: 'techno club interior style, modern nightlife electronic aesthetic, dark room bathed in vibrant LED and laser lighting, sleek glossy metallic surfaces, minimalist futuristic lounge furniture, underground music studio vibe',
    previewImgUrl: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'creepy',
    name: 'Creepy',
    emoji: '🕸️',
    description: 'Dilapidated, eerie, haunted',
    colorHint: 'bg-slate-800',
    prompt: 'creepy interior, haunted house aesthetic, dilapidated and abandoned look, peeling distressed wallpaper, dusty covered antique furniture, eerie long shadows, dimly lit, unsettling and terrifying cinematic atmosphere',
    previewImgUrl: 'https://images.unsplash.com/photo-1509909756405-be0199881695?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'japanese',
    name: 'Japanese',
    emoji: '🏯',
    description: 'Traditional Washitsu, tatami mats',
    colorHint: 'bg-red-50',
    prompt: 'traditional Japanese interior design, washitsu room, woven tatami mats on the floor, sliding shoji paper doors, low wooden tables, minimalist floor cushions, tokonoma alcove, natural wood and paper materials, highly serene and balanced',
    previewImgUrl: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=400&q=80'
  }
];

export const OUTDOOR_STYLES: RoomStyle[] = [
  {
    id: 'outdoor-modern',
    name: 'Modern',
    emoji: '◻️',
    description: 'Clean lines, sleek and contemporary',
    colorHint: 'bg-gray-200',
    prompt: 'modern exterior design, clean geometric architecture, flat roof, large glass windows, minimalist facade, neutral tones of white and grey, sleek outdoor furniture, manicured lawn, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-retro',
    name: 'Retro',
    emoji: '📻',
    description: 'Vintage charm with nostalgic details',
    colorHint: 'bg-yellow-100',
    prompt: 'retro exterior design, vintage 1950s-1960s architectural style, pastel color palette, decorative trim, curved awnings, classic landscaping, nostalgic charm, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-christmas',
    name: 'Christmas',
    emoji: '🎄',
    description: 'Festive holiday exterior decor',
    colorHint: 'bg-red-100',
    prompt: 'Christmas exterior decor, holiday lights strung on the facade, wreath on the door, snow-dusted roof, red and green festive decorations, warm glowing windows, cozy winter atmosphere, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-cozy',
    name: 'Cozy',
    emoji: '☕',
    description: 'Warm, inviting cottage atmosphere',
    colorHint: 'bg-orange-100',
    prompt: 'cozy cottage exterior, warm stone facade, climbing ivy, flower boxes under windows, soft warm lighting, inviting front porch with rocking chairs, lush garden path, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-rustic',
    name: 'Rustic',
    emoji: '🪵',
    description: 'Natural wood and earthy textures',
    colorHint: 'bg-amber-100',
    prompt: 'rustic exterior design, natural wood siding and timber beams, stone foundation, metal roof, rough-hewn textures, wildflower garden, gravel path, rural countryside setting, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-farmhouse',
    name: 'Farmhouse',
    emoji: '🏡',
    description: 'Classic American farmhouse charm',
    colorHint: 'bg-stone-100',
    prompt: 'modern farmhouse exterior, white board and batten siding, black window frames, metal roof, covered front porch with wooden columns, raised garden beds, split rail fence, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-minimalist',
    name: 'Minimalist',
    emoji: '⬜',
    description: 'Simple, uncluttered and serene',
    colorHint: 'bg-neutral-100',
    prompt: 'minimalist exterior design, pure white stucco walls, flat roof, minimal landscaping with gravel and sculptural plants, clean uncluttered facade, hidden gutters, zen-like serenity, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-tropical',
    name: 'Tropical',
    emoji: '🌴',
    description: 'Lush, vibrant and exotic foliage',
    colorHint: 'bg-green-100',
    prompt: 'tropical exterior design, lush palm trees and exotic plants, thatched or bamboo accents, bright colorful facade, outdoor pergola with climbing vines, resort-style swimming pool, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-luxury',
    name: 'Luxury',
    emoji: '💎',
    description: 'Opulent finishes and grand presence',
    colorHint: 'bg-yellow-50',
    prompt: 'luxury exterior design, grand villa, natural stone cladding, ornate iron gates, manicured hedgerows, fountain in driveway, infinity pool, high-end outdoor furniture, dramatic uplighting, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-mediterranean',
    name: 'Mediterranean',
    emoji: '🏛️',
    description: 'Sun-soaked terracotta and arches',
    colorHint: 'bg-orange-50',
    prompt: 'Mediterranean exterior design, terracotta roof tiles, stucco walls in warm white and ochre, arched doorways and windows, bougainvillea climbing the walls, terracotta pots, olive trees, blue shutters, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-midcentury',
    name: 'Midcentury',
    emoji: '🕰️',
    description: 'Atomic age style meets nature',
    colorHint: 'bg-teal-50',
    prompt: 'mid-century modern exterior, low-pitched gable roof, large panoramic windows, horizontal lines, wood and brick combination, carport, atomic age landscaping with ornamental grasses, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-zen',
    name: 'Zen',
    emoji: '🪨',
    description: 'Tranquil, balanced and meditative',
    colorHint: 'bg-stone-50',
    prompt: 'zen exterior design, Japanese-inspired garden, raked gravel and mossy stones, bamboo fence, minimalist facade in natural grey and beige, koi pond, stone lanterns, cherry blossom tree, photorealistic, 8k',
    previewImgUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'outdoor-no-style',
    name: 'No Style',
    emoji: '✨',
    description: 'Let AI decide the best look',
    colorHint: 'bg-gray-50',
    prompt: 'beautifully designed exterior, photorealistic, 8k',
    previewImgUrl: ''
  },
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
