url="http://localhost:4173/";
cd $(dirname "$0");
git pull;
npm run build;
clear;
xdg-open "$url";
npm run preview;