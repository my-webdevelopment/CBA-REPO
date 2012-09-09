// Default.js

///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.Common.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.Ajax.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.App.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.Container.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\jquery-1.7.2-vsdoc.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\jquery.ui.autocomplete.js"/>
AppStore.App.holdReadyMessage();



$(function () {

function getDetailsByAccountId(accountId){
	var accounts = AllData.result.accounts.account
	var len = accounts.length
	responseText = [];
	for (var idx = 0; idx < len; idx++) {
				var accountItem = accounts[idx];
				if(accountId==accountItem.id){
					responseText.push({
						success: true,
						data: {
							id:  accountItem.id,
							name: accountItem.name.preferredName.text,
							accNumber: accountItem.number.accountNumberFormatted.text,
							currentBalanceSign: accountItem.balance.sign,
							currentBalance: accountItem.balance.signed
						}
					});
				}
				
	}
	$('#content').html($('.allAccounts').render(responseText))
	
	
}	

 function getParameterByName(name){
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.search);
		if(results == null)
			return "";
		else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
}

	
function init(){
	accountId = getParameterByName('id');
	var ctransactions = AllData.result.transactions.completedTransactions.completedTransaction
	getDetailsByAccountId(accountId)
	var len = ctransactions.length
	var responseText = [];
	for (var idx = 0; idx < len; idx++) {
		var transaction = ctransactions[idx]
		
		if(transaction.fromAccount.id ==accountId){
			//alert(transaction.amount.signed)
			if(transaction.tags){
				if(!transaction.tags.tag){
					tag = "N/A"
				}else{
					tag = transaction.tags.tag.text
				}
			}else{
				tag ="N/A"
			}
			responseText.push({
						success: true,
						data: {
							id:  transaction.id,
							description: transaction.description.cleaned,
							tag: tag,
							date: $.format.date(transaction.date.postingDate+ '00:00:00', "dd/MM/yyyy"),
							amount: transaction.amount.signed,
							currency:transaction.amount.currency
						}
					});
		
		}
	}
	console.log(responseText)
	$('#content2').html($('.contextItemTemplate').render(responseText))
	AppStore.App.sendReadyMessage();

}

init();


});