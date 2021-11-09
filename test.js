const getdata = async (url) => {
    const response = await fetch(url);
    var data = await response.json();
    data.elements.forEach(e => {
            document.querySelector("#text").innerHTML += `[${e.lon},${e.lat}],`
    })
}

getdata("https://www.openstreetmap.org/api/0.6/relation/12340803/full.json")