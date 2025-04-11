echo "Viewer Setup"
cd ./viewer
yarn

echo "Python Setup"

python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt

echo "Node Setup"
echo "Pass"
