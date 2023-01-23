class BaccaratBettingSystem {
	constructor() {
		this.amount = 500
		this.amountHistory = [this.amount]
		this.UNIT_INITIAL = 1
		this.unit = this.UNIT_INITIAL
		// .bet(1).on('BANKER')
	}
	setGameDetail(gameDetail) {
		let isWin = this.betBanker(this.unit, gameDetail)
		console.log('amount:', this.amount)
		this.amountHistory.push(this.amount)

		// INFO: Chibisuke法
		// if (isWin && Math.max(...this.amountHistory) < this.amount)
		// 	this.unit = this.UNIT_INITIAL
		// else
		// 	this.unit++
	}
	/**
	 * @return {boolean} - 勝てばtrue
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
	}
	/**
	 * @return {boolean} - 勝てばtrue
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
	}
	getAmountHistory() {
		return this.amountHistory
	}
	getCsv() {
		console.log('amount:', this.amountHistory)
	}
	// streakDetection
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


export { BaccaratBettingSystem };