JS = $(wildcard js/*.js)
.PHONY: run check zip
run:
	python3 -m http.server 8000
check:
	@for f in $(JS); do node --check $$f || exit 1; done
zip: check
	cd .. && zip -qr nexus.zip nexus -x "*.zip"
