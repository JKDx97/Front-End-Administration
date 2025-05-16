import { Component } from '@angular/core';
import { ConsolasService } from '../consolas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { defaultStockConsola } from '../models/stock-consola';
import { ProveedoresService } from '../proveedores.service';
import { StockConsolaService } from '../stock-consola.service';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-stock-consolas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-consolas.component.html',
  styleUrl: './stock-consolas.component.css',
})
export class StockConsolasComponent {
  searchTerm: string = '';
  modalSearchTerm: string = '';
  proveedorSearchTerm: string = ''; // Nuevo término para proveedor
  filteredConsolas: any[] = [];
  modalFilteredConsolas: any[] = [];
  filteredProveedores: any[] = []; // Lista para proveedor
  selectedMarcas: string[] = [];
  consola: any[] = [];
  proveedor: any[] = [];
  page = 1;
  pageSize = 6;
  newStock = { ...defaultStockConsola };
  hisConsola : any[] = []

  constructor(
    private consolaService: ConsolasService,
    private proveedorService: ProveedoresService,
    private stockConsolaService: StockConsolaService
  ) {}

  ngOnInit(): void {
    this.getAllConsolas();
    this.getProveedor();
    this.getHistorialConsolas()
  }
  exportToExcel() {
    const data = this.consola.map((consola: any) => ({
      Nombre: consola.nombre,
      Stock: consola.stock,
      Disponibilidad: this.getDisponibilidadText(consola.stock),
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Consolas');

    // Agregar columnas
    worksheet.columns = [
      { header: 'Nombre', key: 'Nombre', width: 25 },
      { header: 'Stock', key: 'Stock', width: 15 },
      { header: 'Disponibilidad', key: 'Disponibilidad', width: 20 },
    ];

    // Agregar filas
    data.forEach((item) => {
      worksheet.addRow(item);
    });

    // Aplicar estilo de tabla
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (rowNumber === 1) {
          // Cabecera
          cell.font = { bold: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFCC' }, // amarillo claro
          };
          cell.alignment = { horizontal: 'center' };
        }
      });
    });

    // Crear buffer y guardar archivo
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, 'reporte_consolas.xlsx');
    });
  }
  getHistorialConsolas(){
    this.stockConsolaService.getAllStock().subscribe(
      (data)=>{
        this.hisConsola = data
      }
    )
  }
  getAllConsolas() {
    this.consolaService.getAllConsolas().subscribe((data: any) => {
      this.consola = data;
      this.filteredConsolas = [...this.consola];
      this.modalFilteredConsolas = [...this.consola];
    });
  }

  getProveedor() {
    this.proveedorService.getAllProveedores().subscribe((data: any) => {
      this.proveedor = data;
      this.filteredProveedores = [...this.proveedor];
    });
  }

  addStockConsola() {
    this.stockConsolaService.addStock(this.newStock).subscribe(() => {
      this.newStock = { ...defaultStockConsola };
      this.modalSearchTerm = '';
      this.modalFilteredConsolas = [...this.consola];
      this.proveedorSearchTerm = '';
      this.filteredProveedores = [...this.proveedor];
    });
  }

  filterConsolas() {
    const term = this.searchTerm.toLowerCase();
    this.filteredConsolas = this.consola.filter((c) => {
      const matchNombre = c.nombre.toLowerCase().includes(term);
      const matchMarca =
        this.selectedMarcas.length === 0 ||
        this.selectedMarcas.includes(c.marca);
      return matchNombre && matchMarca;
    });
    this.page = 1;
  }

  filterConsolasInModal() {
    const term = this.modalSearchTerm.toLowerCase();
    this.modalFilteredConsolas = this.consola.filter((c) =>
      c.nombre.toLowerCase().includes(term)
    );
  }

  filterProveedores() {
    const term = this.proveedorSearchTerm.toLowerCase();
    this.filteredProveedores = this.proveedor.filter((p) =>
      p.nombre.toLowerCase().includes(term)
    );
  }

  selectConsola(consola: any) {
    this.newStock.consola_id = consola.id;
    this.modalSearchTerm = consola.nombre;
    this.modalFilteredConsolas = [];
  }

  selectProveedor(proveedor: any) {
    this.newStock.proveedor_id = proveedor.id;
    this.proveedorSearchTerm = proveedor.nombre;
    this.filteredProveedores = [];
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page = newPage;
    }
  }

  totalPages() {
    return Math.ceil(this.filteredConsolas.length / this.pageSize);
  }

  get paginatedConsolas() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredConsolas.slice(start, end);
  }

  getDisponibilidadText(stock: number): string {
    if (stock >= 10) return 'Alta';
    if (stock >= 5) return 'Media';
    if (stock >= 1) return 'Baja';
    return 'No disponible';
  }

  getDisponibilidadClass(stock: number): string {
    if (stock >= 10) return 'text-success';
    if (stock >= 5) return 'text-warning';
    if (stock >= 1) return 'text-danger';
    return 'text-secondary';
  }
}
