export default class Animal {
    constructor(name, legs) {
        this.name = name;
        this.legs = legs;
    }

    sound() {
        console.log(`animal sound ${this.name} with ${this.legs}`);
    }
}
