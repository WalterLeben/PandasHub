
const ABC="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function panda(t){

t=t.toUpperCase();

let out=[];

for(let c of t){

let p=ABC.indexOf(c)+1;

if(p>0){

let r=27-p;

if(p<=13) out.push(p*r);
else out.push((p*r)-r);

}

}

return out.join(" ");
}

function roman(n){

let map=[
[1000,"M"],
[900,"CM"],
[500,"D"],
[400,"CD"],
[100,"C"],
[90,"XC"],
[50,"L"],
[40,"XL"],
[10,"X"],
[9,"IX"],
[5,"V"],
[4,"IV"],
[1,"I"]
];

let s="";

for(let [v,r] of map){

while(n>=v){
s+=r;
n-=v;
}

}

return s;

}

function pandu(nums){

let a=nums.split(" ");

let first=parseInt(a[0]);

let rest=a.slice(1).join("|");

let b64=btoa(rest);

return roman(first)+"."+b64;

}

function aesECB(text,key){

return CryptoJS.AES.encrypt(
text,
CryptoJS.enc.Utf8.parse(key.padEnd(16,"0").slice(0,16)),
{
mode:CryptoJS.mode.ECB,
padding:CryptoJS.pad.Pkcs7
}
).toString();

}

function aesECBdec(text,key){

let d=CryptoJS.AES.decrypt(
text,
CryptoJS.enc.Utf8.parse(key.padEnd(16,"0").slice(0,16)),
{
mode:CryptoJS.mode.ECB,
padding:CryptoJS.pad.Pkcs7
}
);

return CryptoJS.enc.Utf8.stringify(d);

}

function rabbit(text,key){

return CryptoJS.Rabbit.encrypt(text,key).toString();

}

function rabbitDec(text,key){

let d=CryptoJS.Rabbit.decrypt(text,key);

return CryptoJS.enc.Utf8.stringify(d);

}

async function gcm(text,key){

let k=new TextEncoder().encode(key.padEnd(16,"0").slice(0,16));

let cryptoKey=await crypto.subtle.importKey(
"raw",
k,
{name:"AES-GCM"},
false,
["encrypt"]
);

let iv=crypto.getRandomValues(new Uint8Array(12));

let enc=new TextEncoder().encode(text);

let cipher=await crypto.subtle.encrypt(
{name:"AES-GCM",iv},
cryptoKey,
enc
);

return btoa(String.fromCharCode(...iv))+":"+btoa(String.fromCharCode(...new Uint8Array(cipher)));

}

async function gcmDec(data,key){

let p=data.split(":");

let iv=Uint8Array.from(atob(p[0]),c=>c.charCodeAt(0));

let cipher=Uint8Array.from(atob(p[1]),c=>c.charCodeAt(0));

let k=new TextEncoder().encode(key.padEnd(16,"0").slice(0,16));

let cryptoKey=await crypto.subtle.importKey(
"raw",
k,
{name:"AES-GCM"},
false,
["decrypt"]
);

let plain=await crypto.subtle.decrypt(
{name:"AES-GCM",iv},
cryptoKey,
cipher
);

return new TextDecoder().decode(plain);

}

async function encrypt(){

let t=document.getElementById("text").value;

let k1=document.getElementById("key1").value;

let k2=document.getElementById("key2").value;

let k3=document.getElementById("key3").value;

let p=panda(t);

let pd=pandu(p);

let e=aesECB(pd,k1);

let r=rabbit(e,k2);

let g=await gcm(r,k3);

document.getElementById("result").value=btoa(g);

}

async function decrypt(){

let t=document.getElementById("text").value;

let k1=document.getElementById("key1").value;

let k2=document.getElementById("key2").value;

let k3=document.getElementById("key3").value;

let g=atob(t);

let r=await gcmDec(g,k3);

let e=rabbitDec(r,k2);

let pd=aesECBdec(e,k1);

document.getElementById("result").value=pd;

}
