source ./venv/bin/activate

echo "Syncing file names"
python sync_files.py


echo "Running python-color-thief"
cd python-src
python python-color-thief.py


echo "Running python-kmeans"
python python-kmeans.py
