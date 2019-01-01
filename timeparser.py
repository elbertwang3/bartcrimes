import operator,sys
from datetime import datetime
import csv
from time import time
from collections import defaultdict


#init(dict count_mat) takes in an empty dictionary
#and initializes every (day,hour) pair to zero
'''def init(count_mat):
    count_mat = {} #dictionary mapping tuples (day, hour) to counts of crime
    for day in range(7): #days of week
    	for h in range(24): #hours of day
    		count_mat[(day+1, h)] = 0
    return count_mat'''

count_dict = defaultdict(int)
count_all_dict = defaultdict(int)
def count_crime(data):
    """This method parses crime dataset and derives the count of crime
    sent at various day,hour pairs.
    Input: file containing crime data in CSV format.
    Hint : Use the Python datetime module 
    """
    # TODO : Fill in count_mat
    reader = csv.reader(data)
    next(reader)
    count = 0
    for row in reader:
        # TODO : CODE HERE
        #print(row)
        currDate = row[2]
        #print(currDate)
        datetimeobject =  datetime.strptime(currDate, "%Y-%m-%dT%H:%M:%SZ")
        #print(datetimeobject)
        weekday = datetimeobject.isoweekday()
        hour = datetimeobject.hour
        #print(weekday)
        #print(hour)
        
        station = row[5]

        if station == "Pittsburg Center":
            count += 1
            print(row)
            print(station)
        count_dict[(weekday,hour,station)] += 1
        count_all_dict[(weekday,hour,'all')] += 1
    for key, value in count_dict.items():
        print(key, value)

    print(count)

def main():
    data = open(sys.argv[1], 'r') 
    count_crime(data)

    out = open(sys.argv[2], 'w')
    out.write("day,hour,station,value\n")
    
    #sort by day, hour (ascending)
    sorted_counts = sorted(count_dict.items(), key=operator.itemgetter(0))
    for (x, y) in sorted_counts:
        out.write(str(x[0])+","+str(x[1])+','+str(x[2])+","+str(y)+"\n")
    sorted_counts_all = sorted(count_all_dict.items(), key=operator.itemgetter(0))
    for (x, y) in sorted_counts_all:
        out.write(str(x[0])+","+str(x[1])+','+str(x[2])+","+str(y)+"\n")
    out.close()

if __name__ == '__main__':
    main()