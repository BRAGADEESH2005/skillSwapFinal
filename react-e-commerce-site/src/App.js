import { useEffect, useState } from 'react';
import './App.css';
import Navbar from "./componenets/navbar/components.navber"
import Products from "./componenets/products/components.products"
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import DressPage from './componenets/dresspage/components.dresspage';
import Checkout from "./componenets/checkout/components.checkout";
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Ordered from './componenets/ordered/components.ordered';
import { db } from './firebase/firebase';
import PrivateRoutes from "./utils/privateRoutes"


function App() {
  const [cartCount,setCartCount] = useState(0);
  const [cartItems,setCartItems] = useState([]);
  const [totalPrice,setTotalPrice] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState("null");
  const [uremail, seturEmail] = useState("null");
  const [fbProducts,setFbProducts] = useState([])
  const [orderedItems,setOrderedItems] = useState([]);
  const [skillCoins,setSkillCoins] = useState(0);
  // const navi = useNavigate()

  useEffect(() => {
    if(localStorage.getItem("email")!=null){
      seturEmail(localStorage.getItem("email"))
      setUid(localStorage.getItem("uid"))
      setIsLoggedIn(true)
      if(JSON.parse(localStorage.getItem("cartItems"))){
        setCartItems(JSON.parse(localStorage.getItem("cartItems")))
        let sum =0
        JSON.parse(localStorage.getItem("cartItems")).forEach((el) => {
          sum+=parseInt(el[1])
        })
        setCartCount(sum)
        console.log("ls",JSON.parse(localStorage.getItem("cartItems")))
      }
      if(JSON.parse(localStorage.getItem("orderedItems"))){
        setOrderedItems(JSON.parse(localStorage.getItem("orderedItems")))
      }
      if(parseInt(localStorage.getItem("skillCoins")) !==0){
        console.log(skillCoins,typeof(skillCoins))
        setSkillCoins(parseInt(localStorage.getItem("skillCoins")))

      }

      
    }

    // getProducts get the products in the firestore and sets it to fbProducts
    const getProducts = async () => {
      console.log("in get products")
      try {
        const productsRef = db.collection('products');
        const snapshot = await productsRef.get();
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log("in fb products0",fbProducts)
        setFbProducts(products)
      } catch (error) {
        console.log("eroorrrrrrrr")
        console.error(error);
      }
    };
    getProducts()
    
    // call the getProducts function to retrieve all the products
   
  },[])

  const cartClicked = (sku,name,price,redirectToCheckout=false) => {
    console.log("clicssked")
    setCartCount((prev) => prev + 1);
    setCartItems((prev) => {
      const updatedItems = [...prev];
      let isPresent = false;
      for (let i in updatedItems) {
        if (updatedItems[i].includes(sku)) {
          isPresent = true;
          updatedItems[i][1] += 0.5;
        }
      }
      if (!isPresent) {
        updatedItems.push([sku, 1,name,price]);
      }
      console.log(updatedItems)
      console.log("upitems",typeof(updatedItems))
      return updatedItems;
    });
    localStorage.setItem("cartItems",JSON.stringify(cartItems))
    if (redirectToCheckout){
      // navi("/checkout");
    }
  };

  return (
    <Router>    
      <div className="App">
        {isLoggedIn && <Navbar skillCoins={skillCoins} cartCount={cartCount} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>}
        <Routes>
         

            <Route element={<PrivateRoutes condition={!isLoggedIn} redirectTo="/"/>}>
            <Route path='/login' element={<Login setSkillCoins={setSkillCoins} setIsLoggedIn={setIsLoggedIn} uid={uid} seturEmail={seturEmail} setUid={setUid} />} />
            <Route path='/signup' element={<Signup setSkillCoins={setSkillCoins} setIsLoggedIn={setIsLoggedIn} uid={uid} seturEmail={seturEmail} setUid={setUid} />} />
            </Route>

          
          <Route element={<PrivateRoutes condition={isLoggedIn} redirectTo="/login"/>}>
            <Route path="/" index exact element={<Products setSkillCoins={setSkillCoins} cartClicked={cartClicked} cartItems={cartItems} cartCount={cartCount} uremail={uremail} fbProducts={fbProducts} setFbProducts={setFbProducts} setCartCount={setCartCount} setCartItems={setCartItems} />} />
            <Route path="/dresses/:dressSku" exact element={<DressPage cartClicked={cartClicked} fbProducts={fbProducts} />} />
            <Route path="/checkout" exact element={<Checkout skillCoins={skillCoins} setSkillCoins={setSkillCoins} fbProducts={fbProducts} orderedItems={orderedItems} setOrderedItems={setOrderedItems} uremail={uremail}  cartCount={cartCount} setCartCount={setCartCount} cartItems={cartItems} setCartItems={setCartItems} totalPrice={totalPrice} setTotalPrice={setTotalPrice} />} />
            <Route path="/ordered" exact element={<Ordered  cartItems={cartItems} fbProducts={fbProducts} orderedItems={orderedItems}/>} />
          </Route>
        </Routes>
        

      </div>
    </Router>
  );
}

export default App;