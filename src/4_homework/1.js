/*
* Задание №1 (*)
* Напишите класс адаптер для localStorage. Реализуйте в адаптере интерфейс с методами:
* set, get, includes и clear.
* */

/*
* Для решения задачи в первую очередь надо вспомнить, что такое Адаптер.
* Адаптер - это паттерн, который позволяет адаптировать класс так, что
* мы применяем нужные нам методы на основе предыдущих. Поскольку класс
* адаптер - структурный паттерн, то он не создает, а только адаптирует исходный.
* */

class LocalStorageAdapter {
    constructor(localStorage) {
        this.storage = localStorage;
    }

    set(key, value) {
        this.storage.setItem(key, value);
    }

    get(key) {
        return this.storage.getItem(key);
    }

    includes(key) {
        return Boolean(this.storage.getItem(key));
    }

    clear(key) {
        if (typeof key === 'string') {
            this.storage.removeItem(key);
            return;
        }

        this.storage.clear();
    }
}
