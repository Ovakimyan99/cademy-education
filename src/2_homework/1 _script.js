// ЗАДАЧИ

/* Задание №1
* Перепишите класс в классическом вид.
  const AnimalPrototype = {
        letVoice () {
            console.log(`${this.name} говорит ${this.voice}! ${this.type} очень милый.`)
        }
    }

    function Animal (type, voice, name) {
        return {
            type,
            name,
            voice,
            __proto__: AnimalPrototype
        }
    }

    const animal = Animal('кот', 'мяу', 'Мурзик')
    animal.letVoice()
*/

/*
* function Animal(type, voice, name) {
    this.type = type;
    this.voice = voice;
    this.name = name;
* }
*
* Animal.prototype.letVoice = function() {}
* */

class Animal {
    constructor(type, voice, name) {
        this.type = type;
        this.voice = voice;
        this.name = name;
    }

    letVoice () {
        console.log(`${this.name} говорит ${this.voice}! ${this.type} очень милый.`)
    }
}

class Dog extends Animal {
    constructor(name) {
        super('dog', 'gav', name);
    }
}

class Cat extends Animal {
    constructor(name) {
        super('dog', 'gav', name);
    }
}

class Manager {
    constructor() {
        this.counter = 0;
    }

    static create(...args) {
        return new Manager(...args);
    }

    init(num) {
        this.counter = num;
        return this;
    }

    log() {
        console.log(this.counter);
        return this;
    }

    add(num) {
        this.counter += num;
        return this;
    }

    multi(ex) {
        this.counter *= ex;
        return this;
    }
}

Manager.create()
    .init(5)
    .log() // 5
    .add(100)
    .log() // 105
    .multi(1.5)
    .log() // 157,5
    .init(10)
    .log() // 10
    .add(113)
    .log() // 321



