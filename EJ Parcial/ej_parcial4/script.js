// Ej4 - Tabla + Modal form
(async function(){
    const $ = id => document.getElementById(id);
    const tbody = $('tbody');
    const btnCargar = $('btnCargar');
    const btnVaciar = $('btnVaciar');
    const btnForm = $('btnForm');
    const overlay = $('overlay');
    const formModal = $('formModal');
    const closeModal = $('closeModal');
    const selectIVA = $('condicionIVA');

    let clientes = [];
    let ivaMap = new Map();

    async function loadJSON(path){
      const res = await fetch(path, {cache:'no-store'});
      if(!res.ok) throw new Error('Error cargando JSON: '+path);
      return res.json();
    }

    try{
      const iva = await loadJSON('iva.json');
      iva.forEach(i => ivaMap.set(i.Codigo, i));
      clientes = await loadJSON('clientes.json');
    }catch(e){
      console.error(e);
      alert('Error al cargar JSON. Asegurate de servir con http://localhost/...');
    }

    // poblar select IVA en modal
    function fillIVASelect(){
      selectIVA.innerHTML = '<option value="">-- Seleccione --</option>';
      ivaMap.forEach(v => {
        const o = document.createElement('option');
        o.value = v.Codigo;
        o.textContent = `${v.Descripcion} (${v.Porcentaje}%)`;
        selectIVA.appendChild(o);
      });
    }
    fillIVASelect();

    function renderTabla(list){
      tbody.innerHTML = '';
      if(!list.length){
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" style="text-align:center;padding:22px;color:#666">No hay registros</td>';
        tbody.appendChild(tr);
        return;
      }
      list.forEach(c=>{
        const iva = ivaMap.get(c.CondicionIVA);
        const ivaLabel = iva ? `${iva.Descripcion} (${iva.Porcentaje}%)` : c.CondicionIVA;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.CodCliente}</td>
            <td>${c.RazonSocial}</td>
            <td>${c.CUIT}</td>
            <td>${ivaLabel}</td>
            <td>${c.FechaInicio}</td>
            <td style="text-align:right">${Number(c.SaldoCuentaCorriente || 0).toLocaleString('es-AR',{style:'currency',currency:'ARS'})}</td>
            <td><a href="${c.UltimoBalance}" target="_blank">Ver</a></td>
        `;
        tbody.appendChild(tr);
      });
    }

    // handlers
    btnCargar.addEventListener('click', ()=> renderTabla(clientes));
    btnVaciar.addEventListener('click', ()=> renderTabla([]));

    function openModal(){
      alert('Ancho ventana: '+ window.innerWidth + 'px');
      overlay.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    }
    function hideModal(){
      overlay.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
      formModal.reset();
    }

    btnForm.addEventListener('click', openModal);
    closeModal.addEventListener('click', hideModal);
    overlay.addEventListener('click', e => {
      if(e.target === overlay) hideModal();
    });

    formModal.addEventListener('submit', e => {
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
        alert('Completar campos obligatorios');
        return;
      }
      clientes.push(nuevo);        // solo en memoria
      renderTabla(clientes);       // refrescar tabla
      hideModal();
      alert('Cliente agregado correctamente (memoria). Si querés persistir, actualizar el JSON manualmente o implementar backend.');
    });

    // Inicial: tabla vacía (según consigna)
    renderTabla([]);
})();