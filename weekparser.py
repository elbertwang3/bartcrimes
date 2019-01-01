import operator,sys
import datetime
import csv
from time import time
from collections import defaultdict
from datetime import timedelta  

#init(dict count_mat) takes in an empty dictionary
#and initializes every (day,hour) pair to zero

weekDict = defaultdict(int)
def count_crime(data):
    """This method parses crime dataset and derives the count of crime
    sent at various day,hour pairs.
    Input: file containing crime data in CSV format.
    Hint : Use the Python datetime module 
    """
    # TODO : Fill in count_mat
    reader = csv.reader(data)
    next(reader)
    firstdate = datetime.datetime(2006,3,1)
    print(type(firstdate))
    for row in reader:
        # TODO : CODE HERE
        currDate = row[3]
        #print(currDate)
        currDateTime =  datetime.datetime.strptime(currDate, "%Y-%m-%d")
        dateDiff = currDateTime - firstdate
        weekDiff = (int(dateDiff.days/7))
        weekOf = firstdate + timedelta(weeks = weekDiff)
        weekFormatted = weekOf.strftime("%Y-%m-%d")
        print(weekFormatted)
        #print(weekDiff)
        #print(weekOf)
        weekDict[weekFormatted] += 1




    

    #print(counter)
    #return(count_mat)


def main():
    data = open(sys.argv[1], 'r') 
    count_mat = count_crime(data)

    weekDict.
    with open('data/weeksparsed.csv', 'w') as csvfile3:
        writer = csv.writer(csvfile3)
        writer.writerow(['weekof', 'incidents'])
        for key, value in weekDict.items():
            print(key, value)
            writer.writerow([key, value])
    '''out = open(sys.argv[2], 'w')
    out.write("day,hour,value\n")
    
    #sort by day, hour (ascending)
    sorted_counts = sorted(count_mat.items(), key=operator.itemgetter(0))
    for (x, y) in sorted_counts:
        out.write(str(x[0])+","+str(x[1])+','+str(y)+"\n")
    out.close()'''

if __name__ == '__main__':
    main()