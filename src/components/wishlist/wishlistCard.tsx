import { CancelRounded } from '@mui/icons-material';
import { Rating } from '@mui/material';
import HSButton from '../../components/form/HSButton';
import { useAppDispatch } from '../../Redux/hooks';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../../utilis/ToastProps';
import { useReducer } from 'react';
import { cartThunk } from '../../Redux/Slices/CartSlice';
interface IWishlist {
    id: number;
    name: string;
    product_id: number;
    price: string;
    image: string;
    regularPrice: string;
    owner: number;
    quantity?: number;
    rating?: number;
}
const WishlistCard = ({ id, product_id, owner, name, price, image, regularPrice, rating }: IWishlist) => {
    const dispatch = useAppDispatch();
    const [, forcedUpdate] = useReducer((x) => x + 1, 0)
    const handleRemove = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/wishlist/remove/${id}`)
            if (response.data) {
                showSuccessToast('Item removed from wishlist successfully');
                forcedUpdate();
            }
        }
        catch (error) {
            console.log('Error:', error);
            showErrorToast('Failed to remove item from wishlist');
        }


    };
    const handleAddtoCart=() => {
        dispatch(cartThunk({
            product_id,
            quantity: 1,
            user_id: owner,
        }))
    }
    return (
        <div className='w-full sm:w-[47%] flex flex-col sm:flex-row items-center gap-4 bg-[#F5F1F178] shadow-md p-4 rounded-xl'>
            <div className='w-full sm:w-[50%]'>
                <img src={image} className='w-full h-48 sm:h-auto object-cover rounded-lg' alt="main" />
            </div>
            <div className='w-full sm:w-[50%] mt-4 sm:mt-0'>
                <div className='flex flex-row justify-between items-center'>
                    <p className="font-bold text-sm sm:text-md">In Stock</p>
                    <a role='button' onClick={handleRemove} className="text-gray-500"><CancelRounded color='warning' /></a>
                </div>
                <div className='flex flex-col gap-y-2 sm:gap-y-4 mt-2'>
                    <p className="font-bold text-base sm:text-lg text-gray-400">{name}</p>
                    <p className='flex flex-row items-center text-sm sm:text-base'>
                        {rating} &nbsp;<Rating value={rating} size="small" />
                    </p>
                    <span className='text-base sm:text-lg font-bold text-secondary'>
                        {price} <s className='font-light text-gray-500 ml-2'>{regularPrice}</s>
                    </span>
                    <HSButton onClick={handleAddtoCart} styles='bg-secondary w-full sm:w-[60%] text-sm sm:text-base' title='Add to cart' />
                </div>
            </div>
        </div>
    )
}

export default WishlistCard;

