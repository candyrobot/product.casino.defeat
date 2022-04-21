class PlayingCards {
	constructor(deckNumber = 1) {
		this.cards = []
		this.usedCards = []
		for (var i = 0; i < deckNumber; i++) {
			this._createDeck()
		}
	}
	// TODO: rename 'getCards'
	get() {
		return this.cards
	}
	_createDeck() {
		// TODO: スートを定義する { num: 1, suit: 'A' }
		this.cards.push(1,2,3,4,5,6,7,8,9,10,11,12,13)
		this.cards.push(1,2,3,4,5,6,7,8,9,10,11,12,13)
		this.cards.push(1,2,3,4,5,6,7,8,9,10,11,12,13)
		this.cards.push(1,2,3,4,5,6,7,8,9,10,11,12,13)
	}
	shuffle() {
		this.cards = shuffle(this.cards)
		return this
	}
	dealCard() {
		let n = this.playingCards.shift()
		this.usedCards.push(n)
		return n
	}
	getUsedCards() {
		return this.usedCards
	}
}


// TODO: Array.jsにてArray自体を拡張するべし
const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


export default PlayingCards;