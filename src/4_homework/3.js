/*
* Задание №3 (*)
* Организуйте класс товаров с полями price и weight. Напишите класс Composite для групировки и
* такому же просто доступу к полям price и weight для всей группировки разом. Покажите возможность
* древовидной структуры.
* */

/*
* Когда речь о древовидной структуре... Можно даже иначе:
* когда речь идет о возможности обращаться к любой сущности дерева одинаково, о каком
* паттерне идет речь? Это компоновщик.
* */

class Good {
    constructor(label, price) {
        this.label = label;
        this.priceVal = price;
    }

    get price() {
        return this.priceVal;
    }
}

class Basket {
    constructor() {
        this.products = [];
    }

    add(...item) {
        this.products.push(new Good(...item));
    }

    get price() {
        return this.products.reduce((acc, product) => acc + product.price, 0);
    }
}

const basket = new Basket();
basket.add('ЯБлоко', 26);
basket.add('ЯБлоко', 26);
basket.add('ЯБлоко', 26);
basket.add('ЯБлоко', 26);

console.log(basket.price);
