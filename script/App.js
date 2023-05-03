import View from "./view.js";
import Store from "./store.js";

const App = {
  // All variables are placed here
  //$ is a generic naming convention
  $: {
    action: document.querySelector("[data-id='action']"),
    menu_items: document.querySelector("[data-id='menu-items']"),
    reset_btn: document.querySelector("[data-id='reset-btn']"),
    new_btn: document.querySelector("[data-id='new-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector("[data-id='modal']"),
    modal_content: document.querySelector("[data-id='modal-content']"),
    modal_text: document.querySelector("[data-id='modal-text']"),
    modal_btn: document.querySelector("[data-id='modal-btn']"),
    turn: document.querySelector("[data-id='turn']"),
  },

  state: {
    moves: [],
  },

  getStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    let winner = null;

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    winningPatterns.forEach((pattern) => {
      //using the Arrays.every method, if all the conditions checked inside are true
      //i.e, .includes(), then it returns true

      const isP1Winner = pattern.every((value) => p1Moves.includes(value));
      const isp2Winner = pattern.every((value) => p2Moves.includes(value));

      if (isP1Winner) winner = 1;
      if (isp2Winner) winner = 2;
    });

    return {
      status:
        moves.length === 9 || winner != null ? "complete-game" : "on-going",
      winner,
    };
  },

  init() {
    App.theEventListeners();
  },

  theEventListeners() {
    //we place our add event listeners here

    App.$.action.addEventListener("click", (event) => {
      App.$.menu_items.classList.toggle("hide");
      App.$.action.classList.toggle("shared-border");
    });

    App.$.reset_btn.addEventListener("click", (event) => {
      console.log("reset");
    });

    App.$.new_btn.addEventListener("click", (event) => {
      console.log("new game");
    });

    App.$.modal_btn.addEventListener("click", (event) => {
      App.state.moves = [];

      App.$.squares.forEach((square) => {
        square.replaceChildren();
      });

      App.$.modal.classList.add("hide");
    });

    //square is a node in dom used to iterate all squares
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        //target represents the html element that was clicked not the square

        //console.log(`The square ${event.target.id} was selected`);

        const checkExistingChild = (squareId) => {
          //find: basically a linear search loop
          const doesExist = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return doesExist !== undefined;
        };

        if (checkExistingChild(+square.id)) {
          return;
        }

        const lastMove = App.state.moves.at(-1);

        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);

        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);

        const nextPlayer = getOppositePlayer(currentPlayer);

        const icon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, make a move!`;

        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "red");
          turnLabel.classList = "red";
        } else {
          icon.classList.add("fa-solid", "fa-o", "red");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(icon);

        const result = App.getStatus(App.state.moves);

        //console.log(result);
        if (result.status === "complete-game") {
          App.$.modal.classList.remove("hide");

          let msg = "";
          if (result.winner !== null) {
            msg = `Player ${result.winner} wins!`;
          } else {
            msg = "Game tied!";
          }

          App.$.modal_text.textContent = msg;
        }
      });
    });
  },
};

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "yellow",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "red",
  },
];

function init() {
  //make a instance of class view
  const view = new View();
  const store = new Store("live-game-key", players);

  function initView() {
    view.closeAll();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);
    view.updateScoreboard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
    view.initializeMoves(store.game.moves);
  }

  window.addEventListener("storage", () => {
    initView();
  });

  initView();

  view.bindGameResetEvent((event) => {
    store.reset();
    initView();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
    initView();
  });

  view.bindPlayerMoveEvent((square) => {
    //event.target targets the element that was clicked

    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    view.handlePlayerMove(square, store.game.currentPlayer);

    store.playerMove(+square.id);

    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : "Tie!"
      );
      return;
    }

    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
