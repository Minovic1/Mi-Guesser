local gameCallback = nil

function startTileGame(min, max, time, callback)
    gameCallback = callback
    SendNUIMessage({
        action = 'open',
        min = min,
        max = max,
        time = time  
    })
    SetNuiFocus(true, true)
end

RegisterNUICallback('gameResult', function(data, nuiCallback)
    if gameCallback then
        gameCallback(data.success)
    end
    SetNuiFocus(false, false)
    nuiCallback('ok')
end)

exports('startTileGame', startTileGame)

RegisterCommand('playgame50', function()
    startTileGame(0, 50, 30, function(success)  
        if success then
            print("Player succeeded!")
        else
            print("Player failed!")
        end
    end)
end, false)

RegisterNUICallback('closegame', function(data, nuiCallback)
    print("Close NUI callback executed.")
    SetNuiFocus(false, false)
    nuiCallback({status = 'ok'}) 
end)




-- 0 is for min number 
-- 10 is for max number 
-- 55 time 

RegisterCommand("startguess", function()
    exports["mi-guesser"]:startTileGame(0, 10, 20, function(success)
        if success then
            print("Player succeeded!")
        else
            print("Player failed!")
        end
    end)
end, false)
