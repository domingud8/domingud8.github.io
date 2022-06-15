(function () {
    var $board = $(".board");
    var $columns = $board.find(".column");
    var $winnerstatus = $(".winner-status");
    var $alltiles = $board.find(".tile");

    //////Ask for names of the players
    var name_entered = false;
    var name_player1;
    var name_player2;
    setTimeout(function () {
        name_player1 = askForName("first");
        name_player2 = askForName("second");
        name_entered = true;
    }, 1000);

    var diagonals = [
        [18, 25, 32, 39],
        [12, 19, 26, 33, 40],
        [6, 13, 20, 27, 34, 41],
        [0, 7, 14, 21, 28, 35],
        [1, 8, 15, 22, 29],
        [2, 9, 16, 23],
        [3, 8, 13, 18],
        [4, 9, 14, 19, 24],
        [5, 10, 15, 20, 25, 30],
        [11, 16, 21, 26, 31, 36],
        [17, 22, 27, 32, 37],
        [23, 28, 33, 38],
    ];

    var currentPlayer = 1;
    var resetinggame = false;

    $columns.on("click", function () {
        $tiles = $(this).find(".tile");

        ///variable to control that only one tile will be placed per click
        var placeTile = true;
        var index_out = -1;

        $($tiles.get().reverse()).each(function (index) {
            var hassClassfirst = $(this).eq(0).hasClass("player-1");
            var hassClasssecond = $(this).eq(0).hasClass("player-2");
            if (
                !hassClassfirst &&
                !hassClasssecond &&
                placeTile &&
                !resetinggame &&
                name_entered
            ) {
                index_out = index;
                $(this)
                    .eq(0)
                    .addClass("player-" + currentPlayer);
                placeTile = false;
            }
        });

        //////// filling $row for checking horizontal victories
        var $row = $();
        var row_index = $tiles.length - 1 - index_out;

        $columns.each(function () {
            var $tiles = $(this).find(".tile");
            $row = $row.add($tiles.eq(row_index));
        });

        var checkVictorydiagonal = false;
        checkVictorydiagonal = checkDiagonalVictory($tiles);

        var checkVictoryvertical = false;
        checkVictoryvertical = checkVictory($tiles);

        var checkVictoryhorizontal = false;
        checkVictoryhorizontal = checkVictory($row);

        if (
            checkVictoryvertical ||
            checkVictoryhorizontal ||
            checkVictorydiagonal
        ) {
            resetingGame();
        } else if (index_out > -1) {
            switchPlayer();
        }
    });

    ////Used functions //////////

    function switchPlayer() {
        if (currentPlayer === 1) {
            currentPlayer = 2;
        } else {
            currentPlayer = 1;
        }
    }
    function checkVictory($tiles) {
        var count = 0;
        var someone_won = false;

        var $effective_tiles = $();
        $tiles.each(function () {
            if ($(this).hasClass("player-" + currentPlayer)) {
                count++;
                $effective_tiles = $effective_tiles.add($(this));
                if (count === 4) {
                    console.log($effective_tiles);
                    $effective_tiles.addClass("alert");
                    someone_won = true;
                }
            } else {
                count = 0;
            }
        });

        return someone_won;
    }

    function checkDiagonalVictory($column) {
        var someone_won = false;

        for (var i = 0; i < diagonals.length; i++) {
            var currentdiagonal = diagonals[i];
            var $diagonal = $();
            for (var j = 0; j < currentdiagonal.length; j++) {
                $diagonal = $diagonal.add($alltiles.eq(currentdiagonal[j]));
            }

            $diagonal.each(function () {
                if (someone_won) {
                    return false;
                }
                if ($(this).hasClass("player-" + currentPlayer)) {
                    someone_won = checkVictory($diagonal);
                }
            });
        }
        return someone_won;
    }

    function askForName(player) {
        var name_player = prompt(
            "Please enter your name as " + player + " player",
            "Your name"
        );
        return name_player;
    }

    function resetingGame() {
        ///reseting game
        resetinggame = true;

        setTimeout(function () {
            if (currentPlayer === 1) {
                Swal.fire(
                    "Congratulations!!",
                    name_player1 + " you won!!!",
                    "success"
                );
            } else {
                Swal.fire(
                    "Congratulations!!",
                    name_player2 + " you won!!!",
                    "success"
                );
            }
            currentPlayer = 1;
            $winnerstatus.empty();
            $alltiles.each(function () {
                $(this).removeClass("player-1");
                $(this).removeClass("player-2");
                $(this).removeClass("alert");
                resetinggame = false;
            });
        }, 3000);
    }
})();
