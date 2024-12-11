import axios from "axios";
import { useEffect, useState } from "react";
import { showSuccessToast } from "../../utilis/ToastProps";
import { useAppDispatch } from "../../Redux/hooks";
import { getCartThunk } from "../../Redux/Slices/CartSlice";

const sizes = ['L', 'M', 'S'];
const colors = ['bg-gray-300', 'bg-gray-400'];
interface CartItem{
  id:number
  name: string,
  price: string,
  image: string,
  description: string,
  quantity: number,
  owner?: number,
  size: string,
  color: string
}
const CartCard = ({id,name,image, quantity, price, owner}:Partial<CartItem>) => {
  const [inputquantity, setQuantity]= useState(quantity);
  const dispatch= useAppDispatch();
  
  const handleSetQuantity=(e:any)=>{
    setQuantity(e.target?.value);
  }
  const handleDeleteCartItem=async ()=>{
    try {
      const response= await axios.delete(`${import.meta.env.VITE_BASE_URL}/cart/${id}`);
      if(response.data){
          showSuccessToast('Item removed from cart successfully')
          console.log(response.data);
  }}
    catch (error) {
      console.log(error)
    }}
  const handleUpdateQuantity=async (payload:number)=>{
    try {
      const response= await axios.put(`${import.meta.env.VITE_BASE_URL}/cart/${id}`,{
        quantity: payload,
        user_id: owner
      });
      if(response.data){
          console.log(response.data);
  
      }
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(()=>{
   dispatch(getCartThunk(owner!));
  }, [showSuccessToast])
  useEffect(()=>{
    setTimeout(()=>{
      if(inputquantity && !isNaN(inputquantity) && Number(inputquantity)!==0 && Number(inputquantity)!==quantity){
        handleUpdateQuantity(Number(inputquantity));
      }
    },1000)
  },[inputquantity])
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 py-5" key={id}>
        <div className="w-full sm:w-[200px] h-[200px] sm:h-auto">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg font-bold">{name}</h2>
            <a role="button" onClick={handleDeleteCartItem} className="text-secondary font-bold">Remove</a>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 sm:gap-y-0">
            <div className='w-full sm:w-auto'>
              <span className="block mb-2">Size</span>
              <div className='flex flex-row items-center'>
                {sizes.map((size, index) => (
                  <span key={index}
                    className={`p-2 px-3 sm:px-5 text-sm sm:text-base
                      ${index === 0 ? 'bg-secondary text-white' : 'bg-gray-200 text-secondary'} 
                      ${index === 0 ? 'rounded-l-xl' : index === sizes.length - 1 ? 'rounded-r-xl' : ''} 
                      ${index == 1 ? 'border-r-2 border-secondary' : ''}
                      border-t-2 border-b-2 border-secondary ${index === 0 ? 'border-l-2' : index === sizes.length - 1 ? 'border-r-2' : ''}`}>
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <div className='w-full sm:w-auto'>
              <span className="block mb-2">Color</span>
              <div className='flex flex-row items-center gap-x-3'>
                {colors.map((color, index) => (
                  <div key={index} className={`h-7 w-7 sm:h-9 sm:w-9 ${color} rounded-full ${index === 0 ? 'border-2 border-secondary' : ''}`} />
                ))}
              </div>
            </div>
            <div className='w-full sm:w-auto'>
              <span className="block mb-2">Quantity</span>
              <div className='flex flex-row items-center gap-x-3'>
                <button onClick={()=>setQuantity((prevState)=> Number(prevState)+1)} className='border-2 font-light p-1 sm:p-2 px-2 sm:px-3 text-secondary rounded-xl bg-gray-200'>+</button>
                <input type="number" onChange={handleSetQuantity} value={inputquantity} className='border-2 w-20 font-light p-1 sm:p-2 px-2 sm:px-3 text-secondary rounded-xl bg-gray-200'/>
                <button onClick={()=>setQuantity((prevState)=> Number(prevState)-1)} className='border-2 font-light p-1 sm:p-2 px-2 sm:px-3 text-secondary rounded-xl bg-gray-200'>-</button>
              </div>
            </div>
            <div className='w-full sm:w-auto text-right sm:text-left'>
              <span className="font-bold text-xl">{price}</span>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </>
  )
}

export default CartCard;