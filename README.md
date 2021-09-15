# GameOfLife
A JS implementation of Conway's Game of Life with good scaling and the ability to change rules.

CURRENT FEATURES:
- CRUDE webpage with canvas based animation (but it shows it fine!)
- Hard Coded implementation of base rules of Conway's game of life
- Basically nothing else (this is a Minimum Viable Product)

TODO:

- Time controls: (DONE! needs some fine tuning for speed, mind)
    - Pausing and resuming
    - Incrementing backwards/forwards by a step (when paused)
    - reverse speed?
    - Skip to beginning/last generated state
    - Fix counters so they update.
- Important - Bundle functionality into a class!!
    - Move update functions into class and make them reference the object (DONE!)
    - Move the timer and alert functions into object 
- General controls:
    - Allow for panning and zooming the canvas window using keyboard
    - Tool to convert 0/1 matrices into coords for inserting into the game
    - Allow drawing things directly onto the screen
- Data visualisation:
    - Tracking numbers of "alive" cells
    - Implement temperature and density
    - Analysis of cell configurations/game rulesets for "interesting" results
    - Map onto the game state?

- Modular Rules
- Saving/Exporting Game states
- Library of interesting configurations

- A prettier Webpage!


Really far off:
Alternate tiling systems (Hexagonal, triangular)
