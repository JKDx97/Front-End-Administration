import { Component } from '@angular/core';
import { PedidosService } from '../pedidos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent {
  pedidos: any[] = [];
  filteredPedidos: any[] = [];
  selectedPedido: any = {};
  searchTerm: string = '';
  sortAscending: boolean = false;
  page = 1;
  pageSize = 6;
  selectedFile: File | null = null;

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.getAllPeidos();
  }

  /** Obtiene todas las PCs del servicio */
  getAllPeidos() {
    this.pedidosService.getAllPedidos().subscribe((data: any) => {
      this.pedidos = data;
      this.filteredPedidos = [...this.pedidos];
      this.filterPcs();
    });
  }

  /** Filtra las PCs por término de búsqueda y marcas seleccionadas */
  filterPcs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPedidos = this.pedidos.filter((p) => {
      const matchNombre = p.dni.toLowerCase().includes(term);
      return matchNombre;
    });
    this.page = 1;
  }


  /** Retorna las PCs paginadas */
  get paginatedPedidos() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPedidos.slice(start, end);
  }

  /** Calcula el número total de páginas */
  totalPages() {
    return Math.ceil(this.filteredPedidos.length / this.pageSize);
  }

  /** Cambia de página */
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page = newPage;
    }
  }
}
