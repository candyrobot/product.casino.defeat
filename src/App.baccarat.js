import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';

// INFO: v3: https://www.chartjs.org/docs/3.9.1/getting-started/v3-migration.html#_3-x-migration-guide
import {
	Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js'; 
import { Line } from 'react-chartjs-2';

import { Baccarat } from './lib/game.Baccarat';
import { BaccaratDrawer } from './lib/game.BaccaratDrawer';
import { MethodChibisuke, MethodGoldbach } from './lib/game.BaccaratBettingSystem';
import Chibisuke from './lib/method.Chibisuke';

Chart.register(
	CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
)
let totalAmount = 0


// INFO: Create Game data
// const PLAYING_SHOE_NUM = 100
// let shoes = []
// for (var i = 0; i < PLAYING_SHOE_NUM; i++) {
// 	shoes.push(new Baccarat().playShoe())
// }
// localStorage.setItem('shoes_ver4', JSON.stringify(shoes))



// INFO: Load Game data
let shoes = JSON.parse(localStorage.getItem('shoeResults_3'))
console.log('shoes:', shoes)



// INFO: Betting System
// let methodChibisuke = new MethodChibisuke()
shoes = shoes.map((shoeResult) => {
	let methodGoldbach = new MethodGoldbach()
	let methodChibisuke = new MethodChibisuke()
	shoeResult = shoeResult.map((gameDetail) => {
		return {
			...gameDetail,
			amountFromGoldbach: methodGoldbach.getAmount(gameDetail),
			amountFromChibisuke: methodChibisuke.getAmount(gameDetail)
		}
	})
	totalAmount += shoeResult[shoeResult.length - 1].amountFromChibisuke
	return shoeResult
})



// INFO: drawing html
let html = shoes.map((v, i) => {
	let baccaratDrawer = new BaccaratDrawer(v)
	return [
	<div className={`shoe-group shoe-number${i + 1}`}>
		<h5>{`shoe${i + 1}`}</h5>
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
		// const labels = methodChibisuke.getAmountHistory().map((v, i) => i)
		// const data = {
		// 	labels: labels,
		// 	datasets: [{
		// 		label: '資産推移',
		// 		data: methodChibisuke.getAmountHistory(),
		// 		fill: false,
		// 		borderColor: 'rgb(75, 192, 192)',
		// 		tension: 0.1
		// 	}]
		// };
		return (
			<div className="App">
				<header className="App-header">
					<div>{html}</div>
					{/*<Line
						height={80}
						data={data}
					/>*/}
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						totalAmount: {totalAmount - 50000}
						<br />
						<code>src/App.js</code> and save to reload.
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
