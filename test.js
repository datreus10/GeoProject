const revarr = arr => {
    if (arr.length == 1) return arr[0]
    return arr.map(e => revarr(e))
}

const getdata = async (url) => {
    const response = await fetch(url);
    var data = await response.json();
    const inputData = data[0].geojson.coordinates
    const outData = revarr(inputData)
    return inputData.length == 1 ? [outData] : outData

}

const getResult = async keywords => {
    let result = []
    for (const keyword of keywords) {
        result = result.concat(await getdata(`https://nominatim.openstreetmap.org/search.php?q=${keyword}&polygon_geojson=1&format=json`))
    }
    document.querySelector("#text").innerHTML = JSON.stringify(result)
}


const keywords = ["Can Tho city"];
getResult(keywords)

// link code pen: https://codepen.io/datreus10/pen/RwZyjLW


