const reader = new FileReader();

var settings = {
	"0CostHealth":3,
	"maxHealth":6,
	"heathCost":2,
	"maxCost":18,
	"cardMaxCost":18,
	"cardMinCost":1,
	"attackCost":1,
  "maxCards":6,
}
var p1Deck = null
var p2Deck = null
var p1Index = 0
var p2Index = 0
var turn = Math.floor(Math.random()*2)



function load(){
  document.getElementById("setup").hidden = false
  document.getElementById("game").hidden = true
}

function updateCardsVisual(){
  if(p1Deck.length == 0){return}
  if(p2Deck.length == 0){return}
  // TODO display types
  // p1
  document.getElementById("P1").children.namedItem("Icon").src = p1Deck[p1Index].imageurl
  // document.getElementById("P1").children.namedItem("Icon").src = p1Deck[p1Index].type
  document.getElementById("P1").children.namedItem("Health").innerHTML = p1Deck[p1Index].health
  document.getElementById("P1").children.namedItem("Cost").innerHTML = p1Deck[p1Index].cost
  document.getElementById("P1").children.namedItem("rRoll").innerHTML = p1Deck[p1Index].fire  
  document.getElementById("P1").children.namedItem("gRoll").innerHTML = p1Deck[p1Index].plant
  document.getElementById("P1").children.namedItem("bRoll").innerHTML = p1Deck[p1Index].water
  // p2
  document.getElementById("P2").children.namedItem("Icon").src = p2Deck[p2Index].imageurl
  // document.getElementById("P2").children.namedItem("Icon").src = p2Deck[p2Index].type
  document.getElementById("P2").children.namedItem("Health").innerHTML = p2Deck[p2Index].health
  document.getElementById("P2").children.namedItem("Cost").innerHTML = p2Deck[p2Index].cost
  document.getElementById("P2").children.namedItem("rRoll").innerHTML = p2Deck[p2Index].fire  
  document.getElementById("P2").children.namedItem("gRoll").innerHTML = p2Deck[p2Index].plant
  document.getElementById("P2").children.namedItem("bRoll").innerHTML = p2Deck[p2Index].water
}


function start(){
  document.getElementById("autoroll").checked = false
  if(p1Deck == null){console.log("No P1 Deck");return}
  if(p2Deck == null){console.log("No P2 Deck");return}
  document.getElementById("setup").hidden = true
  document.getElementById("game").hidden = false
  // setup game
  p1Index = Math.floor(Math.random()*p1Deck.length)
  p2Index = Math.floor(Math.random()*p2Deck.length)
  autoroll()
  // set visuals
  updateCardsVisual()
}

function roll(){
  // win condition
  if(p1Deck.length == 0){
    document.getElementById("winner").hidden = false
    document.getElementById("winner").innerHTML = "Player 2 Wins"
    return
  }
  if(p2Deck.length == 0){
    document.getElementById("winner").hidden = false
    document.getElementById("winner").innerHTML = "Player 1 Wins"
    return
  }

  // TODO type system damage
  console.log("ROLL")
  var r = Math.floor(Math.random()*6)+1
  var g = Math.floor(Math.random()*6)+1
  var b = Math.floor(Math.random()*6)+1
  // set rolls visualy
  document.getElementById("redRoll").innerHTML = r
  document.getElementById("greRoll").innerHTML = g
  document.getElementById("bluRoll").innerHTML = b
  // 
  // apply damage
  var damage = 0
  if(turn == 0){
    // p1
    if(r >= p1Deck[p1Index].fire){damage++}
    if(g >= p1Deck[p1Index].green){damage++}
    if(b >= p1Deck[p1Index].water){damage++}
    // damage
    p2Deck[p2Index].health -= damage

  }else{
    // p2
    if(r >= p2Deck[p2Index].fire){damage++}
    if(g >= p2Deck[p2Index].green){damage++}
    if(b >= p2Deck[p2Index].water){damage++}
    // damage
    p1Deck[p1Index].health -= damage
  }
  // check if a card is dead replace if dead
  if(p1Deck[p1Index].health < 1){
    p1Deck.splice(p1Index,1)
    p1Index = Math.floor(Math.random()*p1Deck.length)
  }
  if(p2Deck[p2Index].health < 1){
    p2Deck.splice(p2Index,1)
    p2Index = Math.floor(Math.random()*p2Deck.length)
  }

  // swap turns
  if(turn == 0){
    turn = 1
  }else{
    turn = 0
  }

  updateCardsVisual()

  console.log("p1 len"+p1Deck.length)
  console.log("p2 len"+p2Deck.length)
}

async function autoroll() {
    setInterval(function () {
      if(document.getElementById("controls").children.namedItem("autoroll").checked){
        roll()
      }
    }, 1000);
}

function checkdeck(id){
  console.log(document.getElementById("setup").children.namedItem(id).files[0])
  reader.readAsText(document.getElementById("setup").children.namedItem(id).files[0])
  
  setTimeout(function(){
    function failed(){
      console.log("Invalid")
      if(id == "P1Deck"){

        p1Deck = null
      }else{
        p2Deck = null
      }
      document.getElementById("setup").children.namedItem(id+"Invalid").hidden = false
    }
    var deckcost = 0
    var deck = JSON.parse(reader.result)
    // validate deck then set to global deck

    // card count
    if(deck.length > settings.maxCards){
      // invalid
      console.log("Too Many Cards")
      failed()
      return
    }
    // card loop
    for(let i=0;i<deck.length;i++){
      // check if all data is there
      console.log(deck[i])
      // validate
      if(deck[i].name == null){console.log("No name");failed();return}
      if(deck[i].type == null){console.log("No type");failed();return}
      if(deck[i].fire == null){console.log("No fire");failed();return}
      if(deck[i].water == null){console.log("No water");failed();return}
      if(deck[i].plant == null){console.log("No plant");failed();return}
      if(deck[i].health == null){console.log("No health");failed();return}
      if(deck[i].imageurl == null){console.log("No icon");failed();return}

      // valid type
      if(deck[i].type < 0 && deck[i].type > 3){
        console.log("bad type")
        failed()
        return
      }

      // add card cost to deck cost
      var cardcost = 0
      // damages
      cardcost += Math.abs(deck[i].fire-6)*settings.attackCost
      cardcost += Math.abs(deck[i].water-6)*settings.attackCost
      cardcost += Math.abs(deck[i].plant-6)*settings.attackCost
      // health
      cardcost += (settings["0CostHealth"]-deck[i].health)*settings.heathCost
      console.log(cardcost)



      if(cardcost < settings.cardMinCost){
        console.log("Card too small")
        failed()
        return
      }
      if(cardcost > settings.cardMaxCost){
        console.log("Card too big")
        failed()
        return
      }
      deck[i].cost = cardcost
      deckcost += cardcost
    }
    // deck cost
    if (deckcost > settings.maxCost){
      console.log("Cost too high")
      failed()
      return
    }
    console.log("Deck Valid")
    if(id == "P1Deck"){

      p1Deck = deck
    }else{
      p2Deck = deck
    }

    document.getElementById("setup").children.namedItem(id+"Invalid").hidden = true

  },10)

}

function changerules(){
  return
  // TODO Later
  console.log("Updateing rules")
  reader.readAsText(document.getElementById("setup").children.namedItem("rules").files[0])
  var deck = JSON.parse("{}")
  setTimeout(function(){
    deck = JSON.parse(reader.result)
    console.log(deck[0])
  },1000)
  // TODO recheck decks
}