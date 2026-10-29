const genres=['Comedy','Romance','Thriller','Drama','Action'];
const moods=['Light & easy','Feel-good','Balanced','Serious','Intense'];
// Mood levels are subjective editorial tags, not age/content ratings.
const catalog=[
 ['Comedy',1,'Paddington 2','The Grand Budapest Hotel','School of Rock'],['Comedy',2,'Clueless','Legally Blonde','The Princess Bride'],['Comedy',3,'Knives Out','The Nice Guys','Groundhog Day'],['Comedy',4,'Jojo Rabbit','The Truman Show','In Bruges'],['Comedy',5,'The Death of Stalin','Dr. Strangelove','The Menu'],
 ['Romance',1,'Notting Hill','You’ve Got Mail','Roman Holiday'],['Romance',2,'10 Things I Hate About You','Crazy Rich Asians','To All the Boys I’ve Loved Before'],['Romance',3,'Pride & Prejudice','Before Sunrise','La La Land'],['Romance',4,'Past Lives','Atonement','Eternal Sunshine of the Spotless Mind'],['Romance',5,'Blue Valentine','Portrait of a Lady on Fire','Revolutionary Road'],
 ['Thriller',1,'Charade','The Man Who Knew Too Little','The Pink Panther'],['Thriller',2,'Rear Window','North by Northwest','Catch Me If You Can'],['Thriller',3,'Searching','The Fugitive','Inside Man'],['Thriller',4,'Gone Girl','Shutter Island','Zodiac'],['Thriller',5,'Se7en','Prisoners','Nightcrawler'],
 ['Drama',1,'The Hundred-Foot Journey','Mrs. Harris Goes to Paris','A Beautiful Day in the Neighborhood'],['Drama',2,'Hidden Figures','Little Women','The Pursuit of Happyness'],['Drama',3,'Good Will Hunting','The Social Network','The Shawshank Redemption'],['Drama',4,'Whiplash','Moonlight','The Father'],['Drama',5,'Manchester by the Sea','Requiem for a Dream','There Will Be Blood'],
 ['Action',1,'The Incredibles','Big Hero 6','Kung Fu Panda'],['Action',2,'Spider-Man: Into the Spider-Verse','The Mummy','Guardians of the Galaxy'],['Action',3,'Top Gun: Maverick','Mission: Impossible – Ghost Protocol','The Bourne Identity'],['Action',4,'The Dark Knight','Mad Max: Fury Road','Casino Royale'],['Action',5,'John Wick','The Raid','Logan']
].flatMap(([genre,mood,...titles])=>titles.map(title=>({id:title,genre,mood,title})));
let genre=0,mood=3,busy=false,seen=new Set(),lastCount=null,wasConnected=false,center=2048,latched=false,lastStep=0,lastPot=null,lastData=null;
const $=id=>document.getElementById(id);
const candidates=()=>catalog.filter(m=>m.genre===genres[genre]&&m.mood===mood&&!seen.has(m.id));
function refresh(){
 $('genres').replaceChildren(...genres.map((g,i)=>{let b=document.createElement('button');b.textContent=g;b.className=i===genre?'selected':'';b.setAttribute('aria-pressed',i===genre);b.onclick=()=>{if(!busy){genre=i;refresh();}};return b;}));
 $('mood').value=mood;$('moodName').textContent=moods[mood-1];$('moodNumber').textContent=mood+' / 5';
 $('remaining').textContent=candidates().length+' FILMS LEFT';$('history').textContent=seen.size+' films discovered this session';
}
function pickMovie(pool){return pool[Math.floor(Math.random()*pool.length)];}
function show(movie){$('title').textContent=movie.title;$('details').textContent=movie.genre+' · '+moods[movie.mood-1];}
function spin(){
 if(busy)return;
 const pool=candidates();
 if(!pool.length){$('message').textContent='You’ve seen every pick in this mood. Change genre or mood, or start a new session.';return;}
 busy=true;$('spin').disabled=true;$('mood').disabled=true;$('resultLabel').textContent='FINDING YOUR FILM';$('message').textContent='A little chance. A lot of possibility.';
 const chosen=pickMovie(pool);let step=0;
 function tick(){show(pickMovie(pool));step++;
  if(step<18){setTimeout(tick,45+step*step*1.5);return;}
  show(chosen);seen.add(chosen.id);busy=false;$('spin').disabled=false;$('mood').disabled=false;$('resultLabel').textContent='TONIGHT’S FEATURE';$('filmTag').textContent='THE CHOICE IS YOURS';$('spin').innerHTML='Find another film <span>↗</span>';$('message').textContent='Already watched it? Spin again for a fresh pick.';refresh();
 }tick();
}
$('spin').onclick=spin;$('mood').oninput=e=>{if(!busy){mood=Number(e.target.value);refresh();}};
$('reset').onclick=()=>{if(busy)return;seen.clear();$('message').textContent='New session. Every film is back in the mix.';refresh();};
$('calibrate').onclick=()=>{if(lastData){center=lastData.x;latched=false;$('message').textContent='Joystick center saved.';}};
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='BUTTON'||busy||e.repeat)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();if(e.key===' ')spin();else if(e.key==='ArrowLeft'){genre=(genre+4)%5;refresh();}else if(e.key==='ArrowRight'){genre=(genre+1)%5;refresh();}else if(e.key==='ArrowUp'){mood=Math.min(5,mood+1);refresh();}else if(e.key==='ArrowDown'){mood=Math.max(1,mood-1);refresh();}});
async function poll(){
 try{
  const d=await(await fetch('/api/state',{cache:'no-store'})).json();lastData=d;
  $('connection').textContent=d.connected?'● Controller connected':'○ Keyboard mode — controller offline';
  $('raw').textContent=d.connected?`Joystick X ${d.x} · Y ${d.y} · Pot ${d.pot} · Button ${d.button} · Presses ${d.presses}`:d.error;
  if(d.connected){
   if(!wasConnected){lastCount=d.presses;lastPot=null;center=d.x;latched=false;}
   if(!busy){
    const delta=d.x-center,now=performance.now();
    if(Math.abs(delta)<400)latched=false;
    if(Math.abs(delta)>900&&(!latched||now-lastStep>550)){genre=(genre+(delta>0?1:4))%5;latched=true;lastStep=now;refresh();}
    if(lastPot===null||Math.abs(d.pot-lastPot)>100){
     let next=Math.min(5,Math.floor(d.pot/819.2)+1);
     if(next!==mood){mood=next;refresh();}lastPot=d.pot;
    }
   }
   if(lastCount!==null&&d.presses>lastCount)spin();lastCount=d.presses;
  }else {lastCount=null;lastPot=null;}
  wasConnected=d.connected;
 }catch(e){$('connection').textContent='○ Local server unavailable';wasConnected=false;lastCount=null;}
 setTimeout(poll,55);
}
refresh();poll();
// p5.js draws a restrained film-reel motif behind the accessible HTML interface.
new p5(p=>{p.setup=()=>{const e=$('art');p.createCanvas(e.clientWidth,e.clientHeight).parent(e);p.frameRate(30);};p.draw=()=>{p.clear();p.push();p.translate(p.width/2,p.height*.38);p.rotate(busy?p.millis()/900:0);p.noFill();p.stroke(198,173,124,65);p.strokeWeight(1);p.circle(0,0,340);p.circle(0,0,300);for(let i=0;i<5;i++){let a=i*p.TWO_PI/5;p.circle(Math.cos(a)*100,Math.sin(a)*100,65);}p.circle(0,0,36);p.pop();};p.windowResized=()=>p.resizeCanvas($('art').clientWidth,$('art').clientHeight);});
