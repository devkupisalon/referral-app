
class Metrics_Result {
    constructor() {
        this.num_orders = Number;
        this.sum_orders = Number;
        this.avg_sum_orders = Number;
        this.num_payment_orders = Number;
        this.sum_payment_orders = Number;
        this.marginality = Number;
        this.sum_bonus = Number;
        this.ranks = Object;
        this.date_from = Date;
        this.date_to = Date;
        this.bonus_history = Object;
    }
}

class User {
    constructor() {
        this.id = 0; String
        this.timestamp = 1; Date
        this.tg_id = 2; Number
        this.tg_username = 3; String
        this.user_name = 4; String
        this.phone = 5; Number
        this.email = 6; String
        this.links = 7; String
        this.manager_id = 8; Number
        this.manager_name = 9; String
        this.folder_id = 10; String
        this.is_delete = 11; Boolean
        this.total = 12; Number
    }
}

class Referral {
    constructor() {
        this.id = 0; String
        this.timestamp = 1; Date
        this.ref_id = 2; String
        this.tg_id = 3; Number
        this.tg_username = 4; String
        this.user_name = 5; String
        this.phone = 6; Number
        this.email = 7; String
        this.services = 8; String
        this.request = 9; String
        this.brand = 10; String
        this.model = 12; String
        this.user_ref_id = 12; String
        this.total = 13; Number
    }
}

class Referral_Link {
    constructor() {
        this.id = 0; String
        this.timestamp = 1; Date
        this.ref_id = 2; String
        this.click = 3; Number
        this.registration = 4; Number
        this.order = 5; Number
        this.order_sum = 6; Number
        this.payment_order = 7; Number
        this.payment_order_sum = 8; Number
        this.marginality = 9; Number;
        this.total = 10; Number
    }
}

class Monitor_Row {
    constructor() {
        this.uid = 0; String
        this.manager = 6; String
        this.brand = 7; String
        this.model = 8; String
        this.status = 15; String
        this.fio = 16; String
        this.phone = 17; Number
        this.source = 18; String
        this.source_name = 19; String
        this.date_created = 36; Date
        this.service = 37; String
        this.total = 37; Number
    }
}

class Bonus_Get {
    constructor() {
        this.id = 0; String
        this.timestamp = 1; Date
        this.ref_link = 2; String
        this.bonus = 3; Number
        this.total = 4; Number
    }
}

class Bonus_Spent {
    constructor() {
        this.id = 0; String
        this.timestamp = 1; Date
        this.spent = 2; String
        this.bonus = 3; Number
        this.total = 4; Number
    }
}

export {
    Metrics_Result,
    User,
    Referral,
    Referral_Link,
    Monitor_Row,
    Bonus_Get,
    Bonus_Spent
};