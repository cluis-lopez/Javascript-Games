# Usage ./genJS.sh <folder> <outputfile>
# Where <folder> contsins a collection of text files each one with the collection of RAE words
# of a fixed length ordered alphabetically
#
# <outputfile> will be a Javascript compatible file with a NxM matrix (JS List) where N is the legth 
# of words (n=0 => length =1, n=1 => lenght=2, ...)


FILES=$(find $1 -name *.txt)
OUT=$2

echo "rae_words = [" > $OUT

for file in $FILES
do
    echo "Procesando " $file
    echo "[" >> $OUT
    LINES=$(cat $file)
    for word in $LINES
    do
        echo \"$word\""," >>$OUT
    done
    sed -i '$ s/.$//' $OUT #Remove last colon
    echo "]," >> $OUT
done
sed -i '$ s/.$//' $OUT #Remove last colon
echo "]" >> $OUT