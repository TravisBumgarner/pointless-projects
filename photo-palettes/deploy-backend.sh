#!/bin/bash

# Deploy FastAPI backend to Heroku
rm -rf tmp-heroku-deploy
mkdir tmp-heroku-deploy
cp -r backend/* tmp-heroku-deploy/
cp backend/requirements.txt tmp-heroku-deploy/
cp backend/Procfile tmp-heroku-deploy/  # Create this if needed

cd tmp-heroku-deploy
git init
git remote add heroku https://git.heroku.com/photo-palettes-backend.git
git add .
git commit -m "Deploy backend"
git push -f heroku main
cd ..
rm -rf tmp-heroku-deploy

heroku open photo-palettes-backend