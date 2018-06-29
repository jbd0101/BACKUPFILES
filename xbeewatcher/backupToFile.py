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
print(colored("------------Traitement du backup -----------","yellow"))
nmbr_warning = 0
nmbr_errors = 0


for filename in glob.glob(os.path.join('backup/backup.txt')):
  f = open(str(filename), 'r')
  reader = csv.reader(f,delimiter='$', quotechar='"')
  sensor_name = ""

  for line in reader:
    try:
      dicoVall = line[0]+'-'
      for i in range(len(line)):
        cell = line[i]
      allSensors.append("00:00:00;"+";".join(line))
    except Exception as e:
      nmbr_errors +=1


  # allData.append(sensor)
print(colored("nombre d erreurs : "+ str(nmbr_errors),"red"))
allSensors =sorted(allSensors)
print(allSensors)
