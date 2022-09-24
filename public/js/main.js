const deleteBtn = document.querySelectorAll('.fa-trash') //delete button in ejs file
const item = document.querySelectorAll('.item span') //item class in ejs
const itemCompleted = document.querySelectorAll('.item span.completed') //intemCompleted class in ejs

Array.from(deleteBtn).forEach((element)=>{ //iterates over array of delete buttons and if button is clicked, will run deleteItem functin
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ //iterates over array of incomplete items and if clicked, will run markComplete function
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ //iterates over array of completed items and if clicked, will run markUncomplete function
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ //runs if delete button is clicked
    //parent node is a list, child node is list item.  grabbing text next to trashcan icon
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', { //trying to delete item
            //looking for the speicific item to delete
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //this is itemText from above, grabbing from server and turning into json
            body: JSON.stringify({ //turns string into a json
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //turning json response into a variable
        console.log(data) //console logging json data
        location.reload() //reloads page

    }catch(err){ //if error will catch it and console it 
        console.log(err)
    }
}

async function markComplete(){ //function to mark item complete
    //parent node is a list, child node is list item.  grabbing text 
    const itemText = this.parentNode.childNodes[1].innerText
    try{ //will try to mark items complete using put method
        const response = await fetch('markComplete', { //markComplete is the route on server.js
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //turns string into a json
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //holds json response in a variable 
        console.log(data) //logs json
        location.reload() //reloads page

    }catch(err){ //if error, will catch
        console.log(err) //logs error
    }
}

async function markUnComplete(){ //function to unmark completed items
    const itemText = this.parentNode.childNodes[1].innerText //parent node is a list, child node is list item.  grabbing text
    try{ //will try to uncheck completed items using a put method
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //turns string into json
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //saves json in variable
        console.log(data) //logs json
        location.reload() //reloads page

    }catch(err){ //catches and logs error
        console.log(err)
    }
}