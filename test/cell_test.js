import assert from 'assert';
import { describe, it } from 'mocha';
import cell, { infixExprToSuffixExpr } from '../src/cell';
import { formulas } from '../src/formula';

describe('infixExprToSuffixExpr', () => {
  it('should return myname:A1 score:50 when the value is CONCAT("my name:", A1, " score:", 50)', () => {
    assert.equal(infixExprToSuffixExpr('CONCAT("my name:", A1, " score:", 50)').join(''), '"my name:A1" score:50CONCAT,4');
  });
  it('should return A1B2SUM,2C1C5AVERAGE,350B20++ when the value is AVERAGE(SUM(A1,B2), C1, C5) + 50 + B20', () => {
    assert.equal(infixExprToSuffixExpr('AVERAGE(SUM(A1,B2), C1, C5) + 50 + B20').join(''), 'A1B2SUM,2C1C5AVERAGE,350B20++');
  });
  it('should return A1B2SUM,2C1C5AVERAGE,350B20++ when the value is AVERAGE(SUM(A1,B2), C1, C5) + 50 + B20', () => {
    assert.equal(infixExprToSuffixExpr('AVERAGE(SUM(A1:B2), C1, C5) + 50 + B20').join(''), 'A1A2B1B2SUM,4C1C5AVERAGE,350B20++');
  });
  it('should return A1B2B3SUM,3C1C5AVERAGE,350+B20+ when the value is ((AVERAGE(SUM(A1,B2, B3), C1, C5) + 50) + B20)', () => {
    assert.equal(infixExprToSuffixExpr('((AVERAGE(SUM(A1,B2, B3), C1, C5) + 50) + B20)').join(''), 'A1B2B3SUM,3C1C5AVERAGE,350+B20+');
  });
  it('should return 9312*-3*+42/+ when the value is 9+(3-1*2)*3+4/2', () => {
    assert.equal(infixExprToSuffixExpr('9+(3-1*2)*3+4/2').join(''), '9312*-3*+42/+');
  });
  it('should return 931-+23+*42/+ when the value is (9+(3-1))*(2+3)+4/2', () => {
    assert.equal(infixExprToSuffixExpr('(9+(3-1))*(2+3)+4/2').join(''), '931-+23+*42/+');
  });
});

describe('cell', () => {
  describe('.render()', () => {
    it('should return 1 + 3 + 3 + 7 + 50 + 21 when the value is =SUM(A1,B2, C1, C5) + 50 + B20', () => {
      assert.equal(cell.render('=SUM(A1,B2, C1, C5) + 50 + B20', formulas(), (x, y) => x + y), 1 + 3 + 3 + 7 + 50 + 21);
    });
    it('should return 50 + 21 when the value is =50 + B20', () => {
      assert.equal(cell.render('=50 + B20', formulas(), (x, y) => x + y), 50 + 21);
    });
    it('should return 2 + 500 - 21 when the value is =AVERAGE(A1:A3) + 50 * 10 - B20', () => {
      assert.equal(cell.render('=AVERAGE(A1:A3) + 50 * 10 - B20', formulas(), (x, y) => x + y), (2 + 500) - 21);
    });
  });
});