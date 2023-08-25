import React, { useEffect, useState } from 'react';
import productsData from "../../data/data.products.json";
import "./components.products.css";
import { Route, Routes, Link } from 'react-router-dom';
import DressPage from "./../dresspage/components.dresspage";
import {db} from "./../../firebase/firebase"
import axios from "axios";

const Products = ({setSkillCoins,cartCount,cartItems,uremail,setCartCount,setCartItems,fbProducts,setFbProducts,cartClicked}) => {
  
 

    useEffect(() => {
      console.log("inside use eeffff")
      const getSkillCoins = async() => {
        try {
    
          // Send a POST request to your backend API to update user's balance
          const response = await axios.post(`http://localhost:5000/api/get/skill-coins`, { email:uremail });
    
          if(response.data.error===""){
            setSkillCoins(response.data.skillCoins)
          localStorage.setItem("skillCoins",parseInt(response.data.skillCoins))
          console.log("skill coinsssssssssnn",parseInt(response.data.skillCoins))

          }
        } catch (error) {
          console.error("Error updating payment:", error);
          console.log("An error occurred while updating payment. Please try again later.");
        }
      }

      const getCartProducts = async () => {
        try {
          const cartProductsRef = await db.collection('users').where("email","==",`${uremail}`).get();
          const docSnapshot = cartProductsRef.docs[0]; // Get the first document in the QuerySnapshot
          console.log("docsn",docSnapshot )
          const fbcp = docSnapshot.get("cartItems") 
          // const sCoins = parseInt(docSnapshot.get("skillCoins")) 
          let sum=0
          const fbcpArr = fbcp.map((el) => {
            let x=el.split(",")
            x[1]=parseInt(x[1])
            sum+=x[1]
            return x
          })
          setCartCount(sum)

          // console.log(fbcp)
          // let sum=0
          // fbcp.forEach((i) => {
          //   sum+=parseInt(i[1])
          // })
          // setCartCount(sum)
          // console.log("fbcp",typeof(fbcp),fbcp)
          
          // let splittedCt = fbcp.split(",");
          // splittedCt[1] = parseInt(splittedCt[1])
          console.log("fbcpArr",typeof(fbcpArr),fbcpArr)
          // console.log("sCoins",typeof(sCoins),sCoins)

          setCartItems(fbcpArr)
          // setSkillCoins(sCoins)
          localStorage.setItem("cartItems",JSON.stringify(cartItems))
        } catch (error) {
          console.error(error);
        }
      };
      getCartProducts()
      getSkillCoins()
      // call the getCartProducts function to retrieve all the products in the cart
      
    }
    ,[])    

    useEffect(()=>{
      const setCartProducts = async () => {
        console.log("cartItems",cartItems)
        const userRef = await db.collection('users').where("email","==",`${uremail}`).get();
        const docSnapshot = userRef.docs[0]; // Get the first document in the QuerySnapshot
        console.log(docSnapshot)
        let ci = cartItems.map((i) => {
          return [i[0],String(i[1]),i[2],String(i[3])].join(",")
        })
         docSnapshot.ref.update({ cartItems: ci })
        .then(() => {
          console.log("Cart items updated successfully"); 
        })
        .catch((error) => {
          console.error("Error updating cart items: ", error);
        });
  
      }
      setCartProducts()
    },[cartItems,uremail,cartCount])

    
  // cartClicked in whenever the count of the cartProducts changea or new cartProducts are added it updates the cartCount and cartItems
  
  
 return (
     <div className='cards-holder'>
       {
         fbProducts.map((product) => (
           <div className='card' key={product.sku}>
             <Link to={`/dresses/${product.sku}`}>
               <img src={product.image} alt={product.name}/>
               <div className='card-content'>
                 <h4>{product.name}</h4>
                 <p>{product.price}</p>
               </div>
             </Link>
             <div className='card-button'>
               <button onClick={()=>cartClicked(product.sku,product.name,product.price)}>Add to Cart</button>
               <button onClick={()=>cartClicked(product.sku,product.name,product.price,true)} >Buy Now</button>
             </div>
           </div>
         ))
       }
     </div>
  
 );
}

export default Products;
