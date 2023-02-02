import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
let total = {
	amountFromGoldbach: 0,
	amountFromChibisuke: 0
}


// INFO: Create Game data
// const PLAYING_SHOE_NUM = 100
// let shoes = []
// for (var i = 0; i < PLAYING_SHOE_NUM; i++) {
// 	shoes.push(new Baccarat().playShoe())
// }
// localStorage.setItem('shoes_ver6', JSON.stringify(shoes))



// INFO: Load Game data
let shoes = JSON.parse(localStorage.getItem('shoes_ver6'))
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
	total.amountFromGoldbach += shoeResult[shoeResult.length - 1].amountFromGoldbach
	total.amountFromChibisuke += shoeResult[shoeResult.length - 1].amountFromChibisuke
	return shoeResult
})



// INFO: drawing html
let html = shoes.map((v, i) => {
	let baccaratDrawer = new BaccaratDrawer(v)
	return [
	<div className={`shoe-group shoe-number${i + 1}`}>
		<h6>{`shoe${i + 1}`}</h6>
		<Container>
			<Row>
				<Col sm="4" className="graph-counting">
					{baccaratDrawer.getCountingGraphAsHtml()}
				</Col>
				<Col sm="4" className="scoreboard">
					{baccaratDrawer.getScoreboardAsHtml()}
				</Col>
				<Col sm="4" className="graph-amount">
					{baccaratDrawer.getAmountGraphAsHtml()}
				</Col>
			</Row>
		</Container>
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
					<h6>取扱説明書</h6>
					<ul>
						<li>出来るだけブラウザの幅を広げて御覧ください</li>
						<li>ブラウザを更新する度に、新しい100shoeが生成されます</li>
						<li>1つ目のグラフ:<ul>
								<li><span className="highlight">カードの偏りを確認できます</span></li>
								<li>0〜9までのカードの消費推移を示しています</li>
								<li>対応する数字を押すと線の表示/非表示が切り替わります</li>
								<li>0はT〜Kまでが含まれています</li>
							</ul>
						</li>
						<li>罫線:<ul>
								<li>数字: ゲーム番号</li>
								<li>薄灰色の背景色: ナチュラル</li>
								<li>TIE: 非表示（要望があればその内復活させます）</li>
								<li><b>カーソルを重ねてしばらくすると内訳がでてきます</b></li>
							</ul>
						</li>
						<li>2つ目のグラフ:<ul>
								<li>500$からスタートした場合の資産の推移を表しています</li>
								<li><span className="highlight">アルゴリズムは独自のものです。Twitterなどで発信しています</span></li>
							</ul>
						</li>
						<li>8デック全て使い切らず、カジノ同様6デックあたりで終了しています</li>
					</ul>
					<p>◆ご要望・アイデア・実装の依頼はツイッターまで遠慮なくどうぞ。</p>
					<p>
						　<a target="_blank" href="https://twitter.com/peetan0001">Twitterはこちら</a>
					</p>
					<p>
						　Twitterなどをシェアしてくれると助かります
					</p>
				</header>
				<div className="App-body">
					<div>{html}</div>
					{/*<Line
						height={80}
						data={data}
					/>*/}
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						total.amountFromGoldbach: {total.amountFromGoldbach - 50000}
						<br />
						total.amountFromChibisuke: {total.amountFromChibisuke - 50000}
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
				</div>
			</div>
		)
	}
}

export default App;
