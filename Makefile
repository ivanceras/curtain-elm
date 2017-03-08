.PHONY: clean all default

ELM_FILES := $(wildcard src/*.elm)
WEB_FILES := $(wildcard web/*)


curtain.js : $(ELM_FILES)
	/Users/lee/elm17/node_modules/elm/binwrappers/elm-make src/Main.elm --yes --output build/curtain.js

build_web: $(WEB_FILES)
	cp -r web/* build

compress: curtain.js
	uglify -s build/curtain.js -o build/curtain.min.js
	sed -i -- 's/curtain.js/curtain.min.js/g' build/index.html

all: build_web curtain.js compress


clean: 
	rm -r build/*
