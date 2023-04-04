class Basket {
    constructor () {
        this.goods = []

        this.price = 0;
    }

    get totalPrice() {
        return this.price;
    }

    addGood () {
    }

    inspect () {
    }
}

const basket = new Basket

basket.addGood({
    label: 'Молоко',
    price: 120,
    count: 1
})

basket.addGood({
    label: 'Печенье',
    price: 43,
    count: 10
})

basket.addGood({
    label: 'Молоко',
    price: 120,
    count: 2
})

basket.inspect()
/*
Продукт / Количество / Общая цена
Молоко / 3 / 360
Печенье / 10 / 430
*/

console.log(basket.totalPrice) // 790
