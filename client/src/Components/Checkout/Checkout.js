import React, { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import "../styles.css";
import { CheckoutIteam } from "./CheckoutItem";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EmptyCart from "./EmptyCheckout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

export const Checkout = () => {

    const navigator = useNavigate();
    const [sum, setSum] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [amount, setAmount] = useState(0);

    const checkoutIteams = useSelector((state) => state.checkout);

    useEffect(() => {
        let newSum = 0;
        let newDiscount = 0;

        for (var i = 0; i < checkoutIteams.length; i++) {
            if (checkoutIteams[i].price && checkoutIteams[i].price.mrp != null && checkoutIteams[i].price.cost != null) {
                newSum = newSum + checkoutIteams[i].price.mrp*checkoutIteams[i].quantity;
                newDiscount = newDiscount + (checkoutIteams[i].price.mrp - checkoutIteams[i].price.cost  );
            }
        }

        setSum(newSum);
        setDiscount(newDiscount);
        setAmount(newSum - newDiscount);
    }, [checkoutIteams]);

    
  async function placeOrder(){

    if(!localStorage.getItem("userName")){
        navigator("/login")
        return;
    }

        try{
            const config = {
                headers:{
                    "content-type":"application/json",
                },
            }

            const data = {
                checkoutIteams,
                username: localStorage.getItem("userName")
            }
            const response = await axios.post("http://localhost:8080/placeOrder",data,config);
            console.log(response.data.msg);
           
            navigator("/orders")
            window.location.reload();
            localStorage.removeItem("cart")
        }
        catch(e){
            console.log(`error ${e}`);
        }
    }
   
  
    return (
        <>
            {checkoutIteams.length ? (
                <Grid container className="cart-container">
                    <Grid item lg={9} md={9} sm={12} xs={12}>

                     
                        <div className="cart-header">
                            <h3>
                                Login Id:&nbsp; 
                                {(localStorage.getItem("userName")) ? (
                                    <React.Fragment>
                                        {localStorage.getItem('userName')}
                                        <CheckCircleOutlinedIcon style={{color:'green'}}/>
                                    </React.Fragment>
                                ) : null}
                            </h3>
                        </div>
                        <div className="cart-header">
                        <h3>Login Id:&nbsp;{localStorage.getItem('userName')}</h3>
                        </div>
                        <div className="cart-header">
                            <h3>Your Order Iteams&nbsp;({checkoutIteams.length})</h3>
                        </div>

                        <div className="carts-item-container">
                            {checkoutIteams.map((item) => {
                                return <CheckoutIteam item={item} key={item.id} />;
                            })}
                        </div>

                        <div className="place-order-container">
                            <Button onClick={placeOrder} style={{ textTransform: "capitalize" }} disableElevation variant="contained">
                                Place Order
                            </Button>
                        </div>
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <div className="bill-container" style={{ textAlign: "left" }}>
                            <Table>
                                <TableHead>
                                    <p> PRICE DETAILS</p>
                                </TableHead>

                                <TableRow>
                <TableCell>
                    Price (
                    {checkoutIteams.map((item) => (
                        <span key={item.id}>
                            {item.quantity} {item.quantity > 1 ? "items" : "item"}
                        </span>
                    ))}
                    )
                </TableCell>
                <TableCell>&#8377;{sum}</TableCell>
            </TableRow>

                                <TableRow>
                                    <TableCell>Discount</TableCell>
                                    <TableCell style={{ color: "green", fontWeight: "500" }}>- &#8377;{discount}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Delivery Charges</TableCell>
                                    <TableCell style={{ color: "green", fontWeight: "500" }}>FREE</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell style={{ color: "black", fontWeight: "bolder", fontSize: "16px" }}>Total Amount</TableCell>
                                    <TableCell style={{ color: "black", fontWeight: "bolder", fontSize: "16px" }}>&#8377;{amount}</TableCell>
                                </TableRow>
                            </Table>

                            <p style={{ color: "green", fontFamily: "inter", fontWeight: "500" }}>
                                You will save{" "}
                                {checkoutIteams.reduce((totalDiscount, item) => {
                                    if (item.price && item.price.mrp != null && item.price.cost != null) {
                                        return totalDiscount + (item.price.mrp - item.price.cost);
                                    }
                                    return totalDiscount;
                                }, 0)}{" "}
                                on this order
                            </p>

                        </div>
                    </Grid>
                </Grid>
            ) : (
                <EmptyCart />
            )}
        </>
    );
}

