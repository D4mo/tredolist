release:
	zip -r tredolist.zip . -x ".*" -x "*.md" -x "screenshots/*" -x ".DS_Store" -x "css/.DS_Store"
