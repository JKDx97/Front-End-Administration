import { Component } from '@angular/core';
import { defaultStockPc } from '../models/stock-pc';
import { pcsService } from '../pcs.service';
import { ProveedoresService } from '../proveedores.service';
import { StockPcsService } from '../stock-pcs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-pcs',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './stock-pcs.component.html',
  styleUrl: './stock-pcs.component.css',
})
export class StockPcsComponent {
  searchTerm: string = '';
  modalSearchTerm: string = '';
  proveedorSearchTerm: string = ''; // Nuevo término para proveedor
  filteredPc: any[] = [];
  modalFilteredPc: any[] = [];
  filteredProveedores: any[] = []; // Lista para proveedor
  selectedMarcas: string[] = [];
  pc: any[] = [];
  proveedor: any[] = [];
  page = 1;
  pageSize = 6;
  newStock = { ...defaultStockPc };
  hisPc : any[] = []

  constructor(
    private pcService: pcsService,
    private proveedorService: ProveedoresService,
    private stockPcService: StockPcsService
  ) {}

  ngOnInit(): void {
    this.getAllPc();
    this.getProveedor();
    this.getPcHistorial()
  }

   getPcHistorial(){
    this.stockPcService.getAllStock().subscribe(
      (data)=>{
        this.hisPc = data
      }
    )
  }

  getAllPc() {
    this.pcService.getPcs().subscribe((data: any) => {
      this.pc = data;
      this.filteredPc = [...this.pc];
      this.modalFilteredPc = [...this.pc];
    });
  }

  getProveedor() {
    this.proveedorService.getAllProveedores().subscribe((data: any) => {
      this.proveedor = data;
      this.filteredProveedores = [...this.proveedor];
    });
  }

  addStockPc() {
    this.stockPcService.addStock(this.newStock).subscribe(() => {
      this.newStock = { ...defaultStockPc };
      this.modalSearchTerm = '';
      this.modalFilteredPc = [...this.pc];
      this.proveedorSearchTerm = '';
      this.filteredProveedores = [...this.proveedor];
    });
  }

  filterPc() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPc = this.pc.filter((p) => {
      const matchNombre = p.nombre.toLowerCase().includes(term);
      const matchMarca =
        this.selectedMarcas.length === 0 ||
        this.selectedMarcas.includes(p.marca);
      return matchNombre && matchMarca;
    });
    this.page = 1;
  }

  filterPcInModal() {
    const term = this.modalSearchTerm.toLowerCase();
    this.modalFilteredPc = this.pc.filter((p) =>
      p.nombre.toLowerCase().includes(term)
    );
  }

  filterProveedores() {
    const term = this.proveedorSearchTerm.toLowerCase();
    this.filteredProveedores = this.proveedor.filter((p) =>
      p.nombre.toLowerCase().includes(term)
    );
  }

  selectConsola(pc: any) {
    this.newStock.pc_id = pc.id;
    this.modalSearchTerm = pc.nombre;
    this.modalFilteredPc = [];
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
    return Math.ceil(this.filteredPc.length / this.pageSize);
  }

  get paginatedPc() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPc.slice(start, end);
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
