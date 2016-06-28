.PHONY: clean all default

ELM_FILES := $(wildcard src/*.elm)
WEB_FILES := $(wildcard web/*)


curtain.js : $(ELM_FILES)
	elm make src/Main.elm --output build/curtain.js

build_web: $(WEB_FILES)
	cp -r web/* build

all: build_web curtain.js


clean: 
	rm -r build/*
