import template from './template.html';
import Component from 'Core/Component';
import PostImage from 'Components/PostImage';

export default class PostContent extends Component {
    constructor(contentData = {}) {
        super('postContent');

        this.content = contentData.content;
        this.imageTemplate = contentData.imageTemplate;
    }

    get tagTemplate() {
        const template = (link = '#', content = '') => `<a href="${link}">#${content}</a>`;

        return this.content.tags.reduce((html, tag) => html + `${template('#', tag)}`, '');
    }

    get imageContentTemplate() {
        return new PostImage({
            images: this.content.image,
            template: this.imageTemplate,
        })
    }

    get getHtmlTemplate() {
        return template
            .replace(/{%PostImage%}/g, this.imageContentTemplate.getHtmlTemplate)
            .replace(/{%post.description%}/g, this.content.description)
            .replace(/{%post.tags%}/g, this.tagTemplate)
        ;
    }
}
