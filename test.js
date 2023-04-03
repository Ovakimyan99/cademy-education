// import * as chai from 'chai';
import {should} from 'chai';
import sum from './src/testMocha';

should();

describe('Тест суммы чисел', function () {
    it('sum', function () {
        sum(1, 2, 3, 1).should.equal(7);
        sum(2, 3).should.equal(6);
    });
});
