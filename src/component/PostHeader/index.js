import template from './template.html';
import Component from 'Core/Component';

export default class PostHeader extends Component {
    constructor(headerData = {}) {
        super('post');

        this.user = headerData.user;
    }

    get getHtmlTemplate() {
        return template
            .replace(/{%user.name%}/g, this.user.name)
            .replace(/{%user.lastName%}/g, this.user.lastName)
            .replace(/{%user.image%}/g, this.user.img)
            ;
    }
}
