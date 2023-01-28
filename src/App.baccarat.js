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
import Chibisuke from './lib/method.Chibisuke';

Chart.register(
	CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
)

// INFO: Create Game data
// const PLAYING_SHOE_NUM = 100
// const shoeResults = []
// for (var i = 0; i < PLAYING_SHOE_NUM; i++) {
// 	shoeResults.push(new Baccarat().playShoe())
// }
// localStorage.setItem('shoeResults_2', JSON.stringify(shoeResults))



// INFO: Load Game data
const shoeResults = JSON.parse(localStorage.getItem('shoeResults_2'))
console.log('shoeResults:', shoeResults)



// INFO: Betting System
let baccaratBettingSystem = new BaccaratBettingSystem()
shoeResults.reduce((amount, shoeResult) =>
	shoeResult.reduce((amount, gameDetail) =>
		baccaratBettingSystem.setGameDetail(gameDetail)
	, undefined)
, undefined)
baccaratBettingSystem.getCsv()



// INFO: drawing html
let html = shoeResults.map((v, i) => {
	let baccaratDrawer = new BaccaratDrawer(v)
	return [
	<div className={`shoe-group shoe-number${i + 1}`}>
		{baccaratDrawer.getScoreboardAsHtml()}
		<div className="graph-counting">
			{baccaratDrawer.getCountingGraphAsHtml()}
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
