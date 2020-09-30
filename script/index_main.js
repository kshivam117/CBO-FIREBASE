
//  DIsabLING INSPECT ELEMENT
//$(document).bind("contextmenu",function(e) {
 //  e.preventDefault();
//});

//  DISABLING  F12  FUNCCTION
// $(document).keydown(function(e){
//     if(e.which === 123){
//        return false;
//     }
// });

//  MAKING ERROR WHHILE INSPECTING CODE
  //  eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(3(){(3 a(){8{(3 b(2){7((\'\'+(2/2)).6!==1||2%5===0){(3(){}).9(\'4\')()}c{4}b(++2)})(0)}d(e){g(a,f)}})()})();',17,17,'||i|function|debugger|20|length|if|try|constructor|||else|catch||5000|setTimeout'.split('|'),0,{}))


var rootController = angular.module("MyApp",[]);
rootController.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

rootController.controller("MyCntrl", ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
   
    //var MeetingId = "-MHvtzwbKclQX1uzf-MC"; 
    var MeetingId = $location.search().mId;

    MeetingId = MeetingId == undefined || MeetingId.length<10 ? "" : MeetingId;

    var mVsualAdsArray = [];  
    var itemsFilesOfBrand =[];
    var itemsNamesOfBrand =[];
            
    var mActiveBrandId = 0;
    var mActiveItemIndex = 0; 
    
    var mChannelName = "CBO-E-DETAILING" ;
    var mRootChannelName = "CBO-E-DETAILING" ;
    var mMeethingDetail = "MEETINGS";
    var mMeetingChannelName = (mRootChannelName+"/"+MeetingId);        
    var mMeetingDbRfrence ;   
    var mMeetingDbSnapShot;   

    var loaderView = document.getElementById("loaderView");
    var dataView = document.getElementById("dataView");
    var mCompanyNameId = document.getElementById("mCompanyName"); 
    var mrPhotoImg = document.getElementById("mrPhotoImg"); 
    
    var mBasURL = "";
    
    $scope.initFirebase = function(){
                
        var firebaseConfig = {
            apiKey: "AIzaSyDI5MobOoKxfw4jBnyRruchySt1pYbtvsc",
            authDomain: "cbofcm-197f1.firebaseapp.com",
            databaseURL: "https://cbofcm-197f1-d1461.firebaseio.com/",
            projectId: "cbofcm-197f1",
            storageBucket: "cbofcm-197f1.appspot.com",
            messagingSenderId: "173555013984",
            appId: "1:173555013984:web:c57a482e7ddb8c876f6605"
          };
        firebase.initializeApp(firebaseConfig);

        mMeetingDbRfrence = firebase.database().ref(mMeetingChannelName+"/MEETING");

        // var meetingRef = firebase.database().ref(mMeetingChannelName+"/MEETING");
        // meetingRef.push();
        // meetingRef.set(
        //             {    DCR_ID: "DCR_ID123", 
        //                  DR_ID: "DRID-1", 
        //                  PA_ID: "1232",
        //                  MANAGERES_ID : "1,2,3,4,5",
        //                  ACTIVE_ITEM_ID :"1",
        //                  ACTIVE_BRAND_ID :"1",
        //                  MEETING_DATE:"23/09/2020",
        //                  MEETING_TIME:"11:20"
        //             }
        //         );


        // var meetingItemsRef = firebase.database().ref(mMeetingChannelName+"/ITEMS");
            // for(var x=1;x<10;x++){ 
            //     var eachItemsRef = firebase.database().ref(mMeetingChannelName+"/ITEMS/"+x);
            //     eachItemsRef.push();
            //     eachItemsRef.set(
            //         {
            //             BRAND_ID: x, 
            //             ITEM_NAME:(x+"item1,")+(x+"item2,")+(x+"iteem3,")+(x+"item4"),
            //             ITEM_ID:"1,2,3,4",
            //             FILE_NAME:"https://www.roopakstores.com/image/catalog/Amla-muraba-Dry.jpg,https://www.roopakstores.com/image/catalog/Amla-muraba-Dry.jpg,https://www.roopakstores.com/image/catalog/product/279.jpg,https://www.roopakstores.com/image/catalog/product/279.jpg",
            //             SRNO:"1,2,3,4",
            //             ISSELECTED : "1,1,1,1"
            //         }

            //     );

            // }

        //var mDBRefTxn = firebase.database().ref(mrWisePah).limitToLast(10);
       

        // mMeetingDbRfrence.on('child_added', function(data) {
        //     var imageIndex = parseInt(data.val()["imageIndex"]+"");
        //     //diplayImage(imageIndex);
        // });
 

        // mMeetingDbRfrence.on('child_changed', function(data) {
            
        //     alert(JSON.stringify(data));

        // });

        mMeetingDbRfrence.on('value', function(snapshot) {
            mMeetingDbSnapShot = snapshot.val();
            mActiveItemIdSRN = snapshot.val()["ACTIVE_ITEM_SRN"] == undefined ? "1": snapshot.val()["ACTIVE_ITEM_SRN"] ;
            mActiveBrandId = snapshot.val()["ACTIVE_BRAND_ID"];
            // mActiveItemId = snapshot.val()["ACTIVE_ITEM_ID"];

            $scope.mRepresentativName  = snapshot.val()["PA_NAME"];
            var COMPANY_NAME = snapshot.val()["COMPANY_NAME"];
            var PA_NAME = snapshot.val()["PA_NAME"];
            var USER_PROFILE_PIC = snapshot.val()["USER_PROFILE_PIC"];

            
            mBasURL = snapshot.val()["BASE_URL"];

            mCompanyNameId.innerHTML = COMPANY_NAME.split(" ")[0] + " PRESENTATION BY '"+PA_NAME+"'";

              // default usr image
            mrPhotoImg.src = USER_PROFILE_PIC != '' ? USER_PROFILE_PIC : "https://f0.pngfuel.com/png/304/305/man-with-formal-suit-illustration-png-clip-art.png";
           
            diplayImage(mActiveBrandId,mActiveItemIdSRN);
            
        });
        
        firebase.database().ref(mMeetingChannelName+"/ITEMS").orderByChild("SRN").on('value', function(snapshot) {
    
            hideLoader();
            //snapshot.sortBy("ISSELECTED","asc");

            

            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log(childKey);
                mVsualAdsArray.push(childData);
            });
            //mVsualAdsArray.reverse();
            mVsualAdsArray.sort((a, b) => parseInt(a["SRN"])- parseInt(b["SRN"]));
           
            displayBrandWiseItems(mVsualAdsArray,mActiveBrandId,mActiveItemIdSRN);
            
        });

      
    }
    
    if (MeetingId != "") {
        
        showLoader();
        $scope.initFirebase();   

    }else{

        hideLoader();
            
        alert("Incorrect/Expired Meeting Details");
       

    }

    function displayBrandWiseItems(mVsualAdsArray,brandId,itemSRN){

            var horizontalRow = document.getElementById("horizontalRow");
            removeAllChildNodes(horizontalRow);
                for (var x=0; x<mVsualAdsArray.length;x++){

                        // IMAGE CRATING BY JAVACRIPT 
                        // var eachItem =  document.createElement("img");
                        // eachItem.src = mVsualAdsArray[x]["image"];
                        // eachItem.style.height = 50;
                        // eachItem.style.width = 100;
                        // eachItem.style.display = "inline-block";
                        // eachItem.className = "img";

                        var eachItem =  document.createElement("button");
                        eachItem.innerText = mVsualAdsArray[x]["BRAND_NAME"];
                        eachItem.value = mVsualAdsArray[x]["BRAND_ID"];
                        eachItem.style.height = 40;
                        eachItem.style.width = 150;
                        eachItem.style.marginLeft = 6;
                        eachItem.style.marginRight = 6;

                        if(brandId == parseInt(mVsualAdsArray[x]["BRAND_ID"])){

                            eachItem.className = "success-active horizontalItem";

                        }else{

                            var IS_SELECTED = (mVsualAdsArray[x]["ISSELECTED"] === 'true');

                            if(IS_SELECTED){

                                eachItem.className = "success-selected horizontalItem";
    
                            }else{
                                
                                eachItem.className = "success-non-selected horizontalItem";
                            }
                        }
                        
                        
                        eachItem.style.display = "inline-block";
                        eachItem.onclick = function() { 

                            for (var t=0 ; t< horizontalRow.children.length ; t++){

                                if(horizontalRow.children[t].value == this.value ){

                                    horizontalRow.children[t].className = "success-active horizontalItem";

                                }else {

                                    var IS_SELECTED = (mVsualAdsArray[t]["ISSELECTED"] === 'true');

                                    if(IS_SELECTED){

                                        horizontalRow.children[t].className = "success-selected horizontalItem";
        
                                    }else{
                                        
                                        horizontalRow.children[t].className = "success-non-selected horizontalItem";
                                    }
                                }

                            }

                            switchBrand(this.value);
                          };

                        horizontalRow.append(eachItem);

                }

                diplayImage(brandId,itemSRN);
    }

    function diplayImage(brandIdStr,activeItemSRNStr){

        var NextBTN = document.getElementById("NextBTN");
        var PreviousBTN = document.getElementById("PreviousBTN");

        if(mVsualAdsArray.length>0){

            var brandId = parseInt(brandIdStr);

            var brands = mVsualAdsArray.filter((x) => { return parseInt(x["BRAND_ID"])==brandId; });

            var brandObject;
            var titleString ="";
            
            //var activeItemId=0;
            var activeImageURL ="";
            
            if(brands.length>0){

                brandObject = brands[0];
                itemsFilesOfBrand = brandObject["FILE_NAME"].split(",");
                itemsNamesOfBrand = brandObject["ITEM_NAME"].split(",");
                
                mActiveItemIndex  =  parseInt(activeItemSRNStr);
                
                //var itemsLST = itemsIdsOfBrand.filter((y) => { return parseInt(itemsIdsOfBrand[y])==itemId;});
                //activeItemId = singleItem[""];

                // for(var y=0; y<itemsIdsOfBrand.length; y++){

                //     if( parseInt(itemsIdsOfBrand[y]) == itemId ){

                //         if( parseInt(itemsSRNOfBrand[y]) == parseInt(activeItemSRNStr) ){

                //             mActiveItemId = itemId;
                //             mActiveItemIndex = y;
                //             break;
                //         }
                //     }
                // }


    
                // titleString =  "Visual Ad => "+(itemsIdsOfBrand[mActiveItemIndex])+" of "+ itemsIdsOfBrand.length+"<br> "
                // + "BRAND ID : "+brandIdStr +" & ITEM NAME : "+ itemsNamesOfBrand[mActiveItemIndex];

                titleString =  itemsNamesOfBrand[mActiveItemIndex];
                activeImageURL = itemsFilesOfBrand[mActiveItemIndex];
                if(activeImageURL.includes("http://test.cboinfotech.co")){

                    if( mBasURL === '' || mBasURL == undefined){
                        mBasURL =  "https://seagullpharma1.net";
                    }

                    activeImageURL =  activeImageURL.replace("http://test.cboinfotech.co.in",mBasURL);
                }

                

               // titleString =  activeImageURL;

                if((itemsFilesOfBrand.length-1) == mActiveItemIndex){

                    NextBTN.disabled = true;
                    PreviousBTN.disabled = false;

                }else if(mActiveItemIndex == 0){

                    NextBTN.disabled = false;
                    PreviousBTN.disabled = true;

                }else{
                    
                    NextBTN.disabled = false;
                    PreviousBTN.disabled = false;
                }
            
            }else{

                titleString ="Invalid Command"; 
                activeImageURL ="";
            }

            var titleAds = document.getElementById("titleAds");
            titleAds.innerHTML = titleString;
            

            var visualAdDiv = document.getElementById("imageCnter");
            visualAdDiv.src = activeImageURL;
            //removeAllChildNodes(visualAdDiv);

            // var eachItem =  document.createElement("img");
            // eachItem.src = activeImageURL;
            // eachItem.style.height ="72%";
            // eachItem.style.width ="auto";
            // eachItem.className="img-responsive";
            // visualAdDiv.append(eachItem);

            if(activeImageURL != "") {
                //alert(activeImageURL);
            }


            var horizontalRow = document.getElementById("horizontalRow");

            for (var t=0 ; t< horizontalRow.children.length ; t++){

                if(horizontalRow.children[t].value == brandIdStr){

                    horizontalRow.children[t].className = "success-active horizontalItem";
                    horizontalRow.children[t].focus();

                }else {

                    var IS_SELECTED = (mVsualAdsArray[t]["ISSELECTED"] === 'true');

                    if(IS_SELECTED){

                        horizontalRow.children[t].className = "success-selected horizontalItem";

                    }else{
                        
                        horizontalRow.children[t].className = "success-non-selected horizontalItem";
                    }
                }
            }
        }
        
    }

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

 function switchBrand(brandId) {
    mActiveItemIndex = 0;
    mMeetingDbRfrence.set(
         {    DCR_ID: mMeetingDbSnapShot["DCR_ID"], 
              DR_ID: mMeetingDbSnapShot["DR_ID"], 
              PA_ID: mMeetingDbSnapShot["PA_ID"],
              MANAGERES_ID : mMeetingDbSnapShot["MANAGERES_ID"],
              ACTIVE_ITEM_SRN : mActiveItemIndex+"", 
              ACTIVE_ITEM_ID : mMeetingDbSnapShot["ACTIVE_ITEM_ID"],
              ACTIVE_BRAND_ID : brandId,
              //MEETING_DATE: mMeetingDbSnapShot["MEETING_DATE"],
              MEETING_TIME: mMeetingDbSnapShot["MEETING_TIME"]
         }
     );
 }
  
$scope.goPrevious = function () {
   if(mActiveItemIndex==0){
       return;
   }
   mActiveItemIndex =  (parseInt(mActiveItemIndex)-1);

   mMeetingDbRfrence.set(
        {    DCR_ID: mMeetingDbSnapShot["DCR_ID"], 
             DR_ID: mMeetingDbSnapShot["DR_ID"], 
             PA_ID: mMeetingDbSnapShot["PA_ID"],
             MANAGERES_ID : mMeetingDbSnapShot["MANAGERES_ID"],
             //ACTIVE_ITEM_SRN : itemsSRNOfBrand[mActiveItemIndex],
             ACTIVE_ITEM_SRN : ""+mActiveItemIndex,
             ACTIVE_ITEM_ID : mMeetingDbSnapShot["ACTIVE_ITEM_ID"],
             ACTIVE_BRAND_ID : mMeetingDbSnapShot["ACTIVE_BRAND_ID"],
             //MEETING_DATE: mMeetingDbSnapShot["MEETING_DATE"],
             MEETING_TIME: mMeetingDbSnapShot["MEETING_TIME"]
        }
    );
}


$scope.goNext = function () {
    
    mActiveItemIndex =  (parseInt(mActiveItemIndex)+1);

    if(mActiveItemIndex >= itemsFilesOfBrand.length){
        return;
    }

    mMeetingDbRfrence.set(
         {    DCR_ID: mMeetingDbSnapShot["DCR_ID"], 
              DR_ID: mMeetingDbSnapShot["DR_ID"], 
              PA_ID: mMeetingDbSnapShot["PA_ID"],
              MANAGERES_ID : mMeetingDbSnapShot["MANAGERES_ID"],
              //ACTIVE_ITEM_SRN : itemsSRNOfBrand[mActiveItemIndex],
              ACTIVE_ITEM_SRN : ""+mActiveItemIndex,
              ACTIVE_ITEM_ID : mMeetingDbSnapShot["ACTIVE_ITEM_ID"],
              ACTIVE_BRAND_ID : mMeetingDbSnapShot["ACTIVE_BRAND_ID"],
             // MEETING_DATE: mMeetingDbSnapShot["MEETING_DATE"],
              MEETING_TIME: mMeetingDbSnapShot["MEETING_TIME"]
         }
     );
 }
 
    function hideLoader() {
        hideView(loaderView);
        showView(dataView);
    }
    function showLoader() {
        hideView(dataView);
        showView(loaderView);
    }
    function hideView(x) {
        x.style.display = "none";
    }

    function showView(x) {
        x.style.display = "block";
    }
    function getdmyString(dateObj, isYMD) {

        var date = dateObj.getDate();
        var month = dateObj.getMonth() + 1;
        var year = dateObj.getFullYear();
        if (isYMD) {
            return year + "-" + (month > 9 ? month : "0" + month) + "-" + (date > 9 ? date : "0" + date);
        } else {
            return (date > 9 ? date : "0" + date) + "-" + (month > 9 ? month : "0" + month) + "-" + year;
        }
    }

}]);