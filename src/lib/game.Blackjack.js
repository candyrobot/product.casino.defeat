import PlayingCards from './PlayingCards'
import StrategyBlackjack from './strategy.Blackjack'

// INFO: blackjackストラテジープログラム

// INFO: 1shoeだけ担当するdealer
class Blackjack {
	constructor() {
		this.playingCards = new PlayingCards(8).shuffle().get()
		this.strategyBlackjack = new StrategyBlackjack()
	}
	play(n) {
		this.deal()
		let action = this.strategyBlackjack.getAction(playerCards, dealerCard)
		switch(action) {
			case 'H':
				this.dealACard()
				break;
			case 'S':
				break
			case 'P':
				this.split()
				break
		}
	}
	// INFO: プレイヤーに2枚, ディーラー1枚
	deal() {

	}
	isBlackjack() {}
	// @param string 'S', 'H', 'P'(split), 'D'
	setAction(action) {

	}
}



