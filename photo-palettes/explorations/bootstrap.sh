echo "Viewer Setup"
cd ./viewer
yarn
cd ..

echo "Python Setup"

cd ./python_src
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt

echo "Node Setup"
echo "Pass"
