# Converts directory of xlsx files to csv
clear
RED='\033[0;31m'
NC='\033[0m' # No Color
printf "${RED}First ensure all xlsx files do not have any whitespace in the file name. \nAlso, make sure 'gnumeric' is installed.${NC} \n \n"
read -p "Enter full path to directory containing the xlsx files you want to convert: " path
read -p "Enter full path to directory where you want the converted CSV files to be placed: " pathCSV
cd
cd $path
for f in *; 
    do fileOutput=$(basename $f .xlsx).csv;
    fileInput=$(basename $f); 
    ssconvert $fileInput $fileOutput
    cd
    mv $path/$fileOutput $pathCSV/$fileOutput
    cd $path
    printf $fileInput converted to $fileOutput;
    done
exit
