import { DiscountOutlined, LocalShippingOutlined, PriceCheckRounded, SupportAgentRounded } from "@mui/icons-material"
import HSInputForm from "../components/form/HSInputForm"
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import { ExpandMore, AddCircleOutlineRounded } from "@mui/icons-material"
import mastercard from "../assets/checkout/mastercard.svg"
import visa from "../assets/checkout/visa.svg"
import HSButton from "../components/form/HSButton"
import { PaymentSuccess, TransactionFail } from "../components/dialog/Dialogs"
import { useEffect, useState } from "react"

const Checkout = () => {
    const [hasSuccess, setHasSuccess] = useState<boolean>(false)
    const rand = Math.floor(Math.random() * 10);
    useEffect(() => {
        setHasSuccess(hasSuccess);
    }, [hasSuccess]);
    console.log(hasSuccess);
    return (
        <>
            {
                rand%2==0?<PaymentSuccess flag={hasSuccess} />: <TransactionFail flag={hasSuccess} />}

            <div className="w-[80%] m-auto py-5">
                <div className="flex max-[634px]:flex-col flex-row justify-between items-center">
                    <div className="w-[50%] max-[330px]:w-full max-[634px]:w-full">
                        <h1 className="text-[3rem] font-bold">Complete your order</h1>
                        <p className="text-gray-500 text-lg">You are just a few step away to finish
                            your order...</p>
                        <div className="flex flex-col gap-y-4 py-5">
                            <p className="text-green">1. Choose a delivery address</p>
                            <p>2. Choose a payment method</p>
                            <p>3. Review your order</p>
                            <p>4. Place your order</p>
                        </div>
                    </div>
                    <div className="flex max-[634px]:w-full max-[330px]:flex-col flex-row justify-between gap-y-5 w-[50%] max-[330px]:w-full flex-wrap">
                        <div className="flex flex-row gap-x-4 w-[50%] max-[330px]:w-full">
                            <span className="w-fit h-fit p-2 bg-gray-200 rounded-full"><LocalShippingOutlined htmlColor="#1C4A93" /></span>
                            <div>
                                <p className="font-bold">Choose a delivery address</p>
                                <p className="text-gray-400 font-light">Free order on all orders</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-x-4 w-[50%] max-[330px]:w-full">
                            <span className=" w-fit h-fit p-2 bg-gray-200 rounded-full"><PriceCheckRounded htmlColor="#1C4A93" /></span>
                            <div>
                                <p className="font-bold">Money Return</p>
                                <p className="text-gray-400 font-light">Money return after 7 Days</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-x-4 w-[50%] max-[330px]:w-full">
                            <span className="w-fit h-fit p-2 bg-gray-200 rounded-full"><SupportAgentRounded htmlColor="#1C4A93" /></span>
                            <div>
                                <p className="font-bold">Online support 24/7</p>
                                <p className="text-gray-400 font-light">Support 24 hours a day</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-x-4 w-[50%] max-[330px]:w-full">
                            <span className="w-fit h-fit p-2 bg-gray-200 rounded-full"><DiscountOutlined htmlColor="#1C4A93" /></span>
                            <div>
                                <p className="font-bold">Member Discount</p>
                                <p className="text-gray-400 font-light">On every order over $ 20.00</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-5">
                    <div>
                        <p className="font-bold text-lg">Payment options</p>
                    </div>
                    <section id="form" className="py-5">
                        <form action="#" className="flex flex-row justify-between max-[800px]:flex-col">
                            <div className="flex flex-col gap-y-4 w-1/2 max-[800px]:w-full">
                                <div>
                                    <Accordion className="rounded-xl border-[1px]">
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <div>
                                                <p className="font-bold">Momo Payment</p>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div>
                                                <HSInputForm name="Momo payment" placeholder={"Enter your phone number"} />
                                            </div>
                                            <div className="py-5 flex flex-row  justify-center">
                                                <HSButton title="Add Momo" styles="bg-secondary w-[80%]" />
                                            </div>
                                        </AccordionDetails>

                                    </Accordion>
                                </div>
                                <div>
                                    <Accordion className="rounded-xl">
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <div>
                                                <p className="font-bold">My Cards</p>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    <p className="font-bold">Debit Cards</p>
                                                </AccordionSummary>
                                                <AccordionDetails className="flex flex-col gap-y-4">
                                                    <div className="border-[1px] rounded-xl py-2 px-4">
                                                        <label htmlFor="mastercard">
                                                            <div className="flex flex-row justify-between items-center">
                                                                <img src={mastercard} alt="mastercard" />
                                                                <span className="text-gray-500">
                                                                    Bank of Kigali
                                                                </span>
                                                                <span className="text-gray-500">
                                                                    **** **** **** **** 3456
                                                                </span>
                                                                <input type="radio" className="h-6 w-6 accent-secondary" id="mastercard" name="card" color="#1C4A93" />
                                                            </div>

                                                        </label>
                                                    </div>
                                                    <div className="border-[1px] rounded-xl py-4 px-4">
                                                        <label htmlFor="visa">
                                                            <div className="flex flex-row justify-between items-center">
                                                                <img src={visa} alt="mastercard" />
                                                                <span className="text-gray-500">
                                                                    Equity
                                                                </span>
                                                                <span className="text-gray-500">
                                                                    **** **** **** **** 9758
                                                                </span>
                                                                <input type="radio" className="h-6 w-6 accent-secondary" id="visa" name="card" color="#1C4A93" />
                                                            </div>

                                                        </label>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        </AccordionDetails>
                                        <Accordion>
                                            <AccordionSummary>
                                                <div className="flex flex-row gap-x-4 cursor-pointer">
                                                    <span>
                                                        <AddCircleOutlineRounded className="text-white p-1 rounded-full bg-secondary" />
                                                    </span>
                                                    <span className="text-secondary text-lg font-bold">Add Card</span>
                                                </div>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div className="flex flex-row items-center gap-x-4">
                                                    <label htmlFor="cardNumber" className="w-[40%]">Card Number</label>
                                                    <HSInputForm id="cardNumber" name="cardNumber" placeholder="•••• •••• ••• ••• •••• ••• •••" />
                                                </div>
                                                <div className="flex items-center flex-row gap-x-4">
                                                    <label htmlFor="expiryDate" className="w-[40%]">Expiry Date</label>
                                                    <HSInputForm type="date" id="expiryDate" name="expiryDate" placeholder="MM/YY" />
                                                </div>
                                                <div className="flex flex-row items-center gap-x-4">
                                                    <label htmlFor="cvv" className="w-[40%]">CVV</label>
                                                    <HSInputForm id="cvv" name="cvv" placeholder="•••" />
                                                </div>
                                                <div className="py-5 flex flex-row  justify-center">
                                                    <HSButton title="Add Card" styles="bg-secondary w-[80%]" />
                                                </div>
                                            </AccordionDetails>

                                        </Accordion>

                                    </Accordion>
                                </div>

                                <div className="p-4 flex flex-row gap-x-4 justify-center border-[1px] rounded-xl cursor-pointer">
                                    <span>
                                        <AddCircleOutlineRounded className="text-white p-1 rounded-full bg-secondary" />
                                    </span>
                                    <span className="text-secondary text-lg font-bold">Add Payments</span>
                                </div>

                            </div>
                            <div className="w-[45%] max-[800px]:w-full">
                                <div className="border-[1px] p-6 rounded-xl">
                                    <p className="text-xl text-gray-500">Promo code</p>
                                    <div className="flex flex-row max-[800px]:flex-col max-[800px]:gap-y-4 items-center justify-between">
                                        <span className="w-[60%] max-[800px]:w-full">
                                            <HSInputForm name="Promo code" placeholder={"Enter your promo code"} />
                                        </span>

                                        <button className="w-1/4 max-[800px]:w-full py-3 px-4 text-white bg-secondary rounded-xl"><AddCircleOutlineRounded /> &nbsp;Apply</button>
                                    </div>
                                    <div className="w-[80%] flex flex-col gap-y-5 py-6">
                                        <div className="flex flex-row justify-between">
                                            <p className="text-gray-500 font-bold">Total</p>
                                            <span className="font-bold">UGX 5000</span>
                                        </div>
                                        <div className="flex flex-row justify-between">
                                            <p className="text-gray-500 font-bold">Shipping</p>
                                            <span className="font-bold">UGX 0</span>
                                        </div>
                                        <hr />
                                        <div className="flex flex-row justify-between">
                                            <p className="text-gray-500 font-bold">Total Cost</p>
                                            <span className="font-bold">UGX 5000</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-5">

                                    <Accordion className="p-3 border-[1px] rounded-xl">
                                        <AccordionSummary>
                                            <div>
                                                <p className="font-bold text-gray-500">Shipping address</p>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="flex flex-row items-center gap-x-4">
                                                <label htmlFor="cardNumber" className="w-[40%]">Country</label>
                                                <HSInputForm id="country" name="country" placeholder="Rwanda" />
                                            </div>
                                            <div className="flex items-center flex-row gap-x-4">
                                                <label htmlFor="addressLine" className="w-[40%]">Address Line</label>
                                                <HSInputForm id="addressLine" name="addressLine" placeholder="Kigali, Nyarugenge, Nyamirambo, Biryogo" />
                                            </div>
                                            <div className="flex flex-row items-center gap-x-4">
                                                <label htmlFor="postalAddress" className="w-[40%]">Postal Address</label>
                                                <HSInputForm id="postalAddress" name="postalAddress" placeholder="Kimisagara" />
                                            </div>
                                            <div className="py-5 flex flex-row  justify-center">
                                                <HSButton title="Add Address" styles="bg-secondary w-[80%]" />
                                            </div>
                                        </AccordionDetails>

                                    </Accordion>
                                </div>
                                <div className="py-5">
                                    <HSButton onClick={() => { setHasSuccess(true)}} title="Pay Here" styles="w-full py-4 bg-secondary font-bold" />
                                </div>
                            </div>

                        </form>

                    </section>

                </div>
            </div>

        </>
    )
}

export default Checkout