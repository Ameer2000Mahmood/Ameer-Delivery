var Product = require('../models/product.js');

var mongoose = require('mongoose');
//const { ExplainVerbosity } = require('mongoose/node_modules/mongodb');
mongoose.connect('mongodb://localhost:27017/Ameer',{useNewUrlParser:true,useUnifiedTopology:true});



// var pr = new Product({imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
// title: 'Gothic',
// description: 'ddasf',
// price: 11});
// pr.save();

var products = [
     new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title: 'Gothic',
    description: 'Perfect Game',
    price: 10
}),
new Product({
    imagePath: 'https://d3m9l0v76dty0.cloudfront.net/system/photos/7748553/show/d7936e6fdf945e37c9fb269103a32d44.jpg',
    title: 'Listerine',
    description: 'This a perfect for the teeth.',
    price: 20
}),
new Product({
    imagePath: 'https://d3m9l0v76dty0.cloudfront.net/system/photos/6247882/original/a64dc6a3bb3676ebef196d4fdedc1f4e.jpg',
    title: 'Iphone 12',
    description: 'My Iphone Hahahahaha',
    price: 700
}),
new Product({
    imagePath: 'https://cdn.azrieli.com/Images/f873b27c-a8a6-4d03-aadf-8a577f88d63a/Light/a76cd3a2.jpg',
    title: 'Ipad 9th',
    description: 'good for students and reader.',
    price: 400
}),
new Product({
    imagePath: 'https://m.media-amazon.com/images/I/71BKoNxuAuL._AC_SL1500_.jpg',
    title: 'Usb Adapter',
    description: 'For gaming and Programers!!',
    price: 35
}),
new Product({
    imagePath: 'https://www.cheap-shop.co.il/wp-content/uploads/2021/02/IMG_3229JPG.jpg',
    title: 'Axe',
    description: 'Axe is a line of mens fragrance products offered by the Unilever brand. In North America, South America, parts of Europe and Asia, the brand is known as Axe. ',
    price: 5
}),
new Product({
    imagePath: 'https://ae05.alicdn.com/kf/H3bd88539e71c4667bad520f1e4009e3bu/24-inch-23-8-LED-LCD-Curved-Screen-Monitor-PC-75Hz-HD-Gaming-22-27-Inch.jpg',
    title: 'Curved Screen Monitor',
    description: 'The best curved gaming monitor with an ultrawide screen is the LG 34GP83A-B. It has a 34 inch, 21:9 screen with a gentle 1900R curvature. Motion handling is amazing as it has a 144Hz refresh rate that you can overclock up to 160Hz, and an exceptional response time, resulting in a clear image with almost no blur trail.',
    price: 450
}),
new Product({
    imagePath: 'https://dxracer.co.il/wp-content/uploads/2018/10/GC-F08-NR-H1-003.jpg',
    title: 'Gaming Chair',
    description: 'Razer gaming chairs help you keep an ideal posture, reducing muscle fatigue and strain that can result from long hours of gaming. But if you need to get stuff done, our gaming chairs double up perfectly as an ergonomic work-from-home chair.',
    price: 200
}),
new Product({
    imagePath: 'https://www.bhphotovideo.com/cdn-cgi/image/format=auto,fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/moshi_99mo124901_iglaze_hardshell_case_for_1596724558_1576858.jpg',
    title: 'macbook',
    description: 'The MacBook is a brand of Macintosh notebook computers designed and marketed by Apple Inc. that use Apples macOS operating system since 2006. It replaced the PowerBook and iBook brands during the Mac transition to Intel processors, announced in 2005.',
    price: 1000
}),
new Product({
    imagePath: 'https://d3m9l0v76dty0.cloudfront.net/system/photos/7589552/large/4d96bc98f66e8c038cb34c0dbd741128.jpg',
    title: 'macbook',
    description: 'FIFA 22 is Powered by Football, and features groundbreaking new HyperMotion gameplay technology on PlayStation 5, Xbox Series X|S, and Stadia.',
    price: 50
})
];


   
    
var done=0;
for (var i=0;i< products.length;i++){  
    console.log(i);
    products[i].save(function(err,result)
    {
        // console.log(done);
        // console.log(products[i]);
        done++;
        if(done === products.length)
        {
            exit();
        }
    });
}

function exit(){
mongoose.disconnect();
}
