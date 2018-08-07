let arrToDoDatas=[];
let intCount=0;	

//Functions and events that should initializes on refresh of page
$(document).ready(function(){
	displayAllElements();

	//Select All event for select-all check box
	$(".select-all").on('click',function(){
		setAllCheckbox();
	});
    //Add new to-do-list data after clicking plus logo
	$(".add-to-do-data").on('click',function(){
		appendNewToDoData();
	});
	$(".text-box").keypress(function(event){
		inputEnter(event);
	});
})

//To display all to-do-list data saved
function displayAllElements(){
	toSetToDoListArray();
	$("#to-do-list").empty();
	for(objToDoData of arrToDoDatas){
		appendData(objToDoData.id,objToDoData.toDoData);
		setDatasForCheckBox(objToDoData);
	}
}

//function to set to-do-list Array and to find the last Id for specifying new to-do-list item.
function toSetToDoListArray(){
	intCount=0;
	arrToDoDatas=JSON.parse(localStorage.getItem('to-do-list-data'));
	if(arrToDoDatas==null || arrToDoDatas.length==0)
		arrToDoDatas=[];
	else{
		//For geting the last Id of data stored for to-do-list and then incrementing its value for indexing next to-do-data to be entered.
		let lastDataNo=arrToDoDatas.length-1;
		intCount=arrToDoDatas[lastDataNo].id;
		intCount++;
	}
}

//function to specify checkbox for display function
function setDatasForCheckBox(objToDoData){
	if(objToDoData.chkData){
		$('#chk-'+objToDoData.id).attr("checked",true);
		$('#p-'+objToDoData.id).addClass("text-strike");
	}
}

//For detetecting enter key after entering value to text-box
function inputEnter(event){
	let strToDoData=$("#text-box").val();
	if(event.key=="Enter" && strToDoData.length!=0){
		appendNewToDoData();
	}
}

//Function to save and display new to-do-data from the text-box
function appendNewToDoData(){
	let strToDoData=$("#text-box").val();

	if(strToDoData.length!=0){
		appendData(intCount,strToDoData);
		let listData={id:intCount,chkData:false,toDoData:strToDoData};
		arrToDoDatas.push(listData);
		localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));
		$("#text-box").val("");
		intCount++;
	}
}

//append to-do-list data function for functions displayAllElements and appendNewToDoData
function appendData(intId,strToDoData){
	let innerHTML=`<div id="row-${intId}" class="row draggable" draggable="true">
					<div id="div-chk-${intId}" >
						<input class="chk-unique" id="chk-${intId}" type="checkbox">
				  	</div>
					<div class="to-do-font" id="p-${intId}"><p class="para-to-do-data">${strToDoData}</p></div>
					<div class="delete" id="del-${intId}"><i class="fas fa-times"></i>
				  	</div>
				  </div>`;
	$("#to-do-list").append(innerHTML); 
	eventInitializationOnAddingNewData(intId);
	dragAndDrop('row-'+intId);
}

function eventInitializationOnAddingNewData(intId){
	$("#chk-"+intId).on('click',function(){
		selectUniqueToDoData(this.id);
	});
	$('#del-'+intId).on('click',function(){
		let id=$(this).parent().attr('id');
		confirmDeleteToDoData(id);
	});    
}

//select All operation on clicking of select all check box
function setAllCheckbox(){
	let chkBoxAll = $("#all:checked").val();
	let chkBoxAllData;
	$('.chk-unique').attr('checked',chkBoxAll);

	if(chkBoxAll){
		chkBoxAllData=true;
	}else{
		chkBoxAllData=false;
	}

	setFontStyle(chkBoxAll,'.para-to-do-data');
	for(obj of arrToDoDatas){
		obj.chkData=chkBoxAllData;
	}
	localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));
	displayAllElements();
}

//function to delete to-do-list row data on clicking of its delete icon
function confirmDeleteToDoData(strId){
	let idNum=strId.substr(4);
	let chkData;
	for(index in arrToDoDatas){
		if(arrToDoDatas[index].id==idNum){
			chkData=arrToDoDatas[index].chkData;
			break;
		}
	}
	if(chkData){
		deleteToDoData(idNum);	
	}else{
		if(confirm("Your task is not completed! Do you want delete the task?")){
			deleteToDoData(idNum);
		}
	}
}

function deleteToDoData(idNum){
	let child = $("#row-"+idNum);
	$("#to-do-list").find(child).remove();

	for(index in arrToDoDatas){
		if(arrToDoDatas[index].id==idNum){
			arrToDoDatas.splice(index,1);
			break;
		}
	}
	localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));
}

function selectUniqueToDoData(id){
	let chkSpecific = $('#'+id+':checked').val();
	id=id.substr(4);

	for(index in arrToDoDatas){
		if(arrToDoDatas[index].id==id){
			arrToDoDatas[index].chkData=chkSpecific;
			break;
		}
	}
	setFontStyle(chkSpecific,"#p-"+id);
	localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));
}

function setFontStyle(chkSpecific,element){
	if(chkSpecific){
		chkSpecific=true;
		$(element).addClass("text-strike");
	}
	else{
		chkSpecific=false;
		$(element).removeClass("text-strike");
	}
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
	$(this).addClass('over');
}
function dragOver(e){
	e.preventDefault();
	e.dataTransfer.dropEffect='move';
	return false;
}
function dragLeave(e){
	e.stopPropagation();
	$(this).removeClass('over');
}
function dropped(e){
	
	let data = e.dataTransfer.getData("Text");
	let chkCurrent,chkPrevious,pCurrent,pPrevious,preIndex,curIndex;

	let idPrevious = data.substr(4);
	let idCurrent = this.id.substr(4);
	
	let intGot=0;
	if(data!=this.id){
		for(index in arrToDoDatas){
			if(arrToDoDatas[index].id==idPrevious){
				chkPrevious=arrToDoDatas[index].chkData;
				pPrevious=arrToDoDatas[index].toDoData;
				preIndex=index;
				intGot++;
			}else if(arrToDoDatas[index].id==idCurrent){
				chkCurrent=arrToDoDatas[index].chkData;
				pCurrent=arrToDoDatas[index].toDoData;
				curIndex=index;
				intGot++
			}

			if(intGot==2)
				break;
		}

		arrToDoDatas[preIndex].chkData=chkCurrent;
		arrToDoDatas[preIndex].toDoData=pCurrent;
		arrToDoDatas[curIndex].chkData=chkPrevious;
		arrToDoDatas[curIndex].toDoData=pPrevious;

		localStorage.setItem('to-do-list-data', JSON.stringify(arrToDoDatas));
		displayAllElements();
	}
	return false;
}

let listItems;
function dragEnd(e){
	$('.draggable').removeClass('over');
}





