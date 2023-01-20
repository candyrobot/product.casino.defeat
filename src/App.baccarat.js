import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';
import { Baccarat, BaccaratDrawer, BaccaratStrategy } from './lib/game.Baccarat';
import Chibisuke from './lib/method.Chibisuke';

const GLOBAL_DATA = []
const PLAYING_DECK_NUM = 10
// let baccaratStrategy = new BaccaratStrategy(baccarat.getPlayingCards())
// let baccaratDrawer = new BaccaratDrawer()

// ベッティングシステム
// let amount = 500

const deckResults = []
for (var i = 0; i < PLAYING_DECK_NUM; i++) {
	deckResults.push(new Baccarat().playDice())
}

console.log('deckResults:', deckResults)

// x: 
// let html = <>hoge{222} {222} <div>hoge</div></>
// for (var i = 0; i < deckResults.length; i++) {
// 	// html += new BaccaratDrawer(deckResults[i]).getScoreboardAsHtml()
// 	new BaccaratDrawer(deckResults[i]).drawHtml()
// }

let html = deckResults.map((v, i) => [
	new BaccaratDrawer(deckResults[i]).getScoreboardAsHtml(),
	<hr />
])

// x:
// for (var i = 0; i < PLAYING_NUM; i++) {
// 	let playedData = baccarat.play(baccaratStrategy.getWager(), baccaratStrategy.getAction())
// 	amount += playedData.income

// 	baccaratStrategy.set(playedData, amount)
// 	baccaratDrawer.set(playedData, i)

// 	if (playedData.isEndOfShoe) {
// 		console.warn('shoe change')
// 		baccarat = new Baccarat()
// 		baccaratStrategy = new BaccaratStrategy(baccarat.getPlayingCards())
// 	}
// 	console.log('====')
// }

// console.log(baccaratDrawer.getCsv())
// setTimeout(function() {
// 	document.write(baccaratDrawer.getScoreboardAsHtml())
// }, 100)

/////////////////////////////////////////////////////////////////

class App extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<div>{html}</div>
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
