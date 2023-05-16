const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const Contact= require('./models/contact');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));


var contactList = [
    {
        name: "Yashwin Tapdiya",
        phone: "8085720505"
    },
    {
        name: "Tony Stark",
        phone: "1234567890"
    },
    {
        name: "Chris Peterson",
        phone: "8573957492"
    }
]

app.get('/practice', function(req, res){
    return res.render('practice', {
        title: "Let us play with ejs"
    });
});


app.get('/', function(req, res) {
    Contact.find({})
      .then(function(contacts) {
        return res.render('home', {
          title: "Contact List",
          contact_list: contacts
        });
      })
      .catch(function(err) {
        console.log("Error in fetching contacts from the database:", err);
        return res.status(500).send("Internal Server Error");
      });
  });
  

app.post('/create-contact', async function(req, res) {
    try {
      const newContact = await Contact.create({
        name: req.body.name,
        phone: req.body.phone
      });
      console.log('******', newContact);
      return res.redirect('back');
    } catch (err) {
      console.log('Error in creating a contact!', err);
      return res.status(500).send('Internal Server Error');
    }
  });
  
app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})

// for deleting a contact
app.get('/delete-contact', function(req, res) {
    let id = req.query.id;
  
    Contact.findByIdAndDelete(id)
      .then(function(deletedContact) {
        if (!deletedContact) {
          console.log("Contact not found");
          return res.redirect('back');
        }
        console.log("Contact deleted successfully");
        return res.redirect('back');
      })
      .catch(function(err) {
        console.log("Error in deleting contact:", err);
        return res.redirect('back');
      });
  });
  
