import { Link } from "react-router-dom";
import CartCard from "../components/cart/cartCard"
import ProductCard from "../components/Products/ProductCard";

const Cart = () => {
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

    return (
        <>
            <div className="w-[80%] m-auto py-5">
                <div className="flex flex-col md:flex-row justify-between pb-5">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-x-4 mb-2 md:mb-0">
                        <h2 className="font-bold text-xl">Products in cart</h2>
                        <span className="text-sm text-gray-500 text-center md:text-left"> 3 products</span>
                    </div>
                    <div className="text-center md:text-right mt-2 md:mt-0">
                        <a href="#" className="inline-block border-2 border-secondary text-secondary rounded-xl p-2 text-sm">View All &gt;</a>
                    </div>
                </div>
                <div>
                    <CartCard />
                    <CartCard />
                    <CartCard />
                    <CartCard />
                    <div className="pt-8 flex flex-row justify-center">
                        <button className='font-light w-[50%] p-3 px-3 text-white bg-secondary rounded-lg'>
                            <Link to={'/checkout'}>Checkout</Link>
                        </button>
                    </div>
                </div>
                <div>
                    <div>
                        <h2 className="font-bold text-lg py-10">Recommended products</h2>
                    </div>
                    <div>
                        <div className="flex flex-wrap -mx-2">
                            {products.slice(2, 6).map((product) => (
                                <div key={product.id} className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
                                    <ProductCard
                                        name={product.name}
                                        type={product.type}
                                        price={product.price}
                                        image={product.image}
                                        description={product.description}
                                        rating={product.rating}
                                        discount={product.discount}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart