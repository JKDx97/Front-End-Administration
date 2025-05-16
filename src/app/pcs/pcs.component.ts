import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { pcsService } from '../pcs.service';
import { defaultPc } from '../models/pcs';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

declare var bootstrap: any; // Necesario para controlar el modal de Bootstrap

@Component({
  selector: 'app-pcs',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './pcs.component.html',
  styleUrl: './pcs.component.css',
})
export class PcsComponent implements OnInit {
  pcs: any[] = [];
  filteredPcs: any[] = [];
  selectedPc: any = {};
  newPc = { ...defaultPc };
  imagePreview: string | ArrayBuffer | null = null;
  searchTerm: string = '';
  sortAscending: boolean = false;
  marcas: string[] = ['Asus', 'Dell', 'HP', 'Apple', 'Lenovo'];
  selectedMarcas: string[] = [];
  page = 1;
  pageSize = 6;
  selectedFile: File | null = null;

  constructor(private pcService: pcsService) {}

  ngOnInit(): void {
    this.getAllPcs();
  }

  /** Obtiene todas las PCs del servicio */
  getAllPcs() {
    this.pcService.getPcs().subscribe((data: any) => {
      this.pcs = data;
      this.pcs.forEach((pc) => this.getImagesPcs(pc));
      this.filteredPcs = [...this.pcs];
      this.filterPcs();
    });
  }

  /** Filtra las PCs por término de búsqueda y marcas seleccionadas */
  filterPcs() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPcs = this.pcs.filter((c) => {
      const matchNombre = c.nombre.toLowerCase().includes(term);
      const matchMarca =
        this.selectedMarcas.length === 0 || this.selectedMarcas.includes(c.marca);
      return matchNombre && matchMarca;
    });
    this.page = 1;
  }

  /** Maneja selección/deselección de marcas */
  onMarcaToggle(marca: string, event: any) {
    if (event.target.checked) {
      this.selectedMarcas.push(marca);
    } else {
      this.selectedMarcas = this.selectedMarcas.filter((m) => m !== marca);
    }
    this.filterPcs();
  }

  /** Retorna las PCs paginadas */
  get paginatedConsolas() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredPcs.slice(start, end);
  }

  /** Calcula el número total de páginas */
  totalPages() {
    return Math.ceil(this.filteredPcs.length / this.pageSize);
  }

  /** Cambia de página */
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page = newPage;
    }
  }

  /** Obtiene las imágenes de una PC específica */
  getImagesPcs(pc: any) {
    if (!pc || !pc.id_pc) {
      return;
    }
    this.pcService.getImagesPcs(pc.id_pc).subscribe((data: any) => {
      pc.images = data;
    });
  }

  /** Crea una nueva PC */
  createPc() {
    this.pcService.createPcs(this.newPc).subscribe({
      next: () => this.getAllPcs(),
    });
  }

  /** Abre el modal de detalle de PC */
  openModal(pc: any) {
    this.selectedPc = pc;
    const modal = new bootstrap.Modal(document.getElementById('pcModalD'));
    modal.show();
  }

  /** Abre el modal de edición de PC */
  openModalEdit(pc: any) {
    this.selectedPc = { ...pc };
    const modal = new bootstrap.Modal(document.getElementById('editPcModal'));
    modal.show();
  }

  /** Actualiza la información de una PC */
  updatePc() {
    if (this.selectedPc) {
      this.pcService.updatePcs(this.selectedPc.id, this.selectedPc).subscribe(() => {
        this.getAllPcs();
      });
    }
  }

  /** Elimina una PC con confirmación */
  deletePc(id_pc: any) {
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
        this.pcService.deletePcs(id_pc).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La laptop ha sido eliminada.', 'success');
            this.getAllPcs();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la laptop.', 'error');
          },
        });
      }
    });
  }

   /** Ordena las consolas por precio */
   sortByPrecio() {
    if (this.sortAscending) {
      this.filteredPcs.sort((a, b) => a.precio - b.precio);
    } else {
      this.filteredPcs.sort((a, b) => b.precio - a.precio);
    }
    this.sortAscending = !this.sortAscending;
  }

  /** Activa o desactiva una PC */
  onpcToggle(event: any, pc: any) {
    const isChecked = event.target.checked;
    const previousState = pc.estado;
    pc.estado = isChecked ? 1 : 0;

    this.pcService.togglePcs(pc.id, pc.estado).subscribe({
      error: () => {
        pc.estado = previousState; // Revertir si hay error
      },
    });
  }

  /** Selecciona un archivo de imagen para subir */
  selectFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /** Sube una imagen para una PC específica */
  uploadImage(id_pc: any) {
    if (!this.selectedFile || !id_pc) {
      alert('Selecciona una imagen primero.');
      return;
    }
    this.pcService.uploadImag(this.selectedFile, id_pc).subscribe(() => {
      this.getAllPcs()
    });
  }
}
