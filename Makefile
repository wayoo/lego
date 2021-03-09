sync_to_main:
	cp -r src/views/decoration ../modular-admin-fe/src/views/
	rm -rf ../modular-admin-fe/src/store && cp -r src/store ../modular-admin-fe/src/