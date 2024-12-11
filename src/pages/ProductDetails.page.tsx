import React, { useEffect, useState } from 'react'
import { ShareRounded, ShoppingCartRounded, FavoriteBorderRounded, ArrowDownwardRounded, Star } from '@mui/icons-material'
import main from "../assets/main.png"
import image1 from "../assets/image20.png"
import image3 from "../assets/image22.png"
import image4 from "../assets/image23.png"
import { Rating } from '@mui/material'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import BeatLoader from 'react-spinners/BeatLoader'

const ProductDetails: React.FunctionComponent = () => {
    const [product, setProduct] = useState<any>();
    const [searchParams,_] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const id = searchParams.get('id');
    const handleProductFetch = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`);
            if (res.data) {
                return res.data.data;
            }

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        if (id) {
            handleProductFetch().then((product) => {
                setProduct(product);
                setIsLoading(false);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [id])
    const colors = ['bg-gray-300', 'bg-gray-400'];
    const sizes = ['L', 'M', 'S'];
    const promotions = ['Mastercard 10% off', 'Buy 3 get 1'];
    const reviews = [
        { name: 'John Doe', daysAgo: '3d', rating: 4, comment: 'Commodo consequat quis nisi dolor laboris in aute occaecat quis consequat culpa consectetur aliqua. Laborum cupidatat id reprehenderit non cillum irure sunt commodo.' },
        { name: 'Jane Smith', daysAgo: '5d', rating: 5, comment: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { name: 'Mike Johnson', daysAgo: '1w', rating: 4, comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    ];
    const similarProducts = [
        { image: main, name: 'Glass', rating: 4.7, reviews: 456, price: 37 },
        { image: image4, name: 'Watch', rating: 4.5, reviews: 302, price: 129 },
        { image: image3, name: 'Headphones', rating: 4.8, reviews: 621, price: 89 },
        { image: image1, name: 'Smartwatch', rating: 4.6, reviews: 518, price: 199 },
    ];

    return (
        <>
            {isLoading ? (<div className="flex flex-row justify-center items-center gap-x-4 py-4">
                <p className="font-bold">Loading</p>
                <BeatLoader color="#1E90FF" size={8} />
            </div>) :
                (<div className='w-[90%] max-w-7xl mx-auto pb-10'>
                    <div className='flex flex-col sm:flex-row justify-between items-center'>
                        <div className="mx-5 my-3">
                            <p className="text-gray-500 text-sm sm:text-base">Home &gt; <span className="font-medium text-text">Shop</span></p>
                        </div>
                        <div>
                            <span className="flex items-center">
                                <ShareRounded fontSize='small' className="mr-2" />
                                <span className="font-regular text-sm sm:text-base">Share</span>
                            </span>
                        </div>
                    </div>
                    <section id='mainSection'>
                        <div className='flex flex-col md:flex-row gap-8 md:gap-x-20'>
                            <div className='w-full md:w-1/2'>
                                <div>
                                    <img src={product.product_image} alt="main" className="w-full" />
                                </div>
                                <div className='flex flex-row gap-x-4 sm:gap-x-10 py-2'>
                                    {product?.gallery.map((thumb: any, index: any) => (
                                        <div key={index} className={`w-1/4 ${index === 0 ? 'border-secondary border-2' : ''}`}>
                                            <img src={thumb} alt={`thumbnail-${index}`} className="w-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex flex-col gap-y-4 w-full md:w-1/2 lg:w-1/3'>
                                <div className='flex flex-row justify-between items-center'>
                                    <h1 className='font-bold text-lg sm:text-xl md:text-2xl'>{product.name}</h1>
                                    <button className='p-[1px] font-light text-xs sm:text-sm px-3 rounded-full text-white bg-[#15ABFF]'>Best Seller</button>
                                </div>
                                <div className='flex flex-row flex-wrap gap-4'>
                                    <span className='flex flex-row items-center text-sm sm:text-base'>4.5 <Rating value={product.rating} size="small" readOnly /></span>
                                    <span className='font-medium text-sm sm:text-base'>367 <span className='text-gray-500'>Reviews</span></span>
                                    <span className='font-medium text-sm sm:text-base'>200 <span className='text-gray-500'>Sold</span></span>
                                </div>
                                <div className='flex flex-row items-center gap-x-4'>
                                    <span className='text-secondary font-bold text-xl sm:text-2xl md:text-3xl'>{product.sales_price} </span>
                                    <s className='text-sm sm:text-base'>{product.regular_price}</s>
                                </div>
                                <div className='flex flex-row gap-x-10 cursor-pointer'>
                                    <div>
                                        <span>Color</span>
                                        <span className='flex flex-row items-center gap-x-3 py-2'>
                                            {colors.map((color, index) => (
                                                <div key={index} className={`h-9 w-9 ${color} rounded-full ${index === 0 ? 'border-2 border-secondary' : ''}`} />
                                            ))}
                                        </span>
                                    </div>
                                    <div className='w-fit'>
                                        <span>Size</span>
                                        <span className='flex flex-row items-center py-2'>
                                            {sizes.map((size, index) => (
                                                <span key={index}
                                                    className={`p-2 px-5 ${index === 0 ? 'bg-secondary text-white' : 'bg-gray-200 text-secondary'} 
                                            ${index === 0 ? 'rounded-l-xl' : index === sizes.length - 1 ? 'rounded-r-xl' : ''} 
                                            ${index == 1 ? 'border-r-2 border-secondary' : ''}
                                            border-t-2 border-b-2 border-secondary ${index === 0 ? 'border-l-2' : index === sizes.length - 1 ? 'border-r-2' : ''}`}>
                                                    {size}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <span>Promotion</span>
                                        <span className='flex flex-row items-center gap-x-3 py-2'>
                                            {promotions.map((promo, index) => (
                                                <span key={index} className='border-2 font-light p-2 text-secondary rounded-xl bg-gray-200'>{promo}</span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <span>Quantity</span>
                                        <span className='flex flex-row items-center gap-x-3 py-2'>
                                            <button className='border-2 font-light p-2 px-3 text-secondary rounded-xl bg-gray-200'>+</button>
                                            <span className='border-2 font-light p-2 px-3 text-secondary rounded-xl bg-gray-200' contentEditable={true}>0</span>
                                            <button className='border-2 font-light p-2 px-3 text-secondary rounded-xl bg-gray-200'>-</button>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className='flex flex-row items-center gap-x-3 py-2'>
                                        <button className='border-2 border-secondary font-light w-[50%] p-2 px-3 text-secondary rounded-lg'>
                                            <Link to={'/cart'}><ShoppingCartRounded /> Add to cart</Link></button>
                                        <button className='font-light w-[50%] p-3 px-3 text-white bg-secondary rounded-lg'>
                                            <Link to={'/checkout'}>Checkout</Link>
                                        </button>
                                    </span>
                                </div>
                                <div>
                                    <span className='flex flex-row items-center gap-x-3 py-2'>
                                        <button className='border-2 font-light p-2 px-3 text-secondary rounded-xl bg-gray-200'><FavoriteBorderRounded /></button>
                                        <span className='font-bold'>Add to wishlist</span>
                                        <span className='text-gray-500 font-light'>3 person favorited this product</span>
                                    </span>
                                </div>
                                <div>
                                    <span className='flex flex-row items-center gap-x-3 py-2'>
                                        <span className='text-gray-500 font-light'>Tags:</span>
                                        <span className='font-light'>Apple Watch SE (1st Gen), GPS</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id='review' className='mt-8'>
                        <div className='flex flex-row gap-x-4 overflow-x-auto pb-2'>
                            <span className='text-gray-500 font-light whitespace-nowrap'>Product Detail</span>
                            <span className='text-secondary p-4 border-b-2 border-secondary font-bold whitespace-nowrap'>Reviews(18+)</span>
                            <span className='text-gray-500 font-light whitespace-nowrap'>About Store</span>
                        </div>
                        <hr className='relative bottom-2' />
                        <div className='w-full lg:w-[60%] flex flex-col gap-y-4 py-2'>
                            {reviews.map((review, index) => (
                                <div key={index}>
                                    <div className='flex flex-row items-center gap-x-4'>
                                        <div className=''>
                                            <img src={main} className='w-[50px] h-[50px] rounded-full object-cover' alt={`reviewer-${index}`} />
                                        </div>
                                        <div>
                                            <div className='flex flex-row gap-x-4'>
                                                <span className='font-bold'>{review.name}</span>
                                                <span className='font-light text-gray-500'>{review.daysAgo} ago</span>
                                            </div>
                                            <Rating value={review.rating} readOnly />
                                        </div>
                                    </div>
                                    <div>
                                        <span className='font-light text-sm py-4'>{review.comment}</span>
                                    </div>
                                </div>
                            ))}
                            <a href='#' className='text-secondary flex items-center'>View all <ArrowDownwardRounded /></a>
                        </div>
                    </section>
                    <section className='py-4'>
                        <p className='font-bold text-lg py-3'>Add your Review</p>
                        <div>
                            <p className='py-4'>Your rating</p>
                            <Rating />
                            <p className='py-4'>Your review</p>
                            <textarea className='border-2 border-secondary rounded-xl p-2 w-full md:w-1/2' rows={5} placeholder='Enter your comment'></textarea>
                            <div className='py-4'>
                                <button className='py-3 px-4 text-white bg-secondary rounded-xl'>Submit Review</button>
                            </div>
                        </div>
                    </section>
                    <section id='recommendedProducts'>
                        <div className="flex flex-row justify-between pb-5">
                            <div className="">
                                <h2 className="font-bold text-xl">Similar Products</h2>
                            </div>
                            <div>
                                <a href="#" className="border-2 border-secondary text-secondary rounded-xl p-2 text-sm">View All &gt;</a>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                            {similarProducts.map((product, index) => (
                                <div key={index} className='shadow-sm'>
                                    <img src={product.image} className='w-full' alt={product.name} />
                                    <div className='p-4'>
                                        <span className='font-bold'>{product.name}</span>
                                        <div className='flex flex-row justify-between py-2 font-bold text-sm'>
                                            <span>{product.rating}&nbsp;<Star htmlColor='#F3C63F' fontSize='small' /> &nbsp;<span className='text-gray-500'>({product.reviews})</span></span>
                                            <span className='font-bold'>${product.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>)}
        </>
    )
}

export default ProductDetails