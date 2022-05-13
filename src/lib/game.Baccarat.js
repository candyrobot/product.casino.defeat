import PlayingCards from './PlayingCards'

class PlayingCardsForBaccarat extends PlayingCards {
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

class Games {
	constructor() {
		this.results = []
		// INFO: Playerがn連勝だったらtrue
		this.results.isPlayerStreak = function(n) {
			let arr = this.filter((v) => v != 'TIE')
			return !arr.slice(-n).find((v) => v == 'BANKER')
		}
		// INFO: ※罫線
		this.scoreboard = []
	}
	isTereco() {}
	isTsurara() {}
	getResults() {
		let playerWins = this.results.filter((v) => v == 'PLAYER').length
		let bankerWins = this.results.filter((v) => v == 'BANKER').length
		let scoreboard = this.results.reduce((prev, v) => {
			if (v == 'TIE')
				return prev
			let lastCol = prev[prev.length - 1]
			if (lastCol == undefined || lastCol[lastCol.length - 1] != v)
				prev.push([v])
			else
				lastCol.push(v)
			return prev
		}, [])
		return { results: this.results, playerWins, bankerWins, scoreboard }
	}
	draw() {
		return this.scoreboard.reduce((prev, v) => {
			return v.reduce((prev, v) => `<span style="color: ${v == 'PLAYER' ? 'blue' : 'red'}">◯</span>` + prev, '') + '<br>' + prev
		}, '<hr>')
	}
}

class StrategyBaccarat {
	constructor(playingCards) {
		this.playingCards = playingCards
	}
	/**
	 * @return {string} - 'LOOK' 'BANKER' 'PLAYER'
	 */
	getAction() {
		if (this.playingCards.getCount() >= 5)
			return 'BANKER'
		else if (this.playingCards.getCount() <= -5)
			return 'PLAYER'
		else
			return 'LOOK'
	}
}

class Baccarat {
	constructor() {
		this.playingCards = new PlayingCardsForBaccarat(8).shuffle()
		console.log('playingCards:', this.playingCards)
		this.playingLimitNum = 104 // Math.random 70~130
		this.strategyBaccarat = new StrategyBaccarat(this.playingCards)
	}
	_disCard() {
	}
	_burnCard() {
	}
	/**
	 * @param {number} n - wager
	 * @param {string}
	 * @return {object}
	 *   @structure { income: {number}, results: {results}, playingCards, isEndOfShoe }
	 */
	play(n, action = this.strategyBaccarat.getAction()) {

		if (action === 'LOOK')
			n = 0

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

		let income = 0
		if (result === 'BANKER' && action === 'BANKER')
			income += n * .95
		else if (result === 'PLAYER' && action === 'PLAYER')
			income += n
		else if (result === 'BANKER' && action === 'PLAYER' || result === 'PLAYER' && action === 'BANKER')
			income -= n
		else if (result === 'TIE')
			console.info('TIE')
		else if (action === 'LOOK')
			console.info('LOOK')
		else
			debugger

		let isEndOfShoe = this.playingCards.get().length < 52 * 2

		return {
			playingCards: this.playingCards,
			result,
			income,
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

export default Baccarat;