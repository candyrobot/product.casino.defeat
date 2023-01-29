// 出目を予測しアクションを返すクラス
class Prediction {
	constructor() {
		// INFO: 次のゲームの予測
		this.forecast = 'BANKER'
		this.hits = []
	}
	/**
	 * アクションコントロール:
	 * - 3連敗するとルックに入る。1回勝つとルック解除。
	 */
	getAction() {
		return this.hits.length >= 3 &&
		this.hits[this.hits.length - 1] === false &&
		this.hits[this.hits.length - 2] === false &&
		this.hits[this.hits.length - 3] === false ?
			'LOOK' : 'BANKER'
	}
}
let streakDetection = {
	loseCount: 0,
	setGameResult: function(isWin) {
		// isWin ? (this.loseCount = 0) : this.loseCount++
		if (isWin) {
			this.loseCount <= 0 ? (this.loseCount = 0) : this.loseCount--
		}
		else
			this.loseCount++
	},
	isStopThisGame: function() {
		return this.loseCount >= 3 ? true : false
	}
}

class Baccarat {
	payout(wager, as) {
		if (as === 'BANKER')
			return wager * .95
		if (as === 'PLAYER')
			return wager
	}
}

class BaccaratBettingSystem {
	constructor() {
		this.amount = 500
		this.amountHistory = [this.amount]
		this.UNIT_INITIAL = 1
		this.unit = this.UNIT_INITIAL
		// .bet(1).on('BANKER')
	}
	/**
	 * INFO: 1ゲームごとの処理
	 */
	setGameDetail(gameDetail) {
		// if (streakDetection.isStopThisGame()) {
		// 	streakDetection.setGameResult(gameDetail.result === 'BANKER')
		// 	this.amountHistory.push(this.amount)
		// 	return
		// }

		let isWin = this.betBanker(this.unit, gameDetail)
		// console.log('amount:', this.amount)

		// streakDetection.setGameResult(isWin)

		// INFO: Chibisuke法
		if (isWin && Math.max(...this.amountHistory) <= this.amount)
			this.unit = this.UNIT_INITIAL
		else
			this.unit++

		this.amountHistory.push(this.amount)
	}
	/**
	 * @return {boolean} - true when win or tie.
	 */
	betBanker(unit, gameDetail) {
		if (gameDetail.result === 'BANKER') {
			this.amount += unit * .95
			return true
		}
		if (gameDetail.result === 'PLAYER') {
			this.amount -= unit
			return false
		}
		if (gameDetail.result === 'TIE')
			return true
	}
	/**
	 * @return {boolean} - true when win or tie.
	 */
	betPlayer(unit, gameDetail) {
		if (gameDetail.result === 'BANKER') {
			this.amount -= unit
			return false
		}
		if (gameDetail.result === 'PLAYER') {
			this.amount += unit
			return true
		}
		if (gameDetail.result === 'TIE')
			return true
	}
	getAmountHistory() {
		return this.amountHistory
	}
	/**
	 * INFO: アクションアルゴリズム - PB交互にアクションさせたい時に
	 * 例）BBPPBBPPBBPP
	 * 使い方）
		let isWin = 
			this.getActionPatternAlternatively() === 'BANKER' ?
			this.betBanker(this.unit, gameDetail) :
			this.betPlayer(this.unit, gameDetail)
	 */
	getActionPatternAlternatively() {
		return this.amountHistory.length % 4 === 0 || this.amountHistory.length % 4 === 1 ?
		'BANKER' : 'PLAYER'
	}
}


class BaccaratStrategy {
	constructor(playingCards) {
		this.playingCards = playingCards
		this.MIN_BET_VALUE = 0
		this.MAX_BET_VALUE = 10
		this.playedData = null
	}
	getWager() {
		// let trueCount = this.getTrueCount()
		// if (trueCount >= 3)
		// 	return trueCount * 2
		// else if (trueCount <= -3)
		// 	return Math.abs(trueCount * 2)
		// else
		// 	return this.MIN_BET_VALUE
		return 5
	}
	/**
	 * @return {string} - 'LOOK' 'BANKER' 'PLAYER'
	 */
	getAction() {
		// let trueCount = this.getTrueCount()
		if (this.playingCards.getCount() <= 15)
			return 'BANKER'
		else if (this.playingCards.getCount() >= 16)
			return 'PLAYER'
		else
			return 'LOOK'
	}
	getTrueCount() {
		let trueCount = 0
		if (this.playedData) {
			let runningCount = this.playedData.playingCards.getCount()
			let deckNum = this.playedData.playingCards.get().length / 52
			trueCount = runningCount / deckNum
			console.log(`trueC: ${trueCount}`, `runningC: ${runningCount}`, `deckNum: ${deckNum}`)
		}
		return trueCount
	}
	/**
	 * @param {playedData}
	 * @param {number}
	 */
	set(playedData, amount) {
		this.playedData = playedData

		if (playedData.wager === this.MAX_BET_VALUE)
			console.error('wager:', playedData.wager, 'amount:', amount, 'cards:', playedData.playingCards.get())
		else
			console.log('wager:', playedData.wager, 'amount:', amount)
	}
}


export { Baccarat, BaccaratBettingSystem };