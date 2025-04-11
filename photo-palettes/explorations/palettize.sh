
echo "Syncing file names"
python3 sync_files.py

cd python_src
source ./venv/bin/activate

echo "Running python_color_thief"
python python_color_thief.py


echo "Running python_kmeans"
python python_kmeans.py

echo "Running python_basic_pixel_count"
python python_basic_pixel_count.py

echo "Running python_color_distance_50"
python python_color_distance_50.py

echo "Running python_color_distance_20"
python python_color_distance_20.py

echo "Running python_color_distance_10"
python python_color_distance_10.py