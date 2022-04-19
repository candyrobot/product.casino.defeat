import PlayingCards from './PlayingCards'
import StrategyBlackjack from './strategy.Blackjack'

// INFO: 1shoeだけ担当する。
class Blackjack {
	constructor() {
		this.playingCards = new PlayingCards(8).shuffle().get()
		this.strategyBlackjack = new StrategyBlackjack()
		this.usedCards = []
	}
	/**
	 * @param {number} betValue
	 * @return {number | undefined} income - undefined: end of shoe
	 */
	play(n) {
		let { playerCards, dealerCard } = this._dealInit()
		let playerHands = [playerCards]
		this._playHand(playerHands, dealerCard, 0)
	}
	/** INFO: ひとつのハンド分
	 * @param {Array} playerHands
	 * @param {number} dealerCard
	 * @param {number} i - playerHands{Array} の index
	 * @return {number} income
	 */
	_playHand(playerHands, dealerCard, i) {
		let action = this.strategyBlackjack.getAction(playerHands[i], dealerCard)
		switch (action) {
			case 'H':
				playerHands[i].push(this._dealCard())
				if (this._isBust(playerHands[i]))
					'Lose'
					if (playerHands[i+1] === undefined)
						return this._collectIncome()
					else
						// next hand.
						this._playHand(playerHands, dealerCard, i+1)
				else
					this._playHand(playerHands, dealerCard, i)
				break
			case 'S':
				if (playerHands[i+1] === undefined)
					for (var i = 0; i < playerHands.length; i++) {
						let result = this._battleToDealer(playerHands[i], dealerCard)
					}
				else
					// next hand.
					this._playHand(playerHands, dealerCard, i+1)
				break
			case 'P':
				let splitedIndex = playerHands.length
				playerHands[splitedIndex].push(playerHands[i].shift())
				
				playerHands[i].push(this._dealCard())
				this._playHand(playerHands, dealerCard, i)

				playerHands[splitedIndex].push(this._dealCard())
				this._playHand(playerHands, dealerCard, splitedIndex)
				break
		}
	}
	/** TODO: 1を11とする処理
	 * @return {string} - 'Win' 'Lose' 'Push' 'BlackJack'
	 * // TODO: ↓
	 * @return {object} - { result: 'Win' 'Lose' 'Push', isBlackjack: boolean }
	 */
	_battleToDealer(handCards, dealerCard) {
		let dealerCards = [dealerCard, this._dealCard()]
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
	 * @return { playerCards: Array, dealerCard: number }
	 */
	_dealInit() {

	}
	_dealCard() {
		let n = this.playingCards.shift()
		n = n >= 10 ? 10 : n
		this.usedCards.push(n)
		return n
	}
	/**
	 * @return {boolean}
	 */
	_isBust(handCards) {}
	_isBlackjack() {}
	// x: @param string 'S', 'H', 'P'(split), 'D'
	// setAction(action) {

	// }
}



