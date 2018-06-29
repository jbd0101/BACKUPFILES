import csv
import glob, os, math
import geopy.distance
import matplotlib.pyplot as plt
import numpy as numpy
import matplotlib as mpl
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import matplotlib.pyplot as plt
from termcolor import colored
from scipy.ndimage import gaussian_filter
from pick import pick
from datetime import datetime

sensors = {}
allSensors = []
print('''
 ______   _______  _______  _        _______
(  __  | (  ____ |(  ___  )( (    /|(  ____ |
| (  |  )| (    |/| (   ) ||  |  ( || (    |/
| |   ) || (_____ | (___) ||   | | || |
| |   | |(_____  )|  ___  || (| |) || | ____
| |   ) |      ) || (   ) || | |   || | |_  )
| (__/  )/|____) || )   ( || )  |  || (___) |
(______/ |_______)|/     |||/    )_)(_______)

 _______  _______  _______  _______           _______
(  ____ |(  ____ )(  ___  )(  ____ )||     /|(  ____ |
| (    |/| (    )|| (   ) || (    )|| )   ( || (    |/
| |      | (____)|| (___) || (____)|| (___) || (_____
| | ____ |     __)|  ___  ||  _____)|  ___  |(_____  )
| | |_  )| (| (   | (   ) || (      | (   ) |      ) |
| (___) || ) | |__| )   ( || )      | )   ( |/|____) |
(_______)|/   |__/|/     |||/       |/     |||_______)


  ''')
#From text to array
print(colored("------------Importation des donnees -----------","yellow"))
nmbr_warning = 0
nmbr_errors = 0
#start_hour = input("heure de depart hh:mm:ss ex 22:10:10 : ")
#start_hour = datetime.strptime("15/01/2017 "+start_hour, '%d/%m/%Y %H:%M:%S').strftime('%s')
#print(start_hour)


for filename in glob.glob(os.path.join('*.txt')):
  f = open(str(filename), 'r')
  reader = csv.reader(f,delimiter=';', quotechar='"')
  sensor_name = ""
  for line in reader:
    sensor_name = str(line[1])
    for i in range(2,len(line)):
      sensors[sensor_name+"-"+str(i-2)]= []
      allSensors.append(sensor_name+"-"+str(i-2))
    break
  print("Sensor: " + colored(sensor_name,'cyan') +"  "+colored("[OK]","green"))

  dicoVall = sensor_name+'-'
  for line in reader:
    for i in range(2,len(line)):
      cell = line[i]
      try:
        if math.isnan(float(cell)) is not True:
          sensors[dicoVall+str(i-2)].append(float(cell))
      except Exception as e:
        try:
          if math.isnan(float(cell)) is not True:
            sensors[dicoVall+str(i-2)] = [float(cell)]
            nmbr_warning += 1
        except:
          nmbr_errors += 1

  # allData.append(sensor)
print(colored("nombre de warnings : "+ str(nmbr_warning),"yellow"))
print(colored("nombre d erreurs : "+ str(nmbr_errors),"red"))
def createSimpleGraph(x,label):
  for i in range(len(x)):
    plt.plot(x[i])
  plt.ylabel(label)
  plt.show()


print(colored("------------Fin de l'importation des données ----------","yellow"))
0
'''
Simple graphs :-)
'''
#altitude vs altitude, sensors["n-2"]
if(input("gaussian test filter ? y / n ")=="y"):
  createSimpleGraph([sensors["BMP-2"],gaussian_filter(sensors["BMP-2"], sigma=2.5)],"gaussian and no gaussian")

# createSimpleGraph([altitude1,altitude2],"altitude")
if(input("bmp altitude vs gps altitude? y / n ")=="y"):
  createSimpleGraph([gaussian_filter(sensors["BMP-2"], sigma=1.5),gaussian_filter(sensors["n-2"], sigma=1.5)],"altitude vs altitude1")


'''
Special graphs : tout graphique qui doit avoir ses donnees retraites ;-)
              ("`-''-/").___..--''"`-._
               `6_ 6  )   `-.  (     ).`-.__.`)
               (_Y_.)'  ._   )  `._ `. ``-..-'
             _..`--'_..-_/  /--'_.' ,'
           (il),-''  (li),'  ((!.-'
'''

#gps
firstx = sensors["n-0"][0]
firsty = sensors["n-1"][0]
base_coords = (firstx,firsty)
positionXinM = []
positionYinM = []
altitude = []
for i in range(len(sensors["n-0"])):
  try:
    x = sensors["n-0"][i]
    y = sensors["n-1"][i]
    if(x>55 or y > 8 or sensors["n-1"][i] > 100):
      continue
    coordsX = (x,firsty)
    coordsY = (firstx,y)
    distX = geopy.distance.vincenty(coordsX, base_coords).m
    disty = geopy.distance.vincenty(coordsY, base_coords).m
    positionXinM.append(disty)
    positionYinM.append(distX)
    altitude.append(sensors["n-2"][i])
  except Exception as e:
    continue
print(altitude.sort()[0])




'''
          3D graphs (enfin dans ce cas si c est du 4C (jeux de mots pourri))
   ||_._/|        ||__/|        ||__/,|        ||_._/|
   | o o |        |  o o|        |o o  |        | 0 0 |
   (  T  )        (   T )        ( T   )        (  T  )
  .^`-^-'^.      .^`--^'^.      .^`^--'^.      .^`-^-'^.
  `.  ;  .'      `.  ;  .'      `.  ;  .'      `.  ;  .'
  | | | | |      | | | | |      | | | | |      | | | | |
 ((_((|))_))    ((_((|))_))    ((_((|))_))    ((_((|))_))
'''
mpl.rcParams['legend.fontsize'] = 10

if(input("projection 3d de l'altitude ? y / n ")=="y"):
  fig = plt.figure()
  ax = fig.gca(projection='3d')
  x_len = len(positionXinM)
  gps_points_filtered = gaussian_filter([positionXinM[0:x_len],positionYinM[0:x_len],altitude[0:x_len]], sigma=0.5)
  # ax.plot(positionXinM[0:x_len],positionYinM[0:x_len],altitude[0:x_len], label='parametric curve')
  ax.plot(gps_points_filtered[0],gps_points_filtered[1],gps_points_filtered[2],label='parametric curve')
  ax.legend()
  plt.show()




#manually graphs
#manually graphs
#manually graphs
#manually graphs

while(True):
  charts = []
  #vider les sensors inutile
  newAllSensors = []
  for s in range(len(allSensors)):
    if(len(sensors[allSensors[s]])>5):
      newAllSensors.append(allSensors[s])
  allSensors= newAllSensors
  charts.append(pick(allSensors, "Choisissez la premiere donnee", multi_select=False, min_selection_count=1)[0])
  while(True):
    continuer = pick(["oui","non"], "Autre donnee ?", multi_select=False, min_selection_count=1)[0]
    if("non" in continuer):
      break
    else:
      charts.append(pick(allSensors, "Choisissez une autre donnée", multi_select=False, min_selection_count=1)[0])

  values = []
  for element in charts:
    values.append(gaussian_filter(sensors[element],sigma = 1.5))
  label = input("Entrer le label : ")
  createSimpleGraph(values,label)
  if("n" in input("Voulez vous faire un autre graphique ? y/n ")):
    break
