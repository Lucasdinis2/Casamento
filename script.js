const target=new Date("2027-04-10T16:00:00-03:00").getTime();
function tick(){let x=Math.max(0,target-Date.now()),d=Math.floor(x/86400000),h=Math.floor(x%86400000/3600000),m=Math.floor(x%3600000/60000),s=Math.floor(x%60000/1000);document.getElementById("d").textContent=String(d).padStart(3,"0");document.getElementById("h").textContent=String(h).padStart(2,"0");document.getElementById("m").textContent=String(m).padStart(2,"0");document.getElementById("s").textContent=String(s).padStart(2,"0")}tick();setInterval(tick,1000);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")}),{threshold:.12});document.querySelectorAll(".reveal").forEach(e=>io.observe(e));

const opener=document.getElementById("openEnvelope");
const opening=document.getElementById("opening");
const openInvite=()=>{
  if(document.body.classList.contains("unlocked")) return;
  opener.classList.add("opening-now");
  document.body.classList.add("unlocked");
  setTimeout(()=>opening.classList.add("opened"),1200);
  setTimeout(()=>document.body.classList.remove("locked"),1500);
};
opener.addEventListener("click",openInvite);
