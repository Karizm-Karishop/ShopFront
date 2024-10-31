import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import box from '../../assets/popups/box.svg'
import truck from '../../assets/popups/truck.svg'
import card from '../../assets/popups/card.svg'
import delivered from '../../assets/popups/delivered.svg'
import ok from '../../assets/popups/ok.svg'
import okbg from '../../assets/popups/okbg.svg'
import nobg from '../../assets/popups/nobg.svg'
import HSButton from '../form/HSButton'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


const OrderTracking = ({ flag }: { flag: boolean }) => {
  const [open, setOpen] = useState<boolean>(flag);

  useEffect(() => {
    setOpen(flag);
  }, [flag]);
  console.log(open);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open}>
      <DialogTitle>
        <p>Order Placed Successfully!</p>
        <p className='text-sm text-gray-500'>Order #459612445598</p>
      </DialogTitle>
      <DialogContent>
        <div className='flex flex-col gap-y-5 py-5'>
          <div className='flex flex-row gap-x-5 items-center'>
            <span className='w-[20%]'>
              <img src={box} alt="box" />
            </span>

            <p className='text-green'>Order placed</p>
          </div>
          <div className='flex flex-row gap-x-5 items-center'>
            <span className='w-[20%]'>
              <img src={card} alt="box" />
            </span>
            <p className='text-green'>Payment successful</p>
          </div>
          <div className='flex flex-row gap-x-5 items-center'>
            <span className='w-[20%]'>
              <img src={ok} alt="box" />
            </span>
            <p className='text-green'>Transaction successful</p>
          </div>
          <div className='flex flex-row gap-x-5 items-center'>
            <span className='w-[20%]'>
              <img src={truck} alt="box" />
            </span>
            <p className='text-green'>Shipped</p>
          </div>
          <div className='flex flex-row gap-x-5 items-center'>
            <span className='w-[20%]'>
              <img src={delivered} alt="box" />
            </span>
            <p className='text-gray-500'>Delivered</p>
          </div>
        </div>
        <div className='text-sm flex flex-col items-center'>
          <p>You will receive an email confirmation shortly.</p>
          <p>Thank you for your order.</p>
          <p>Please make sure to check your email for the invoice.</p>
        </div>
        <DialogActions>
          <div className='flex flex-row justify-center w-full gap-x-5 py-5'>
            <Link to='/shop'><HSButton title={"Continue shopping"} styles="bg-secondary" /></Link>
            <HSButton onClick={handleClose} title={"Ok"} styles="bg-green text-white" />
          </div>

        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export const PaymentSuccess = ({ flag }: { flag: boolean }) => {
  const [open, setOpen] = useState<boolean>(flag);
  const [orderOpen, setOrderOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOrderOpen(true);
    setOpen(!flag);
  };
  useEffect(()=>{
    setOpen(flag);
  },[flag])
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>
          <div className='flex flex-col items-center gap-y-5'>
            <img src={okbg} alt="" />
            <p className='text-xl font-bold'>Payment successful</p>
            <p className='text-sm text-gray-500'>Order #459612445598</p>
          </div>

        </DialogTitle>
        <DialogContent>
          <div className='flex flex-col items-center'>
            <p className='font-bold text-xl'>10,000 UGX</p>
          </div>
          <DialogActions>
            <div className='flex flex-row justify-center w-full gap-x-5 py-5'>
              <HSButton title={"Continue shopping"} styles="bg-secondary" />
              <HSButton title={"View order status"} onClick={handleClose} styles="bg-green text-white" />
            </div>

          </DialogActions>
        </DialogContent>
      </Dialog>
      <OrderTracking flag={orderOpen} />
    </>
  )

}

export const TransactionFail = ({ flag }: { flag: boolean }) => {
  const [open, setOpen] = useState<boolean>(flag);
  useEffect(() => {
    setOpen(flag);
  }, [flag]);
  console.log(open);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>

      <Dialog open={open} >
        <DialogTitle>
          <div className='flex flex-col items-center gap-y-5'>
            <img src={nobg} alt="" />
            <p className='text-xl font-bold'>Transaction failed</p>
            <p className='text-sm text-gray-500'>Order #459612445598</p>
          </div>

        </DialogTitle>
        <DialogContent>
          <div className='flex flex-col items-center'>
            <p className='font-bold text-xl'>10,000 UGX</p>
          </div>
          <DialogActions>
            <div className='flex flex-row justify-center w-full gap-x-5 py-5'>
              <Link to={'/shop'}><HSButton title={"Continue shopping"} styles="bg-secondary" /></Link>
              <HSButton title={"Retry"} styles="bg-green text-white" onClick={handleClose} />
            </div>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )

}

export default OrderTracking