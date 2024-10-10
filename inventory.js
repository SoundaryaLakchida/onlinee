document.addEventListener('DOMContentLoaded', () => {
    // Buttons for section toggling
    const addItemBtn = document.getElementById('addItemBtn');
    const readInventoryBtn = document.getElementById('readInventoryBtn');
    const updateItemBtn = document.getElementById('updateItemBtn');
    const deleteItemBtn = document.getElementById('deleteItemBtn');
    const editCreditLimitBtn = document.getElementById('editCreditLimitBtn');

    // Sections
    const addItemSection = document.getElementById('addItemSection');
    const inventorySection = document.getElementById('inventorySection');
    const updateItemSection = document.getElementById('updateItemSection');
    const deleteItemSection = document.getElementById('deleteItemSection');
    const editCreditLimitSection = document.getElementById('creditLimitSection');

    // Toggle sections visibility
    addItemBtn.onclick = () => toggleSection(addItemSection);
    readInventoryBtn.onclick = () => {
        toggleSection(inventorySection);
        fetchInventory();
    };
    updateItemBtn.onclick = () => toggleSection(updateItemSection);
    deleteItemBtn.onclick = () => toggleSection(deleteItemSection);
    editCreditLimitBtn.onclick = () => toggleSection(editCreditLimitSection);

    function toggleSection(section) {
        [addItemSection, inventorySection, updateItemSection, deleteItemSection, editCreditLimitSection].forEach(sec => sec.classList.add('hidden'));
        section.classList.remove('hidden');
    }

    // Function to add an item to inventory
    const addItemForm = document.getElementById('inventoryForm');
    addItemForm.onsubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById('id').value;
        const category = document.getElementById('cat_id').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const price = parseFloat(document.getElementById('price').value);
        const imageFile = document.getElementById('image').files[0];

        if (!imageFile) {
            alert('Please select an image');
            return;
        }

        try {
            const imageBase64 = await convertImageToBase64(imageFile);

            const data = {
                fields: {
                    id: { stringValue: id },
                    category: { stringValue: category },
                    title: { stringValue: title },
                    description: { stringValue: description },
                    quantity: { integerValue: quantity },
                    price: { doubleValue: price },
                    imageBase64: { stringValue: imageBase64 }
                }
            };

            const response = await fetch(`https://firestore.googleapis.com/v1/projects/onlineshopping-d47b6/databases/(default)/documents/inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Item added successfully!');
                addItemForm.reset();
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.error.message}`);
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert(`Failed to add item: ${error.message}`);
        }
    };

    // Function to fetch and display inventory
    async function fetchInventory() {
        try {
            const response = await fetch(`https://firestore.googleapis.com/v1/projects/onlineshopping-d47b6/databases/(default)/documents/inventory`);
            const data = await response.json();

            if (!data.documents || data.documents.length === 0) {
                document.getElementById('inventoryList').innerHTML = '<tr><td colspan="7">No items found.</td></tr>';
                return;
            }

            const inventoryList = data.documents.map(item => {
                const fields = item.fields;

                return `
                    <tr>
                        <td>${fields.id?.stringValue || ''}</td>
                        <td>${fields.category?.stringValue || ''}</td>
                        <td>${fields.title?.stringValue || ''}</td>
                        <td>${fields.description?.stringValue || ''}</td>
                        <td>${fields.quantity?.integerValue || ''}</td>
                        <td>${fields.price?.doubleValue || ''}</td>
                        <td><img src="data:image/png;base64,${fields.imageBase64?.stringValue || ''}" alt="${fields.title?.stringValue || ''}" width="50"></td>
                    </tr>
                `;
            }).join('');

            document.getElementById('inventoryList').innerHTML = inventoryList;

        } catch (error) {
            console.error('Error fetching inventory:', error);
            alert(`Failed to fetch inventory: ${error.message}`);
        }
    }

    // Function to update an item in the inventory based on id
    const updateRecordBtn = document.getElementById('updateRecordBtn');
    updateRecordBtn.onclick = async () => {
        const id = document.getElementById('updateItemId').value.trim(); // Trim spaces
        if (!id) return alert("Please enter an Item ID");

        const category = document.getElementById('updateCatId').value;
        const title = document.getElementById('updateTitle').value;
        const description = document.getElementById('updateDescription').value;
        const quantity = parseInt(document.getElementById('updateQuantity').value);
        const price = parseFloat(document.getElementById('updatePrice').value);
        const imageFile = document.getElementById('updateImage').files[0];

        let data = {
            fields: {
                id: { stringValue: id },
                category: { stringValue: category },
                title: { stringValue: title },
                description: { stringValue: description },
                quantity: { integerValue: quantity },
                price: { doubleValue: price }
            }
        };

        if (imageFile) {
            const imageBase64 = await convertImageToBase64(imageFile);
            data.fields.imageBase64 = { stringValue: imageBase64 };
        }

        try {
            const response = await fetch(`https://firestore.googleapis.com/v1/projects/onlineshopping-d47b6/databases/(default)/documents/inventory/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Item updated successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.error.message}`);
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert(`Failed to update item: ${error.message}`);
        }
    };

    // Function to delete an item from inventory based on id
    const deleteItemBtnAction = document.getElementById('deleteItemBtnAction');
    deleteItemBtnAction.onclick = async () => {
        const deleteId = document.getElementById('deleteItemId').value.trim(); // Trim spaces
        if (!deleteId) return alert("Please enter an Item ID");

        try {
            const response = await fetch(`https://firestore.googleapis.com/v1/projects/onlineshopping-d47b6/databases/(default)/documents/inventory/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Item deleted successfully!');
                document.getElementById('deleteItemId').value = ''; // Clear input field
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.error.message}`);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert(`Failed to delete item: ${error.message}`);
        }
    };

    // Function to convert image to base64
    function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }
});
