var AVAILABLE_SHIPPING_OPTIONS = ["cod_tcat", "post", "tcat", "pickup", "store_pick", "seven_pickup", "seven_pickup_n_pay", "pay_n_store_pick", "pay_n_pickup", "self_fill"];

var localizedNameForOption = function(name) {
  var mapping = {
    "cod_tcat": "貨到付款",
    "post": "郵局",
    "tcat": "宅配",
    "pickup": "面交",
    "store_pick": "店取",
    "seven_pickup": "7-11 純取貨",
    "seven_pickup_n_pay": "7-11 取貨付款",
    "pay_n_store_pick": "先付款後店取",
    "pay_n_pickup": "先付款後面交",
    "self_fill": "顧客自填運費",
  }

  return mapping[name] ? mapping[name] : "未知的運送方式";
};

module.exports = {
    AVAILABLE_SHIPPING_OPTIONS: AVAILABLE_SHIPPING_OPTIONS,
    localizedNameForOption: localizedNameForOption,
}
