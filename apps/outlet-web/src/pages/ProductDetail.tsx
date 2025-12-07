import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

// Mock product data - in a real app, this would come from an API
const mockProducts: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Earthen Bottle',
    price: 48,
    description:
      'Tall slender porcelain bottle with natural clay textured body and cork stopper. Perfect for storing your favorite beverages or as a decorative piece.',
    imageSrc:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt:
      'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
    images: [
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
    ],
    inStock: true,
    colors: [
      { name: 'Natural', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
      { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
      { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-400' },
    ],
    sizes: [
      { name: 'Small', inStock: true },
      { name: 'Medium', inStock: true },
      { name: 'Large', inStock: false },
    ],
  },
  '2': {
    id: 2,
    name: 'Nomad Tumbler',
    price: 35,
    description:
      'Olive drab green insulated bottle with flared screw lid and flat top. Keeps your drinks at the perfect temperature for hours.',
    imageSrc:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt:
      'Olive drab green insulated bottle with flared screw lid and flat top.',
    images: [
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
    ],
    inStock: true,
  },
  '3': {
    id: 3,
    name: 'Focus Paper Refill',
    price: 89,
    description:
      'Person using a pen to cross a task off a productivity paper card. Perfect for organizing your daily tasks and staying productive.',
    imageSrc:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt:
      'Person using a pen to cross a task off a productivity paper card.',
    images: [
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
    ],
    inStock: true,
  },
  '4': {
    id: 4,
    name: 'Machined Mechanical Pencil',
    price: 35,
    description:
      'Hand holding black machined steel mechanical pencil with brass tip and top. Precision engineering meets elegant design.',
    imageSrc:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt:
      'Hand holding black machined steel mechanical pencil with brass tip and top.',
    images: [
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg',
    ],
    inStock: true,
  },
  '5': {
    id: 5,
    name: 'Focus Card Tray',
    price: 64,
    description:
      'Paper card sitting upright in walnut card holder on desk. Beautifully crafted from premium walnut wood.',
    imageSrc:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-05.jpg',
    imageAlt: 'Paper card sitting upright in walnut card holder on desk.',
    images: [
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-05.jpg',
    ],
    inStock: true,
  },
  '6': {
    id: 6,
    name: 'Focus Multi-Pack',
    price: 39,
    description:
      'Stack of 3 small drab green cardboard paper card refill boxes with white text. Everything you need to stay organized.',
    imageSrc:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-06.jpg',
    imageAlt:
      'Stack of 3 small drab green cardboard paper card refill boxes with white text.',
    images: [
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-06.jpg',
    ],
    inStock: true,
  },
  '7': {
    id: 7,
    name: 'Brass Scissors',
    price: 50,
    description:
      'Brass scissors with geometric design, black steel finger holes, and included upright brass stand. A perfect blend of form and function.',
    imageSrc:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-07.jpg',
    imageAlt:
      'Brass scissors with geometric design, black steel finger holes, and included upright brass stand.',
    images: [
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-07.jpg',
    ],
    inStock: true,
  },
  '8': {
    id: 8,
    name: 'Focus Carry Pouch',
    price: 32,
    description:
      'Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop. Portable and stylish.',
    imageSrc:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-08.jpg',
    imageAlt:
      'Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.',
    images: [
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-08.jpg',
    ],
    inStock: true,
  },
};

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const product = productId ? mockProducts[productId] : null;

  if (!product) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Product not found
            </h1>
            <p className="mt-4 text-gray-600">
              The product you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [product.imageSrc];
  const handleAddToCart = () => {
    // Handle add to cart logic here
    console.log('Add to cart:', {
      productId: product.id,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
    alert('Product added to cart!');
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/" className="hover:text-gray-700">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            {/* Image selector */}
            {images.length > 1 && (
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <div className="grid grid-cols-4 gap-6">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        selectedImage === index ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <span className="sr-only">
                        {product.name} view {index + 1}
                      </span>
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="h-full w-full object-cover object-center rounded-md"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main image */}
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.imageAlt || product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                ${product.price}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <svg
                      key={rating}
                      className="h-5 w-5 flex-shrink-0 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <p className="sr-only">5 out of 5 stars</p>
                <p className="ml-2 text-sm text-gray-500">(24 reviews)</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Color picker */}
            {product.colors && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="mt-2 flex items-center space-x-3">
                  {product.colors.map((color: any) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        selectedColor === color.name
                          ? color.selectedClass
                          : 'ring-2 ring-transparent'
                      }`}
                    >
                      <span
                        className={`h-8 w-8 rounded-full border border-black border-opacity-10 ${color.class}`}
                        aria-label={color.name}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size picker */}
            {product.sizes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {product.sizes.map((size: any) => (
                    <button
                      key={size.name}
                      type="button"
                      onClick={() => setSelectedSize(size.name)}
                      disabled={!size.inStock}
                      className={`flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        selectedSize === size.name
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : size.inStock
                          ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="mt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-md border border-gray-300 p-1 hover:bg-gray-50"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="text-base font-medium text-gray-900 w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-md border border-gray-300 p-1 hover:bg-gray-50"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-10">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 ${
                  product.inStock
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {product.inStock ? (
                  <>
                    <ShoppingBagIcon className="mr-2 h-5 w-5" />
                    Add to cart
                  </>
                ) : (
                  'Out of stock'
                )}
              </button>
            </div>

            {/* Product details */}
            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>
              <div className="divide-y divide-gray-200 border-t">
                <div className="py-6">
                  <h3 className="text-sm font-medium text-gray-900">
                    Shipping & Returns
                  </h3>
                  <div className="mt-2 prose prose-sm text-gray-500">
                    <p>
                      Free shipping on orders over $100. Returns accepted within
                      30 days of purchase.
                    </p>
                  </div>
                </div>
                <div className="py-6">
                  <h3 className="text-sm font-medium text-gray-900">Care</h3>
                  <div className="mt-2 prose prose-sm text-gray-500">
                    <p>
                      Hand wash only. Do not bleach. Air dry flat. Do not iron.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Customers also bought */}
        <section className="mt-24 border-t border-gray-200 pt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Customers also bought
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(mockProducts)
              .filter((p: any) => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct: any) => (
                <div key={relatedProduct.id} className="group relative">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={relatedProduct.imageSrc}
                        alt={relatedProduct.imageAlt || relatedProduct.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                      {/* Price tag overlay */}
                      <div className="absolute bottom-2 right-2 rounded-md bg-gray-900 px-2.5 py-1">
                        <span className="text-sm font-medium text-white">
                          ${relatedProduct.price}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        {relatedProduct.name}
                      </h3>
                      {relatedProduct.colors && (
                        <p className="mt-1 text-sm text-gray-500">
                          {relatedProduct.colors
                            .map((c: any) => c.name)
                            .join(' and ')}
                        </p>
                      )}
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Add to cart:', relatedProduct.id);
                      alert('Product added to cart!');
                    }}
                    className="mt-4 w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add to cart
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
