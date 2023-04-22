import Router from 'Router';

export default class Application {
    constructor(options = {}) {
        this.$root = options.root;

        // Применяем паттерн мост
        this.router = new Router;
    }

    update() {
        this.router.update();
        this.$root.innerHTML = '';
        this.$root.append(this.router.page.fragment);
    }
}
