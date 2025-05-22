# Usage ./genJS.sh <folder> <outputfile>
# Where <folder> contsins a collection of text files each one with the collection of RAE words
# of a fixed length ordered alphabetically
#
# <outputfile> will be a Javascript compatible file with a NxM matrix (JS List) where N is the legth 
# of words (n=0 => length =1, n=1 => lenght=2, ...)


INPUT=$1
OUTPUT=rae_words.js

echo "const rae_dict = [" > $OUTPUT

LINES=$(cat $INPUT)

for word in $LINES
do
    echo \"$word\""," >>$OUTPUT
done

sed -i '$ s/.$//' $OUTPUT #Remove last colon
echo "]" >> $OUTPUT