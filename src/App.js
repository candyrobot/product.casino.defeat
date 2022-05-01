import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';
import Blackjack from './lib/game.Blackjack';
import StrategyBlackjack from './lib/strategy.Blackjack'
import Chibisuke from './lib/method.Chibisuke';

let blackjack = new Blackjack()

// ベッティングシステム
let MIN_BET_VALUE = 0
let MAX_BET_VALUE = 10
let amount = 500
let playedData = null

// TRY: trueCountに従ってベット額を変える -3以下なら$1, -2: $2, -1: $3, 0: $4
// TRY: 利確したらリセット let arr = [1,3,5]
// TRY: 利確したらリセット let arr = [1,3,2,6]

for (var i = 0; i < 10000; i++) {
	let trueCount = 0
	if (playedData) {
		let runningCount = playedData.playingCards.getCount()
		let deckNum = playedData.playingCards.get().length / 52
		trueCount = runningCount / deckNum
		console.log(`trueC: ${trueCount}`, `runningC: ${runningCount}`, `deckNum: ${deckNum}`)		
	}

	let n = trueCount >= 3 ? MAX_BET_VALUE : MIN_BET_VALUE

	playedData = blackjack.play(n)

	if (n === MAX_BET_VALUE)
		console.error('bet:', n, 'amount:', amount += playedData.income, 'cards', playedData.playingCards.get())
	else
		console.log('bet:', n, 'amount:', amount += playedData.income)

	if (playedData.isEndOfShoe) {
		console.warn('shoe change')
		blackjack = new Blackjack()
		playedData = null
	}
	console.log('====')
}







// let baccarat = null
// let totalPlayerWins = 0
// let totalBankerWins = 0
// let csv = 'Player,Game Number,Amount'
// let totalResults = []
// const NUMBER_OF_GAME = 10000
// let numberOfGame = 0
// let players = [new Chibisuke()]
// let bankruptcyNum = 0
// let winningCount = 0

// while (numberOfGame <= NUMBER_OF_GAME) {
// 	baccarat = new Baccarat().playGames((result, results) => {
// 		// if (result == 'TIE' || results.isPlayerStreak(3)) return;
// 		if (result == 'TIE') return;
		
// 		let player = players[players.length - 1]
// 		if (Math.random() < .5) {
// 			player.setValue(result == 'PLAYER' ? player.getBetValue() : -player.getBetValue())
// 			if (result == 'PLAYER') winningCount++;
// 			console.log(`${numberOfGame} BET: P`, result == 'PLAYER')
// 		} else {
// 			player.setValue(result == 'BANKER' ? player.getBetValue() : -player.getBetValue())
// 			if (result == 'BANKER') winningCount++;
// 			console.log(`${numberOfGame} BET: B`, result == 'BANKER')
// 		}
		
// 		csv += `\nPlayer ${players.length}, ${player.amounts.length}, ${player.amount}`
		
// 		if (player.amount > 0 && player.amount < player.INITIAL_AMOUNT * 2);
// 		else {
// 			if (player.amount <= 0) bankruptcyNum++;
// 			players.push(new Chibisuke())
// 		}
// 		numberOfGame++
// 	})

// 	let data = baccarat.getResults()
// 	totalPlayerWins += data.playerWins
// 	totalBankerWins += data.bankerWins
// 	// document.write(baccarat.draw(data.scoreboard))

// 	totalResults = totalResults.concat(data.results)
// }

// // console.log(csv)
// console.log(`勝率 ${winningCount / NUMBER_OF_GAME * 100}%`)
// console.log(`${bankruptcyNum} / ${players.length} 破産確率 ${bankruptcyNum/players.length*100}%`)

/////////////////////////////////////////////////////////////////

// max_num = 100
// players = []
// baccarat = null

// while (players.length <= max_num) {
// 	baccarat = new Baccarat()
// 	players[players - 1].resetDebt() // 戦略: シューが新しくなったらリセット
// 	while (baccarat is exist) {
// 		csv += ''
// 		if (players[players - 1].xxx)
// 			players.push(player)
// 	}
// }

/////////////////////////////////////////////////////////////////

class App extends Component {

	constructor(props) {
		super(props)
		this.numbers = [1,2,3,4,5,6,7,8,9,10]
		this.state = {
			playerNums: [],
			dealerNums: [],
			action: 'null'
		}
		this.strategyBlackjack = new StrategyBlackjack()
		this.isJustFinishedCalc = false
	}

	addNumberToPlayer(n) {
		if (this.isJustFinishedCalc) {
			this.reset()
			this.isJustFinishedCalc = false
		}
		this.state.playerNums.push(n)
		this.setState({ playerNums: this.state.playerNums })
	}

	delNumToPlayer() {
		this.state.playerNums.pop()
		this.setState({ playerNums: this.state.playerNums })
	}

	addNumberToDealer(n) {
		if (this.isJustFinishedCalc) {
			this.reset()
			this.isJustFinishedCalc = false
		}
		this.state.dealerNums.push(n)
		this.setState({ dealerNums: this.state.dealerNums })
	}

	delNumToDealer() {
		this.state.dealerNums.pop()
		this.setState({ dealerNums: this.state.dealerNums })
	}

	calc() {
		let a = this.strategyBlackjack.getAction(this.state.playerNums, this.state.dealerNums[0])
		switch(a) {
			case 'H':
				this.setState({ action: 'Hit' })
				break
			case 'S':
				this.setState({ action: 'Stand' })
				break
			case 'P':
				this.setState({ action: 'Split' })
				break
			case 'D':
				this.setState({ action: 'Double' })
				break
		}
		this.isJustFinishedCalc = true
	}

	reset() {
		// INFO: こうしないと`[]`になってくれないんだけど??
		this.state = {
			playerNums: [],
			dealerNums: [],
		}
		this.setState({ playerNums: this.state.playerNums })
		this.setState({ dealerNums: this.state.dealerNums })
	}

	render() {
		return (
			<div className="App">
				<h2>
					<span>{this.state.action}</span>
				</h2>
				<div className="section">
					<h3>
						<span>{this.state.playerNums}</span>
					</h3>
					{this.numbers.map((n) => {
						return <Button variant="success" className="size-tiled" onClick={() => this.addNumberToPlayer(n)}>{n}</Button>
					})}
					<Button variant="success" className="size-tiled" onClick={() => this.delNumToPlayer()}>←</Button>
				</div>
				<div className="section">
					<h3>
						<span>{this.state.dealerNums}</span>
					</h3>
					{this.numbers.map((n) => {
						return <Button variant="danger" className="size-tiled" onClick={() => this.addNumberToDealer(n)}>{n}</Button>
					})}
					<Button variant="danger" className="size-tiled" onClick={() => this.delNumToDealer()}>←</Button>
				</div>
				<div className="section">
					<Button variant="info" size="lg" onClick={() => this.calc()}>Calculate</Button>
				</div>

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
