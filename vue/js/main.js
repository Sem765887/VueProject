let eventBus = new Vue(

)


Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>Would you recommend this product?</p>
        <input type="radio" name="review" value="yes" v-model="recomendation"/>
        <label for="review">Yes</label>
        <input type="radio" name="review" value="no" v-model="recomendation"/>
        <label for="review">No</label>
        <p>
            <input type="submit" value="Submit">
        </p>
    </form>
    
`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recomendation: null,
            errors: []
        }

    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recomendation: this.recomendation
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recomendation = null
                let counter
                localStorage.setItem('localReview', JSON.stringify(productReview));
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recomendation) this.errors.push("Recomendation required.")
            }
        }



    }
})

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
             <p v-if="inventory > 10">In stock</p>
             <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
             <p v-else :class="{ outOfStock: !inStock }"
             >Out of stock</p>
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
             <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button><br>
             <button @click="deleteProduct"">Delete</button>
         </div> 
         <product-tabs :reviews="reviews"></product-tabs>
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
                    variantQuantity: 1
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        deleteProduct() {
            this.$emit('delete-product', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        mounted() {
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview)
            })
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
        inCatr() {
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

Vue.component('product-tabs', {
    template: `
        <div>
            <ul>
                <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                >{{ tab }}</span>
            </ul>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!newReviews">There are no reviews yet.</p>
            <ul>
                <li v-for="review in newReviews">
                    <p>{{ review }}</p>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
            <product-review @review-submitted="addReview"></product-review>
        </div>
        <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }} Free</p>
        </div>
        <div v-show="selectedTab === 'Details'">
            <product-details></product-details>
        </div>
    </div>

`,
    computed: {
      newReviews() {
          return JSON.parse(localStorage.getItem('localReview'));
      }
    },

    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews',
        };
    },
    methods: {
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    }
});





let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteFromCart() {
            if (this.cart.length <= 0) {
                return this.cart.length;
            } else
                this.cart.splice(this.cart.length - 1, 1);
        },
    }
})