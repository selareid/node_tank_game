# node_tank_game

##Things:
0. For entities, position is the top-left
0. For players, position is the center
0. For bullet it is center cause bullet is circle

DON'T FORGET YOU HAVE FAKE LAG IN MOVEMENT SERVER-SIDE

#####Formula to get game position from mouse position
Rearranged from draw formula
* p + (gameX) * 5 - topLeftPos.x * 5 = b
* b = p + (gameX) * 5 - topLeftPos.x * 5
* topLeftPos.x + (b - p) / 5 = gameX
* gameX = topLeftPos.x + (b - p)/5

Where p is that padding variable and b is the mouse coordinates relative to the canvas




##### Maybe ------
TODO change entities to a class
and have bullets as a sub class\
