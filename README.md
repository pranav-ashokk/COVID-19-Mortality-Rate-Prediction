# COVID-19 Models and Analysis
This project aims to provide detailed statistical analysis and create accurate predictive models of the COVID-19 outbreak. The primary predictive model is a regression model that predicts the number of deaths caused by COVID-19 in the U.S. 

This project was created using Python (in Jupyter Notebooks), JavaScript (in Google Scripts), and Bash (in text editor).

## Background
COVID-19 (Coronavirus Disease) is an infectious respiratory disease caused by a novel coronavirus. The first outbreak of COVID-19 occured in Wuhan, China in December of 2019. Since then, the outbreak has been characterized as a pandemic by the WHO and the disease has been spreading easily and sustainably in communities all around the world. 

Pandemics of respiratory disease follow a somewhat predictable progression that includes 5 main phases. 

First comes the *investigation* phase, and then the *recognition*, *initiation*, and *acceleration* phases. At the end of the acceleration phase, the pandemic is at its peak. After the peak occurs, there will be a decrease in illnesses. This decrease occurs during the final phase: the *deceleration* phase. Different countries (or parts of the same country) can be in different phases of the pandemic at any point in time.

## 1) Collecting Data
Predicting the number of cases or deaths caused by COVID-19 is a regression problem that requires supervised learning. Data regarding COVID-19 has been publicly available since mid-January of 2020 (see [RESOURCES \[1\]](#resources)). This data is used as the basis to create the regression models on the outbreak. 

I am using 5 attributes/features to create the hypothesis function used to predict the number of deaths the next day:
  1. Total number of cases
  2. Total number of serious/critical cases
  3. Total number of recovered cases
  4. Total number of tests
  5. Number of active cases
  Target Feature: Total number of deaths tomorrow
  
I created a web scraper program for Google Sheets (see [CHANGE LOG \[1\]](#change-log)) to automatically extract website data and download it locally. This automatic extraction occurs every day using a timed trigger, bash script (see [CHANGE LOG \[5\]](#change-log)), and a cron job on the script. Then, I created a bash script to convert the XLSX files to CSV files (see [CHANGE LOG \[2\]](#change-log)).

## 2) Preparing the Dataset
I combined all the CSV files and organized them in chronological order. Then, I cleaned the data and took care of missing values. I wrote a Python script (see [CHANGE LOG \[2\]](#change-log)) to handle the data cleaning process and create the final dataset that contains all the data I need in one CSV file. 

I used standardization (converting to z-scores) to scale the features, since this makes it easier for the learning algorithm to learn the weights of the parameters. This also increases the chance of gradient descent converging and converging faster.

## 3) Evaluating Algorithms
I evaluated the model using 10-Fold Cross-Validation (k-Fold CV) since I have a small dataset (less than 100 rows as of now). I decided not to shuffle the data since the model must evaluate on the specified chronological order of the data. I also decided to split the dataset into two (train and test) without having a separate holdout set since I am testing and modifying the model constantly with new data coming in every day.

I built and evaluated 4 different regression algorithms:
  1. Lasso (LAS)
  2. Elastic Net (EN)
  3. Ridge (RID)
  4. Support Vector Regression (SVR)
  
I trained these algorithms using various different learning rates (alpha levels) and evaluated them using different success measurements (mean squared error, explained variance score, r^2, and mean absolute error)

**NOTE: This project is not necessarily meant for others to use as a reliable resource/reference, but rather for my own understanding and apprehension of machine learning modelling and detailed statistical analysis. **

## CHANGE LOG
	[1] 04/18/20 ~ Created 'COVID-19 Data Web Scraper.gs'
				- Google script file that creates google sheets files containing COVID-19 data from worldometers (see RESOURCES[1])
				- Goes through archived website data to retrieve data from a range of hard-coded dates (see RESOURCES[1a])

	    04/22/20 ~ Abstraction of the function
				- I realized that hard-coding dates and allowing a limited range of months makes it difficult for me to reuse the program when updating my data or for future purposes
				- Added parameters for start month/date and end month/date
				- Allowed access to parse over years of website data
				!!Possibly add another parameter for URL and allow the program to be able to parse over any website's data using wayback machine (SEE RESOURCES[1a])

	    05/03/20 ~ Automation of data extraction
				- I found it becoming a hassle to run this script manually every time I wanted to update the data
				- So, I added a timed trigger to run the script every day at 10:00 pm
				- It now uses the in-built javascript Date function for use in the extraction function's parameters 

	[2] 04/19/20 ~ Created 'xlsx_to_csv.sh'
				- Linux bash script that converts a user-specified directory of XLSX files into CSV files and places them in a different user-specified directory

	[3] 04/22/20 ~ Created 'create_dataset.pynb'
				- I used Jupyter Notebook to write the python notebook script
				- This notebook script organizes all the data into one dataframe, filling in missing values accordingly

	    04/24/20 ~ Separate datasets for each country
				- This is a major change in the project as I decided to split country data into separate datasets
				- This way, there is much less data to handle and sort through and produces a much cleaner result
				- I decided to begin with USA and created 'create_USA_dataset.pynb'
					- This script creates a dataset for USA by:

					0) Importing necessary packages/libraries and creating useful functions for convenient use 
					1) Combining CSV data for USA
					2) Cleaning up data
					3) Handling missing data
					4) Updating dataset with new incoming data
					5) Scaling features so that gradient descent will converge (and faster)
					6) Exporting final dataset as CSV file

	    04/28/20 ~ Added an update function
				- I added an update function that adds new data to the existing dataframe
				- The function does most of the formatting and cleaning of data itself, but sometimes requires manual assistance as data can sometimes be very messy

	    04/29/20 ~ Added a column to the dataset called "Total Deaths Tomorrow"
				- This essentially allows the model to use today's stats to predict tommorow's deaths
				- I also dropped the 'Total Deaths' (as of that day) column since the two death columns may be linearly dependent

	    04/30/20 ~ Modified script to create an additional CSV file containing raw data
				- The script now creates a CSV file before adding the "Total Deaths Tomorrow" column and before feature scaling occurs
				- This allows me to create more meaningful visualizations of the data in the train/test script with proper scales

	[4] 04/29/20 ~ Created 'train_test_USA_dataset.pynb'
				- I created another python notebook script on Jupyter Notebook to visualize the data, split the data, evaluate 4 different models and choose the best model for this situation
				- This is accomplished by:

					0) Importing necessary packages/libraries and creating useful functions for convenient use 
					1) Importing data
					2) Visualizing data trends and gaining insight into correlation
					3) Training and testing dataset on various models

	    04/30/20 ~ Added an additional method of evaluating the different models
				- I simply trained and tested the models on the dataset with different success measurements rather than just one (mean squared error, explained variance score, r^2, and mean 					absolute error)
				- I realized that the ridge regression model seemed to have the best success when using only mean squared error because the goal of the model itself is to minimize the mean 					squared error

	[5] 05/03/20 ~ Created 'auto_sync_data.sh'
				- This small bash script uses rclone to locally download the datasets extracted by 'COVID-19 Data Web Scraper.gs'
				- I added a UNIX cron job to this script to run every day at 11:00 pm since the datasets are extracted into my Google Drive everyday at 10:00 pm

## RESOURCES
[1] Supervised learning data from COVID-19 daily data reports posted on https://worldometers.info/coronavirus/
[2] COVID-19 daily testing data from https://ourworldindata.org/grapher/full-list-covid-19-tests-per-day
