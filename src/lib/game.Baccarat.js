import PlayingCards from './PlayingCards'

class Baccarat {
	constructor() {
		this.playingCards = new PlayingCards(8).shuffle().get()
		// console.log(this.playingCards)
		this.usedCards = []
		this.playingLimitNum = 104 // Math.random 70~130
		this.results = []
		// INFO: Playerがn連勝だったらtrue
		this.results.isPlayerStreak = function(n) {
			let arr = this.filter((v) => v != 'TIE')
			return !arr.slice(-n).find((v) => v == 'BANKER')
		}
	}
	disCard() {
	}
	burnCard() {
	}
	dealCard() {
		let n = this.playingCards.shift()
		n = n >= 10 ? 0 : n
		this.usedCards.push(n)
		return n
	}
	playGame() {
		let playerNum = get1thDigit(this.dealCard() + this.dealCard())
		let bankerNum = get1thDigit(this.dealCard() + this.dealCard())
		// console.log(playerNum, bankerNum)
		if (playerNum >= 8 || bankerNum >= 8)
			return this.judge(playerNum, bankerNum)
		else if (playerNum >= 6 && bankerNum >= 6)
			return this.judge(playerNum, bankerNum)
		else if (playerNum <= 5) {
			let dealtNum = this.dealCard()
			playerNum = get1thDigit(playerNum + dealtNum)
			if (
				bankerNum <= 2 ||
				bankerNum == 3 && [1,2,3,4,5,6,7,9,0].find((n) => n == dealtNum) ||
				bankerNum == 4 && [2,3,4,5,6,7].find((n) => n == dealtNum) ||
				bankerNum == 5 && [4,5,6,7].find((n) => n == dealtNum) ||
				bankerNum == 6 && [6,7].find((n) => n == dealtNum)
			)
				bankerNum = get1thDigit(bankerNum + this.dealCard())
			return this.judge(playerNum, bankerNum)
		}
		else {
			if (playerNum > bankerNum)
				bankerNum = get1thDigit(bankerNum + this.dealCard())
			return this.judge(playerNum, bankerNum)
		}
	}
	testGame() {
		this.dealCard(); this.dealCard(); this.dealCard(); this.dealCard();
		// 勝率55%
		return Math.random() < 55 / 100 ? 'BANKER' : 'PLAYER'
	}
	playGames(doWhenPlayed) {
		do {
			let result = this.playGame()
			doWhenPlayed(result, this.results)
			this.results.push(result)
		} while (this.playingLimitNum < this.playingCards.length)
		return this
	}
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
	draw(scoreboard) {
		return scoreboard.reduce((prev, v) => {
			return v.reduce((prev, v) => `<span style="color: ${v == 'PLAYER' ? 'blue' : 'red'}">◯</span>` + prev, '') + '<br>' + prev
		}, '<hr>')
	}
	judge(playerNum, bankerNum) {
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