import template from './template.html';
import Component from 'Core/Component';

export default class Container extends Component {
    constructor() {
        super('container');
        this.components = []
    }

    add(Components) {
        if (Array.isArray(Components)) {
            this.components = Components;
        } else {
            this.components = [...Components];
        }
    }

    render() {
        const $root = super.render();

        $root.append(
            ...this.components.map(Component => Component.render())
        )

        return $root;
    }

    get getHtmlTemplate() {
        return template;
    }
}
