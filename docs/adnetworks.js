var dataIOS;
var dataAndroid;
var htmlString = "";
var arrayAppGradlePackages = [];
var combinedData;

function amrInitPage() {
    responseIOS = httpGet("https://admost.github.io/amrios/networks.json");
    responseAndroid = httpGet("https://admost.github.io/amrandroid/android_data.json?");
    dataAndroid = JSON.parse(responseAndroid);
    dataIOS = JSON.parse(responseIOS);
    combinedData = combineDatas();
    fillAdNetworkList();
    fillPodFileCode();
}

function combineDatas() {
    var datas = new Array();

    dataAndroid.ad_networks.forEach(element => {

        var name = element.name.toUpperCase();

        var adNetwork = {
            name: name,
            android: {
                name: element.name,
                status: element.status,
                adapter_version: element.adapter_version,
                app_gradle: element.app_gradle,
                project_gradle: element.project_gradle,
                android_manifest: element.android_manifest
            },
            ios: {
                SDKVersion: "",
                adapterName: "",
                adapterVersion: "",
                displayName: "",
                infoPlistKey: "",
                initParameterCount: 1,
                iosSupport: true,
                minTargetSdk: "",
                network: "",
                podVersion: "",
                skadnetworkIDS: [],
                status: false,
                supportedAdTypes: [],
                unitySupport: true
            }
        }

        var el = dataIOS.adNetworks.find((value, index) => value.network.includes(element.name));

        if (typeof el != "undefined") {

            adNetwork.ios.SDKVersion = el.SDKVersion;
            adNetwork.ios.adapterName = el.adapterName;
            adNetwork.ios.adapterVersion = el.adapterVersion;
            adNetwork.ios.displayName = el.displayName;
            adNetwork.ios.infoPlistKey = el.infoPlistKey;
            adNetwork.ios.initParameterCount = el.initParameterCount;
            adNetwork.ios.iosSupport = el.iosSupport;
            adNetwork.ios.minTargetSdk = el.minTargetSdk;
            adNetwork.ios.network = el.network;
            adNetwork.ios.podVersion = el.podVersion;
            adNetwork.ios.skadnetworkIDS = el.skadnetworkIDS;
            adNetwork.ios.status = el.status;
            adNetwork.ios.supportedAdTypes = el.supportedAdTypes;
            adNetwork.ios.unitySupport = el.unitySupport;
        }
        datas.push(adNetwork);

    });

    dataIOS.adNetworks.forEach(element => {

        var el = datas.find((value, index) => value.name.includes(element.network));

        if (typeof el != "undefined") {
            el.ios.SDKVersion = element.SDKVersion;
            el.ios.adapterName = element.adapterName;
            el.ios.adapterVersion = element.adapterVersion;
            el.ios.displayName = element.displayName;
            el.ios.infoPlistKey = element.infoPlistKey;
            el.ios.initParameterCount = element.initParameterCount;
            el.ios.iosSupport = element.iosSupport;
            el.ios.minTargetSdk = element.minTargetSdk;
            el.ios.network = element.network;
            el.ios.podVersion = element.podVersion;
            el.ios.skadnetworkIDS = element.skadnetworkIDS;
            el.ios.status = element.status;
            el.ios.supportedAdTypes = element.supportedAdTypes;
            el.ios.unitySupport = element.unitySupport;

        }
        else {
            var adNetwork = {
                name: element.network,
                android: {
                    app_gradle: element.app_gradle,
                    project_gradle: element.project_gradle,
                    status: element.status,
                    adapter_version: element.adapter_version,
                    android_manifest: element.android_manifest,
                },
                ios: {
                    SDKVersion: element.SDKVersion,
                    adapterName: element.adapterName,
                    adapterVersion: element.adapterVersion,
                    displayName: element.displayName,
                    infoPlistKey: element.infoPlistKey,
                    initParameterCount: element.initParameterCount,
                    iosSupport: element.iosSupport,
                    minTargetSdk: element.minTargetSdk,
                    network: element.network,
                    podVersion: element.podVersion,
                    skadnetworkIDS: element.skadnetworkIDS,
                    status: element.status,
                    supportedAdTypes: element.supportedAdTypes,
                    unitySupport: element.unitySupport,
                }
            }
            var el = dataAndroid.ad_networks.find((value, index) => value.name.toUpperCase() == element.name);

            if (typeof el != "undefined") {
                adNetwork.android.app_gradle = el.app_gradle;
                adNetwork.android.project_gradle = el.project_gradle;
                adNetwork.android.status = el.status;
                adNetwork.android.adapter_version = el.adapter_version;
                adNetwork.android.android_manifest = el.android_manifest;

            }

            datas.push(adNetwork);
        }

    });
    datas.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    return datas;
}


function toggleAdNetworkStatus(adNetworkName, isIOS) {
    var i = getPositionOfAdNetworkOnJSONArray(adNetworkName);
    if (isIOS) {
        let button = document.getElementById(adNetworkName + "_ios");
        if (combinedData[i].ios.status == true) {
            button.style.color = "#777";
            button.style.backgroundColor = "#ffffff";
            removeAdNetworkToPodFile(i);
        } else {
            button.style.backgroundColor = "#777";
            button.style.color = "#ffffff";
            addAdNetworkToPodFile(i);
        }
    }
    else {
        if (adNetworkName == "ADMOB-17.2.0" && combinedData.some(element => element.name == "ADMOB-19.7.0" && element.android.status == true)) {
            var j = getPositionOfAdNetworkOnJSONArray("ADMOB-19.7.0");
            removeAdNetworkFromCart(j);

            addAdNetworkToCart(i);

        } else if (adNetworkName == "ADMOB-19.7.0" && combinedData.some(element => element.name == "ADMOB-17.2.0" && element.android.status == true)) {
            var j = getPositionOfAdNetworkOnJSONArray("ADMOB-17.2.0");
            removeAdNetworkFromCart(j);

            addAdNetworkToCart(i);
        }
        else if (combinedData[i].android.status == true) {
            removeAdNetworkFromCart(i);
        } else {
            addAdNetworkToCart(i);
        }
    }
}

function addAdNetworkToPodFile(i) {
    combinedData[i].ios.status = true;
    fillPodFileCode();
    fillIos14FileCode();
}

function removeAdNetworkToPodFile(i) {
    combinedData[i].ios.status = false;
    fillPodFileCode();
    fillIos14FileCode();
}

function addAdNetworkToCart(i) {
    let button = document.getElementById(combinedData[i].name + "_android");
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "#ffffff";

    combinedData[i].android.status = true;
    fillAndroidFiles();
    fillWarningSections(combinedData[i].android);
}
function removeAdNetworkFromCart(i) {
    let button = document.getElementById(combinedData[i].name + "_android");
    button.style.color = "#4CAF50";
    button.style.backgroundColor = "#ffffff";

    combinedData[i].android.status = false;
    fillAndroidFiles();
    fillWarningSections(combinedData[i].android);

}
function fillAndroidFiles() {
    var repositories = "";
    var dependencies = "";
    var manifest = ""
    for (var i = 0; i < combinedData.length; i++) {
        if (combinedData[i].android.status == true) {
            if (typeof combinedData[i].android.project_gradle != "undefined") {
                combinedData[i].android.project_gradle.dependencies.forEach(element => {
                    if (element.maven) {
                        if (!repositories.includes(element.maven)) {
                            repositories = repositories + "maven { url '" + element.maven + "' }<br>";
                        }
                    } else if (element.google) {
                        if (!repositories.includes(element.google)) {
                            repositories = repositories + "google (" + element.google + ")<br>";
                        }
                    }
                });
            }

            if (typeof combinedData[i].android.app_gradle != "undefined") {
                combinedData[i].android.app_gradle.dependencies.forEach(element => {
                    if (!dependencies.includes(element.package)) {
                        if (element.transitive == true) {
                            dependencies = dependencies + "implementation('" + element.package + "') {<br>transitive = true<br>}<br>";
                        }
                        else if(combinedData[i].android.name !="AMR") {
                            dependencies = dependencies + "implementation '" + element.package + "' <br>";
                        }
                    }
                });
            }

            if (typeof combinedData[i].android.android_manifest != "undefined") {
                combinedData[i].android.android_manifest.application.forEach(element => {
                    if (!manifest.includes(element.package)) {
                        if (element.meta_data && !element.meta_data.name.includes("applovin")) {
                            manifest = manifest + "&lt;meta-data <br>android:name=\"" + element.meta_data.name + "\" android:value=\"" + element.meta_data.value + "\"/&gt;<br>\n";
                        }
                        else if (element.provider) {
                            manifest = manifest + "&lt;provider <br>android:name=\""
                                + element.provider.name
                                + "\" <br>android:authorities=\""
                                + element.provider.authorities
                                + "\" <br>android:grantUriPermissions=\""
                                + element.provider.grantUriPermissions
                                + "\" <br>android:exported=\""
                                + element.provider.exported
                                + "\"/&gt;<br>\n";
                        } else if (element.service) {
                            manifest = manifest + "&lt;service <br>"
                                + element.service.code
                                + "<br>&lt;/service&gt;\n"
                        }
                    }
                });
            }
        }
    }
    $('#code-androidmanifest').html(manifest);
    $('#code-projectgradle').html(repositories);
    $('#code-dependencies').html(dependencies);
}
function fillWarningSections(network) {
    if (network.name == "AdGem") {
        if (network.status == true) {
            $("#adgem_warning").css("display", "block");
        } else {
            $("#adgem_warning").css("display", "none");
        }
    } else if (network.name == "Nend") {
        if (network.status == true) {
            $("#nend_warning").css("display", "block");
        } else {
            $("#nend_warning").css("display", "none");
        }
    } else if (network.name == "Kidoz") {
        if (network.status == true) {
            $("#kidoz_warning").css("display", "block");
        } else {
            $("#kidoz_warning").css("display", "none");
        }
    }

}
function getPositionOfAdNetworkOnJSONArray(adNetworkName) {
    for (var i = 0; i < combinedData.length; i++) {
        if (combinedData[i].name === adNetworkName) {
            return i;
        }
    }
    return null;
}

function fillAdNetworkList() {
    htmlString = "";
    var amrel = `<tr>
    <td><span class="label label-danger">Required</span></td>
    <td>AMR</td>
    <td colspan="2" class="text-center">
       <button style="background-color:#2196F3; color:#ffff;" type="button" id="amr" class="btn btn-outline btn-block btn-primary"><i
                style="padding-right: 16px;" class="fa fa-android"></i>/<i
                style="padding-left: 16px;" class="fa fa-apple"></i></button>
    </td>
</tr>`;
    htmlString = amrel;

    combinedData.forEach(element => {
        if (element.name == "AMR") {
            return;
        }

        var iosButton = '<td class="text-right"></td>';
        var androidButton = '<td class="text-right"></td>';;
        if ((typeof element.ios.adapterVersion != "undefined") && element.ios.adapterVersion != "") {
            iosButton = `<td class="text-right">
            <button type="button" onclick="toggleAdNetworkStatus('`+ element.name + `',true);" id="` + element.name + `_ios" class="btn btn-outline btn-block btn-default">
            <i class="fa fa-apple"></i>&nbsp;&nbsp;`+ element.ios.adapterVersion + `</button>
        </td>`
        }
        if (typeof element.android.name != "undefined") {
            androidButton = `<td class="text-right">
            <button type="button" onclick="toggleAdNetworkStatus('`+ element.name + `',false);" id="` + element.name + `_android" class="btn btn-outline btn-block btn-success"><i
                class="fa fa-android"></i>&nbsp;&nbsp;`+ element.android.adapter_version + `</button>
            </td>`
        }
        htmlString = htmlString + `<tr><td><span class="label label-success">Optional</span></td>
        <td>`+ element.name + `</td>
        `+ androidButton + iosButton + `
      </tr>`;

    });
    $("#adnetwork-table tbody").append(htmlString);


}

function fillPodFileCode() {
    $('#file-pod').html("source'https://github.com/CocoaPods/Specs.git'\n# platform :ios, '9.0' \n\ntarget 'MyAwesomeTarget' do\nuse_frameworks! :linkage => :static\r");

    for (var i = 0; i < combinedData.length; i++) {
        if (combinedData[i].ios.adapterName && combinedData[i].ios.status == true && document.getElementById("file-pod").innerHTML.indexOf(combinedData[i].ios.adapterName) == -1 && combinedData[i].ios.adapterName != "AMRSDK") {
            $('#file-pod').append("pod \'" + combinedData[i].ios.adapterName + "\','~>" +combinedData[i].ios.podVersion+"'\n");
            
        }
        

    }
    $('#file-pod').append("\nend");
}

function fillIos14FileCode() {
    var finalValues = [];
    var selectedNetworks = [];

    for (var i = 1; i < dataIOS.adNetworks.length; i++) {
        if (combinedData[i].ios.status == true) {
            selectedNetworks.push(combinedData[i].ios);
            for (var j = 0; j < combinedData[i].ios.skadnetworkIDS.length; j++) {
                if (!includesUpper(finalValues, combinedData[i].ios.skadnetworkIDS[j])) {
                    finalValues.push(combinedData[i].ios.skadnetworkIDS[j]);
                }
            }
        }
    }

    if (selectedNetworks.length == 0) {
        $('#file-ios-14').text("PLEASE SELECT ONE OR MORE NETWORKS TO CREATE YOUR SKADNETWORK LIST.");
    } else {
        var finalXMLStr = "<key>SKAdNetworkItems</key>\n<array>\n";

        for (var i = 0; i < finalValues.length; i++) {
            finalXMLStr += "\t<dict>\n\t\t<key>SKAdNetworkIdentifier</key>\n\t\t<string>" + finalValues[i] + "</string>\n\t</dict>\n";
        }

        finalXMLStr += "</array>\n"

        $('#file-ios-14').text(finalXMLStr);
    }
}

function includesUpper(arr, item) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].toUpperCase() == item.toUpperCase()) return true;
    }
    return false;
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}