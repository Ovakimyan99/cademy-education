import template from './template.html';
import Component from 'Core/Component';

export default class PostContent extends Component {
    constructor(contentData = {}) {
        super('postContent');

        this.content = contentData.content;
    }

    get getHtmlTemplate() {
        return template
            .replace(/{%post.image%}/g, this.content.image)
            .replace(/{%post.description%}/g, this.content.description)
            .replace(/{%post.tags%}/g, this.content.tags.map(tag => `#${tag}`).join(' '))
        ;
    }
}
