import { Component } from '@angular/core';
import { defaultStockLaptop } from '../models/stock-laptop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaptopsService } from '../laptops.service';
import { ProveedoresService } from '../proveedores.service';
import { StockLaptopService } from '../stock-laptop.service';

@Component({
  selector: 'app-stock-laptop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-laptop.component.html',
  styleUrl: './stock-laptop.component.css',
})
export class StockLaptopComponent {
  searchTerm: string = '';
  modalSearchTerm: string = '';
  proveedorSearchTerm: string = ''; // Nuevo término para proveedor
  filteredLaptops: any[] = [];
  modalFilteredLaptops: any[] = [];
  filteredProveedores: any[] = []; // Lista para proveedor
  selectedMarcas: string[] = [];
  laptop: any[] = [];
  proveedor: any[] = [];
  page = 1;
  pageSize = 6;
  newStock = { ...defaultStockLaptop };
  hisLaptop : any[] = []

  constructor(
    private laptopService: LaptopsService,
    private proveedorService: ProveedoresService,
    private stockLaptopService: StockLaptopService
  ) {}

  ngOnInit(): void {
    this.getAllConsolas();
    this.getProveedor();
    this.getLaptopHistorial()
  }


   getLaptopHistorial(){
    this.stockLaptopService.getAllStock().subscribe(
      (data)=>{
        this.hisLaptop = data
      }
    )
  }
  getAllConsolas() {
    this.laptopService.getLaptops().subscribe((data: any) => {
      this.laptop = data;
      this.filteredLaptops = [...this.laptop];
      this.modalFilteredLaptops = [...this.laptop];
    });
  }

  getProveedor() {
    this.proveedorService.getAllProveedores().subscribe((data: any) => {
      this.proveedor = data;
      this.filteredProveedores = [...this.proveedor];
    });
  }
  get paginatedLaptops() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredLaptops.slice(start, end);
  }
  addStockLaptop() {
    this.stockLaptopService.addStock(this.newStock).subscribe(() => {
      this.newStock = { ...defaultStockLaptop };
      this.modalSearchTerm = '';
      this.modalFilteredLaptops = [...this.laptop];
      this.proveedorSearchTerm = '';
      this.filteredProveedores = [...this.proveedor];
    });
  }
  filterLaptop() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLaptops = this.laptop.filter((l) => {
      const matchNombre = l.marca.toLowerCase().includes(term);
      const matchMarca =
        this.selectedMarcas.length === 0 ||
        this.selectedMarcas.includes(l.marca);
      return matchNombre && matchMarca;
    });
    this.page = 1;
  }
  filterlaptopModal() {
    const term = this.modalSearchTerm.toLowerCase();
    this.modalFilteredLaptops = this.laptop.filter((l) =>
      l.marca.toLowerCase().includes(term)
    );
  }

  filterProveedores() {
    const term = this.proveedorSearchTerm.toLowerCase();
    this.filteredProveedores = this.proveedor.filter((p) =>
      p.nombre.toLowerCase().includes(term)
    );
  }

  selectLaptop(laptop: any) {
    this.newStock.laptop_id = laptop.id;
    this.modalSearchTerm = laptop.marca;
    this.modalFilteredLaptops = [];
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
    return Math.ceil(this.filteredLaptops.length / this.pageSize);
  }

  get paginatedLaptop() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredLaptops.slice(start, end);
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
