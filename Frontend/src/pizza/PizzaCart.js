/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = window.localStorage;

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#orderOne");

var total = 0;
var numberOfOrders = 0;

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    //Приклад реалізації, можна робити будь-яким іншим способом
    function samePizza(obj) {
        return obj.pizza.id === pizza.id && obj.size === size;
    }
    var same = Cart.filter(samePizza);
    if (same.length > 0) {
        same[0].quantity++;
    } else {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
        numberOfOrders++;
        updateOrderNumber();
    }
    // Оновлюємо суму
    total += pizza[size].price;
    updateTotalSum();
    updateCart();

}

function updateTotalSum(){
    $("#total").html(total);
    Storage.setItem("total",total);
}

function updateOrderNumber(){
    $(".amount_of_orders").html(numberOfOrders);
    Storage.setItem("numberOfOrders",numberOfOrders);
}


function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    Cart.splice(Cart.indexOf(cart_item), 1);
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    var saved = Storage.getItem("cart");
    if (saved) {
        Cart = saved;
        total = Storage.getItem("total");
        updateTotalSum();
        numberOfOrders = Storage.getItem("numberOfOrders");
        updateOrderNumber();
    }
    updateCart();

}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            total += cart_item.pizza[cart_item.size].price;

            //Оновлюємо відображення
            updateCart();
            updateTotalSum();

        });

        $node.find(".minus").click(function () {
            //Зменшуємо
            if (cart_item.quantity == 1) {
                removeFromCart(cart_item);
                numberOfOrders--;
                updateOrderNumber();
            }
            cart_item.quantity -= 1;
            total -= cart_item.pizza[cart_item.size].price;
            //Оновлюємо відображення
            updateCart();
            updateTotalSum();
        });
        $node.find(".delete").click(function () {
            removeFromCart(cart_item);
            total -= cart_item.pizza[cart_item.size].price * cart_item.quantity;
            numberOfOrders--;
            updateOrderNumber();
            updateTotalSum();
            //Оновлюємо відображення
            updateCart();
            updateTotal();
        });

        $cart.append($node);

    }

    Cart.forEach(showOnePizzaInCart);
    Storage.setItem("cart", Cart);
    if (Cart.length === 0) {
        $("#orderButt").attr("disabled", "disabled");
    } else {
        $("#orderButt").removeAttr("disabled");
    }
}
    $("#clear").click(function () {
        clear();
    });

    function clear(){
        Cart = [];
        updateCart();
        total= 0;
        updateTotalSum();
        numberOfOrders = 0;
        updateOrderNumber();
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
//exports.clear = clear;