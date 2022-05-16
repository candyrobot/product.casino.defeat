import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';
import { Baccarat, BaccaratDrawer, BaccaratStrategy } from './lib/game.Baccarat';
import Chibisuke from './lib/method.Chibisuke';

let baccarat = new Baccarat()
let baccaratStrategy = new BaccaratStrategy(baccarat.getPlayingCards())
let baccaratDrawer = new BaccaratDrawer()

// ベッティングシステム
let amount = 500

// TRY: trueCountに従ってベット額を変える -3以下なら$1, -2: $2, -1: $3, 0: $4
// TRY: 利確したらリセット let arr = [1,3,5]
// TRY: 利確したらリセット let arr = [1,3,2,6]

for (var i = 0; i < 10000; i++) {
	let playedData = baccarat.play(baccaratStrategy.getWager(), baccaratStrategy.getAction())
	amount += playedData.income

	baccaratStrategy.set(playedData, amount)
	baccaratDrawer.set(playedData, i)

	if (playedData.isEndOfShoe) {
		console.warn('shoe change')
		baccarat = new Baccarat()
		baccaratStrategy = new BaccaratStrategy(baccarat.getPlayingCards())
	}
	console.log('====')
}

console.log(baccaratDrawer.getCsv())
setTimeout(function() {
	document.write(baccaratDrawer.getScoreboardAsHtml())
}, 100)

/////////////////////////////////////////////////////////////////

class App extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.js</code> and save to reload.
					</p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
				</header>
			</div>
		)
	}
}

export default App;
