#!/usr/bin/env sh

set -xe

# build
npm run build

# add dist directory
git add dist -f

git commit -m "deploy"

git subtree push --prefix dist origin gh-pages
