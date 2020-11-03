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


var rootController = angular.module("MyApp", []);
rootController.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

rootController.controller("MyCntrl", ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {

    var MeetingId = $location.search().mId;

    MeetingId = MeetingId == undefined || MeetingId.length < 10 ? "" : MeetingId;

    var mVsualAdsArray = [];
    var itemsFilesOfBrand = [];
    var itemsNamesOfBrand = [];

    var mActiveBrandId = 0;
    var mActiveItemIndex = 0;

    var DEFAUL_USER_PICTURE = "https://f0.pngfuel.com/png/304/305/man-with-formal-suit-illustration-png-clip-art.png";
    var mCompanyBasURL = "";
    var mVIDEO_URL = "";
    var mHTML_URL = "";
    var mCURRENT_ITEM = "IMAGE";
    var mVideoCurrStatus = "";
    var mVideoStartDuration = "";

    var mRootChannelName = "CBO-E-DETAILING";
    var mMeetingChannelName = (mRootChannelName + "/" + MeetingId);
    var mMeetingDbRfrence;
    var mMeetingDbSnapShot;
    var mCallSessionReference;
    var mCallSessionSnapshot;

    var loaderView = document.getElementById("loaderView");
    var dataView = document.getElementById("dataView");
    var mCompanyNameId = document.getElementById("mCompanyName");
    var mrPhotoImg = document.getElementById("mrPhotoImg");

    const player = new Plyr('#player');
    // Expose
    window.player = player;




    $scope.initFirebase = function() {

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

        mMeetingDbRfrence = firebase.database().ref(mMeetingChannelName + "/MEETING");
        mCallSessionReference = firebase.database().ref(mMeetingChannelName + "/CALL_SESSION");;


        mMeetingDbRfrence.on('value', function(snapshot) {
            mMeetingDbSnapShot = snapshot.val();
            mActiveItemIdSRN = snapshot.val()["ACTIVE_ITEM_SRN"] == undefined ? "1" : snapshot.val()["ACTIVE_ITEM_SRN"];
            mActiveBrandId = snapshot.val()["ACTIVE_BRAND_ID"];
            // mActiveItemId = snapshot.val()["ACTIVE_ITEM_ID"];

            $scope.mRepresentativName = snapshot.val()["PA_NAME"];
            var COMPANY_NAME = snapshot.val()["COMPANY_NAME"];
            var PA_NAME = snapshot.val()["PA_NAME"];
            var USER_PROFILE_PIC = snapshot.val()["USER_PROFILE_PIC"];


            mCompanyBasURL = snapshot.val()["COMPANY_WEBURL"];

            mVideoCurrStatus = snapshot.val()["VIDEO_CURR_STATUS"];
            mVideoStartDuration = snapshot.val()["VIDEO_START_DURATION"];
            mCURRENT_ITEM = snapshot.val()["CURRENT_ITEM"];

            if (COMPANY_NAME == undefined) {
                COMPANY_NAME = "";
            }
            if (PA_NAME == undefined) {
                PA_NAME = "";
            }

            if (USER_PROFILE_PIC == undefined) {
                USER_PROFILE_PIC = "";
            }

            if (mCompanyBasURL == undefined) {
                mCompanyBasURL = "";
            }

            mCompanyNameId.innerHTML = COMPANY_NAME.split(" ")[0] + " PRESENTATION BY '" + PA_NAME + "'";

            // default usr image
            mrPhotoImg.src = USER_PROFILE_PIC != '' ? USER_PROFILE_PIC : DEFAUL_USER_PICTURE;

            diplayImage(mActiveBrandId, mActiveItemIdSRN);

        });


        firebase.database().ref(mMeetingChannelName + "/ITEMS").orderByChild("SRN").on('value', function(snapshot) {

            hideLoader();
            //snapshot.sortBy("ISSELECTED","asc");


            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log(childKey);
                mVsualAdsArray.push(childData);
            });
            //mVsualAdsArray.reverse();
            mVsualAdsArray.sort((a, b) => parseInt(a["SRN"]) - parseInt(b["SRN"]));

            displayBrandWiseItems(mVsualAdsArray, mActiveBrandId, mActiveItemIdSRN);

        });

        mCallSessionReference.on('value', function(snapshot) {

            mCallSessionSnapshot = snapshot.val();

            if (mCallSessionSnapshot == null || mCallSessionSnapshot == undefined) {

                $("#cardView").hide();

                $("#visualView").removeClass("col-lg-8 p-0");
                $("#visualView").addClass("col-lg-10 p-0");


            } else {


                $("#cardView").show();

                $("#visualView").removeClass("col-lg-10 p-0");
                $("#visualView").addClass("col-lg-8 p-0");


                $("#APP_ID:text").val(snapshot.val()["APP_ID"]);
                $("#CHANNEL_NAME:text").val(snapshot.val()["CHANNEL_NAME"]);
                $("#CHANNEL_TOKEN:text").val(snapshot.val()["CHANNEL_TOKEN"]);


                if (snapshot.val()["DR_CALL_STATUS"] == "RINGING") {

                    Toast.info(snapshot.val()["DR_CALL_STATUS"]);

                    $("#join").show();

                } else if (snapshot.val()["DR_CALL_STATUS"] == "IN-CALL") {

                    Toast.info("JOINED");

                    $("#join").click();

                } else if (snapshot.val()["DR_CALL_STATUS"] == "ENDED") {

                    Toast.error(snapshot.val()["DR_CALL_STATUS"]);
                    resetCallActionButtons();

                } else {
                    //resetCallActionButtons();
                }


            }

            // mCallSessionReference.set({ APP_ID :});

        });


    }

    if (MeetingId != "") {

        showLoader();
        $scope.initFirebase();

    } else {

        hideLoader();

        alert("Incorrect/Expired Meeting Details");


    }

    function displayBrandWiseItems(mVsualAdsArray, brandId, itemSRN) {

        var horizontalRow = document.getElementById("horizontalRow");
        removeAllChildNodes(horizontalRow);
        for (var x = 0; x < mVsualAdsArray.length; x++) {

            // IMAGE CRATING BY JAVACRIPT 
            // var eachItem =  document.createElement("img");
            // eachItem.src = mVsualAdsArray[x]["image"];
            // eachItem.style.height = 50;
            // eachItem.style.width = 100;
            // eachItem.style.display = "inline-block";
            // eachItem.className = "img";

            var eachItem = document.createElement("button");
            eachItem.innerText = mVsualAdsArray[x]["BRAND_NAME"];
            eachItem.value = mVsualAdsArray[x]["BRAND_ID"];
            eachItem.style.height = 40;
            eachItem.style.width = 150;
            eachItem.style.marginLeft = 6;
            eachItem.style.marginRight = 6;

            if (brandId == parseInt(mVsualAdsArray[x]["BRAND_ID"])) {

                eachItem.className = "success-active horizontalItem";

            } else {

                var IS_SELECTED = (mVsualAdsArray[x]["ISSELECTED"] === 'true');

                if (IS_SELECTED) {

                    eachItem.className = "success-selected horizontalItem";

                } else {

                    eachItem.className = "success-non-selected horizontalItem";
                }
            }


            eachItem.style.display = "inline-block";
            eachItem.onclick = function() {

                for (var t = 0; t < horizontalRow.children.length; t++) {

                    if (horizontalRow.children[t].value == this.value) {

                        horizontalRow.children[t].className = "success-active horizontalItem";

                    } else {

                        var IS_SELECTED = (mVsualAdsArray[t]["ISSELECTED"] === 'true');

                        if (IS_SELECTED) {

                            horizontalRow.children[t].className = "success-selected horizontalItem";

                        } else {

                            horizontalRow.children[t].className = "success-non-selected horizontalItem";
                        }
                    }

                }

                switchBrand(this.value);
            };

            horizontalRow.append(eachItem);

        }

        diplayImage(brandId, itemSRN);
    }

    function diplayImage(brandIdStr, activeItemSRNStr) {

        var _replaceBaseUrlFrom = "http://test.cboinfotech.co.in";
        var _replaceBaseUrlTo = "https://seagullpharma1.net";

        var NextBTN = document.getElementById("NextBTN");
        var PreviousBTN = document.getElementById("PreviousBTN");

        if (mVsualAdsArray.length > 0) {

            var brandId = parseInt(brandIdStr);

            var brands = mVsualAdsArray.filter((x) => { return parseInt(x["BRAND_ID"]) == brandId; });

            var brandObject;
            var titleString = "";

            //var activeItemId=0;
            var activeImageURL = "";

            if (brands.length > 0) {

                brandObject = brands[0];
                mVIDEO_URL = brandObject["VIDEO_PATH"].split(",")[0];
                mHTML_URL = brandObject["HTML_PATH"].split(",")[0];
                itemsFilesOfBrand = brandObject["FILE_NAME"].split(",");
                itemsNamesOfBrand = brandObject["ITEM_NAME"].split(",");

                mActiveItemIndex = parseInt(activeItemSRNStr);

                titleString = itemsNamesOfBrand[mActiveItemIndex];
                activeImageURL = itemsFilesOfBrand[mActiveItemIndex];


                // titleString =  activeImageURL;

                if ((itemsFilesOfBrand.length - 1) == mActiveItemIndex) {

                    NextBTN.disabled = true;
                    PreviousBTN.disabled = false;

                } else if (mActiveItemIndex == 0) {

                    NextBTN.disabled = false;
                    PreviousBTN.disabled = true;

                } else {

                    NextBTN.disabled = false;
                    PreviousBTN.disabled = false;
                }

            } else {

                titleString = "Invalid Command";
                activeImageURL = "";
            }

            var titleAds = document.getElementById("titleAds");
            titleAds.innerHTML = titleString;


            switch (mCURRENT_ITEM) {
                case "VIDEO":

                    if (mVIDEO_URL.includes(_replaceBaseUrlFrom)) {

                        mCompanyBasURL = _replaceBaseUrlTo;

                        mVIDEO_URL = mVIDEO_URL.replace(_replaceBaseUrlFrom, mCompanyBasURL);
                    }



                    // if (activeImageURL.endsWith(".mp4") || activeImageURL.endsWith(".webm")) {
                    // }
                    $("#imageCnter").hide();
                    $("#videoCnter").show();
                    $("#visualAdDiv").removeClass("containerImg");

                    //alert("PLAYING...");

                    if (!player.source.includes(mVIDEO_URL)) {
                        player.source = getSource(mVIDEO_URL);
                    }

                    setTimeout(function() {

                        if (mVideoCurrStatus.includes("ENDED") || mVideoCurrStatus.includes("STOPPED")) {

                            player.stop();

                        } else if (mVideoCurrStatus.includes("PAUSE")) {

                            player.pause();

                        } else if (mVideoCurrStatus.includes("RESUME")) {

                            player.play();

                        } else {

                            player.currentTime = parseInt(mVideoStartDuration);

                            player.play();
                        }

                    }, 100);

                    document.addEventListener('DOMContentLoaded', () => { /* call back function */ });


                    break;
                case "HTML":

                    activeImageURL = mHTML_URL;

                    if (mHTML_URL.includes(_replaceBaseUrlFrom)) {

                        mCompanyBasURL = _replaceBaseUrlTo;

                        mHTML_URL = mHTML_URL.replace(_replaceBaseUrlFrom, mCompanyBasURL);
                    }




                    break;
                default:

                    if (activeImageURL.includes(_replaceBaseUrlFrom)) {

                        mCompanyBasURL = _replaceBaseUrlTo;

                        activeImageURL = activeImageURL.replace(_replaceBaseUrlFrom, mCompanyBasURL);
                    }


                    player.pause();
                    $("#imageCnter").show();
                    $("#videoCnter").hide();
                    $("#visualAdDiv").addClass("containerImg");
            }


            var visualAdDiv = document.getElementById("imageCnter");
            visualAdDiv.src = activeImageURL;


            //removeAllChildNodes(visualAdDiv);

            // var eachItem =  document.createElement("img");
            // eachItem.src = activeImageURL;
            // eachItem.style.height ="72%";
            // eachItem.style.width ="auto";
            // eachItem.className="img-responsive";
            // visualAdDiv.append(eachItem);

            //if(activeImageURL != "") {
            //alert(activeImageURL);
            //}


            var horizontalRow = document.getElementById("horizontalRow");

            for (var t = 0; t < horizontalRow.children.length; t++) {

                if (horizontalRow.children[t].value == brandIdStr) {

                    horizontalRow.children[t].className = "success-active horizontalItem";
                    horizontalRow.children[t].focus();

                } else {

                    var IS_SELECTED = (mVsualAdsArray[t]["ISSELECTED"] === 'true');

                    if (IS_SELECTED) {

                        horizontalRow.children[t].className = "success-selected horizontalItem";

                    } else {

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
        mMeetingDbRfrence.set({
            DCR_ID: mMeetingDbSnapShot["DCR_ID"],
            DR_ID: mMeetingDbSnapShot["DR_ID"],
            PA_ID: mMeetingDbSnapShot["PA_ID"],
            MANAGERES_ID: mMeetingDbSnapShot["MANAGERES_ID"],
            ACTIVE_ITEM_SRN: mActiveItemIndex + "",
            ACTIVE_ITEM_ID: mMeetingDbSnapShot["ACTIVE_ITEM_ID"],
            ACTIVE_BRAND_ID: brandId,
            //MEETING_DATE: mMeetingDbSnapShot["MEETING_DATE"],
            MEETING_TIME: mMeetingDbSnapShot["MEETING_TIME"]
        });
    }

    $scope.goPrevious = function() {
        if (mActiveItemIndex == 0) {
            return;
        }
        mActiveItemIndex = (parseInt(mActiveItemIndex) - 1);

        mMeetingDbRfrence.set({
            DCR_ID: mMeetingDbSnapShot["DCR_ID"],
            DR_ID: mMeetingDbSnapShot["DR_ID"],
            PA_ID: mMeetingDbSnapShot["PA_ID"],
            MANAGERES_ID: mMeetingDbSnapShot["MANAGERES_ID"],
            //ACTIVE_ITEM_SRN : itemsSRNOfBrand[mActiveItemIndex],
            ACTIVE_ITEM_SRN: "" + mActiveItemIndex,
            ACTIVE_ITEM_ID: mMeetingDbSnapShot["ACTIVE_ITEM_ID"],
            ACTIVE_BRAND_ID: mMeetingDbSnapShot["ACTIVE_BRAND_ID"],
            //MEETING_DATE: mMeetingDbSnapShot["MEETING_DATE"],
            MEETING_TIME: mMeetingDbSnapShot["MEETING_TIME"]
        });
    }


    $scope.goNext = function() {

        mActiveItemIndex = (parseInt(mActiveItemIndex) + 1);

        if (mActiveItemIndex >= itemsFilesOfBrand.length) {
            return;
        }

        mMeetingDbRfrence.set({
            DCR_ID: mMeetingDbSnapShot["DCR_ID"],
            DR_ID: mMeetingDbSnapShot["DR_ID"],
            PA_ID: mMeetingDbSnapShot["PA_ID"],
            MANAGERES_ID: mMeetingDbSnapShot["MANAGERES_ID"],
            //ACTIVE_ITEM_SRN : itemsSRNOfBrand[mActiveItemIndex],
            ACTIVE_ITEM_SRN: "" + mActiveItemIndex,
            ACTIVE_ITEM_ID: mMeetingDbSnapShot["ACTIVE_ITEM_ID"],
            ACTIVE_BRAND_ID: mMeetingDbSnapShot["ACTIVE_BRAND_ID"],
            // MEETING_DATE: mMeetingDbSnapShot["MEETING_DATE"],
            MEETING_TIME: mMeetingDbSnapShot["MEETING_TIME"]
        });
    }


    function updateCallSessionToDb(CALL_STATUS) {
        mCallSessionReference.set({
            APP_ID: mCallSessionSnapshot["APP_ID"],
            CHANNEL_NAME: mCallSessionSnapshot["CHANNEL_NAME"],
            CHANNEL_TOKEN: mCallSessionSnapshot["CHANNEL_TOKEN"],
            DR_CALL_STATUS: CALL_STATUS,
            DR_ONLINE_STATUS: "ONLINE",
        });
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



    // ==========================agora client here ========================
    //  video calling feature 


    var resolutions = [{
            name: "default",
            value: "default",
        },
        {
            name: "480p",
            value: "480p",
        },
        {
            name: "720p",
            value: "720p",
        },
        {
            name: "1080p",
            value: "1080p"
        }
    ]

    function Toastify(options) {
        M.toast({ html: options.text, classes: options.classes })
    }

    var Toast = {
        info: (msg) => {
            Toastify({
                text: msg,
                classes: "info-toast"
            })
        },
        notice: (msg) => {
            Toastify({
                text: msg,
                classes: "notice-toast"
            })
        },
        error: (msg) => {
            Toastify({
                text: msg,
                classes: "error-toast"
            })
        }
    }

    function validator(formData, fields) {
        var keys = Object.keys(formData)
        for (let key of keys) {
            if (fields.indexOf(key) != -1) {
                if (!formData[key]) {
                    Toast.error("Please Enter " + key)
                    return false
                }
            }
        }
        return true
    }

    function serializeformData() {
        var formData = $("#form").serializeArray()
        var obj = {}
        for (var item of formData) {
            var key = item.name
            var val = item.value
            obj[key] = val
        }
        return obj
    }

    function addView(id, show) {
        if (!$("#" + id)[0]) {
            $("<div/>", {
                id: "remote_video_panel_" + id,
                class: "video-view",
            }).appendTo("#video")

            $("<div/>", {
                id: "remote_video_" + id,
                class: "video-placeholder",
            }).appendTo("#remote_video_panel_" + id)

            $("<div/>", {
                id: "remote_video_info_" + id,
                class: "video-profile " + (show ? "" : "hide"),
            }).appendTo("#remote_video_panel_" + id)

            $("<div/>", {
                id: "video_autoplay_" + id,
                class: "autoplay-fallback hide",
            }).appendTo("#remote_video_panel_" + id)
        }
    }

    function removeView(id) {
        if ($("#remote_video_panel_" + id)[0]) {
            $("#remote_video_panel_" + id).remove()
        }
    }

    function getDevices(next) {
        AgoraRTC.getDevices(function(items) {
            items.filter(function(item) {
                    return ["audioinput", "videoinput"].indexOf(item.kind) !== -1
                })
                .map(function(item) {
                    return {
                        name: item.label,
                        value: item.deviceId,
                        kind: item.kind,
                    }
                })
            var videos = []
            var audios = []
            for (var i = 0; i < items.length; i++) {
                var item = items[i]
                if ("videoinput" == item.kind) {
                    var name = item.label
                    var value = item.deviceId
                    if (!name) {
                        name = "camera-" + videos.length
                    }
                    videos.push({
                        name: name,
                        value: value,
                        kind: item.kind
                    })
                }
                if ("audioinput" == item.kind) {
                    var name = item.label
                    var value = item.deviceId
                    if (!name) {
                        name = "microphone-" + audios.length
                    }
                    audios.push({
                        name: name,
                        value: value,
                        kind: item.kind
                    })
                }
            }
            next({ videos: videos, audios: audios })
        })
    }

    var rtc = {
        client: null,
        joined: false,
        published: false,
        localStream: null,
        remoteStreams: [],
        params: {}
    }

    function handleEvents(rtc) {
        // Occurs when an error message is reported and requires error handling.
        rtc.client.on("error", (err) => {
                console.log(err)
            })
            // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
        rtc.client.on("peer-leave", function(evt) {
                var id = evt.uid;
                console.log("id", evt)
                let streams = rtc.remoteStreams.filter(e => id !== e.getId())
                let peerStream = rtc.remoteStreams.find(e => id === e.getId())
                if (peerStream && peerStream.isPlaying()) {
                    peerStream.stop()
                }
                rtc.remoteStreams = streams
                if (id !== rtc.params.uid) {
                    removeView(id)
                }
                Toast.notice("peer leave")
                console.log("peer-leave", id)
            })
            // Occurs when the local stream is published.
        rtc.client.on("stream-published", function(evt) {
                //Toast.notice("stream published success")
                console.log("stream-published")

                Toast.info("Casting Your Camera to Remote User")
            })
            // Occurs when the remote stream is added.
        rtc.client.on("stream-added", function(evt) {
                var remoteStream = evt.stream
                var id = remoteStream.getId()
                Toast.info("stream-added uid: " + id)
                if (id !== rtc.params.uid) {
                    rtc.client.subscribe(remoteStream, function(err) {
                        console.log("stream subscribe failed", err)
                    })
                }
                console.log("stream-added remote-uid: ", id)
            })
            // Occurs when a user subscribes to a remote stream.
        rtc.client.on("stream-subscribed", function(evt) {
                var remoteStream = evt.stream
                var id = remoteStream.getId()
                rtc.remoteStreams.push(remoteStream)
                addView(id)
                remoteStream.play("remote_video_" + id)
                Toast.info("stream-subscribed remote-uid: " + id)
                console.log("stream-subscribed remote-uid: ", id)
            })
            // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
        rtc.client.on("stream-removed", function(evt) {
            var remoteStream = evt.stream
            var id = remoteStream.getId()
            Toast.info("stream-removed uid: " + id)
            if (remoteStream.isPlaying()) {
                remoteStream.stop()
            }
            rtc.remoteStreams = rtc.remoteStreams.filter(function(stream) {
                return stream.getId() !== id
            })
            removeView(id)
            console.log("stream-removed remote-uid: ", id)
        })
        rtc.client.on("onTokenPrivilegeWillExpire", function() {
            // After requesting a new token
            // rtc.client.renewToken(token);
            Toast.info("onTokenPrivilegeWillExpire")
            console.log("onTokenPrivilegeWillExpire")
        })
        rtc.client.on("onTokenPrivilegeDidExpire", function() {
            // After requesting a new token
            // client.renewToken(token);
            Toast.info("onTokenPrivilegeDidExpire")
            console.log("onTokenPrivilegeDidExpire")
        })
    }

    /**
     * rtc: rtc object
     * option: {
     *  mode: string, "live" | "rtc"
     *  codec: string, "h264" | "vp8"
     *  appID: string
     *  channel: string, channel name
     *  uid: number
     *  token; string,
     * }
     **/
    function join(rtc, option) {
        if (rtc.joined) {
            Toast.error("Your already joined")
            return;
        }


        // hiding and showing the join and leave button
        $("#join").hide();
        $("#leave").show();


        updateCallSessionToDb("IN-CALL");



        /**
         * A class defining the properties of the config parameter in the createClient method.
         * Note:
         *    Ensure that you do not leave mode and codec as empty.
         *    Ensure that you set these properties before calling Client.join.
         *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
         **/
        rtc.client = AgoraRTC.createClient({ mode: option.mode, codec: option.codec })

        rtc.params = option

        // handle AgoraRTC client event
        handleEvents(rtc)

        // init client
        rtc.client.init(option.appID, function() {
            console.log("init success")

            /**
             * Joins an AgoraRTC Channel
             * This method joins an AgoraRTC channel.
             * Parameters
             * tokenOrKey: string | null
             *    Low security requirements: Pass null as the parameter value.
             *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
             *  channel: string
             *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
             *    26 lowercase English letters a-z
             *    26 uppercase English letters A-Z
             *    10 numbers 0-9
             *    Space
             *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
             *  uid: number | null
             *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
             *   Note:
             *      All users in the same channel should have the same type (number or string) of uid.
             *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
             **/
            rtc.client.join(option.token ? option.token : null, option.channel, option.uid ? +option.uid : null, function(uid) {
                // Toast.notice("join channel: " + option.channel + " success, uid: " + uid)
                console.log("join channel: " + option.channel + " success, uid: " + uid)
                Toast.notice("Session Joined");

                rtc.joined = true

                rtc.params.uid = uid

                // create local stream
                rtc.localStream = AgoraRTC.createStream({
                    streamID: rtc.params.uid,
                    audio: true,
                    video: true,
                    screen: false,
                    microphoneId: option.microphoneId,
                    cameraId: option.cameraId
                })

                // initialize local stream. Callback function executed after intitialization is done
                rtc.localStream.init(function() {
                    console.log("init local stream success")
                        // play stream with html element id "local_stream"
                    rtc.localStream.play("local_stream")

                    // publish local stream
                    publish(rtc)
                }, function(err) {
                    Toast.error("stream init failed, please open console see more detail")
                    console.error("init local stream failed ", err)
                })
            }, function(err) {
                Toast.error("client join failed, please open console see more detail")
                console.error("client join failed", err)
            })
        }, (err) => {
            Toast.error("client init failed, please open console see more detail")
            console.error(err)
        })
    }

    function publish(rtc) {
        if (!rtc.client) {
            Toast.error("Please Join Room First")
            return
        }
        if (rtc.published) {
            Toast.error("Your already published")
            return
        }
        var oldState = rtc.published

        // publish localStream
        rtc.client.publish(rtc.localStream, function(err) {
                rtc.published = oldState
                console.log("publish failed")
                Toast.error("publish failed")
                console.error(err)
            })
            //Toast.info("publish")
        Toast.info("Streaming Camera...")

        // hiding and showing the publish  and unpublish button
        $("#unpublish").show();
        $("#publish").hide();


        rtc.published = true
    }

    function unpublish(rtc) {
        if (!rtc.client) {
            Toast.error("Please Join Room First")
            return
        }
        if (!rtc.published) {
            Toast.error("Your didn't publish")
            return
        }
        var oldState = rtc.published
        rtc.client.unpublish(rtc.localStream, function(err) {
            rtc.published = oldState
            console.log("unpublish failed")
                // Toast.error("unpublish failed")
            Toast.error("Failed to Stop Camera Streaming!!!")
            console.error(err)
        })
        Toast.info("Stopped Camera Streaming!!!")

        // hiding and showing the publish  and unpublish button
        $("#unpublish").hide();
        $("#publish").show();


        rtc.published = false
    }

    function leave(rtc) {
        if (!rtc.client) {
            Toast.error("Please Join First!")
            return
        }
        if (!rtc.joined) {
            Toast.error("You are not in channel")
            return
        }
        /**
         * Leaves an AgoraRTC Channel
         * This method enables a user to leave a channel.
         **/
        rtc.client.leave(function() {
            // stop stream
            if (rtc.localStream.isPlaying()) {
                rtc.localStream.stop()
            }
            // close stream
            rtc.localStream.close()
            for (let i = 0; i < rtc.remoteStreams.length; i++) {
                var stream = rtc.remoteStreams.shift()
                var id = stream.getId()
                if (stream.isPlaying()) {
                    stream.stop()
                }
                removeView(id)
            }
            rtc.localStream = null
            rtc.remoteStreams = []
            rtc.client = null
            console.log("client leaves channel success")
            rtc.published = false
            rtc.joined = false
            Toast.info("SESSION LEAVED!")


            // hiding and showing the join and leave button
            resetCallActionButtons();
            //$("#join").show();

            updateCallSessionToDb("CALL-ENDED");


        }, function(err) {
            console.log("channel leave failed")
            Toast.error("leave success")
            console.error(err)
        })
    }

    // This function automatically executes when a document is ready.
    $(function() {
        // This will fetch all the devices and will populate the UI for every device. (Audio and Video)
        getDevices(function(devices) {
            devices.audios.forEach(function(audio) {
                $("<option/>", {
                    value: audio.value,
                    text: audio.name,
                }).appendTo("#microphoneId")
            })
            devices.videos.forEach(function(video) {
                    $("<option/>", {
                        value: video.value,
                        text: video.name,
                    }).appendTo("#cameraId")
                })
                // To populate UI with different camera resolutions
            resolutions.forEach(function(resolution) {
                $("<option/>", {
                    value: resolution.value,
                    text: resolution.name
                }).appendTo("#cameraResolution")
            })
            M.AutoInit()
        })

        var fields = ["appID", "channel"]

        // This will start the join functions with all the configuration selected by the user.
        $("#join").on("click", function(e) {


                console.log("join")
                e.preventDefault();
                var params = serializeformData(); // Data is feteched and serilized from the form element.
                if (validator(params, fields)) {
                    join(rtc, params)

                }
            })
            // This publishes the video feed to Agora
        $("#publish").on("click", function(e) {
            console.log("publish")
            e.preventDefault()
            var params = serializeformData()
            if (validator(params, fields)) {
                publish(rtc)

            }
        });
        // Unpublishes the video feed from Agora
        $("#unpublish").on("click", function(e) {
            console.log("unpublish")
            e.preventDefault()
            var params = serializeformData()
            if (validator(params, fields)) {
                unpublish(rtc)

            }
        });
        // Leeaves the chanenl if someone clicks the leave button
        $("#leave").on("click", function(e) {
            console.log("leave")
            e.preventDefault()
            var params = serializeformData()
            if (validator(params, fields)) {
                leave(rtc)

            }
        })
    })



    function resetCallActionButtons() {
        // by default hide the leave button
        $("#join").hide();
        $("#leave").hide();
        $("#publish").hide();
        $("#unpublish").hide();
    }
    resetCallActionButtons();








    // ==========================plyr control here ========================
    // const player = new Plyr('#player');


    // // Expose
    // window.player = player;

    var isFirstVideo = true;

    // Bind event listener
    function on(selector, type, callback) {
        document.querySelector(selector).addEventListener(type, callback, false);
    }

    // Play
    on('.js-play', 'click', () => {
        player.play();
    });

    // Pause
    on('.js-pause', 'click', () => {
        player.pause();
    });

    // Stop
    on('.js-stop', 'click', () => {
        player.stop();
    });

    // Rewind
    on('.js-rewind', 'click', () => {
        player.rewind();
    });

    // Forward
    on('.js-forward', 'click', () => {
        player.forward();
    });


    // switch
    on('.js-switch', 'click', () => {

        player.source = getSource(isFirstVideo);
        player.play();
        isFirstVideo = !isFirstVideo;

    });


    on('.js-show-control', 'click', () => {
        showControls(true)

    });


    on('.js-hide-control', 'click', () => {

        showControls(false)
    });



    function showControls(shouldShowControls) {
        if (shouldShowControls) {
            $(".plyr__controls").show()
        } else {
            $(".plyr__controls").hide()
        }
    }

    function timeoutJump(durationInSecond) {
        setTimeout(function() {
            player.currentTime = durationInSecond;

        }, 5000);
    }


    function getSourceOLD(isFirstVideo) {
        return {
            type: 'video',
            title: 'Example title',
            sources: [{
                src: isFirstVideo ? 'https://vjs.zencdn.net/v/oceans.mp4' : 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
                type: 'video/webm',
                size: 720,
            }],
            poster: '/path/to/poster.jpg'
        };
    }

    function getSource(videoURL) {
        return {
            type: 'video',
            title: 'Example title',
            sources: [{
                src: videoURL,
                type: videoURL.endsWith(".mp4") ? 'video/mp4' : 'video/webm',
                size: 720,
            }],
            poster: '/path/to/poster.jpg'
        };
    }




    $("#switch-to-img").on("click", function(e) {

        $("#switch-to-img").hide();
        $("#switch-to-video").show();

        $("#imageCnter").show();
        $("#videoCnter").hide();
        player.pause();


    })

    $("#switch-to-video").on("click", function(e) {

        $("#switch-to-img").show();
        $("#switch-to-video").hide();

        $("#imageCnter").hide();
        $("#videoCnter").show();
        player.play();
    })

    // default
    $("#switch-to-img").hide();
    $("#switch-to-video").show();
    $("#imageCnter").show();
    $("#videoCnter").hide();
    $("#videoActionButtons").hide();

    $("#mCompanyName").click();




}]);