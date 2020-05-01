#!/bin/bash

/usr/bin/rclone copy --update --verbose --contimeout 60s --timeout 300s --retries 3 --low-level-retries 10 "remote:covid_19_data_auto_sync" "/home/pranav/Documents/COVID19/COVID19_Data/usa_data/xlsx_temp"
