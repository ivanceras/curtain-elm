.PHONY: clean all default

main.js : src/Main.elm src/WindowList.elm src/Window.elm src/Tab.elm src/Field.elm src/Row.elm
	elm make src/Main.elm --output main.js

all: main.js


clean: 
	rm main.js
