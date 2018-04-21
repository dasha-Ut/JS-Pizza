/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
var $order_number=$(".amount_of_orders");
//HTML едемент куди будуть додаватися піци
var $cart = $("#orderOne");


var empty = "<div id=\"empty\">Пусто в холодильнику?<br>Замовте піцу!</div>";

function addToCart(pizza, size) {

    var exists=false;
    if(Cart.length>0){
        Cart.forEach(function(item){
            if(item.pizza.id===pizza.id && item.size===size){
                exists=true;
                item.quantity++;
            }
        });
    }
    else{
        $(".suma").prepend($(Templates.PizzaSum));
        $("#buyPizza").prop('disabled', false);
    }
    //Приклад реалізації, можна робити будь-яким іншим способом
    if(!exists) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
        localStorage.setItem(pizza.id+" "+size, JSON.stringify({
            pizza: pizza,
            size :size,
            quantity:1
        }));
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}


function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    localStorage.removeItem(cart_item.pizza.id+" "+cart_item.size);
    //TODO: треба зробити
    for(var i=0, j=0;i<Cart.length;i++){
        if(Cart[i]!==cart_item)Cart[j++]=Cart[i];
    }
    Cart.pop();
    if(Cart.length===0){
        $("#suma").remove();
        $("#totalBuy").remove();
    }
    //Після видалення оновити відображення
    updateCart();
}


function initialiseCart() {
    Object.keys(localStorage).forEach(function(key){
        Cart.push(JSON.parse(localStorage.getItem(key)));
    });
    if(Cart.length>0){
        $(".suma").prepend($(Templates.PizzaSum));
        $("#buyPizza").prop('disabled', false);
    }

    updateCart();

}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    var sum=0;
    //Очищаємо старі піци в кошику
    $cart.html("");

    $order_number.text(Cart.length);
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        localStorage.setItem(cart_item.pizza.id+" "+cart_item.size, JSON.stringify(cart_item));

        sum+=cart_item.pizza[cart_item.size].price * cart_item.quantity;

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            if(cart_item.quantity===1)removeFromCart(cart_item);
            else {
                cart_item.quantity -= 1;
                //Оновлюємо відображення
                updateCart();
            }
        });
        $node.find(".delete").click(function(){
            removeFromCart(cart_item);
        });

        $cart.append($node);
    }

    if(Cart.length===0){
        $cart.html(empty);
        $("#buyPizza").prop('disabled', true);
    }
    else {
        Cart.forEach(showOnePizzaInCart);
        $("#totalBuy").text(sum + " грн");
    }
}


     $("#clear").click(function () {
        clear();
     });
    function clear(){
        Cart = [];
        $("#suma").remove();
        $("#totalBuy").remove();
        localStorage.clear();
        updateCart();

    }


     $("#orderButt").click(function () {
         if(Cart.length !== 0){
             location.href="/order.html";
         }
     });

     $("#editButt").click(function () {
         if(Cart.length !== 0){
             location.href="/";
         }
     });

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
exports.getPizzaInCart = getPizzaInCart;
