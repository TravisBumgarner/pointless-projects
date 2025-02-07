# What is it?

Proof of concept exploring what it would take to recreate https://blurha.sh/ from scratch.

# Setup

1. Setup Python
    1. Install Python
    1. Setup Virtual Environment (`python -m venv somehash-venv`)
    1. Activate Virtual Environment (`source ./somehash-venv/bin/activate`)
    1. Install dependencies (`pip install -r requirements.txt`)
1. Process Photos
    1. Place photos in `react-app/public/`. 
    1. Run script (`python main.py`). Python will process photos in the public directory and create a file in `react-app/output.json` with the data. 
1. Setup Frontend
    1. Install Node & yarn
    1. Install dependencies (`cd react-app && yarn`)
    1. Start server (`yarn start`)
1. Run Frontend
    1. Navigate to http://localhost:3000/
