import template from './template.html';
import Component from 'Core/Component';

export default class Header extends Component {
    constructor() {
        super('header');
    }

    get getHtmlTemplate() {
        return template;
    }
}
