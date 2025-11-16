// Get elements
const nameInput = document.getElementById('nameInput');
const gameBoard = document.getElementById('gameBoard');
const player1Input = document.getElementById('player1');  // ✅ Changed from 'player-1'
const player2Input = document.getElementById('player2');  // ✅ Changed from 'player-2'
const submitBtn = document.getElementById('submit');
const message = document.getElementById('message');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('resetBtn');

// Game variables
let player1Name = '';
let player2Name = '';
let currentPlayer = 1;
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];

// Winning combinations
const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Start game when submit button is clicked
submitBtn.addEventListener('click', function() {
    player1Name = player1Input.value.trim();
    player2Name = player2Input.value.trim();
    
    // Check if both names are entered
    if (player1Name === '' || player2Name === '') {
        alert('Please enter names for both players!');
        return;
    }
    
    // Hide name input screen and show game board
    nameInput.classList.add('hidden');
    gameBoard.classList.add('active');
    
    // Show whose turn it is
    updateMessage();
});

// Handle cell clicks
cells.forEach(cell => {
    cell.addEventListener('click', function() {
        const cellId = parseInt(this.id) - 1; // Convert to 0-based index
        
        // Check if cell is already taken or game is over
        if (boardState[cellId] !== '' || !gameActive) {
            return;
        }
        
        // Mark the cell
        if (currentPlayer === 1) {
            this.textContent = 'x';
            boardState[cellId] = 'x';
        } else {
            this.textContent = 'o';
            boardState[cellId] = 'o';
        }
        
        this.classList.add('taken');
        
        // Check for winner
        checkWinner();
        
        // Switch player if game is still active
        if (gameActive) {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateMessage();
        }
    });
});

// Update message showing whose turn it is
function updateMessage() {
    const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
    message.textContent = `${currentPlayerName}, you're up`;
}

// Check for winner
function checkWinner() {
    let won = false;
    let winningCells = [];
    
    // Check all winning combinations
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        
        if (boardState[a] !== '' && 
            boardState[a] === boardState[b] && 
            boardState[a] === boardState[c]) {
            won = true;
            winningCells = [a, b, c];
            break;
        }
    }
    
    if (won) {
        gameActive = false;
        const winnerName = currentPlayer === 1 ? player1Name : player2Name;
        message.textContent = `${winnerName} congratulations you won!`;  // ✅ Removed comma
        
        // Highlight winning cells
        winningCells.forEach(index => {
            cells[index].classList.add('winning');
        });
        
        return;
    }
    
    // Check for tie (no empty cells left)
    if (!boardState.includes('')) {
        gameActive = false;
        message.textContent = "It's a tie!";
    }
}

// Reset game
resetBtn.addEventListener('click', function() {
    // Reset game state
    currentPlayer = 1;
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    
    // Clear all cells
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winning');
    });
    
    // Update message
    updateMessage();
});

// Allow pressing Enter to submit names
player2Input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});