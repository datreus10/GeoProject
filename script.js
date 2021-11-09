require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",

], function (Map, MapView, Graphic, GraphicsLayer) {
    class Location {
        constructor(longitude, latitude) {
            this.longitude = longitude;
            this.latitude = latitude;
        }
        getLongitude() {
            return this.longitude;
        }
        getLatitude() {
            return this.latitude;
        }
    }
    const Create = (typeofcreate, createposition) => {
        let haveList = false;
        createposition.length == 1 ? haveList = false : haveList = true;
        let listlocation = [];

        if (!haveList) {
            return {
                type: typeofcreate,
                longitude: createposition[0].getLongitude(),
                latitude: createposition[0].getLatitude()
            }
        }
        else {
            createposition.forEach(position => {
                listlocation.push([position.getLongitude(), position.getLatitude()]);
            });
            if (typeofcreate == "polyline") {
                return {
                    type: typeofcreate,
                    paths: listlocation
                }
            }
            if (typeofcreate == "polygon") {
                return {
                    type: typeofcreate,
                    rings: listlocation,
                }
            }
        }
    }
    const SetUI = (typeofSetUI, colorSetUI, widthSetUI = 1, outlinecolorSetUI = colorSetUI, outlinewidthSetUI = 1) => {
        return {
            type: typeofSetUI,
            color: colorSetUI,
            width: widthSetUI,
            outline: {
                color: outlinecolorSetUI,
                width: outlinewidthSetUI
            }
        };
    }
    const popupTemplateSetup = () => {
        return {
            title: "{Name}",
            content: "{Description}"
        }
    }
    const attributesSetup = (Name, Description) => {
        return {
            Name: Name,
            Description: Description
        }
    }
    const BuildUI = (poly, simpleMarker, attributes, popupTemplate) => {
        return new Graphic({
            geometry: poly,
            symbol: simpleMarker,
            attributes: attributes,
            popupTemplate: popupTemplate
        });
    }

    //Helper function
    const ListLocationFromArray = array => array.map(e => new Location(e[0], e[1]))
    const GetData = async url => {
        const response = await fetch(url);
        return await response.json();
    }


    // Execute
    const map = new Map({
        basemap: "topo-vector" //Basemap layer service
    });
    const view = new MapView({
        map: map,
        center: [106.736361, 10.872751],
        zoom: 13,
        container: "viewDiv"
    });
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Main function
    (async () => {

        // Polygon Province
        const polygonApi = await GetData("https://raw.githubusercontent.com/datreus10/GeoProject/master/data/diaphantinh.json");

        const polyCanTho = polygonApi.features[12].geometry.coordinates;
        polyCanTho.forEach(e => {
            e.forEach(e1 => {
                graphicsLayer.add(
                    BuildUI(Create("polygon", ListLocationFromArray(e1)),
                        SetUI("simple-fill", [206, 245, 144, 0.8], 1, [255, 255, 255], 1),
                        attributesSetup("Mô tả", "Đây là hình đa diện"), popupTemplateSetup()));
            })
        })

        const polyBRVT = polygonApi.features[1].geometry.coordinates;
        polyBRVT.forEach(e => {
            e.forEach(e1 => {
                graphicsLayer.add(
                    BuildUI(Create("polygon", ListLocationFromArray(e1)),
                        SetUI("simple-fill", [249, 230, 136, 0.8], 1, [255, 255, 255], 1),
                        attributesSetup("Mô tả", "Đây là hình đa diện"), popupTemplateSetup()));
            })
        })

        const polyLongAn = polygonApi.features[37].geometry.coordinates;
        polyLongAn.forEach(e => {
            e.forEach(e1 => {
                graphicsLayer.add(
                    BuildUI(Create("polygon", ListLocationFromArray(e1)),
                        SetUI("simple-fill", [181, 222, 255, 0.8], 1, [255, 255, 255], 1),
                        attributesSetup("Mô tả", "Đây là hình đa diện"), popupTemplateSetup()));
            })
        })

        const polyDongThap = polygonApi.features[19].geometry.coordinates;
        polyDongThap.forEach(e => {
            e.forEach(e1 => {
                graphicsLayer.add(
                    BuildUI(Create("polygon", ListLocationFromArray(e1)),
                        SetUI("simple-fill", [181, 255, 232, 0.8], 1, [255, 255, 255], 1),
                        attributesSetup("Mô tả", "Đây là hình đa diện"), popupTemplateSetup()));
            })
        })

        const polyTienGiang = polygonApi.features[56].geometry.coordinates;
        polyTienGiang.forEach(e => {
            e.forEach(e1 => {
                graphicsLayer.add(
                    BuildUI(Create("polygon", ListLocationFromArray(e1)),
                        SetUI("simple-fill", [227, 139, 79, 0.8], 1, [255, 255, 255], 1),
                        attributesSetup("Mô tả", "Đây là hình đa diện"), popupTemplateSetup()));
            })
        })


        // Polyline street
        const polylineApi = await GetData("https://raw.githubusercontent.com/datreus10/GeoProject/master/data/duong.json");
        polylineApi.data.forEach(e=>{
            graphicsLayer.add(BuildUI(
                Create("polyline", ListLocationFromArray(e.points)),
                SetUI("simple-line", [240, 99, 72], 2),
                attributesSetup("Mô tả", "Đây là polyline"), popupTemplateSetup()));
        })

    })();
});