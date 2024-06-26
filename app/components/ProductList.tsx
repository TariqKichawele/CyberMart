import { wixClientServer } from '@/lib/wixClientServer';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import React from 'react'
import { products } from '@wix/stores';
import Pagination from './Pagination';

type ProductListProps = {
    categoryId: string;
    limit?: number;
    searchParams?: any;
}

const ProductList = async ({ categoryId, limit, searchParams }: ProductListProps) => {
    const wixClient = await wixClientServer();

    const productQuery = wixClient.products
        .queryProducts()
        .limit(limit || 8)
        .eq('collectionIds', categoryId)
        .hasSome(
            "productType",
            searchParams?.type ? [searchParams.type] : ["physical", "digital"]
        )
        .startsWith('name', searchParams?.name || "")
        .gt('priceData.price', searchParams?.min || 0)
        .lt('priceData.price', searchParams?.max || 9999999)
        .skip(
            searchParams?.page 
                ? parseInt(searchParams.page) * (limit || 8)
                : 0
        );

    if (searchParams?.sort) {
            const [sortType, sortBy] = searchParams.sort.split(" ");
        
            if (sortType === "asc") {
              productQuery.ascending(sortBy);
            }
            if (sortType === "desc") {
              productQuery.descending(sortBy);
            }
    }

    const res = await productQuery.find();

  return (
    <div className='mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap'>
        {res.items.map((product: products.Product) => (
            <Link
                href={"/" + product.slug}
                key={product._id}
                className='w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]'
            >
                <div className='relative w-full h-80'>
                    <Image 
                        src={product.media?.mainMedia?.image?.url || "/product.png"}
                        alt=''
                        fill
                        sizes='25vw'
                        className='absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500'
                    />
                    {product.media?.items && (
                        <Image 
                            src={product.media?.items[1]?.image?.url || '/product.png'}
                            alt=''
                            fill
                            sizes='25vw'
                            className='absolute object-cover rounded-md'
                        />
                    )}
                </div>

                <div className='flex justify-between'>
                    <span className="font-medium">{product.name}</span>
                    <span className='font-semibold'>${product.price?.price}</span>
                </div>

                {product.additionalInfoSections && (
                    <div
                        className='text-sm text-gray-500'
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                                product.additionalInfoSections.find(
                                    (section) => section.title === 'shortDesc'
                                )?.description || ""
                            )
                        }}
                    >

                    </div>
                )}
                <button className='rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white'>
                    Add to Cart
                </button>
            </Link>
        ))}
        {searchParams?.cat || searchParams?.name ? (
            <Pagination 
                currentPage={res.currentPage || 0}
                hasPrev={res.hasPrev()}
                hasNext={res.hasNext()}
            />
        ): null}
    </div>
  )
}

export default ProductList