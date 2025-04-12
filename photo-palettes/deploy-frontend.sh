#!/bin/bash

# Deploy Next.js frontend to Heroku
rm -rf tmp-heroku-deploy
mkdir tmp-heroku-deploy
cp -r frontend/* tmp-heroku-deploy/
cp frontend/package.json tmp-heroku-deploy/
cp frontend/package-lock.json tmp-heroku-deploy/
cp frontend/Procfile tmp-heroku-deploy/  # Create this if needed

cd tmp-heroku-deploy
git init
git remote add heroku https://git.heroku.com/photo-palettes-frontend.git
git add .
git commit -m "Deploy frontend"
git push -f heroku main
cd ..
rm -rf tmp-heroku-deploy

heroku open photo-palettes-frontend