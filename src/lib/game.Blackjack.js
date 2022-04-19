import PlayingCards from './PlayingCards'
import StrategyBlackjack from './strategy.Blackjack'

// INFO: blackjackストラテジープログラム

// INFO: 1shoeだけ担当するdealer
class Blackjack {
	constructor() {
		this.playingCards = new PlayingCards(8).shuffle().get()
		this.strategyBlackjack = new StrategyBlackjack()
		this.usedCards = []
	}
	/**
	 * @param {number} betValue
	 * @return {number} income
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
	 */
	_playHand(playerHands, dealerCard, i) {
		let action = this.strategyBlackjack.getAction(playerHands[i], dealerCard)
		switch(action) {
			case 'H':
				playerHands[i].push(this._dealCard())
				this._playHand(playerHands, dealerCard, i)
				break;
			case 'S':
				// next hand or end.
				break
			case 'P':
				playerHands[i+1].push(playerHands[i].shift())
				playerHands[i].push(this._dealCard())
				playerHands[i+1].push(this._dealCard())
				for (var i = 0; i < playerHands.length; i++) {
					this._playHand(playerHands[i], dealerCard)
				}
				break
		}
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
	_isBlackjack() {}
	// x: @param string 'S', 'H', 'P'(split), 'D'
	// setAction(action) {

	// }
}



