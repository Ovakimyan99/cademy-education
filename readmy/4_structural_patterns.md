Структурные паттерны
- Adapter / Адаптер
- Bridge / Мост
- Composite / Компоновщик
- Decorator / Декоратор
- Facade / Фасад
- Flyweight / Приспособленец / Легковес
- Proxy / Прокси / Заместитель

И прежде чем перейдем к структурным паттернам, следует озадачиться одним вопросом:
чем отличаются структурные паттерны от порождающих?

Порождающие, даже из названия, призваны создавать новые классы, объекты.
Например,
- Factory создает через статический метод новый экземпляр.
- Синглтон создает и фиксирует наличие одного экземпляра.
- Билдер создает новый экземпляр, при этом сначала обработав его

А структурные паттерны решают вопросы о том, как из классов и объектов образовать более крупные структуры.

### Adapter / Адаптер
Паттерн адаптер позволяет "адаптировать", подстроить благодаря wrapper (классу-обертке) 
создать класс с нужными полями и методами без необходимости менять их названия. Просто
дополнительная прослойка.

По определению:
Конвертирует интерфейс класса в другой интерфейс, ожидаемый клиентом. Позволяет классам с
разными интерфейсами работать вместе.

Вторая часть определения станет яснее на примере:
```
class Databse {
    constructor() {
        this.users = [];
    }

    static create(...args) {
        return new Database(...args);
    }

    saveNewUserData(user) {
        this.users.push(
            JSON.parse(JSON.stringify(user))
        );
    }

    findOneUserByOwnId(userId) {
        return this.users.find(user => user.id === userId);
    }
}
```
Мы видим класс, где применен порождающий паттерн builder.
У него есть дополнительно 2 метода. Вот тут может возникнуть вопрос о бизнес логике.
Сегодня храним данные на локалке, а затвра просят сделать это на сервере. Представьте,
что у вас 1000 строк, где это уже используется. Идти и менять везде на нвоые методы?
- нет.

На помощь придет структурный паттерн Adapter. Сделайте через адаптер необходимый интерфейс
по методам старого класса.
```
class Adapter {
    constructor(db) {
        this.db = db;
    }
    
    add(user) {
        this.db.saveNewUserData(user);
    }
    
    find(id) {
        return this.db.findOneUserByOwnId(id);
    }
}
```
Посмотрите на этот класс. Что мы видим? Мы принимаем в конструктор первым аргументом класс. В самом
классе Adapter фактически реализовываем те же методы, но под новым интерфейсом.

```
const db = new Adapter(Databse.create());

db.add({
    id: 1,
    name: 'Tiko'
})

console.log(db.find(1)) // { id: 1, name: 'Tiko' }
```


### Bridge / Мост
Представьте, что есть класс, который сильно разрастается и становится очень
абстрактным. Вот возьмем человека. Мы можем записать его имя, фамилию и при этом
мы хотим описать его возможности функций речи. Ты никогда не задумывался вынести
все методы связанные с функциями речи в отдельный класс? И реализовать класс
Person иначе.

Сам паттерн Мост говорит нам о том, что мы можем разделять 1 абстракцию так, чтобы
они могли изменяться независимо. Даже на нашем примере. Функция говорения может
спокойно жить себе, как отдельная сущность и не зависеть ни от имени, ни от чего.

Сначала первый вариант без паттерна:
```
class Person {
    constructor(name, family) {
        this.name = name;
        this.family = family;
    }
    
    greeting() {
        console.log('Привет соплеменники!');
    }
    
    sayHip() {
        console.log('Хип!')
    }
    
    sayHop() {
        console.log('Хоп!')
    }
}
```

А теперь давайте применим паттерн `Bridge` - мост.
Первым делом перепишем класс `Person`:

```
class Person {
    constructor(name, family) {
        this.name = name;
        this.family = family;
        
        this.speaker = new Speaker(this);
    }
}
```
И давайте как раз разделим логику так, чтобы они были независимы. Вы уже
могли заметить `this.speaker = new Speaker();`

```
class Speaker {
    constructor(person) {
        this.user = person;
    }    
    
    greeting() {
        console.log(`Привет соплеменник ${this.user.name}!`);
    }
    
    sayHip() {
        console.log('Хип!')
    }

    sayHop() {
        console.log('Хоп!')
    }
}
```

Теперь благодаря этому мы можем сделать так:

```
cons user = new Person('Tigo', 'Migo');
user.speaker.greeting();
```

Мы обратились к речевому аппарату пользователя к его методу приветствия.

А как сделать экземпляр, где человек не может говорить? Это означает точно
такой же пользователь, класс, но без поля `speaker`;

```
class Dumb extend Person {
    constructor(...args) {
        super(...args);
        
        delete this.speaker;
    }
}
```
Паттерн мост распределил нагрузку между классами.
Обеспечивает отличную модульность.

### Composite / Компоновщик
Этот паттерн отвечает за такую реализацию, что мы можем создавать древовидную
структуру и обращаться к каждому его элементу одинаково и получать нужную
информацию.

Например, есть корзина с продуктами и есть каждый продукт по отдельности.
Цена есть у всей корзины и у каждого продукта. Давайте сделаем такую реализацию,
чтобы ко всему можно было обращаться одинаково.

```
// Продукт. Любой
class Good {
    constructor(label, price) {
        this.label = label;
        this.price = price;
    }
}

class Composite {
    constructor() {
        this.products = [];
    }
    
    // product instanceof Good
    add(product) {
        this.products.push(product)
    }
    
    get price() {
        return this.products.reduce((acc, {price}) => acc + price, 0);
    }
}
```
Посмотрите, мы создали класс `продукт` и `корзина`. У каждого есть метод / свойство
price, по которому мы можем получить цену. Давайте заполним корзину продуктами.

```
const apple = new Good('Яблоко', 100);
const apple2 = new Good('Яблоко2', 10);
const apple3 = new Good('Молоко', 500);

const cart = new Composite();
cart.add(apple)
cart.add(apple2)
cart.add(apple3)

// Узнаем цену суммы продуктов корзины
console.log(cart.price)
// Узнаем цену каждого продукта
apple.price;
apple2.price;
apple3.price;
```

Черт, а что если в один Composite добавить другой Composite?
Он должен посчитать его тоже!

Мы передадим в список элементов корзину, у которого мы вызовем геттер price,
получим его цену и проссумируем с другими товарами. Очень круто!

### Decorator / Декоратор
Какие возможности предоставляет паттерн декоратор?
Он позволяет динамически предоставлять объекту дополнительные возможности.
Также это гибкая альтернатива наследованию для расширения функциональности.

Когда мы используем декоратор мы немного изменяем, либо дополняем функционал того
объекта, которого мы передали в качестве аргумента конструктору.

Давайте рассмотрим пример. Возьмем персону, у которого будет метод с выводом в
консоль сообщения.

```
class Person {
    constructor(name = "Тико") {
        this.name = name;
    }
    
    greeting() {
        return `Приветствую тебя, ${this.name}.`;
    }
}
```
И также создадим еще 2 класса, которые будут работать с этим методом, как
врапперы.

```
class Arab {
    constructor(person) {
        this.person = person;
    }
    
    // Переворачивает соимволы
    greeting() {
        return this.person.greeting().split('').reverse().join('');
    }
}

class Evil {
    constructor(person) {
        this.person = person;
    }

    // Переворачивает соимволы
    greeting() {
        return this.person.greeting().toUpperCase().replace(/\./g, '!');
    }
}
```
Вы обратили внимание на то, как мы создавали эти классы? Мы передавали в конструктор
первым аргументом класс `Person`. Дальше мы работаем непосредственно с этим классом
и что мы делаем? Мы создаем те же методы по интерфейсу `Person` и как-то модицируем их
на основе первой реализации.

Кто в состоянии определить проблему сходу?
Это интерфейс. Если мы передаем аргументом в класс враппер и внутри расширяем исходную
функциональность, то при добавлении любых методов в класс Person, мы должны их, как минимум,
скопировать еще и в классы врапперы. Это минус этого подхода. Еще есть вариант наследоваться.
Поэтому между ними следует выбирать. Если классы небольшие, то можно враппером. Если большие,
то можно наследование.

Вот пример использования (очень классный)

```
let person = new Person();

person = new Evil(person);
person.greeting(); // 'ПРИВЕТСТВУЮ ТЕБЯ, ТИКО!'

person = new Arab(); // !ОКИТ ,ЯБЕТ ЮУВТСТЕВИРП
person.greeting();
```

### Facade / Фасад
Фасад это паттерн, который фактически "весь удар берет на себя".
Возьмем озон, у которого очень и очень много функций и сущностей. Например, работа
с корзиной, доставкой. Они между собой связаны идейно, но как это должно отражаться
на работу пользователя?

Пользовать хочет только добавить товар в корзину и купить:
```
const webshop = new Amazon('Петр', 'Круглович', 27);
webshop.add('Ручка', 7)
webshop.add('Арбуз', 17)
webshop.add('дыня', 3)

basket.buy()
```

Но что происходит за кадром? Сначала мы должны создать пользователя, создать товары, добавить
в систему доставки и также позаботиться об управлении.

Представим через код каждую из сущностей:
```
class Good {
    constructor(label, price) {
        this.label = label;
        this.price = price;
    }
}

class Box {
    constructor(address) {
        this.address = address;
        this.items = [];
    }
    
    addItem(item) {
        if (!this.items.includes(item)) {
            this.items.push(item);
        }
    }
}

class Order {
    constructor() {
        this.id = ++Order.idCounter;
        this.boxes = [];
    }
    
    addBox(box) {
        if (!this.boxes.includes(box)) {
            this.boxes.push(box)
        }
    }
    
    get price() {
        return this.boxes.reduce((acc, box) => {
            box.items.forEach(item => acc + item.price);
        }, 0);
    }
}

Order.counter = 0;

class Notification {
    constructor(user, order) {
        this.user = user; // class User
        this.order = order; // class Order
    }
    
    send() {
        console.log(`Письмо на почту: ${this.user.name} ${this.user.family}, ваш заказ был отправен 
        вам почтой по адресу ${this.user.address}. Вы можете отслеживать его id ${this.order.id}.
        Общая стоимость заказа ${this.order.price}`);
        
        this.orders.boxes.forEach((box, idx) => {
            console.log(`/n${idx + 1} коробка:`);
            
            box.items.forEach((good) =>
                console.log(`${good.label}: ${good.label.length * 1.5}`))
        });
    }
}
```
Выше это все сущности, каждый из которых решает свои задачи.

Теперь же узрим Facade:
```
class Amazon {
    constructor(user) {
        this.user = user;
        this.goods = [];
        this.order = null;
        this.notification = null;
    }
    
    add(label) {
        this.goods.push(new Good(label, label.length * 1.5));
    }
    
    buy() {
        if (this.order) {
            return false;
        }
        
        this.order = new Order();
        
        const goods = this.goods.slice();
        while (goods.length) {
			const box = new Box(this.user.address)

			goods.splice(-3).forEach(
				x => box.addItem(x)
			)

			this.order.addBox(box)
		}

        this.notigication = new Notification(this.user, this.order);
        this.notification.send();
        
        return true;
    }
}
```

Видите, как один класс фактически совместил в себе бизнес логику? Он просто знает, что ему надо
отдавать какие-то команды, а как эти команды реализованы - проблема самих инструментов.

```
const webshop = new Amazon({
    name: 'Алексей',
    family: 'Данчин',
    address: 'Москва'
})

webshop.add('Маска')
webshop.add('Книга')
webshop.add('Тетрадка')
webshop.add('Масло')

webshop.buy()

/*
Письмо на почту: Алексей Данчин, ваш заказ был отправлен вам почтой по адресу Москва, переулок Чукчи.. Вы можете отслеживать его id 1. Общая стоимость 34.5
1 коробка:Книга: 7.5
Тетрадка: 12
Масло: 7.5

2 коробка:
Маска: 7.5
*/
```

### Flyweight / Легковес
Легковес наилучшим образом описывает этот паттерн.
С помощью Flyweight мы можем так хранить данные, что у нас будет потребляться меньше
памяти.

Давайте посмотрим на примере. Допустим, мы хотим заполнить массив миллионом экземпляров
яблок:

```
class Apple {
    constructor(type, color, weight) {
        this.type = type;
        this.color = color;
        this.weight = weight;
    }
}

const apples = [];
for (let i = 0; i < 10**6; ++i) {
    apples.push(
        new Apple('Ginger gold', 'green', parseInt(Math.random() * 400))
    )
}
```
Если попробовать посчитать длину строки, которую мы получим путем преобразования
`JSON.stringify(apples).length`, мы получим результат в 52 миллиона символов.

Чем же нам поможет Flyweight?
Давайте начнем с примера, а потом с объяснения.

```
const appleFactory = new Flyweight([
    ['gold', 'mold', 'кребы'],
    ['красный', 'зеленый', 'желтый'],
    [100, 200, 300, 400]
]);

for (let i = 0; i < 10**6; ++i) {
    appleFactory.add("кребы", 'зеленый', 100)
}

console.log(JSON.stringify(appleFactory.items).length)
```
Эта строчка выведет 10мл. Мы уже сократили память в 5 раз. Но почему так?
Потому что мы больше не храним строки, а индексы, за счет того что передали
такую структуру.

Вот реализация этого паттерна:
```
class FlyweightFactory {
	constructor (...categories) {
		this.categories = categories
		this.items = []
	}

	add (...params) {
		this.items.push(params.map((v, i) => this.categories[i].indexOf(v)))
	}

	get apples () {
		const instance = this

        // Функция генератор
		return (function * () {
			for (const item of instance.items) {
				yield new Apple(
					...item.map((v, i) => instance.categories[i][v])
				)
			}
		})()
	}
}
```

### Proxy
Паттерн прокси из себя представляет обертку над другим классом, где первый имеет точно
такой интерфейс. Поскольку одинаковый интерфейс, то и одинаковые методы. Только перед
вызовом исходного метода мы можем сделать промежуточные действия.

Обычный прокси JS является тоже реализацией этого паттерна. 
