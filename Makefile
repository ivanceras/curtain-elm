.PHONY: clean all default

ELM_FILES := $(wildcard src/*.elm)

main.js : $(ELM_FILES)
	elm make src/Main.elm --output main.js

all: main.js


clean: 
	rm main.js
