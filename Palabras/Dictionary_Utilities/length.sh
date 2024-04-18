# By: @hasecilu

mkdir -pv length

FILENAME=$1
LINES=$(cat $FILENAME)

COUNTER=0

for LINE in $LINES
do
	if [ ${#LINE} -lt 10 ]
	then
		echo $LINE >> ./length/0${#LINE}.txt
	else
		echo $LINE >> ./length/${#LINE}.txt
	fi
	
	COUNTER=$((COUNTER+1))
done
	
wc -l ./length/*