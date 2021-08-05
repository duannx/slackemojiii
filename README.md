# slackemojiii
Tool for automating upload emoji to Slack. <br>
If you are consider where to download emojis, you can visit https://slackmojis.com/ and use this tool to download https://github.com/ethanfann/slackmojis-downloader

## Install
### 1. Clone the project
```sh
git clone git@github.com:duannx/slackemojiii.git
```
### 2. Install dependences
```sh
cd slackemojiii
npm install
```
### 3. Config
Open `.env` file in your favorite code editor and fill your information. 
The config includes your work space name, your user name and password of Slack, and the directory where to keep all the emojis.
### 4. Run
```sh
npm run dev
```
or specific the directory path
```sh
npm --directory="path-to-emoji-directory" run dev
```
The program will open a chrome browser window and start uploading emojis. Your work now is waiting it complete <br>
**Note that:** Your directory should only contain image files and no sub categories.
