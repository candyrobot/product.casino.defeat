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
	// INFO: 配列の形で出力
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
		let n = 0
		return scoreboard.map((v, i) =>
			<div className="float">
				{v.map((v) => this.createHtmlCell(v, n++) )}
			</div>
		)
	}
	createHtmlCell(v, n) {
		let color = 'green'
		if (v.result === 'PLAYER') color = 'blue'
		if (v.result === 'BANKER') color = 'red'

		let isNatural = this.isNatural(v.player.cards)
		             || this.isNatural(v.banker.cards) ? 'is-natural' : ''

		return <div
			style={{ color }}
			className={`cell cell-${n} ${isNatural} ${v.result === 'TIE' ? 'isTIE' : ''}`}
			data={JSON.stringify(v)}
		>
			{v.result === 'TIE' ? '／' : '◯'}
		</div>
	}
	getCountingGraphAsHtml() {
		const labels = this.shoeResult.map((v, i) => i)
		const data = {
			labels: labels,
			datasets: [{
				label: 'My First Dataset',
				data: this.shoeResult.map((v, i) => i),
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1
			}]
		};
		return <Line
			width={700}
			height={200}
			data={data}
		/>
	}
	isNatural(cards) {
		return Math.get1thDigit(cards[0] + cards[1]) >= 8
	}
	isTereco() {}
	isTsurara() {}
}

export { BaccaratDrawer };