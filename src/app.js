class Product {
    constructor(id, name, imageUrl, price, promoPrice, promoStatus, reviews){
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.defaultPrice = price;
        this.promoPrice = promoPrice;
        this.promoStatus = promoStatus;
        this.reviews = reviews;
    }

    get price() {
        return (this.promoStatus) ? this.promoPrice : this.defaultPrice;
    }

    get image() {
        let url = this.imageUrl.split(".").join("-" + (this.id - 1) % 4 + ".");
        console.log(this.id);
        return "images/" + url;
    }

    toHTML() {
        let actualPrice = parseFloat(this.price).toFixed("2").toString().replace(".", ",");
        let originalPrice = parseFloat(this.defaultPrice).toFixed("2").toString().replace(".", ",");
        let priceTag = `<span class="price">R$${actualPrice}</span>`;
        if(actualPrice != originalPrice) {
            priceTag = `<span class="originalPrice">de: R$${originalPrice}</span>
                        <span class="price">por: R$${actualPrice}</span>`;
        }
        let productNode = document.createElement("div");
        productNode.classList.add("product");
        productNode.innerHTML = `<figure class="product-image">
                                    <img src="${this.image}" alt="Imagem">
                                </figure>
                                <div class="rating">${this.getReview()}</div>
                                <p class="name">${this.name}</p> ${priceTag}
                                <button class="buy-button">Comprar</button>`
        return productNode;
    }

    getReview() {
        let result = "";
        for(let i = 1; i <= 5; i++) {
            if(i <= this.reviews) result += '<img src="images/star_filled.svg"></img>'
            else result += '<img src="images/star_unfilled.svg">'
        }
        return result
    }
}

let marketplace = [];

fetch("https://m2-kenzie-shop.herokuapp.com/products")
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        for(let p in json["products"]) {
            let product = json["products"][p];
            let finalProduct = new Product(
                parseInt(product["id"]),
                product["productName"],
                product["imageUrl"], 
                product["price"]["productPrice"],
                product["price"]["productPromotionPrice"],
                product["promotionStatus"],
                product["reviews"]
            );
            marketplace.push(finalProduct);
        }
        RefreshProducts();
    });

function RefreshProducts() {
    let productsContainer = document.querySelector(".products-container");
    let lastChild = productsContainer.lastChild;
    while(lastChild) {
        productsContainer.removeChild(lastChild);
        lastChild = productsContainer.lastChild;
    }

    for(let i = 0; i < marketplace.length; i++) {
        productsContainer.appendChild(marketplace[i].toHTML());
    }
}