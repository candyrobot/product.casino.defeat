import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';

import {
	Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js'; 
import { Line } from 'react-chartjs-2';

import { Baccarat } from './lib/game.Baccarat';
import { BaccaratDrawer } from './lib/game.BaccaratDrawer';
import { BaccaratBettingSystem } from './lib/game.BaccaratBettingSystem';
import { MethodGoldbach } from './lib/method.Goldbach';
import Chibisuke from './lib/method.Chibisuke';

Chart.register(
	CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
)

// INFO: Create Game data
// const PLAYING_SHOE_NUM = 100
// let shoeResults = []
// for (var i = 0; i < PLAYING_SHOE_NUM; i++) {
// 	shoeResults.push(new Baccarat().playShoe())
// }
// localStorage.setItem('shoeResults_4', JSON.stringify(shoeResults))



// INFO: Load Game data
let shoeResults = JSON.parse(localStorage.getItem('shoeResults_3'))
console.log('shoeResults:', shoeResults)



// INFO: Betting System
let baccaratBettingSystem = new BaccaratBettingSystem()
shoeResults = shoeResults.map((shoeResult) => {
	let methodGoldbach = new MethodGoldbach()
	return shoeResult.map((gameDetail) => {
		baccaratBettingSystem.setGameDetail(gameDetail)
		return {
			...gameDetail,
			amountFromGoldbach: methodGoldbach.getAmount(gameDetail)
		}
	})
})



// INFO: drawing html
let html = shoeResults.map((v, i) => {
	let baccaratDrawer = new BaccaratDrawer(v)
	return [
	<div className={`shoe-group shoe-number${i + 1}`}>
		<div className="scoreboard">
			{baccaratDrawer.getScoreboardAsHtml()}
		</div>
		<div className="graph-counting">
			{baccaratDrawer.getCountingGraphAsHtml()}
		</div>
		<div className="graph-amount">
			{baccaratDrawer.getAmountGraphAsHtml()}
		</div>
	</div>,
	<hr />
]})


/////////////////////////////////////////////////////////////////

class App extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		const labels = baccaratBettingSystem.getAmountHistory().map((v, i) => i)
		const data = {
			labels: labels,
			datasets: [{
				label: '資産推移',
				data: baccaratBettingSystem.getAmountHistory(),
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1
			}]
		};
		return (
			<div className="App">
				<header className="App-header">
					<div>{html}</div>
					<Line
						height={80}
						data={data}
					/>
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
