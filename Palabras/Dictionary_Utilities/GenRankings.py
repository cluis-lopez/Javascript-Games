import csv
import json

rankings = []

csvfile = open("CREA_total.TXT", 'r')
jsonfile = open('temporal_rae.json', 'r', encoding='utf8')

reader = csv.reader( csvfile, dialect="excel-tab")
for row in reader:
    content = list(row[i] for i in [1,3])
    frec = float(content[1])
    l = [content[0], frec]
    rankings.append(l)

rae = json.load(jsonfile)
# Create new version of rae dict 

new_rae =[]
for row in range(len(rae)):
    print ("Procesando linea " + str(row) + " del diccionario")
    temp = []
    for ele in range(len(rae[row])):
        l = 0.0
        temp.append(l)
    new_rae.append(temp)

print ("Generado el nuevo diccionario")
print ("Chequeando rankings...")

cont = 0
total_rae = sum(len(x) for x in rae)
for i in range(len(rankings)):
    l = len(rankings[i][0])
    if (i % 1000 == 0):
         print ("Analizando la linea " + str(i) + " del fichero de rankings. " + str(cont)
                + " palabras con ranking encontradas hasta el momento ("
                + str(100*(cont/total_rae)) + "%)")
    if (l > 0 and l <= len(rae)):
        try:
            indx = rae[l-1].index(rankings[i][0])
            #print ("Match : linea :" + str(i) + " palabra: " + rankings[i][0] + " ranking: " + str(rankings[i][1]))
            new_rae[l-1][indx] = rankings[i][1]
            cont += 1
        except ValueError:
            pass
            
print("Total palabras en el diccionario: " + str(total_rae) +" de las cuales "
      + str(cont) +" tienen ranking (" + str(100*cont/total_rae) +"%)")

json2js = "rae_words_rankings = " + json.dumps(new_rae, indent=4)

with open("rankings.js", "w") as f:
        f.write(json2js)

print("Analisis")
print("Diccionario lineas: " + str(len(rae)) + "\t Rankings lineas: " + str(len(new_rae)))
for i in range(len(rae)):
    print("Palabras con longitud " + str(i) + ": " + str(len(rae[i])) + "\t Rankings: " + str(len(new_rae[i])))

print ("Palabras con ranking cero")
for i in range(len(rae)):
     n = [x for x in new_rae[i] if x > 0.0]
     print("Palabras con longitud " + str(i) + ": " + 
           str(len(rae[i])) + "\t Palabras con ranking >0: " + str(len(n))
           + "\t Porcentaje: " + str(100*(len(n)/len(rae[i]))) + "%")