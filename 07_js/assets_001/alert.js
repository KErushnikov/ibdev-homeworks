b = document.getElementsByTagName("button")[0];
b.onclick = null;
handler = function(){
    alert("pwned");
};
b.addEventListener("click", handler, false);