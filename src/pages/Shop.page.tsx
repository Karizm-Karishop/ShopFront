import { useEffect, useState } from "react"
import ProductCard from "../components/Products/ProductCard"
import Filter from "../components/Shop/Filter"
import { SearchRounded } from "@mui/icons-material"
import BannerAd from "../components/Shop/bannerAd"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "../Redux/hooks"
import BeatLoader from "react-spinners/BeatLoader"
import { cartThunk, getCartThunk } from "../Redux/Slices/CartSlice"
import { RootState } from "../Redux/store"
import { getwishlistThunk, wishlistThunk } from "../Redux/Slices/WishlistSlice"
const BASE_URL = import.meta.env.VITE_BASE_URL;

const products = [
  {
    id: 1,
    name: "Stylish Watch",
    type: "Accessories",
    price: "1000 UGX",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    description: "Elegant timepiece for everyday wear.",
    rating: "4.5",
    discount: "10%"
  },
  {
    id: 2,
    name: "Wireless Earbuds",
    type: "Electronics",
    price: "1500 UGX",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb",
    description: "High-quality sound in a compact design.",
    rating: "4.7",
    discount: "15%"
  },
  {
    id: 3,
    name: "Leather Wallet",
    type: "Accessories",
    price: "800 UGX",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    description: "Durable and stylish leather wallet.",
    rating: "4.3",
    discount: "5%"
  },
  {
    id: 4,
    name: "Smartphone",
    type: "Electronics",
    price: "3000 UGX",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    description: "Latest model with advanced features.",
    rating: "4.8",
    discount: "20%"
  },
  {
    id: 5,
    name: "Running Shoes",
    type: "Footwear",
    price: "1200 UGX",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    description: "Comfortable shoes for your daily run.",
    rating: "4.6",
    discount: "12%"
  },
  {
    id: 6,
    name: "Backpack",
    type: "Accessories",
    price: "900 UGX",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    description: "Spacious backpack for work or travel.",
    rating: "4.4",
    discount: "8%"
  }
];

const slides = [{
  id: 1,
  title: 'New Arrivals',
  description: 'Discover the latest products',
  image: 'src/assets/recommended.png',
},
{
  id: 2,
  title: 'Best Sellers',
  description: 'Check out the most popular products',
  image: 'src/assets/recommended.png',
}, {
  id: 3,
  title: 'Exclusive Offers',
  description: 'Get the best deals',
  image: 'src/assets/recommended.png',
}
]

const Shop = () => {
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const wishlist = useAppSelector((state: RootState) => state.wishlist.items);
  const user= useAppSelector((state: RootState) => state.loginIn.user?.user_id);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [dbProducts, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const handleAddCart = (id:number) => {
    dispatch(cartThunk({user_id:user as number, product_id:id, quantity:1}))
  };

  const handleAddWishlist = (id:number) => {
   dispatch(wishlistThunk({user_id:user as number, product_id:id}))
  }
  const handleFetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`)
      if (response.status === 200) {
        setProducts(response.data.data);
        setLoading(false);
        return response.data.data
      }


    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    handleFetchProducts();
    dispatch(getCartThunk(user as number));
    dispatch(getwishlistThunk(user as number));
    console.log("cart",cart);
    console.log(dbProducts);
  }, []);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer =
      setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000)
    return () => clearInterval(timer);
  }, [slides.length])
  return (
    <>
      {!isLoading ? (<div className="w-full px-4 md:w-[90%] m-auto">
        <div className="mx-2 md:mx-5 my-3">
          <p className="text-gray-500">Home &gt; <span className="font-medium text-text">Shop</span></p>
        </div>

        <div className="flex gap-x-6 flex-col md:flex-row">
          <div className="lg:w-[25%] sm:w-[100%] md:w-1/4 mb-4 md:mb-0">
            <Filter />
          </div>

          <div className="w-full md:w-3/4 md:ml-5">
            <div className="flex flex-col md:flex-row items-center justify-between pb-5 md:pb-10">
              <div className="w-full mb-4 md:mb-0 md:w-3/4 relative">
                <SearchRounded className="absolute left-3 top-1/2 transform -translate-y-1/2" htmlColor="gray" />
                <input type="text" placeholder="Search ..." className="w-full p-2 pl-10 rounded-xl bg-gray-200" />
              </div>
              <div className="w-full md:w-auto">
                <a href="#" role="button" className="block w-full md:w-auto text-center bg-secondary text-white rounded-xl p-2 px-4">Search</a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between pb-5">
              <div className="flex flex-row items-center gap-x-4 mb-2 md:mb-0">
                <h2 className="font-bold text-l">Products Results</h2><span className="text-sm text-gray-500">{dbProducts.length} products</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Sort by &nbsp; &nbsp;</span>
                <select className="outline-none text-secondary">
                  <option value="0">Latest</option>
                  <option value="1">Lowest Price</option>
                  <option value="2">Highest Price</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap -mx-2">
              {dbProducts.map((product: any) => (
                <div key={product.product_id} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
                  <ProductCard
                    id={product.product_id}
                    name={product.name}
                    regularPrice={`${product.regular_price}`}
                    type={product.tags[0]}
                    price={`${product.sales_price}`}
                    image={product.product_image}
                    description={product.longDesc}
                    rating={product.rating}
                    discount={"0"}
                    addCart={() => handleAddCart(product.product_id)}
                    addToWishlist={() => handleAddWishlist(product.product_id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <section className="flex flex-row items-center gap-x-10 my-10 sm:flex-col md:flex-row">
          <div className="flex-initial w-[25%] sm:w-full md:w-[20%]">
            <h1 className='font-bold py-2'>Recommended Products</h1>
            {slides.map((slide, i) => {
              return (
                <div key={slide.id} className={`transition-display duration-1000 ${i === index ? 'block opacity-100' : 'hidden opacity-0'}`}>
                  <div className='page flex flex-col sm:flex-row md:flex-col '>
                    <img src={slide.image} />
                    <div className='flex w-[70%] items-center flex-col gap-y-2 text-center'>
                      <p className='font-bold text-center pt-2'>{slide.title}</p>
                      <p className='font-light text-sm text-center'> {slide.description} </p>
                      <button className='align-center p-3 rounded-md bg-[#1C4A93] text-white'>Discover Now</button>
                      <div className="flex flex-row justify-center mt-4">
                        {slides.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full mx-1 ${i === index ? 'bg-secondary' : 'bg-gray-500'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>)
            })}

          </div>
          <div className="w-[70%] sm:w-full md:w-[70%]">
            <BannerAd />
          </div>
        </section >
        <section className="my-10">
          <div className="flex flex-col md:flex-row justify-between pb-5">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-x-4 mb-2 md:mb-0">
              <h2 className="font-bold text-l">Products Results</h2>
              <span className="text-sm text-gray-500 text-center md:text-left">Do not miss the current offers until the end of March.</span>
            </div>
            <div className="text-center md:text-right mt-2 md:mt-0">
              <a href="#" className="inline-block border-2 border-secondary text-secondary rounded-xl p-2 text-sm">View All &gt;</a>
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            {dbProducts.slice(0, 4).map((product: any) => (
              <div key={product.product_id} className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                <ProductCard
                  id={product.product_id}
                  name={product.name}
                  regularPrice={`${product.regular_price}`}
                  type={product.tags[0]}
                  price={`${product.sales_price}`}
                  image={product.product_image}
                  description={product.shortDesc}
                  rating={product.rating}
                  discount={"0"}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="my-10">
          <div className="flex flex-col md:flex-row justify-between pb-5">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-x-4 mb-2 md:mb-0">
              <h2 className="font-bold text-l">Best Sellers</h2>
              <span className="text-sm text-gray-500 text-center md:text-left">Dont miss this opportunity at a special discount just for this week.</span>
            </div>
            <div className="text-center md:text-right mt-2 md:mt-0">
              <a href="#" className="inline-block border-2 border-secondary text-secondary rounded-xl p-2 text-sm">View All &gt;</a>
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            {dbProducts.slice(2, 6).map((product: any) => (
              <div key={product.product_id} className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                <ProductCard
                  id={product.product_id}
                  name={product.name}
                  regularPrice={`${product.regular_price}`}
                  type={product.tags[0]}
                  price={`${product.sales_price}`}
                  image={product.product_image}
                  description={product.shortDesc}
                  rating={product.rating}
                  discount={"0"}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="my-10">
          <div className="flex flex-col md:flex-row justify-around">
            <div className="w-full md:w-[30%] mb-8 md:mb-0">
              <div>
                <h2 className="font-bold text-l py-2">Most Popular</h2>
                <hr className="border-[2px] w-[40%] border-secondary" />
              </div>
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex flex-row justify-between py-4">
                  <div className="w-[60px] h-[60px] object-contain">
                    <img src="https://www.apple.com/newsroom/images/product/watch/lifestyle/Apple-Watch-SE-aluminum-silver-220907_inline.jpg.large.jpg" alt="watch" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p>Apple watch</p>
                    <p className="text-secondary py-2">$49.00 <s className="font-light text-sm">$60.00</s></p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full md:w-[30%] mb-8 md:mb-0">
              <div>
                <h2 className="font-bold text-l py-2">Recent Products</h2>
                <hr className="border-[2px] w-[40%] border-secondary" />
              </div>
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex flex-row justify-between py-4">
                  <div className="w-[60px] h-[60px] object-contain">
                    <img src="https://www.apple.com/newsroom/images/product/watch/lifestyle/Apple-Watch-SE-aluminum-silver-220907_inline.jpg.large.jpg" alt="watch" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p>Apple watch</p>
                    <p className="text-secondary py-2">$49.00 <s className="font-light text-sm">$60.00</s></p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full md:w-[30%]">
              <div>
                <h2 className="font-bold text-l py-2">Most Selling</h2>
                <hr className="border-[2px] w-[40%] border-secondary" />
              </div>
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex flex-row justify-between py-4">
                  <div className="w-[60px] h-[60px] object-contain">
                    <img src="https://www.apple.com/newsroom/images/product/watch/lifestyle/Apple-Watch-SE-aluminum-silver-220907_inline.jpg.large.jpg" alt="watch" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p>Apple watch</p>
                    <p className="text-secondary py-2">$49.00 <s className="font-light text-sm">$60.00</s></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>) : (
        <div className="flex flex-row justify-center items-center gap-x-4 py-4">
          <p className="font-bold">Loading products</p>
          <BeatLoader color="#1E90FF" size={8} />
        </div>
      )}
    </>
  )
}

export default Shop