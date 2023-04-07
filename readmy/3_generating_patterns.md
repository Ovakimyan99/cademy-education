#### Порождающие паттерны
Как я понял, порождающие паттерны - это механики, от которых мы наследуемся и получаем какую-то
концептуальную возможность.

Например, в уроке 2 мы реализовали Singleton. Благодаря этому мы можем ссылаться на 1 единственный
instance класса.

Что говорит википедия?
Порождающие паттерны - это шаблоны проектирования, которые имеют дело с процессом создания объектов.
Они позволяют сделать систему независимой от способа создания, композиции и представления объектов.

Теперь к тому, какие порождающие паттерны есть:

1. Factory / Фактория / Фабрика
2. Factory Method / Фабричный метод
3. Abstract Factory / Абстрактная фабрика
4. Builder / Строитель
5. Singleton / Одиночка
6. Prototype / Прототип

### Factory
Давайте создам класс Person со статическим методом, который позволит создавать новый экземпляр.

```
class Person {
    constructor(person) {
        this.person = person;
    }
    
    static create(...args) {
        return new Person(...args);
    }
}

const factory = {
    create(args) {
        return new Person(...args);
    }
}
```
Благодаря этому у нас есть возможность 3 способами создать экземпляр.

```
// Классический способ - прямой вызов конструктора
const person1 = new Person({name: 'Tiko', age: 27});
```

```
// Фабричный способ
const person2 = Person.create({name: 'Tiko', age: 27});
const person3 = factory.create({name: 'Tiko', age: 27});
```

И вся суть фабричного (Factory) паттерна в том, что мы для создания экземпляра класса используем
методы создания, а не оператор new. Это полезно и используется с цепным стилем программирования.

```
Counter
    .init(5)
    .add()
    .log()
    .multi(3)
    .add()
```

---
### Factory Method / Фабричный метод
Основная задача - это делегировать создания экземпляра другим классам, которые будут определены
в будущем.

Или более емкое определение:
Фабричный метод делегирует логику создания экземпляров дочерним классам.

На примере давайте разберем:
```
// Первый метод запрашивает экзмепляр у декларативного метода takePatient
class Healer {
    trearAPatient() {
        const patient = this.takePatient();
        patient.recover();
    }
    
    takePatient() {
        throw Error('Abstract method "takePatient" was called');
    }
}

// Определим сущности и их методы по-одному интерфейсу
class Human() {
    recover() {
        console.log('Теперь я здоров, как бык')
    }
}

class Animal() {
    recover() {
        console.log('Лает и виляет хвостиком. Мило')
    }
}

// А теперь давайте создадим сущности, которые будут создавать экземпляры
class Doctor extends Healer {
    takePatient() {
        return new Human();
    }
} 

class Veterinarian extends Healer {
    takePatient() {
        return new Animal();
    }
}

const doctor = new Doctor;
const veterinarian = new Veterinarian;

doctor.treatAPatient() // Теперь я здоров, как бык
veterinarian.treatAPatient() // Лает и виляет хвостиком. Мило
```

Паттерн "Фабричный метод" используется, если логика работы с разными сущностями похожи, но тип
сущности будет выявлен только во время работы с кодом.

Если по-простому, то фабричный метод нам говорит: "тебе в будущем понадобится кое то, но реализация
будет зависеть от дочернего класса".

### Абстрактная фабрика
Представьте, что есть 2 класса, которые имеют одинаковые методы, но различную реализацию. И был бы
резон условный сделать 1 класс, с которого они бы наследовались. Так вот, Абстрактная фабрика нам
говорит о том, что не надо создавать этот самый класс. Сделай ИНТЕРФЕЙС, которого нет в JS, и реализуй
эти классы.

Вот коротко и по делу:
Предоставляет интерфейс для создания связанных или зависимых объектов, не указывая их конкретный класс. 

Рассмотрим пример:
```
class Candy {}
class Soda {}
class Barbecue {}
class Wine {}

class ChildrensHolidayFactory {
    makeFood() { return new Candy; }
    
    makeDrink() { return new Soda; }
}

class AdultsHolidayFactory {
    makeFood() { return new Barbecue; }
    
    makeDrink() { return new Wine; }
}
```
Фактически вот 2 класса, которые имеют одинаковый интерфейс и не наследуются от другого класса.

Вызовем оба класса:
```
function makeHolidayFun (food, drink) {}

{
    const factory = new ChildrensHolidayFactory();
    const food = factory.makeFood();
    const drink = factory.makeDrink();
    
    makeHolidayFun(food, drink);
}

{
    const factory = new AdultsHolidayFactory();
    const food = factory.makeFood();
    const drink = factory.makeDrink();
    
    makeHolidayFun(food, drink);
}
```
Обратите внимание на `{}`. Если бы мы это запустили в компиляторе, что произошло бы?
Ответ: код нормально отработал бы. Мы фактически создаем "поле работы" со своей областью видимости.
Тк у factory у нас находится в блочной области видимости, то за его пределами у нас не возникает проблем
с пространством имен.

---
### Builder / Строитель
Предположим, что у нас есть конструктор, который принимает в себя очень-очень много аргументов.
Я бы не хотел запоминать последовать всех 6 аргументов, которые надо передавать. Это преступление против
народа. Почему бы не сделать методы под каждый из свойств, чтобы путем вызова метода определять значение
поля? Так у нас становится все декларативнее, удобнее

Вот определение:
Разделяет создание сложного объекта и инициализации его состояния так, что одинаковый процесс построения
может создать объекты с разными состоянием.

Рассмотрим пример:
```
// Вот так можно было бы сделать, да?
class Airplane {
    // Я считать офигею... А тут еще и передавать
    constructor(length, widht, height, carryingCapacity, speed, capacity, type, autopilot, color,
     streamliningRatio) {
        this.length = length
		this.widht = widht
		this.height = height
		this.carryingCapacity = carryingCapacity
		this.speed = speed
		this.capacity = capacity
		this.type = type
		this.autopilot = autopilot
		this.color = color
		this.streamliningRatio = streamliningRatio
    }
}
```
А теперь рассмотрим реализацию с применением паттерна билдер:
```
class AirplaneBuilder {
    constructor() {
        // Можно указать значения по дефолту
        this.length = null;
		this.widht = null;
		this.height = null;
		this.carryingCapacity = null;
		this.speed = null;
		this.capacity = null;
		this.type = null;
		this.autopilot = null;
		this.color = null;
		this.streamliningRatio = null;
    }
    
    setLength(arg) {
        this.length = arg;
        return this;
    }
    
    /* Определяем прочие методы */
}
```
Теперь мы можем в цепном стиле вызывать эти методы и определять поля. Круто, но кое чего
здесь не хватает... Вернемся к определению. Вот мы обозначили все эти свойства и поля, но может
мы хотим с этими свойствами получить экземпляр Airplane? То есть благодаря AirplaneBuilder мы очень
по-человечески обозначаем в удобной нам последовательности св-ва, а потом благодаря Airplane классу
создаем экземпляр. Поэтому в AirplaneBuild мы добавим следующий метод:

```
getAirplane() {
    return new Airplane(
        this.length,
        this.widht,
        this.height,
        this.carryingCapacity,
        this.speed,
        this.capacity,
        this.type,
        this.autopilot,
        this.color,
        this.streamliningRatio
    )
}
```

Теперь сравним:
```
// Без паттерна билдер
{
const airplane = new Airplane(120, 35, 10, 230, 500, 12, 'passenger', true, 'black', 1.3)
}

// С паттерном Билдер
{
const airplanebulder = new AirplaneBuilder;
const airplane = airplanebulder.
    .setWidth(12)
    .setLength(2)
    .setHeight(43)
    ...
    .setColor('green')
    .getAirplane()
}
```

---
### Singleton
Этот паттерн нам говорит о том, что экземпляр класса должен быть один.
И реализации у нас может быть 2:
1. Версия ES6
2. Браузерная

Рассмотрим их и подумаем, что уже мы знаем реализованное этим паттерном, плюс где это мы можем использовать
#### Версия ES6

```
let instance = null;

export class Singleton {
    constructor() {
        if (instance) {
            return instance;
        }
        
        /* Действия с this */
        
        instance = this; 
    }
}
```
Почему это реализация по версии ES6? Потому что мы используем import / export.
Переменная `instance` остается изолированной благодаря скоупу модулей.

#### Браузерная
```
;(function() {
    let instance = null;

    class Singleton {
        constructor() {
            if (instance) {
                return instance;
            }
            
            /* Действия с this */
            
            instance = this; 
        }
    }
    
    // Не забываем вынести в глобальную область видимости
    window.Singleton = Singleton;
})();
```

Где это реализовано? Например, объекты window, document.
Где это можно еще реализовать? Например, корзина пользователя.

---
### Prototype / Прототип
Суть этого паттерна в том, чтобы создать метод clone, для того чтобы иметь возможность от экземпляра
создать клон, новый экземпляр действующего экземпляра))

Почему мы можем этого хотеть? Может потому что у нас может не быть доступа к исходному классу.  

Пример:
```
class Person {
    constructor (name, family) {
		this.name = name;
		this.family = family;
	}

	add (n = 0) {
		this.counter += n
	}

	clone () {
		return new Pesron(this.name, this.family);
	}
}

const manager1 = new Manager

manager1.add(100500)
console.log(manager1)

const manager2 = manager1.clone()
console.log(manager2)
```

После этого у второго экземпляра будет совершенно новый, свой, но с теми же данными экземпляр

---
Собственно, это все по порождающим паттернам. Но у нас есть бонусный материал. Во втором уроке я сказал,
что мы поговорим, как костыльным путем создать приватные поля у классов, используя Symbol и WeakMap.

Шикарный далее материал, благодаря которому вы, вероятно, впервые примените Symbol.
Это важно, потому что мы должны помнить о том, что в JS есть только публичные поля и методы.

Что важно знать о `Symbol`?
1. Symbol(`${value}`) !== Symbol(`${value}`)
2. Любой Symbol уникальный

Хорошо. Как это можно использовать, чтобы сделать приватное поле, к которому мы не сможем получить
доступ?

Рассмотрим пример:
```
index.js

const symbolAge = Symbol('age');

module.export = class Pesron {
    constructor(name, family, age) {
        this.name = name; // public
        this.family = family; // public
        
        this[symbolAge] = age; // private
    }
}
```

Что произошло? Классическим способом мы создали поля `name` и `family`, которые являются публичными.
То есть мы можем их получить, если сделаем там:
```
const person1 = new Person('name', 'family', 12);
person1.name
```

А что насчет age?
Как обратиться к этому полю?
```
person1.age // undefuned
person1[Symbol('age')] // не сработает, тк Symbol('age') !== Symbol('age')
```

И в сухом остатке у нас нет возможности влиять на поле age. Только если мы будем это делать в классе
Person и работать в том файле, где объявлен symbolAge.

У этого есть одно "но": что мы увидим, если выведем в консоль `Person`?
```
Person { name: 'name', family: 'family', [Symbol(age)]: 12 }
```
Получается так, что мы знаем об этом поле, но не можем к нему обратиться. А что если мы хотим, чтобы
его не было даже видно?

Можно в файле создать структуру данных, не объявлять ее в this и просто обращаться к ней в файле.
Например:

```
index.js

const colleaction = new WeakMap();

module.export = class Pesron {
    constructor(name, family, age) {
        this.name = name; // public
        this.family = family; // public
        
        colleaction.set(this, {
            age
        })
    }
    
    getting() {
        const privite = colleaction.get('age');
        //...
    }
}
```

По итогу мы можем использовать данные, к ним нет доступа извне.
