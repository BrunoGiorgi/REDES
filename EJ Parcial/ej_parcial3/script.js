(async function(){
  const overlay = document.getElementById('overlay');
  const btnAbrir = document.getElementById('btnAbrir');
  const btnCerrar = document.getElementById('btnCerrar');
  const selectIVA = document.getElementById('condicionIVA');
  const modalForm = document.getElementById('modalForm');

  // Cargar IVA
  try{
    const r = await fetch('iva.json', {cache:'no-store'});
    if(!r.ok) throw new Error('Error al cargar iva.json: ' + r.status);
    const iva = await r.json();
    selectIVA.innerHTML = '<option value="">-- Seleccione --</option>';
    iva.forEach(i => {
      const o = document.createElement('option');
      o.value = i.Codigo;
      o.textContent = `${i.Descripcion} (${i.Porcentaje}%)`;
      selectIVA.appendChild(o);
    });
  }catch(e){
    selectIVA.innerHTML = '<option value="">No se pudo cargar IVA</option>';
    console.error(e);
  }

  function openModal(){
    alert(`Ancho ventana: ${window.innerWidth}`);
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden'; // evitar scroll fondo
  }

  function closeModal(){
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    modalForm.reset();
  }

  btnAbrir.addEventListener('click', openModal);
  btnCerrar.addEventListener('click', closeModal);

  overlay.addEventListener('click', (ev)=>{
    if(ev.target === overlay) closeModal(); // click en fondo cierra modal
  });

  modalForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Formulario enviado (solo en memoria).');
    closeModal();
  });
})();