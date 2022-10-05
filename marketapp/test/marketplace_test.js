const { assert } = require("chai")
const { FormControlStatic } = require("react-bootstrap")
const { default: Web3 } = require("web3")

const Marketplace = artifacts.require("./Marketplace.sol")

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Marketplace',([deployer,seller,buyer]) => {
    let marketplace

    before(async() =>{
        marketplace = await Marketplace.deployed()
    })

    describe('deployment',async() =>{
        it("deployed successfully", async() =>{
            const address = await marketplace.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)

        })
        it("has a name",async()=>{
            const name = await marketplace.name()
            assert.equal(name,"My Marketplace dapp")
        })
    })

    describe('products',async() => {
        let result,productcount
        before(async() =>{
            result = await marketplace.createProducts("i phonex",web3.utils.toWei('1','ether'),{'from':seller})
            productcount = await marketplace.productsCount()
        })

        it("creates product",async()=>{
            
            assert.equal(productcount,1)
            //console.log(result.logs)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(),productcount.toNumber(),'id is correct')
            assert.equal(event.name,'i phonex','name is correct')
            assert.equal(event.price,'1000000000000000000','price is correct')
            assert.equal(event.owner,seller,'owner is correct')
            assert.equal(event.purchased,false,'purchased is correct')

            await marketplace.createProducts('',web3.utils.toWei('1','ether'),{'from':seller}).should.be.rejected;
            await marketplace.createProducts('i phonex',0,{'from':seller}).should.be.rejected;


        })

        it("creates product",async()=>{
            const product = await marketplace.products(productcount)
            //const product = products.logs[0].args
            assert.equal(product.id.toNumber(),productcount.toNumber(),'id is correct')
            assert.equal(product.name,'i phonex','name is correct')
            assert.equal(product.price,'1000000000000000000','price is correct')
            assert.equal(product.owner,seller,'owner is correct')
            assert.equal(product.purchased,false,'purchased is correct')

        })

        it("buy products",async()=>{
            let oldSellerbalance = await web3.eth.getBalance(seller)
            oldSellerbalance = new web3.utils.BN(oldSellerbalance)
             
            const products = await marketplace.purchaseProducts(productcount,{from:buyer,value: web3.utils.toWei('1','Ether')})
            //console.log(products.logs)
            const product = products.logs[0].args
            assert.equal(product.id.toNumber(),productcount.toNumber(),'id is correct')
            assert.equal(product.name,'i phonex','name is correct')
            assert.equal(product.price,'1000000000000000000','price is correct')
            assert.equal(product.owner,buyer,'owner is correct')
            assert.equal(product.purchased,true,'purchased is correct')
            
            let newSellerbalance = await web3.eth.getBalance(seller)
            newSellerbalance = new web3.utils.BN(newSellerbalance)

            let price = web3.utils.toWei('1','Ether')
            price = new web3.utils.BN(price)

            const expectedPrice = oldSellerbalance.add(price)

            assert.equal(newSellerbalance.toString(),expectedPrice.toString())

             // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
      await marketplace.purchaseProducts(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
      // FAILURE: Buyer tries to buy without enough ether
      await marketplace.purchaseProducts(productcount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
      // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
      await marketplace.purchaseProducts(productcount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
      // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
      await marketplace.purchaseProducts(productcount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
        })
    
    })

})