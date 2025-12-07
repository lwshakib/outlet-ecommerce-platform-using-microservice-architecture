import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock orders data with detailed tracking - in a real app, this would come from state/context/API
const mockOrders = [
  {
    id: '54879',
    date: '2024-03-22',
    status: 'processing',
    total: 83.16,
    items: [
      {
        id: 1,
        name: 'Nomad Tumbler',
        quantity: 1,
        price: 35.0,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
        description:
          'This durable and portable insulated tumbler will keep your beverage at the perfect temperature during your next adventure.',
        trackingStatus: 'processing',
        trackingDate: '2024-03-24',
        trackingMessage: 'Preparing to ship on March 24, 2024',
      },
      {
        id: 2,
        name: 'Minimalist Wristwatch',
        quantity: 1,
        price: 149.0,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-06.jpg',
        description:
          'This contemporary wristwatch has a clean, minimalist look and high quality components.',
        trackingStatus: 'shipped',
        trackingDate: '2024-03-23',
        trackingMessage: 'Shipped on March 23, 2024',
      },
    ],
    paymentMethod: 'stripe',
    shippingAddress: {
      name: 'Floyd Miles',
      address: '7363 Cynthia Pass',
      city: 'Toronto, ON N3Y 4HB',
    },
    billingAddress: {
      name: 'Floyd Miles',
      address: '7363 Cynthia Pass',
      city: 'Toronto, ON N3Y 4H8',
    },
    contactEmail: 'f***@example.com',
    contactPhone: '1*********40',
  },
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 140.8,
    items: [
      {
        id: 3,
        name: 'Earthen Bottle',
        quantity: 1,
        price: 48,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
        description:
          'Tall slender porcelain bottle with natural clay textured body.',
        trackingStatus: 'delivered',
        trackingDate: '2024-01-18',
        trackingMessage: 'Delivered on January 18, 2024',
      },
      {
        id: 4,
        name: 'Focus Paper Refill',
        quantity: 2,
        price: 35,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
        description:
          'Person using a pen to cross a task off a productivity paper card.',
        trackingStatus: 'delivered',
        trackingDate: '2024-01-18',
        trackingMessage: 'Delivered on January 18, 2024',
      },
    ],
    paymentMethod: 'stripe',
  },
];

const trackingStages = [
  { id: 'placed', label: 'Order placed' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
];

const getStageIndex = (status: string) => {
  switch (status) {
    case 'pending':
    case 'placed':
      return 0;
    case 'processing':
      return 1;
    case 'shipped':
      return 2;
    case 'delivered':
      return 3;
    default:
      return 0;
  }
};

const TrackingProgress = ({ currentStatus }: { currentStatus: string }) => {
  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="mt-6">
      {/* Progress Bar with Stages */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />

        {/* Filled progress line */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-indigo-600 transition-all duration-500"
          style={{
            width: `${(currentIndex / (trackingStages.length - 1)) * 100}%`,
          }}
        />

        {/* Stage indicators */}
        <div className="relative flex justify-between">
          {trackingStages.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center">
                {/* Stage circle */}
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'border-indigo-600 bg-indigo-600'
                      : isCurrent
                      ? 'border-indigo-600 bg-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : isCurrent ? (
                    <div className="h-3 w-3 rounded-full bg-indigo-600" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Stage label */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-xs font-medium ${
                      isCompleted || isCurrent
                        ? 'text-indigo-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {stage.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function Orders() {
  const [orders] = useState(mockOrders);

  const ongoingOrders = orders.filter(
    (order) =>
      order.status === 'pending' ||
      order.status === 'processing' ||
      order.status === 'shipped'
  );

  const previousOrders = orders.filter((order) => order.status === 'delivered');

  const getPaymentMethodLabel = (method: string) => {
    return method === 'cod' ? 'Cash On Delivery' : 'Stripe';
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          My Orders
        </h1>

        {/* Ongoing Orders with Detailed Tracking */}
        {ongoingOrders.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Ongoing Orders
            </h2>
            <div className="space-y-8">
              {ongoingOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <Link
                        to="#"
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        View invoice →
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                      Order placed{' '}
                      {new Date(order.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Order Items with Individual Tracking */}
                  <div className="space-y-10">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-gray-200 pb-10 last:border-b-0 last:pb-0"
                      >
                        <div className="flex gap-6 mb-6">
                          <div className="flex-shrink-0">
                            <img
                              src={item.imageSrc}
                              alt={item.name}
                              className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900">
                              {item.name}
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              ${item.price.toFixed(2)}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Order Tracking - Prominent */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h5 className="text-base font-semibold text-gray-900">
                                {item.trackingMessage}
                              </h5>
                              <p className="mt-1 text-xs text-gray-500">
                                {new Date(item.trackingDate).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <TrackingProgress
                            currentStatus={item.trackingStatus}
                          />
                        </div>

                        {/* Delivery Address */}
                        {order.shippingAddress && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              Delivery Address
                            </h5>
                            <div className="text-sm text-gray-600">
                              <p>{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.city}</p>
                            </div>
                          </div>
                        )}

                        {/* Shipping Updates */}
                        {order.contactEmail && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              Shipping Updates
                            </h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>{order.contactEmail}</p>
                              <p>{order.contactPhone}</p>
                              <Link
                                to="#"
                                className="text-indigo-600 hover:text-indigo-500"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Billing & Payment Information */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                      {order.billingAddress && (
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">
                            Billing address
                          </h5>
                          <div className="text-sm text-gray-600">
                            <p>{order.billingAddress.name}</p>
                            <p>{order.billingAddress.address}</p>
                            <p>{order.billingAddress.city}</p>
                          </div>
                        </div>
                      )}
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">
                          Payment Information
                        </h5>
                        <div className="text-sm text-gray-600">
                          <p>VISA</p>
                          <p>Ending with 4242</p>
                          <p>Expires 02 / 24</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">
                          Order Summary
                        </h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>$5.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>$6.16</span>
                          </div>
                          <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                            <span className="font-semibold text-gray-900">
                              Order total
                            </span>
                            <span className="font-semibold text-indigo-600">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous Orders */}
        {previousOrders.length > 0 && (
          <div className={ongoingOrders.length > 0 ? 'mt-12' : 'mt-12'}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Previous Orders
            </h2>
            <div className="space-y-6">
              {previousOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Delivered on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Delivered
                      </span>
                      <p className="text-lg font-semibold text-gray-900 mt-2">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-4 mb-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex-shrink-0">
                          <img
                            src={item.imageSrc}
                            alt={item.name}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-md bg-gray-100 text-sm font-medium text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {order.items.length} item
                        {order.items.length > 1 ? 's' : ''}
                      </span>
                      <span className="text-gray-600">
                        Payment: {getPaymentMethodLabel(order.paymentMethod)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-500">You have no orders yet</p>
            <Link
              to="/"
              className="mt-6 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Start shopping
            </Link>
          </div>
        )}

        {/* Continue Shopping Link */}
        {orders.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-block text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Continue shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
