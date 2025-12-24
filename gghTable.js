(function () {
    let template = document.createElement("template");
    template.innerHTML = `
		<style>
        :host {
			display: block;
		} 
        table {
            border-collapse: collapse;
            font-family: Inter, sans-serif;
            font-size: 0.8em;
            width: 100%;
        }

        thead tr {
            color: #ffffff;
            text-align: left;
            background-color: #535353;
            position: sticky;
            top: 0;
        }

        th,
        td {
            font-weight: normal;
            padding: 6px 12px;
            border: 1px solid #ccc;
            padding: 8px;
        }

        tbody tr:nth-child(even) {
            background-color: #f3f3f3;
        }

        tbody {
            max-height: 300px;
            overflow-y: auto;
        }
		</style>
        <table>
            <thead></thead>
            <tbody></tbody>
        </table> 
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

            if (changedProperties.header && changedProperties.alignmentHeader) {
                this._setHeader(changedProperties.header, changedProperties.alignmentHeader);
            }

            if (changedProperties.data && changedProperties.alignmentData) {
                this._setData(changedProperties.data, changedProperties.alignmentData);
            }

        }

        /**
         * Configura los encabezados de la tabla. Elimina encabezados existentes si los hay.
         * @param {string[]} header - Una lista de encabezados
         * @param {string[]} alignments - Arreglo con las alineaciones para cada columna
         */
        _setHeader(header, alignments) {

            const headerCells = header.map((headerText, index) => {
                const th = document.createElement('th');
                th.textContent = headerText;
                const style = "text-align: " + alignments[index] + ";";
                th.setAttribute('style', style);
                return th;
            });

            const headerRow = document.createElement('tr');
            headerRow.append(...headerCells);

            const thead = this.shadowRoot.querySelector('thead');
            thead.innerHTML = ''; // Limpiar thead para evitar duplicados
            thead.append(headerRow);
        }

        /**
         * Configura los datos de la tabla. Elimina los datos existentes si los hay.
         * @param {string[][]} data - Matriz con los datos para llenar la tabla
         * @param {string[]} alignments - Arreglo con las alineaciones para cada columna
         */
        _setData(data, alignments) {

            const rows = data.map(rowData => {
                const row = document.createElement('tr');
                const cells = rowData.map((cellData, index) => {
                    const cell = document.createElement('td');
                    cell.textContent = cellData;

                    // Aplicar el estilo desde alignments
                    const style = "text-align: " + alignments[index] + ";";
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
