import PlayingCards from './PlayingCards'
import StrategyBlackjack from './strategy.Blackjack'

// TODO: Doubledownフラグをstatesやresultsにいれてあげる必要がある
// TODO: カウンティングするんだったら
	// - usedCardsに含まれてしまうからdealInitのときはdealerは1枚しか引いてはないけない
	// - それか
	// 	- PlayerHandsでカウント
	// 	- DealerHandでもカウント

class PlayingCardsForBJ extends PlayingCards {
	constructor(deckNumber) {
		super(deckNumber)
		this.cards = this.cards.map((n) => n >= 10 ? 10 : n)
	}
}
let playingCards = new PlayingCardsForBJ(8).shuffle()


// TODO: 単数形にしてHandクラスからextendsしたい
class PlayerHands {
	constructor(playerCards, dealerCard) {
		this.hands = [playerCards]
		this.playingIndex = 0
		/**
		 * @structure {status} - [{ isDouble: boolean, player: 'Blackjack', 18, 21, 'Bust' }]
		 */
		this.states = []
		this.dealerCard = dealerCard
		this.strategyBlackjack = new StrategyBlackjack()
	}
	/**
	 * @return {status}
	 */
	play() {
		let cards = this.hands[this.playingIndex]
		console.log('i,P,D:', this.playingIndex, cards, this.dealerCard)

		if (cards[0] === 1 && cards[1] === 10 || cards[0] === 10 && cards[1] === 1) {
			this.states.push({ player: 'Blackjack' })
			return this._nextHand()
		}

		let action = this.strategyBlackjack.getAction(cards, this.dealerCard)
		console.log('Action:', action)

		switch (action) {
			case 'H':
				cards.push(playingCards.dealCard())
				if (this._isBust(cards)) {
					console.log('Bust:', cards)
					this.states.push({ player: 'Bust' })
					return this._nextHand()
				} else
					return this.play()
			case 'S':
				let sum = cards.reduce((p, v) => p + (v === 1 ? 11 : v), 0)
				if (sum > 21)
					sum = cards.reduce((p, v) => p + v, 0)
				this.states.push({ player: sum })
				return this._nextHand()
			case 'P':
				let splitedIndex = this.hands.length
				this.hands[splitedIndex] = [cards.shift()] // split.
				
				cards.push(playingCards.dealCard())
				this.hands[splitedIndex].push(playingCards.dealCard())
				return this.play()
			case 'D':
				cards.push(playingCards.dealCard())
				console.log('Double:', cards)
				if (this._isBust(cards)) {
					this.states.push({ isDouble: true, player: 'Bust' })
				} else {
					let sum = cards.reduce((p, v) => p + (v === 1 ? 11 : v), 0)
					if (sum > 21)
						sum = cards.reduce((p, v) => p + v, 0)
					this.states.push({ isDouble: true, player: sum })
				}
				return this._nextHand()
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


// TODO: Handからextendsしたい
class DealerHand {
	constructor(dealerCards) {
		this.cards = dealerCards
	}
	play() {
		while (
			this.cards.reduce((p, v) => p + (v === 1 ? 11 : v), 0) <= 16 ||
			this.cards.reduce((p, v) => p + (v === 1 ? 11 : v), 0) > 21 && this.cards.reduce((p, v) => p + v, 0) <= 16
		)
			this.cards.push(playingCards.dealCard())
	}
	hasBlackjack() {
		return this.cards.length === 2 &&
			this.cards[0] === 1  && this.cards[1] === 10 ||
			this.cards[0] === 10 && this.cards[1] === 1
	}
	hasBust() {
		// INFO: Aは1扱い
		return this.cards.reduce((p, v) => p + v, 0) > 21
	}
	sum() {
		let sum = this.cards.reduce((p, v) => p + (v === 1 ? 11 : v), 0)
		if (sum > 21)
			return this.cards.reduce((p, v) => p + v, 0)
		else
			return sum
	}
}


class Blackjack {
	constructor() {}
	/**
	 * @param {number} n - betValue
	 * @return {object | undefined} - undefined: end of shoe
	 *   @structure { income: {number}, results: {results} }
	 */
	play(n) {
		if (playingCards.get().length < 52 * 2)
			return undefined // end of shoe

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

		/**
		 * @structure {status}
		 */
		let states = new PlayerHands(playerCards, dealerCards[0]).play()
		console.log('states:', states)

		let dealer = new DealerHand(dealerCards)
		dealer.play()
		console.log('dealer:', dealer)

		/**
		 * @structure {results} - [{ isDouble: boolean, player: 'Blackjack', 'Lose', 'Win', 'Lose', 'Push' }]
		 */
		let results = []

		// Q: handがナイス21、ディーラーが10,1のbackjackなら？
		if (dealer.hasBlackjack())
			results = states.map((v) => {
				v.player = v.player === 'Blackjack' ? 'Blackjack' : 'Lose'
				return v
			})
		else if(dealer.hasBust())
			results = states.map((v) => {
				if (v.player === 'Bust')
					v.player = 'Lose'
				else if (typeof v.player === 'number')
					v.player = 'Win'
				else if (v.player === 'Blackjack')
					v.player = v.player
				else
					console.warn('例外発生')
				return v
			})
		else
			results = states.map((v) => {
				console.log(333, v, dealer.sum())
				if (v.player === 'Bust')
					v.player = 'Lose'
				else if (typeof v.player === 'number')
					if (v.player === dealer.sum())
						v.player = 'Push'
					else if (v.player > dealer.sum())
						v.player = 'Win'
					else
						v.player = 'Lose'
				else if (v.player === 'Blackjack')
					v.player = v.player
				else
					console.warn('例外発生')
				return v
			})
		console.log('dealer.hasBlackjack:', dealer.hasBlackjack(), 'dealer.hasBust:', dealer.hasBust())


		// INFO: 結果に基づき収支を集計

		let income = 0

		income = results.reduce((p, v) => {
			if (v.player === 'Blackjack')
				return n * 1.5 + p
			else if (v.player === 'Win')
				return n + n * !!v.isDouble + p
			else if (v.player === 'Lose')
				return -n -n * !!v.isDouble + p
			else if (v.player === 'Push')
				return 0 + p
			else
				console.warn('例外発生', v)
		}, 0)

		return {
			results,
			income
		}
	}
	/** INFO: プレイヤーに2枚, ディーラー2枚
	 * @return { playerCards: Array, dealerCards: Array }
	 */
	_dealInit() {
		return {
			playerCards: [playingCards.dealCard(), playingCards.dealCard()],
			dealerCards: [playingCards.dealCard(), playingCards.dealCard()],
		}
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

export default Blackjack