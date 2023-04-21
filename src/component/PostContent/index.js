import template from './template.html';
import Component from 'Core/Component';

export default class PostContent extends Component {
    constructor(contentData = {}) {
        super('postContent');

        this.content = contentData.content;
    }

    get tagTemplate() {
        const template = (link = '#', content = '') => `<a href="${link}">#${content}</a>`;

        return this.content.tags.reduce((html, tag) => html + `${template('#', tag)}`, '');
    }

    get getHtmlTemplate() {
        return template
            .replace(/{%post.image%}/g, this.content.image)
            .replace(/{%post.description%}/g, this.content.description)
            .replace(/{%post.tags%}/g, this.tagTemplate)
        ;
    }
}
