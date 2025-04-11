# Setup

1. Run `chmod +x ./bootstrap.sh && ./bootstrap.sh`
   - `bootstrap.sh` assumes Python3 is installed.
1. Add new photos to `./viewer/src/data/images`

# Adding a new Algorithm

1. Create a new file
    - Python
        1. Copy `template.py` in `python_src`. 
        1. Install required dependencies and freeze (`pip freeze -> requirements.txt`) to requirements.txt.
1. Add new file to `palettize.sh`.
1. Run `palettize.sh`
1. In `palettes.ts` add new field to `Algorithm` and `palettes`
1. Start viewer `cd ./viewer && yarn run dev`

# Cache

By default when running `palettize.sh`, existing colors will be used. Run `DISABLE_CACHE=1 ./palettize.sh` to delete all json file sand start fresh.

Goals

- [ ] Explore color generation algorithms
- [ ] What would it take to make my own
- [ ] Bash script to run each of the scripts and generate photos.
- [ ] Mini web viewer to compare. 

