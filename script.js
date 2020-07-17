/* 
 1. take the input of the user --done
 2. add it to a list --done
 3. be able to delete any one of the todos --done
 4. be able to delete all of the todos --done
 5. be able to edit the todos --done
*/

// ITEM CONTROLLER ----------------------
let itemController = (function () {
    // class for items
    class Item {
        constructor(id, desc, done = 'undone') {
            this.id = id;
            this.desc = desc;
            this.done = done;
        }
    }
    // data structor
    let data = [];
    // methods
    return {
        addItem: (description) => {
            // 1. get id and desc 
            let ID, desc;
            desc = description;
            ID = 0;
            // 2. creat a new id
            if (data.length > 0) { ID = data[data.length - 1].id + 1; } 
            else { ID = 0; }
            // 3. creat an object of an item
            let newItem = new Item(ID, desc);
            // 4. add the item to the data stracture
            data.push(newItem);
            // 5. return the item object
            return newItem;
        },

        deleteItem: id => {
            let IDs, index;
            // return and array of the ids only
            IDs = data.map(cur => { return cur.id });
            // find the index of th id in the ID array mirroring its index in the data stracture
            index = IDs.indexOf(id);
            data.splice(index, 1);
        },

        deleteAll: () => {
            data.splice(0, data.length);
        },

        toggleDone: ID => {
            data.forEach(el => {
                if (el.id === ID) {
                    if (el.done === 'undone') { el.done = 'done'; }
                    else if (el.done === 'done') { el.done = 'undone'; } 
                    else { console.log('there is an error in the done toggle controll'); }
                }
            });
        },

        updateDescription(ID, description) {
            // change the description of a sertan element
            data.forEach(cur => {
                if (cur.id === ID) {
                    cur.desc = description;
                }
            });
        },

        testing: () => data,
    }

})();


// UI CONTROLLER ----------------------
let UIcontroller = (function () {

    return {
        addItemUI: obj => {
            // have a template html to display the item
            let template = `
            <div class="item" id="item-${obj.id}" data-edit="not-edited">
            <p class="item__description" id="desc-${obj.id}">${obj.desc}</p>
            <div class="btn__container">
                <button class="item__delete"><span class="item__span">-</span></button>
                <button class="item__done">done</button>
                <button class="item__edit" id="item__edit-${obj.id}">edit</button>
            </div>
            </div>`;
            // add the new item to the UI
            document.querySelector('.todo__todos').insertAdjacentHTML('afterbegin', template);
        },

        deleteItem: ID => {
            document.getElementById(ID).parentNode.removeChild(document.getElementById(ID));
        },

        deleteAll: () => {
            document.querySelector('.todo__todos').innerHTML = '';
        },

        toggleDone: ID => {
            document.getElementById(`item-${ID}`).classList.toggle('done');
        },

        edit(ID) {
            // depending on data atribute put an input field or remove it
            // if you're adding an input make the text content its value 
            // if you're removing the input make its value the text content
            let inputTemplate = ` <input type="text" id="desc-input-${ID}" class="desc-input"> `;
            const edit = document.getElementById(`item-${ID}`).dataset.edit;
            console.log(edit);
            if (edit === 'not-edited' || edit === 'edited') {
                console.log(`starting to edit`);
                let descText = document.getElementById(`desc-${ID}`).textContent;
                document.getElementById(`desc-${ID}`).textContent = '';
                console.log(descText);
                document.getElementById(`desc-${ID}`).insertAdjacentHTML('afterbegin', inputTemplate);
                document.getElementById(`desc-input-${ID}`).value = descText;
                document.getElementById(`item__edit-${ID}`).textContent = 'edit done';
                document.getElementById(`item-${ID}`).setAttribute('data-edit', 'editing');
            }
            else if (edit === 'editing') {
                console.log(`finishing the edit`);
                const descInput = document.getElementById(`desc-input-${ID}`).value;
                document.getElementById(`desc-${ID}`).textContent = descInput;
                document.getElementById(`item__edit-${ID}`).textContent = 'edit';
                document.getElementById(`item-${ID}`).setAttribute('data-edit', 'edited');
                // update the description of the current item in the data stracture
                return descInput;
            } 
            else {
                console.log(`looks like theres an error ${ID}`);
            }
        }
    }
})();



// CONTROLLER ----------------------
let controller = (function (itemCtrl, UIctrl) {
    // 1. setup event listeners 
    let setupEventListeners = function () {
        // when add button is clicked 
        document.querySelector('.todo__span').addEventListener('click', addItem);
        // when enter key is pressed
        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });
        // when item delete is clicked
        //document.querySelector('.todo__todos').addEventListener('click', deleteItem);
        document.querySelector('.todo__todos').addEventListener('click', deleteItem);
        // when delete all is clicked
        document.querySelector('.btn__delete-all').addEventListener('click', deleteAll);
        // ITEM DONE or NOt DONE
        document.querySelector('.todo__todos').addEventListener('click', itemDone);
        // EDIT ITEM
        document.querySelector('.todo__todos').addEventListener('click', itemEdit);
    }

    // 2. get the input data if something is typed then reset the field
    const addItem = () => {
        if (document.querySelector('.todo__input').value !== '') {
            // 1. get the description from input
            let input = document.querySelector('.todo__input').value;
            // 2. make an item using the input and add the item to the data stracture
            let newItem = itemCtrl.addItem(input);
            // 3. add the item to the UI
            UIctrl.addItemUI(newItem);
            // 4. reset the field
            document.querySelector('.todo__input').value = '';
            // 5. focus on the input field
            document.querySelector('.todo__input').focus();
        }
    }

    // 3. delete the item
    const deleteItem = event => {
        const itemClose = event.target.closest('.item__delete');
        if (itemClose) {
            if (itemClose.matches('.item__delete')) {
                let itemID, ID, item;
                item = event.target.parentNode.parentNode.parentNode.id;
                ID = parseID(item);
                // send the id to delete the item from the data stracture
                // delete the item from the data stracture
                itemCtrl.deleteItem(ID);
                // delete the item from the UI
                UIctrl.deleteItem(item);
            }
        }
    }

    // 4. delete all
    const deleteAll = () => {
        // 1. delete all from data stracture
        itemCtrl.deleteAll();
        // 2. delete all from UI
        UIctrl.deleteAll();
    }

    // 5. ITEM DONE
    const itemDone = event => {
        const item = event.target.closest('.item__done');
        if (item) {
            //const match = item.matches('.item__done');
            if (item.matches('.item__done')) {
                let itemID, ID;
                // 1. change the status of an item if its done or not done
                const item = event.target.parentNode.parentNode.id;
                ID = parseID(item);
                itemCtrl.toggleDone(ID);
                // 2. toggle done class depending if an item is done or not
                UIctrl.toggleDone(ID);
                //if (item.includes('item-')) {
                // itemID = item.split('-');
                // ID = parseInt(itemID[1]) ;  }
            }
        }
    }

    // 6. EDIT ITEM 
    itemEdit = event => {
        const item = event.target.closest('.item__edit');
        if (item) {
            if (item.matches('.item__edit')) {
                // change the text content of an item to an input that has that text 
                // change the edit button to done edit, 
                // when done edit is clicked (edit is clicked again) take the value of input
                // and make it the text content of that item
                const itemID = event.target.parentNode.parentNode.id;
                const ID = parseID(itemID);
                const inputDesc = UIctrl.edit(ID);
                itemCtrl.updateDescription(ID, inputDesc);      
            }
        }
    }

    // parse the id to return the id number only
    parseID = ID => {
        if (ID.includes('item-')) {
            let entireID = ID.split('-');
            let item = entireID[0];
            let id = parseInt(entireID[1]);
            return id;
        }
    }


    return {
        init: () => {
            setupEventListeners();
        }
    }

})(itemController, UIcontroller);

controller.init();





































