import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';
import { Baccarat, BaccaratDrawer } from './lib/game.Baccarat';
import { BaccaratBettingSystem } from './lib/game.BaccaratBettingSystem';
import Chibisuke from './lib/method.Chibisuke';


// INFO: ゲームデータの生成
const PLAYING_DECK_NUM = 10
const shoeResults = []
for (var i = 0; i < PLAYING_DECK_NUM; i++) {
	shoeResults.push(new Baccarat().playShoe())
}
// console.log('shoeResults:', shoeResults)



// INFO: ベッティングシステム
let baccaratBettingSystem = new BaccaratBettingSystem()
shoeResults.reduce((amount, shoeResult) =>
	shoeResult.reduce((amount, gameDetail) =>
		baccaratBettingSystem.setGameDetail(gameDetail)
	, undefined)
, undefined)
baccaratBettingSystem.getCsv()



// INFO: 罫線の描画
let html = shoeResults.map((v, i) => [
	new BaccaratDrawer(v).getScoreboardAsHtml(),
	<hr />
])


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
