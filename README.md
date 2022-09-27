
# Daily Wordle Bot
<p align="center">
  <img src="https://user-images.githubusercontent.com/12134641/192357386-e616bd14-4eb1-4118-8afb-86de4726f6f0.gif">
</p>


A Wordle bot that attempts to crack the daily Wordle on the [official Wordle site.](https://www.nytimes.com/games/wordle/index.html) Written in TypeScript. **[ You can see the end product here](https://wordle-daily-solver.herokuapp.com/)**

# Overview
The idea is initially to just make a text base solver but to add challenge I wanted for it to be able to hook onto the official website and play it as a bot. I've always wanted to automate tasks across the web so why not try a browser automation tool. PuppeterJS was used to create this in a WSL Linux enviroment.

# Installation

Install the project with github clone then cd into the folder

```bash
  git clone https://github.com/Phillocity/Wordle-daily-bot.git
  cd Wordle-daily-bot
  npm i
```
You need to set up an .env file with PORT otherwise change it manually on line 5 in the app.ts file. Then run a **npm run start** to build and initialise the project in your localport.

**[Alternatively you can test this out on the deployed website on this link](https://wordle-daily-solver.herokuapp.com/)**

The only caution being Heroku has a request timeout of 30 seconds so it might timeout when generating the answer depending on server speed. As it takes an average of 20 seconds in headless chromium.

# Usage
This will attempt to solve the daily Wordle on the official site then generate a screenshot of the processed keywords it used to generate that answer. The algorithm can be significantly improved but this is the current working verison, one example of improvement is not excluding words with duplicate characters such as **"added"**.
