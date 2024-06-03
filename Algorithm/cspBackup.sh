time python3 mainBackup.py "$1Profile1" $1


# seeing what the status of the profile is
	if grep -q "Freshman" "$1Profile1.txt"; then
		echo "***Run 12 times***"
		x=12
	fi
	if grep -q "Sophomore" "$1Profile1.txt"; then
		echo "***Run 9 times***"
		x=9
	fi
	if grep -q "Junior" "$1Profile1.txt"; then
		echo "***Run 6 times***"
		x=6
	fi
	if grep -q "Senior" "$1Profile1.txt"; then
		echo "***Run 3 times***"
		x=3
	fi

i=1
while [ $i -lt $x ]; 
do 
	echo "This Algorithm has run $i times!"

	# seeing if an error message is sent to the output file

	# currently this can happen if there are no courses in the course list
	# if there are no possible solutions because of the major course sequencing
	# we may also want to check their taken courses depending on their status?
	# we should also create different error messages for more clarity 

	if grep -q "Error: Cannot Generate Schedule" "$1.txt"; then
		echo "***Error Message Found***"
		break
	else
		time python3 mainBackup.py "$1NewProfile" $1
	fi

	i=$(expr $i + 1)
done







