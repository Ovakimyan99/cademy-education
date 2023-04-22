import Component from 'Core/Component';

export default class PostImage extends Component {
    constructor(props) {
        super('postImage');
        this.images = props.images;
        this.template = props.template;
    }

    getImageTag(src) {
        return `<img src="${src}" alt="Фото">`
    }

    get imagesHtmlTemplate() {
        if (Array.isArray(this.images)) {
            return this.images.reduce((html, image) => html + this.getImageTag(image), '')
        }
        return this.getImageTag(this.images);
    }

    get getHtmlTemplate() {
        return this.template
            .replace(/{%post.image%}/g, this.imagesHtmlTemplate);
    }
}
