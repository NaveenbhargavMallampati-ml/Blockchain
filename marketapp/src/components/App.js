import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import detectEthereumProvider from '@metamask/detect-provider';
import Marketplace from '../abis/Marketplace.json'
import './App.css';
import Navbar from './navbar';
import Main from './Main';

class App extends Component {

  async componentDidMount()
  {
     await this.loadWeb3();
     await this.loadAccounts();

     console.log(window.web3);
  }

  async loadWeb3() 
  {



      const provider = await detectEthereumProvider()
      
      if (provider) {
        console.log('Ethereum successfully detected!')
        // From now on, this should always be true:
        // provider === window.ethereum
      
        // Access the decentralized web!
      
        // Legacy providers may only have ethereum.sendAsync
        const chainId = await provider.request({
          method: 'eth_chainId'
        })
      } else {
        // if the provider is not detected, detectEthereumProvider resolves to null
        console.error('Please install MetaMask!' )
      }

      const abi = Marketplace.abi
      
      
     const web3 = new Web3(provider)
     const id = await web3.eth.net.getId()
     const mynetwork = Marketplace.networks[id]
     if(mynetwork)
     {
      const mymarketplace = web3.eth.Contract(abi,mynetwork.address)
      const count = await mymarketplace.methods.productsCount().call()
      this.setState({count})
      this.setState({mymarketplace});
      this.setState({loading : false})
      for(var i=1;i<=count;i++)
      {
        const product = await mymarketplace.methods.products(i).call()
        this.setState({
          products : [...this.state.products,product]
        })
      }
      console.log(this.state.products)

     }
     else
     {
       window.alert("please change to the gnanche network")
     }
     //const address = Marketplace.networks[id].address
     
   

      console.log(abi)
     
      }

  async loadAccounts()
  {
    // //var web3 = require('web3')
    // var web3 = window.web3;

    // const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  console.log(accounts);
  this.setState({
    'account': accounts[0],
   
    
  });
  }

  createProducts(name,price)
  {
    this.setState({loading : true})
    this.state.mymarketplace.methods.createProducts(name,price).send({from :this.state.account})
    .once('recipt',(recipt) => {
      this.setState({loading : false})
    })
  }

  buyProducts(id,price)
  {
    this.setState({loading : true})
    this.state.mymarketplace.methods.purchaseProducts(id).send({from :this.state.account,value:price})
    .once('recipt',(recipt) => {
      this.setState({loading : false})
    })
  }

  constructor(props)
  {
    super(props);
    this.state = {
      'account':'',
      'loading':true,
      'productCount':0,
      'products':[],
    }
    this.createProduct = this.createProducts.bind(this)
    this.purchaseProducts = this.buyProducts.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className='container-fluid mt-5'>
          <div className='row'>
          <main role='main' className='col-lg-12 d-flex'>
          { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main 
                products={this.state.products}
                 createProduct={this.createProduct}
                 buyProducts = {this.purchaseProducts}/>}
          </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
