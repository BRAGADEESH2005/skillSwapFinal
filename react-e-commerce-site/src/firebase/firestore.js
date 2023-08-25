import db from "./firebase"

const getProducts = async () => {
    try {
      const productsRef = db.collection('products');
      const snapshot = await productsRef.get();
      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return products;
    } catch (error) {
      console.error(error);
    }
  };
  
  // call the getProducts function to retrieve all the products
  export  const products = await getProducts();
  