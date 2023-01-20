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

// ベッティングシステム
// let amount = 500

const deckResults = []
for (var i = 0; i < PLAYING_DECK_NUM; i++) {
	deckResults.push(new Baccarat().playDeck())
}

// console.log('deckResults:', deckResults)

let html = deckResults.map((v, i) => [
	new BaccaratDrawer(v).getScoreboardAsHtml(),
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
