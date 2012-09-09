
AppStore.App.holdReadyMessage();

$(function () {

	var AppStoreContext = new AppStore.Context();
	var local;
	var LOCAL_STORAGE_NAMEPREFIX = "AppStoreDutchIT___";
	function init() {
	
	if(!localStorage.getItem(LOCAL_STORAGE_NAMEPREFIX +'Data'))
			localStorage.setItem(LOCAL_STORAGE_NAMEPREFIX + 'Data', "{\"data\":[],\"tranRelation\":[]}");	
	data = $.parseJSON(localStorage.getItem(LOCAL_STORAGE_NAMEPREFIX +'Data'));
	}
	function getUser(){
		//AppStore.App.user
	}
	function setDutch(){
		var Description = $('#dutchName').val();
		var Amount = $('#dutchAmount').val();
		var sharesCnt = $('.friendsBlk input[type=checkbox]').filter(':checked').length;
		var shared = [];
		var transRelation = [];
		var dt = new Date(); 
		var id =Date.UTC(dt.getFullYear(),dt.getMonth(),dt.getDate(),dt.getHours(),dt.getMinutes(),dt.getSeconds()) ;
		var shareNames = [];
		$.each($('.friendsBlk input[type=checkbox]').filter(':checked'),function(){
			var uid = $(this).val();
			shared.push({"uID":uid,"userName":$(this).attr('rel')});
			
			if(uid==0){
				data.tranRelation.push({"tID":id,"uID":sessionStorage.getItem('userID'),"suID":sessionStorage.getItem('userID'),"time":id,"isSeen":"0","isPaid":"0","eachAmount":parseFloat(Amount/sharesCnt).toFixed(2)});
				//shareNames.push('You');
			}else{
				data.tranRelation.push({"tID":id,"uID":sessionStorage.getItem('userID'),"suID":uid,"time":id,"isSeen":"0","isPaid":"0","eachAmount":parseFloat(Amount/sharesCnt).toFixed(2)});
				shareNames.push($(this).attr('rel'));
			}
			
			
		});
		var trans ={"tID":id,"description":Description,"amount":Amount,"count":sharesCnt,"shared":shared}
		var obj={};
		var flag = -1;
		$.each(data.data,function(ind, ele){
			if(sessionStorage.getItem('userID') == ele.userID){
				flag = ind;
			}
		});
		sessionStorage.setItem('postStatus',"Your Request of amount $"+parseFloat(Amount/sharesCnt).toFixed(2)+" / each is submitted to all your friends.<br>"+shareNames.join(', ')+".");
		if(flag==-1){
			nInd = data.data.push({"userID":sessionStorage.getItem('userID'),"userName":sessionStorage.getItem('userName'),"transaction":[]});
			obj = data.data[nInd-1]
		}else{
			obj = data.data[flag]
		}
		obj.transaction.push(trans)
		//data.data.push(obj);
		localStorage.setItem(LOCAL_STORAGE_NAMEPREFIX + 'Data', JSON.stringify(data));
	}
	
	function getTransactions(){
		console.log(localStorage)
	}
	
	function setTransactions(){
		localStorage.setItem(LOCAL_STORAGE_NAMEPREFIX + 'Data',JSON.stringify(localStorage));
	
	}
	console.log(AppStore)
	 //$("form, a").fixAppURL();
		$('#btnCreate').click(function(){
			if(validateCreate()){
				setDutch();
				var newURL = AppStore.App.checkQueryString("result.html?action=" + escape('submit') + "&amount=" +escape('1233.00'));
				//$("form").attr('action',newURL).fixAppURL();
				location.href = newURL
				//$("form").submit();
			}
		});
		$('#btnBack').click(function(){
			
				window.history.back();        
			
		});
		$('.friendsBlk input[type=checkbox]').live('click',function(){
			validateCreate();
		});
		
		$('#dutchAmount').change(function(){
			validateCreate();
		});
		$('#dutchAmount').blur(function(){
			if(validateCreate()){
				$(this).parent().removeClass('error');
				var val = parseFloat($(this).val())
				$(this).val(val.toFixed(2));
			}
			
		});
		validateCreate = function(){
			var valid = true;
			if($('#dutchName').val().trim()==""){
				$('#dutchName').parent().addClass('error');
				$('#dutchName').parent().find('.errormessage').html('Enter Description.')
				valid = false;
			}else{
				$('#dutchName').parent().removeClass('error');
				
			}
			
			if($('#dutchAmount').val().trim()=="" || isNaN($('#dutchAmount').val())){
				$('#dutchAmount').parent().addClass('error');
				$('#dutchAmount').parent().find('.errormessage').html('Enter Valid Amount.');
				valid = false;
			}else{
				$('#dutchAmount').parent().removeClass('error');
			}
			if(valid){
				$('.friendsBlk').show();
				var amt = $('#dutchAmount').val();
				var shares = $('.friendsBlk input[type=checkbox]').filter(':checked').length
				eachAmt = amt/shares;
				$('.eachAmount h1').html('$'+eachAmt.toFixed(2)+'/each ')
			}
			return valid;
		}
	
	
	
	$('.friendsBlk').hide();
	
	init();
	});



