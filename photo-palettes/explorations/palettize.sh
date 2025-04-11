
echo "Syncing file names"
python3 sync_files.py

cd python_src
source ./venv/bin/activate

echo "Running python-color-thief"
python python-color-thief.py


echo "Running python-kmeans"
python python-kmeans.py

echo "Running python-basic-pixel-count"
python python-basic-pixel-count.py

echo "Running python-basic-pixels-with-distance"
python python-basic-pixels-with-distance.py
