(function () {
    let template = document.createElement("template");
    template.innerHTML = `
		<style>
      /* Contenedor de tabla */
:host {
    display: block;
    font-family: "72-Web", "SAP72", Arial, Helvetica, sans-serif;

}

.table-container {
    max-height: 300px;
    /* Altura máxima para el área desplazable */
    overflow-y: auto;
    /* Activar desplazamiento vertical */
    border: 1px solid #ccc;
    /* Opcional: añadir un borde */
}

/* Estilo de la tabla */
table {
    border-collapse: separate;
    border-spacing: 0;
    font-family: "72-Web", "SAP72", Arial, Helvetica, sans-serif;
    font-size: 0.8em;
    width: 100%;

}

/* Celdas generales */
th {
    font-weight: normal;
    border: 1px solid #ccc;

}

td {
    font-weight: normal;
    border: 1px solid #ccc;
    padding: 4px;
    color: #58595b;

}

/* Filas pares del cuerpo con color de fondo */
tbody tr:nth-child(even) {
    background-color: #f1f1f1;

}

/* Cabecera: estilo base + sticky para TODAS las celdas de thead */
table thead th {
    position: sticky;
    z-index: 2;
    background-color: #58595b;
    /* fondo de la cabecera */
}

/* Primera fila del thead (títulos) */
table thead tr:nth-child(1) th {
    top: 2px;
    height: 32px;
    /* altura fija de la primera fila */
    line-height: 32px;
    /* opcional: centra texto verticalmente */
    color: #ffffff;
}

/* Segunda fila del thead (totales) */
table thead tr:nth-child(2) th {
    top: 37px;
    /* igual a la altura de la primera fila + padding!!!*/
    padding: 4px;
    background-color: #ffffff;
    /* totales en blanco para distinguirlos */
    font-weight: bold;
    text-align: right;
    border-bottom: 1px solid #3b6f9a;
    color: #58595b;
}
		</style>
        <div class="table-container">
            <table>
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>
	`;

    class GghTabla extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(template.content.cloneNode(true));
            // this._props = {};
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            // this._props = { ...this._props, ...changedProperties };
        }

        onCustomWidgetAfterUpdate(changedProperties) {

            if (changedProperties.openOpps_CRM_A010 && changedProperties.alignmentHeader && changedProperties.alignmentData && changedProperties.totals && changedProperties.hyper) {
                this._setTableElements(changedProperties.openOpps_CRM_A010, changedProperties.alignmentHeader, changedProperties.alignmentData, changedProperties.totals, changedProperties.hyper);
            }
        }

        /**
           * Calcula los totales para las columnas especificadas.
        * @param {Object JSON} data - Array de objetos que representan las filas de la tabla.
        * @param {Array} totals - Array de claves para las cuales se deben calcular totales.
        * @returns {Array} - Array de elementos <th> con los totales calculados.
           */
        _calculateTotals(data, totals) {

            const _sum = totals.map(totalKey => {
                let darFormato = data.reduce((acc, curr) => {
                    return acc + parseInt(curr[totalKey]);
                }, 0);
                return {
                    key: totalKey,
                    value: darFormato.toLocaleString('de-DE')
                };
            });

            // <th class='totals'>Total:</th> para Name column 
            // <th class='totals'></th> para todas las demas columnas excepto las de totalKey
            const columnKeys = Object.keys(data[0]);
            const HeaderCells2 = columnKeys.map((colKey, index) => {
                if (index === 0) {
                    const th = document.createElement('th');
                    th.textContent = "Total:";
                    // th.classList.add('totals');
                    return th;
                }
                if (totals.includes(colKey)) {
                    const th = document.createElement('th');
                    th.textContent = _sum[totals.indexOf(colKey)].value;
                    // th.classList.add('totals');
                    return th;
                } else {
                    const th = document.createElement('th');
                    th.textContent = "";
                    // th.classList.add('totals');
                    return th;
                }
            });
            return HeaderCells2;
        }


        /**
           * Configura los encabezados de la tabla. Elimina encabezados existentes si los hay.
        * @param {Object JSON} selectionTable - Array de objetos que representan las filas de la tabla.
        * @param {Array} alignmentsHeader - Array de alineaciones para los encabezados.
        * @param {Array} alignmentsData - Array de alineaciones para los datos.
        * @param {Array} totals - Array de claves para las cuales se deben calcular totales.
        * @param {Array} hyper - Array de claves que deben ser hipervínculos.
        */
        _setTableElements(selectionTable, alignmentsHeader, alignmentsData, totals, hyper) {

            const header = Object.keys(selectionTable[0]);

            const headerCells = header.map((headerText, index) => {
                const th = document.createElement('th');
                th.textContent = headerText;
                const style = "text-align: " + alignmentsHeader[index] + ";";
                th.setAttribute('style', style);
                return th;
            });

            const headerRow = document.createElement('tr');
            headerRow.append(...headerCells);

            const headerRow2 = document.createElement('tr');
            headerRow2.append(...this._calculateTotals(selectionTable, totals));

            const thead = this.shadowRoot.querySelector('thead');
            thead.innerHTML = '';
            thead.append(headerRow);
            thead.append(headerRow2);

            const data = selectionTable.map(obj => Object.values(obj));

            const rows = data.map(rowData => {
                const row = document.createElement('tr');
                const cells = rowData.map((cellData, index) => {
                    const cell = document.createElement('td');
                    if (totals.includes(header[index])) { // si está en totals, formatear como número
                        cell.textContent = parseInt(cellData).toLocaleString('de-DE');
                    } else if (hyper.includes(header[index])) { // si está en hyper, crear enlace
                        const a = document.createElement('a');
                        a.textContent = cellData;
                        const c4cUrl = "https://my334772-sso.crm.ondemand.com/sap/ap/ui/clogin?bo_ns=http://sap.com/thingTypes&bo=COD_GENERIC&node=Root&operation=OnExtInspect&param.InternalID=" + cellData + "&param.Type=COD_OPPORTUNITY_THINGTYPE&sapbyd-agent=TAB&OBNRedirect=X";
                        a.href = c4cUrl;
                        a.target = "_blank"; // Abrir en una nueva pestaña
                        a.rel = "noopener noreferrer"; // Seguridad
                        cell.appendChild(a);
                    } else {
                        cell.textContent = cellData;
                    }

                    // Aplicar el estilo desde alignments
                    const style = "text-align: " + alignmentsData[index] + ";";
                    cell.setAttribute('style', style);

                    return cell;
                });
                row.append(...cells);
                return row;
            });

            const tbody = this.shadowRoot.querySelector('tbody');
            tbody.innerHTML = ''; // Limpiar tbody para evitar duplicados
            tbody.append(...rows);

        }
    }

    customElements.define("com-sample-tabla", GghTabla);
})();
