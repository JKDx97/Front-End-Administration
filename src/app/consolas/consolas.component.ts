import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConsolasService } from '../consolas.service';
import { defaultConsola } from '../models/consola';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-consolas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './consolas.component.html',
  styleUrl: './consolas.component.css',
})
export class ConsolasComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  searchTerm: string = '';
  filteredConsolas: any[] = [];
  sortAscending: boolean = false;
  marcas: string[] = ['Sony', 'Valve', 'Nintendo', 'Microsoft'];
  selectedMarcas: string[] = [];
  consola: any[] = [];
  newConsola = { ...defaultConsola };
  selectedConsola: any = {};
  page = 1;
  pageSize = 6;

  constructor(private consolaService: ConsolasService) {}

  ngOnInit(): void {
    this.getAllConsolas();
  }

  /** Obtiene todas las consolas y sus imágenes */
  getAllConsolas() {
    this.consolaService.getAllConsolas().subscribe((data: any) => {
      this.consola = data;
      this.filteredConsolas = [...this.consola];
      this.filterConsolas();
      this.consola.forEach((consola) => {
        this.getImagesConsola(consola);
      });
    });
  }

  /** Obtiene imágenes de una consola específica */
  getImagesConsola(consola: any) {
    if (!consola || !consola.id_consola) {
      console.error('Consola inválida:', consola);
      return;
    }

    this.consolaService.getImagesConsola(consola.id_consola).subscribe(
      (data: any) => {
        consola.images = data;
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }

  /** Crea una nueva consola */
  createConsola() {
    this.consolaService.createConsola(this.newConsola).subscribe({
      next: () => this.getAllConsolas(),
    });
  }

  /** Actualiza una consola seleccionada */
  updateConsola() {
    if (this.selectedConsola) {
      this.consolaService
        .updateConsola(this.selectedConsola.id, this.selectedConsola)
        .subscribe(
          () => this.getAllConsolas()
        );
    }
  }

  /** Activa o desactiva el estado de la consola */
  OnConsolaToogle(event: any, consola: any) {
    const isChecked = event.target.checked;
    consola.estado = isChecked ? 1 : 0;
    const previousState = consola.estado;

    this.consolaService
      .toggleConsolaState(consola.id, consola.estado).subscribe({
        error: () => {
          consola.estado = previousState;
        },
      })
  }

  /** Elimina una consola por ID */
  deleteLaptop(id_laptop: any) {
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
        this.consolaService.deleteConsola(id_laptop).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La consola ha sido eliminada.', 'success');
            this.getAllConsolas();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la consola.', 'error');
          },
        });
      }
    });
  }

  /** Ordena las consolas por precio */
  sortByPrecio() {
    if (this.sortAscending) {
      this.filteredConsolas.sort((a, b) => a.precio - b.precio);
    } else {
      this.filteredConsolas.sort((a, b) => b.precio - a.precio);
    }
    this.sortAscending = !this.sortAscending;
  }

  /** Filtra las consolas por nombre y marca */
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

  /** Cambia de página en la paginación */
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page = newPage;
    }
  }

  /** Devuelve el número total de páginas */
  totalPages() {
    return Math.ceil(this.filteredConsolas.length / this.pageSize);
  }

  /** Devuelve las consolas de la página actual */
  get paginatedConsolas() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredConsolas.slice(start, end);
  }

  /** Maneja el cambio de marcas seleccionadas */
  onMarcaToggle(marca: string, event: any) {
    if (event.target.checked) {
      this.selectedMarcas.push(marca);
    } else {
      this.selectedMarcas = this.selectedMarcas.filter((m) => m !== marca);
    }
    this.filterConsolas();
  }

  /** Abre el modal de detalles de consola */
  openModal(consola: any) {
    this.selectedConsola = consola;
    const modal = new bootstrap.Modal(
      document.getElementById('consolaDetallesModal')
    );
    modal.show();
  }

  /** Abre el modal de edición de consola */
  openModalEdit(consola: any) {
    this.selectedConsola = { ...consola };
    const modal = new bootstrap.Modal(
      document.getElementById('editConsolaModal')
    );
    modal.show();
  }

  /** Maneja la selección de archivo de imagen */
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

  /** Sube una imagen asociada a una consola */
  uploadImage(id_consola: any) {
    if (!this.selectedFile || !id_consola){
      alert('Seleccione una imagen')
      return;
    }
    this.consolaService.uploadImag(this.selectedFile, id_consola).subscribe(
      () => this.getAllConsolas()
    );
  }
}
