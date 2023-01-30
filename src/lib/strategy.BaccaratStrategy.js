// x:

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
