// Default.js

///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.Common.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.Ajax.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.App.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.Container.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\jquery-1.7.2-vsdoc.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\jquery.ui.autocomplete.js"/>
/**
 * jQuery alterClass plugin
 *
 * Remove element classes with wildcard matching. Optionally add classes:
 *   $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
 *
 * Copyright (c) 2011 Pete Boere (the-echoplex.net)
 * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
(function ( $ ) {
	
$.fn.alterClass = function ( removals, additions ) {
	
	var self = this;
	
	if ( removals.indexOf( '*' ) === -1 ) {
		// Use native jQuery methods if there is no wildcard matching
		self.removeClass( removals );
		return !additions ? self : self.addClass( additions );
	}

	var patt = new RegExp( '\\s' + 
			removals.
				replace( /\*/g, '[A-Za-z0-9-_]+' ).
				split( ' ' ).
				join( '\\s|\\s' ) + 
			'\\s', 'g' );

	self.each( function ( i, it ) {
		var cn = ' ' + it.className + ' ';
		while ( patt.test( cn ) ) {
			cn = cn.replace( patt, ' ' );
		}
		it.className = $.trim( cn );
	});

	return !additions ? self : self.addClass( additions );
};

})( jQuery );



AppStore.App.holdReadyMessage();

$(function () {
progressBar = function(ele,width){
			width=parseInt(width);
			if(width<=50){x='fill-green'}else if(width>50 && width<=75){x='fill-blue'}else{x='fill-orange'}
			ele.alterClass('fill-*',x).children('span').css('width',width+'%');
		
}		

function init(){
	
  		  $("#header1").bind("click",function() {	     
			  $(this).closest("div.section").children("div.content").toggle("slow");
		  });
		  
		  $("#header2").bind("click",function() {	     
			  $(this).closest("div.section").children("div.content:eq(0)").toggle("slow");
			  progressBar($('#budgetLevel-1'),'78');
			  progressBar($('#budgetLevel-2'),'11');
			  progressBar($('#budgetLevel-3'),'100');
			  progressBar($('#budgetLevel-4'),'68');
		  });
		  
		  $("#field1").bind("click",function() {	     
			  $(this).closest("div.section").children("div.content:eq(1)").toggle("slow");
		  });
		  
		  $("div.currency1").bind("click",function() {
			   alert("redirect to account summary page");
		  });
		  
		  	
			var totalAvailableFunds = AllData.result.totals.totalAvailable.text;
			var funds_currency = AllData.result.totals.totalAvailable.currency
			var totalLiabilities = AllData.result.totals.totalLiabilities.text;
			var liab_currency =AllData.result.totals.totalLiabilities.currency;
			var data = [{available_money:totalAvailableFunds,
						available_currency: funds_currency,
						liabilities_money:totalLiabilities,
						liabilities_currency: liab_currency
					}]
			$('#allaccounts').html($('#allAccountsAvailableFunds').render(data))
			$('#allliablities').html($('#allAccountsLiabilities').render(data))
			
			var accounts = AllData.result.accounts.account;
			
			responseText = [];
			var len = accounts.length
			for (var idx = 0; idx < len; idx++) {
				var accountItem = accounts[idx];

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
			$('#content').html($('.allAccounts').render(responseText))
			progressBar($('#pgbar'),'40');
		    AppStore.App.sendReadyMessage();
}
	   	
init();
});