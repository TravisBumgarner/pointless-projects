# Setup

1. Run `chmod +x ./bootstrap.sh && ./bootstrap.sh`
1. 
1   - `bootstrap.sh` assumes Python3 is installed.

# Adding a new Algorithm

1. Create a new file
    - Python
        1. Copy `template.py` in `python-src`. 
        1. Install required dependencies and freeze (`pip freeze -> requirements.txt`) to requirements.txt.
1. Add new file to `palettize.sh`.
1. Run `palettize.sh`
1. In `palettes.ts` add new field to `Algorithm` and `palettes`
1. Start viewer `cd ./viewer && yarn run dev`


Goals

- [ ] Explore color generation algorithms
- [ ] What would it take to make my own
- [ ] Bash script to run each of the scripts and generate photos.
- [ ] Mini web viewer to compare. 

