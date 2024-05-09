const reader = new FileReader();

var settings = {
	"0CostHealth":3,
	"maxHealth":6,
	"heathCost":2,
	"maxCost":18,
	"cardMaxCost":18,
	"cardMinCost":1,
	"attackCost":1,
	"types":{
    "fire":{"strong":["plant"],"weak":["water"]},
    "plant":{"strong":["water"],"weak":["fire"]},
    "water":{"strong":["fire"],"weak":["plant"]}
  }
}
var turn = Math.floor(Math.random()*2)

var Decks = [

  null,
  null
]
var Index = [

  0,
  0
]



function load(){
  document.getElementById("setup").hidden = false
  document.getElementById("game").hidden = true
}

function updateCardsVisual(){
  if(Decks[0].length == 0){return}
  if(Decks[1].length == 0){return}
  // TODO display types
  for(p=0;p<2;p++){

    // p1
    document.getElementById("P"+(p+1)).children.namedItem("Icon").alt = Decks[p][Index[p]].name
    document.getElementById("P"+(p+1)).children.namedItem("Icon").src = Decks[p][Index[p]].imageurl
    // document.getElementById("P1").children.namedItem("Icon").src = p1Deck[p1Index].type
    document.getElementById("P"+(p+1)).children.namedItem("Health").innerHTML = Decks[p][Index[p]].health
    document.getElementById("P"+(p+1)).children.namedItem("Cost").innerHTML = Decks[p][Index[p]].cost
    document.getElementById("P"+(p+1)).children.namedItem("rRoll").innerHTML = Decks[p][Index[p]].fire  
    document.getElementById("P"+(p+1)).children.namedItem("gRoll").innerHTML = Decks[p][Index[p]].plant
    document.getElementById("P"+(p+1)).children.namedItem("bRoll").innerHTML = Decks[p][Index[p]].water
  }
}


function start(){
  document.getElementById("autoroll").checked = false
  if(Decks[0] == null){console.log("No P1 Deck");return}
  if(Decks[1] == null){console.log("No P2 Deck");return}
  document.getElementById("setup").hidden = true
  document.getElementById("game").hidden = false
  // setup game
  Index[0] = Math.floor(Math.random()*Decks[0].length)
  Index[1] = Math.floor(Math.random()*Decks[1].length)
  autoroll()
  // set visuals
  updateCardsVisual()
}

function roll(){
  // win condition
  if(Decks[0].length == 0){
    document.getElementById("winner").hidden = false
    document.getElementById("winner").innerHTML = "Player 2 Wins"
    return
  }
  if(Decks[1].length == 0){
    document.getElementById("winner").hidden = false
    document.getElementById("winner").innerHTML = "Player 1 Wins"
    return
  }

  var cur = 0
  var opp = 0
  if(turn == 0){
    cur = 0
    opp = 1
  }else{
    cur = 1
    opp=0
  }


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
  // TODO type system damage
  console.log("type: "+Decks[cur][Index[cur]].type)
    for(s=0;s<settings.types[Decks[cur][Index[cur]].type].strong.length;s++){
      if(Decks[opp][Index[opp]].type==settings.types[Decks[cur][Index[cur]].type].strong[s]){
        damage++
        console.log("stronger")
      }
    }
    for(w=0;w<settings.types[Decks[cur][Index[cur]].type].weak.length;w++){
      if(Decks[opp][Index[opp]].type==settings.types[Decks[cur][Index[cur]].type].weak[w]){
        damage--
        console.log("weaker")
      }
    }

  console.log("red: "+r)
  console.log("green: "+g)
  console.log("blue: "+b)

  console.log(Decks[cur][Index[cur]])
  if(r >= Decks[cur][Index[cur]].fire){damage++;console.log("r")}
  if(g >= Decks[cur][Index[cur]].plant){damage++;console.log("g")}
  if(b >= Decks[cur][Index[cur]].water){damage++;console.log("b")}
  // damage
  if(damage < 0){damage=0}
  Decks[opp][Index[opp]].health -= damage

  console.log("damage: "+damage)
  // check if a card is dead replace if dead
  if(Decks[cur][Index[cur]].health < 1){
    Decks[cur].splice(Index[cur],1)
    Index[cur] = Math.floor(Math.random()*Decks[cur].length)
  }
  if(Decks[opp][Index[opp]].health < 1){
    Decks[opp].splice(Index[opp],1)
    Index[opp] = Math.floor(Math.random()*Decks[opp].length)
  }

  // swap turns
  if(turn == 0){
    turn = 1
  }else{
    turn = 0
  }

  updateCardsVisual()

  console.log("p1 len"+Decks[0].length)
  console.log("p2 len"+Decks[1].length)
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

        Decks[0] = null
      }else{
        Decks[1] = null
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

      // TODO valid type
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

      Decks[0] = deck
    }else{
      Decks[1] = deck
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