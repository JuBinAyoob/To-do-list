let arrToDoDatas;
let intCount;	
displayAllElements();


//To display all to-do-list data saved in local storage
function displayAllElements(){

    arrToDoDatas=JSON.parse(localStorage.getItem('to-do-list-data'));
	intCount=0;

	if(arrToDoDatas==null || arrToDoDatas.length==0)
		arrToDoDatas=[];
	else{
		//For geting the last Id of data stored for to-do-list and then incrementing its value for indexing next to-do-data to be entered.
		let lastDataNo=arrToDoDatas.length-1;
		intCount=arrToDoDatas[lastDataNo].id;
		intCount++;
	}

	document.getElementById("to-do-list").innerHTML="";
	
	let toDoList=document.getElementById("to-do-list");
	for(objToDoData of arrToDoDatas){
		let newDiv=document.createElement('div');
		newDiv.setAttribute("class",'row draggable');
		newDiv.setAttribute("id",'row-'+objToDoData.id);
		newDiv.setAttribute("draggable",'true');

		newDiv.innerHTML='<div id="div-chk-'+objToDoData.id+'" ><input onClick="selectUniqueToDoData(this.id)" class="chk-unique" id="chk-'+objToDoData.id+'" type="checkbox"></div>'+
						'<div class="to-do-font" id="p-'+objToDoData.id+'"><p class="para-to-do-data">'+objToDoData.toDoData+'</p></div>'+
						'<div onClick="deleteToDoData(this.parentNode.id)" class="delete" id="del-'+objToDoData.id+'"><i class="fas fa-times"></i></div>';
		toDoList.appendChild(newDiv);

		if(objToDoData.chkData){
			let chkCurrent = document.getElementById('chk-'+objToDoData.id);
			chkCurrent.setAttribute("checked",true);

			let fontCurrent = document.getElementById('p-'+objToDoData.id);
			fontCurrent.setAttribute("class",'text-strike');
		}

		dragAndDrop('row-'+objToDoData.id);
	}
}

//For detetecting enter key after entering value to text-box
function inputEnter(event){
	let strToDoData=document.getElementById("text-box").value;
	if(event.key=="Enter" && strToDoData.length!=0){
		appendToDoData();
	}
}

//Function to save and display new to-do-data from the text-box
function appendToDoData(){
	let strToDoData=document.getElementById("text-box").value;
	let toDoList=document.getElementById("to-do-list");
	if(strToDoData.length!=0){
		let newDiv=document.createElement('div');
		newDiv.setAttribute("class",'row draggable');
		newDiv.setAttribute("id",'row-'+intCount);
		newDiv.setAttribute("draggable",'true');

		newDiv.innerHTML=`<div id="div-chk-${intCount}" >
							<input onClick="selectUniqueToDoData(this.id)" class="chk-unique" id="chk-${intCount}" type="checkbox">
						  </div>
						  <div class="to-do-font" id="p-${intCount}"><p class="para-to-do-data">${strToDoData}</p></div>
						  <div onClick="deleteToDoData(this.parentNode.id)" class="delete" id="del-${intCount}"><i class="fas fa-times"></i>
						  </div>`;
		
		toDoList.appendChild(newDiv);                          // ||document.getElementById("to-do-list").innerHTML+=cur;
		let listData={id:intCount,chkData:false,toDoData:strToDoData};
		arrToDoDatas.push(listData);
		dragAndDrop('row-'+intCount);
		intCount++;

		

		localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));
		document.getElementById("text-box").value = "";
	}
}

//select All operation on clicking of select all check box
function setAllCheckbox(){
	let chkBoxAll = document.getElementById("all");
	
	chkBox = document.getElementsByClassName('chk-unique');
	data = document.getElementsByClassName('para-to-do-data');

	for(i=0;i<chkBox.length;i++){
		chkBox[i].checked=chkBoxAll.checked;

		if(chkBoxAll.checked){
			data[i].classList.add("text-strike");
		}else{
			data[i].classList.remove("text-strike");
		}
	}

	for(obj of arrToDoDatas){
		obj.chkData=chkBoxAll.checked;
	}
	localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));
	displayAllElements();
}

//function to delete to-do-list row data on clicking of its delete icon
function deleteToDoData(strId){
	
	let idNum=strId.substr(4);
	let chkData;
	for(index in arrToDoDatas){
		if(arrToDoDatas[index].id==idNum){
			chkData=arrToDoDatas[index].chkData;
			break;
		}
	}

	if(chkData){
		deleteToDoDataSecondStep(idNum);
		
	}else{
		if(confirm("Your task is not completed! Do you want delete the task?")){
			deleteToDoDataSecondStep(idNum);
		}
	}
	localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));

}

function deleteToDoDataSecondStep(idNum){
	let parentRow = document.getElementById("to-do-list");
	let child = document.getElementById("row-"+idNum);
	parentRow.removeChild(child);

	for(index in arrToDoDatas){
		if(arrToDoDatas[index].id==idNum){
			arrToDoDatas.splice(index,1);
			break;
		}
	}
}
function selectUniqueToDoData(id){
	let chkSpecific = document.getElementById(id);
	
	id=id.substr(4);
	font = document.getElementById('p-'+id);
	
	if(chkSpecific.checked){
		font.classList.add("text-strike");
	}
	else{
		font.classList.remove("text-strike");
	}

	for(index in arrToDoDatas){
		if(arrToDoDatas[index].id==id){
			arrToDoDatas[index].chkData=chkSpecific.checked;
			break;
		}
	}
	localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));
}

//Drag and drop operation on to-do-list list
function dragAndDrop(strId){
	
	let row=document.getElementById(strId);
	
	row.addEventListener('dragstart',dragStart,false);
	row.addEventListener('dragenter',dragEnter,false);
	row.addEventListener('dragover',dragOver,false);
	row.addEventListener('dragleave',dragLeave,false);
	row.addEventListener('drop',dropped,false);
	row.addEventListener('dragend',dragEnd,false);
}

function dragStart(e){
	e.dataTransfer.effectAllowed='move';
	e.dataTransfer.setData('Text',e.target.id);
}
function dragEnter(e){
	e.preventDefault();
	this.classList.add('over');
}
function dragOver(e){
	e.preventDefault();
	e.dataTransfer.dropEffect='move';
	return false;
}
function dragLeave(e){
	e.stopPropagation();
	this.classList.remove('over');
}
function dropped(e){
	
	let data = e.dataTransfer.getData("Text");
	let chkCurrent,chkPrevious,pCurrent,pPrevious;

	let idPrevious = data.substr(4);
	let idCurrent = this.id.substr(4);
	
	let intGot=0;
	if(data!=this.id){
		for(index in arrToDoDatas){
			if(arrToDoDatas[index].id==idPrevious){
				chkPrevious=arrToDoDatas[index].chkData;
				pPrevious=arrToDoDatas[index].toDoData;
				intGot++;
			}else if(arrToDoDatas[index].id==idCurrent){
				chkCurrent=arrToDoDatas[index].chkData;
				pCurrent=arrToDoDatas[index].toDoData;
				intGot++;
			}

			if(intGot==2)
				break;
		}

		intGot=0;
		for(index in arrToDoDatas){
			if(arrToDoDatas[index].id==idPrevious){
				arrToDoDatas[index].chkData=chkCurrent;
				arrToDoDatas[index].toDoData=pCurrent;
				intGot++;
			}else if(arrToDoDatas[index].id==idCurrent){
				arrToDoDatas[index].chkData=chkPrevious;
				arrToDoDatas[index].toDoData=pPrevious;
				intGot++;
			}

			if(intGot==2)
				break;
		}

		localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));
		displayAllElements();
	}
	return false;
}

let listItems;
function dragEnd(e){

	listItems=document.querySelectorAll('.draggable');
	[].forEach.call(listItems,function(item){
		item.classList.remove('over');
	});
}





