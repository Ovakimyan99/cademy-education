export default class Page {
    constructor(componentsList) {
        this.fragment = document.createDocumentFragment();
        this.fragment.append(...componentsList.map(Component => Component.render()));
    }
}
