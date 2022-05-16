import PlayingCards from './PlayingCards'

// INFO: バカラ用のトランプ
class BaccaratPlayingCards extends PlayingCards {
	constructor(deckNumber) {
		super(deckNumber)
		this.cards = this.cards.map((n) => n >= 10 ? 0 : n)
		// INFO: 低いほどプレイヤーに有利
		this.counting = 0
	}
	/**
	 * INFO: ハイローシステム
	 * @param {number} n - observed number
	 */
	count(n) {
		if ([1,2,3,4].find((v) => v === n))
			this.counting++
		else if ([6,7,8,9].find((v) => v === n))
			this.counting--
	}
	getCount() {
		return this.counting
	}
	/**
	 * @param {boolean} isCounting - falseを渡すとカウンティングしない
	 */
	dealCard(isCounting = true) {
		let n = super.dealCard()
		if (isCounting)
			this.count(n)
		// console.log('dealt:', n, ' count:', this.getCount())
		return n
	}
}

class BaccaratDrawer {
	constructor() {
		this.results = []
		// INFO: Playerがn連勝だったらtrue
		// this.results.isPlayerStreak = function(n) {
		// 	let arr = this.filter((v) => v != 'TIE')
		// 	return !arr.slice(-n).find((v) => v == 'BANKER')
		// }
		// INFO: ※罫線
		this.scoreboard = []
		this.csv = 'Game number,label,n'
	}
	/**
	 * @param {playedData}
	 * @param {number} - game number
	 */
	set(playedData, i) {
		let resultNum = undefined
		if (playedData.result === 'BANKER')
			resultNum = 1
		else if (playedData.result === 'PLAYER')
			resultNum = -1
		else if (playedData.result === 'TIE')
			resultNum = 0
		else
			debugger
		this.csv += `\n${i},shoeの残り枚数,${playedData.playingCards.get().length}`
		this.csv += `\n${i},カウント値,${playedData.playingCards.getCount()}`
		this.csv += `\n${i},result,${resultNum}`
		this.setResult(playedData.result)
	}
	setResult(result) {
		this.results.push(result)
	}
	getCsv() {
		return this.csv
	}
	getWinsOfPlayer() {
		return this.results.filter((v) => v == 'PLAYER').length
	}
	getWinsOfBanker() {
		return this.results.filter((v) => v == 'BANKER').length
	}
	getScoreboard() {
		return this.results.reduce((prev, v) => {
			if (v == 'TIE')
				return prev
			let lastCol = prev[prev.length - 1]
			if (lastCol == undefined || lastCol[lastCol.length - 1] != v)
				prev.push([v])
			else
				lastCol.push(v)
			return prev
		}, [])
	}
	getScoreboardAsHtml() {
		return this.getScoreboard().reduce((prev, v) => {
			return v.reduce((prev, v) => `<span style="color: ${v == 'PLAYER' ? 'blue' : 'red'}">◯</span>` + prev, '') + '<br>' + prev
		}, '<hr>')
	}
	isTereco() {}
	isTsurara() {}
}

class BaccaratStrategy {
	constructor(playingCards) {
		this.playingCards = playingCards
		this.MIN_BET_VALUE = 0
		this.MAX_BET_VALUE = 10
		this.playedData = null
	}
	getWager() {
		let trueCount = this.getTrueCount()
		if (trueCount >= 3)
			return this.MAX_BET_VALUE
		else if (trueCount <= -3)
			return this.MAX_BET_VALUE
		else
			return this.MIN_BET_VALUE
	}
	/**
	 * @return {string} - 'LOOK' 'BANKER' 'PLAYER'
	 */
	getAction() {
		let trueCount = this.getTrueCount()
		if (trueCount >= 3)
			return 'BANKER'
		else if (trueCount <= -3)
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
			console.error('wager:', playedData.wager, 'amount:', amount, 'cards', playedData.playingCards.get())
		else
			console.log('wager:', playedData.wager, 'amount:', amount)
	}
}

class Baccarat {
	constructor() {
		this.playingCards = new BaccaratPlayingCards(8).shuffle()
		console.log('playingCards:', this.playingCards)
		this.playingLimitNum = 104 // Math.random 70~130
	}
	getPlayingCards() {
		return this.playingCards
	}
	_disCard() {
	}
	_burnCard() {
	}
	/**
	 * @param {number}
	 * @param {string}
	 * @return {playedData}
	 *   @structure { income: {number}, results: {results}, playingCards, wager, isEndOfShoe, }
	 */
	play(wager, action) {
		let playerNum = get1thDigit(this.playingCards.dealCard() + this.playingCards.dealCard())
		let bankerNum = get1thDigit(this.playingCards.dealCard() + this.playingCards.dealCard())
		let result = ''
		// console.log(playerNum, bankerNum)
		if (playerNum >= 8 || bankerNum >= 8)
			result = this._judge(playerNum, bankerNum)
		else if (playerNum >= 6 && bankerNum >= 6)
			result = this._judge(playerNum, bankerNum)
		else if (playerNum <= 5) {
			let dealtNum = this.playingCards.dealCard()
			playerNum = get1thDigit(playerNum + dealtNum)
			if (
				bankerNum <= 2 ||
				bankerNum == 3 && [1,2,3,4,5,6,7,9,0].find((n) => n == dealtNum) ||
				bankerNum == 4 && [2,3,4,5,6,7].find((n) => n == dealtNum) ||
				bankerNum == 5 && [4,5,6,7].find((n) => n == dealtNum) ||
				bankerNum == 6 && [6,7].find((n) => n == dealtNum)
			)
				bankerNum = get1thDigit(bankerNum + this.playingCards.dealCard())
			result = this._judge(playerNum, bankerNum)
		}
		else {
			if (playerNum > bankerNum)
				bankerNum = get1thDigit(bankerNum + this.playingCards.dealCard())
			result = this._judge(playerNum, bankerNum)
		}


		let count = this.playingCards.getCount()

		let income = 0
		console.log('wager:', wager, ' count:', count)
		if (result === 'BANKER' && action === 'BANKER')
			income += wager * .95
		else if (result === 'PLAYER' && action === 'PLAYER')
			income += wager
		else if (result === 'BANKER' && action === 'PLAYER' || result === 'PLAYER' && action === 'BANKER')
			income -= wager
		else if (result === 'TIE')
			console.info('TIE')
		else if (action === 'LOOK') {
			console.info('LOOK')
			wager = 0
		} else
			debugger

		let isEndOfShoe = this.playingCards.get().length < 52 * 2

		return {
			playingCards: this.playingCards,
			result,
			income,
			wager,
			isEndOfShoe
		}
	}
	/**
	 * @return {string} 'PLAYER' 'BANKER' 'TIE'
	 */
	_judge(playerNum, bankerNum) {
		if (playerNum == bankerNum)
			return 'TIE'
		else
			return playerNum > bankerNum ? 'PLAYER' : 'BANKER'
	}
}


// TODO: Number.js で拡張すべし
function get1thDigit(n) {
	return Math.floor(n / 1) % 10 // 一桁めをとる
	// Math.floor(n / 10) % 10 // 二桁めをとる
}

export { Baccarat, BaccaratDrawer, BaccaratStrategy };