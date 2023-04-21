import Page from 'Core/Page';

export default class Router {
    constructor() {
        this.history = [];
        this.route = null;
        this.page = null;
    }

    add(path, container) {
        this.history.push({
            path,
            container,
        })
    }

    update() {
        for (const route of this.history) {
            if (route.path.match(location.path)) {
                this.route = route.path;
                this.page = new Page(route.container);

                break;
            }
        }
    }
}
