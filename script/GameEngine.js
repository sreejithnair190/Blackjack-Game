let Blackjack = {
  Player: {
    totalScore: "#player-score",
    Deck: "#player-deck",
    Score: 0,
  },
  Dealer: {
    totalScore: "#dealer-score",
    Deck: "#dealer-deck",
    Score: 0,
  },
  Cards: ["2", "3", "4", "5", "6", "7", "8", "9", "K", "Q", "J", "A"],
  CardMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    K: 10,
    Q: 10,
    J: 10,
    A: [1, 11],
  },
  wins: 0,
  loss: 0,
  draws: 0,
  isStand: false,
  isTurn: false,
};

const Player = Blackjack["Player"];
const Dealer = Blackjack["Dealer"];

const hitSound = new Audio("./sounds/swish.m4a");
const dealSound = new Audio("./sounds/cash.mp3");
// const lostSound = new Audio("../sounds/aww.mp3")

document.querySelector("#hit").addEventListener("click", Hit);
document.querySelector("#stand").addEventListener("click", Stand);
document.querySelector("#deal").addEventListener("click", Deal);

function Hit() {
  if (Blackjack["isStand"] === false) {
    let card = RandomCard();
    DrawCard(card, Player);
    updateScore(card, Player);
    showScore(Player);
  }
}

function RandomCard() {
  let RandomNumber = Math.floor(Math.random() * Blackjack["Cards"].length);
  let RandomCard = Blackjack["Cards"][RandomNumber];
  return RandomCard;
}

function DrawCard(card, ActivePlayer) {
  if (ActivePlayer["Score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `./images/${card}.png`;
    document.querySelector(ActivePlayer["Deck"]).appendChild(cardImage);
    hitSound.play();
  }
}

function updateScore(card, ActivePlayer) {
  if (card === "A") {
    if (ActivePlayer["Score"] + Blackjack["CardMap"][card][1] <= 21) {
      ActivePlayer["Score"] += Blackjack["CardMap"][card][1];
    } else {
      ActivePlayer["Score"] += Blackjack["CardMap"][card][0];
    }
  } else {
    ActivePlayer["Score"] += Blackjack["CardMap"][card];
  }
}

function showScore(ActivePlayer) {
  if (ActivePlayer["Score"] > 21) {
    document.querySelector(ActivePlayer["totalScore"]).textContent = "BUST!";
    document.querySelector(ActivePlayer["totalScore"]).style.color = "red";
  } else {
    document.querySelector(ActivePlayer["totalScore"]).textContent =
      ActivePlayer["Score"];
  }
}

async function Stand() {
  //Dealer Login
  Blackjack["isStand"] = true;
  while (Dealer["Score"] < 16 && Blackjack["isStand"] === true) {
    let card = RandomCard();
    DrawCard(card, Dealer);
    updateScore(card, Dealer);
    showScore(Dealer);
    await sleep(1000);
  }
  Blackjack["isTurn"] = true;
  showResult(winner());
}

function Deal() {
  if (Blackjack["isTurn"] === true) {
    Blackjack["isStand"] = false;
    clearDeck();
    ResetScore();
  }
}

function clearDeck() {
  let Playercards = document
    .querySelector(Player["Deck"])
    .querySelectorAll("img");
  for (let i = 0; i < Playercards.length; i++) {
    Playercards[i].remove();
  }
  let Dealercards = document
    .querySelector(Dealer["Deck"])
    .querySelectorAll("img");
  for (let i = 0; i < Dealercards.length; i++) {
    Dealercards[i].remove();
  }
  dealSound.play();
}

function ResetScore() {
  Player["Score"] = 0;
  Dealer["Score"] = 0;

  document.querySelector(Player["totalScore"]).textContent = 0;
  document.querySelector(Dealer["totalScore"]).textContent = 0;
  document.querySelector("#result").textContent = "GAME START!";

  document.querySelector(Player["totalScore"]).style = "white";
  document.querySelector(Dealer["totalScore"]).style = "white";
  document.querySelector("#result").style.color = "black";

  Blackjack["isTurn"] = false;
}

function winner() {
  let winner;

  //WHEN Players score is under or equal to 21
  if (Player["Score"] <= 21) {
    if (Player["Score"] > Dealer["Score"] || Dealer["Score"] > 21) {
      Blackjack["wins"]++;
      winner = Player;
    } else if (Player["Score"] < Dealer["Score"]) {
      Blackjack["loss"]++;
      winner = Dealer;
    } else if (Player["Score"] === Dealer["Score"]) {
      Blackjack["draws"]++;
    }
    //WHEN Players Bust
  } else if (Player["Score"] > 21 && Dealer["Score"] <= 21) {
    Blackjack["loss"]++;
    winner = Dealer;
    //WHEN Dealer Bust
  } else if (Player["Score"] > 21 && Dealer["Score"] > 21) {
    Blackjack["draws"]++;
  }
  return winner;
}

function showResult(winner) {
  if (Blackjack["isTurn"] === true) {
    let message, messageColor;
    if (winner === Dealer) {
      document.querySelector("#loss").textContent = Blackjack["loss"];
      message = "YOU LOST!";
      messageColor = "red";
    } else if (winner === Player) {
      document.querySelector("#wins").textContent = Blackjack["wins"];
      message = "YOU WIN!";
      messageColor = "green";
    } else {
      document.querySelector("#draw").textContent = Blackjack["wins"];
      message = "DRAW!";
      messageColor = "darkblue";
    }
    document.querySelector("#result").textContent = message;
    document.querySelector("#result").style.color = messageColor;
  }
}

function sleep(ms) {
  TimeOut = new Promise((resolve) => setTimeout(resolve, ms));
  return TimeOut
}
