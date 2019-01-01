# Bart Crimes Methodology

[Project preview](https://projects.sfchronicle.com/test-proj/bart-crimes)

Ben Friedlander, who was the subject of this Chronicle [story](https://www.sfchronicle.com/news/article/Rider-outs-BART-reports-on-crime-11732835.php) last year, created [bartcrimes.com](https://www.bartcrimes.com/), a site that has scraped the emails of daily police logs of crimes BART police have attended to dating back to March 1, 2006. He told me that he was able to get in contact with someone who had been receiving these email alerts since 2006, so that's how he got those past emails. If you want to get in contact with him, his email address is ben174@gmail.com, and he's very responsive and willing to help.

I was able to obtain the data that powers bartcrimes.com through his publicly available [API](https://www.bartcrimes.com/api/v0/). The data is comprehensive insofar as it is every email alert that BART has sent out since 2006, but we don’t know if BART records every single all crime that has occurred on BART stations here--this is merely what they have chosen to make publicly available via e-mail. We’ve made two FOIA requests to BART to cross-reference this data, but they have yet to get back to us.

## What I did so far
I scraped the API by using `python scraper.py`, and it dumps all of the stations into stations.json and incidents into incidents.json. I cleaned this data as best I could and added a column called station_name which was my guess for which station the incident occurred in if the location field was null based on descriptions of the incident. This cleaned data is the incidents.json file in the `other_data` folder (I didn't want grunt to parse all of it). 

### The data
1. `timesstationsparsed.csv`    
 Run `python timeparser.py other_data/incidents.json data/timesstationsparsed.csv` to get the data necessary for the grid heat map. It counts crimes by day, hour, and station.
2. `groupbystations.csv`  
I ran a SQL query that grouped incidents.json based on station_name and got their counts, populating data/groupbystations.csv. This is the data used for the circles on the map.
3. `byyearbystation.csv`   
I ran a SQL query that grouped incidents.json based on station_name and year and got their counts, populating data/byyearbystation.csv. This is the data used for the line chart. 
4. `monthsparsed.csv, weeksparsed.csv`    
I also looked at trends by month and by week for exploratory analysis.
5. `ridership.csv`
This is the average number of weekday exits per station. I tried to use these numbers to normalize the number of incidents against, but the trends are mostly similar without normalization.

### The code
1. `timeheatmap.js`  
The code for a modular grid heat map. The function chart.cut(`<insert station here>`) creates the chart just for that chart. The default parameter is "all".
2. `weeks.js`
The code for a modular line map. The function chart.cut(`<insert station here>`) creates the chart just for that chart. The default parameter is "all".
3. `crimemap.js`
The leaflet and d3 code for the map with the circles.
4. `awesomplete.js`  
The code for a small library I'm using for autocompletion.
5. `finder.js`  
The code for the autocompletion form. 


## Issues
1. Some incidents had a null location field, and I was not able to get the station for those particular incidents.
2. The new Antioch and Pittsburg Center stations are missing from the stations endpoint in the API, so I added those manually. Running `scraper.py` again will overwrite this.
3. Many location fields were misspelled in various ways (think MacArthur, Macarthur, McArthur, Mac Arthur, MacArthur Station etc.). I did my best in trying to aggregate these together.
4. The dataset includes data about all incidents that BART police have attended to, so that includes incidents that did not take place at or in a particular BART station. I also tried to approximate the location of these incidents to the nearest BART station.
5. Each row in the dataset represents one particular incident, but many have multiple tags. For example, one incident may be tagged with “General”, “Prohibition Order Issued,” and also “Assault Battery.” In order to get a count of incidents for each tag, I had to unnest each incident, so many incidents will be treated as more than one crime. 
6. I chose not to include many tags in the map, because I did not think they should necessarily be classified as crimes. These include: General, Prohibition Order Issued, Court Order Violation, Warrant Arrest, Quality of Life, Outside Assist, Community Events, Investigation Update, Burglary Tools, etc.
7. Some of the dates were inaccurate. Tere were dates before 2006 and after the current date, which I had to manually fix because they were entered incorrectly by whoever wrote the daily police log.
8. In the dataset, no crimes took place between June 7, 2017 - July 12, 2017 (this [article](https://www.sfchronicle.com/news/article/Rider-outs-BART-reports-on-crime-11732835.php) explains why). Thus, When I charted incidents by month, there a curious dip in number of incidents during that interval of time.


> That’s why the June decision by BART Police Chief Carlos Rojas to eliminate a daily police log that detailed criminal incidents was baffling. The replacement was a website that offered users information on the type of crime, date, time and location. It was time-consuming to use and not the best way to get the info to the public.

>After weeks of criticism, the daily crime log was reinstated in July. Of course the problem with the crime log is that many people don’t know how to find it. That’s because you have to subscribe to it — and BART doesn’t make it easy to sign up for the subscription.


### Outliers
Oakland International Airport has a total of 1 incident in the dataset. 

## Additional Work
In order to keep the map up-to-date, someone will need to scrape the incidents data from the API again, clean it, and re-run the scripts and queries so that the data files are populated correctly.

