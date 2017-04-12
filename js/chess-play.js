// $(function() {
  var board,
  game = new Chess();

  // do not pick up pieces if the game is over
  // only pick up pieces for White
  var onDragStart = function(source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
      piece.search(/^b/) !== -1) {
      return false;
    }
  };

  // Set values for pieces. Used when evaluating board.
  var typeValue = {
    'p': 10,
    'n': 30,
    'b': 30,
    'r': 50,
    'q': 90,
    'k': 900
  };

  // Get a value for the board relative to white.
  // If positive, white is winning.
  var evaluateBoard = function (board) {
    var value = 0;
    // Loop through all pieces on board and get values
    for (var row = 0;row < board.length;row++) {
      for (var col = 0;col < board[row].length;col++) {
        var piece = board[row][col];
        // Check if spot is empty (null)
        if (piece) {
          var type = piece['type'],
              color = piece['color'];
          // Remove value if black, otherwise add
          value += typeValue[type] * (color === game.BLACK ? -1 : 1);
        }
      }
    }
    return value;
  };

  // Make a random move
  var makeRandomMove = function() {
    var possibleMoves = game.moves();

    // game over
    if (possibleMoves.length === 0) return;

    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);
    board.position(game.fen());
  };

  // Make best move.
  var makeBestMove = function() {
    var bestMove = calculateBestMove(game);

    // game over
    if (bestMove === null) return;

    game.move(bestMove);
    board.position(game.fen());
  };

  // Calculates what the best move is based on board value after move.
  var calculateBestMove = function (game) {

      var newGameMoves = game.moves();
      // game over
      if (newGameMoves.length === 0) return;
      var bestMove = null;
      //use any negative large number
      var bestValue = -9999;

      for (var i = 0; i < newGameMoves.length; i++) {
          var newGameMove = newGameMoves[i];
          game.move(newGameMove);

          //take the negative as AI plays as black
          var boardValue = -evaluateBoard(game.board())
          game.undo();
          if (boardValue > bestValue) {
              bestValue = boardValue;
              bestMove = newGameMove
          }
      }

      return bestMove;

  };

  var onDrop = function(source, target) {
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'snapback';

    // make random legal move for black
    // window.setTimeout(makeRandomMove, 250);
    // make best move according to value
    window.setTimeout(makeBestMove, 250);
  };

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  var onSnapEnd = function() {
    board.position(game.fen());
  };

  // Checks if game is over
  var onChange = function() {
    console.log(game.game_over());
    if (game.game_over()) {
      alert('Game Over');
    }
  };

  var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    onChange: onChange
  };
  board = ChessBoard('board', cfg);
// });
