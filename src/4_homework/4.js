/*
* Задание №4 (*)
* Создайте класс Ball с простым интерфейсом. Создайте от 3-х классов оберток в качестве
* декораторов к классу Ball. Покажите как изменяется поведение экземпляра в каждой обертке и во
* всех обертках сразу.
* */

/*
* В задании напрямую сказано, что речь идет о декораторе.
* Тогда вспомним, то он делает?
* Во первых, он поставляет класс обертку с точно таким же интерфейсом.
* Во вторых, позволяет модифицировать исходный класс на основе его
* реализаций. */

class Coffee {
    constructor() {
        this.price = 100;
    }
}

class Milk {
    constructor(coffee) {
        this.coffee = coffee;
    }

    get price() {
        return this.coffee.price + 7;
    }
}

class Sugar {
    constructor(coffee) {
        this.coffee = coffee;
    }

    get price() {
        return this.coffee.price + 13;
    }
}

let cacao = new Coffee('cacao', 100);

cacao = new Milk(cacao);
cacao = new Milk(cacao);
cacao = new Milk(cacao);
cacao = new Sugar(cacao);

console.log(cacao.price);
