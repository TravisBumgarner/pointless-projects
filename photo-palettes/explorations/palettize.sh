source ./venv/bin/activate

echo "Syncing files"
python sync_files.py

echo "Running python-kmeans"
cd python-kmeans
python main.py
