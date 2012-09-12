AppStore.App.holdReadyMessage(); 
	var uID,uName;
	
	$(function() {
	
	

	var AppStoreContext = new AppStore.Context();
	var local;
	var LOCAL_STORAGE_NAMEPREFIX = "AppStoreDutchIT___";
	
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
				data.tranRelation.push({"tID":id,"uID":sessionStorage.getItem('userID'),"suID":sessionStorage.getItem('userID'),"time":id,"isSeen":"0","isPaid":"0","isLater":"","eachAmount":parseFloat(Amount/sharesCnt).toFixed(2),"poked":"0"});
				//shareNames.push('You');
			}else{
				data.tranRelation.push({"tID":id,"uID":sessionStorage.getItem('userID'),"suID":uid,"time":id,"isSeen":"0","isPaid":"0","isLater":"","eachAmount":parseFloat(Amount/sharesCnt).toFixed(2),"poked":"0"});
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
			if($('#dutchAmount').val().trim()=="" || isNaN($('#dutchAmount').val()) || $('#dutchAmount').val()<0){
				$('#dutchAmount').parent().addClass('error');
				$('#dutchAmount').parent().find('.errormessage').html('Enter Valid Amount.');
				valid = false;
			}else{
				$('#dutchAmount').parent().removeClass('error');
			}
			if(valid){
				//$('.friendsBlk').show();
				var amt = $('#dutchAmount').val();
				var shares = $('.friendsBlk input[type=checkbox]').filter(':checked').length
				eachAmt = amt/shares;
				$('.eachAmount h1').html('$'+eachAmt.toFixed(2)+'/each ')
			}
			return valid;
		}
	function init() {
			if(!localStorage.getItem(LOCAL_STORAGE_NAMEPREFIX +'Data'))
				localStorage.setItem(LOCAL_STORAGE_NAMEPREFIX + 'Data', "{\"data\":[],\"tranRelation\":[]}");	
			data = $.parseJSON(localStorage.getItem(LOCAL_STORAGE_NAMEPREFIX +'Data'));
			if(!sessionStorage.getItem('userID')){
				$('.main').hide();
				$('.btn-notification').hide()
			}else{
				$('.main').show();
				$('.btn-notification').show()
			}
			$('.paymentAlertsBlk').hide();
			$('.trackPaymentsBlk').show();
			$('.createPaymentBlk').hide();
			initialize();
	}
	$('.btn-notification .btn').click(function(){
			$('.trackPaymentsBlk').slideUp('slow');
			$('.createPaymentBlk').slideUp('slow');
			payObj = renderAlerts();
			if(payObj.length>0){
				$('.paymentAlertsBlk .contentMessage').html($('#pendingPaymentsTmpl').render(payObj)).show();
		    }
			$('.paymentAlertsBlk').slideDown('slow');
			$('.datepicker').each(function(){
				var datepickerID = $(this).prop('id');
				$('#'+datepickerID).datepicker()
					.on('changeDate', function(ev){
						today = new Date();
						if (ev.date.valueOf() < Date.UTC(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0)){
							$(this).parents('.inputAlert').first().find('.errorAlert').show().html('Past date is not permitted');
						} else {
							$(this).parents('.inputAlert').first().find('.errorAlert').hide()
							endDate = new Date(ev.date);
							$('#'+datepickerID).val($('.datepicker').data('date'));
						}
						$('#'+datepickerID).datepicker('hide');
					});
			});	
			$('.btn-create').show();
			$('.btn-track').show();
			return false;
		});
		$('.topNavigation .btn-create').click(function(){
			$('.trackPaymentsBlk').slideUp('slow');
			$('.paymentAlertsBlk').slideUp('slow');
			$('.createPaymentBlk').slideDown('slow');
			$('.btn-create').hide();
			$('.btn-track').show();
			return false;			
		});
		$('.topNavigation .btn-track').click(function(){
			$('.createPaymentBlk').slideUp('slow');
			$('.paymentAlertsBlk').slideUp('slow');	
			
			var myTransactions = jQuery.grep(data.data, function(element, index){
				return element.userID == uID ; // retain appropriate elements
			});
			var transObj = [];
			if(myTransactions.length > 0){
			
				$.each((myTransactions[0]).transaction,function(ind,ele){
				  
					var myTransaction = jQuery.grep(data.tranRelation, function(element, index){
						return element.tID == ele.tID ; // retain appropriate elements
					});
					var theDate = new Date((myTransaction[0]).time);
					time = $.format.date(theDate, "ddd dd, MMM yyyy");//  theDate.toGMTString();
					var paidAmount = 0;
					var pendingAmount = 0;
					var eachAmount = parseFloat(ele.amount/ele.count).toFixed(2);
					$.each(myTransaction, function(index,element){
						if(element.isPaid == 0 && element.suID !=uID ){
							pendingAmount=parseFloat(pendingAmount)+parseFloat(eachAmount);
						}
					});
					var totalAmount = parseFloat(ele.amount).toFixed(2);
					paidPercent = ((totalAmount - pendingAmount)/totalAmount)*100;
					paidAmount = totalAmount - pendingAmount;
					pendingPercent = 100-paidPercent
					transObj.push({"time":time,"description":ele.description,"amount":totalAmount,"eachAmount":eachAmount,"paidBy":"You","shared":ele.shared,"tID":(myTransaction[0]).tID,"paidPercent":paidPercent,"pendingPercent":pendingPercent,"paidAmount":parseFloat(paidAmount).toFixed(2),"pendingAmount":parseFloat(pendingAmount).toFixed(2)});
						
					
				});
			}
			transObj = transObj.reverse();
			if(transObj.length>0){
				$('.trackPaymentsBlk').html($('#transactionTmpl').render(transObj)).slideDown('slow');
			}else{
				
				$('.trackPaymentsBlk').html($('#noTransactionTmpl').render()).slideDown('slow');
			}
			$('.btn-create').show();
			$('.btn-track').hide();
			return false;			
		});
		
		initialize = function(){
			uID = sessionStorage.getItem('userID');
			uName = sessionStorage.getItem('userName');
			$('.paymentAlertsBlk').hide();
			$('.trackPaymentsBlk').hide();
			$('.createPaymentBlk').hide();
			if(!sessionStorage.getItem('userID')){
				return;
			}else{
				$('.main').show();
				$('.btn-notification').show();
				$('.btn-user .btnLabel').html(uName)
			}
			$('#userWelcome').html('welcome, '+uName);
			$.mockjax({
				url: 'Default.aspx/GetAddressBook',
				responseTime: 500,
				dataType: "json",
				response: function(settings) {
					
					var payee = AllData.result.addressBook.payees.payee;
					this.responseText = {success: true,data: []};
					if(uID == "U1"){
						this.responseText.data.push({name:"You",payeeID:"U1",checked:"checked='checked'"});
					}else{
						this.responseText.data.push({name:"You",payeeID:uID,checked:"checked='checked'"});
						this.responseText.data.push({name:"Peter Parker",payeeID:'U1',checked:""});
					}
						
					for (var idx = 0; idx < payee.length; idx++) {
						var payeeItem = payee[idx];
						if(uID != payeeItem.id)
						this.responseText.data.push({name:payeeItem.name,payeeID:payeeItem.id,checked:""});
					}
				}
			});
			
			$.getJSON("Default.aspx/GetAddressBook", {}, function(resp) {
				if (resp.success) {
					$('.checkgroup').html($('#addressBookTmpl').render(resp.data));
				}
			});
			if(sessionStorage.getItem('postStatus')){
				var confirmMsg = sessionStorage.getItem('postStatus');
				$('.contentMessage .description').html(confirmMsg);
				$('.contentMessage').show();
			}else{
				$('#contentMessage').hide();
			}
			sessionStorage.removeItem('postStatus');
			var newMessages = jQuery.grep(data.tranRelation, function(element, index){
				return element.suID == uID && element.isSeen == 0 && element.uID != uID ; // retain appropriate elements
			});

			var pendingReceive = jQuery.grep(data.tranRelation, function(element, index){
				return element.uID == uID && element.isPaid == 0 && element.suID != uID ; // retain appropriate elements
			});
			recAmt = 0;
		 
			$.each(pendingReceive,function(ind,ele){
				recAmt+=parseFloat(ele.eachAmount);
			});
			var receiveObj=[]
			$.each(newMessages,function(ind,ele){

					receiveData = jQuery.grep(data.data, function(element, index){
					  return element.userID == ele.uID ; // retain appropriate elements
					});
					receiveDataTrans = jQuery.grep((receiveData[0]).transaction, function(element, index){
					  return element.tID == ele.tID ; // retain appropriate elements
					}); 
					var theDate = new Date(ele.time);
					time = $.format.date(theDate, "ddd dd, MMM yyyy");//theDate.toGMTString();			
					receiveObj.push({"tID":ele.tID,"uID":ele.uID,"amount":ele.eachAmount,"userName":(receiveData[0]).userName,"description":(receiveDataTrans[0]).description,"time":time})
			  });
			var pendingPay = jQuery.grep(data.tranRelation, function(element, index){
				return element.suID == uID && element.isPaid == 0 && element.uID != uID ; // retain appropriate elements
			});
			$('.btn-notification .btn ').html('<i class="icon-tasks"></i>&nbsp;'+pendingPay.length);
			$('.topNavigation .btn-track').click();
		  
		  
		};
		renderAlerts = function(){
		
			var pendingPay = jQuery.grep(data.tranRelation, function(element, index){
				return element.suID == uID && element.isPaid == 0 && element.uID != uID ; // retain appropriate elements
		    });
			$('.btn-notification .btn ').html('<i class="icon-tasks"></i>&nbsp;'+pendingPay.length);
			var payObj = [];
			
			$.each(pendingPay,function(ind,ele){

				pendingData = jQuery.grep(data.data, function(element, index){
					return element.userID == ele.uID ; // retain appropriate elements
				});
				pendingDataTrans = jQuery.grep((pendingData[0]).transaction, function(element, index){
					return element.tID == ele.tID ; // retain appropriate elements
				}); 
				var theDate = new Date(ele.time);
				time = theDate.toGMTString();
				todayD = new Date();
				today = $.format.date(todayD, "MM/dd/yyyy");
				payObj.push({"tID":ele.tID,"uID":ele.uID,"amount":ele.eachAmount,"userName":(pendingData[0]).userName,"description":(pendingDataTrans[0]).description,"time":time,"today":today})
			});
			payObj = payObj.reverse();
			return payObj;
		}
		
			$('.viewDetails a').live('click',function(){
				var tID = $(this).attr('rel');
				var payments = jQuery.grep(data.tranRelation, function(element, index){
					  return element.tID == tID && element.suID!=uID // retain appropriate elements
				  });
				var user = jQuery.grep(data.data, function(element, index){
					  return element.userID == (payments[0]).uID // retain appropriate elements
				  });
				var transPayments = jQuery.grep((user[0]).transaction, function(element, index){
					  return element.tID == tID  // retain appropriate elements
				  });
				var obj=[];
				$.each(payments,function(ind,ele){
					var transUsers = jQuery.grep((transPayments[0]).shared, function(element, index){
						  return ele.suID == element.uID  // retain appropriate elements
					  });
					var det = {"tID":tID,"uID":transUsers[0].uID,"userName":transUsers[0].userName,"isSeen":ele.isSeen,"isPaid":ele.isPaid,"eachAmount":ele.eachAmount,"isLater":ele.isLater,"poked":ele.poked,}
					obj.push(det);
				});
				if(($(this).text()).toLowerCase().trim() == "view payments"){
					$(this).html('Hide Payments')
					$(this).parents('.two-column').first().find('.transDetails').html($('#detailedPaymentsTmpl').render(obj)).slideDown('slow');
				}else{
					$(this).parents('.two-column').first().find('.transDetails').slideUp('slow')
					$(this).html('View Payments')
				}
				
				
			});
		 
			$('.pay a').live('click',function(){
				x = confirm('this leads to payment page. for demo purpose, Click OK to Accept Payment.');
				if(x){
					var tID = $(this).parents('.inputAlert').attr('rel');
					var paidUser = $(this).parents('.inputAlert').first().find('.datepicker').attr('rel');
					uID = sessionStorage.getItem('userID');
					var payments = jQuery.grep(data.tranRelation, function(element, index){
					  return element.tID == tID && element.uID == paidUser && element.suID == uID// retain appropriate elements
					});
					payments[0].isSeen = "1";
					payments[0].isPaid = "1";
					payments[0].isLater = "";
					payments[0].poked = "0";
					localStorage.setItem(LOCAL_STORAGE_NAMEPREFIX + 'Data', JSON.stringify(data));
					$('.topNavigation .btn-track').click();
				}
			});
			
			$('.later a').live('click',function(){
				$(this).parents('.inputAlert').first().find('.payLater').toggle();
			});
			
			$('.btn_later').live('click',function(){
			
				date  = $(this).parents('.inputAlert').first().find('.datepicker').val();
				dateSelected = new Date(date);
				today = new Date();
				if(Date.UTC(dateSelected.getFullYear(),dateSelected.getMonth(),dateSelected.getDate(),0,0,0) > Date.UTC(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0)){
					var tID = $(this).parents('.inputAlert').attr('rel');
					var paidUser = $(this).parents('.inputAlert').first().find('.datepicker').attr('rel');
					uID = sessionStorage.getItem('userID');
					var payments = jQuery.grep(data.tranRelation, function(element, index){
					  return element.tID == tID && element.uID == paidUser && element.suID == uID// retain appropriate elements
					});
					payments[0].isSeen = "1";
					payments[0].isLater = date;
					localStorage.setItem(LOCAL_STORAGE_NAMEPREFIX + 'Data', JSON.stringify(data));
					$('.topNavigation .btn-track').click();
					
				}
				
			});
			$('#btnCreate').click(function(){
				if(validateCreate()){
					setDutch();
					initialize();
				}
				
			});
			$('#btnBack').click(function(){
				initialize();
			});
		    //$("form, a").fixAppURL();
			$('.listUser li a').click(function(){
				
				sessionStorage.setItem('userID', $(this).attr('id'));
				sessionStorage.setItem('userName', $(this).text());
				
				initialize();
				
			});
			
			init();
			
	   });


