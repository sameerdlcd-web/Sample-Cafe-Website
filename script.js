// Hotspot Cafe v2 — WhatsApp order-request flow. Prices intentionally remain unlisted
// until the owner supplies a verified menu; no fabricated totals or payment-success states.
const PRODUCTS={
  schezwan:{name:'Schezwan Maggi'},
  friedrice:{name:'Fried Rice'},
  chai:{name:'Tea / Chai'},
  coffee:{name:'Coffee'}
};
const WHATSAPP_NUMBER='918160380491';
let cart={};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const drawer=$('#cartDrawer'),backdrop=$('#cartBackdrop'),modal=$('#checkoutBackdrop');
function itemCount(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function updateCart(){
  $('#cartCount').textContent=itemCount();
  $('#cartSubtotal').textContent='Price confirmed by cafe';
  $('#checkoutTotal').textContent=itemCount()+' item'+(itemCount()===1?'':'s');
  $('#checkoutBtn').disabled=itemCount()===0;
  const entries=Object.entries(cart).filter(([,q])=>q>0);
  $('#cartItems').innerHTML=entries.length?entries.map(([id,q])=>`<div class="cart-row"><div><h4>${PRODUCTS[id].name}</h4><small>Price to be confirmed</small></div><div class="qty-control"><button data-qty="${id}" data-delta="-1" aria-label="Remove one">−</button><b>${q}</b><button data-qty="${id}" data-delta="1" aria-label="Add one">+</button></div></div>`).join(''):`<div class="empty-cart"><span>✳</span><h4>Your bag is taking a break.</h4><p>Add something delicious from the menu.</p></div>`;
}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
function openCart(){drawer.classList.add('open');backdrop.classList.add('show');drawer.setAttribute('aria-hidden','false')}
function closeCart(){drawer.classList.remove('open');backdrop.classList.remove('show');drawer.setAttribute('aria-hidden','true')}
$$('.add-btn').forEach(b=>b.addEventListener('click',()=>{cart[b.dataset.id]=(cart[b.dataset.id]||0)+1;updateCart();toast(PRODUCTS[b.dataset.id].name+' added to your bag')}));
$('#cartItems').addEventListener('click',e=>{const b=e.target.closest('[data-qty]');if(!b)return;const id=b.dataset.qty;cart[id]=(cart[id]||0)+Number(b.dataset.delta);if(cart[id]<=0)delete cart[id];updateCart()});
$('#cartOpen').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);backdrop.addEventListener('click',closeCart);
$('#checkoutBtn').addEventListener('click',()=>{closeCart();modal.classList.add('show')});
$('#checkoutClose').addEventListener('click',()=>modal.classList.remove('show'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
$('#fulfilment').addEventListener('change',e=>$('#addressField').classList.toggle('hidden',e.target.value!=='Delivery'));
$('#checkoutForm').addEventListener('submit',e=>{
  e.preventDefault();
  const f=new FormData(e.currentTarget);
  const fulfilment=f.get('fulfilment');
  const address=(f.get('address')||'').trim();
  if(fulfilment==='Delivery'&&!address){toast('Please enter your delivery address');return}
  const lines=Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>`• ${PRODUCTS[id].name} × ${q}`);
  const message=[
    'Hello Hotspot Cafe! I would like to place an order.',
    '',`Name: ${f.get('name')}`,`Customer phone: ${f.get('phone')}`,
    `Order type: ${fulfilment}`,
    ...(fulfilment==='Delivery'?[`Delivery address: ${address}`]:[]),
    '', 'Items:',...lines,'',
    'Please confirm availability, item prices, applicable taxes/packaging and delivery charges before I pay.',
    `Notes: ${(f.get('notes')||'None').trim()}`
  ].join('\n');
  const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url,'_blank','noopener,noreferrer');
  modal.classList.remove('show');
  toast('WhatsApp order request prepared. Wait for cafe confirmation.');
});
$$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');filterMenu()}));
$('#menuSearch').addEventListener('input',filterMenu);
function filterMenu(){const cat=$('.filter.active').dataset.filter,query=$('#menuSearch').value.toLowerCase();$$('.food-card').forEach(card=>{const matchCat=cat==='all'||card.dataset.category===cat;const matchText=card.dataset.name.toLowerCase().includes(query);card.classList.toggle('hidden',!(matchCat&&matchText))})}
$('#year').textContent=new Date().getFullYear();
const observer=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('visible');observer.unobserve(item.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));
$('#mobileMenu').addEventListener('click',()=>{const nav=$('.desktop-nav'),shown=nav.style.display==='flex';nav.style.display=shown?'none':'flex';if(!shown){nav.style.position='absolute';nav.style.top='70px';nav.style.left='0';nav.style.right='0';nav.style.padding='22px 7%';nav.style.background='var(--paper)';nav.style.flexDirection='column';nav.style.zIndex='10'}});
updateCart();
