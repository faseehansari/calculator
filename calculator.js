// Simple calculator logic
(() => {
  const previousEl = document.getElementById('previous');
  const currentEl = document.getElementById('current');
  const buttons = document.querySelectorAll('.btn');

  let current = '0';
  let previous = '';
  let operator = null;
  let overwrite = false;

  function updateDisplay() {
    currentEl.textContent = current;
    previousEl.textContent = operator ? `${previous} ${operator}` : previous;
  }

  function appendNumber(num) {
    if (overwrite) {
      current = (num === '.') ? '0.' : num;
      overwrite = false;
      return;
    }
    if (num === '.' && current.includes('.')) return;
    if (current === '0' && num !== '.') current = num;
    else current = current + num;
  }

  function chooseOperator(op) {
    if (current === '' && previous === '') return;
    if (previous === '') {
      previous = current;
    } else if (!overwrite) {
      compute();
    }
    operator = op;
    overwrite = true;
  }

  function compute() {
    if (!operator || previous === '') return;
    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    if (isNaN(prev) || isNaN(curr)) return;
    let result = 0;
    switch (operator) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '*': result = prev * curr; break;
      case '/':
        if (curr === 0) {
          alert("Cannot divide by zero");
          clearAll();
          updateDisplay();
          return;
        }
        result = prev / curr;
        break;
      default: return;
    }
    // Trim floating point to avoid long fractions
    result = parseFloat(result.toPrecision(12)).toString();
    current = result;
    previous = '';
    operator = null;
    overwrite = true;
  }

  function clearAll() {
    current = '0';
    previous = '';
    operator = null;
    overwrite = false;
  }

  function deleteDigit() {
    if (overwrite) {
      current = '0';
      overwrite = false;
      return;
    }
    if (current.length <= 1) {
      current = '0';
      return;
    }
    current = current.slice(0, -1);
  }

  // Button clicks
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.dataset.number;
      const action = btn.dataset.action;

      if (num !== undefined) {
        appendNumber(num);
        updateDisplay();
        return;
      }

      switch (action) {
        case 'clear':
          clearAll();
          updateDisplay();
          break;
        case 'delete':
          deleteDigit();
          updateDisplay();
          break;
        case '=':
          compute();
          updateDisplay();
          break;
        default:
          // operator
          chooseOperator(action);
          updateDisplay();
          break;
      }
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      appendNumber(e.key);
      updateDisplay();
      return;
    }

    if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      compute();
      updateDisplay();
      return;
    }

    if (e.key === 'Backspace') {
      deleteDigit();
      updateDisplay();
      return;
    }

    if (e.key === 'Escape') {
      clearAll();
      updateDisplay();
      return;
    }

    if (['+', '-', '*', '/'].includes(e.key)) {
      chooseOperator(e.key);
      updateDisplay();
    }
  });

  // initialize
  updateDisplay();
})();