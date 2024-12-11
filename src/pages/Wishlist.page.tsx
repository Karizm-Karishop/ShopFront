import WishlistCard from "../components/wishlist/wishlistCard"
import { useAppSelector } from "../Redux/hooks"
import { RootState } from "../Redux/store"

const Wishlist = () => {
    const wishlist= useAppSelector((state:RootState)=>state.wishlist.items);
    const groupWishlist= wishlist.reduce((acc:any|never, item:any|never)=>{
        const existing= acc.find((grouped:any)=> grouped.id===item.id);
        if(existing){
            existing.quantity+=1;
        }
        else{
            acc.push({...item, quantity:1});
        }
    },[]);
    console.log('grouped',groupWishlist)

    return (
        <div>
            
            <div className='w-[80%] m-auto'>
                <div>
                    <h1 className="font-bold text-xl">My Wishlist &nbsp; <span className="text-gray-500">({wishlist.length})</span> </h1>
                </div>
                {wishlist.length>0?
                (<div className='py-5 flex flex-row justify-between gap-y-4 flex-wrap'>
                    {
                        wishlist.map((item:any)=>{
                            return(
                                <WishlistCard 
                                key={item.id}
                                owner={item.user_id}
                                id={item.id}
                                product_id={item.product.product_id}
                                name={item.product.name}
                                price={item.product.sales_price}
                                regularPrice={item.product.regular_price}
                                image={item.product.product_image}
                                /> 
                            )
                        })
                    }
                </div>):
                <div className="text-center"><p>No items in the wishlist</p></div>
                }
            </div>
        </div>


    )
}

export default Wishlist