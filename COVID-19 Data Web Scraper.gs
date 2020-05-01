//Calls on the function importCOVIDData with specified parameters
function callFunction(){
  importCOVIDData(2020, 1, 29, 2020, 4, 22);
}

//Input years as 4-digit integers, months as integers in the range 1-12 and dates as integers in the range 1-31
function importCOVIDData(startYear, startMonth, startDate, endYear, endMonth, endDate) {

  var year = startYear;
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var monthNum = startMonth;
  var month = months[monthNum-1];
  var date = startDate;
  Logger.log('year = ' + year + ', monthNum = ' + monthNum + ', and date = ' + date);

  //Creates new spreadsheet with name in the format month_date for all dates in the given range
  while(!(year==endYear && monthNum==endMonth && date==(endDate+1))){

    var ssnew = SpreadsheetApp.create(month + "_" + date + "_" + year);

    //Converts the given month and date to number format to use in URL
    var URLnum;

    if(monthNum<10){URLnum = "" + 0 + monthNum}
    else{URLnum = "" + monthNum}

    if(date<10){URLnum = "" + URLnum + 0 + date;}
    else{URLnum = "" + URLnum + date}

    //Imports table from website to spreadsheet
    var URL = '"https://web.archive.org/web/' + year;
    URL = URL + URLnum + '/https://www.worldometers.info/coronavirus/"';

    var cell = ssnew.getRange("A1");
    var param = "=IMPORTHTML(" + URL + ', "table", 3)';
    //Logger.log(param);
    //Logger.log('year = ' + year + ', monthNum = ' + monthNum + ', and date = ' + date);
    cell.setFormula(param);

    //Handles the changing of the months
    if(date == 30 && (monthNum==4 || monthNum==6 || monthNum==9 || monthNum==11)){
      monthNum++;
      date = 1;
    }

    else if((monthNum==2 && date==28 && year%4!=0)||(monthNum==2 && date==29 && year%4==0)){
      monthNum++;
      date = 1;
    }

    //Accounts for the hole in the data on February 9th
    else if(date==8 && month=="February"){date = 10;}

    else if(date==31){
      if(monthNum==12){
        monthNum=1;
        year++;
      }

      else{monthNum++;}
      date = 1;
    }

    else{date++;}

    month = months[monthNum-1];
}
}
