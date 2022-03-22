import logo from './logo.svg';
import './App.css';
import Baccarat from './lib/game.Baccarat';
import Chibisuke from './lib/method.Chibisuke';

let baccarat = null
let totalPlayerWins = 0
let totalBankerWins = 0
let csv = 'Player,Game Number,Amount'
let totalResults = []
const NUMBER_OF_PLAYER = 100
let players = [new Chibisuke()]

while (players.length <= NUMBER_OF_PLAYER) {
	console.warn(players[players.length - 1].amount, players)
	baccarat = new Baccarat().playGames((result, results) => {
		if (result == 'TIE' || results.isPlayerStreak(3)) return;
		let player = players[players.length - 1]
		player.setValue(result == 'PLAYER' ? -player.getBetValue() : player.getBetValue())
		csv += `\nPlayer ${players.length}, ${player.amounts.length}, ${player.amount}`
		if (player.amount > 0 && player.amount < player.INITIAL_AMOUNT * 2);
		else {
			players.push(new Chibisuke())
		}
	})

	let data = baccarat.getResults()
	totalPlayerWins += data.playerWins
	totalBankerWins += data.bankerWins
	console.log(data)
	document.write(baccarat.draw(data.scoreboard))

	totalResults = totalResults.concat(data.results)
}

console.log(csv)

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
