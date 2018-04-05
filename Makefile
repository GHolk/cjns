
cjns.zip: *.html *.js *.css
	7z u cjns.zip $?

exercise_all_in_one.zip: *Exercise.*
	7z u exercise_all_in_one.zip $?

