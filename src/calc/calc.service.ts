import { Injectable, BadRequestException } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  private precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  private isOperator(c: string): boolean {
    return ['+', '-', '*', '/'].includes(c);
  }

  private getPrecedence(op: string): number {
    return this.precedence[op] || 0;
  }

  private applyOperator(a: number, b: number, operator: string): number {
    switch (operator) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        if (b === 0) {
          throw new BadRequestException('Division by zero');
        }
        return a / b;
      default:
        throw new BadRequestException('Invalid operator');
    }
  }

  calculateExpression(calcBody: CalcDto) {
    const { expression } = calcBody;
    if (!expression.trim()) {
      throw new BadRequestException('Expression cannot be empty');
    }

    const values: number[] = [];
    const operators: string[] = [];
    let i = 0;

    while (i < expression.length) {
      if (expression[i] === ' ') {
        i++;
        continue;
      }

      if (!isNaN(Number(expression[i]))) {
        let value = 0;
        while (i < expression.length && !isNaN(Number(expression[i]))) {
          value = value * 10 + Number(expression[i]);
          i++;
        }
        values.push(value);
        continue;
      }

      if (this.isOperator(expression[i])) {
        while (
          operators.length &&
          this.getPrecedence(operators[operators.length - 1]) >= this.getPrecedence(expression[i])
        ) {
          const b = values.pop();
          const a = values.pop();
          const op = operators.pop();
          if (a === undefined || b === undefined || op === undefined) {
            throw new BadRequestException('Invalid expression provided');
          }
          values.push(this.applyOperator(a, b, op));
        }
        operators.push(expression[i]);
      } else {
        throw new BadRequestException('Invalid expression provided');
      }
      i++;
    }

    while (operators.length) {
      const b = values.pop();
      const a = values.pop();
      const op = operators.pop();
      if (a === undefined || b === undefined || op === undefined) {
        throw new BadRequestException('Invalid expression provided');
      }
      values.push(this.applyOperator(a, b, op));
    }

    if (values.length !== 1) {
      throw new BadRequestException('Invalid expression provided');
    }

    return values.pop();
  }
}
