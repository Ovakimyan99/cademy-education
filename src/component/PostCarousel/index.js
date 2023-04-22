import Post from 'Components/Post';
import PostContent from 'Components/PostContent';
import carouselTemplate from './carousel.html';

export default class PostCarousel extends Post {
    constructor(props) {
        super(props);
    }

    get PostContentInstance() {
        return new PostContent({
            content: this.content,
            imageTemplate: carouselTemplate,
        })
    }
}
