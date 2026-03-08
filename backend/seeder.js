const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();

        // ─── Demo Accounts ───────────────────────────────────────────────────────
        const seller = await User.create({
            name: 'ShopEZ Demo Seller',
            email: 'seller@demo.com',
            password: 'demo123',
            role: 'seller',
        });

        await User.create({
            name: 'Demo Customer',
            email: 'customer@demo.com',
            password: 'demo123',
            role: 'customer',
        });

        await User.create({
            name: 'Admin User',
            email: 'admin@shopez.com',
            password: 'admin123',
            role: 'admin',
        });

        // ─── Product Catalog ─────────────────────────────────────────────────────
        const products = [

            // ════════════════════════════════════════════
            //  ELECTRONICS  (8 products)
            // ════════════════════════════════════════════
            {
                name: 'Apple iPhone 15 Pro',
                description:
                    'Titanium design with the A17 Pro chip, a 48 MP Main camera system with 5× Optical Zoom, USB-C connectivity and Dynamic Island. Available in Natural Titanium.',
                price: 134900,
                discountPrice: 119900,
                category: 'Electronics',
                stock: 50,
                brand: 'Apple',
                isFeatured: true,
                images: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
                ],
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description:
                    'Galaxy AI on board. 200 MP camera, built-in S Pen for precise writing and drawing, titanium frame, and 100× Space Zoom. Powered by Snapdragon 8 Gen 3.',
                price: 129999,
                discountPrice: 114999,
                category: 'Electronics',
                stock: 35,
                brand: 'Samsung',
                isFeatured: true,
                images: [
                    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
                ],
            },
            {
                name: 'Apple MacBook Air M2',
                description:
                    '13.6" Liquid Retina display, blazing-fast M2 chip, 8 GB RAM, 256 GB SSD, up to 18-hour battery life. Fanless design — completely silent.',
                price: 119990,
                discountPrice: 109990,
                category: 'Electronics',
                stock: 15,
                brand: 'Apple',
                isFeatured: true,
                images: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
                ],
            },
            {
                name: 'Sony WH-1000XM5 Headphones',
                description:
                    'Industry-leading noise cancellation with eight microphones and two processors. Crystal-clear hands-free calling, up to 30-hour battery life, and a lightweight folding design.',
                price: 29990,
                discountPrice: 24990,
                category: 'Electronics',
                stock: 20,
                brand: 'Sony',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
                ],
            },
            {
                name: 'iPad Pro 12.9" (M2)',
                description:
                    'Apple M2 chip, stunning 12.9" Liquid Retina XDR display with ProMotion, Wi-Fi 6E, 5G support, Thunderbolt / USB 4 port, and Apple Pencil hover.',
                price: 112900,
                discountPrice: 99900,
                category: 'Electronics',
                stock: 20,
                brand: 'Apple',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
                ],
            },
            {
                name: 'Samsung 55" QLED 4K Smart TV',
                description:
                    'Quantum Dot technology delivers 100% colour volume, HDR 2000, 120 Hz refresh rate, Tizen OS with built-in Alexa and Google Assistant. Perfect wall-mount design.',
                price: 79990,
                discountPrice: 64990,
                category: 'Electronics',
                stock: 12,
                brand: 'Samsung',
                isFeatured: true,
                images: [
                    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80',
                ],
            },
            {
                name: 'JBL Flip 6 Bluetooth Speaker',
                description:
                    'Powerful JBL Pro Sound with bold bass output, IP67 waterproof and dustproof, PartyBoost to link multiple JBL speakers, 12-hour playtime, USB-C charging.',
                price: 11999,
                discountPrice: 8999,
                category: 'Electronics',
                stock: 60,
                brand: 'JBL',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
                ],
            },
            {
                name: 'Dell XPS 15 Laptop',
                description:
                    '15.6" OLED InfinityEdge display, 13th-Gen Intel Core i7, 16 GB DDR5 RAM, 512 GB NVMe SSD, NVIDIA GeForce RTX 4060. Premium aluminium chassis.',
                price: 189990,
                discountPrice: 169990,
                category: 'Electronics',
                stock: 10,
                brand: 'Dell',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
                ],
            },

            // ════════════════════════════════════════════
            //  FASHION  (7 products)
            // ════════════════════════════════════════════
            {
                name: "Men's Premium Cotton T-Shirt",
                description:
                    'Ultra-soft 100 % combed cotton, pre-shrunk, reinforced stitching at stress points. Available in 10 colours, sizes S–XXL. Ideal for everyday casual wear.',
                price: 999,
                discountPrice: 699,
                category: 'Fashion',
                stock: 200,
                brand: 'ShopEZ Basics',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
                ],
            },
            {
                name: "Women's Floral Wrap Midi Dress",
                description:
                    'Flowy chiffon fabric, V-neck wrap style, adjustable self-tie belt, A-line silhouette. Lightweight and breathable — perfect for brunch, parties or casual outings.',
                price: 2499,
                discountPrice: 1799,
                category: 'Fashion',
                stock: 60,
                brand: 'Zara Style',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
                ],
            },
            {
                name: 'Nike Air Max 270',
                description:
                    "Nike's tallest Air unit in the heel absorbs impact for all-day comfort. Engineered mesh upper for breathability with a bold, modern silhouette.",
                price: 11995,
                discountPrice: 8995,
                category: 'Fashion',
                stock: 45,
                brand: 'Nike',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
                ],
            },
            {
                name: "Levi's 511 Slim-Fit Jeans",
                description:
                    'Classic slim-fit sits just below the waist, tapered from knee to ankle. Stretch denim fabric for all-day flexibility. Available in dark indigo and grey washes.',
                price: 3299,
                discountPrice: 2499,
                category: 'Fashion',
                stock: 80,
                brand: "Levi's",
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
                ],
            },
            {
                name: "Men's Slim-Fit Formal Blazer",
                description:
                    'Single-breasted two-button blazer with notch lapels and a centre back vent. Premium polyester-viscose blend, fully lined. Ideal for office, events and formal occasions.',
                price: 3999,
                discountPrice: 2999,
                category: 'Fashion',
                stock: 40,
                brand: 'Raymond',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
                ],
            },
            {
                name: 'Adidas Ultraboost 22 Running Shoes',
                description:
                    'Boost midsole returns energy with every stride, Primeknit+ upper wraps the foot like a hug, and Continental rubber outsole delivers dependable traction on any surface.',
                price: 16999,
                discountPrice: 12999,
                category: 'Fashion',
                stock: 30,
                brand: 'Adidas',
                isFeatured: true,
                images: [
                    'https://images.unsplash.com/photo-1556906781-9a412961a28a?w=600&q=80',
                ],
            },
            {
                name: 'Leather Crossbody Handbag',
                description:
                    'Premium full-grain leather, top-zip closure, gold-tone hardware, detachable adjustable strap, and multiple interior pockets. Versatile for day and evening use.',
                price: 5999,
                discountPrice: 3999,
                category: 'Fashion',
                stock: 35,
                brand: 'Hidesign',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
                ],
            },

            // ════════════════════════════════════════════
            //  HOME & KITCHEN  (6 products)
            // ════════════════════════════════════════════
            {
                name: 'Instant Pot Duo 7-in-1 (6 Qt)',
                description:
                    'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer. 6-quart capacity, 14 built-in smart programs.',
                price: 12999,
                discountPrice: 9999,
                category: 'Home & Kitchen',
                stock: 30,
                brand: 'Instant Pot',
                isFeatured: true,
                images: [
                    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
                ],
            },
            {
                name: 'Philips Air Fryer XXL (7.3 L)',
                description:
                    'Rapid Air technology circulates hot air for crispy results with up to 90 % less fat. 7.3 L family-size basket, digital touch display, 1725 W, dishwasher-safe parts.',
                price: 14999,
                discountPrice: 11499,
                category: 'Home & Kitchen',
                stock: 25,
                brand: 'Philips',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1600565193348-f74bd3960d5b?w=600&q=80',
                ],
            },
            {
                name: 'Dyson V12 Detect Slim Cordless Vacuum',
                description:
                    'Laser technology detects hidden dust on floors. HEPA filtration captures 99.99 % of particles. Up to 60-minute runtime, auto-adjusting suction, 20 % lighter than V11.',
                price: 59900,
                discountPrice: 49900,
                category: 'Home & Kitchen',
                stock: 12,
                brand: 'Dyson',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
                ],
            },
            {
                name: 'Milton Thermosteel Flask 1 L',
                description:
                    'Double-wall stainless steel insulation keeps beverages hot for 24 hours and cold for 48 hours. BPA-free, leak-proof flip lid, wide mouth for easy cleaning.',
                price: 1299,
                discountPrice: 899,
                category: 'Home & Kitchen',
                stock: 150,
                brand: 'Milton',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
                ],
            },
            {
                name: 'Prestige Svachh Pressure Cooker 5 L',
                description:
                    'Deep lid collects excess starch, triple safety valves for worry-free cooking, inner aluminium lid, induction compatible. Ideal for everyday Indian cooking.',
                price: 2299,
                discountPrice: 1799,
                category: 'Home & Kitchen',
                stock: 80,
                brand: 'Prestige',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
                ],
            },
            {
                name: 'Wakefit Orthopedic Memory Foam Pillow',
                description:
                    'Contour cervical design aligns spine and neck for deep, pain-free sleep. High-density memory foam, anti-microbial bamboo cover, machine-washable. Pack of 2.',
                price: 3999,
                discountPrice: 2799,
                category: 'Home & Kitchen',
                stock: 45,
                brand: 'Wakefit',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
                ],
            },

            // ════════════════════════════════════════════
            //  BEAUTY  (4 products)
            // ════════════════════════════════════════════
            {
                name: "Dyson Airwrap Multi-Styler",
                description:
                    'Curl, wave, volumize and dry hair simultaneously without extreme heat. Coanda airflow wraps hair around the barrel. Includes multiple attachments for all hair types.',
                price: 44900,
                discountPrice: 39900,
                category: 'Beauty',
                stock: 10,
                brand: 'Dyson',
                isFeatured: true,
                images: [
                    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80',
                ],
            },
            {
                name: "L'Oreal Paris Hyaluronic Acid Serum",
                description:
                    '1.5 % pure hyaluronic acid intensely hydrates, plumps skin and reduces the appearance of dry lines in just 1 week. Lightweight, non-greasy formula, 30 ml dropper.',
                price: 999,
                discountPrice: 749,
                category: 'Beauty',
                stock: 100,
                brand: "L'Oreal Paris",
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
                ],
            },
            {
                name: 'Mamaearth Onion Face Wash 200 ml',
                description:
                    'Enriched with onion extract and plant keratin, this sulphate-free and paraben-free face wash gently cleanses while helping to control hair fall. Dermatologically tested.',
                price: 349,
                discountPrice: 279,
                category: 'Beauty',
                stock: 200,
                brand: 'Mamaearth',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
                ],
            },
            {
                name: 'The Ordinary Niacinamide 10% + Zinc 1%',
                description:
                    'High-strength vitamin and mineral blemish formula. Reduces appearance of skin blemishes and congestion. Vegan, cruelty-free, 30 ml dropper bottle.',
                price: 999,
                discountPrice: 799,
                category: 'Beauty',
                stock: 90,
                brand: 'The Ordinary',
                isFeatured: false,
                images: [
                    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
                ],
            },
        ];

        for (const p of products) {
            await Product.create({ ...p, seller: seller._id });
        }

        // ─── Summary ─────────────────────────────────────────────────────────────
        console.log(`\n✅  Seeded ${products.length} products successfully!\n`);
        console.log('Categories:');
        const categories = [...new Set(products.map((p) => p.category))];
        for (const cat of categories) {
            const count = products.filter((p) => p.category === cat).length;
            console.log(`  ${cat.padEnd(20)} ${count} products`);
        }
        console.log('\nDemo Accounts:');
        console.log('  Customer : customer@demo.com  /  demo123');
        console.log('  Seller   : seller@demo.com    /  demo123');
        console.log('  Admin    : admin@shopez.com   /  admin123\n');

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

seedData();
