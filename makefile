
git-revert:
	git reset --hard HEAD

git-pull: 
	git pull

git-commit:
    git add -A && git commit -m '-' && git push

goto-github:
	open https://github.com/meg768/rpi-neopixels

goto-npm:
	open https://www.npmjs.com/package/rpi-neopixels

npm-publish:
	npm publish