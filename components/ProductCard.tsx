'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
  index?: number;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  slug,
  stock,
  index = 0,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id,
      name,
      price,
      image,
      slug,
      quantity: 1,
    });
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
      },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="h-full"
    >
      <Link href={`/products/${slug}`}>
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
          {/* Image Container */}
          <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
            <motion.img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            {stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{name}</h3>
            <p className="text-sm text-gray-600 mb-4 flex-grow">
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">
                ₦{price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="px-4 pb-4" onClick={handleAddToCart}>
            <Button
              disabled={stock === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
