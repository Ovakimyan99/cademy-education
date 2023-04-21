import template from './template.html';
import Component from 'Core/Component';

export default class PostComment extends Component {
    constructor(commentData = {}) {
        super('postComment');

        this.comments = commentData.comments;
    }

    get getHtmlTemplate() {
        return this.comments.reduce(
            (html, comment) => html + `${template}`
                .replace(/{%comment.userImage%}/g, comment.user.img)
                .replace(/{%comment.name%}/g, comment.user.name)
                .replace(/{%comment.lastName%}/g, comment.user.lastName)
                .replace(/{%comment.text%}/g, comment.content)
            , ''
        );
    }
}
