
import React , { useEffect, useState } from "react"

import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form';
import IncDecCounter from "./incdec";

function Cart1() {

  const[posts,setPosts]=useState([]);
  const[items,setItems]=useState([]);

 

  

  useEffect(()=>{
   var mdata = localStorage.getItem("data")
    setPosts(JSON.parse(mdata))
    console.log({posts})
 })
    return (
      <div>
        <br />
        <br />
        <br />
        <br />
      <div className='container my5'>
      <div className='col-4' >
      <div className="card  text-black" style={{width:"17rem"}}>
        
      <img className="card-img-top" src={posts.img_url}  alt="Card image cap"></img>
        <div className="card-body my2">
          <h2 className="card-title">{posts.name}</h2>
          <h5 className="card-text">Rating:{posts.rating}</h5>
          <h5 className="card-text">price:{posts.price}</h5>
          <p className="card-text">{posts.description}</p>
          <p className="card-text">{posts.ve}</p>
         
          <IncDecCounter />
          </div>
            </div>
              </div>

         </div>
         <br />
        <br />
        <div className='container my5'>
        <div className='col-4' >
        <div className="card  text-black" style={{width:"17rem"}}>
                          
        <Button className="btn btn-success" >Check Out</Button>
        </div>
        </div>
        </div>
        <br />
        <br />
        <br />
        <br />
         </div>




    );
  }
  
  export default Cart1;