$(document).ready(function() {
  var score = 0;
  var timer = 60;
  var targetNumber;
  var timerInterval;
  var minNumber;
  var maxNumber;

  function startGame() {
    $("#startButton").hide();
    $("#gameContainer").show();
    score = 0;
    timer = 60;
    updateScoreAndTimer();

    generateTargetNumber();
    updateGrid();

    timerInterval = setInterval(function() {
      timer--;
      updateScoreAndTimer();

      if (timer === 0) {
        endGame();
      }
    }, 1000);
  }

  function generateTargetNumber() {
    if (score >= 0 && score <= 3) {
      minNumber = 50;
      maxNumber = 250;
    } else {
      minNumber = 250;
      maxNumber = 9999;
    }

    targetNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    $("#targetNumber").text("Найдите число: " + targetNumber);
  }

  function updateGrid() {
    var grid = $(".grid");
    var gridSize = getGridSize();

    grid.empty();
    grid.removeClass();
    grid.addClass("grid grid-" + gridSize);

    var targetIndex = Math.floor(Math.random() * gridSize * gridSize);
    var numbers = [];

    for (var i = 0; i < gridSize * gridSize; i++) {
      var randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      numbers.push(randomNumber);

      if (i === targetIndex) {
        numbers.pop();
        numbers.push(targetNumber);
      }
    }

    var fontSize = getFontSize(gridSize);

    for (var j = 0; j < gridSize * gridSize; j++) {
      var cell = $("<div>").addClass("cell");
      var number = $("<div>").addClass("number");

      cell.append(number);
      grid.append(cell);

      number.text(numbers[j]);

      cell.css({
        fontSize: fontSize,
        backgroundColor: getRandomColor()
      });

      cell.on("mouseenter", function() {
        $(this).addClass("hovered");
      });

      cell.on("mouseleave", function() {
        $(this).removeClass("hovered");
      });

      cell.off("click").click(function() {
        if ($(this).find(".number").text() == targetNumber) {
          score++;
          updateScoreAndTimer();
          generateTargetNumber();
          updateGrid();
        } else {
          endGame();
        }
      });

      if (shouldPulsateCell()) {
        cell.addClass("pulsating");
      }

      if (shouldBlinkCell()) {
        cell.addClass("blinking");
      }

      if (shouldTiltCell()) {
        number.addClass("tilting");
      }
    }

    var containerColor = getRandomColor();
    $("#gameContainer").css({
      backgroundColor: containerColor
    });

    $("body").css({
      backgroundColor: containerColor
    });
  }

  function getGridSize() {
    if (score >= 5 && score < 10) {
      return 4;
    } else if (score >= 10) {
      return 5;
    } else {
      return 3;
    }
  }

  function getFontSize(gridSize) {
    if (gridSize === 3) {
      return "24px";
    } else if (gridSize === 4) {
      return "20px";
    } else {
      return "16px";
    }
  }

  function getRandomColor() {
    var colors = ["#f18e42", "#4eb4e4", "#94c956", "#f46fac", "#8e3dc5"];
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  function updateScoreAndTimer() {
    $("#score").text("Счет: " + score + " | Осталось времени: " + timer);
  }

  function endGame() {
    clearInterval(timerInterval);
    var resultText = "Игра окончена! Ваш счет: " + score;
    $("#resultText").text(resultText);
    $("#gameContainer").hide();
    $("#resultContainer").show();
  }

  function shouldPulsateCell() {
    return Math.random() < 0.5;
  }

  function shouldBlinkCell() {
    return Math.random() < 0.3;
  }

  function shouldTiltCell() {
    return Math.random() < 0.4;
  }

  $("#startButton").click(startGame);

  $("#restartButton").click(function() {
    $("#resultContainer").hide();
    startGame();
  });
});
