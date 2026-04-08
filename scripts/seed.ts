import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding products...')

  await prisma.product.deleteMany()

  await prisma.product.createMany({
    data: [
      // Chicken Products
      {
        name: 'Full Chicken',
        slug: 'full-chicken',
        price: 8500,
        image: '/products/full-chicken.jpg',
        stock: 50,
        category: 'chicken',
        weight: '1.8kg - 2kg',
        description:
          'Premium frozen whole chicken, properly cleaned and packaged for home cooking, family meals and restaurants.',
        nutrients: 'Protein, Iron, Vitamin B12',
        storage: 'Keep frozen at -18°C. Do not refreeze after thawing.',
      },
      {
        name: 'Chicken Laps',
        slug: 'chicken-laps',
        price: 7500,
        image: '/products/chicken-laps1.jpg',
        stock: 40,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Fresh frozen chicken laps ideal for grilling, frying and everyday meals.',
        nutrients: 'Protein, Iron, Vitamin B6',
        storage: 'Store frozen below -18°C.',
      },
      {
        name: 'Chicken Breast',
        slug: 'chicken-breast',
        price: 6000,
        image: '/products/chicken-breast.jpg',
        stock: 35,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Clean frozen chicken breast perfect for healthy meals, grilling and stir-fry dishes.',
        nutrients: 'Protein, Iron, Zinc',
      },
      {
        name: 'Chicken Drumsticks',
        slug: 'chicken-drumsticks',
        price: 9500,
        image: '/products/chicken-drumsticks.jpg',
        stock: 30,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Frozen chicken drumsticks rich in flavour and perfect for grilling, frying and stews.',
        nutrients: 'Protein, Iron, Vitamin B12',
      },
      {
        name: 'Chicken Fillet',
        slug: 'chicken-fillet',
        price: 7000,
        image: '/products/chicken-fillet.jpg',
        stock: 45,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Boneless chicken fillet perfect for quick meals, frying, grilling and sandwiches.',
        nutrients: 'Protein, Iron, Vitamin B6',
      },
      {
        name: 'Chicken Gizzards',
        slug: 'chicken-gizzards',
        price: 5000,
        image: '/products/chicken-gizzard.jpg',
        stock: 60,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Fresh frozen chicken gizzards ideal for pepper soup, stir-fry and local dishes.',
        nutrients: 'Protein, Iron, Zinc',
      },
      {
        name: 'Chicken Wings',
        slug: 'chicken-wings',
        price: 5000,
        image: '/products/chicken-wings.jpg',
        stock: 60,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Frozen chicken wings great for grills, parties, sauces and everyday family meals.',
        nutrients: 'Protein, Iron, Vitamin B12',
      },
      {
        name: 'Chicken Neck',
        slug: 'chicken-neck',
        price: 5000,
        image: '/products/chicken-neck.jpg',
        stock: 60,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Frozen chicken neck suitable for soups, stock preparation and traditional meals.',
        nutrients: 'Protein, Iron',
      },
      {
        name: 'Chicken Feet',
        slug: 'chicken-feet',
        price: 5000,
        image: '/products/chickenfeet.jpg',
        stock: 60,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Frozen chicken feet ideal for soups, stock and specialty cooking.',
        nutrients: 'Protein, Collagen, Iron',
      },
      {
        name: 'Chicken Head',
        slug: 'chicken-head',
        price: 5000,
        image: '/products/chicken-head.jpg',
        stock: 60,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Frozen chicken head suitable for local soups, stock and traditional dishes.',
        nutrients: 'Protein, Iron',
      },
      {
        name: 'Chicken Heart',
        slug: 'chicken-heart',
        price: 5000,
        image: '/products/chickenheart.jpg',
        stock: 60,
        category: 'chicken',
        weight: '1kg pack',
        description:
          'Frozen chicken heart suitable for grills, pepper soup and traditional recipes.',
        nutrients: 'Protein, Iron, Vitamin B12',
      },

      // Turkey Products
      {
        name: 'Turkey Full Wings',
        slug: 'turkey-fullwings',
        price: 5000,
        image: '/products/turkey-fullwings.jpg',
        stock: 60,
        category: 'turkey',
        weight: '1kg pack',
        description:
          'Fresh frozen turkey full wings suitable for soups, grilling and hearty meals.',
        nutrients: 'Protein, Iron, Vitamin B12',
      },
      {
        name: 'Turkey Mid Wings',
        slug: 'turkey-midwing',
        price: 5000,
        image: '/products/turkey-midwing2.jpg',
        stock: 60,
        category: 'turkey',
        weight: '1kg pack',
        description:
          'Frozen turkey mid wings perfect for roasting, soups and home cooking.',
        nutrients: 'Protein, Iron, Vitamin B12',
      },
      {
        name: 'Turkey Shoulder',
        slug: 'turkey-shoulder',
        price: 5000,
        image: '/products/turkey-shoulder.jpg',
        stock: 60,
        category: 'turkey',
        weight: '1kg pack',
        description:
          'Fresh frozen turkey shoulder ideal for stews, soups and traditional dishes.',
        nutrients: 'Protein, Iron, Zinc',
      },
      {
        name: 'Turkey Laps',
        slug: 'turkey-laps',
        price: 5000,
        image: '/products/turkey-laps.jpg',
        stock: 60,
        category: 'turkey',
        weight: '1kg pack',
        description:
          'Frozen turkey laps with rich flavour, suitable for grills and family meals.',
        nutrients: 'Protein, Iron, Vitamin B12',
      },
      {
        name: 'Turkey Finger',
        slug: 'turkey-finger',
        price: 5000,
        image: '/products/turkey-finger.jpg',
        stock: 60,
        category: 'turkey',
        weight: '1kg pack',
        description:
          'Fresh frozen turkey finger cuts suitable for soups, pepper soup and local dishes.',
        nutrients: 'Protein, Iron',
      },
      {
        name: 'Turkey Gizzards',
        slug: 'turkey-gizzards',
        price: 5000,
        image: '/products/turkey-gizzard2.jpg',
        stock: 60,
        category: 'turkey',
        weight: '1kg pack',
        description:
          'Frozen turkey gizzards ideal for stir-fry, grills and traditional meals.',
        nutrients: 'Protein, Iron, Zinc',
      },

      // Fish Products
      {
        name: 'Ice Fish',
        slug: 'ice-fish',
        price: 5000,
        image: '/products/ice-fish.jpg',
        stock: 60,
        category: 'fish',
        weight: '1kg pack',
        description:
          'Fresh frozen ice fish suitable for soups, stews and everyday cooking.',
        nutrients: 'Protein, Omega-3, Vitamin D',
      },
      {
        name: 'Croaker Fish',
        slug: 'croaker-fish',
        price: 6500,
        image: '/products/croaker-fish.jpg',
        stock: 40,
        category: 'fish',
        weight: '1kg pack',
        description:
          'Frozen croaker fish perfect for grilling, frying and pepper soup dishes.',
        nutrients: 'Protein, Omega-3, Vitamin D',
      },
      {
        name: 'Titus Fish',
        slug: 'titus-fish',
        price: 6000,
        image: '/products/titus-fish.jpg',
        stock: 45,
        category: 'fish',
        weight: '1kg pack',
        description:
          'Fresh frozen titus fish ideal for stews, frying and traditional Nigerian meals.',
        nutrients: 'Protein, Omega-3, Vitamin D',
      },
    ],
  })

  console.log('✅ Products seeded successfully')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
