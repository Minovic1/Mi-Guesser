# Mi-Guesser
Mi-Guesser is a FiveM mini-game that challenges players to guess correctly under pressure! Fully customizable and optimized for RP servers.


0 → Starting tile/position index

10 → Number of tiles (difficulty / length of the game)

20 → Time limit (in seconds) for the player to complete the mini-game


    exports["mi-guesser"]:startTileGame(0, 10, 20, function(success)
        if success then
            print("Player succeeded!")
        else
            print("Player failed!")
        end
    end)
