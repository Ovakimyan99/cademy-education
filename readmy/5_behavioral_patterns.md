# Поведенческие паттерны

Чем отличаются поведенческие паттерны от структурных и порождающих?
Порождающие паттерны создают новые паттерны.
Структурные паттерны модифицируют и дополняют.
А поведенческие определяют поведение. Но мы к этому вернемся.

### Chain Of Responsibility / Цепочка Обязанностей
Поведенческий паттерн. Мы диктуем поведение, систему по которой будут формироваться
вызовы. Эти вызовы последовательные и диктуемые.

Цепочка обязанностей избегает связывания отправителя запроса с его получателем, давай
возможность обработать запрос более чем одному объекту. Связывает объекты-получатели и передает запрос
по цепочке, пока объект не обработает его.

Рассмотрим несколько последовательных примеров:
```
function processing(name) {
    step1(name);
}

function step1(name) {
    if (name === 'Алексей') {
        console.log('Алексей handler fired');
    }
    
    else {
        step2(name)
    }
}

function step2 (name) {
	if (name === 'Дмитрий') {
		console.log('Дмитрий handler fired')
	}

	else {
		step3(name)
	}
}

function step3 (name) {
	if (name === 'Серьгей') {
		console.log('Серьгей handler fired')
	}

	else {
		console.log('Error')
	}
}
```
Что это за функции? Фактически это цепочка, где каждая функция вызывает другую. На каждом этапе мы
проверяем в вызовах необходимые нам параметры и если он нам не удовлетворяет, мы передаем аргумент
следующему вызову.

Вызовем функции:
```
processing('Алексей') // Алексей handler fired
processing('Серьгей') // Серьгей handler fired
processing('Ольга') // Error
```

---
#### Второй пример
Пример поинтереснее

```
class Middleware {
    constructor() {
        this.handlers = [];
    }
    
    dispath(arg) {
        for (const handler of this.handlers) {
            const result = handler(arg);
            
            if (result === false) {
                break;
            }
        }
    }
    
    use(handler) {
        this.handlers.push(handler);
    }
}
```
Создали класс `Middleware`, в который мы можем записать обработчики, а потом применять каждый
и выходить из цикла, когда наткнемся на нам необходимый. В чем проявляется паттерн?
То, что записываем обработчики - это пример, а проявление паттерна заключается в его переборе.
Мы перебираем каждый обработчик по цепочке, последовательно (за счет структуры данных), обрабатываем
данные и выходим в момент, по условию, которому мы задаем сами.

Воспользуемся этим:
```
const server = new Middlewarer

server.use(name => {
	if (name === "Алексей") {
		console.log("Алексей handler fired")
		return false
	}
})

server.use(name => {
	if (name === "Дмитрий") {
		console.log("Дмитрий handler fired")
		return false
	}
})

server.use(name => {
	if (name === "Серьгей") {
		console.log("Серьгей handler fired")
		return false
	}
})

server.use(name => {
	console.log("Error")
})

server.dispatch("Алексей") // Алексей handler fired
server.dispatch("Серьгей") // Серьгей handler fired
server.dispatch("Ольга") // Error
```
Пример все тот же, но записали мы его теперь иначе.

То есть вся суть сводится к тому, что мы хотим проверить аргумент. Если он
подходит по условиям, то мы его обрабатываем и прекращаем цепочку. Иначе
передаем дальше.

### Команда
Что делает этот паттерн?
Корректнее и понятнее будет спросить, чем команды этого паттерна отличаются от других
команд?

Тем, что в виде команды мы всегда передаем объект с набором опций и информации.
У команд нет имен, но у них есть константы-флаги, которые определяют действие.
Во-вторых у нас нет большого количества набора функций, а только 1 крутая
функция, в которой обработка имен.

Где это может пригодиться?
Это может приходиться, когда мы хотим общаться с сервером. Например, функции мы ей не передадим,
но зато сможем передать команды на выполнение действий.

Пример:
```
const ADD_PERSON = 0b00
const GET_PERSON = 0b01
const REMOVE_PERSON = 0b10
const CLEAR_LIST = 0b11

class Person {
	constructor (name, family) {
		this.id = Person.idCounter++
		this.name = name
		this.family = family
	}
}

Person.idCounter = 1

class System {
	constructor () {
		this.persons = []
	}

	dispatch (data) {
		if (data.code === ADD_PERSON) {
			this.persons.push(new Person(data.name, data.family))
			return true
		}

		if (data.code === GET_PERSON) {
			for (const person of this.persons) {
				if (person.id === data.id) {
					return person
				}
			}
		}

		if (data.code === REMOVE_PERSON) {
			this.persons = this.persons.filter(x => x.id !== data.id)
			return true
		}

		if (data.code === CLEAR_LIST) {
			this.persons = []
			return true
		}
	}
}

const system = new System

const command1 = {
	code: ADD_PERSON,
	name: 'Алексей',
	family: 'Данчин'
}

system.dispatch(command1)

console.log(system.persons) // [ Person { id: 1, name: 'Алексей', family: 'Данчин' } ]

const person = system.dispatch({
	code: GET_PERSON,
	id: 1
})

console.log(person) // Person { id: 1, name: 'Алексей', family: 'Данчин' }

system.dispatch({
	code: CLEAR_LIST
})

console.log(system.persons) // []
```

### Interpreter / Интерпретатор
Очень сложный паттерн. По нему можно написать свой язык программирования.
Определение: Получая формальный язык, определяет представление его грамматики
и интерпретатор, использующий это представление для обработки выражений языка. 

```
class Interpreter {
	constructor () {
		this.expressions = []
	}

	register (expression) {
		this.expressions.push(expression)
	}

	run (str) {
		const context = {}
		str = str.trim()

		while (str.length) {
			for (const expression of this.expressions) {
				if (str.startsWith(expression.key)) {
					expression.handler(context)
					str = str.substr(expression.key.length).trim()
					break
				}
			}
		}
	}
}

class Expression {
	constructor (key, handler) {
		this.key = key
		this.handler = handler
	}
}

const interpreter = new Interpreter

interpreter.register(new Expression('init', context => context.number = 0))
interpreter.register(new Expression('inc', context => context.number++))
interpreter.register(new Expression('show', context => console.log(context.number)))

interpreter.run(
`
	init
	show
	inc
	inc
	show
`)

/*
0
2
*/
```

### Iterator / Итератор
Итератор - это как обычный итератор в js.
Он предоставляет способ последовательного доступа к элементам множества,
независимо от его внутреннего устройства.

Пример:
```
class OwnArray extends Array {
    [Symbol.iterator]() {
        let i = this.length;
        
        return {
            next: () => {
                return {
                    value: this[--i],
                    done: i === -1
                }
            }
        }
    }
}

const array = new OwnArray(0, 1, 2, 3, 4, 5)

console.log(array);

for (const item o array) {
    console.log(item);
}
```
В Js уже есть его реализация - это Symbol.iterator. Что мы сделали?
Мы сделали OwnArray, который наследуется от Array. И потом мы переопределяем
его Symbol.iterator;

В нашем случае он выведется в обратном порядке:
5, 4, 3, 2, 1, 0

И вся суть итератора сводится к тому, что мы предоставляем возможность каким-либо
образом пробежаться по списку. Будь то `Symbol.iterator` или `forEach`;
Вот второй пример:

```
class Person {
	constructor (name, family) {
		this.name = name
		this.family = family
	}
}

class PersonsList {
	constructor () {
		this.persons = []
	}

	add (person) {
		if (!this.persons.includes(person)) {
			this.persons.push(person)
		}
	}
}

class Iterator {
	constructor (list) {
		this.list = list
	}

	forEach (handler) {
		for (const [index, person] of this.list.persons.entries()) {
			handler(person, index)
		}
	}
}

const list = new PersonsList

list.add(new Person('Алексей', 'Данчин'))
list.add(new Person('Серьгей', 'Лак'))
list.add(new Person('Мария', 'Чипсинка'))

const iterator = new Iterator(list)
iterator.forEach((person, index) => {
	console.log(person, index)
})
/*
Person { name: 'Алексей', family: 'Данчин' } 0
Person { name: 'Серьгей', family: 'Лак' } 1
Person { name: 'Мария', family: 'Чипсинка' } 2
*/
```

### Mediator / Посредник
Представим, что у нас большая тесная связность с разными элементами на странице.
И каждый из них с другим связан. Это не очень хорошо.

Что если сделать один умный компонент, который сам будет решать, кому с кем общаться
и нужно ли общаться? То есть добавить одного посредника для регулирования всех запросов.

Вот как это может быть реализовано через код?
Давайте посмотрим следующий код и попробуем его покритиковать, выделить плюсы и
минусы.

```
// Обычный EventEmitter для подписки на события
class EventEmitter {
	constructor () {
		this.handlers = {}
	}

	on (name, handler) {
		if (!this.handlers[name]) {
			this.handlers[name] = []
		}

		this.handlers[name].push(handler)
	}

	emit (name, ...args) {
		if (this.handlers[name]) {
			for (const handler of this.handlers[name]) {
				handler(...args)
			}
		}
	}
}

// Кнопка с возможностью подписываться на события
class Button extends EventEmitter {
	constructor (label) {
		super()

		this.label = label
	}

	click (...args) {
		this.emit('click', ...args)
	}
}

// Модалка с возможностью подписываться на события
class Modal extends EventEmitter {
	constructor (title) {
		super()

		this.title = title
		this.opened = false
	}

    // Говорим, что хотим открыть модалку и вызываем событие 'open'
	open () {
		if (this.opened) {
			return
		}

		this.opened = true
		this.emit('open')
	}

    //  Говорим, что хотим закрыть модалку и вызываем событие 'close'
	close () {
		if (!this.opened) {
			return
		}

		this.opened = false
		this.emit('close')
	}
}

// Создаем кнопки, модалки
const openButton = new Button('Открыть модальное окно')
const closeButton = new Button('Закрыть модальное окно')
const sendMessageButton = new Button('Отправить сообщение')
const modal = new Modal('Модальное окно')

// Кнопка открытия теперь знает о том, что какая-то модалка хочет открыться
openButton.on('click', () => modal.open())
// А кнопка закрытия знает о том, что та же модалка хочет закрыться
closeButton.on('click', () => modal.close())

modal.on('open', () => console.log('Модальное окно открыли'))
modal.on('close', () => console.log('Модальное окно закрыли'))

openButton.click()
closeButton.click()

// При отправке сообщений мы думаем и обрабатываем состояния кнопок и модалок.
sendMessageButton.on('click', (message = '') => {
	if (message.length < 5) {
		closeButton.click()
		modal.open()
	}
})

sendMessageButton.click('Оки')

/*
Модальное окно открыли
Модальное окно закрыли
Модальное окно открыли
*/
```
Фактически, если вы посмотрите внимательнее, мы полчим то, что все знают друг о друге.
Кнопка о модалке. Модалка о кнопке. Отправка обо всех. Очень тесная и плотная
связность. А теперь давайте это перепишем и сделаем это же через медиатор с решением
указанной проблемы:

```
class Mediator {
    constructor() {
        this.modal = new Modal('Модальное окно');
        
        
        this.modal.on('open', () => console.log('Модальное окно открыли'))
        this.modal.on('close', () => console.log('Модальное окно закрыли'))
    }
    
    sendMessage(message) {
        if (message.length < 5) {
            this.modal.close();
            this.open('Сообщение не может быть отправлено')
        }
    }
    
    openWindow() {
        this.modal.open();
    }
    
    closeWindow() {
        this.modal.close();
    }
}

class EventEmitter {
    construcotr() {
        this.handlers = {};
    }
    
    on(name, handler) {
        if (!this.handlers[name]) {
            this.handlers[name] = []
        }
        
        this.handlers[name].push(handler);
    }
    
    emit (name, ...args) {
		if (this.handlers[name]) {
			for (const handler of this.handlers[name]) {
				handler(...args)
			}
		}
	}
}


class Button extends EventEmitter {
	constructor (label) {
		super()

		this.label = label
	}

	click (...args) {
		this.emit('click', ...args)
	}
}

class Modal extends EventEmitter {
	constructor (title) {
		super()

		this.title = title
		this.opened = false
	}

	open () {
		if (this.opened) {
			return
		}

		this.opened = true
		this.emit('open')
	}

	close () {
		if (!this.opened) {
			return
		}

		this.opened = false
		this.emit('close')
	}
}

const openButton = new Button('Открыть модальное окно')
const closeButton = new Button('Закрыть модальное окно')
const sendMessageButton = new Button('Отправить сообщение')

const mediator = new Mediator();

openButton.on('click', () => mediator.openWindow())
closeButton.on('click', () => mediator.closeWindow())
sendMessageButton.on('click', message => mediator.sendMessage(message))

openButton.click()
closeButton.click()

sendMessageButton.click('Оки')

/*
Модальное окно открыли
Модальное окно закрыли
Модальное окно открыли
*/
```


Фасад предоставляет интерфейс для управления группы архитектур, а в медиаторе
мы говорим только о намереньях. Будет ли это намеренье выполнено, решит сам
медиатор. А в фасаде если вызвали, то он должен вызвать.

Также медиатор все-таки поведенческий паттерн, а фасад, как структурный, настроен
на упрощение системы. А медиатор все сводит к тому, чтобы мы вызывали все действия
через него.

### Memento / Хранитель / Снимок
Суть такая же, как и у мемоизации. У этого паттерна есть немного сложноватое определение,
запишу его, пусть будет:

Не нарушая инкапсуляцию, определяет и сохраняет внутреннее состояние объекта и позволяет
позже восстановить объект в этом состоянии.

```
class Memento {
	constructor () {
		this.history = {}
	}

	getSum () {
		const key = JSON.stringify(arguments)

		if (this.history[key]) {
			return this.history[key]
		}

		return this.history[key] = [].reduce.call(arguments, (a, b) => a + b)
	}
}

const memento = new Memento
const array = (new Int16Array(1000)).map((e, i) => i + 1)

console.time('First')
memento.getSum(...array)
console.timeEnd('First')

console.time('Second')
memento.getSum(...array)
console.timeEnd('Second')

/*
First: 1.406ms
Second: 0.490ms
*/
```
Важно понимать, что она сжирает в данном случае память. Мы можем использовать
хэш функции в виде ключей, но это уже к теории хэширования.

---
### Observer / Слушатель / Наблюдатель
"Наблюдатель" можно перепутать с медиатором или евент эммитером.
Но в чем разница?

Разница со вторым в том, что EventEmitter может быть в большом количестве,
а Observer в единственном.

Наблюдатель используется для аутентичной информации.
Например, бэкенд, форма, события (клики)

а константы - это синтетический источник информации

```
class Observable {
    constructor() {
        this.listeners = [];
    }
    
    addListener (listener) {
        this.listeners.push(listener);
    }
    
    emit(...args) {
        for (const listener of this.listeners) {
            listener(...args);
        }
    }
}

const story = new Observable;

story.addListener(message => {
    console.log('1-й обработчик', message)
})

story.addListener(message => {
    console.log('2-й обработчик', message)
})

story.emit('Какое-нибудь сообщение')

/*
1-й обработчик Какое-нибудь сообщение
2-й обработчик Какое-нибудь сообщение
*/
```
Как вы понимаете, делая любой эмит, мы запускаем все функции. Наблюдатель наблюдает.
Он как один источник правды.

### State / Состояние
Позволяет объекту изменять свое поведение в зависимости от внутреннего состояния.

Вот пример:
```
class Person {
    constructor(name, family, age) {
        this.name = name;
        this.family = family;
        this.age = age;
        
        this.state = 'normal';
    }
    
    greeting() {
        if (this.state === 'normal') {
            console.log(`Добрый день. Я ${this.name} ${this.family}.`);
        }
        
        else if (this.state === 'angry') {
            console.log(`ЧТО ${this.name.toUpperCase()}?! Я УЖЕ ${this.age} ${this.name.toUpperCase()}!`)
        }
    }
}

const Tigritos = new Person('Тигран', 'Овакимян', 20);

pesron.greeting(); // Добрый день. Я Тигран Овакимян 

person.state = 'angry';

person.greeting(); // ЧТО ТИГРАН?! Я УЖЕ 20 ТИГРАН!
```

---
### Strategy / Стратеги я
Суть заключается в том, что мы можем отдельно от использования функции описать саму
эту функцию.

Паттерн определяет группу алгоритмов, инкапсулирует их и делает взаимозаменяемыми.
Позволяет изменять алгоритм независимо от клиентов, его использующих.

Пример:
```
// Набор алгоритмов
const ASC = (a, b) => a - b
const DESC = (a, b) => b - a
const ABSOLUTE_ASC = (a, b) => Math.abs(a) - Math.abs(b)
const ABSOLUTE_DESC = (a, b) => Math.abs(b) - Math.abs(a)

const numbers = (new Int16Array(10)).map(() => Math.floor(Math.random() * 100) - 50)

console.log(numbers) // Int16Array [ 29, 21, -5, -50, -22, 39, 22, 40, -39, 17 ]

console.log("ASC", numbers.sort(ASC)) // ASC Int16Array [ -50, -39, -22, -5, 17, 21, 22, 29, 39, 40 ]
console.log("DESC", numbers.sort(DESC)) // DESC Int16Array [ 40, 39, 29, 22, 21, 17, -5, -22, -39, -50 ]
console.log("ABSOLUTE_ASC", numbers.sort(ABSOLUTE_ASC)) // ABSOLUTE_ASC Int16Array [ -5, 17, 21, 22, -22, 29, 39, -39, 40, -50 ]
console.log("ABSOLUTE_DESC", numbers.sort(ABSOLUTE_DESC)) // ABSOLUTE_DESC Int16Array [ -50, 40, 39, -39, 29, 22, -22, 21, 17, -5 ]
```
Мы на один и тот же массив можем применять различные алгоритмы и они взаимозаменяемы.
Но эта группа алгоритмов не инкапсулирована.

А вот так инкапсулирована:
```
const sortMethods = {
    ASC: (a, b) => a - b,
    DESC: (a, b) => b - a,
    ABSOLUTE_ASC: (a, b) => Math.abs(a) - Math.abs(b),
    ABSOLUTE_DESC: (a, b) => Math.abs(b) - Math.abs(a),
}
```

---
### Template method
Очень похоже на `Factory method` за исключением того, что `tempalate method`
описывает не один метод, а целый алгоритм.

Определение таково:
Определяет алгоритм, некоторые этапы которого делегируются подклассам. Позволяет
подклассам переопределить эти этапы, не меняя структуру алгоритма.

Посмотрим на этот класс:
```
class RegisterUser {
	register () {
		const data = this.getData()
		const isCorrect = this.filterData(data)
		
		if (isCorrect) {
			this.sendData(data)
		}

		else {
			this.errorHandler(data)
		}

		this.finish()
	}
}
```
Вы видите, что мы последовательно диктуем алгоритм, но не определяем его реализацию
в классе?

А именно:
1. getData - запрашиваем данные
2. filterData - проверяем корректность
3. sendData - отправляем данные, если они корректны
4. errorHandler - выбрасывем ошибку
5. finish - заканчиваем работу

Соответственно, мы оставляем реализацию этих алгоритмов / логики подклассам, которые
будут наследоваться. Пример:

```
class FormRegister extends RegisterUser {
	getData () {
		// Обработка формы на странице
		return {
			name: 'Aleksey'
		}
	}

	filterData (data) {
		return data.name.length > 0
	}

	sendData (data) {
		console.log('Данные ушли на сервер', data)
	}

	errorHandler (data) {
		console.warn('Что-то пошло не так!', data)
	}

	finish () {
		console.log('Конец регистрации пользователя.')
	}
}
```

```
class ManualRegister extends RegisterUser {
	getData () {
		// Вручную вбиваем
		return {
			name: prompt('Имя пользователя')
		}
	}

	filterData (data) {
		return data.name.length > 0
	}

	sendData (data) {
		console.log('Данные сохранены локально. При повторном соединение с сервером данные будут отправлены.', data)
	}

	errorHandler (data) {
		console.warn('Что-то пошло не так!', data)
	}

	finish () {
		console.log('Пользователь будет скоро зареган.')
	}
}
```
```
(new FormRegister).register()
(new ManualRegister).register()
```

---
### Visitor / Посетитель
Представляет собой операцию, которая будет выполнена над объектами группы
классов. Дает возможность определить новую операцию без изменения кода
классов, над которыми эта операция проводится.

Пример:
```
class Visitorable {
	accept (actions) {
		if (actions[this.type]) {
			actions[this.type](this)
		}
	}
}

class Apple extends Visitorable {
	constructor () {
		super()

		this.type = 'apple'
	}

	eat () {
		return 'Хрусь'
	}
}

class Watermelon extends Visitorable {
	constructor () {
		super()

		this.type = 'watermelon'
	}

	eat () {
		return 'Много косточек'
	}
}

const eating = {
	apple (apple) {
		console.log(apple.eat())
	},

	watermelon (watermelon) {
		console.log(watermelon.eat())
	}
}

const makeDrink = {
	apple (apple) {
		console.log('Делаем из яблок сидр!')
	},

	watermelon (watermelon) {
		console.log('Арбузовый сок в коробке.')
	}
}

const apple = new Apple
const watermelon = new Watermelon

apple.accept(eating)
watermelon.accept(eating)

apple.accept(makeDrink)
watermelon.accept(makeDrink)
```
