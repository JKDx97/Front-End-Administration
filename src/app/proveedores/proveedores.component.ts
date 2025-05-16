import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../proveedores.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { defaultProveedor } from '../models/proveedor';
declare var bootstrap: any; // Necesario para controlar el modal de Bootstrap
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css',
})
export class ProveedoresComponent implements OnInit {
  proveedor: any[] = [];
  filteredProveedor: any[] = [];
  selectedProveedor: any = {};

  searchTerm: string = '';
  page = 1;
  pageSize = 6;
  newProvedor = { ...defaultProveedor };
  constructor(private proveedorService: ProveedoresService) {}

  ngOnInit(): void {
    this.getAllProveedor();
  }

  getAllProveedor() {
    this.proveedorService.getAllProveedores().subscribe((data: any) => {
      this.proveedor = data;
      this.filteredProveedor = [...this.proveedor]; // llena filtrado
    });
  }
  createProveedor() {
    this.proveedorService.createProveedor(this.newProvedor).subscribe({
      next: () => this.getAllProveedor(),
    });
  }
  openModalEdit(proveedor: any) {
    this.selectedProveedor = { ...proveedor };
    const modal = new bootstrap.Modal(
      document.getElementById('proveedorEditModal')
    );
    modal.show();
  }
  updateProveedor() {
    this.proveedorService
      .updateProveedor(this.selectedProveedor.id, this.selectedProveedor)
      .subscribe(() => {
        this.getAllProveedor();
      });
  }
  deleteProveedor(id : number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.deleteProveedor(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La laptop ha sido eliminada.', 'success');
            this.getAllProveedor();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la laptop.', 'error');
          },
        });
      }
    });
  }

  filterProveedor() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProveedor = this.proveedor.filter((p) =>
      p.nombre.toLowerCase().includes(term)
    );
    this.page = 1;
  }
  get paginatedProveeodr() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProveedor.slice(start, end);
  }
  OnProveedorToggle(event: any, proveedor: any) {
    const isChecked = event.target.checked;
    const previousState = proveedor.estado;
    proveedor.estado = isChecked ? 1 : 0;

    this.proveedorService
      .updateStateProveedor(proveedor.id, proveedor.estado)
      .subscribe({
        error: () => {
          proveedor.estado = previousState;
        },
      });
  }
  totalPages() {
    return Math.ceil(this.filteredProveedor.length / this.pageSize);
  }
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page = newPage;
    }
  }
}
