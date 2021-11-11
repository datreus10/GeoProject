require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",

], function (Map, MapView, Graphic, GraphicsLayer) {
    const Create = (typeofcreate, createposition) => {
        const result = {
            type: typeofcreate
        }
        switch (typeofcreate) {
            case "polyline":
                result.paths = createposition
                break;
            case "polygon":
                result.rings = createposition
                break;
            default: //point
                result.longitude = createposition[0];
                result.latitude = createposition[1];
                break;
        }
        return result;
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
    const GetData = async url => {
        const response = await fetch(url);
        return await response.json();
    }

    const DrawProvince = (data, uiTemplate) => {
        const popup = `Diện tích: ${data.area}\nDân số: ${data.population}`;
        graphicsLayer.add(
            BuildUI(Create("polygon", data.points),
                uiTemplate,
                attributesSetup(`Tỉnh ${data.name}`, popup), popupTemplateSetup()));
    }

    const DrawStreet = (data, uiTemplate) => {
        const popup = `Chiều dài: ${data.distance} km\nCác tỉnh đi qua: ${data.provinces}`;
        graphicsLayer.add(
            BuildUI(Create("polyline", data.points),
                uiTemplate,
                attributesSetup(`Đường ${data.name}`, popup), popupTemplateSetup()));
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

        // remote
        const polylineApi = await GetData("https://raw.githubusercontent.com/datreus10/GeoProject/master/data/tinh.json");
        //local
        //const polygonApi = await GetData("./data/tinh.json");

        // Bà Rịa - Vũng Tàu
        DrawProvince(polygonApi.data[0], SetUI("simple-fill", [249, 230, 136, 0.8], 1, [255, 255, 255], 0))
        // Cần Thơ
        DrawProvince(polygonApi.data[1], SetUI("simple-fill", [206, 245, 144, 0.8], 1, [255, 255, 255], 0))
        // Tiền Giang
        DrawProvince(polygonApi.data[2], SetUI("simple-fill", [227, 139, 79, 0.8], 1, [255, 255, 255], 1))
        // Đồng Tháp
        DrawProvince(polygonApi.data[3], SetUI("simple-fill", [181, 255, 232, 0.8], 1, [255, 255, 255], 1))
        // Long An
        DrawProvince(polygonApi.data[4], SetUI("simple-fill", [181, 222, 255, 0.8], 1, [255, 255, 255], 1))


        // Polyline Steet

        // remote
        const polylineApi = await GetData("https://raw.githubusercontent.com/datreus10/GeoProject/master/data/duong.json");
        //local
        //const polylineApi = await GetData("./data/duong.json");
        polylineApi.data.forEach(e=>DrawStreet(e,SetUI("simple-line", [240, 99, 72], 2)))


    })();


});