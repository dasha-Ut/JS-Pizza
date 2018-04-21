/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var crypto	=	require('crypto');
var LIQPAY_PUBLIC_KEY='i15543150871';
var LIQPAY_PRIVATE_KEY='GwnRRGeMliWmCZcZN1G6BgkHCForX9w4LN0tIGzz';


exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};
function base64(str)	 {
    return new Buffer(str).toString('base64');
}
function sha1(string) {
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}

exports.createOrder = function(req, res) {
    var order_info = req.body;
    var description=
        "Замовник: "+order_info.name+"\n" +
        "Адреса: "+order_info.address+"\n" +
        "Телефон: "+order_info.phone+"\n" +
        "Замовлення:\n"+order_info.pizzas +
        "Разом "+order_info.costs+".00грн";
    var order={
        version:	3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action:	"pay",
        amount:	order_info.costs,
        currency:	"UAH",
        description:	description,
        order_id:	Math.random(),
        sandbox:	1
    };
    var data	=	base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
    res.send({
        status: true,
        data:data,
        signature:signature
    });
};