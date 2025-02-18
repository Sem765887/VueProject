Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
         <div class="product-image">
             <img :src="image" :alt="altText"/>
         </div>
         <div class="product-info">
             <h1>{{ title }}
                 <span v-show="onSale" class="on-sale"> ON SALE</span>
             </h1>
             <p>{{ description }}</p>
             <product-details></product-details>
             <p v-if="inventory > 10">In stock</p>
             <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
             <p v-else :class="{ outOfStock: !inStock }"
             >Out of stock</p>
             <p>Shipping: {{ shipping }}</p>
             <a :href="link"> More products like this</a>
             <div class="color-box"
                 v-for="(variant, index) in variants"
                 :key="variant.variantId"
                 :style="{ backgroundColor:variant.variantColor }"
                 @mouseover="updateProduct(index)"
             >
             </div>
             <p>Sizes: </p>
             <span v-for="size in sizes"> {{ size }}</span><br>
             <div class="cart">
                 <p>Cart({{ cart }})</p>
                 <button id="delete-button" @click="deleteFromCart">Delete from cart</button>
             </div>
             <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button><br>
         </div>
     </div>
`,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 0,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        deleteFromCart() {
            if (this.cart <= 0) {
                return this.cart;
            } else
                this.cart -= 1
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        onSale() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }
})

Vue.component('product-details', {
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
`,
    data() {
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})