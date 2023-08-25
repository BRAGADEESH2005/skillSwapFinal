import "./components.dresspage.css";
import { useParams ,Link} from 'react-router-dom';


function DressPage({fbProducts,cartClicked}) {
 const { dressSku } = useParams();
 // Use the dressId to fetch data for the individual dress
 // Render the individual dress data
 var dressDetails = undefined
 for (let i in fbProducts){
    // console.log("fb.p.sku",fbProducts[i].sku)
    // console.log("item[0]",item)
 
      if (fbProducts[i].sku=== dressSku){
         dressDetails = fbProducts[i]
        break
      }
    
  }
 return ((dressDetails&&
    <div className="dress-details">
  <img className="dress-image" src={dressDetails.image} alt="" />
  <h1 className="dress-name">{dressDetails.name}</h1>
  <p className="dress-price">Price: ${dressDetails.price}</p>
  <p className="dress-description">{dressDetails.description}</p>
        <button onClick={()=>cartClicked(dressDetails.sku,dressDetails.name,dressDetails.price)}>Add to Cart</button>
        <Link to="/checkout"><button>Buy Now</button></Link>
   
</div>
)
    

 );
}

export default DressPage;
