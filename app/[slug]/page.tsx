import { wixClientServer } from '@/lib/wixClientServer'
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import ProductImages from '../components/ProductImages';
import CustomizeProducts from '../components/CustomizeProducts';
import Add from '../components/Add';
import Reviews from '../components/Reviews';

const SlugPage = async ({ params }: { params: { slug: string }}) => {
  const wixClient = await wixClientServer();

  const products = await wixClient.products.queryProducts().eq('slug', params.slug).find();

  if(!products.items[0]) return notFound();

  const product = products.items[0];

  const productDescription = product?.description?.replace(/<\/?(p|strong)>|&nbsp;/g, '')
  
  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16'>
      <div className='w-full lg:w-1/2 lg:sticky top-20 h-max'>
        <ProductImages items={product.media?.items} />
      </div>

      <div className='w-full lg:w-1/2 flex flex-col gap-6'>
        <h1 className='text-4xl font-medium'>{product.name}</h1>
        <p className='text-gray-500'>{productDescription}</p>
        <div className='h-[2px] bg-gray-100' />

        {product.price?.price === product.price?.discountedPrice ? (
          <h2 className='font-medium'>${product.price?.price}</h2>
        ) : (
          <div className='flex items-center gap-4'>
              <h3 className='text-xl text-gray-500 line-through'>
                ${product.price?.price}
              </h3>
              <h2 className='font-medium text-2xl'>
                ${product.price?.discountedPrice}
              </h2>
          </div>
        )}
        <div className='h-[2px] bg-gray-100' />
        {product.variants && product.productOptions ? (
          <CustomizeProducts 
            productId={product._id!}
            variants={product.variants}
            productOptions={product.productOptions}
          />
        ) : (
          <Add 
            productId={product._id!}
            variantId='00000000-0000-0000-0000-000000000000'
            stockNumber={product.stock?.quantity || 0}
          />
        )}
        <div className='h-[2px] bg-gray-100' />
        {product.additionalInfoSections?.map((section) => (
          <div className='text-sm' key={section.title}>
            <h4 className='font-medium mb-4'>{section.title}</h4>
          </div>
        ))}

        <h1 className='text-2xl'>User Reviews</h1>
        <Suspense fallback="Loading...">
          <Reviews />
        </Suspense>
      </div>
    </div>
  )
}

export default SlugPage