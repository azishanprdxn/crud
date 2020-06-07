/* Author: Zishan Ansari */

// Creating customer class and constructor
class Customer {
  constructor(name, course, author) {
    this.name = name;
    this.course = course;
    this.author = author;
  };
}

// Adding a Detail
document.getElementById('submit').onclick = () => {
  // Get form values
  const name = document.getElementById('name').value;
  const course = document.getElementById('course').value;
  const author = document.getElementById('author').value;
  let isError = false;
  // Validate Fields
  if (!name || !author || !course) {
    CustomerDetails.showMessage('Cannot be Empty!', 'helper');
  }
  let helpers = document.querySelectorAll('.helper');
  helpers.forEach((helper) => {
    if (helper.classList.contains('visible')) {
      isError = true;
    } else if (!isError) {
      isError = false;
    }
  });
  if (!isError) {
    const customer = new Customer(name, course, author);
    CustomerDetails.addCustomerDetails(customer);
  }
}

// DataStorage Class for Handling Storage
class DataStorage {
  // Get Customer objects from LocalStorage
  static getCustomers() {
    let Customers;
    if (localStorage.getItem('Customers') === null) {
      Customers = [];
    } else {
      Customers = JSON.parse(localStorage.getItem('Customers'));
    }

    return Customers;
  }

  // Add Customer to LocalStorage
  static addCustomer(customer) {
    const Customers = DataStorage.getCustomers();
    if (customer.id !== undefined) {
      Customers.push(customer);
      localStorage.setItem('Customers', JSON.stringify(Customers));
    }
  }

  // Remove Customer from LocalStorage
  static removeCustomer(element) {
    if (element.classList.contains('customer')) {
      const Customers = DataStorage.getCustomers();
      let existingCustomer = element;
      // finding an id through filtering and splicing that object from array
      Customers.splice(Customers.findIndex(e =>
        e.id == existingCustomer.dataset.id), 1);
      localStorage.setItem('Customers', JSON.stringify(Customers));
    }
  }
}

// To maintain count of Customer
let count = 0;

// Customer Details
class CustomerDetails {
  // Displays Customer when page is loaded
  static displayCustomers() {
    const Customers = DataStorage.getCustomers();
    Customers.forEach((storedCustomer) =>
      CustomerDetails.displayCustomer(storedCustomer));
  }

  static addCustomerDetails(customer) {
    customer.id = count;
    // Adds Customer to localstorage
    DataStorage.addCustomer(customer);
    CustomerDetails.resetForm();
    CustomerDetails.displayCustomer(customer);
    CustomerDetails.showMessage('Customer Added', 'added');
    count++;
  }

  // Display customer
  static displayCustomer(customer) {
    const customerList = document.querySelector('.customer-list');
    const customerData = document.createElement('div');
    customerData.innerHTML = `
    <figure>
      <span class="fa fa-trash del-icon" title="Delete"></span>
			<img src="https://via.placeholder.com/298x240/454545/ffffff?text=Customer" class="customer-img" alt="Customer Image">
      <div class="customer-details">
        <ul>
          <li>
            <span class="label name">name :</span>
            <span id="customer-name">${customer.name}</span>
          </li>
          <li>
            <span class="label course">course :</span>
            <span id="customer-course">${customer.course}</span>
          </li>
          <li>
            <span class="label author">author :</span>
            <span id="customer-author">${customer.author}</span>
          </li>
        </ul>
      </div>
    </figure>`;
    customerData.setAttribute('class', 'customer');
    customerList.appendChild(customerData);
  }

  // remove customer card from Dom
  static deleteCustomer(element) {
    if (element.classList.contains('customer')) {
      element.remove();
    }
  }

  // displays a message
  static showMessage(message, className) {
    if (className === "helper") {
      let helpers = document.querySelectorAll('.helper');
      helpers.forEach((helper) => {
        if (helper.previousElementSibling.value === "") {
          helper.className = `${className} visible`;
          helper.innerHTML = message;
        }
      })
    } else if (className === "removed" || className === "added") {
      const heading = document.querySelector('h1');
      const messageText = document.createElement('span');
      messageText.className = `${className} visible`;
      messageText.classList.add('message');
      messageText.innerHTML = message;
      heading.appendChild(messageText);
    }
    // Message will be displayed for 3s
    setTimeout(() => {
      document.querySelectorAll('.visible').forEach((element) => {
        element.classList.remove('visible');
      })
    }, 4000);
  }

  // Clear form
  static resetForm() {
    document.querySelector('form').reset();
  }
}

function removeData(element) {
  DataStorage.removeCustomer(element.currentTarget);
  CustomerDetails.deleteCustomer(element.currentTarget);
  CustomerDetails.showMessage('Customer Deleted', 'removed');
}

// Removing a Data
setInterval(() => {
  document.querySelectorAll('.customer').forEach((element) => {
    element.onclick = removeData;
  });
}, 2000);

// Display Customers
document.addEventListener('DOMContentLoaded', CustomerDetails.displayCustomers);