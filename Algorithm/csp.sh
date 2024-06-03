#!/bin/bash

echo "$1"

# attempting to run scheduling algorithm multiple times

# outdated information???
#output_file="output1.txt"
#orignal_profile="profile1.txt"
#updated_profile="newProfile.txt"

#output_file=$1"Output"
#echo $output_file

#orignal_profile=$1"Profile1"
#echo $orignal_profile

#updated_profile=$1"NewProfile"
#echo $updated_profile

# getting out of whatever directory I'm in and switching to right directory
#cd /mnt/web/www/TUSA/Algorithm
#cd public_html
#cd Algorithm

# deleting profile1 and creating it again if it accidently gets locked by website security
rm -f "$1Profile1.txt"
touch $1Profile1.txt

time python3 main.py "$1Profile1" $1

# seeing what the status of the profile is
	if grep -q "Freshman" "$1Profile1.txt"; then
		echo "***Run 12 times Freshman***"
		x=12
	fi
	if grep -q "First Year" "$1Profile1.txt"; then
		echo "***Run 12 times Freshman***"
		x=12
	fi
	if grep -q "Sophomore" "$1Profile1.txt"; then
		echo "***Run 9 times Sophomore***"
		x=9
	fi
	if grep -q "Junior" "$1Profile1.txt"; then
		echo "***Run 6 times Junior***"
		x=6
	fi
	if grep -q "Senior" "$1Profile1.txt"; then
		echo "***Run 3 times Senior***"
		x=3
	fi

i=1
echo "X =="
echo "$x"
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
		time python3 main.py "$1NewProfile" $1
	fi

	i=$(expr $i + 1)
done