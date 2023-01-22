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
	// count(n) {
	// 	if ([1,2,3,4].find((v) => v === n))
	// 		this.counting++
	// 	else if ([6,7,8,9].find((v) => v === n))
	// 		this.counting--
	// }
	/**
	 * INFO: Bシステム - https://www.bestuscasinos.org/blog/how-to-beat-baccarat-with-card-counting/
	 */
	count(n) {
		if ([1,2,3].find((v) => v === n))
			this.counting += 1
		else if ([4].find((v) => v === n))
			this.counting += 2
		else if ([5,7,8].find((v) => v === n))
			this.counting -= 1
		else if ([6].find((v) => v === n))
			this.counting -= 2
		else
			this.counting += 0
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
	constructor(shoeResult) {
		this.shoeResult = shoeResult
		this.isDisplayTIE = false
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
	// INFO: 配列の形で出力
	getScoreboard() {
		return this.shoeResult.reduce((prev, v) => {
			if (!this.isDisplayTIE && v.result === 'TIE')
				return prev
			let lastCol = prev[prev.length - 1]
			if (lastCol == undefined || lastCol[lastCol.length - 1].result != v.result)
				prev.push([v])
			else
				lastCol.push(v)
			return prev
		}, [])
	}
	getScoreboardAsHtml() {
		const scoreboard = this.getScoreboard()
		console.log('this.getScoreboard():', scoreboard)
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
		             || this.isNatural(v.banker.cards) ? 'isNatural' : ''

		return <div
			style={{ color }}
			className={`cell cell-${n} ${isNatural}`}
			data={JSON.stringify(v)}
		>
			{v.result === 'TIE' ? '／' : '◯'}
		</div>
	}
	// x:
	// drawHtml() {
	// 	setTimeout(() => {
	// 		document.write(this.getScoreboardAsHtml())
	// 	}, 100)
	// }
	isNatural(cards) {
		return get1thDigit(cards[0] + cards[1]) >= 8
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
	 * @return {object}
	 *   @structure { result, player, banker }
	 */
	play() {
		let player = { cards: [] }
		let banker = { cards: [] }
		player.cards.push(this.playingCards.dealCard())
		banker.cards.push(this.playingCards.dealCard())
		player.cards.push(this.playingCards.dealCard())
		banker.cards.push(this.playingCards.dealCard())

		let playerNum = get1thDigit(player.cards[0] + player.cards[1])
		let bankerNum = get1thDigit(banker.cards[0] + banker.cards[1])
		let result = ''

		// console.log(playerNum, bankerNum)
		if (playerNum >= 8 || bankerNum >= 8)
			result = this._judge(playerNum, bankerNum)
		else if (playerNum >= 6 && bankerNum >= 6)
			result = this._judge(playerNum, bankerNum)
		else if (playerNum <= 5) {
			player.cards.push(this.playingCards.dealCard())
			playerNum = get1thDigit(playerNum + player.cards[2])
			if (
				bankerNum <= 2 ||
				bankerNum == 3 && [1,2,3,4,5,6,7,9,0].find((n) => n == player.cards[2]) ||
				bankerNum == 4 && [2,3,4,5,6,7].find((n) => n == player.cards[2]) ||
				bankerNum == 5 && [4,5,6,7].find((n) => n == player.cards[2]) ||
				bankerNum == 6 && [6,7].find((n) => n == player.cards[2])
			) {
				banker.cards.push(this.playingCards.dealCard())
				bankerNum = get1thDigit(bankerNum + banker.cards[2])
			}
			result = this._judge(playerNum, bankerNum)
		}
		else {
			if (playerNum > bankerNum) {
				banker.cards.push(this.playingCards.dealCard())
				bankerNum = get1thDigit(bankerNum + banker.cards[2])
			}
			result = this._judge(playerNum, bankerNum)
		}

		// INFO: 以下はベッティングシステムが介入していて責務を切り分けられていない。
		// x: play(wager, action)
		// let income = 0
		// if (result === 'BANKER' && action === 'BANKER')
		// 	income += wager * .95
		// else if (result === 'PLAYER' && action === 'PLAYER')
		// 	income += wager
		// else if (result === 'BANKER' && action === 'PLAYER' || result === 'PLAYER' && action === 'BANKER')
		// 	income -= wager
		// else if (result === 'TIE')
		// 	console.info('TIE')
		// else if (action === 'LOOK') {
		// 	console.info('LOOK')
		// 	wager = 0
		// } else
		// 	debugger
		// ;

		return {
			result,
			player,
			banker
		}
	}
	/**
	 * シューが一定数以下になるまでプレイしゲームの結果を返す
	 * @return {Array}
	 */
	playShoe() {
		let shoeResult = []
		while (this.playingCards.get().length >= 52 * 2) {
			shoeResult.push(this.play())
		}
		return shoeResult
	}
	/**
	 * 比較用にダイスの結果を出力
	 * @return {Array}
	 */
	playDice() {
		let results = []
		for (let i = 0; i < 65; i++) {
			results.push(Math.random() < .5 ? 'PLAYER' : 'BANKER')
		}
		return results
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