//by default the modules in es 6 are in strict mode
//so our class may not have a global scope
//using # makes it a private method

export default class View {
  $ = {};
  $$ = {};

  constructor() {
    //class instance(this).property that we want($).the element

    this.$.action = this.#qs("[data-id='action']");
    this.$.action_btn = this.#qs("[data-id='action-btn']");
    this.$.menu_items = this.#qs("[data-id='menu-items']");
    this.$.reset_btn = this.#qs("[data-id='reset-btn']");
    this.$.new_btn = this.#qs("[data-id='new-btn']");
    this.$.modal = this.#qs("[data-id='modal']");
    this.$.modal_content = this.#qs("[data-id='modal-content']");
    this.$.modal_text = this.#qs("[data-id='modal-text']");
    this.$.modal_btn = this.#qs("[data-id='modal-btn']");
    this.$.turn = this.#qs("[data-id='turn']");
    this.$.p1Wins = this.#qs("[data-id='p1-wins']");
    this.$.p2Wins = this.#qs("[data-id='p2-wins']");
    this.$.ties = this.#qs("[data-id='ties']");

    this.$$.squares = this.#qsAll("[data-id='square']");

    this.$.action_btn.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  /**
   * register all the event listeners
   * we want to handle event listeners in controller
   */
  bindGameResetEvent(handler) {
    this.$.reset_btn.addEventListener("click", handler);
    this.$.modal_btn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.new_btn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }

  /**
   * dom helper methods
   */
  updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = `${p1Wins} wins`;
    this.$.p2Wins.innerText = `${p2Wins} wins`;
    this.$.ties.innerText = `${ties} wins`;
  }

  openModal(message) {
    this.$.modal.classList.remove("hide");
    this.$.modal_text.innerText = message;
  }

  closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #closeModal() {
    this.$.modal.classList.add("hide");
  }

  #closeMenu() {
    this.$.menu_items.classList.add("hide");
    this.$.action_btn.classList.remove("shared-border");

    const icon = this.$.action_btn.querySelector("i");
    icon.classList.add("fa-caret-down");
    icon.classList.remove("fa-caret-up");
  }

  clearMoves() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  initializeMoves(moves) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);

      if (existingMove) {
        this.handlePlayerMove(square, existingMove.player);
      }
    });
  }

  #toggleMenu() {
    this.$.menu_items.classList.toggle("hide");
    this.$.action_btn.classList.toggle("shared-border");

    const icon = this.$.action_btn.querySelector("i");
    icon.classList.toggle("fa-caret-down");
    icon.classList.toggle("fa-caret-up");
  }

  handlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }

  setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.colorClass, player.iconClass);

    label.classList.add(player.colorClass);

    label.innerText = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error("Could not find elements");

    return el;
  }

  #qsAll(selector) {
    const el = document.querySelectorAll(selector);

    if (!el) throw new Error("Could not find elements");

    return el;
  }
}
