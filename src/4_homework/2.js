/*
* Задание №2 (*)
* Напишите несколько классов мостов к главному классу Shop: Good, Client, Room.
* */

/*
* Сначала вспомним, что такое мост.
* Мост - это паттерн, который декомпозирует структуру на отдельные независимые сущности.
* */

class Good {
    constructor(label, price) {
        this.label = label;
        this.price = price;
    }
}

class Client {
    constructor() {
    }
}

class Room {}

class Shop {
    constructor(user) {
        this.user = user;
        this.client = new Client();
        this.room = new Room();
    }
}
