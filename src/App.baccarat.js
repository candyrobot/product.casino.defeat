import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';
import Baccarat from './lib/game.Baccarat';
import Chibisuke from './lib/method.Chibisuke';

let baccarat = new Baccarat()

// ベッティングシステム
let MIN_BET_VALUE = 1
let MAX_BET_VALUE = 10
let amount = 500
let playedData = null

// TRY: trueCountに従ってベット額を変える -3以下なら$1, -2: $2, -1: $3, 0: $4
// TRY: 利確したらリセット let arr = [1,3,5]
// TRY: 利確したらリセット let arr = [1,3,2,6]

// shoeの残り枚数, カウント値, amount, wager

for (var i = 0; i < 10000; i++) {
	let trueCount = 0
	if (playedData) {
		let runningCount = playedData.playingCards.getCount()
		let deckNum = playedData.playingCards.get().length / 52
		trueCount = runningCount / deckNum
		console.log(`trueC: ${trueCount}`, `runningC: ${runningCount}`, `deckNum: ${deckNum}`)
	}

	let n = MIN_BET_VALUE // trueCount >= 3 ? MAX_BET_VALUE : MIN_BET_VALUE

	playedData = baccarat.play(n)

	if (n === MAX_BET_VALUE)
		console.error('bet:', n, 'amount:', amount += playedData.income, 'cards', playedData.playingCards.get())
	else
		console.log('bet:', n, 'amount:', amount += playedData.income)

	if (playedData.isEndOfShoe) {
		console.warn('shoe change')
		baccarat = new Baccarat()
		playedData = null
	}
	console.log('====')
}


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
