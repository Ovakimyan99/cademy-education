export default function sum(...args) {
    if (!args.length) {
        return 0;
    }
    return args.reduce((sum, num) => sum += num, 0);
}
