set -ex

git switch main
npm run build
echo "pta.wouterr.com" > docs/CNAME
git commit -am "deploy"
git push origin main
