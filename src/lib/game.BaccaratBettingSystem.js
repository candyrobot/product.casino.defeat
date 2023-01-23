class BaccaratBettingSystem {
	constructor() {
		this.amount = 500
		this.amountOfNewRecordUpper = this.amount
		this.UNIT_INITIAL = 1
		this.unit = this.UNIT_INITIAL
		// .bet(1).on('BANKER')
	}
	setGameDetail(gameDetail) {
		let isWin = this.betBanker(this.unit, gameDetail)
		
		if (isWin && this.amountOfNewRecordUpper < this.amount) {
			this.amountOfNewRecordUpper = this.amount
			this.unit = this.UNIT_INITIAL
		}
		else
			this.unit++
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
	getCsv() {
		console.log('amount:', this.amount)
	}
	// streakDetection
}

export { BaccaratBettingSystem };