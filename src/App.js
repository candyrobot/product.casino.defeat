import logo from './logo.svg';
import './App.css';
import Baccarat from './lib/game.Baccarat';
import Chibisuke from './lib/method.Chibisuke';

let baccarat = null
let totalPlayerWins = 0
let totalBankerWins = 0
let csv = 'Player,Game Number,Amount'
let totalResults = []
const NUMBER_OF_GAME = 10000
let numberOfGame = 0
let players = [new Chibisuke()]
let bankruptcyNum = 0
let winningCount = 0

// INFO: for counting
function getPosition() {
	let count = baccarat.getCount()
	if (count >= 10)
		return 'BANKER'
	else if (count <= -10)
		return 'PLAYER'
	else
		return 'LOOK'
}

while (numberOfGame <= NUMBER_OF_GAME) {
	baccarat = new Baccarat()
	baccarat.playGames((result, history) => {
		// if (result == 'TIE' || history.isPlayerStreak(3)) return;
		if (result == 'TIE') return;
		
		let position = Math.random() < .5 ? 'BANKER' : 'PLAYER' // getPosition()
		if (position === 'LOOK') return;
		
		let player = players[players.length - 1]
		if (position === 'PLAYER') {
			player.setValue(result == 'PLAYER' ? player.getBetValue() : -player.getBetValue())
			if (result == 'PLAYER') winningCount++;
			console.log(`${numberOfGame} BET: P`, result == 'PLAYER')
		} else if (position === 'BANKER') {
			player.setValue(result == 'BANKER' ? player.getBetValue() * .95 : -player.getBetValue())
			if (result == 'BANKER') winningCount++;
			console.log(`${numberOfGame} BET: B`, result == 'BANKER')
		} else
			console.warn('例外発生')
		
		csv += `\nPlayer ${players.length}, ${player.amounts.length}, ${player.amount}`
		
		if (player.amount > 0 && player.amount < player.INITIAL_AMOUNT * 2);
		else {
			if (player.amount <= 0) bankruptcyNum++;
			players.push(new Chibisuke())
		}
		numberOfGame++
	})

	let data = baccarat.getResults()
	totalPlayerWins += data.playerWins
	totalBankerWins += data.bankerWins
	// setTimeout(()=> {
	// 	document.write(baccarat.draw(data.scoreboard))
	// }, 1000)

	totalResults = totalResults.concat(data.results)
}

// console.log(csv)
console.log(`勝率 ${winningCount / NUMBER_OF_GAME * 100}%`)
console.log(`${bankruptcyNum} / ${players.length} 破産確率 ${bankruptcyNum/players.length*100}%`)

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

function App() {
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
	);
}

export default App;
