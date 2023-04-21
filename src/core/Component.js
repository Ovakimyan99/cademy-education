export default class Component {
    constructor(type) {
        this.type = type;
    }

    render() {
        const root = document.createElement('div');
        root.innerHTML = this.getHtmlTemplate;
        return root.firstElementChild;
    }

    get getHtmlTemplate() {
        console.error('[Component]: be create "getHtmlTemplate" method in your component');
        return '';
    }
}
