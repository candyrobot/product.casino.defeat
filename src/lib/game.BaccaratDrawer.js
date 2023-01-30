import Math from '../util/Math.js';
import {
	Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js'; 
import { Line } from 'react-chartjs-2';

Chart.register(
	CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
)

class BaccaratDrawer {
	constructor(shoeResult) {
		this.shoeResult = shoeResult
		this.isDisplayTIE = false
		// this.results = []
		// INFO: Playerがn連勝だったらtrue
		// this.results.isPlayerStreak = function(n) {
		// 	let arr = this.filter((v) => v != 'TIE')
		// 	return !arr.slice(-n).find((v) => v == 'BANKER')
		// }
		// x: this.csv = 'Game number,label,n'
	}
	/**
	 * @param {playedData}
	 * @param {number} - game number
	 */
	// set(playedData, i) {
	// 	let resultNum = undefined
	// 	if (playedData.result === 'BANKER')
	// 		resultNum = 1
	// 	else if (playedData.result === 'PLAYER')
	// 		resultNum = -1
	// 	else if (playedData.result === 'TIE')
	// 		resultNum = 0
	// 	else
	// 		debugger
	// 	this.csv += `\n${i},shoeの残り枚数,${playedData.playingCards.get().length}`
	// 	this.csv += `\n${i},カウント値,${playedData.playingCards.getCount()}`
	// 	this.csv += `\n${i},result,${resultNum}`
	// 	this.setResult(playedData.result)
	// }
	// setResult(result) {
	// 	this.results.push(result)
	// }
	// getCsv() {
	// 	return this.csv
	// }
	// getWinsOfPlayer() {
	// 	return this.results.filter((v) => v == 'PLAYER').length
	// }
	// getWinsOfBanker() {
	// 	return this.results.filter((v) => v == 'BANKER').length
	// }
	/**
	 * INFO: 配列を罫線の形で出力
	 */
	getScoreboard() {
		return this.shoeResult.reduce((prev, v) => {
			if (!this.isDisplayTIE && v.result === 'TIE')
				return prev
			let lastCol = prev[prev.length - 1]
			if (lastCol == undefined || lastCol[lastCol.length - 1].result != v.result)
				// INFO: 新規列を生成
				prev.push([v])
			else
				lastCol.push(v)
			return prev
		}, [])
	}
	getScoreboardAsHtml() {
		const scoreboard = this.getScoreboard()
		// console.log('this.getScoreboard():', scoreboard)
		return scoreboard.map((col) =>
			<div className="float">
				{col.map((game) => this.createHtmlCell(game) )}
			</div>
		)
	}
	createHtmlCell(game) {
		let color = 'green'
		if (game.result === 'PLAYER') color = 'blue'
		if (game.result === 'BANKER') color = 'red'

		let isNatural = this.isNatural(game.player.cards)
		             || this.isNatural(game.banker.cards) ? 'is-natural' : ''

		return <div
			style={{ color }}
			title={JSON.stringify(game)}
			className={`cell game-number${game.gameNumber} ${isNatural} ${game.result === 'TIE' ? 'is-TIE' : ''}`}
		>
			{game.result === 'TIE' ? '／' : game.gameNumber}
		</div>
		// '◎'
	}
	getCountingGraphAsHtml() {
		// INFO: 基準がほしかったので-1をいれて、中央線を描く
		let cardNumbers = [-1, 1,2,3,4,5,6,7,8,9,0]
		return <Line
			width={700}
			height={600}
			data={{
				labels: this.shoeResult.map((v, i) => i + 1),
				datasets: cardNumbers.map((number) => {
					// INFO: 8デック分に含まれるそのカードの最大枚数
					let count = (number === 0 ? 4 * 4 : 4) * 8
					return {
						label: number,
						data: this.shoeResult.map((v, i) =>
							number === -1 ?
								// INFO: 中央線の描画
								// 1.  4 * 8デック: 合計32枚
								// 2.  6デック終了が平均64ゲーム目
								// 3.  n回目で0になるとき 32 / n が 1回あたりの消費率
								//     ` 6 -> 8デック は 64 -> 85.3333333333ゲーム目で終了`
								// 4.  n = 85.33 は 1回あたり0.375014649枚ずつ減る
								(count -= 0.375014649) :
							count -= v.banker.cards.reduce((prev, v) =>
								prev + (v === number ? 1 : 0)
							, 0)
							+ v.player.cards.reduce((prev, v) =>
								prev + (v === number ? 1 : 0)
							, 0)
						),
						hidden: number === 0,
						borderColor: number === -1 ? 'purple' : getColor(number)
						// x: borderColor: number === -1 ? 'red' : `hsl(${number * 30}deg 50% 58%)`
					}
				})
			}}
		/>
	}
	getAmountGraphAsHtml() {
		console.log('graph-amount:', this.shoeResult.map((v, i) => i + 1))
		return <Line
			width={700}
			height={600}
			data={{
				labels: this.shoeResult.map((v, i) => i + 1),
				datasets: [ {
					label: 1,
					data: this.shoeResult.map((v) => 
						v.amountFromGoldbach
					)
				}],
			}}
		/>
	}
	isNatural(cards) {
		return Math.get1thDigit(cards[0] + cards[1]) >= 8
	}
	isTereco() {}
	isTsurara() {}
}

function getColor(number) {
	if ([1].includes(number)) return 'red' // banker有利になるカード
	if ([2,7].includes(number)) return 'blue' // player有利になるカード
	// if ([2,3,7].includes(number)) return 'green'
}

// function getCountingDataFor(number) {
// 	const labels = this.shoeResult.map((v, i) => i)
// 	const data = {
// 		labels: labels,
// 		datasets: [{
// 			label: 'My First Dataset',
// 			data: this.shoeResult.map((v, i) => i),
// 			borderColor: 'rgb(75, 192, 192)',
// 		}]
// 	};
// 	return data
// }


export { BaccaratDrawer };