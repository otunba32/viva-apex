'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  slug: string;
  stock: number;
  category: {
    name: string;
    slug: string;
  };
}

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('An error occurred while fetching the product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        quantity,
      });
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
        </div>
      </PageTransition>
    );
  }

  if (error || !product) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
          <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50  pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex items-center space-x-2 text-sm text-gray-600"
          >
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900">
              Products
            </Link>
            <span>/</span>
            <span>{product.name}</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <p className="text-blue-600 text-sm font-semibold mb-2">
                  {product.category.name}
                </p>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg mb-6">{product.description}</p>
              </div>

              {/* Price and Stock */}
              <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-2">Price</p>
                  <p className="text-4xl font-bold text-blue-600">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Availability</p>
                  <p
                    className={`text-lg font-semibold ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="mb-6">
                    <label className="text-gray-600 text-sm mb-2 block">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        −
                      </Button>
                      <span className="text-2xl font-semibold w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </motion.div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    Fast and reliable delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    Premium quality frozen products
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    Secure and easy payment
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">✓</span>
                    24/7 customer support
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
