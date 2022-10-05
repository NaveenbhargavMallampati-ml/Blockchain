// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.5.0;

// cd users\vasav\blockchain_development\marketapp
// truffle test


contract  Marketplace {


    string public name;
    mapping (uint => Product) public products;
    uint public productsCount = 0;


    struct Product {
        uint id;
        string name;
        address payable owner;
        uint price;
        bool purchased;        
    }

    event productCreated(
        uint id,
        string name,
        address payable owner,
        uint price,
        bool purchased
    );
    event productPurchased(
        uint id,
        string name,
        address payable owner,
        uint price,
        bool purchased
    );

    constructor() public {
        name = "My Marketplace dapp";
    }

    function  createProducts(string memory _name,uint _price) public {
        require(bytes(_name).length > 0);
        require(_price > 0);

        productsCount = productsCount +1 ;
        products[productsCount] = Product(productsCount,_name,msg.sender,_price,false);
        emit productCreated(productsCount,_name,msg.sender,_price,false);
    }

    function purchaseProducts(uint _id) public payable{

       

        Product memory _product = products[_id];
        address payable mowner = _product.owner;

         require(_id > 0 && _id <= productsCount);
        require(msg.value >= _product.price);
        require(mowner != msg.sender);
        require(!_product.purchased);

        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;
        address(mowner).transfer(msg.value);

        emit productPurchased(productsCount,_product.name,msg.sender,_product.price,true);


    }
}