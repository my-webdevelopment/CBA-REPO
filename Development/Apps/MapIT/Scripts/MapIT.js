/**
* Map !T version 1.0.0
* 
* Copyright (c) 2012, HCL Technologies Ltd.
* All rights reserved.
*/
//Event on Mobile Initialize.
$(document).bind("mobileinit", function(){
	layout=function(){
		var win = $('body').width();
		var bdy = $('#map').width();
		var mgn = (parseInt(win)-parseInt(bdy))/2;
		$('#map,#details,#search').css("margin-left",mgn);
	};
	layout();
	$(window).bind( 'orientationchange', function(e){
		layout();
	});
	$( document ).bind( 'mobileinit', function(){
		  $.mobile.loader.prototype.options.text = "loading";
		  $.mobile.loader.prototype.options.textVisible = false;
		  $.mobile.loader.prototype.options.theme = "a";
		  $.mobile.loader.prototype.options.html = "";
		});
		
		data = mockData.result;
	
});
//initailizing map screen
$( "#map" ).on( "pageinit", function() {
	layout();
	
	var center = new google.maps.LatLng(-33.82503,151.20367);
	map = new google.maps.Map(document.getElementById('map_canvas'), {
          zoom: 4,
          center: center,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
	google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });
    search();

	   
});
//intializing search screen
$( "#search" ).on( "pageinit", function() {
	layout();
	       
});
//initializing transaction details screen
$( "#details" ).on( "pageinit", function() {
	layout();
	
});
var data = null;
var map=null;
var mc = null;
var mgr = null;
//function to get random value between intervals
function randomFromInterval(from,to){return Math.floor(Math.random()*(to-from+1)+from);}

//function which on click of marker which creates transaction details of a transaction
function viewDetails(marker) {
	var tdate = new Date(marker.info.date.valueDateTime);
	tdate = formatDate(tdate,"MMM, dd, yyyy, hh:mm:ss a");
	//dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
	var tag ="";
	var amt = parseFloat(marker.info.amount.signed).toFixed(2)
	try{
	if(marker.info.tags.tag.text){tag =marker.info.tags.tag.text}
	}catch(err){}
	var result ={transactionDate:tdate,transactionName:marker.info.description.cleaned,transactionAddress:marker.info.location.friendly,transactionTag:tag,amount:amt};
	
	$('ul.transList').html($('#contextItemTemplate').render(result));
	$.mobile.changePage('#details',{
		transition: "slideup",
		reverse: true,
		changeHash: true
		
	});
}

//Get and display the list of items that are stored in the local sample data json object.
function search(){
	var acnt = $('#account_type').val();
	var frmDate = $('#transFrom').val();
	var toDate = $('#transTo').val();
	if(toDate==""){toDate = new Date();}else{toDate = Date.parse(toDate);}
	if(frmDate==""){frmDate = new Date();frmDate.setDate(frmDate.getDate() - 365);}else{frmDate = Date.parse(frmDate);}
	var data = [];
	if(acnt!='' || acnt !='A0'){
		$.each(mockData.result.transactions.completedTransactions.completedTransaction, function(index,element){
			var transDate = Date.parse(element.date.postingDate);
		
			 if(element.fromAccount.id==acnt && frmDate < transDate && toDate > transDate){
				data.push(element);
			 }
		 });
	}else{
		$.each(mockData.result.transactions.completedTransactions.completedTransaction, function(index,element){
			var transDate = Date.parse(element.date.postingDate);
			console.log(transDate)
			 if(frmDate < transDate && toDate > transDate){
				data.push(element);
			 }
		 });
	}
		var markers = [];
	    for (var i = 0; i < data.length; i++) {
		try{
			if((data[i]).location.geoLocation.latitude !=0 && (data[i]).location.geoLocation.longitude !=0){
				var lat =parseFloat((data[i]).location.geoLocation.latitude) + (randomFromInterval(1,10)*0.0001);
				var lng = parseFloat((data[i]).location.geoLocation.longitude)+(randomFromInterval(1,99)*0.0001);
				
				var latLng = new google.maps.LatLng(lat, lng);
				var marker = new google.maps.Marker({
					position: latLng,
					zIndex: Math.round(latLng.lat()*-100000)<<5,
					info:(data[i]),
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL
					},'animation': google.maps.Animation.DROP

				  });
				contentString ="<a href='javascript:viewDetails(\""+i+"\")'>asd asd"+i+"<a>";
				google.maps.event.addListener(marker, 'click', function() {
					
					viewDetails(marker);
					
				});
					
				markers.push(marker);
			 }
		} catch(err){

		}
			 
        }
		var markerCluster = new MarkerClusterer(map, markers);
			  		
}

///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.Common.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.Ajax.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.App.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\AppStore.Container.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\jquery-1.7.2-vsdoc.js" />
///<reference path="..\..\..\Common\AppStore\Scripts\jquery.ui.autocomplete.js"/>

AppStore.App.holdReadyMessage();

$(function () {

	var AppStoreContext = new AppStore.Context();


	$.ajaxSetup ({
	// Disable caching of AJAX responses
	cache: false
	});
	

	$("#btnSubmit").click( function () {
		  if($("#searchForm").valid()){
			  $.mobile.changePage('#map',{
					transition: "slideup",
					reverse: false,
					changeHash: true
				})
			  search();
			  
		  }
	});
	// form vaildation custom classes
	$("#searchForm").validate();
	$.validator.addMethod("lessThan", function(value, element) {
		D1 = new Date(value);
		v = $('#transTo').val();
		if($.trim(v)==""){ return true;}
		D2 = new Date(v);
		if(D1 > D2){return false;}
		  return true; 
		}, "Start Date Should be Less Than End Date");
	$.validator.addMethod("moreThan", function(value, element) { 
		D1 = new Date(value);
		v = $('#transFrom').val();
		if($.trim(v)==""){ return true;}
		D2 = new Date(v);
		if(D1 < D2){return false;}
		  return true; 
		}, "End Date Should be More Than Start Date");
	$.validator.addMethod("pastDate", function(value, element) { 
		D1 = new Date(value);
		D2 = new Date();
		if(D1 > D2){return false;}
		return true;
		}, "Future Date is Not Permitted.");
	
	var LOCAL_STORAGE_NAMEPREFIX = "AppStoreContext___";
	
	// helper functions for jsRender
	$.views.helpers({
		stringify: function (d) {
			return JSON.stringify(d);
		}
	});
	
	
					
});