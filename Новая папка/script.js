let globalData = 0;
let transformed = false;
const regexp = /^[0-9a-fA-F]+$/;

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

  compute() {

    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    //if (isNaN(prev) || isNaN(current)) return
    switch (this.operation) {
      case '+':
        if (!transformed) {
          computation = +(prev + current).toFixed(6)
        } else {
          computation = 'error';
        }

        break
      case '-':
        if (!transformed) {

          computation = +(prev - current).toFixed(6)
        } else {
          computation = 'error';
        }
        break
      case '*':
        if (!transformed) {
          computation = +(prev * current).toFixed(6)
        } else {
          computation = 'error';
        }
        break
      case '÷':
        if (!transformed) {
          if (current) {
            computation = +(prev / current).toFixed(6)
          } else {
            computation = 'error';
          }
        } else {
          computation = 'error';
        }
        break
      case '!':
        if (!transformed) {
          if(prev > 0) {
            computation = factorial(prev);
          }
          if (prev === 0) {
            computation = 1;
          } else {
            computation = 'error';
          }
        } else {
          computation = 'error';
        }
        break
      case '%':
        if (!transformed) {
          computation = prev / 100;
        } else {
          computation = 'error';
        }
        break
      case `ln`:
        if (!transformed) {
          if(prev > 0) {
            computation = +Math.log(prev).toFixed(6);
          } else {
            computation = 'error';
          }
        } else {
          computation = 'error';
        }
        break
      case `sqrt`:
        if (!transformed) {
          if(prev > 0) {
            computation = +Math.sqrt(prev).toFixed(6);
          } else {
            computation = 'error';
          }
        } else {
          computation = 'error';
        }

        break
      case '^':
        if (!transformed) {
          if (!isNaN(current) ) {

            computation = +Math.pow(prev, current).toFixed(6);
          } else {
            computation = 'error';
          }
        } else {
          computation = 'error';
        }
        break
      case 'M+':
        if (!transformed) {
          globalData += prev;
          computation = '';
        } else {
          computation = 'error';
        }
        break
      case 'M-':
        if (!transformed) {
          globalData -= prev;
          computation = '';
        } else {
          computation = 'error';
        }
        break
      case 'Bin':
        if (!transformed) {
          computation = convertToBinary(prev);
          transformed = true;
        } else {
          computation = 'error';
        }
        break
      case 'Oct':
        if (!transformed) {
          computation = prev.toString(8);
          transformed = true;
        } else {
          computation = 'error';
        }
        break
      case 'Hex':
        if (!transformed) {
          computation = prev.toString(16);
          transformed = true;
        } else {
          computation = 'error';
        }

        break
      default:
        return

    }
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }

  getDisplayNumber(number) {
    const errorRegexp = ".*error.*(?!INFO).*";
    const stringNumber = number.toString()
    if (regexp.test(stringNumber) || (stringNumber.match(errorRegexp)) ) {
      return stringNumber;
    } else {
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0})
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }

  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
const convertToBinary = (x) => {
  let bin = 0;
  let rem, i = 1, step = 1;
  while (x !== 0) {
    rem = x % 2;
    x = parseInt(x / 2);
    bin = bin + rem * i;
    i = i * 10;
  }
  return bin;
}
const factorial = (n) => {
  return (n !== 1) ? n * factorial(n - 1) : 1;
}
document.getElementById('Mrc').addEventListener('click', () => {
  previousOperandTextElement.textContent = globalData;
})
document.getElementById('Mc').addEventListener('click', () => {
  globalData = 0;
})
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
  transformed = false;
})

deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
  if (previousOperandTextElement.textContent === '') {
    transformed = false;
  }
})

document.addEventListener('keydown', function (event) {
  let patternForNumbers = /[0-9]/g;
  let patternForOperators = /[+\-*\/]/g
  if (event.key.match(patternForNumbers)) {
    event.preventDefault();
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
  }
  if (event.key === '.') {
    event.preventDefault();
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
  }
  if (event.key.match(patternForOperators)) {
    event.preventDefault();
    calculator.chooseOperation(event.key)
    calculator.updateDisplay()
  }
  if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculator.compute()
    calculator.updateDisplay()
  }
  if (event.key === "Backspace") {
    event.preventDefault();
    calculator.delete()
    calculator.updateDisplay()
  }
  if (event.key === 'Delete') {
    event.preventDefault();
    calculator.clear()
    calculator.updateDisplay()
  }

});
