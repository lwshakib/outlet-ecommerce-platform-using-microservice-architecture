import { Link, useNavigate } from 'react-router-dom';

// Mock order data - in a real app, this would come from state/context/API
const orderData = {
  orderNumber: '14034056',
  trackingNumber: '51547878755545848512',
  items: [
    {
      id: 1,
      name: 'Cold Brew Bottle',
      quantity: 1,
      price: 32.0,
      imageSrc:
        'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
      description:
        'This glass bottle comes with a mesh insert for steeping tea or cold-brewing coffee. Pour from any angle and remove the top for easy cleaning.',
    },
  ],
  shippingAddress: {
    name: 'Kristin Watson',
    address: '7363 Cynthia Pass',
    city: 'Toronto, ON N3Y 4H8',
  },
  billingAddress: {
    name: 'Kristin Watson',
    address: '7363 Cynthia Pass',
    city: 'Toronto, ON N3Y 4H8',
  },
  paymentMethod: {
    type: 'Stripe',
    cardType: 'Mastercard',
    last4: '1545',
  },
  shippingMethod: {
    carrier: 'DHL',
    description: 'Takes up to 3 working days',
  },
  summary: {
    subtotal: 36.0,
    discount: 18.0,
    discountCode: 'STUDENT50',
    shipping: 5.0,
    total: 23.0,
  },
};

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-lg font-medium text-indigo-600">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            It's on the way!
          </h1>
          <p className="mt-4 text-base text-gray-600">
            Your order #{orderData.orderNumber} has shipped and will be with you
            soon.
          </p>
        </div>

        {/* Tracking Number */}
        <div className="mb-8 border-b border-gray-200 pb-8">
          <h2 className="text-sm font-medium text-gray-900">Tracking number</h2>
          <Link
            to="/orders"
            className="mt-2 text-base font-medium text-indigo-600 hover:text-indigo-500"
          >
            {orderData.trackingNumber}
          </Link>
        </div>

        {/* Ordered Items */}
        <div className="mb-8 border-b border-gray-200 pb-8">
          {orderData.items.map((item) => (
            <div key={item.id} className="flex gap-6">
              <div className="flex-shrink-0">
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <span>Quantity {item.quantity}</span>
                  <span className="h-4 w-px bg-gray-300"></span>
                  <span>Price ${item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Addresses */}
        <div className="mb-8 grid grid-cols-1 gap-8 border-b border-gray-200 pb-8 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Shipping address
            </h2>
            <div className="mt-2 text-sm text-gray-600">
              <p>{orderData.shippingAddress.name}</p>
              <p>{orderData.shippingAddress.address}</p>
              <p>{orderData.shippingAddress.city}</p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Billing address
            </h2>
            <div className="mt-2 text-sm text-gray-600">
              <p>{orderData.billingAddress.name}</p>
              <p>{orderData.billingAddress.address}</p>
              <p>{orderData.billingAddress.city}</p>
            </div>
          </div>
        </div>

        {/* Payment and Shipping Methods */}
        <div className="mb-8 grid grid-cols-1 gap-8 border-b border-gray-200 pb-8 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Payment method
            </h2>
            <div className="mt-2 text-sm text-gray-600">
              <p>{orderData.paymentMethod.type}</p>
              <p>{orderData.paymentMethod.cardType}</p>
              <p>••••{orderData.paymentMethod.last4}</p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Shipping method
            </h2>
            <div className="mt-2 text-sm text-gray-600">
              <p>{orderData.shippingMethod.carrier}</p>
              <p>{orderData.shippingMethod.description}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Subtotal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Discount</span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {orderData.summary.discountCode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Shipping</span>
              </div>
              <div className="mt-4">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div>
                <span className="text-sm text-gray-900">
                  ${orderData.summary.subtotal.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-900">
                  -${orderData.summary.discount.toFixed(2)} (50%)
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-900">
                  ${orderData.summary.shipping.toFixed(2)}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-base font-semibold text-indigo-600">
                  ${orderData.summary.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Track Progress
          </button>
          <Link
            to="/"
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-center text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
