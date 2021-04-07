// Create needed constants
const list = document.querySelector('#auctionlist');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');
const createDiv = document.querySelector('#forms');
const listDiv = document.querySelector('#listDetails');
const detailsDiv = document.querySelector('#detailsDiv');
const homeLink = document.querySelector('#homeLink');
const createLink = document.querySelector('#createLink');

// Create an instance of a db object for us to store the open database in
let db;

window.onload = function () {
   // Open our database; it is created if it doesn't already exist
   // (see onupgradeneeded below)
   let request = window.indexedDB.open('carAuction, 1');

   // onerror handler signifies that the database didn't open successfully
   request.onerror = function () {
      console.log('Database failed to open');
   }

   // onsuccess handler signifies that the database opened successfully
   request.onsuccess = function () {
      console.log('Database opened sucessfully!');

      // Store the opened database object in the db variable. This is used a lot below
      db = request.result;

      // Run the displayData() function to display the notes already in the IDB
      displayData();

   }

   // Setup the database tables if this has not already been done
   request.onupgradeneeded = function (e) {
      // Grab a reference to the opened database
      let db = e.target.result;

      // Create an objectStore to store our notes in (basically like a single table)
      // including a auto-incrementing key
      let objectStore = db.createObjectStore('carAuction', {
         keyPath: 'id',
         autoIncrement: true
      });

      // Define what data items the objectStore will contain
      objectStore.createIndex('email', 'email', {
         unique: false
      });
      objectStore.createIndex('phone', 'phone', {
         unique: false
      });
      objectStore.createIndex('firstName', 'firstName', {
         unique: false
      });
      objectStore.createIndex('lastName', 'lastName', {
         unique: false
      });
      objectStore.createIndex('address', 'address', {
         unique: false
      });
      objectStore.createIndex('city', 'city', {
         unique: false
      });
      objectStore.createIndex('province', 'province', {
         unique: false
      });
      objectStore.createIndex('postalCode', 'postalCode', {
         unique: false
      });
      objectStore.createIndex('make', 'make', {
         unique: false
      });
      objectStore.createIndex('model', 'model', {
         unique: false
      });
      objectStore.createIndex('year', 'year', {
         unique: false
      });
      console.log('Database setup complete!');
   }

   // Create an onsubmit handler so that when the form is submitted the addData() function is run
   form.onsubmit = addData;

   // Define the addData() function
   function addData(e) {
      // prevent default - we don't want the form to submit in the conventional way
      e.preventDefault();
      if (form.checkValidity() === false) {
        
         e.stopPropagation();
      
      }
      else{
        
 let newItem = {
         email: email.value,
         phone: phone.value,
         firstName: firstName.value,
         lastName: lastName.value,
         address: address.value,
         city: city.value,
         province: province.value,
         postalCode: postalCode.value,
         make: make.value,
         model: model.value,
         year: year.value

      };

      // open a read/write db transaction, ready for adding the data
      let transaction = db.transaction(['carAuction'], 'readwrite');

      // call an object store that's already been added to the database
      let objectStore = transaction.objectStore('carAuction');

      // Make a request to add our newItem object to the object store
      var request = objectStore.add(newItem);
      request.onsuccess = function () {
         // Clear the form, ready for adding the next entry
         form.reset();
         displayData();
         showHome();
      };

      // Report on the success of the transaction completing, when everything is done
      transaction.oncomplete = function () {
         console.log('Transaction completed: database modification finished.');

      }
      // update the display of data to show the newly added item, by running displayData() again.

      transaction.onerror = function () {
         console.log('Transaction not opened due to error');
      }
      }
      // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
     

   }

   function displayData() {
      // Here we empty the contents of the list element each time the display is updated
      // If you didn't do this, you'd get duplicates listed each time a new note is added
      while (list.firstChild) {
         list.removeChild(list.firstChild);
      }

      // Open our object store and then get a cursor - which iterates through all the
      // different data items in the store
      let objectStore = db.transaction('carAuction').objectStore('carAuction');
      objectStore.openCursor().onsuccess = function (e) {

         // Get a reference to the cursor
         let cursor = e.target.result;

         // If there is still another data item to iterate through, keep running this code
         if (cursor) {
            // Create a list item, h3, and p to put each data item inside when displaying it
            // structure the HTML fragment, and append it inside the list
            let listItem = document.createElement('li');
            let h3 = document.createElement('h4');
            let para = document.createElement('p');
            listItem.appendChild(h3);
            listItem.appendChild(para);
            list.appendChild(listItem);

            // Put the data from the cursor inside the h3 and para
            h3.textContent = cursor.value.firstName + cursor.value.lastName;
            para.textContent = cursor.value.make + " " + cursor.value.model;

            // Store the ID of the data item inside an attribute on the listItem, so we know
            // which item it corresponds to. This will be useful later when we want to delete items
            listItem.setAttribute('data-aution-id', cursor.value.id);

            let deleteBtn = document.createElement('button');
            listItem.appendChild(deleteBtn);
            deleteBtn.textContent = 'Delete!';
            let detailsBtn = document.createElement('button');
            listItem.appendChild(detailsBtn);
            detailsBtn.textContent = 'Details!';
            detailsBtn.onclick = details(cursor.value.id);
            // Set an event handler so that when the button is clicked, the deleteItem()
            // function is run
            deleteBtn.onclick = deleteItem;

            // Iterate to the next item in the cursor
            cursor.continue();
         } else {
            // Again, if list item is empty, display a 'No notes stored' message
            if (!list.firstChild) {
               let listItem = document.createElement('li');
               listItem.textContent = 'No cars in auction';
               list.appendChild(listItem);
            }
         }
         // if there are no more cursor items to iterate through, say so
         console.log('No more data');
      }
   };

   function deleteItem(e) {
      // retrieve the name of the task we want to delete. We need
      // to convert it to a number before trying it use it with IDB; IDB key
      // values are type-sensitive.
      let noteId = Number(e.target.parentNode.getAttribute('data-aution-id'));

      let transaction = db.transaction(['carAuction'], 'readwrite');
      let objectStore = transaction.objectStore('carAuction');
      let reqeust = objectStore.delete(noteId);

      transaction.oncomplete = function () {
         // delete the parent of the button
         // which is the list item, so it is no longer displayed
         e.target.parentNode.parentNode.removeChild(e.target.parentNode);
         console.log(noteId + ' Deleted!');
      };

      // Again, if list item is empty, display a 'No notes stored' message
      if (!list.firstChild) {
         let listItem = document.createElement('li');
         listItem.textContent = 'No data to show!';
         list.appendChild(listItem);
      }
   };
}

function details(ex) {
   // retrieve the name of the task we want to delete. We need
   // to convert it to a number before trying it use it with IDB; IDB key
   // values are type-sensitive.
   const cardImg = document.querySelector('#cardImg');
   const cardTitle = document.querySelector('#cardTitle');
   const cardText = document.querySelector('#cardText');
   const cardList = document.querySelector('#cardList');
   const cl1 = document.querySelector('#cl1');
   const cl2 = document.querySelector('#cl2');
   
   let listItem = document.createElement('li');
   let h3 = document.createElement('h4');
   
   listItem.appendChild(h3);
   cardList.appendChild(listItem);
   // Open our object store and then get a cursor - which iterates through all the
   // different data items in the store
   let objectStore = db.transaction('carAuction').objectStore('carAuction');
   objectStore.openCursor().onsuccess = function (e) {

      // Get a reference to the cursor
    
     
			//Since our store uses an int as a primary key, that is what we are getting
			//The cool part is when you start using indexes...
			var deferred = $.Deferred(),
			
			request = objectStore.get(parseInt(ex));

			request.onsuccess = function (evt) {
            var x=evt.target.result;
            const uri="https://www.jdpower.com/cars/"+x.year+"/"+x.make+"/"+x.model;
				console.log(evt);
				deferred.resolve(evt.target.result);
            
            cardTitle.textContent="Vehicle: "+x.make+" "+x.model+" "+x.year;
            cardText.textContent=x.firstName+" "+x.lastName+" From "+x.address;
            cardText.innerHTML="<p> Phone "+x.phone+" Email: "+x.email+"</p> <br />";
            cl1.setAttribute("href",uri);
            
            cardImg.setAttribute("src",uri);
            showDetails();
			};

			request.onerror = function (evt) {
				deferred.reject("DBError: could not get " + index + " from " + testStoreName);
			};

			return deferred.promise();
		
   }
}
$(document).ready(function () {
   var $make = $('#make'),
      $model = $('#model'),
      $options = $model.find('option');

   $make.on('change', function () {
      // We now filter model using the data-make attribute, not value
      $model.html($options.filter('[data-make="' + this.value + '"]'));
      $model.trigger('change');
   }).trigger('change');

});

function getParameterByName(name, url = window.location.href) {
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function showCreate() {
   createDiv.style.display = "block";
   detailsDiv.style.display = "none";
   listDiv.style.display = "none";
   homeLink.classList.remove('active');
   createLink.classList.add('active');
}

function showHome() {
   createDiv.style.display = "none";
   detailsDiv.style.display = "none";
   listDiv.style.display = "block";
   homeLink.classList.add('active');
   createLink.classList.remove('active');
}
function showDetails() {
   createDiv.style.display = "none";
   detailsDiv.style.display = "block";
   listDiv.style.display = "none";
   homeLink.classList.add('active');
   createLink.classList.remove('active');
}
(function() {
   'use strict';
   window.addEventListener('load', function() {
     // Fetch all the forms we want to apply custom Bootstrap validation styles to
     var forms = document.getElementsByClassName('needs-validation');
     // Loop over them and prevent submission
     var validation = Array.prototype.filter.call(forms, function(form) {
       form.addEventListener('submit', function(event) {
         if (form.checkValidity() === false) {
           event.preventDefault();
           event.stopPropagation();
         }
         form.classList.add('was-validated');
       }, false);
     });
   }, false);
 })();
function checkPostal(postal) {
   var regex = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
   if (regex.test(postal.value))
      return true;
   else {

      return false;
   }
}
var reg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

function PhoneValidation(phoneNumber) {
   if (reg.test(phoneNumber.value))
      return true;
   else {

      return false;

   }

}