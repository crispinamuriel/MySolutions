/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  //grab coffee counter span and store in var
  const coffeeCounter = document.getElementById('coffee_counter');
  //take the passed in coffee quantity and make it the new text of the span
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  //increment data.coffee by 1 for each click
  data.coffee++;
  //use the updatecoffee function and pass in the new coffee number
  updateCoffeeView(data.coffee);
  //render any new producers that should pop up to the screen
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  //take the array of producers
  producers.forEach((producer) => {
    //foreach producer object, if its price/2 is less than or equal to the current coffee count
    if (coffeeCount >= (producer.price / 2)) {
      //reassign that producer's property of unlocked to be true
      producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  //return a filtered array
 return data.producers.filter((producer) => {
   //filtering the producers array by if their unlocked property is 'true'
   return producer.unlocked === true;
 });
}

function makeDisplayNameFromId(id) {
  //take the id string that is comming in and form an array splitting on "_"
  const idArr = id.split('_');
  //take that array ['producer', 'A'] and map through it
  const idStr = idArr.map((word) => {
    //for each word we will take the first letter and uppercase it, add that to the rest of the word, and return that manipulated word with the Captial at the beginning.
    return word[0].toUpperCase() + word.slice(1);
    //then join those words on a space returning the new string
  }).join(' ');
  return idStr;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  //create a div and assign it to a var
  const containerDiv = document.createElement('div');
  //create a class name for our div
  containerDiv.className = 'producer';
  //use our created function to make a name and store it in displayName
  const displayName = makeDisplayNameFromId(producer.id);
  //find producer.price and store itinto currCost
  const currentCost = producer.price;
  //create our HTML for the producer div
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  //nest our html code inside of our containing div using backticks
  containerDiv.innerHTML = html;
  //return a formatted block of HTML that has the proper (dynamic) display name, producer id, producer quanity, producer cps, and current cost of the producer. WoW!
  return containerDiv;
}

//I stole this function from the top of the script_test.js file where it reads "// This is a helper function to reset the fake dom to a state that roughly imitates what index.html provides in the browser."
function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

function renderProducers(data) {
  //get the div for producers
  const producerContainer = document.getElementById('producer_container');
  //clear the div of any producers
  while (producerContainer.firstChild) {
    producerContainer.removeChild(producerContainer.firstChild);
  }
  //if we have enough coffee set false to true on unlocked property
  unlockProducers(data.producers, data.coffee);
  //grab all the unlocked(filtered) producers
  const unlockedProducersArray = getUnlockedProducers(data);
  //take that array of unlocked producers and...
  unlockedProducersArray.forEach((producer) => {
    //for each producer we will pass it into a call to make producer div, once we get back that formatted HTML we append it to the producer container
    producerContainer.appendChild(makeProducerDiv(producer));
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
   return data.producers.filter((producer) => {
    if (producer.id === producerId) return producer;
  })[0];
}

function canAffordProducer(data, producerId) {
  return getProducerById(data, producerId).price < data.coffee;
}

function updateCPSView(cps) {
  const cpsView = document.getElementById('cps');
  cpsView.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {

  if (data.producers.filter((producer) => producer.id === producerId)[0].price <= data.coffee) {
    data.producers.forEach((producer) => {
      if (producer.id === producerId) {
        producer.qty++;
        data.coffee -= producer.price;
        producer.price = Math.floor(producer.price * 1.25);
        data.totalCPS += producer.cps;
        updateCoffeeView(data.coffee);
      }
    });
    return true;
  }
  return false;
}

function buyButtonClick(event, data) {
  if (event.target.tagName !== 'BUTTON') return;
  if (attemptToBuyProducer(return a filtered arraydata, event.target.id.slice(4)) === false) window.alert('Not enough coffee!');
    attemptToBuyProducer(data, event.target.id.slice(4));
    renderProducers(data);
    updateCPSView(data.totalCPS);
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
