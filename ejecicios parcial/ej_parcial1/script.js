(async function(){
  // Utiles
  const $ = id => document.getElementById(id);
  const formatMoney = v => (typeof v === 'number') ? v.toLocaleString('es-AR',{style:'currency',currency:'ARS'}) : v;

  // Elementos
  const selectIVA = $('condicionIVA');
  const preview = $('clientesPreview');
  const form = $('clienteForm');
  const btnReset = $('btnReset');

  // Cargar JSONs locales (necesita servidor: http://localhost/...)
  let ivaList = [];
  let clientes = [];

  async function loadJSON(path){
    const res = await fetch(path, {cache:'no-store'});
    if(!res.ok) throw new Error('No se pudo cargar '+path);
    return res.json();
  }

  try{
    ivaList = await loadJSON('iva.json');
    clientes = await loadJSON('clientes.json');
  }catch(err){
    console.error(err);
    preview.textContent = 'Error cargando archivos JSON. Asegurate de servir los archivos desde http://localhost/...';
    return;
  }

  // Poblar select IVA
  ivaList.forEach(i => {
    const opt = document.createElement('option');
    opt.value = i.Codigo;
    opt.textContent = '${i.Descripcion} (${i.Porcentaje}%)';
    selectIVA.appendChild(opt);
  });

  // Mostrar previsualizacion de clientes
  function renderPreview(){
    preview.innerHTML = '';
    if(!clientes.length){ preview.textContent = 'No hay clientes'; return; }
    clientes.forEach(c=>{
      const d = document.createElement('div');
      d.className = 'client-item';
      d.innerHTML = `
        <div><span class="key">${c.CodCliente}</span> — ${c.RazonSocial}</div>
        <div style="font-size:0.9rem;color:#555">CUIT: ${c.CUIT} · IVA: ${c.CondicionIVA} · Inicio: ${c.FechaInicio}</div>
        <div style="margin-top:6px">${formatMoney(c.SaldoCuentaCorriente)} — <a target="_blank" href="${c.UltimoBalance}">Balance</a></div>
      `;
      preview.appendChild(d);
    });
  }

  renderPreview();

  // Enviar (no persiste en archivos, solo memoria)
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const nuevo = {
      CodCliente: $('codCliente').value.trim(),
      RazonSocial: $('razonSocial').value.trim(),
      CUIT: $('cuit').value.trim(),
      CondicionIVA: $('condicionIVA').value,
      FechaInicio: $('fechaInicio').value,
      SaldoCuentaCorriente: parseFloat($('saldo').value) || 0,
      UltimoBalance: $('ultimoBalance').value.trim() || ''
    };

    if(!nuevo.CodCliente || !nuevo.RazonSocial || !nuevo.CUIT || !nuevo.CondicionIVA || !nuevo.FechaInicio){
      alert('Completá los campos obligatorios');
      return;
    }

    // Comprobar duplicado simple
    if(clientes.some(c=>c.CodCliente === nuevo.CodCliente)){
      if(!confirm('El código ya existe. Deseas agregar otro con el mismo código?')) return;
    }

    clientes.push(nuevo);
    renderPreview();
    alert('Cliente agregado (en memoria). Para persistir necesitás backend o editar el JSON manualmente.');
    form.reset();
  });

  btnReset.addEventListener('click', ()=> form.reset());

})();