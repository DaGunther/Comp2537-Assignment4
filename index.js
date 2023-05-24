const setup = () => {
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let pairsMatched = 0;
  let totalClicks = 0;
  let totalPairs = 0;
  let timer;
  let timeElapsed = 0;
  let totalTime = 0;
  let revealTimer;
  let difficultyMultiplier = 1;

  $("#difficulty").change(function () {
    switch ($(this).val()) {
      case "easy":
        difficultyMultiplier = 1;
        totalTime = 200; // Set totalTime to 100 for easy level
        break;
      case "medium":
        difficultyMultiplier = 2;
        totalTime = 200; // Set totalTime to 200 for medium level
        break;
      case "hard":
        difficultyMultiplier = 3;
        totalTime = 300; // Set totalTime to 300 for hard level
        break;
    }
    resetGame();
  });

  $("#reveal-button").click(function () {
    if (revealTimer) return;
    $(".card").addClass("flip");
    revealTimer = setTimeout(function () {
      $(".card").removeClass("flip");
      revealTimer = null;
    }, 2000);
  });

  $("#reset-button").click(() => {
    resetGame();
  });

  $("#start-button").click(() => {
    if (!timer) {
      timer = setInterval(() => {
        timeElapsed++;
        $("#timer").text(`Total time: ${totalTime} Time left: ${timeElapsed}s`);
        if (timeElapsed >= totalTime) {
          // Check if time has exceeded totalTime
          clearInterval(timer); // Stop the timer
          endGame(); // Show game over alert or any other action you want to take
        }
      }, 1000);
    }
  });

  $(".card").on("click", cardClick);

  function cardClick() {
    const card = $(this);
    if (card.hasClass("flip") || lockBoard) return;
    card.addClass("flip");

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      totalClicks++;
      updateScorecard();
      checkMatch();
    }
  }

  function checkMatch() {
    if (
      firstCard.find(".front_face").attr("src") ===
      secondCard.find(".front_face").attr("src")
    ) {
      setTimeout(removeMatchedCards, 500);
    } else {
      lockBoard = true;
      setTimeout(unflipCards, 1500);
    }
  }

  function createCards() {
    const container = $("#game_grid");
    const cardsCount = 6 * difficultyMultiplier;
    totalPairs = difficultyMultiplier * 3;
    const randomNumbersArray = generateRandomNumbersArray(cardsCount / 2);
    container.empty();

    container.removeClass("easy med hard"); // reset classes

    for (let i = 0; i < cardsCount; i++) {
      const cardElement = $("<div>").addClass("card");
      if (cardsCount == 6) {
        container.addClass("easy");
        cardElement.addClass("easy");
      }
      if (cardsCount == 12) {
        container.addClass("med");
        cardElement.addClass("med");
      }
      if (cardsCount == 18) {
        container.addClass("hard");
        cardElement.addClass("hard");
      }
      const frontFace = $("<img>")
        .addClass("front_face")
        .attr(
          "src",
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomNumbersArray[i]}.png`
        );
      const backFace = $("<img>")
        .addClass("back_face")
        .attr("src", "back.webp");
      cardElement.append(frontFace, backFace);
      container.append(cardElement);
    }
    $(".card").on("click", cardClick);
  }

  function generateRandomNumbersArray(count) {
    const array = [];
    while (array.length < count) {
      const randomNumber = Math.floor(Math.random() * 151) + 1;
      if (array.indexOf(randomNumber) === -1) array.push(randomNumber);
    }
    return [...array, ...array].sort(() => 0.5 - Math.random());
  }

  function removeMatchedCards() {
    firstCard.off("click");
    secondCard.off("click");
    resetBoard();
    pairsMatched++;
    if (pairsMatched === totalPairs) {
      setTimeout(endGame, 500);
    }
  }

  function unflipCards() {
    firstCard.removeClass("flip");
    secondCard.removeClass("flip");
    resetBoard();
  }

  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function resetGame() {
    clearInterval(timer);
    timer = null;
    timeElapsed = 0;
    resetBoard();
    resetScorecard();
    $(".card").off("click");
    createCards();
  }

  function endGame() {
    clearInterval(timer);
    alert("You won!");
  }

  // Reset Scorecard
  function resetScorecard() {
    totalClicks = 0;
    pairsMatched = 0;
    totalPairs = 0;

    // Reset all texts
    $("#pairs-matched").text(`Pairs matched: 0`);
    $("#pairs-left").text(`Pairs left: ${totalPairs}`);
    $("#clicks").text(`Clicks: 0`);
    $("#timer").text(`Total time: 0s. Time: 0s`);
  }

  // Update Scorecard
  function updateScorecard() {
    $("#clicks").text(`Clicks: ${totalClicks}`);
    $("#pairs-matched").text(`Pairs matched: ${pairsMatched}`);
    $("#pairs-left").text(`Pairs left: ${totalPairs - pairsMatched}`);
    $("#total-pairs").text(`Total pairs: ${totalPairs}`);
  }
};

document
  .getElementById("theme-switcher")
  .addEventListener("click", function () {
    document.body.classList.toggle("dark");
  });

$(setup);
