module.exports = function Chout(old)
{
this.items=old.items || {};
this.totalQty=old.totalQty || 0;
this.totalPrice=old.totalPrice || 0;

this.add = function(item, id)
{
    var storedItem= this.items[id];
    if(!storedItem)
    {
        storedItem = this.items[id] = {item: item, qty:0, price:0};
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice+= storedItem.item.price;
};

this.addone = function(item, id){
    var storedItem= this.items[id];
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice+= storedItem.item.price;
};

this.delone = function(item, id){
        var storedItem= this.items[id];
        storedItem.price = storedItem.item.price * storedItem.qty;
        storedItem.qty--;
        if(storedItem.qty>0){
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty--;
        this.totalPrice-= storedItem.item.price;
        }
        else{
            this.totalPrice-= storedItem.item.price;
            this.items[id]=null;
            
        }
    };

this.del = function(item, id){
    var storedItem= this.items[id];
    this.totalQty -=storedItem.qty;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalPrice-= storedItem.price;
    this.items[id]=null;
    if(this.totalQty === 0)
    {
        this.items={};
    }
};

this.generateArray = function() {
    var arr= [];
    for (var id in this.items){
        if(this.items[id]!=null){
        arr.push(this.items[id]);
        }

    }
    return arr;
};
};