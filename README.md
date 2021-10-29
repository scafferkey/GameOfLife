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
- Important - Bundle functionality into a class!! (Done!)
    - Move update functions into class and make them reference the object (DONE!)
    - Move the timer and alert functions into object 
- General controls:
    - Allow for panning and zooming the canvas window using keyboard 
        -Basic Panning: updates offset, such that next step screen is shifted. Kinda awks! 
            -Fix: Redraws cells on shifting! (Needed to fix the order drawCells was called in the step method.)
    - Zooming (Done!)
    - Tool to convert 0/1 matrices into coords for inserting into the game (DONE! needs testing, I guess?)
    - Allow drawing things directly onto the screen 
        - Partly done - works, but allows directly editing the game in motion (not making a new seed, I guess?) and needs testing on larger canvas windows
            - Testing on larger windows
            - Potential bonuses - draw lines by dragging
- Automated tests:
    - Unit tests for functions! important!!
Optimisation:
    - Replace list with a map (or set might be better?) (Done!)
    - Track sleeping cells, etc.(Done!)
        - Clicked in cells must be added to awake list! (done!)
    - Only draw cells onscreen (Done!)
- Data visualisation:
    - Tracking numbers of "alive" cells (Done!)
    - Implement temperature and density
    - Analysis of cell configurations/game rulesets for "interesting" results
    - Map onto the game state?

- Graph
    - Fix large labels being cut off (adjust sizing?)
- Discovery:
    - Soup generation (Done!)
    - Identifying unique shapes/configurations
- Modular Rules 
    - Allow for different survive/born numbers (Done!)
    - Allow for different neighborhoods

- Saving/Exporting Game states
- Library of interesting configurations
- A prettier Webpage! (In progress!)
BUGS:
- Clicking gets translated by a bunch very often, need to fix coord system for it
- Graph axes can be floating point (fix formatting)
- Graph won't log cells added by clicking!
Really far off:
Alternate tiling systems (Hexagonal, triangular)
