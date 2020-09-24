
var rootController = angular.module("MyApp",[]);
rootController.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

rootController.controller("MyCntrl", ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {
   
    //var MeetingId = "-MHvtzwbKclQX1uzf-MC"; 
    var MeetingId = $location.search().mId;

    MeetingId = MeetingId == undefined || MeetingId.length<10 ? "" : MeetingId;

    var mVsualAdsArray = [];  
    var mActiveItemId = 0;     
    var mActiveItemIdIndex = 0; 
     var itemsIdsOfBrand =[];
    var mActiveBrandId = 0;       
    var mChannelName = "CBO-E-DETAILING" ;
    var mRootChannelName = "CBO-E-DETAILING" ;
    var mMeethingDetail = "MEETINGS";
    var mMeetingChannelName = (mRootChannelName+"/"+MeetingId);        
    var mMeetingDbRfrence ;   
    var mMeetingDbSnapShot;   

    var loaderView = document.getElementById("loaderView");
    var dataView = document.getElementById("dataView");

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
            mActiveItemId = snapshot.val()["ACTIVE_ITEM_ID"];
            mActiveBrandId = snapshot.val()["ACTIVE_BRAND_ID"];
            diplayImage(mActiveBrandId,mActiveItemId);
            
        });
        
        firebase.database().ref(mMeetingChannelName+"/ITEMS").on('value', function(snapshot) {
    
            hideLoader();

            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();

                mVsualAdsArray.push(childData);
            });

            displayBrandWiseItems(mVsualAdsArray,mActiveBrandId,mActiveItemId);
            
        });
    }
    if (MeetingId != "") {
        
        showLoader();
        $scope.initFirebase();   

    }else{

        hideLoader();
            

        alert("Incorrect/Expired Meeting Details");

    }

    function displayBrandWiseItems(mVsualAdsArray,brandId,itemId){

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
                        eachItem.innerText = ( "BRAND-ID : "+mVsualAdsArray[x]["BRAND_ID"]);
                        eachItem.value = mVsualAdsArray[x]["BRAND_ID"];
                        eachItem.style.height = 40;
                        eachItem.style.width = 150;
                        eachItem.style.marginLeft = 6;
                        eachItem.style.marginRight = 6;
                        eachItem.className = "success horizontalItem";
                        eachItem.style.display = "inline-block";
                        eachItem.onclick = function() { 
                            switchBrand(this.value);
                          };

                        horizontalRow.append(eachItem);

                }

                diplayImage(brandId,itemId);
    }

    function diplayImage(brandIdStr,activeItemIdStr){

        var NextBTN = document.getElementById("NextBTN");
        var PreviousBTN = document.getElementById("PreviousBTN");

        if(mVsualAdsArray.length>0){


            var brandId = parseInt(brandIdStr);
            var itemId  = parseInt(activeItemIdStr);

            var brands = mVsualAdsArray.filter((x) => { return parseInt(x["BRAND_ID"])==brandId; });

            var brandObject;
            var titleString ="";
            var itemsFilesOfBrand =[];
            var itemsNamesOfBrand =[];
            
            var activeItemId=0;
            var activeImageURL ="";
            
            if(brands.length>0){

                brandObject = brands[0];
                itemsFilesOfBrand = brandObject["FILE_NAME"].split(",");
                itemsNamesOfBrand = brandObject["ITEM_NAME"].split(",");
                itemsIdsOfBrand = brandObject["ITEM_ID"].split(",");

                for(var y=0;y<itemsIdsOfBrand.length;y++){

                    if(parseInt(itemsIdsOfBrand[y])==itemId){
                        activeItemId = itemId;
                        mActiveItemIdIndex = y;
                        break;
                    }
                    
                }

                titleString =  "Visual Ad => "+(itemsIdsOfBrand[mActiveItemIdIndex])+" of "+ itemsIdsOfBrand.length+"<br> "
                + "BRAND ID : "+brandIdStr +" & ITEM NAME : "+ itemsNamesOfBrand[mActiveItemIdIndex];

                activeImageURL = itemsFilesOfBrand[mActiveItemIdIndex];

                if(itemsFilesOfBrand.length==(mActiveItemIdIndex+1)){

                    NextBTN.disabled = true;
                    PreviousBTN.disabled = false;

                }else if(mActiveItemIdIndex==0){

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
            

            var visualAdDiv = document.getElementById("visualAdDiv");
            removeAllChildNodes(visualAdDiv);

            var eachItem =  document.createElement("img");
            eachItem.src = activeImageURL;
            eachItem.style.height ="80%";
            eachItem.style.width ="auto";
            visualAdDiv.append(eachItem);

            if(activeImageURL !=""){
                //alert(activeImageURL);
            }

        }
        
    }

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

 function switchBrand(brandId) {
    mMeetingDbRfrence.set(
         {    DCR_ID: mMeetingDbSnapShot["DCR_ID"], 
              DR_ID: mMeetingDbSnapShot["DR_ID"], 
              PA_ID: mMeetingDbSnapShot["PA_ID"],
              MANAGERES_ID : mMeetingDbSnapShot["MANAGERES_ID"],
              ACTIVE_ITEM_ID : (parseInt(mActiveItemId)-1),
              ACTIVE_BRAND_ID : brandId,
              //MEETING_DATE: mMeetingDbSnapShot["MEETING_DATE"],
              MEETING_TIME: mMeetingDbSnapShot["MEETING_TIME"]
         }
     );
 }
  
$scope.goPrevious = function () {
   if(mActiveItemId==0){
       return;
   }
   mActiveItemIdIndex =  (parseInt(mActiveItemIdIndex)-1);

   mMeetingDbRfrence.set(
        {    DCR_ID: mMeetingDbSnapShot["DCR_ID"], 
             DR_ID: mMeetingDbSnapShot["DR_ID"], 
             PA_ID: mMeetingDbSnapShot["PA_ID"],
             MANAGERES_ID : mMeetingDbSnapShot["MANAGERES_ID"],
             ACTIVE_ITEM_ID : itemsIdsOfBrand[mActiveItemIdIndex],
             ACTIVE_BRAND_ID : mMeetingDbSnapShot["ACTIVE_BRAND_ID"],
             //MEETING_DATE: mMeetingDbSnapShot["MEETING_DATE"],
             MEETING_TIME: mMeetingDbSnapShot["MEETING_TIME"]
        }
    );
}


$scope.goNext = function () {
   
    mActiveItemIdIndex =  (parseInt(mActiveItemIdIndex)+1);

    mMeetingDbRfrence.set(
         {    DCR_ID: mMeetingDbSnapShot["DCR_ID"], 
              DR_ID: mMeetingDbSnapShot["DR_ID"], 
              PA_ID: mMeetingDbSnapShot["PA_ID"],
              MANAGERES_ID : mMeetingDbSnapShot["MANAGERES_ID"],
              ACTIVE_ITEM_ID : itemsIdsOfBrand[mActiveItemIdIndex],
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