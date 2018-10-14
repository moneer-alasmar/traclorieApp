// STORAGE CONTROLLER
const StorageCtrl = (function(){
  return {
    // PUBLIC METHODS
    storeItem: function(item) {
      let items;
      // CHECK IF ANY ITEMS IN LOCAL STORAGE
      if(localStorage.getItem('items') === null){
        items = [];
        // PUSH NEW ITEM
        items.push(item);

        // SET LOCAL STORAGE
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // GET DATA FROM LOCAL STORAGE
        items = JSON.parse(localStorage.getItem('items'));

        // PUSH NEW ITEM
        items.push(item);

        // RE SET LOCAL STORAGE
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if(localStorage.getItem('items') === null) {
        items = []; 
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if(id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();



// ITEM CONTROLLER
const ItemCtrl = (function(){
  // ITEM CONSTRUCTOR
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // DATA STRUCTURE / STATE
  const data = {
    // items: [
    //   TEST DATA
    //   {id: 0, name: 'Steak Dinner', calories: 1200},
    //   {id: 1, name: 'Seafood Dinner', calories: 1000},
    //   {id: 2, name: 'Eggs', calories: 300},
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }
  // PUBLIC METHODS
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      // CREATE ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // CALORIES TO NUMBER
      calories = parseInt(calories);

      // CREATE NEW ITEM
      newItem = new Item(ID, name, calories);

      // ADD TO ITEMS ARRAY
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      // LOOP THROUGH ITEMS
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // CALORIES TO NUMBER
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // GET IDs
      const ids = data.items.map(function(item){
        return item.id;
      });

      // GET INDEX
      const index = ids.indexOf(id);

      // REMOVE ITEM
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;
      // LOOP THROUGH ITEMS AND ADD CALORIES
      data.items.forEach(function(item){
        total += item.calories;
      });
      // SET TOTAL CALORIES IN DATA
      data.totalCalories = total;

      // RETURN TOTAL
      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }
})();



// UI CONTROLLER
const UiCtrl = (function(){
  const UiSelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    clearBtn: '.clear-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // PUBLIC METHODS
  return {
    populateItemList: function(items){
      let html = '';
      items.forEach(function(item){
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      });

      // INSERT LIST ITEMS TO DOM
      document.querySelector(UiSelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UiSelectors.itemNameInput).value,
        calories: document.querySelector(UiSelectors.itemCaloriesInput).value,
      }
    },
    addListItem: function(item){
      // SHOW THE LIST
      document.querySelector(UiSelectors.itemList).style.display = 'block';
      // CREATE LI ELEMENT
      const li = document.createElement('li');
      // ADD CLASS
      li.className = 'collection-item';
      // ADD ID
      li.id = `item-${item.id}`;
      // ADD HTML
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
      `;
      // INSERT ITEM TO DOM
      document.querySelector(UiSelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UiSelectors.listItems);

      // TURN NODE LIST INTO ARRAY
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UiSelectors.itemNameInput).value = '';
      document.querySelector(UiSelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UiSelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UiSelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UiCtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UiSelectors.listItems);

      // TURN NODE LIST INTO ARRAY
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      })
    },
    hideList: function(){
      document.querySelector(UiSelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UiSelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      UiCtrl.clearInput();
      document.querySelector(UiSelectors.updateBtn).style.display = 'none';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'none';
      document.querySelector(UiSelectors.addBtn).style.display = 'inline';
      document.querySelector(UiSelectors.backBtn).style.display = 'none';

    },
    showEditState: function(){
      document.querySelector(UiSelectors.updateBtn).style.display = 'inline';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UiSelectors.addBtn).style.display = 'none';
      document.querySelector(UiSelectors.backBtn).style.display = 'inline';

    },
    getSelectors: function(){
      return UiSelectors;
    }
  }
})();



// APP CONTROLLER
const App = (function(ItemCtrl, StorageCtrl, UiCtrl){
  // LOAD EVENT LISTENERS
  const loadEventListeners = function(){
    // GET UI SELECTORS
    const UiSelectors = UiCtrl.getSelectors();

    // ADD ITEM EVENT
    document.querySelector(UiSelectors.addBtn).addEventListener('click', itemAddSubmit);

    // DISABLE SUBMIT ON ENTER
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // EDIT ICON CLICK EVENT
    document.querySelector(UiSelectors.itemList).addEventListener('click', itemEditClick);

    // UPDATE ITEM EVENT
    document.querySelector(UiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // BACK BUTTON EVENT
    document.querySelector(UiSelectors.backBtn).addEventListener('click', UiCtrl.clearEditState);
    
    // CLEAR BUTTON EVENT
    document.querySelector(UiSelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    // DELETE BUTTON EVENT
    document.querySelector(UiSelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

  }

  // ADD ITEM SUBMIT
  const itemAddSubmit = function(e){
    // GET FORM INPUT FROM UICONTROLLER
    const input = UiCtrl.getItemInput();
    
    // CHECK FOR EMPTY INPUTS
    if(input.name !== '' && input.calories !== ''){
      // ADD ITEM
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // ADD ITEM TO UI
      UiCtrl.addListItem(newItem);

      // GET TOTAL CALORIES
      const totalCalories = ItemCtrl.getTotalCalories();

      // ADD TOTAL CALORIES TO UI
      UiCtrl.showTotalCalories(totalCalories);

      // STORE IN LOCAL STORAGE
      StorageCtrl.storeItem(newItem);

      // CLEAR FIELDS
      UiCtrl.clearInput();
    }
    
    e.preventDefault();
  }

  // CLICK EDIT ITEM
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      // GET LIST ITEM ID
      const listId = e.target.parentNode.parentNode.id;
      
      // BREAK INTO AN ARRAY
      const listIdArr = listId.split('-');
      
      // GET THE ACTUAL ID
      const id = parseInt(listIdArr[1]);

      // GET ITEM
      const itemToEdit = ItemCtrl.getItemById(id);

      // SET CURRENT ITEM
      ItemCtrl.setCurrentItem(itemToEdit);

      // ADD ITEM TO FORM
      UiCtrl.addItemToForm();
    }
    e.preventDefault();
  }

  // UPDATE ITEM SUBMIT
  const itemUpdateSubmit = function(e) {
    // GET ITEM INPUT
    const input = UiCtrl.getItemInput();
    // UPDATE ITEM
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // UPDATE UI
    UiCtrl.updateListItem(updatedItem);

    // GET TOTAL CALORIES
    const totalCalories = ItemCtrl.getTotalCalories();

    // ADD TOTAL CALORIES TO UI
    UiCtrl.showTotalCalories(totalCalories);

    // UPDATE LOCAL STORAGE
    StorageCtrl.updateItemStorage(updatedItem);

    UiCtrl.clearEditState();

    e.preventDefault();
  }

  // ITEM DELETE SUBMIT
  const itemDeleteSubmit = function(e) {
    // GET CURRENT ITEM
    const currentItem = ItemCtrl.getCurrentItem();

    // DELETE FROM DATA STRUCTURE
    ItemCtrl.deleteItem(currentItem.id);

    // DELETE FROM UI
    UiCtrl.deleteListItem(currentItem.id);

    // GET TOTAL CALORIES
    const totalCalories = ItemCtrl.getTotalCalories();

    // ADD TOTAL CALORIES TO UI
    UiCtrl.showTotalCalories(totalCalories);

    // DELETE FROM LOCAL STORAGE
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UiCtrl.clearEditState();

    e.preventDefault();
  }

  // CLEAR ITEMS EVENT
  const clearAllItemsClick = function() {
    // DELETE ALL ITEMS FROM DATA STRUCTURE
    ItemCtrl.clearAllItems();

    // GET TOTAL CALORIES
    const totalCalories = ItemCtrl.getTotalCalories();

    // ADD TOTAL CALORIES TO UI
    UiCtrl.showTotalCalories(totalCalories);

    // REMOVE FROM UI
    UiCtrl.removeItems();

    // CLEAR FROM LOCAL STORAGE
    StorageCtrl.clearItemsFromStorage();

    // HIDE UL
    UiCtrl.hideList();
  }

  // PUBLIC METHODS
  return {
    init: function(){
      // CLEAR EDIT STATE/ SET INITIAL STATE
      UiCtrl.clearEditState();

      // FETCH ITEMS FROM DATA STRUCTURE
      const items = ItemCtrl.getItems();

      // CHECK IF ANY ITEMS
      if(items.length === 0){
        UiCtrl.hideList();
      } else {
        // POPULATE LIST WITH ITEMS
        UiCtrl.populateItemList(items);
      }

      // GET TOTAL CALORIES
      const totalCalories = ItemCtrl.getTotalCalories();

      // ADD TOTAL CALORIES TO UI
      UiCtrl.showTotalCalories(totalCalories);

      // LOAD EVENT LISTENERS
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UiCtrl);

// INITIALIZE APP
App.init();