const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // Clear existing
        await User.deleteMany();
        await Product.deleteMany();

        // Create seller
        const seller = await User.create({
            name: 'ShopEZ Demo Seller',
            email: 'seller@demo.com',
            password: 'demo123',
            role: 'seller',
        });

        // Create customer
        await User.create({
            name: 'Demo Customer',
            email: 'customer@demo.com',
            password: 'demo123',
            role: 'customer',
        });

        // Create admin
        await User.create({
            name: 'Admin User',
            email: 'admin@shopez.com',
            password: 'admin123',
            role: 'admin',
        });

        const products = [
            // ─────────────────────────────────────────────────
            // ELECTRONICS (10 items)
            // ─────────────────────────────────────────────────
            {
                name: 'Apple iPhone 15 Pro',
                description: 'Titanium design with A17 Pro chip, 48MP Main camera with 5x Optical Zoom, USB-C and Dynamic Island.',
                price: 134900, discountPrice: 119900, category: 'Electronics', stock: 50, brand: 'Apple', isFeatured: true,
                images: ['https://picsum.photos/seed/iphone15/400/400'],
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'Galaxy AI on board. 200MP camera, built-in S Pen, titanium frame, and 100x Space Zoom.',
                price: 129999, discountPrice: 114999, category: 'Electronics', stock: 35, brand: 'Samsung', isFeatured: true,
                images: ['https://picsum.photos/seed/s24ultra/400/400'],
            },
            {
                name: 'Apple MacBook Air M2',
                description: '13.6" Liquid Retina display, M2 chip, 8GB RAM, 256GB SSD, 18-hour battery life.',
                price: 119990, discountPrice: 109990, category: 'Electronics', stock: 15, brand: 'Apple', isFeatured: true,
                images: ['https://picsum.photos/seed/macbookm2/400/400'],
            },
            {
                name: 'Sony WH-1000XM5 Headphones',
                description: 'Industry-leading noise cancellation with crystal clear hands-free calling and up to 30-hr battery.',
                price: 29990, discountPrice: 24990, category: 'Electronics', stock: 20, brand: 'Sony', isFeatured: false,
                images: ['https://picsum.photos/seed/sonywh5/400/400'],
            },
            {
                name: 'OnePlus 12 5G',
                description: 'Snapdragon 8 Gen 3, 50MP Hasselblad triple camera, 100W SuperVOOC charging, 5400mAh battery.',
                price: 64999, discountPrice: 59999, category: 'Electronics', stock: 40, brand: 'OnePlus', isFeatured: false,
                images: ['https://picsum.photos/seed/oneplus12/400/400'],
            },
            {
                name: 'Dell XPS 15 Laptop',
                description: '15.6" OLED display, 13th Gen Intel Core i7, 16GB RAM, 512GB SSD, NVIDIA RTX 4060.',
                price: 189990, discountPrice: 169990, category: 'Electronics', stock: 10, brand: 'Dell', isFeatured: false,
                images: ['https://picsum.photos/seed/dellxps15/400/400'],
            },
            {
                name: 'iPad Pro 12.9" M2',
                description: 'Apple M2 chip, 12.9" Liquid Retina XDR display, 5G, Wi-Fi 6E, ProMotion technology.',
                price: 112900, discountPrice: 99900, category: 'Electronics', stock: 20, brand: 'Apple', isFeatured: false,
                images: ['https://picsum.photos/seed/ipadpro/400/400'],
            },
            {
                name: 'Samsung 55" QLED 4K TV',
                description: 'Quantum Dot technology, HDR 2000, 120Hz refresh rate, Tizen OS and built-in Alexa.',
                price: 79990, discountPrice: 64990, category: 'Electronics', stock: 12, brand: 'Samsung', isFeatured: true,
                images: ['https://picsum.photos/seed/samsungtv/400/400'],
            },
            {
                name: 'GoPro HERO 12 Black',
                description: '5.3K60 video, HyperSmooth 6.0 stabilization, waterproof to 10m, HDR video.',
                price: 42990, discountPrice: 37990, category: 'Electronics', stock: 25, brand: 'GoPro', isFeatured: false,
                images: ['https://picsum.photos/seed/gopro12/400/400'],
            },
            {
                name: 'JBL Flip 6 Bluetooth Speaker',
                description: 'Powerful sound with bold bass, IP67 waterproof, 12-hour playtime, USB-C charging.',
                price: 11999, discountPrice: 8999, category: 'Electronics', stock: 60, brand: 'JBL', isFeatured: false,
                images: ['https://picsum.photos/seed/jblflip6/400/400'],
            },

            // ─────────────────────────────────────────────────
            // FASHION (10 items)
            // ─────────────────────────────────────────────────
            {
                name: "Men's Premium Cotton T-Shirt",
                description: 'Ultra-soft 100% combed cotton, pre-shrunk, available in S/M/L/XL/XXL. Perfect for daily wear.',
                price: 999, discountPrice: 699, category: 'Fashion', stock: 200, brand: 'ShopEZ Basics', isFeatured: false,
                images: ['https://picsum.photos/seed/mensshirt/400/400'],
            },
            {
                name: "Women's Floral Anarkali Kurti",
                description: 'Elegant jaipuri block print, rayon fabric, full-sleeve kurti. Perfect for festivals and parties.',
                price: 1499, discountPrice: 999, category: 'Fashion', stock: 150, brand: 'Ethnic Vibes', isFeatured: true,
                images: ['https://picsum.photos/seed/wkurti/400/400'],
            },
            {
                name: 'Nike Air Max 270',
                description: 'The biggest Air unit in heel history returns in a lifestyle shoe with a fresh look and feel.',
                price: 11995, discountPrice: 8995, category: 'Fashion', stock: 45, brand: 'Nike', isFeatured: false,
                images: ['https://picsum.photos/seed/nikeair/400/400'],
            },
            {
                name: "Levi's 511 Slim Fit Jeans",
                description: 'Classic slim fit jeans, sits below waist, tapered from knee to ankle. Stretch denim fabric.',
                price: 3299, discountPrice: 2499, category: 'Fashion', stock: 80, brand: "Levi's", isFeatured: false,
                images: ['https://picsum.photos/seed/levisjeans/400/400'],
            },
            {
                name: 'Adidas Ultraboost 22 Running Shoes',
                description: 'Boost midsole for energy return, Primeknit+ upper, Continental rubber outsole for traction.',
                price: 16999, discountPrice: 12999, category: 'Fashion', stock: 30, brand: 'Adidas', isFeatured: true,
                images: ['https://picsum.photos/seed/adidasultra/400/400'],
            },
            {
                name: "Women's Satin Wrap Dress",
                description: 'Flowy satin midi dress, V-neck, wrap style, adjustable tie belt. Perfect for evening outings.',
                price: 2499, discountPrice: 1799, category: 'Fashion', stock: 60, brand: 'Zara Style', isFeatured: false,
                images: ['https://picsum.photos/seed/satindress/400/400'],
            },
            {
                name: 'Men\'s Formal Blazer',
                description: 'Slim-fit single-breasted blazer, center vent, two-button closure. Perfect for office and events.',
                price: 3999, discountPrice: 2999, category: 'Fashion', stock: 40, brand: 'Raymond', isFeatured: false,
                images: ['https://picsum.photos/seed/mensblazer/400/400'],
            },
            {
                name: 'Fossil Gen 6 Smartwatch',
                description: 'Wear OS by Google, 44mm stainless steel case, heart rate, SpO2, GPS, swim-proof design.',
                price: 24995, discountPrice: 19995, category: 'Fashion', stock: 20, brand: 'Fossil', isFeatured: false,
                images: ['https://picsum.photos/seed/fossilwatch/400/400'],
            },
            {
                name: 'Leather Crossbody Handbag',
                description: 'Genuine leather, zip closure, detachable strap, inner pockets. Elegant for all occasions.',
                price: 5999, discountPrice: 3999, category: 'Fashion', stock: 35, brand: 'Hidesign', isFeatured: false,
                images: ['https://picsum.photos/seed/handbag1/400/400'],
            },
            {
                name: 'Woodland Men\'s Trekking Boots',
                description: 'Waterproof full-grain leather, anti-skid rubber sole, ankle support. Ideal for treks and camping.',
                price: 4995, discountPrice: 3795, category: 'Fashion', stock: 50, brand: 'Woodland', isFeatured: false,
                images: ['https://picsum.photos/seed/woodlandboots/400/400'],
            },

            // ─────────────────────────────────────────────────
            // HOME & KITCHEN (8 items)
            // ─────────────────────────────────────────────────
            {
                name: 'Instant Pot Duo 7-in-1',
                description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer. 6-quart.',
                price: 12999, discountPrice: 9999, category: 'Home & Kitchen', stock: 30, brand: 'Instant Pot', isFeatured: true,
                images: ['https://picsum.photos/seed/instantpot1/400/400'],
            },
            {
                name: 'Philips Air Fryer XXL',
                description: '7.3L capacity, Rapid Air technology, 1725W, digital display, fat removal technology.',
                price: 14999, discountPrice: 11499, category: 'Home & Kitchen', stock: 25, brand: 'Philips', isFeatured: false,
                images: ['https://picsum.photos/seed/philipsaf/400/400'],
            },
            {
                name: 'Dyson V12 Detect Slim Vacuum',
                description: 'Laser dust detection, HEPA filtration, 60-min runtime, 20% lighter than V11. Auto mode.',
                price: 59900, discountPrice: 49900, category: 'Home & Kitchen', stock: 12, brand: 'Dyson', isFeatured: false,
                images: ['https://picsum.photos/seed/dysonv12/400/400'],
            },
            {
                name: 'Wonderchef Nutri-Blend Pro',
                description: '1200W motor, 4 jars, stainless steel blades, cold-press juicing, 5-year motor warranty.',
                price: 7999, discountPrice: 5499, category: 'Home & Kitchen', stock: 60, brand: 'Wonderchef', isFeatured: false,
                images: ['https://picsum.photos/seed/nutribld/400/400'],
            },
            {
                name: 'Milton Thermosteel Bottle 1L',
                description: 'Double-wall insulation keeps beverages hot 24 hrs / cold 48 hrs. BPA-free, leak-proof lid.',
                price: 1299, discountPrice: 899, category: 'Home & Kitchen', stock: 150, brand: 'Milton', isFeatured: false,
                images: ['https://picsum.photos/seed/miltonbottle/400/400'],
            },
            {
                name: 'IKEA LACK Coffee Table',
                description: 'Minimalist design, white finish, lower shelf adds extra storage space. 90x55 cm.',
                price: 4999, discountPrice: 3499, category: 'Home & Kitchen', stock: 20, brand: 'IKEA', isFeatured: false,
                images: ['https://picsum.photos/seed/ikeatable/400/400'],
            },
            {
                name: 'Prestige Svachh Pressure Cooker 5L',
                description: 'Deep lid with food-grade polypropylene lid, triple safety valves, inner aluminium lid.',
                price: 2299, discountPrice: 1799, category: 'Home & Kitchen', stock: 80, brand: 'Prestige', isFeatured: false,
                images: ['https://picsum.photos/seed/prestige5l/400/400'],
            },
            {
                name: 'Wakefit Orthopedic Memory Foam Pillow',
                description: 'Contour cervical design, high-density foam, anti-microbial cover, washable. Set of 2.',
                price: 3999, discountPrice: 2799, category: 'Home & Kitchen', stock: 45, brand: 'Wakefit', isFeatured: false,
                images: ['https://picsum.photos/seed/wakefitpillow/400/400'],
            },

            // ─────────────────────────────────────────────────
            // SPORTS (8 items)
            // ─────────────────────────────────────────────────
            {
                name: 'Cosco Premier Badminton Racquet',
                description: 'High-tension aluminum frame, full-length cover included, ideal for intermediate players.',
                price: 1499, discountPrice: 999, category: 'Sports', stock: 70, brand: 'Cosco', isFeatured: false,
                images: ['https://picsum.photos/seed/coscoracket/400/400'],
            },
            {
                name: 'Boldfit Premium Yoga Mat',
                description: 'Non-slip, eco-friendly TPE material, 6mm thickness, alignment lines, carrying strap.',
                price: 1999, discountPrice: 1299, category: 'Sports', stock: 100, brand: 'Boldfit', isFeatured: false,
                images: ['https://picsum.photos/seed/yogamat1/400/400'],
            },
            {
                name: 'Nivia Force Football - Size 5',
                description: 'Machine stitched, PU material, nylon wound, latex bladder. Ideal for practice and matches.',
                price: 999, discountPrice: 699, category: 'Sports', stock: 120, brand: 'Nivia', isFeatured: false,
                images: ['https://picsum.photos/seed/niviafb/400/400'],
            },
            {
                name: 'Decathlon Essential Cycle Helmet',
                description: 'CE certified, adjustable dial system, 19 ventilation slots, lightweight 260g. Ages 15+.',
                price: 1999, discountPrice: 1499, category: 'Sports', stock: 50, brand: 'Btwin', isFeatured: false,
                images: ['https://picsum.photos/seed/cyclehelmet/400/400'],
            },
            {
                name: 'PowerBlock Elite Dumbbells 5-50 lb',
                description: 'Adjustable in 2.5 lb increments, replaces 28 sets, compact, selector pin mechanism.',
                price: 24999, discountPrice: 19999, category: 'Sports', stock: 15, brand: 'PowerBlock', isFeatured: true,
                images: ['https://picsum.photos/seed/dumbbell50/400/400'],
            },
            {
                name: 'Garmin Forerunner 255 GPS Watch',
                description: 'Advanced running dynamics, HRV status, race predictor, 14-day battery, multi-sport modes.',
                price: 32990, discountPrice: 27990, category: 'Sports', stock: 20, brand: 'Garmin', isFeatured: false,
                images: ['https://picsum.photos/seed/garminrun/400/400'],
            },
            {
                name: 'SG RSD Xtreme Cricket Bat',
                description: 'English willow Grade 2, full profile, curved blade, traditional toe, lightweight handle.',
                price: 5999, discountPrice: 4499, category: 'Sports', stock: 30, brand: 'SG', isFeatured: false,
                images: ['https://picsum.photos/seed/sgcricketbat/400/400'],
            },
            {
                name: 'Skipping Rope with Counter',
                description: 'Digital jump counter, adjustable cable, foam handles, suitable for all fitness levels.',
                price: 699, discountPrice: 449, category: 'Sports', stock: 200, brand: 'Strauss', isFeatured: false,
                images: ['https://picsum.photos/seed/skipingrope/400/400'],
            },

            // ─────────────────────────────────────────────────
            // BOOKS (8 items)
            // ─────────────────────────────────────────────────
            {
                name: 'Atomic Habits',
                description: 'An easy and proven way to build good habits and break bad ones by James Clear. Bestseller.',
                price: 799, discountPrice: 499, category: 'Books', stock: 100, brand: 'Penguin', isFeatured: false,
                images: ['https://picsum.photos/seed/atomichabits/400/400'],
            },
            {
                name: 'The Psychology of Money',
                description: 'Timeless lessons on wealth, greed and happiness by Morgan Housel. A modern finance classic.',
                price: 699, discountPrice: 449, category: 'Books', stock: 80, brand: 'Jaico Books', isFeatured: true,
                images: ['https://picsum.photos/seed/psymoney/400/400'],
            },
            {
                name: 'Rich Dad Poor Dad',
                description: 'Robert Kiyosaki\'s #1 personal finance book of all time. Teaches investing and financial literacy.',
                price: 495, discountPrice: 349, category: 'Books', stock: 150, brand: 'Plata Publishing', isFeatured: false,
                images: ['https://picsum.photos/seed/richdad/400/400'],
            },
            {
                name: 'Ikigai: The Japanese Secret to a Long Life',
                description: 'Discover your reason for being with Japan\'s ancient concept of ikigai from Héctor García.',
                price: 499, discountPrice: 349, category: 'Books', stock: 90, brand: 'Penguin Life', isFeatured: false,
                images: ['https://picsum.photos/seed/ikigaibook/400/400'],
            },
            {
                name: 'The Alchemist',
                description: 'Paulo Coelho\'s masterpiece — a magical story about following your dreams. Sold 65M copies.',
                price: 399, discountPrice: 249, category: 'Books', stock: 120, brand: 'HarperCollins', isFeatured: false,
                images: ['https://picsum.photos/seed/alchemist/400/400'],
            },
            {
                name: 'Deep Work by Cal Newport',
                description: 'Rules for focused success in a distracted world. Learn how to work deeply and produce elite results.',
                price: 699, discountPrice: 449, category: 'Books', stock: 70, brand: 'Piatkus', isFeatured: false,
                images: ['https://picsum.photos/seed/deepwork/400/400'],
            },
            {
                name: 'Think and Grow Rich',
                description: 'Napoleon Hill\'s timeless classic on the 13 principles of success and wealth creation.',
                price: 350, discountPrice: 229, category: 'Books', stock: 100, brand: 'Fingerprint', isFeatured: false,
                images: ['https://picsum.photos/seed/thinkgrow/400/400'],
            },
            {
                name: 'Let Us C by Yashavant Kanetkar',
                description: 'India\'s most popular C programming book. Used in colleges across the country. 17th Edition.',
                price: 450, discountPrice: 349, category: 'Books', stock: 200, brand: 'BPB Publications', isFeatured: false,
                images: ['https://picsum.photos/seed/letusc/400/400'],
            },

            // ─────────────────────────────────────────────────
            // BEAUTY (8 items)
            // ─────────────────────────────────────────────────
            {
                name: 'Mamaearth Onion Face Wash',
                description: 'Onion & plant keratin face wash for hair fall control. Sulphate-free, paraben-free, 200ml.',
                price: 349, discountPrice: 279, category: 'Beauty', stock: 200, brand: 'Mamaearth', isFeatured: false,
                images: ['https://picsum.photos/seed/mefacewash/400/400'],
            },
            {
                name: 'Lakme Primer + Matte Lipstick',
                description: '9 to 5 primer + matte lip color. Long-lasting, enriched with Vitamin E, intense color payoff.',
                price: 499, discountPrice: 349, category: 'Beauty', stock: 150, brand: 'Lakme', isFeatured: false,
                images: ['https://picsum.photos/seed/lakmelipstick/400/400'],
            },
            {
                name: "L'Oreal Paris Hyaluronic Acid Serum",
                description: '1.5% pure hyaluronic acid, deep hydration, plumps skin, reduces dry lines. 30ml.',
                price: 999, discountPrice: 749, category: 'Beauty', stock: 100, brand: "L'Oreal Paris", isFeatured: true,
                images: ['https://picsum.photos/seed/lorealserum/400/400'],
            },
            {
                name: "Dyson Airwrap Multi-Styler",
                description: 'Curl, wave, volumize and dry simultaneously. Frizz-free finish, multiple attachments included.',
                price: 44900, discountPrice: 39900, category: 'Beauty', stock: 10, brand: 'Dyson', isFeatured: true,
                images: ['https://picsum.photos/seed/dysonair/400/400'],
            },
            {
                name: 'Himalaya Herbals Neem Face Pack',
                description: 'Anti-bacterial neem with turmeric, removes excess oil, clears pores. 75g tube.',
                price: 175, discountPrice: 140, category: 'Beauty', stock: 300, brand: 'Himalaya', isFeatured: false,
                images: ['https://picsum.photos/seed/himalayafp/400/400'],
            },
            {
                name: 'Biotique Almond Oil Overnight Cream',
                description: 'Brightening, moisturizing, anti-ageing night cream with pure almond and saffron. 50g.',
                price: 399, discountPrice: 299, category: 'Beauty', stock: 120, brand: 'Biotique', isFeatured: false,
                images: ['https://picsum.photos/seed/biotiquenight/400/400'],
            },
            {
                name: 'Philips HP8321 Hair Dryer 1200W',
                description: '2 speed / 2 heat settings, concentrator nozzle, cool shot button, 1.8m cord.',
                price: 1099, discountPrice: 799, category: 'Beauty', stock: 80, brand: 'Philips', isFeatured: false,
                images: ['https://picsum.photos/seed/philipshd/400/400'],
            },
            {
                name: 'The Ordinary Niacinamide 10% + Zinc 1%',
                description: 'High-strength vitamin B3 serum, reduces blemishes and congestion. 30ml dropper.',
                price: 999, discountPrice: 799, category: 'Beauty', stock: 90, brand: 'The Ordinary', isFeatured: false,
                images: ['https://picsum.photos/seed/ordinarynia/400/400'],
            },

            // ─────────────────────────────────────────────────
            // TOYS (8 items)
            // ─────────────────────────────────────────────────
            {
                name: 'LEGO Classic Creative Bricks 10698',
                description: '484 pieces with 9 classic colors, includes wheels, windows. Endless building possibilities.',
                price: 2499, discountPrice: 1999, category: 'Toys', stock: 60, brand: 'LEGO', isFeatured: true,
                images: ['https://picsum.photos/seed/legoclassic/400/400'],
            },
            {
                name: 'Hot Wheels 20-Car Gift Pack',
                description: '1:64 scale die-cast vehicles, assorted colors & styles. Perfect for collectors ages 3+.',
                price: 1299, discountPrice: 999, category: 'Toys', stock: 80, brand: 'Hot Wheels', isFeatured: false,
                images: ['https://picsum.photos/seed/hotwheels20/400/400'],
            },
            {
                name: 'Funskool Monopoly Classic',
                description: 'Iconic property trading board game, 2-8 players, includes tokens, deeds, hotels. Ages 8+.',
                price: 1299, discountPrice: 899, category: 'Toys', stock: 50, brand: 'Funskool', isFeatured: false,
                images: ['https://picsum.photos/seed/monopoly/400/400'],
            },
            {
                name: 'Barbie Dreamhouse Playset',
                description: '3-story dollhouse with 8 rooms, elevator, pool, slide, and 70+ accessories. Ages 3+.',
                price: 12999, discountPrice: 9999, category: 'Toys', stock: 15, brand: 'Barbie', isFeatured: true,
                images: ['https://picsum.photos/seed/barbiedream/400/400'],
            },
            {
                name: 'Syma X8 Pro Drone with GPS',
                description: 'GPS auto-return, altitude hold, 2000m range, live FPV camera, 20-min flight time.',
                price: 8999, discountPrice: 6999, category: 'Toys', stock: 25, brand: 'Syma', isFeatured: false,
                images: ['https://picsum.photos/seed/symadrone/400/400'],
            },
            {
                name: 'Play-Doh Kitchen Creations Set',
                description: '22-piece set with oven, baking tools, and 10 cans of non-toxic Play-Doh. Ages 3+.',
                price: 1799, discountPrice: 1299, category: 'Toys', stock: 70, brand: 'Play-Doh', isFeatured: false,
                images: ['https://picsum.photos/seed/playdoh/400/400'],
            },
            {
                name: 'Nerf N-Strike Elite Disruptor',
                description: 'Fire 6 darts in a row, rotating drum, slam-fire action, 6 Elite darts included. Ages 8+.',
                price: 1499, discountPrice: 999, category: 'Toys', stock: 60, brand: 'Nerf', isFeatured: false,
                images: ['https://picsum.photos/seed/nerfdart/400/400'],
            },
            {
                name: 'Rubik\'s Cube 3x3 Original',
                description: 'The original world-famous puzzle. Smooth turning mechanism, vibrant stickers, ages 8+.',
                price: 499, discountPrice: 349, category: 'Toys', stock: 200, brand: 'Rubik\'s', isFeatured: false,
                images: ['https://picsum.photos/seed/rubikscube/400/400'],
            },
        ];

        for (const p of products) {
            await Product.create({ ...p, seller: seller._id });
        }

        console.log(`✅ Seeded ${products.length} products across all categories!`);
        console.log('');
        console.log('Categories:');
        const categories = [...new Set(products.map(p => p.category))];
        for (const cat of categories) {
            console.log(`  ${cat}: ${products.filter(p => p.category === cat).length} products`);
        }
        console.log('');
        console.log('Demo Accounts:');
        console.log('  Customer: customer@demo.com / demo123');
        console.log('  Seller:   seller@demo.com   / demo123');
        console.log('  Admin:    admin@shopez.com  / admin123');

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

seedData();
