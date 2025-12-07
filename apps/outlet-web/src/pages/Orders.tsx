import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock orders data - in a real app, this would come from state/context/API
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 140.8,
    items: [
      {
        id: 1,
        name: 'Earthen Bottle',
        quantity: 1,
        price: 48,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
      },
      {
        id: 2,
        name: 'Nomad Tumbler',
        quantity: 2,
        price: 35,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
      },
    ],
    paymentMethod: 'stripe',
  },
  {
    id: 'ORD-002',
    date: '2024-01-20',
    status: 'processing',
    total: 89.0,
    items: [
      {
        id: 3,
        name: 'Focus Paper Refill',
        quantity: 1,
        price: 89,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
      },
    ],
    paymentMethod: 'cod',
  },
  {
    id: 'ORD-003',
    date: '2024-01-22',
    status: 'shipped',
    total: 118.0,
    items: [
      {
        id: 4,
        name: 'Machined Mechanical Pencil',
        quantity: 1,
        price: 35,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg',
      },
      {
        id: 5,
        name: 'Focus Card Tray',
        quantity: 1,
        price: 64,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-05.jpg',
      },
    ],
    paymentMethod: 'stripe',
  },
  {
    id: 'ORD-004',
    date: '2024-01-25',
    status: 'pending',
    total: 50.0,
    items: [
      {
        id: 7,
        name: 'Brass Scissors',
        quantity: 1,
        price: 50,
        imageSrc:
          'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-07.jpg',
      },
    ],
    paymentMethod: 'cod',
  },
];

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-800',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
  },
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

  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    return method === 'cod' ? 'Cash On Delivery' : 'Stripe';
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          My Orders
        </h1>

        {/* Ongoing Orders */}
        {ongoingOrders.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Ongoing Orders
            </h2>
            <div className="space-y-6">
              {ongoingOrders.map((order) => (
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
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(
                        order.status as keyof typeof statusConfig
                      )}
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
                      {getStatusBadge(
                        order.status as keyof typeof statusConfig
                      )}
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
