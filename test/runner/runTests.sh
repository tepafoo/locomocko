#!/bin/bash

# Define the path to your browsers here. This corresponds to the list of browsers defined in karma.conf.js
export OPERA_BIN=/usr/bin/opera
export FIREFOX_BIN=/usr/bin/firefox
export CHROME_BIN=/usr/bin/chromium-browser

# Starts the server and run the tests
node ./node_modules/karma/bin/karma start karma.conf.js run --single-run
