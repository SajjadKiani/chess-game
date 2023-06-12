// Define the chessboard and piece representations
const chessboard = [
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
  ];

  // html codes
  const chessIcons = {
    // white pieces
    k: "&#9812;",
    q: "&#9813;",
    r: "&#9814;",
    b: "&#9815;",
    n: "&#9816;",
    p: "&#9817;",
    // black pieces
    K: "&#9818;",
    Q: "&#9819;",
    R: "&#9820;",
    B: "&#9821;",
    N: "&#9822;",
    P: "&#9823;"
  }
  
  // Track the selected piece and its position
  let selectedPiece = null;
  let selectedPosition = null;
  let currentPlayer = "white";
  
  // Render the initial chessboard
  function renderChessboard() {
    const chessboardContainer = document.querySelector(".chessboard");
  
    // Clear any existing squares
    chessboardContainer.innerHTML = "";
  
    for (let row = 0; row < chessboard.length; row++) {
      for (let col = 0; col < chessboard[row].length; col++) {
        const square = document.createElement("div");
        square.classList.add("square");
  
        if ((row + col) % 2 === 0) {
          square.classList.add("white");
        } else {
          square.classList.add("black");
        }
  
        const piece = chessboard[row][col];
        if (piece) {
          const pieceElement = document.createElement("span");
          pieceElement.innerHTML = chessIcons[piece];
          square.appendChild(pieceElement);
  
          // Add click event listener to handle piece selection
          pieceElement.addEventListener("click", () => {
            handlePieceClick(row, col);
            // if piece element class is selected, remove it
            if (pieceElement.classList.contains("selected")) {
                pieceElement.classList.remove("selected");
            } else {
                pieceElement.classList.add("selected");
            }
          });
        } else {
          // Add click event listener to handle empty cell selection
          square.addEventListener("click", () => {
            handleEmptyCellClick(row, col);
            if (square.classList.contains("selected")) {
                square.classList.remove("selected");
            } else {
                square.classList.add("selected");
            }
          });
        }
  
        // Highlight the selected piece
        if (selectedPosition && row === selectedPosition[0] && col === selectedPosition[1]) {
          square.classList.add("selected");
        }
  
        chessboardContainer.appendChild(square);
      }
    }
  }
  
  // Function to handle click on a chess piece
  function handlePieceClick(row, col) {
    if (selectedPiece && selectedPosition[0] === row && selectedPosition[1] === col) {
      // Deselect the piece if the same tile is clicked again
      selectedPiece = null;
      selectedPosition = null;
    } else if (selectedPiece) {
      // Move the selected piece to the clicked position
      const [selectedRow, selectedCol] = selectedPosition;
      const isValidMove = isValidPieceMove(selectedPiece, selectedRow, selectedCol, row, col);
      if (isValidMove) {
        chessboard[row][col] = selectedPiece;
        chessboard[selectedRow][selectedCol] = "";
        selectedPiece = null;
        selectedPosition = null;

        // Change player turn
        currentPlayer = currentPlayer === "white" ? "black" : "white";
        if (isCheckmate(currentPlayer))
          alert("Checkmate!");
      }
    } else {
      // Select the clicked piece
      selectedPiece = chessboard[row][col];
      selectedPosition = [row, col];
    }
  
    renderChessboard();
  }
  
  // Function to handle click on an empty cell
  function handleEmptyCellClick(row, col) {
    if (selectedPiece) {
      // Move the selected piece to the clicked position
      const [selectedRow, selectedCol] = selectedPosition;
      const isValidMove = isValidPieceMove(selectedPiece, selectedRow, selectedCol, row, col);
      if (isValidMove) {
        chessboard[row][col] = selectedPiece;
        chessboard[selectedRow][selectedCol] = "";
        selectedPiece = null;
        selectedPosition = null;

        // Change player turn
        currentPlayer = currentPlayer === "white" ? "black" : "white";
        if (isCheckmate(currentPlayer))
          alert("Checkmate!");
      }
    }
  
    renderChessboard();
  }

// Function to check if a piece move is valid
function isValidPieceMove(piece, startRow, startCol, endRow, endCol) {
    // check player turn, if piece is lower case white turn
    if (piece !== piece.toLowerCase() && currentPlayer !== 'black') // black
      return false
    else if (piece !== piece.toUpperCase() && currentPlayer !== 'white') // white
      return false



    // Check if the start and end positions are the same
    if (startRow === endRow && startCol === endCol) {
      return false;
    }
  
    // Retrieve the absolute row and column differences
    const rowDiff = Math.abs(endRow - startRow);
    const colDiff = Math.abs(endCol - startCol);
  
    // Determine the movement rules based on the piece type
    switch (piece.toLowerCase()) {
      case "p":
        // Pawn movement rules
        if (startCol === endCol) {
            // Move forward
            if (endRow === startRow + 1 && !chessboard[endRow][endCol]) {
                return true;
            } else if (startRow === 1 && endRow === 3 && !chessboard[2][endCol] && !chessboard[3][endCol]) {
                return true;
            }
            if (endRow === startRow - 1 && !chessboard[endRow][endCol]) {
                return true;
            } else if (startRow === 6 && endRow === 4 && !chessboard[5][endCol] && !chessboard[4][endCol]) {
                return true;
            }
        } else if (rowDiff === 1 && colDiff === 1) {
          // Capture diagonal
          const targetPiece = chessboard[endRow][endCol];
          if (targetPiece && (piece === "p" ? targetPiece.toLowerCase() !== targetPiece : targetPiece.toLowerCase() === targetPiece)) {
            return true;
          }
        }
        break;
      case "r":
        // Rook movement rules
        if ((startRow === endRow && colDiff > 0) || (startCol === endCol && rowDiff > 0)) {
          // Check if there are any obstructing pieces
          const step = rowDiff > 0 ? Math.sign(endRow - startRow) : Math.sign(endCol - startCol);
            let row = startRow
            let col = startCol
            if (rowDiff > 0 && colDiff === 0) {
                row += step
            } else if (colDiff > 0 && rowDiff === 0) {
                col += step
            }
                
          while (row !== endRow || col !== endCol) {
            if (chessboard[row][col]) {
              return false;
            }

            if (rowDiff > 0 && colDiff === 0) {
                row += step
            } else if (colDiff > 0 && rowDiff === 0) {
                col += step
            }
          }
          return true;
        }
        break;
      case "n":
        // Knight movement rules
        if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
          return true;
        }
        break;
      case "b":
        // Bishop movement rules
        if (rowDiff === colDiff && rowDiff > 0) {
          // Check if there are any obstructing pieces
          const rowStep = Math.sign(endRow - startRow);
          const colStep = Math.sign(endCol - startCol);
          let row = startRow + rowStep;
          let col = startCol + colStep;
          while (row !== endRow) {
            if (chessboard[row][col]) {
              return false;
            }
            row += rowStep;
            col += colStep;
          }
          return true;
        }
        break;
      case "q":
        // Queen movement rules
        if ((startRow === endRow && colDiff > 0) || (startCol === endCol && rowDiff > 0) || (rowDiff === colDiff && rowDiff > 0)) {
          // Check if there are any obstructing pieces
          const rowStep = startRow === endRow ? 0 : Math.sign(endRow - startRow);
          const colStep = startCol === endCol ? 0 : Math.sign(endCol - startCol);
          let row = startRow + rowStep;
          let col = startCol + colStep;
          while (row !== endRow || col !== endCol) {
            if (chessboard[row][col]) {
              return false;
            }
            row += rowStep;
            col += colStep;
          }
          return true;
        }
        break;
      case "k":
        // King movement rules
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 1)) {
          return true;
        }
        break;
    }
  
    return false;
  }


  function isCheckmate(player) {
    // Find the king's position for the current player
    const kingPosition = findKingPosition(player);
  
    // Check if the king is in check
    if (!isKingInCheck(player, kingPosition)) {
      return false;
    }
  
    // Iterate over each piece of the current player
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = chessboard[row][col];
  
        // Check if the piece belongs to the current player
        if (piece && piece.toLowerCase() === player) {
          // Try moving the piece to every possible destination
          for (let destRow = 0; destRow < 8; destRow++) {
            for (let destCol = 0; destCol < 8; destCol++) {
              if (isValidPieceMove(piece, row, col, destRow, destCol)) {
                // Simulate the move on a temporary chessboard
                const tempChessboard = [...chessboard.map((row) => [...row])];
                tempChessboard[destRow][destCol] = piece;
                tempChessboard[row][col] = null;
  
                // Check if the king is still in check after the move
                if (!isKingInCheck(player, kingPosition, tempChessboard)) {
                  return false;
                }
              }
            }
          }
        }
      }
    }
  
    return true;
  }


  function findKingPosition(player) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = chessboard[row][col];
  
        // Check if the piece is the king of the specified player
        if (player === 'white' && piece === 'k')
          return {row, col};
        else if (player === 'black' && piece === 'K')
          return {row, col};
      }
    }
  
    // Return null if the king position is not found (should not happen in a valid chess game)
    return null;
  }
  

  function isKingInCheck(player, kingPosition, board = chessboard) {
    const opponent = player === "white" ? "black" : "white";
  
    // Iterate over each piece of the opponent
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
  
        // Check if the piece belongs to the opponent
        if (piece && piece.toLowerCase() === opponent) {
          // Check if the opponent's piece can attack the king
          if (isValidPieceMove(piece, row, col, kingPosition.row, kingPosition.col)) {
            return true;
          }
        }
      }
    }
  
    return false;
  }
  
  
  

// Call the renderChessboard function to display the initial chessboard
renderChessboard();
  