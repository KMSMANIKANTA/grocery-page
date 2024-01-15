const submitbtn=document.querySelector(".submit")
const clearallbtn=document.querySelector(".clearall")
const grocery=document.querySelector(".grocery")
const list=document.querySelector(".list")
const alert=document.querySelector(".alert")


//variables
var editID;
var editelement;
var editflag=false



//event listeners
submitbtn.addEventListener("click",additem)
clearallbtn.addEventListener('click',clearallitems)
setInterval(clearbtnchecker,1)
window.addEventListener("DOMContentLoaded",setItems)


//functions
function clearbtnchecker(){
    if(list.children.length>0){
        clearallbtn.style.display="block"
    }
    else{
        clearallbtn.style.display="none"
    }
}
function additem(e){
    e.preventDefault()
    const value=grocery.value
    const id=new Date().getTime().toString()
    if(value && !editflag){
        
        createListItem(id,value)
         setBackToDefault()
        addToLocalStorage(id,value)
        clearallbtn.style.display="block"
        displayalert("Item added","success")

    }
    else if(value && editflag){
        editelement.innerHTML=grocery.value
        setBackToDefault()
        displayalert("Item edited","success")
        editFromLocalStorage(editID,value)
    }
    else{
        displayalert("Enter proper grocery","danger")
    }
}

//alert function
function displayalert(text,action){
    alert.innerText=text;
    alert.classList.add(`${action}`)
    alert.style.visibility="visible"

    setTimeout(function(){
        alert.innerText=""
        alert.classList.remove('${action}')
    },500)
}

//set to default
function setBackToDefault(){
    editflag=false
    editid=""
    submitbtn.value="add"
    grocery.value=""

}

//clear all function
function clearallitems(){
    let items=document.querySelectorAll(".item")
    if(list.childElementCount>0){

        items.forEach(function(item){
            list.removeChild(item)
        })
    }
    setBackToDefault()
    clearallbtn.style.display="none"
    displayalert("All items deleted","success")
    localStorage.removeItem("list")
}

//delete function
function deleteItem(e){
    const element=e.currentTarget.parentElement.parentElement
    const id=element.dataset.id
    list.removeChild(element)
    setBackToDefault()
    displayalert("Item Removed","danger")
    deleteFromLocalStorage(id)
}

//edit function
function edititem(e){
    const element=e.currentTarget.parentElement.parentElement
    editelement=e.currentTarget.parentElement.previousElementSibling
    submitbtn.value="edit"
    grocery.value=editelement.innerHTML
    editflag=true
    editID=element.dataset.id
    
}
function addToLocalStorage(id,value){
    let items=getLocalStorage()
    const grocery={id,value}
    items.push(grocery)
    localStorage.setItem("list",JSON.stringify(items))

}

function deleteFromLocalStorage(id){
    var items=getLocalStorage()
    items=items.filter(function(item){
        if(item.id!==id){
            return item
        }
    })
    localStorage.setItem("list",JSON.stringify(items))
}

function editFromLocalStorage(id,value){
    var items=getLocalStorage()
    items=items.map(function(item){
        if(item.id===id){
            item.value=value
        }
        return item
    })
    localStorage.setItem("list",JSON.stringify(items))
}
function getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[]
}

function createListItem(id,value){
    const element=document.createElement("div")
    element.classList.add("item")
    const attr=document.createAttribute("data-id")
    attr.value=id
    element.setAttributeNode(attr)
    element.innerHTML=`
    <p class="itemtext">${value}</p>
    <div class="btn-container">
    <button class="edit"><i class="fa-regular fa-pen-to-square"></i></button>
    <button class="del"><i class="fa-solid fa-trash"></i></button>`
    list.append(element)
   
    const deleteBtn=element.querySelector(".del")
    deleteBtn.addEventListener("click",deleteItem)
    const editBtn=element.querySelector(".edit")
    editBtn.addEventListener("click",edititem)

}

function setItems(){
    var items=getLocalStorage()
    items.forEach(function(item){
        createListItem(item.id,item.value)
    })
}