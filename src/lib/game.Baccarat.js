import Math from '../util/Math.js';
import PlayingCards from './PlayingCards'

// INFO: バカラ用のトランプ
class BaccaratPlayingCards extends PlayingCards {
	constructor(deckNumber) {
		super(deckNumber)
		this.cards = this.cards.map((n) => n >= 10 ? 0 : n)
		// INFO: 除外したいカードを以下に指定する
		// .filter((n) => n != 2 && n != 7 && n != 0 && n != 4 && n != 8)
		// .filter((n) => n != 1 && n != 5 && n != 9 && n != 3 && n != 6)
		// .filter((n) => n != 6 && n != 7 && n != 5)
		// .filter((n) => n != 0 && n != 1 && n != 5 && n != 6 && n != 7)
		// console.log('cards:', this.cards)
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
	 *   @structure {gameDetail} - { result, player, banker }
	 */
	play() {
		let player = { cards: [] }
		let banker = { cards: [] }
		player.cards.push(this.playingCards.dealCard())
		banker.cards.push(this.playingCards.dealCard())
		player.cards.push(this.playingCards.dealCard())
		banker.cards.push(this.playingCards.dealCard())

		let playerNum = Math.get1thDigit(player.cards[0] + player.cards[1])
		let bankerNum = Math.get1thDigit(banker.cards[0] + banker.cards[1])
		let result = ''

		// console.log(playerNum, bankerNum)
		if (playerNum >= 8 || bankerNum >= 8)
			result = this._judge(playerNum, bankerNum)
		else if (playerNum >= 6 && bankerNum >= 6)
			result = this._judge(playerNum, bankerNum)
		else if (playerNum <= 5) {
			player.cards.push(this.playingCards.dealCard())
			playerNum = Math.get1thDigit(playerNum + player.cards[2])
			if (
				bankerNum <= 2 ||
				bankerNum == 3 && [1,2,3,4,5,6,7,9,0].includes(player.cards[2]) ||
				bankerNum == 4 && [2,3,4,5,6,7].includes(player.cards[2]) ||
				bankerNum == 5 && [4,5,6,7].includes(player.cards[2]) ||
				bankerNum == 6 && [6,7].includes(player.cards[2])
			) {
				banker.cards.push(this.playingCards.dealCard())
				bankerNum = Math.get1thDigit(bankerNum + banker.cards[2])
			}
			result = this._judge(playerNum, bankerNum)
		}
		else {
			if (playerNum > bankerNum) {
				banker.cards.push(this.playingCards.dealCard())
				bankerNum = Math.get1thDigit(bankerNum + banker.cards[2])
			}
			result = this._judge(playerNum, bankerNum)
		}

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
		let gameNumber = 0
		while (this.playingCards.get().length >= 52 * 2) {
			gameNumber++
			shoeResult.push({ ...this.play(), gameNumber })
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

export { Baccarat };