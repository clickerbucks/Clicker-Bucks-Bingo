const cardContainer = document.getElementById('bingo-card-container');
const calledNumberDisplay = document.getElementById('called-number');
const calledNumbersList = document.getElementById('called-numbers-list');
const cardCountInput = document.getElementById('card-count');

let calledNumbers = [];
let allNumbers = [];

const headers = ['B', 'U', 'C', 'K', 'S'];
const columnRanges = [
  [1, 15], [16, 30], [31, 45], [46, 60], [61, 75]
];

function rangeArray(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function shuffle(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateCards() {
  cardContainer.innerHTML = '';
  const cardCount = parseInt(cardCountInput.value) || 1;

  for (let i = 0; i < cardCount; i++) {
    const card = createCard();
    cardContainer.appendChild(card);
  }

  calledNumbers = [];
  allNumbers = shuffle(rangeArray(1, 75));
  calledNumberDisplay.textContent = '';
  calledNumbersList.innerHTML = '';
}

function createCard() {
  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card-wrapper');

  const bingoCard = document.createElement('div');
  bingoCard.classList.add('bingo-card');

  // Header row
  const headerRow = document.createElement('div');
  headerRow.classList.add('header-row');
  headers.forEach(letter => {
    const header = document.createElement('div');
    header.classList.add('cell', 'header');
    header.textContent = letter;
    headerRow.appendChild(header);
  });
  bingoCard.appendChild(headerRow);

  // Number grid
  const grid = document.createElement('div');
  grid.classList.add('grid');

  const columnNumbers = columnRanges.map(range =>
    shuffle(rangeArray(range[0], range[1])).slice(0, 5)
  );

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (row === 2 && col === 2) {
        cell.textContent = 'CB';
      } else {
        const number = columnNumbers[col][row];
        cell.textContent = number;
        cell.dataset.number = number;
        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener('click', () => {
          if (calledNumbers.includes(number)) {
            cell.classList.toggle('marked');
          }
        });
      }

      grid.appendChild(cell);
    }
  }

  bingoCard.appendChild(grid);
  cardWrapper.appendChild(bingoCard);
  return cardWrapper;
}

function callNumber() {
  if (allNumbers.length === 0) {
    calledNumberDisplay.textContent = 'All numbers called!';
    return;
  }

  const number = allNumbers.pop();
  calledNumbers.push(number);

  let columnIndex = columnRanges.findIndex(range => number >= range[0] && number <= range[1]);
  const columnLetter = headers[columnIndex];

  calledNumberDisplay.textContent = `Called: ${columnLetter}-${number}`;

  const listItem = document.createElement('li');
  listItem.textContent = `${columnLetter}-${number}`;
  calledNumbersList.appendChild(listItem);

  document.querySelectorAll(`[data-number='${number}']`).forEach(cell => {
    cell.classList.add('marked');
  });
}

function downloadCards() {
  const wrapper = document.getElementById('card-wrapper');

  html2canvas(wrapper, {
    useCORS: true,
    backgroundColor: '#ffffff',
    scale: 2
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'bingo-cards.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(err => {
    console.error('Download failed:', err);
    alert('Download failed. Check the console for more info.');
  });
}

function resetCalledNumbers() {
  calledNumbers = [];
  allNumbers = shuffle(rangeArray(1, 75));
  calledNumberDisplay.textContent = '';
  calledNumbersList.innerHTML = '';
  
  // Unmark all cells
  document.querySelectorAll('.cell.marked').forEach(cell => {
    cell.classList.remove('marked');
  });
}

// Auto-generate on load
window.onload = generateCards;
