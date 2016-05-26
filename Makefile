.PHONY: clean all default

main.js : src/Tab.elm src/Field.elm src/Row.elm
	elm make src/Tab.elm --output main.js

all: main.js


clean: 
	rm main.js
