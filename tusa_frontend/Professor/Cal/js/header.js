fetch('http://www.cs.transy.edu/TUSA/Professor/Header/header.html')
.then(res => res.text())
.then(text => {
    let oldelem = document.querySelector("script#replace_with_header");
    let newelem = document.createElement("div");
    newelem.innerHTML = text;
    oldelem.parentNode.replaceChild(newelem,oldelem);
})
