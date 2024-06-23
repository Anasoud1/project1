const UserLogin = require('../models/loginSchema');  // folder for the structure of db
const moment = require('moment'); // time

const jwt = require('jsonwebtoken');

/* --- countries list --- */
const country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

const user_index_get = (req, res) => { 
    const email = req.user.email;
    UserLogin.find({email: email})
    .then((result) => {
        console.log("result: ", result[0].customers);
        res.render("index", {users: result[0].customers, moment: moment});
    }).catch((err) => {
        console.log("failed to fetch data ", err);
    })
}; 

const user_add_get = (req, res) => {
    res.render("add", {country_list: country_list});   
}

const user_search_get= (req, res) => {
    const name = req.query.searchText.trim(); // trim() => remove spaces at start & end // we use req.query because we used in form method=get 
    console.log("Search query:", name);

    UserLogin.find({email: req.user.email})
    .then((result) => {
        console.log("search result", result[0].customers);

        const searchUser = result[0].customers.filter(user => (user.firstName === name || user.lastName === name))
        console.log('search user after filter: ', searchUser);
        res.render('search', {users: searchUser, searchName: name});
    })
    .catch((err) => console.log('failed to find to search user'))
}

const user_view_get = (req, res) => {  // when you use ':id' put the endpoint in the end you should respect the oder
    const id = req.params.id;

    UserLogin.find({'customers._id': id})
    .then((result) => {
        console.log('result: ', result[0].customers[0]);
        res.render("view", {user: result[0].customers[0], moment: moment});  
    }).catch((err) => {
        console.log("failed to fetch data ", err);
    }) 
}

const user_edit_get = (req, res) => {

    UserLogin.find({'customers._id': req.params.id})
    .then((result) => {
        console.log(result[0].customers[0]);
        res.render("edit", {user: result[0].customers[0], country_list: country_list});  
    }).catch((err) => {$
        console.log("failed to fetch data ", err);
    }) 
}

const user_post = (req, res) => { // '/add' same as attribute action in 'form'
    // const user = jwt.verify(token, process.env.SECRET);
    
    console.log("req.user.email: ", req.user.email)
    UserLogin.updateOne({email: req.user.email}, {$push: 
        {customers: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            telephone: req.body.telephone,
            age: req.body.age,
            country: req.body.country,
            gender: req.body.gender,
            // createdAt: new Date()
          }}
        })
    .then(() => {
        res.redirect('/add');
        console.log("Customer added successfuly")
    })
    .catch((err) => console.log("failed to add customer ", err))
}

const user_update = (req, res) => {

    
    UserLogin.updateOne({'customers._id': req.params.id},
        {
            "customers.$.firstName": req.body.firstName,
            "customers.$.lastName": req.body.lastName,
            "customers.$.email": req.body.email,
            "customers.$.telephone": req.body.telephone,
            "customers.$.age": req.body.age,
            "customers.$.country": req.body.country,
            "customers.$.gender": req.body.gender,
            // "customers.$.updatedAt": new Date(),
        })
        .then((r) => {
            console.log('r', r);
            res.redirect('/');
            console.log("Customer updated successfuly");
        }).catch((err) => console.log("failed to update customer ", err))
}

const user_delete = (req, res) => {
    const id = req.params.id;
    
    UserLogin.updateOne({'customers._id': id}, {$pull: {customers: {_id: id}}})
    .then(() => {
        console.log("delete user successfully");
        res.redirect('/');
    })
    .catch(err => console.log("failed to delete ", err))  
}

module.exports = {user_index_get, user_add_get, user_search_get, user_view_get, user_edit_get, user_post, user_update, user_delete};