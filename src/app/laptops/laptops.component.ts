import { Component, Input, OnInit } from '@angular/core';
import { LaptopsService } from '../laptops.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { defaultLaptop } from '../models/laptop';
declare var bootstrap: any;
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-laptops',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './laptops.component.html',
  styleUrl: './laptops.component.css',
})
export class LaptopsComponent implements OnInit {
  imagePreview: string | ArrayBuffer | null = null;
  laptops: any[] = [];
  images: any[] = [];
  selectedLaptop: any = {};
  newLaptop = { ...defaultLaptop };
  page = 1;
  pageSize = 6;
  searchTerm: string = '';
  filteredLaptops: any[] = [];
  sortAscending: boolean = false;
  marcas: string[] = ['Asus', 'Dell', 'HP', 'Apple', 'Lenovo'];
  selectedMarcas: string[] = [];
  selectedFile: File | null = null;

  constructor(private laptopsService: LaptopsService) {}

  ngOnInit(): void {
    this.allLaptops();
  }

  // Obtiene todas las laptops y sus imágenes al iniciar el componente
  allLaptops() {
    this.laptopsService.getLaptops().subscribe((data: any) => {
      this.laptops = data;
      this.filteredLaptops = data;
      this.filterLaptops();
      this.laptops.forEach((laptop) => {
        this.getImagesLaptops(laptop);
      });
    });
  }

  // Ordena las laptops por precio, alternando ascendente/descendente
  sortByPrecio() {
    if (this.sortAscending) {
      this.filteredLaptops.sort((a, b) => a.precio - b.precio);
    } else {
      this.filteredLaptops.sort((a, b) => b.precio - a.precio);
    }
    this.sortAscending = !this.sortAscending;
    this.page = 1;
  }

  // Maneja la selección/deselección de marcas para filtrar laptops
  onMarcaToggle(marca: string, event: any) {
    if (event.target.checked) {
      this.selectedMarcas.push(marca);
    } else {
      this.selectedMarcas = this.selectedMarcas.filter((m) => m !== marca);
    }
    this.filterLaptops();
  }

  // Devuelve las laptops paginadas según la página actual
  get paginatedLaptops() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredLaptops.slice(start, end);
  }

  // Filtra laptops por término de búsqueda y marcas seleccionadas
  filterLaptops() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLaptops = this.laptops.filter((laptop) => {
      const matchNombre = laptop.modelo.toLowerCase().includes(term);
      const matchMarca =
        this.selectedMarcas.length === 0 ||
        this.selectedMarcas.includes(laptop.marca);
      return matchNombre && matchMarca;
    });
    this.page = 1;
  }

  // Calcula el total de páginas basado en la cantidad de laptops filtradas
  totalPages() {
    return Math.ceil(this.filteredLaptops.length / this.pageSize);
  }

  // Cambia a una página específica si está dentro del rango válido
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.page = newPage;
    }
  }

  // Obtiene las imágenes de una laptop específica
  getImagesLaptops(laptop: any) {
    if (!laptop || !laptop.id) {
      return;
    }
    this.laptopsService.getImagesLaptops(laptop.id).subscribe((data: any) => {
      laptop.images = data;
    });
  }

  // Crea una nueva laptop usando los datos del formulario
  createLaptop() {
    this.laptopsService.createLaptops(this.newLaptop).subscribe({
      next: () => {
        this.allLaptops();
      },
    });
  }

  // Abre el modal para mostrar detalles de la laptop seleccionada
  openModal(laptop: any) {
    this.selectedLaptop = laptop;
    if (this.selectedLaptop.fecha_lanzamiento) {
      this.selectedLaptop.fecha_lanzamiento = this.formatDate(
        this.selectedLaptop.fecha_lanzamiento
      );
    }
    const modal = new bootstrap.Modal(document.getElementById('laptopModal'));
    modal.show();
  }

  // Abre el modal para editar una laptop seleccionada
  openModalEdit(laptop: any) {
    this.selectedLaptop = { ...laptop };
    if (this.selectedLaptop.fecha_lanzamiento) {
      this.selectedLaptop.fecha_lanzamiento = this.formatDate(
        this.selectedLaptop.fecha_lanzamiento
      );
    }
    const modal = new bootstrap.Modal(
      document.getElementById('editLaptopModal')
    );
    modal.show();
  }

  // Actualiza los datos de la laptop editada
  updateLaptop() {
    if (this.selectedLaptop) {
      this.laptopsService
        .updateLaptop(this.selectedLaptop.id, this.selectedLaptop)
        .subscribe(() => {
          this.allLaptops();
        });
    }
  }

  // Activa o desactiva el estado de una laptop (habilitada/deshabilitada)
  onLaptopToggle(event: any, laptop: any) {
    const isChecked = event.target.checked;
    const previousState = laptop.estado;
    laptop.estado = isChecked ? 1 : 0;
    this.laptopsService.toggleLaptop(laptop.id, laptop.estado).subscribe({
      error: () => {
        laptop.estado = previousState;
      },
    });
  }

  // Elimina una laptop después de confirmar en un cuadro de diálogo
  deleteLaptop(id: any) {
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
        this.laptopsService.deleteLaptop(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La laptop ha sido eliminada.', 'success');
            this.allLaptops();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la laptop.', 'error');
          },
        });
      }
    });
  }

  // Maneja la selección de archivo para subir una imagen
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

  // Sube una imagen para una laptop específica
  uploadImage(id_laptop: any) {
    if (!this.selectedFile) {
      alert('Selecciona una imagen primero.');
      return;
    }
    this.laptopsService.uploadImag(this.selectedFile, id_laptop).subscribe(()=>{
      this.allLaptops()
    });
  }
  

  // Formatea una fecha en formato YYYY-MM-DD
  formatDate(date: any): string {
    if (!date) return '';
    let fecha = new Date(date);
    if (isNaN(fecha.getTime())) {
      return '';
    }
    return fecha.toISOString().split('T')[0];
  }
}
