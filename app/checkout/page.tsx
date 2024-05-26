// pages/checkout.js
'use client';

import { useCartStore } from '@/hooks/useCartStore';
import { useState } from 'react';
import { media as wixMedia } from '@wix/sdk';
import Image from 'next/image';
import Link from 'next/link';

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const SalesTax = 20;

  const { cart, isLoading, removeItem } = useCartStore();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl mb-4 text-center"><span className='font-semibold'>CyberMart</span> Checkout</h1>
      <div className="mb-4 bg-gray-50 p-5 w-[400px] flex justify-between">
        <span>Logged in as john@gmail.com</span> <a href="#" className="text-blue-500">Log out</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium">Country/Region *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
                <div className='flex justify-between gap-10'>
                    <div className='flex-col flex'>
                        <label htmlFor="state" className="block text-sm font-medium">State *</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                   <div className='flex-col flex items-end'>
                    <label htmlFor="postalCode" className="block text-sm font-medium">Postal/Zip Code *</label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                   </div>
                </div>
            </div>
           
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
              <Link href={"/success"}>
                Continue
              </Link>
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Order summary</h2>
          <div className='bg-gray-50'>
            {cart.lineItems?.map((item) => (
              <div key={item._id} className='bg-gray-50 p-5'>
                  <div className='flex justify-between'>
                  <div className='flex gap-5'>
                    <Image
                        src={wixMedia.getScaledToFillImageUrl(
                          item?.image ?? "",
                          72,
                          96,
                          {}
                        )}
                        alt=""
                        width={72}
                        height={96}
                        className="object-cover rounded-md"
                      />
                      <div className='flex flex-col'>
                        <p>{item.productName?.original}</p>
                        <p>Qty: x{item.quantity}</p>
                      </div>
                  </div>
                    <p>{item?.fullPrice?.formattedAmount}</p>
                  </div>
              </div>
            ))}
            <div className='underline w-full border border-gray' />
            <div className='flex justify-between p-5'>
              <p>Subtotal</p>
              <p>{cart?.subtotal?.formattedAmount}</p>
            </div>
            <div className='flex justify-between pl-5 pr-5 mb-5'>
              <p>Sales Tax</p>
              <p>${SalesTax}</p>
            </div>
            <div className='underline w-full border border-gray' />
            <div className='flex justify-between p-5 font-bold'>
              <p>Total</p>
              <p>${Number(cart?.subtotal?.amount) + Number(SalesTax)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
