import Application from './core/Application';
import Header from 'Components/Header';
import Container from 'Components/Container';
import Post from 'Components/Post';
import PostCarousel from 'Components/PostCarousel';
import fakeUserData from './fakedata.json';

const application = new Application({
    root: document.querySelector('#app'),
});

const HeaderComponent = new Header();
const MainContainerComponent = new Container();

MainContainerComponent.add(fakeUserData.posts.map(post => {
    if (Array.isArray(post.content.image)) {
        return new PostCarousel(post);
    }
    return new Post(post);
}));

application.router.add('/', [HeaderComponent, MainContainerComponent]);
application.update();
