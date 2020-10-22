
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
   
    var APT_DETAIL = $location.search().aptId;
    //$scope.COMPANY_CODE = $location.search().companyCode;
    // $scope.DR_ID = $location.search().DRID;

    //dcrId= 621
    // drid = 3384

    APT_DETAIL = APT_DETAIL == undefined || APT_DETAIL== "" ? "0@DEMOTEST" : APT_DETAIL;

    $scope.APT_ID = APT_DETAIL.split("@")[0];
    $scope.COMPANY_CODE = APT_DETAIL.split("@")[1];
    //$scope.DR_ID = $scope.DR_ID == undefined || $scope.DR_ID== "" ? 3384 : $scope.DR_ID;
   
    var loaderView = document.getElementById("loaderView");
    var dataView = document.getElementById("dataView");

    $scope.mPageTitle = " APPOINTMENT REQUEST FROM '"+$scope.COMPANY_CODE+"'";
   
    $scope.mAptTime = "00:00";
    $scope.mAptRemark = "00:00";
    $scope.drName ="";
    var corsIgnoreURL = "https://cors-anywhere.herokuapp.com/";
    //corsIgnoreURL="";

    $scope.populateRequest = function(){
        
        showLoader();
        //var data =  "sCompanyFolder="+$scope.COMPANY_CODE+"&iDR_ID="+$scope.DCR_ID+"&iDCR_ID="+$scope.DR_ID;

        var reqToSubmit = {
            method: 'POST',
            url: corsIgnoreURL+'http://test.cboinfotech.co.in/josapi/request/dataobj/DCRDRRemote/DCRDRRemotePopulate',
            headers: {"Company-Code":$scope.COMPANY_CODE,"Authorization":"JOSMOBILE abcxyzsdfsdrwewer53345345sdwerwer234234"},
            data: {"entityRows":[{"APPOINTMENT_ID":$scope.APT_ID}]}
        }

        $http(reqToSubmit).success(function (response) {
            hideLoader();
            if(response.status == "SUCCESS"){

                if (response.result.APPOINTMENT.length>0){

                    $scope.data = response.result.APPOINTMENT[0];
                    
                    $scope.mPageTitle = " APPOINTMENT REQUEST FROM '"+$scope.data["COMPANY_NAME"]+"'";
                    $scope.mMrName = $scope.data["PA_NAME"];
                    $scope.mMrMobile = $scope.data["MOBILE"];
                    $scope.mApDate = $scope.data["APPOINTMENT_DATE"];

                    var mAptTime = $scope.data["DR_TIME"]==""?($scope.data["TIME"]):($scope.data["DR_TIME"]);

                    $scope.mAptTime = get24String(mAptTime);

                    $scope.mDrName = $scope.data["DR_NAME"];
                    $scope.mDrMobile = $scope.data["DR_MOBILE"];
                    $scope.mAptRemark = $scope.data["DR_REMARK"];
                    $scope.ACCEPTANCE = "CONFIRM";
                    document.getElementById("acceptRadio").checked = true;


                    if($scope.mAptTime!=''){
                       // goToThankyou();
                    }
                    
                    
                }else{
                    alert("Data Not Found");
                }

              
            }else{
                alert(response.message);
            }
           
        }).error(function (data, status) {
            hideLoader();
            console.log('ERROR');
            $scope.data = data || "Request failed";
            $scope.status = status;
            alert("Status=" + status);
        });
        
    }
    if ( $scope.COMPANY_CODE != "" && $scope.APT_ID > 0 ) {
        
        $scope.populateRequest();   

    }else{

        hideLoader();
        alert("Incorrect Details");
    }

    $scope.confirmApointment = function(ACCEPTANCE,mAptTime){
        if(ACCEPTANCE==undefined){
            alert("Please Select Confirmtion Option");
            return;
        }
       
        showLoader();

        var reqToSubmit = {
            method: 'POST',
            url: corsIgnoreURL+'http://test.cboinfotech.co.in/josapi/request/dataobj/DCRDRRemote/DCRDRRemoteDRTimeCommit',
            headers: {"Company-Code":$scope.COMPANY_CODE,"Authorization":"JOSMOBILE abcxyzsdfsdrwewer53345345sdwerwer234234"},
            data: {"entityRows":[{"APPOINTMENT_ID":$scope.APT_ID,"DR_TIME":$scope.mAptTime,"DR_REMARK":$scope.mAptRemark,"ACCEPTANCE":ACCEPTANCE}]}
        }
        $http(reqToSubmit).success(function (response) {
            hideLoader();
            if(response.status == "SUCCESS"){

                alert("APPOINTMENT REQUEST HAS BEEN "+(ACCEPTANCE=="CONFIRM"?"ACCEPTED":"DECLINED"));
                //window.open("thank-you.html","_self");
                goToThankyou();
              
            }else{
                alert(response.message);
            }

        }).error(function (data, status) {
            console.log('ERROR');
            $scope.data = data || "Request failed";
            $scope.status = status;
            alert("Status=" + status);
        });
        
    }
    function goToThankyou(){
        sessionStorage.setItem("drName",$scope.drName);
        window.location.replace('thank-you');
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
    function get24String(time){
        //var time = $("#starttime").val();
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        //var AMPM = time.match(/\s(.*)$/)[1];
        //if(AMPM == "PM" && hours<12) hours = hours+12;
        //if(AMPM == "AM" && hours==12) hours = hours-12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if(hours<10) sHours = "0" + sHours;
        if(minutes<10) sMinutes = "0" + sMinutes;
        //alert(sHours + ":" + sMinutes);
        return (sHours + ":" + sMinutes);
    }

}]);