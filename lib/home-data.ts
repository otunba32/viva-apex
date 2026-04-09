import { ShieldCheck, ShoppingBasket, Snowflake, Truck } from 'lucide-react'

export const brand = {
  red: '#D62828',
  deepRed: '#A61E1E',
  orange: '#F77F00',
  cream: '#FFF7ED',
}

export const categories = [
  {
    title: 'Chicken',
    subtitle: 'Fresh frozen chicken cuts',
    href: '/products?category=chicken',
    image: '/products/chicken-laps1.jpg',
  },
  {
    title: 'Turkey',
    subtitle: 'Turkey wings and premium portions',
    href: '/products?category=turkey',
    image: '/products/turkey-fullwings.jpg',
  },
  {
    title: 'Fish',
    subtitle: 'Clean, affordable frozen fish',
    href: '/products?category=fish',
    image: '/products/kote-fish(horse mackerel).jpg',
  },
]

export const featuredProducts = [
  { name: 'Full Chicken', slug: 'full-chicken', price: '₦8,500', category: 'Chicken', image: '/products/full-chicken.jpg' },
  { name: 'Turkey Wings', slug: 'turkey-wings', price: '₦9,500', category: 'Turkey', image: '/products/turkey-wings.jpg' },
  { name: 'Ice Fish', slug: 'ice-fish', price: '₦5,000', category: 'Fish', image: '/products/titus-fish(mackerel).jpg' },
]

export const benefits = [
  {
    icon: Snowflake,
    title: 'Properly Frozen',
    text: 'Products handled with freshness in mind from storage to delivery.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    text: 'Quick dispatch for Bodija, Ibadan and nearby areas.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Quality',
    text: 'Clean packaging, reliable sourcing and consistent quality.',
  },
  {
    icon: ShoppingBasket,
    title: 'Retail & Bulk',
    text: 'Buy in units or place bulk orders for home or business.',
  },
]

export const stats = [
  { value: '3+', label: 'Core Categories' },
  { value: '6', label: 'Featured Products' },
  { value: 'Fast', label: 'Delivery Promise' },
  { value: 'Secure', label: 'Checkout Flow' },
]

export const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55 },
  },
}