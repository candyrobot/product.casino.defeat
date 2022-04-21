import PlayingCards from './PlayingCards'
import StrategyBlackjack from './strategy.Blackjack'

// TODO: 52 * 8 - 52 * 2 になったら Blackjack.play()がundefindを返す

class PlayingCardsForBJ extends PlayingCards {
	constructor(deckNumber) {
		super(deckNumber)
		this.cards = this.cards.map((n) => n >= 10 ? 10 : n)
	}
}

let playingCards = new PlayingCardsForBJ(8).shuffle()


class PlayerHands {
	constructor(playerCards, dealerCard) {
		this.hands = [playerCards]
		this.playingIndex = 0
		this.states = []
		this.dealerCard = dealerCard
		this.strategyBlackjack = new StrategyBlackjack()
	}
	/**
	 * @return {Array} ['Blackjack', 18, 21, 'Bust']
	 */
	play() {
		let cards = this.hands[this.playingIndex]

		if (cards[0] === 1 && cards[1] === 10 || cards[0] === 10 && cards[1] === 1)
			this.states.push('Blackjack')
			return this._nextHand()

		let action = this.strategyBlackjack.getAction(cards, this.dealerCard)

		switch (action) {
			case 'H':
				cards.push(playingCards.dealCard())
				if (this._isBust(cards)) {
					this.states.push('Lose')
					return this._nextHand()
				} else
					return this.play()
			case 'S':
				let sum = cards.reduce((p, v) => p + (v === 1 ? 11 : v), 0)
				if (sum > 21)
					console.warn('例外発生. 21を超えたらAを1として扱う処理を追記')
				this.states.push(sum)
				return this._nextHand()
			case 'P':
				let splitedIndex = this.hands.length
				this.hands[splitedIndex][cards.shift()] // split.
				
				cards.push(playingCards.dealCard())
				this.hands[splitedIndex].push(playingCards.dealCard())
				return this.play()
		}

		console.warn('例外発生')
	}
	/** INFO: 次のハンドがなければ statesを返す
	 * @return {Array} states
	 */
	_nextHand() {
		this.playingIndex++
		return this.hands[this.playingIndex] === undefined ? this.states : this.play()
	}
	// _isBlackjack() {}
	_isBust(cards) {
		// INFO: Aは1扱い
		return cards.reduce((p, v) => p + v, 0) > 21
	}
	// _split() {}
	// _hit() {}
	// _stand() {}
}

class DealerHand {}

// INFO: 1shoeだけ担当する。
class Blackjack {
	constructor() {}
	/**
	 * @param {number} n - betValue
	 * @return {object | undefined} - undefined: end of shoe
	 *   { income: number, results: Array ['Win' 'Lose' 'Blackjack' 'Push'] }
	 */
	play(n) {
		let { playerCards, dealerCards } = this._dealInit()
		let isInsurance = false

		if (dealerCards[0] === 1) {
			isInsurance = this._isInsurance()
			if (dealerCards[1] === 10)
				return isInsurance ?
					{ results: ['Lose'], income: 0 } :
					{ results: ['Lose'], income: -n }
			else if (isInsurance)
				console.log('TODO: 総incomeからinsurance分をマイナスする -=n/2')
		}


		// INFO: ハンドをプレイ。ディーラもハンドをプレイ。

		let states = new PlayerHands(playerCards, dealerCards[0]).play() // ['Blackjack', 18, 21, 'Bust']

		let dealer = new DealerHand()
		dealer.play()

		let results = [] // ['Blackjack', 'Lose', 'Win', 'Lose']

		// Q: handがナイス21、ディーラーが10,1のbackjackなら？
		if (dealer.hasBlackjack())
			results = states.map((v) => v === 'Blackjack' ? 'Blackjack' : 'Lose')
		else if(dealer.hasBust())
			results = states.map((v) => {
				if (v === 'Bust')
					return 'Lose'
				else if (typeof v === 'number')
					return 'Win'
				else
					return v // expected 'Blackjack'
			})
		else
			results = states.map((v) => {
				if (v === 'Bust')
					return 'Lose'
				else if (typeof v === 'number')
					if (v === dealer.sum())
						return 'Push'
					else if (v > dealer.sum())
						return 'Win'
					else
						return 'Lose'
				else
					return v // expected 'Blackjack'
			})


		// INFO: 結果に基づき収支を集計

		let income = 0

		income = results.reduce((p, v) => {
			if (v === 'Blackjack')
				return n * 1.5 + p
			else if ('Win')
				return n + p
			else if ('Lose')
				return 0 + p
			else
				console.warn('例外発生')
		}, 0)

		return {
			results,
			income
		}

		// if (playerCards[0] === 1 && playerCards[1] === 10 || playerCards[0] === 10 && playerCards[1] === 1)
		// 	return { results: ['Blackjack'], income: n * 1.5 }
		// let playerHands = [playerCards]
		// this._playHand(playerHands, dealerCards, 0)
	}
	/** INFO: ひとつのハンド分
	 * @param {Array} playerHands
	 * @param {Array} dealerCards
	 * @param {number} i - playerHands{Array} の index
	 * @return {Array} results ['Win' 'Lose' 'Blackjack' 'Push']
	 */
	// _playHand(playerHands, dealerCards, i) {
	// 	let action = this.strategyBlackjack.getAction(playerHands[i], dealerCards[0])
	// 	switch (action) {
	// 		case 'H':
	// 			playerHands[i].push(this._dealCard())
	// 			if (this._isBust(playerHands[i]))
	// 				'Lose'
	// 				this._nextOrEnd(playerHands, dealerCards, i)
	// 			else
	// 				this._playHand(playerHands, dealerCards, i)
	// 			break
	// 		case 'S':
	// 			this._nextOrEnd(playerHands, dealerCards, i)
	// 			break
	// 		case 'P':
	// 			let splitedIndex = playerHands.length
	// 			playerHands[splitedIndex].push(playerHands[i].shift())
				
	// 			playerHands[i].push(this._dealCard())
	// 			this._playHand(playerHands, dealerCards, i)

	// 			playerHands[splitedIndex].push(this._dealCard())
	// 			this._playHand(playerHands, dealerCards, splitedIndex)
	// 			break
	// 	}
	// }
	// x:
	// _nextOrEnd(playerHands, dealerCards, i) {
	// 	if (playerHands[i+1] === undefined)
	// 		return playerHands.reduce((p, handCards) => {
	// 			let result = this._battleToDealer(handCards, dealerCards)
	// 			return p + this._collectIncome(result)
	// 		}, 0)
	// 	else
	// 		// next hand.
	// 		this._playHand(playerHands, dealerCards, i+1)
	// }
	/** TODO: 1を11とする処理
	 * @return {string} - 'Win' 'Lose' 'Push' 'BlackJack'
	 * // TODO: ↓
	 * @return {object} - { result: 'Win' 'Lose' 'Push', isBlackjack: boolean }
	 */
	_battleToDealer(handCards, dealerCards) {
		if (dealerCards[0] === 10 && dealerCards[1] === 1)
			// TODO: ある条件下でpushなのかloseなのか調べる
			return 'BlackJack'
		while (dealerCards.reduce((p, v) => p + v, 0) <= 16) {
			dealerCards.push(this._dealCard())
		}
		if (this._isBust(dealerCards))
			return 'Win'
		else if (dealerCards.reduce((p, v) => p + v, 0) === handCards.reduce((p, v) => p + v, 0))
			return 'Push'
		else if (dealerCards.reduce((p, v) => p + v, 0) > handCards.reduce((p, v) => p + v, 0))
			return 'Lose'
		else
			return 'Win'
	}
	/** INFO: プレイヤーに2枚, ディーラー1枚
	 * @return { playerCards: Array, dealerCards: Array }
	 */
	_dealInit() {

	}
	/**
	 * @return {boolean}
	 */
	// _isBust(handCards) {}
	// _isBlackjack() {}
	_isInsurance() { return false }
	// x: @param string 'S', 'H', 'P'(split), 'D'
	// setAction(action) {

	// }
}



