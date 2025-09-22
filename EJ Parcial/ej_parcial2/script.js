(() => {
  const $ = id => document.getElementById(id);
  const tbody = $('tbody');
  const tfootInfo = $('tfootInfo');
  const btnCargar = $('btnCargar');
  const btnVaciar = $('btnVaciar');

  let clientes = [];
  let ivaMap = new Map();

  async function loadJSON(path){
    const res = await fetch(path, {cache:'no-store'});
    if(!res.ok) throw new Error('Error cargando '+path);
    return res.json();
  }

  async function prepare(){
    try{
      const iva = await loadJSON('iva.json');
      iva.forEach(i => ivaMap.set(i.Codigo, i));
      clientes = await loadJSON('clientes.json');
      tfootInfo.textContent = '${clientes.length} clientes en JSON originalmente. Presione "Cargar datos".';
    }catch(e){
      console.error(e);
      tfootInfo.textContent = 'Error al cargar JSON. Usar servidor local (XAMPP).';
    }
  }

  function renderRows(list){
    tbody.innerHTML = '';
    if(!list.length){
      tfootInfo.textContent = 'Tabla vacía';
      return;
    }
    list.forEach(c => {
      const iva = ivaMap.get(c.CondicionIVA);
      const ivaLabel = iva ? '${iva.Descripcion} (${iva.Porcentaje}%)' : c.CondicionIVA;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.CodCliente}</td>
        <td title="${c.RazonSocial}">${c.RazonSocial}</td>
        <td>${c.CUIT}</td>
        <td>${ivaLabel}</td>
        <td>${c.FechaInicio}</td>
        <td style="text-align:right">${Number(c.SaldoCuentaCorriente).toLocaleString('es-AR',{style:'currency',currency:'ARS'})}</td>
        <td><a href="${c.UltimoBalance}" target="_blank">Ver</a></td>
      `;
      tbody.appendChild(tr);
    });
    tfootInfo.textContent = '${list.length} registros mostrados';
  }

  btnCargar.addEventListener('click', ()=> renderRows(clientes));
  btnVaciar.addEventListener('click', ()=> renderRows([]));

  // inicial
  prepare();
})();