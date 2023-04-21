import template from './template.html';
import Component from 'Core/Component';
import PostComment from 'Components/PostComment';
import PostHeader from 'Components/PostHeader';
import PostContent from 'Components/PostContent';

export default class Post extends Component {
    constructor(options = {}) {
        super('post');

        this.user = {
            name: options.user.name,
            lastName: options.user.lastName,
            img: options.user.img,
        };

        this.content = {
            tags: options.content.tags.slice(),
            image: options.content.image,
            description: options.content.description,
        };

        this.comments = options.comments.map(comment => ({
            user: {
                name: comment.user.name || '',
                lastName: comment.user.lastName || '',
                img: comment.user.img || ''
            },

            content: comment.content || '',
        }));
    }

    get PostCommentsInstance() {
        return new PostComment({
            comments: this.comments,
        })
    }

    get PostHeaderInstance() {
        return new PostHeader({
            user: this.user,
        })
    }

    get PostContentInstance() {
        return new PostContent({
            content: this.content,
        })
    }

    get getHtmlTemplate() {
        return template
            .replace(/{%PostHeader%}/g, this.PostHeaderInstance.getHtmlTemplate)
            .replace(/{%PostContent%}/g, this.PostContentInstance.getHtmlTemplate)
            .replace(/{%PostComments%}/g, this.PostCommentsInstance.getHtmlTemplate)
            ;
    }
}
