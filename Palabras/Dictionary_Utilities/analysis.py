import json

jsonfile1 = open('temporal_rae.json', 'r', encoding='utf8')
rae = json.load(jsonfile1)
jsonfile2 = open('temporal_rankings.json', 'r', encoding='utf8')
rankings = json.load(jsonfile2)


print("Analisis")
print("Diccionario lineas: " + str(len(rae)) + "\t Rankings lineas: " + str(len(rankings)))
for i in range(len(rae)):
    print("Palabras con longitud " + str(i) + ": " + str(len(rae[i])) + "\t Rankings: " + str(len(rankings[i])))

print ("Palabras con ranking cero")
for i in range(len(rae)):
     n = [x for x in rankings[i] if x > 0.0]
     print("Palabras con longitud " + str(i) + ": " + 
           str(len(rae[i])) + "\t Palabras con ranking >0: " + str(len(n))
           + "\t Porcentaje: " + str(100*(len(n)/len(rae[i]))) + "%")